import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Difficulty, getRandomPassage } from "../data/texts";
import { getRandomSpanishPassage } from "../data/spanishTexts";
import { getRandomLocalizedPassage } from "../data/localizedTexts";
import type { Locale } from "./i18n";
import { calculateWpm, computeWordsWritten, getLettersOnlyCount } from "./stats";
import { gradeTyping, wpmFromWordProgress } from "./grade";
import { maybeSavePersonalBest } from "./storage";
import { saveLeaderboardScore } from "./leaderboard";

type TestStatus = "idle" | "running" | "finished";
type CustomMode = "standard" | "free";
// The typing text language now covers every site locale, not just en/es, so
// each localized page can offer typing practice in its own language instead
// of silently reusing whichever locale was last selected on any page.
export type TypingLocale = Locale;

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
const MAX_CUSTOM_TEXT_LENGTH = 100000;
const MIN_STATS_DURATION_SEC = 60;

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim().slice(0, MAX_CUSTOM_TEXT_LENGTH);
}

function buildText(
  difficulty: Difficulty,
  excludeId: string | undefined,
  locale: TypingLocale,
): { text: string; id: string } {
  const passage = locale === "es"
    ? getRandomSpanishPassage(difficulty, excludeId)
    : locale === "en"
    ? getRandomPassage(difficulty, excludeId)
    : getRandomLocalizedPassage(locale, difficulty, excludeId);
  return { text: normalize(passage.text), id: passage.id };
}

export function useTypingTest(
  initialDifficulty: Difficulty,
  initialDuration: number,
  initialLocale: TypingLocale = "en",
) {
  const [difficulty, setDifficultyState] = useState<Difficulty>(initialDifficulty);
  const [duration, setDurationState] = useState(initialDuration);
  const [locale, setLocaleState] = useState<TypingLocale>(initialLocale);
  const [isCustom, setIsCustom] = useState(false);
  const [customMode, setCustomMode] = useState<CustomMode>("standard");
  const [customSource, setCustomSource] = useState("");

  const [lastPassageId, setLastPassageId] = useState<string | undefined>(undefined);
  const initial = useMemo(
    () => buildText(initialDifficulty, undefined, locale),
    [initialDifficulty, locale],
  );
  const [targetText, setTargetText] = useState(initial.text);
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<TestStatus>("idle");
  const [result, setResult] = useState<TestResult | null>(null);
  const [sessionId, setSessionId] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
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
  const localeRef = useRef(locale);

  useEffect(() => { typedRef.current = typed; }, [typed]);
  useEffect(() => { targetTextRef.current = targetText; }, [targetText]);
  useEffect(() => { isCustomRef.current = isCustom; }, [isCustom]);
  useEffect(() => { customModeRef.current = customMode; }, [customMode]);
  useEffect(() => { difficultyRef.current = difficulty; }, [difficulty]);
  useEffect(() => { durationRef.current = duration; }, [duration]);
  useEffect(() => { customSourceRef.current = customSource; }, [customSource]);
  useEffect(() => { lastPassageIdRef.current = lastPassageId; }, [lastPassageId]);
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { localeRef.current = locale; }, [locale]);
  useEffect(() => { setLastPassageId(initial.id); }, [initial.id]);

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
    const statsAvailable = isCustomValue || elapsedSec >= MIN_STATS_DURATION_SEC;

    let correctChars = 0;
    let incorrect = 0;
    let totalTyped = 0;
    let wordErrorsCount = 0;
    let wordsWritten = 0;
    let wordProgress = 0;
    let accuracy = 100;
    let actualWpm = 0;
    let predictedWpm: number | null = null;
    let mistakesCount = 0;

    if (isCustomValue && customModeValue === "free") {
      const letters = getLettersOnlyCount(typedValue);
      correctChars = letters;
      totalTyped = letters;
      wordsWritten = computeWordsWritten(typedValue);
      wordProgress = wordsWritten;
      actualWpm = wpmFromWordProgress(wordProgress, elapsedSec);
    } else {
      // One grading pass produces every number below, so the counters, the
      // accuracy and the red letters on screen can never disagree. Grading is
      // word-by-word (see lib/grade.ts), so a single dropped or doubled
      // character never misaligns the rest of the passage.
      const grade = gradeTyping(targetValue, typedValue);
      correctChars = grade.correct;
      incorrect = grade.incorrect + grade.extra;
      mistakesCount = grade.incorrect + grade.extra + grade.missing;
      totalTyped = grade.graded;
      wordsWritten = grade.completedWords;
      wordProgress = grade.wordProgress;
      wordErrorsCount = grade.wordErrors;
      accuracy = grade.accuracy;
      actualWpm = wpmFromWordProgress(grade.wordProgress, elapsedSec);
      predictedWpm = elapsedSec > 0
        ? Math.round(calculateWpm(correctChars, elapsedSec) * 10) / 10
        : null;
    }

    const durationSec = Math.round(elapsedMs / 1000);

    if (!statsAvailable) {
      actualWpm = 0;
      predictedWpm = null;
    }

    const isNewBest = statsAvailable && !isCustomValue
      ? maybeSavePersonalBest(difficultyValue, durationValue, actualWpm, accuracy)
      : false;

    setResult({
      wpm: actualWpm,
      wordProgress,
      wordsWritten,
      predictedWpm,
      accuracy,
      correctChars,
      incorrectChars: incorrect,
      characterErrors: incorrect,
      wordErrors: wordErrorsCount,
      mistakes: mistakesCount,
      totalTyped,
      typedText: typedValue,
      durationSec: durationSec || durationValue,
      targetDurationSec: durationValue,
      difficulty: difficultyValue,
      isCustom: isCustomValue,
      isNewBest,
    });

    if (!isCustomValue && statsAvailable) {
      void saveLeaderboardScore({
        difficulty: difficultyValue,
        durationSec: durationValue,
        wpm: actualWpm,
        accuracy,
        wordsWritten,
        correctChars,
        incorrectChars: incorrect,
        totalTyped,
      });
    }

    setStatus("finished");
  }, []);

  const finishRef = useRef(finish);
  finishRef.current = finish;

  const startTimerIfNeeded = useCallback(() => {
    if (startTimeRef.current !== null || finishedRef.current) return;
    startTimeRef.current = Date.now();
    setStatus("running");
  }, []);

  useEffect(() => {
    if (statusRef.current !== "running") return;

    let rafId = 0;
    const checkTimer = () => {
      if (finishedRef.current) return;
      const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
      if (elapsed >= durationRef.current * 1000) {
        finishRef.current();
        return;
      }
      rafId = requestAnimationFrame(checkTimer);
    };

    rafId = requestAnimationFrame(checkTimer);
    return () => cancelAnimationFrame(rafId);
  }, [status]);

  const resetInternal = useCallback(
    (newTarget: string, nextCustomMode: CustomMode = customMode) => {
      startTimeRef.current = null;
      finishedRef.current = false;
      liveCharCountRef.current = 0;
      setTyped("");
      setResult(null);
      setStatus("idle");
      setCustomMode(nextCustomMode);
      setTargetText(newTarget);
      setSessionId((s) => s + 1);
    },
    [customMode],
  );

  const retry = useCallback(
    () => resetInternal(targetText, isCustom ? customMode : "standard"),
    [resetInternal, targetText, isCustom, customMode],
  );

  const newText = useCallback(() => {
    if (isCustom) {
      if (customMode === "free") resetInternal("", "free");
      else resetInternal(customSource, "standard");
      return;
    }

    const next = buildText(difficulty, lastPassageId, locale);
    setLastPassageId(next.id);
    resetInternal(next.text, "standard");
  }, [isCustom, customMode, customSource, difficulty, lastPassageId, resetInternal, locale]);

  const reset = useCallback(() => {
    if (isCustom) {
      setIsCustom(false);
      setCustomSource("");
    }

    const next = buildText(difficulty, lastPassageId, locale);
    setLastPassageId(next.id);
    resetInternal(next.text, "standard");
  }, [difficulty, isCustom, lastPassageId, resetInternal, locale]);

  const stop = useCallback(() => {
    if (status === "running") finish();
  }, [status, finish]);

  const setDifficulty = useCallback(
    (d: Difficulty) => {
      setDifficultyState(d);
      setIsCustom(false);
      setCustomSource("");
      const next = buildText(d, lastPassageId, locale);
      setLastPassageId(next.id);
      resetInternal(next.text, "standard");
    },
    [lastPassageId, resetInternal, locale],
  );

  const setDuration = useCallback(
    (secs: number) => {
      setDurationState(secs);
      if (isCustom) {
        resetInternal(customMode === "free" ? "" : customSource, customMode);
      } else {
        const next = buildText(difficulty, lastPassageId, locale);
        setLastPassageId(next.id);
        resetInternal(next.text, "standard");
      }
    },
    [resetInternal, isCustom, customMode, customSource, difficulty, lastPassageId, locale],
  );

  const setLocale = useCallback((nextLocale: TypingLocale) => {
    if (nextLocale === localeRef.current) return;

    startTimeRef.current = null;
    finishedRef.current = false;
    liveCharCountRef.current = 0;
    setTyped("");
    setResult(null);
    setStatus("idle");
    setIsCustom(false);
    setCustomMode("standard");
    setCustomSource("");
    setLocaleState(nextLocale);

    const next = buildText(difficultyRef.current, lastPassageIdRef.current, nextLocale);
    setLastPassageId(next.id);
    setTargetText(next.text);
    setSessionId((s) => s + 1);
  }, []);

  const startCustomTest = useCallback(
    (text: string, secs: number) => {
      const clean = normalize(text);
      setIsCustom(true);
      setCustomMode("standard");
      setCustomSource(clean);
      setDurationState(secs);
      resetInternal(clean, "standard");
    },
    [resetInternal],
  );

  const startFreeTypingTest = useCallback(
    (secs: number) => {
      setIsCustom(true);
      setCustomMode("free");
      setCustomSource("");
      setDurationState(secs);
      resetInternal("", "free");
    },
    [resetInternal],
  );

  const exitCustom = useCallback(() => {
    setIsCustom(false);
    setCustomMode("standard");
    setCustomSource("");
    const next = buildText(difficulty, lastPassageId, locale);
    setLastPassageId(next.id);
    resetInternal(next.text, "standard");
  }, [difficulty, lastPassageId, resetInternal, locale]);

  const handleInputChange = useCallback(
    (value: string) => {
      if (statusRef.current === "finished") return;

      const isCustomValue = isCustomRef.current;
      const customModeValue = customModeRef.current;
      const customSourceValue = customSourceRef.current;
      const difficultyValue = difficultyRef.current;
      const lastPassageIdValue = lastPassageIdRef.current;
      let currentTarget = targetTextRef.current;

      if (isCustomValue && customModeValue === "free") {
        const clipped = value.slice(0, MAX_CUSTOM_TEXT_LENGTH);
        setTyped(clipped);
        typedRef.current = clipped;
        liveCharCountRef.current = computeWordsWritten(clipped) * 5;
        startTimerIfNeeded();
        return;
      }

      if (currentTarget.length - value.length < APPEND_THRESHOLD) {
        if (isCustomValue) {
          currentTarget = `${currentTarget} ${normalize(customSourceValue)}`;
        } else {
          const next = buildText(difficultyValue, lastPassageIdValue, localeRef.current);
          setLastPassageId(next.id);
          lastPassageIdRef.current = next.id;
          currentTarget = `${currentTarget} ${next.text}`;
        }

        setTargetText(currentTarget);
        targetTextRef.current = currentTarget;
      }

      const clipped = value.length > currentTarget.length
        ? value.slice(0, currentTarget.length)
        : value;

      // Free typing: every keystroke (correct or not) advances the caret, just
      // like typing normally. Mistakes are never hidden or blocked — they show
      // up in red exactly where they were typed, and backspacing + retyping a
      // position clears its red mark.
      setTyped(clipped);
      typedRef.current = clipped;
      // The live WPM readout divides this by 5, so feeding it word progress × 5
      // makes the live number identical to the one on the result screen.
      liveCharCountRef.current = gradeTyping(currentTarget, clipped).wordProgress * 5;
      startTimerIfNeeded();
    },
    [startTimerIfNeeded],
  );

  const elapsedMs = status === "idle" || startTimeRef.current === null
    ? 0
    : Date.now() - startTimeRef.current;
  const remainingMs = Math.max(0, duration * 1000 - elapsedMs);

  const liveStats = useMemo(() => {
    const elapsedSec = elapsedMs / 1000;
    const statsAvailable = isCustom || elapsedSec >= MIN_STATS_DURATION_SEC;

    if (isCustom && customMode === "free") {
      const lettersTyped = getLettersOnlyCount(typed);
      const wordsWritten = computeWordsWritten(typed);
      const wpm = statsAvailable ? wpmFromWordProgress(wordsWritten, elapsedSec) : 0;

      return {
        correct: lettersTyped,
        incorrect: 0,
        wpm,
        wordProgress: wordsWritten,
        wordsWritten,
        predictedWpm: null,
        characterErrors: 0,
        wordErrors: 0,
        accuracy: 100,
      };
    }

    // Same grading pass as finish(), recomputed on every keystroke so the live
    // numbers always match what is actually on screen.
    const grade = gradeTyping(targetText, typed);
    const incorrect = grade.incorrect + grade.extra;
    const actualWpm = statsAvailable ? wpmFromWordProgress(grade.wordProgress, elapsedSec) : 0;
    const predictedWpm = statsAvailable && elapsedSec > 0
      ? Math.round(calculateWpm(grade.correct, elapsedSec) * 10) / 10
      : null;

    return {
      correct: grade.correct,
      incorrect,
      wpm: actualWpm,
      wordProgress: grade.wordProgress,
      wordsWritten: grade.completedWords,
      predictedWpm,
      characterErrors: incorrect,
      wordErrors: grade.wordErrors,
      accuracy: grade.accuracy,
    };
  }, [typed, targetText, elapsedMs, isCustom, customMode]);

  return {
    difficulty,
    duration,
    locale,
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
    startTimeRef,
    liveCharCountRef,
    setDifficulty,
    setDuration,
    setLocale,
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
