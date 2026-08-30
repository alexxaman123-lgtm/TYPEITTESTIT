import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Difficulty, getRandomPassage } from "../data/texts";
import { computeAccuracy, computeFreeWordProgress, computeLiveWordProgress, computeRawWpm, countWordErrors, getLettersOnlyCount } from "./stats";
import { maybeSavePersonalBest } from "./storage";

export type TestStatus = "idle" | "running" | "finished";
type CustomMode = "standard" | "free";

export interface TestResult {
  wpm: number;
  wordProgress: number;
  wordsWritten: number;
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

function countTypedWords(text: string): number {
  return text.trim() ? text.trim().split(/\s+/u).length : 0;
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

  const typedRef = useRef("");
  const liveWordProgressRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const errorsRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  const [status, setStatus] = useState<TestStatus>("idle");
  const [result, setResult] = useState<TestResult | null>(null);
  const [sessionId, setSessionId] = useState(0);

  useEffect(() => {
    setLastPassageId(initial.id);
  }, [initial.id]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearTimer();

    const currentTyped = typedRef.current;
    const elapsedMs = startTimeRef.current ? Math.max(0, Date.now() - startTimeRef.current) : 0;
    let correct = 0;
    let incorrect = 0;

    if (isCustom && customMode === "free") {
      correct = getLettersOnlyCount(currentTyped);
      incorrect = 0;
    } else {
      for (let i = 0; i < currentTyped.length; i++) {
        const typedChar = currentTyped[i];
        if (/\s/u.test(typedChar)) continue;
        if (typedChar === targetText[i]) correct++;
        else incorrect++;
      }
    }

    const wordProgress = isCustom && customMode === "free"
      ? computeFreeWordProgress(currentTyped)
      : computeLiveWordProgress(targetText, currentTyped);
    const actualWpm = computeRawWpm(getLettersOnlyCount(currentTyped), elapsedMs);
    const wordsWritten = countTypedWords(currentTyped);
    const lettersTyped = getLettersOnlyCount(currentTyped);
    const accuracy = isCustom && customMode === "free"
      ? (lettersTyped > 0 ? 100 : 0)
      : computeAccuracy(correct, lettersTyped);
    const wordErrors = isCustom && customMode === "free" ? 0 : countWordErrors(targetText, currentTyped);
    const durationSec = Math.round(elapsedMs / 1000);
    const isNewBest = !isCustom ? maybeSavePersonalBest(difficulty, duration, actualWpm, accuracy) : false;

    setResult({
      wpm: actualWpm,
      wordProgress,
      wordsWritten,
      accuracy,
      correctChars: correct,
      incorrectChars: incorrect,
      characterErrors: incorrect,
      wordErrors,
      mistakes: errorsRef.current,
      totalTyped: lettersTyped,
      typedText: currentTyped,
      durationSec: durationSec || duration,
      targetDurationSec: duration,
      difficulty,
      isCustom,
      isNewBest,
    });
    setStatus("finished");
  }, [clearTimer, targetText, difficulty, duration, isCustom, customMode]);

  const finishRef = useRef(finish);
  finishRef.current = finish;

  const startTimerIfNeeded = useCallback(() => {
    if (startTimeRef.current !== null || finishedRef.current) return;

    startTimeRef.current = Date.now();
    setStatus("running");
    timeoutRef.current = window.setTimeout(() => {
      finishRef.current();
    }, duration * 1000);
  }, [duration]);

  const resetInternal = useCallback(
    (newTarget: string, nextCustomMode: CustomMode = customMode) => {
      clearTimer();
      startTimeRef.current = null;
      errorsRef.current = 0;
      finishedRef.current = false;
      typedRef.current = "";
      liveWordProgressRef.current = 0;
      setTyped("");
      setResult(null);
      setStatus("idle");
      setCustomMode(nextCustomMode);
      setTargetText(newTarget);
      setSessionId((s) => s + 1);
    },
    [clearTimer, customMode]
  );

  const retry = useCallback(() => {
    resetInternal(targetText, isCustom ? customMode : "standard");
  }, [resetInternal, targetText, isCustom, customMode]);

  const newText = useCallback(() => {
    if (isCustom) {
      resetInternal(customMode === "free" ? "" : customSource, customMode === "free" ? "free" : "standard");
      return;
    }
    const next = buildText(difficulty, lastPassageId);
    setLastPassageId(next.id);
    resetInternal(next.text, "standard");
  }, [isCustom, customMode, customSource, difficulty, lastPassageId, resetInternal]);

  const reset = useCallback(() => {
    if (isCustom) {
      setIsCustom(false);
      setCustomSource("");
    }
    const next = buildText(difficulty, lastPassageId);
    setLastPassageId(next.id);
    resetInternal(next.text, "standard");
  }, [difficulty, isCustom, lastPassageId, resetInternal]);

  const stop = useCallback(() => {
    if (status === "running") finish();
  }, [status, finish]);

  const setDifficulty = useCallback((d: Difficulty) => {
    setDifficultyState(d);
    setIsCustom(false);
    setCustomSource("");
    const next = buildText(d, lastPassageId);
    setLastPassageId(next.id);
    resetInternal(next.text, "standard");
  }, [lastPassageId, resetInternal]);

  const setDuration = useCallback((secs: number) => {
    setDurationState(secs);
    if (isCustom) {
      resetInternal(customMode === "free" ? "" : customSource, customMode);
    } else {
      const next = buildText(difficulty, lastPassageId);
      setLastPassageId(next.id);
      resetInternal(next.text, "standard");
    }
  }, [resetInternal, isCustom, customMode, customSource, difficulty, lastPassageId]);

  const startCustomTest = useCallback((text: string, secs: number) => {
    const clean = normalize(text);
    setIsCustom(true);
    setCustomMode("standard");
    setCustomSource(clean);
    setDurationState(secs);
    resetInternal(clean, "standard");
  }, [resetInternal]);

  const startFreeTypingTest = useCallback((secs: number) => {
    setIsCustom(true);
    setCustomMode("free");
    setCustomSource("");
    setDurationState(secs);
    resetInternal("", "free");
  }, [resetInternal]);

  const exitCustom = useCallback(() => {
    setIsCustom(false);
    setCustomMode("standard");
    setCustomSource("");
    const next = buildText(difficulty, lastPassageId);
    setLastPassageId(next.id);
    resetInternal(next.text, "standard");
  }, [difficulty, lastPassageId, resetInternal]);

  const handleInputChange = useCallback((value: string) => {
    if (status === "finished") return;

    const start = startTimeRef.current;
    if (start !== null && Date.now() - start >= duration * 1000) {
      finishRef.current();
      return;
    }

    if (isCustom && customMode === "free") {
      const clipped = value.slice(0, MAX_CUSTOM_TEXT_LENGTH);
      const nextProgress = computeFreeWordProgress(clipped);
      typedRef.current = clipped;
      liveWordProgressRef.current = nextProgress;
      setTyped(clipped);
      startTimerIfNeeded();
      return;
    }

    let currentTarget = targetText;
    if (currentTarget.length - value.length < APPEND_THRESHOLD) {
      if (isCustom) {
        currentTarget = currentTarget + " " + normalize(customSource);
      } else {
        const next = buildText(difficulty, lastPassageId);
        setLastPassageId(next.id);
        currentTarget = currentTarget + " " + next.text;
      }
      setTargetText(currentTarget);
    }

    const clipped = value.length > currentTarget.length ? value.slice(0, currentTarget.length) : value;
    const previousLength = typedRef.current.length;

    if (clipped.length > previousLength) {
      for (let i = previousLength; i < clipped.length; i++) {
        if (clipped[i] !== currentTarget[i]) errorsRef.current += 1;
      }
    }

    const nextProgress = computeLiveWordProgress(currentTarget, clipped);
    typedRef.current = clipped;
    liveWordProgressRef.current = nextProgress;
    setTyped(clipped);
    startTimerIfNeeded();
  }, [status, isCustom, customMode, targetText, customSource, difficulty, lastPassageId, duration, startTimerIfNeeded]);

  useEffect(() => clearTimer, [clearTimer]);

  const elapsedMs = status === "idle" ? 0 : startTimeRef.current ? Math.max(0, Date.now() - startTimeRef.current) : 0;
  const remainingMs = Math.max(0, duration * 1000 - elapsedMs);

  const liveStats = useMemo(() => {
    const wordProgress = isCustom && customMode === "free"
      ? computeFreeWordProgress(typed)
      : liveWordProgressRef.current;
    const actualWpm = computeRawWpm(getLettersOnlyCount(typed), elapsedMs);

    if (isCustom && customMode === "free") {
      const lettersTyped = getLettersOnlyCount(typed);
      return {
        correct: lettersTyped,
        incorrect: 0,
        wpm: actualWpm,
        wordProgress,
        characterErrors: 0,
        wordErrors: 0,
        accuracy: lettersTyped > 0 ? 100 : 0,
      };
    }

    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (/\s/u.test(typed[i])) continue;
      if (typed[i] === targetText[i]) correct++;
    }
    const lettersTyped = getLettersOnlyCount(typed);
    const incorrect = Math.max(0, lettersTyped - correct);
    return {
      correct,
      incorrect,
      wpm: actualWpm,
      wordProgress,
      characterErrors: incorrect,
      wordErrors: countWordErrors(targetText, typed),
      accuracy: computeAccuracy(correct, lettersTyped),
    };
  }, [typed, targetText, elapsedMs, isCustom, customMode]);

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
    liveWordProgressRef,
    startTimeRef,
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
