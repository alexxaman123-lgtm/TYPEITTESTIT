import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Difficulty, getRandomPassage } from "../data/texts";
import {
  computeAccuracy,
  computeFreeWordProgress,
  computePredictedWpm,
  computeWordProgress,
  computeWpmRate,
  countWordErrors,
  getLettersOnlyCount,
} from "./stats";
import { maybeSavePersonalBest } from "./storage";

export type TestStatus = "idle" | "running" | "finished";

type CustomMode = "standard" | "free";

export interface TestResult {
  wpm: number;
  wordProgress: number;
  predictedWpm: number | null;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  characterErrors: number;
  wordErrors: number;
  mistakes: number;
  totalTyped: number;
  typedText: string;
  durationSec: number;
  targetDurationSec: number;
  difficulty: Difficulty;
  isCustom: boolean;
  isNewBest: boolean;
}

const APPEND_THRESHOLD = 120;
const MAX_CUSTOM_TEXT_LENGTH = 100_000;

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, MAX_CUSTOM_TEXT_LENGTH);
}

function buildText(difficulty: Difficulty, excludeId?: string) {
  const passage = getRandomPassage(difficulty, excludeId);
  return { text: normalize(passage.text), id: passage.id };
}

export function useTypingTest(initialDifficulty: Difficulty, initialDuration: number) {
  const [difficulty, setDifficultyState] = useState<Difficulty>(initialDifficulty);
  const [duration, setDurationState] = useState<number>(initialDuration);
  const [isCustom, setIsCustom] = useState(false);
  const [customMode, setCustomMode] = useState<CustomMode>("standard");
  const [customSource, setCustomSource] = useState<string>("");

  const [lastPassageId, setLastPassageId] = useState<string | undefined>(undefined);
  const initial = useMemo(() => buildText(initialDifficulty), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [targetText, setTargetText] = useState<string>(initial.text);
  const [typed, setTyped] = useState<string>("");
  const [status, setStatus] = useState<TestStatus>("idle");
  const [result, setResult] = useState<TestResult | null>(null);
  const [tick, setTick] = useState(0);
  const [sessionId, setSessionId] = useState(0);

  // Authoritative refs: always reflect the latest typing-session state so
  // async callbacks (rAF loop, finish) cannot read a stale value.
  const startTimeRef = useRef<number | null>(null);
  const errorsRef = useRef(0);
  const finishedRef = useRef(false);

  const typedRef = useRef(typed);
  const targetTextRef = useRef(targetText);
  const isCustomRef = useRef(isCustom);
  const customModeRef = useRef(customMode);
  const difficultyRef = useRef(difficulty);
  const durationRef = useRef(duration);
  const customSourceRef = useRef(customSource);
  const lastPassageIdRef = useRef(lastPassageId);
  const statusRef = useRef(status);

  useEffect(() => { typedRef.current = typed; }, [typed]);
  useEffect(() => { targetTextRef.current = targetText; }, [targetText]);
  useEffect(() => { isCustomRef.current = isCustom; }, [isCustom]);
  useEffect(() => { customModeRef.current = customMode; }, [customMode]);
  useEffect(() => { difficultyRef.current = difficulty; }, [difficulty]);
  useEffect(() => { durationRef.current = duration; }, [duration]);
  useEffect(() => { customSourceRef.current = customSource; }, [customSource]);
  useEffect(() => { lastPassageIdRef.current = lastPassageId; }, [lastPassageId]);
  useEffect(() => { statusRef.current = status; }, [status]);

  useEffect(() => {
    setLastPassageId(initial.id);
  }, [initial.id]);

  // finish uses refs so it always reads the latest typing-session data,
  // regardless of when it is invoked (e.g. from the rAF loop).
  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    const typedValue = typedRef.current;
    const targetValue = targetTextRef.current;
    const isCustomValue = isCustomRef.current;
    const customModeValue = customModeRef.current;
    const difficultyValue = difficultyRef.current;
    const durationValue = durationRef.current;

    const elapsedMs = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
    let correct = 0;
    let incorrect = 0;

    if (isCustomValue && customModeValue === "free") {
      correct = getLettersOnlyCount(typedValue);
      incorrect = 0;
    } else {
      for (let i = 0; i < typedValue.length; i++) {
        const typedChar = typedValue[i];
        if (/\s/u.test(typedChar)) continue;
        if (typedChar === targetValue[i]) correct++;
        else incorrect++;
      }
    }

    const wordProgress = isCustomValue && customModeValue === "free"
      ? computeFreeWordProgress(typedValue)
      : computeWordProgress(targetValue, typedValue);
    // Use the same rate formula for the final value so the live and
    // final WPM are consistent and the meaning of "wpm" stays intact.
    const actualWpm = computeWpmRate(wordProgress, elapsedMs);
    const predictedWpm = computePredictedWpm(wordProgress, elapsedMs);
    const lettersTyped = getLettersOnlyCount(typedValue);
    const accuracy = isCustomValue && customModeValue === "free"
      ? (lettersTyped > 0 ? 100 : 0)
      : computeAccuracy(correct, lettersTyped);
    const wordErrors = isCustomValue && customModeValue === "free" ? 0 : countWordErrors(targetValue, typedValue);
    const durationSec = Math.round(elapsedMs / 1000);
    const isNewBest = !isCustomValue ? maybeSavePersonalBest(difficultyValue, durationValue, actualWpm, accuracy) : false;

    setResult({
      wpm: actualWpm,
      wordProgress,
      predictedWpm,
      accuracy,
      correctChars: correct,
      incorrectChars: incorrect,
      characterErrors: incorrect,
      wordErrors,
      mistakes: errorsRef.current,
      totalTyped: lettersTyped,
      typedText: typedValue,
      durationSec: durationSec || durationValue,
      targetDurationSec: durationValue,
      difficulty: difficultyValue,
      isCustom: isCustomValue,
      isNewBest,
    });
    setStatus("finished");
  }, []);

  const finishRef = useRef(finish);
  finishRef.current = finish;

  // startTimerIfNeeded only marks the start of the session. The high-frequency
  // update loop is owned by a dedicated effect so it always observes the
  // most up-to-date duration via the duration ref.
  const startTimerIfNeeded = useCallback(() => {
    if (startTimeRef.current !== null || finishedRef.current) return;
    startTimeRef.current = Date.now();
    setStatus("running");
  }, []);

  // High-frequency live update loop. Uses requestAnimationFrame so the WPM
  // can refresh at the display's native rate (~60fps) while the test is
  // running. This is the key fix for "stuck" / stair-step WPM during fast
  // typing: between keystrokes, the WPM still updates continuously because
  // elapsed time is recomputed on every frame from the latest start time.
  useEffect(() => {
    if (statusRef.current !== "running") return;
    let rafId = 0;
    const tickFn = () => {
      if (finishedRef.current) return;
      const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
      if (elapsed >= durationRef.current * 1000) {
        finishRef.current();
        return;
      }
      setTick((t) => t + 1);
      rafId = requestAnimationFrame(tickFn);
    };
    rafId = requestAnimationFrame(tickFn);
    return () => cancelAnimationFrame(rafId);
  }, [status]);

  const resetInternal = useCallback(
    (newTarget: string, nextCustomMode: CustomMode = customMode) => {
      startTimeRef.current = null;
      errorsRef.current = 0;
      finishedRef.current = false;
      setTyped("");
      setResult(null);
      setStatus("idle");
      setCustomMode(nextCustomMode);
      setTargetText(newTarget);
      setSessionId((s) => s + 1);
    },
    [customMode]
  );

  // Retry: same passage, fresh attempt.
  const retry = useCallback(() => {
    resetInternal(targetText, isCustom ? customMode : "standard");
  }, [resetInternal, targetText, isCustom, customMode]);

  // New text: different passage, same difficulty.
  const newText = useCallback(() => {
    if (isCustom) {
      if (customMode === "free") {
        resetInternal("", "free");
      } else {
        resetInternal(customSource, "standard");
      }
      return;
    }
    const next = buildText(difficulty, lastPassageId);
    setLastPassageId(next.id);
    resetInternal(next.text, "standard");
  }, [isCustom, customMode, customSource, difficulty, lastPassageId, resetInternal]);

  // Full reset back to defaults for current difficulty/duration.
  const reset = useCallback(() => {
    if (isCustom) {
      setIsCustom(false);
      setCustomSource("");
    }
    const next = buildText(difficulty, lastPassageId);
    setLastPassageId(next.id);
    resetInternal(next.text, "standard");
  }, [difficulty, isCustom, lastPassageId, resetInternal]);

  // Stop immediately and score based on progress so far.
  const stop = useCallback(() => {
    if (status === "running") {
      finish();
    }
  }, [status, finish]);

  const setDifficulty = useCallback(
    (d: Difficulty) => {
      setDifficultyState(d);
      setIsCustom(false);
      setCustomSource("");
      const next = buildText(d, lastPassageId);
      setLastPassageId(next.id);
      resetInternal(next.text, "standard");
    },
    [lastPassageId, resetInternal]
  );

  const setDuration = useCallback(
    (secs: number) => {
      setDurationState(secs);
      if (isCustom) {
        resetInternal(customMode === "free" ? "" : customSource, customMode);
      } else {
        const next = buildText(difficulty, lastPassageId);
        setLastPassageId(next.id);
        resetInternal(next.text, "standard");
      }
    },
    [resetInternal, isCustom, customMode, customSource, difficulty, lastPassageId]
  );

  const startCustomTest = useCallback(
    (text: string, secs: number) => {
      const clean = normalize(text);
      setIsCustom(true);
      setCustomMode("standard");
      setCustomSource(clean);
      setDurationState(secs);
      resetInternal(clean, "standard");
    },
    [resetInternal]
  );

  const startFreeTypingTest = useCallback(
    (secs: number) => {
      setIsCustom(true);
      setCustomMode("free");
      setCustomSource("");
      setDurationState(secs);
      resetInternal("", "free");
    },
    [resetInternal]
  );

  const exitCustom = useCallback(() => {
    setIsCustom(false);
    setCustomMode("standard");
    setCustomSource("");
    const next = buildText(difficulty, lastPassageId);
    setLastPassageId(next.id);
    resetInternal(next.text, "standard");
  }, [difficulty, lastPassageId, resetInternal]);

  // handleInputChange uses refs for every typing-session value it touches.
  // This guarantees that rapid successive keystrokes are processed against
  // the authoritative, immediately-up-to-date state, not a captured
  // snapshot from an older render.
  const handleInputChange = useCallback(
    (value: string) => {
      if (statusRef.current === "finished") return;

      const isCustomValue = isCustomRef.current;
      const customModeValue = customModeRef.current;
      const customSourceValue = customSourceRef.current;
      const difficultyValue = difficultyRef.current;
      const lastPassageIdValue = lastPassageIdRef.current;
      let currentTarget = targetTextRef.current;
      const typedValue = typedRef.current;

      if (isCustomValue && customModeValue === "free") {
        const clipped = value.slice(0, MAX_CUSTOM_TEXT_LENGTH);
        setTyped(clipped);
        typedRef.current = clipped;
        startTimerIfNeeded();
        return;
      }

      // Ensure enough text remains ahead of the cursor; append more if needed.
      if (currentTarget.length - value.length < APPEND_THRESHOLD) {
        if (isCustomValue) {
          currentTarget = currentTarget + " " + normalize(customSourceValue);
        } else {
          const next = buildText(difficultyValue, lastPassageIdValue);
          setLastPassageId(next.id);
          lastPassageIdRef.current = next.id;
          currentTarget = currentTarget + " " + next.text;
        }
        setTargetText(currentTarget);
        targetTextRef.current = currentTarget;
      }

      const clipped = value.length > currentTarget.length ? value.slice(0, currentTarget.length) : value;

      // Count freshly typed (non-backspace) characters as errors when wrong.
      if (clipped.length > typedValue.length) {
        for (let i = typedValue.length; i < clipped.length; i++) {
          if (clipped[i] !== currentTarget[i]) errorsRef.current += 1;
        }
      }

      setTyped(clipped);
      typedRef.current = clipped;
      startTimerIfNeeded();
    },
    [startTimerIfNeeded]
  );

  // Live elapsed time: always read straight from the authoritative ref so the
  // value is precise on every render, even between keystrokes and between
  // rAF ticks. This is what makes the WPM able to update in small decimal
  // increments (e.g. 17.2 -> 17.3 -> 17.4) while the visible timer is
  // still showing the same whole second.
  const elapsedMs = status === "idle" || startTimeRef.current === null
    ? 0
    : Date.now() - startTimeRef.current;
  const remainingMs = Math.max(0, duration * 1000 - elapsedMs);

  const liveStats = useMemo(() => {
    if (isCustom && customMode === "free") {
      const lettersTyped = getLettersOnlyCount(typed);
      const accuracy = lettersTyped > 0 ? 100 : 0;
      const wordProgress = computeFreeWordProgress(typed);
      return {
        correct: lettersTyped,
        incorrect: 0,
        // Use the rate formula so Actual WPM is a real words-per-minute
        // value that grows/decays smoothly with elapsed time, instead of
        // jumping only when a word boundary is crossed.
        wpm: computeWpmRate(wordProgress, elapsedMs),
        wordProgress,
        predictedWpm: computePredictedWpm(wordProgress, elapsedMs),
        characterErrors: 0,
        wordErrors: 0,
        accuracy,
      };
    }

    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (/\s/u.test(typed[i])) continue;
      if (typed[i] === targetText[i]) correct++;
    }
    const lettersTyped = getLettersOnlyCount(typed);
    const incorrect = Math.max(0, lettersTyped - correct);
    const wordProgress = computeWordProgress(targetText, typed);
    const actualWpm = computeWpmRate(wordProgress, elapsedMs);
    const predictedWpm = computePredictedWpm(wordProgress, elapsedMs);
    const accuracy = computeAccuracy(correct, lettersTyped);
    return {
      correct,
      incorrect,
      wpm: actualWpm,
      wordProgress,
      predictedWpm,
      characterErrors: incorrect,
      wordErrors: countWordErrors(targetText, typed),
      accuracy,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed, targetText, tick, elapsedMs, isCustom, customMode]);

  return {
    difficulty,
    duration,
    isCustom,
    isFreeTyping: isCustom && customMode === "free",
    status,
    sessionId,
    targetText,
    typed,
    result,
    remainingMs,
    elapsedMs,
    liveStats,
    setDifficulty,
    setDuration,
    handleInputChange,
    retry,
    newText,
    reset,
    stop,
    startCustomTest,
    startFreeTypingTest,
    exitCustom,
  };
}
