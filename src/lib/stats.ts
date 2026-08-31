/**
 * Stats module — ported from Monkeytype (monkeytypegame/monkeytype).
 *
 * Core formulas are taken directly from Monkeytype's
 * frontend/src/ts/utils/numbers.ts and frontend/src/ts/utils/strings.ts.
 * The shape of the data and the meaning of each metric match Monkeytype's
 * definitions so the live + result stats behave exactly the same way.
 *
 * Only the parts relevant to a time-based typing test with a fixed target
 * text are ported. UI / config / Solid signals are not.
 */

export type CharCounts = {
  allCorrect: number;
  correctWord: number;
  incorrect: number;
  extra: number;
  missed: number;
};

/**
 * Count characters in `inputWord` against `targetWord` and categorize them.
 * This is a direct port of Monkeytype's `countChars` from
 * frontend/src/ts/utils/strings.ts.
 *
 * Categories:
 *   - allCorrect  : characters that match the target, regardless of word correctness
 *   - correctWord : characters that count toward the WPM. Only credited when
 *                   the whole word is correct, or when `creditPartial` is true
 *                   and the typed word is a prefix of the target word.
 *   - incorrect   : characters typed in the wrong place
 *   - extra       : characters typed past the end of the target word
 *   - missed      : target characters that were never typed (only counted when
 *                   `creditPartial` is false, i.e. for the final word in a
 *                   word-count test)
 */
export function countChars(
  inputWord: string,
  targetWord: string,
  creditPartial: boolean,
): CharCounts {
  let allCorrect = 0;
  let correctWord = 0;
  let incorrect = 0;
  let extra = 0;
  let missed = 0;

  const wordCorrect = inputWord === targetWord;
  const wordPartiallyCorrect = targetWord.startsWith(inputWord);

  const maxLen = Math.max(inputWord.length, targetWord.length);
  for (let i = 0; i < maxLen; i++) {
    const inputChar = inputWord[i];
    const targetChar = targetWord[i];

    if (inputChar === targetChar) {
      if (targetChar === " " && !wordCorrect) {
        extra += 1;
      } else {
        allCorrect += 1;
      }
      if (wordCorrect || (creditPartial && wordPartiallyCorrect)) {
        correctWord += 1;
      }
    } else if (inputChar === undefined) {
      // missed char
      if (!creditPartial) {
        missed += 1;
      }
    } else if (
      targetChar === undefined ||
      (targetChar === " " && inputChar !== " " && !inputWord.includes(" "))
    ) {
      // extra char (past target, or typed in place of word-ending space)
      extra += 1;
    } else {
      // incorrect char
      incorrect += 1;
    }
  }

  return { allCorrect, correctWord, incorrect, extra, missed };
}

/**
 * Sum char counts across every word the user has touched.
 * The trailing (partial) word is credited partially when `creditPartialLast`
 * is true, which is what we want for time-based tests.
 */
export function countAllChars(
  targetText: string,
  typedText: string,
  creditPartialLast: boolean,
): CharCounts {
  const acc: CharCounts = {
    allCorrect: 0,
    correctWord: 0,
    incorrect: 0,
    extra: 0,
    missed: 0,
  };
  if (!typedText) return acc;

  const targetWords = targetText.split(/ +/);
  const typedWords = typedText.split(/ +/);

  for (let i = 0; i < typedWords.length; i++) {
    const isLast = i === typedWords.length - 1;
    const targetWord = targetWords[i] ?? "";
    const typedWord = typedWords[i];
    const creditPartial = isLast && creditPartialLast;
    const c = countChars(typedWord, targetWord, creditPartial);
    acc.allCorrect += c.allCorrect;
    acc.correctWord += c.correctWord;
    acc.incorrect += c.incorrect;
    acc.extra += c.extra;
    acc.missed += c.missed;
  }

  return acc;
}

/**
 * Monkeytype's WPM formula. Direct port of
 * frontend/src/ts/utils/numbers.ts → calculateWpm.
 *   WPM = (chars / 5) / (durationSeconds / 60)
 * Five characters = one "word" by the standard typing-test convention.
 *
 * Pass `correctWord` (chars that count toward a correct word) for the
 * Monkeytype "Actual WPM" display. Pass `allCorrect + incorrect + extra`
 * for the "Raw WPM".
 */
export function calculateWpm(
  charCount: number,
  durationSeconds: number,
): number {
  if (durationSeconds <= 0) return 0;
  return charCount / 5 / (durationSeconds / 60);
}

/**
 * Backwards-compatible alias for the raw-char WPM (the previous build
 * of this file used `computeRawWpm(totalTyped, elapsedMs)`).
 */
export function computeRawWpm(totalTyped: number, elapsedMs: number): number {
  if (elapsedMs <= 0 || totalTyped <= 0) return 0;
  return calculateWpm(totalTyped, elapsedMs / 1000);
}

/**
 * Accuracy in [0, 100]. Mirrors Monkeytype's
 *   acc = correctWord / (correctWord + incorrect + extra) * 100
 */
export function computeAccuracyFromChars(
  correctWord: number,
  incorrect: number,
  extra: number,
): number {
  const total = correctWord + incorrect + extra;
  if (total <= 0) return 100;
  return Math.max(0, Math.min(100, (correctWord / total) * 100));
}

/**
 * Original accuracy helper (correct chars / total typed). Kept for
 * backwards compatibility with call sites that already use it.
 */
export function computeAccuracy(
  correctChars: number,
  totalTyped: number,
): number {
  if (totalTyped <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((correctChars / totalTyped) * 100)));
}

/** Count complete word units actually entered by the user. */
export function computeWordsWritten(typedText: string): number {
  if (!typedText.trim()) return 0;
  return typedText.trim().split(/\s+/u).filter(Boolean).length;
}

/**
 * Count how many typed words contain at least one error. Mirrors
 * the previous logic but accepts the partial-last-word flag from
 * Monkeytype.
 */
export function countWordErrors(
  targetText: string,
  typedText: string,
  creditPartialLast = true,
): number {
  if (!typedText.trim()) return 0;
  const targetWords = targetText.trim().split(/\s+/);
  const typedWords = typedText.trim().split(/\s+/);
  let errors = 0;

  const finalWordIsPartial = !/\s$/.test(typedText);
  for (let i = 0; i < typedWords.length; i++) {
    const typedWord = typedWords[i];
    const targetWord = targetWords[i] ?? "";
    const comparableLength = Math.min(typedWord.length, targetWord.length);
    const isFinalPartialWord = finalWordIsPartial && i === typedWords.length - 1;
    const shouldSkipPartial = isFinalPartialWord && !creditPartialLast;
    let wordHasError =
      (!shouldSkipPartial && typedWord.length !== targetWord.length) ||
      typedWord.length > targetWord.length;

    for (let j = 0; j < comparableLength; j++) {
      if (typedWord[j] !== targetWord[j]) {
        wordHasError = true;
        break;
      }
    }
    if (wordHasError) errors++;
  }
  return errors;
}

export type PerformanceLabel = "EXCELLENT" | "GREAT" | "GOOD" | "KEEP PRACTICING";

export function getPerformanceLabel(wpm: number, accuracy: number): PerformanceLabel {
  if (wpm >= 80 && accuracy >= 96) return "EXCELLENT";
  if (wpm >= 60 && accuracy >= 92) return "GREAT";
  if (wpm >= 35 && accuracy >= 85) return "GOOD";
  return "KEEP PRACTICING";
}

export type SpeedTier = {
  name: "POOR" | "AVERAGE" | "GOOD" | "FAST" | "EXCELLENT" | "ELITE";
  minWpm: number;
  maxWpm: number | null;
  message: string;
  nextTarget: number | null;
};

export const SPEED_TIERS: SpeedTier[] = [
  { name: "POOR", minWpm: 0, maxWpm: 29.9, message: "You are building your typing foundation. Focus on accuracy and steady rhythm first.", nextTarget: 30 },
  { name: "AVERAGE", minWpm: 30, maxWpm: 44.9, message: "You are around the everyday range. Keep practicing to move toward a stronger, more comfortable pace.", nextTarget: 45 },
  { name: "GOOD", minWpm: 45, maxWpm: 59.9, message: "Good typing speed. You have a solid foundation for school, work, and everyday typing.", nextTarget: 60 },
  { name: "FAST", minWpm: 60, maxWpm: 79.9, message: "You are typing faster than most everyday users. Keep accuracy high while pushing your pace.", nextTarget: 80 },
  { name: "EXCELLENT", minWpm: 80, maxWpm: 99.9, message: "Excellent speed. You are in an advanced territory and well above a typical everyday typing pace.", nextTarget: 100 },
  { name: "ELITE", minWpm: 100, maxWpm: null, message: "Elite typing speed. Staying above 100 WPM with high accuracy is a strong competitive benchmark.", nextTarget: null },
];

export function getSpeedTier(wpm: number): SpeedTier {
  const safeWpm = Number.isFinite(wpm) ? Math.max(0, wpm) : 0;
  return [...SPEED_TIERS].reverse().find((tier) => safeWpm >= tier.minWpm) ?? SPEED_TIERS[0];
}

export function getLettersOnlyCount(text: string): number {
  return Array.from(text).filter((char) => !/\s/u.test(char)).length;
}

export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
