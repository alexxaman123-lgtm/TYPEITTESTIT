/** Project the current word progress to a one-minute rate.
 *  Example: 3.0 words in 5 seconds => 36.0 predicted WPM.
 *  This is intentionally based on words progressed, not character counts,
 *  so the predictive metric matches what the user sees in the typing flow.
 */
export function computePredictedWpm(wordProgress: number, elapsedMs: number): number {
  if (elapsedMs <= 0 || wordProgress <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return Math.max(0, Math.round((wordProgress / minutes) * 10) / 10);
}

export function computeWpm(correctChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  const wpm = correctChars / 5 / minutes;
  return Math.max(0, Math.round(wpm));
}

export function computeRawWpm(totalTyped: number, elapsedMs: number): number {
  if (elapsedMs <= 0 || totalTyped <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return Math.max(0, Math.round((totalTyped / 5 / minutes) * 10) / 10);
}


export function computeWordProgress(targetText: string, typedText: string): number {
  if (!typedText) return 0;

  const targetWords = targetText.trim().split(/\s+/).filter(Boolean);
  const typedWords = typedText.split(/\s+/).filter(Boolean);
  if (!typedWords.length) return 0;

  const completedWords = typedText.endsWith(" ") ? typedWords.length : Math.max(0, typedWords.length - 1);

  if (typedText.endsWith(" ")) {
    return completedWords;
  }

  const currentTypedWord = typedWords[typedWords.length - 1] ?? "";
  const targetWord = targetWords[completedWords] ?? "";
  if (!targetWord) return completedWords + 1;

  const fraction = Math.min(1, currentTypedWord.length / targetWord.length);
  return completedWords + fraction;
}

export function computeWordsWritten(targetText: string, typedText: string): number {
  return computeWordProgress(targetText, typedText);
}


export function computeFreeWordProgress(typedText: string): number {
  if (!typedText) return 0;
  const words = typedText.split(/\s+/).filter(Boolean);
  const completedWords = typedText.endsWith(" ") ? words.length : Math.max(0, words.length - 1);
  if (typedText.endsWith(" ")) return completedWords;
  const partialLength = words.at(-1)?.length ?? 0;
  return completedWords + Math.min(1, partialLength / 5);
}

export function countWordErrors(targetText: string, typedText: string): number {
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
    let wordHasError =
      (!isFinalPartialWord && typedWord.length !== targetWord.length) ||
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

export function computeAccuracy(correctChars: number, totalTyped: number): number {
  if (totalTyped <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((correctChars / totalTyped) * 100)));
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
  {
    name: "POOR",
    minWpm: 0,
    maxWpm: 29.9,
    message: "You are building your typing foundation. Focus on accuracy and steady rhythm first.",
    nextTarget: 30,
  },
  {
    name: "AVERAGE",
    minWpm: 30,
    maxWpm: 44.9,
    message: "You are around the everyday range. Keep practicing to move toward a stronger, more comfortable pace.",
    nextTarget: 45,
  },
  {
    name: "GOOD",
    minWpm: 45,
    maxWpm: 59.9,
    message: "Good typing speed. You have a solid foundation for school, work, and everyday typing.",
    nextTarget: 60,
  },
  {
    name: "FAST",
    minWpm: 60,
    maxWpm: 79.9,
    message: "You are typing faster than most everyday users. Keep accuracy high while pushing your pace.",
    nextTarget: 80,
  },
  {
    name: "EXCELLENT",
    minWpm: 80,
    maxWpm: 99.9,
    message: "Excellent speed. You are in advanced territory and well above a typical everyday typing pace.",
    nextTarget: 100,
  },
  {
    name: "ELITE",
    minWpm: 100,
    maxWpm: null,
    message: "Elite typing speed. Staying above 100 WPM with high accuracy is a strong competitive benchmark.",
    nextTarget: null,
  },
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
