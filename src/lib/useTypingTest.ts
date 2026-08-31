import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Difficulty, getRandomPassage } from "../data/texts";
import {
  calculateWpm,
  countAllChars,
  countWordErrors,
  computeAccuracyFromChars,
  computeWordsWritten,
  getLettersOnlyCount,
} from "./stats";
import { maybeSavePersonalBest } from "./storage";

export type TestStatus = "idle" | "running" | "finished";

type CustomMode = "standard" | "free";

export interface TestResult {
  wpm: number;
  wordProgress: number;
  wordsWritten: number;
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

  // Authoritative refs — always reflect the latest typing-session state so
  // async callbacks (rAF loop, finish) cannot read a stale value.
  const startTimeRef = useRef<number | null>(null);
  const errorsRef = useRef(0);
  const finishedRef = useRef(false);

  // The LiveMetrics card reads these two refs every animation frame and
  // computes Actual WPM = liveCharCountRef / 5 / elapsedMinutes. We feed it
  // the Monkeytype "correctWord" count so the live display is the net WPM
  // (only chars that count toward a correct word), not the raw count.
  const liveCharCountRef = useRef(0);

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

  // finish uses refs so it always reads the latest typing-session data.
  // The WPM formula matches Monkeytype's `calculateWpm(correctWord, duration)`,
  // using the chars that count toward a correct word (or a correct prefix
  // of the current word).
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
    const elapsedSec = elapsedMs / 1000;

    let correctWord = 0;
    let allCorrect = 0;
    let incorrect = 0;
    let extra = 0;
    let totalTyped = 0;
    let wordErrorsCount = 0;
    let wordsWritten = 0;
    let accuracy = 100;
    let actualWpm = 0;
    let predictedWpm: number | null = null;

    if (isCustomValue && customModeValue === "free") {
      const letters = getLettersOnlyCount(typedValue);
      correctWord = letters;
      allCorrect = letters;
      totalTyped = letters;
      wordsWritten = computeWordsWritten(typedValue);
      accuracy = letters > 0 ? 100 : 100;
      actualWpm = elapsedSec > 0 ? wordsWritten / (elapsedSec / 60) : 0;
    } else {
      const counts = countAllChars(targetValue, typedValue, true);
      correctWord = counts.correctWord;
      allCorrect = counts.allCorrect;
      incorrect = counts.incorrect;
      extra = counts.extra;
      // Letters Typed = Letters Correct + Letters Incorrect (no "extra" overflow).
      totalTyped = correctWord + incorrect;
      wordsWritten = computeWordsWritten(typedValue);
      wordErrorsCount = countWordErrors(targetValue, typedValue, true);
      // Accuracy = correct / (correct + incorrect) — matches Letters Typed.
      accuracy = totalTyped > 0
        ? Math.round((correctWord / totalTyped) * 10000) / 100
        : 100;
      // Actual WPM = words the user actually wrote / elapsed minutes.
      // Matches the "Words Written" stat: a 1-minute test with 27 words
      // written reads 27.0 WPM.
      actualWpm = elapsedSec > 0 ? wordsWritten / (elapsedSec / 60) : 0;
      predictedWpm = elapsedSec > 0
        ? Math.round(calculateWpm(correctWord, elapsedSec) * 10) / 10
        : null;
    }

    const wordProgress = wordsWritten;
    const lettersTyped = getLettersOnlyCount(typedValue);
    const durationSec = Math.round(elapsedMs / 1000);
    const isNewBest = !isCustomValue
      ? maybeSavePersonalBest(difficultyValue, durationValue, actualWpm, accuracy)
      : false;

    setResult({
      wpm: actualWpm,
      wordProgress,
      wordsWritten,
      predictedWpm,
      accuracy,
      correctChars: correctWord,
      incorrectChars: incorrect,
      characterErrors: incorrect,
      wordErrors: wordErrorsCount,
      mistakes: errorsRef.current,
      totalTyped,
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
  // running. This is the key sync that makes the WPM reflect every
  // keystroke as soon as it lands, and keeps the elapsed-time denominator
  // fresh between keystrokes — matching Monkeytype's `timerStep` cadence.
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
      liveCharCountRef.current = 0;
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
        // Feed LiveMetrics `wordsWritten * 5` so its formula
        // `liveCharCountRef / 5 / elapsedMinutes` becomes
        // `wordsWritten / minutes` — the WPM the user actually wrote.
        const words = computeWordsWritten(clipped);
        liveCharCountRef.current = words * 5;
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
      // Feed LiveMetrics `wordsWritten * 5` so its formula
      // `liveCharCountRef / 5 / elapsedMinutes` becomes
      // `wordsWritten / minutes` — the WPM the user actually wrote.
      const words = computeWordsWritten(clipped);
      liveCharCountRef.current = words * 5;
      startTimerIfNeeded();
    },
    [startTimerIfNeeded]
  );

  // Live elapsed time: always read straight from the authoritative ref so the
  // value is precise on every render, even between keystrokes and between
  // rAF ticks.
  const elapsedMs = status === "idle" || startTimeRef.current === null
    ? 0
    : Date.now() - startTimeRef.current;
  const remainingMs = Math.max(0, duration * 1000 - elapsedMs);

  // Live stats — same formulas as the final result, just with the current
  // `elapsedMs` denominator. The result above is the snapshot at finish;
  // this is the rolling read while the test is running.
  const liveStats = useMemo(() => {
    const elapsedSec = elapsedMs / 1000;

    if (isCustom && customMode === "free") {
      const lettersTyped = getLettersOnlyCount(typed);
      const accuracy = lettersTyped > 0 ? 100 : 100;
      const wordsWritten = computeWordsWritten(typed);
      const actualWpm = elapsedSec > 0 ? wordsWritten / (elapsedSec / 60) : 0;
      return {
        correct: lettersTyped,
        incorrect: 0,
        wpm: actualWpm,
        wordProgress: wordsWritten,
        wordsWritten,
        predictedWpm: null,
        characterErrors: 0,
        wordErrors: 0,
        accuracy,
      };
    }

    const counts = countAllChars(targetText, typed, true);
    const correctWord = counts.correctWord;
    const incorrect = counts.incorrect;
    const extra = counts.extra;
    // Letters Typed = Letters Correct + Letters Incorrect (drop extra overflow).
    const totalTyped = correctWord + incorrect;
    const wordsWritten = computeWordsWritten(typed);
    // Actual WPM = words the user actually wrote / elapsed minutes.
    const actualWpm = elapsedSec > 0 ? wordsWritten / (elapsedSec / 60) : 0;
    // Predicted WPM = Monkeytype's net WPM on the correctWord count.
    const predictedWpm = elapsedSec > 0
      ? Math.round(calculateWpm(correctWord, elapsedSec) * 10) / 10
      : null;
    const accuracy = totalTyped > 0
      ? Math.round((correctWord / totalTyped) * 10000) / 100
      : 100;
    return {
      correct: correctWord,
      incorrect,
      wpm: actualWpm,
      wordProgress: wordsWritten,
      wordsWritten,
      predictedWpm,
      characterErrors: incorrect,
      wordErrors: countWordErrors(targetText, typed, true),
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
    // Exposed for the LiveMetrics card, which drives its own rAF loop and
    // reads these every frame to render the live Actual WPM and timer.
    startTimeRef,
    liveCharCountRef,
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
