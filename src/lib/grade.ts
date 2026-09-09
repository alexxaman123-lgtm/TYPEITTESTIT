/**
 * Grading — the single source of truth for "how did this attempt go?".
 *
 * Every number the UI shows (letters correct, letters incorrect, letters
 * typed, accuracy, words written, WPM) and every red letter the UI paints
 * comes out of `gradeTyping`, so the display can never disagree with the
 * counters again.
 *
 * The model follows Monkeytype (monkeytypegame/monkeytype,
 * frontend/src/styles/test.scss + frontend/src/ts/utils/strings.ts):
 *
 *   correct   — you typed the right character in the right place
 *   incorrect — you typed a character, but the wrong one (we keep showing the
 *               TARGET letter so you can still read what you had to type)
 *   extra     — you typed more characters than the word has (we show what you
 *               actually typed, because there is no target letter here)
 *   missing   — you left a word before finishing it
 *   pending   — not typed yet: NOT graded, so an unfinished last word can
 *               never drag your accuracy down
 *
 * Comparison is word-by-word, not by absolute string index. That matters: if
 * you drop or double a single character, an index-based diff marks the entire
 * rest of the passage wrong, which is exactly how a run with a handful of
 * typos ends up looking (and scoring) like a disaster.
 *
 * Letters mean letters. The space bar is a keystroke, but it is not a letter,
 * so spaces are counted separately (`correctSpaces` / `extraSpaces`) and left
 * out of `correct`, `incorrect`, `extra` and `graded`. That keeps the numbers
 * on screen checkable by hand:
 *
 *   letters correct + letters incorrect = letters typed
 *   accuracy = letters correct / letters typed
 *
 * None of this depends on the length of the test: the same pass grades a 1,
 * 2, 3 or 5 minute test, and custom tests, identically. Only the elapsed time
 * used for WPM differs.
 */

export type LetterState = "correct" | "incorrect" | "extra" | "missing" | "pending";

export type GradedLetter = {
  /** The glyph to display: the target letter, except for `extra` (what you typed). */
  char: string;
  state: LetterState;
  /** The character actually typed at this position, when there was one. */
  typedChar?: string;
};

export type GradedWord = {
  targetWord: string;
  typedWord: string;
  letters: GradedLetter[];
  hasError: boolean;
  /** True for the word the caret is sitting in — its untyped tail is not an error yet. */
  isInProgress: boolean;
};

export type TypingGrade = {
  /** Letters typed in the right place. Spaces are not letters and are excluded. */
  correct: number;
  /** Letters typed in the wrong place. */
  incorrect: number;
  /** Letters typed beyond the end of a word. */
  extra: number;
  /** Letters skipped in words you already moved past. */
  missing: number;
  /** Letter keystrokes that count towards accuracy: correct + incorrect + extra. */
  graded: number;
  /** correct / graded, as a percentage with 2 decimals. 100 when nothing typed. */
  accuracy: number;
  /** Spaces pressed where the passage really did continue with another word. */
  correctSpaces: number;
  /** Surplus spaces (double spaces, or a space past the end of the passage). */
  extraSpaces: number;
  /** Words you finished (i.e. followed with a space). */
  completedWords: number;
  /** completedWords plus the fraction of the word you are currently inside. */
  wordProgress: number;
  /** Words containing at least one mistyped, extra or skipped letter. */
  wordErrors: number;
  words: GradedWord[];
};

const EMPTY_GRADE: TypingGrade = {
  correct: 0,
  incorrect: 0,
  extra: 0,
  missing: 0,
  graded: 0,
  accuracy: 100,
  correctSpaces: 0,
  extraSpaces: 0,
  completedWords: 0,
  wordProgress: 0,
  wordErrors: 0,
  words: [],
};

/**
 * Split what the user typed into words.
 *
 * A run of repeated spaces would otherwise produce empty words and knock the
 * whole comparison out of alignment, so each surplus space is dropped from the
 * word list and counted as a surplus space instead. A single trailing empty
 * entry is kept: that is the next word, with nothing typed in it yet.
 */
function splitTypedWords(typedText: string): { words: string[]; extraSpaces: number } {
  const raw = typedText.split(" ");
  const words: string[] = [];
  let extraSpaces = 0;

  raw.forEach((word, index) => {
    if (word === "" && index < raw.length - 1) {
      extraSpaces += 1;
      return;
    }
    words.push(word);
  });

  if (words.length === 0) words.push("");
  return { words, extraSpaces };
}

export function gradeTyping(targetText: string, typedText: string): TypingGrade {
  if (typedText.length === 0) return EMPTY_GRADE;

  const targetWords = targetText.length > 0 ? targetText.split(" ") : [];
  const { words: typedWords, extraSpaces: surplusSpaces } = splitTypedWords(typedText);
  const lastIndex = typedWords.length - 1;

  let correct = 0;
  let incorrect = 0;
  let extra = 0;
  let missing = 0;
  let correctSpaces = 0;
  let extraSpaces = surplusSpaces;
  let wordErrors = 0;
  const words: GradedWord[] = [];

  for (let i = 0; i <= lastIndex; i += 1) {
    const targetWord = targetWords[i] ?? "";
    const typedWord = typedWords[i];
    const isInProgress = i === lastIndex;
    const letters: GradedLetter[] = [];
    let hasError = false;

    const length = Math.max(targetWord.length, typedWord.length);
    for (let idx = 0; idx < length; idx += 1) {
      const targetChar = targetWord[idx];
      const typedChar = typedWord[idx];

      if (targetChar !== undefined && typedChar !== undefined) {
        if (targetChar === typedChar) {
          correct += 1;
          letters.push({ char: targetChar, state: "correct", typedChar });
        } else {
          incorrect += 1;
          hasError = true;
          letters.push({ char: targetChar, state: "incorrect", typedChar });
        }
      } else if (typedChar !== undefined) {
        extra += 1;
        hasError = true;
        letters.push({ char: typedChar === " " ? "\u00b7" : typedChar, state: "extra", typedChar });
      } else if (isInProgress) {
        // Not typed yet. Deliberately ungraded.
        letters.push({ char: targetChar as string, state: "pending" });
      } else {
        missing += 1;
        hasError = true;
        letters.push({ char: targetChar as string, state: "missing" });
      }
    }

    // The space that ended this word is a keystroke, but it is not a letter, so
    // it is tallied on its own and kept out of the letter counters.
    if (i < lastIndex) {
      if (i < targetWords.length - 1) correctSpaces += 1;
      else extraSpaces += 1;
    }

    if (hasError) wordErrors += 1;
    words.push({ targetWord, typedWord, letters, hasError, isInProgress });
  }

  const graded = correct + incorrect + extra;
  const accuracy = graded > 0 ? Math.round((correct / graded) * 10000) / 100 : 100;

  const completedWords = Math.max(0, typedWords.length - 1);
  const currentTarget = targetWords[completedWords] ?? "";
  const currentTyped = typedWords[completedWords] ?? "";
  const fraction = currentTyped.length === 0
    ? 0
    : currentTarget.length > 0
      ? Math.min(1, currentTyped.length / currentTarget.length)
      : 1;
  const wordProgress = Math.round((completedWords + fraction) * 100) / 100;

  return {
    correct,
    incorrect,
    extra,
    missing,
    graded,
    accuracy,
    correctSpaces,
    extraSpaces,
    completedWords,
    wordProgress,
    wordErrors,
    words,
  };
}

/**
 * Words per minute straight from word progress, so typing one letter of a new
 * word adds a fraction of a word — not a whole one.
 *
 * `elapsedSeconds` is always the real measured time, which is what makes this
 * identical across 1, 2, 3 and 5 minute tests: in a 1 minute test the result
 * equals word progress exactly, and in longer tests it is word progress
 * divided by the number of minutes actually spent.
 */
export function wpmFromWordProgress(wordProgress: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || wordProgress <= 0) return 0;
  return Math.round((wordProgress / (elapsedSeconds / 60)) * 10) / 10;
}

/**
 * The character the next keystroke should produce, or `undefined` if the word
 * is already full (i.e. anything typed now is an extra character).
 *
 * Used for key sounds: it is derived from the current word, so a mistake in
 * one word never makes the following keystrokes sound wrong, and the space
 * between words is never treated as a mistake.
 */
export function expectedNextChar(targetText: string, typedText: string): string | undefined {
  const targetWords = targetText.length > 0 ? targetText.split(" ") : [];
  const { words } = splitTypedWords(typedText);
  const index = words.length - 1;
  const targetWord = targetWords[index] ?? "";
  return targetWord[words[index].length];
}
