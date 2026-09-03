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

export function countChars(inputWord: string, targetWord: string, creditPartial: boolean): CharCounts {
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
      if (!creditPartial) missed += 1;
    } else if (targetChar === undefined || (targetChar === " " && inputChar !== " " && !inputWord.includes(" "))) {
      extra += 1;
    } else {
      incorrect += 1;
    }
  }

  return { allCorrect, correctWord, incorrect, extra, missed };
}

export function countAllChars(targetText: string, typedText: string, creditPartialLast: boolean): CharCounts {
  const acc: CharCounts = { allCorrect: 0, correctWord: 0, incorrect: 0, extra: 0, missed: 0 };
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

export function calculateWpm(charCount: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  return charCount / 5 / (durationSeconds / 60);
}

export function computeRawWpm(totalTyped: number, elapsedMs: number): number {
  if (elapsedMs <= 0 || totalTyped <= 0) return 0;
  return calculateWpm(totalTyped, elapsedMs / 1000);
}

export function computeAccuracyFromChars(correctWord: number, incorrect: number, extra: number): number {
  const total = correctWord + incorrect + extra;
  if (total <= 0) return 100;
  return Math.max(0, Math.min(100, (correctWord / total) * 100));
}

export function computeAccuracy(correctChars: number, totalTyped: number): number {
  if (totalTyped <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((correctChars / totalTyped) * 100)));
}

export function computeWordsWritten(typedText: string): number {
  if (!typedText.trim()) return 0;
  return typedText.trim().split(/\s+/u).filter(Boolean).length;
}

export function countWordErrors(targetText: string, typedText: string, creditPartialLast = true): number {
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
    let wordHasError = (!shouldSkipPartial && typedWord.length !== targetWord.length) || typedWord.length > targetWord.length;

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
  name: "SLOW GOAT" | "AVERAGE GOAT" | "THE GOAT EVERYBODY TALKS ABOUT" | "ACE GOAT" | "HONORABLE GOAT" | "MYTHICAL GOAT";
  minWpm: number;
  maxWpm: number | null;
  message: string;
  nextTarget: number | null;
};

export const SPEED_TIERS: SpeedTier[] = [
  { name: "SLOW GOAT", minWpm: 0, maxWpm: 31.9, message: "You are a slow goat.", nextTarget: 32 },
  { name: "AVERAGE GOAT", minWpm: 32, maxWpm: 47.9, message: "You're an average goat.", nextTarget: 48 },
  { name: "THE GOAT EVERYBODY TALKS ABOUT", minWpm: 48, maxWpm: 59.9, message: "You're the goat everybody talks about.", nextTarget: 60 },
  { name: "ACE GOAT", minWpm: 60, maxWpm: 79.9, message: "You're an ace goat.", nextTarget: 80 },
  { name: "HONORABLE GOAT", minWpm: 80, maxWpm: 99.9, message: "You're an honorable goat.", nextTarget: 100 },
  { name: "MYTHICAL GOAT", minWpm: 100, maxWpm: null, message: "You are a mythical goat.", nextTarget: null },
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
