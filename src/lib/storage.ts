import type { Difficulty } from "../data/texts";

const PREFIX = "typeittestit";
const VALID_DIFFICULTIES = new Set<Difficulty>(["easy", "medium", "hard"]);
const VALID_DURATIONS = new Set([60, 120, 180, 300]);
const MAX_WPM = 1000;
const MAX_ACCURACY = 100;

export interface PersonalBest {
  wpm: number;
  accuracy: number;
}

function bestKey(difficulty: Difficulty, durationSec: number) {
  return `${PREFIX}:best:${difficulty}:${durationSec}`;
}

function sanitizeBest(value: unknown): PersonalBest | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<PersonalBest>;
  if (!Number.isFinite(candidate.wpm) || !Number.isFinite(candidate.accuracy)) return null;
  if ((candidate.wpm ?? 0) < 0 || (candidate.wpm ?? 0) > MAX_WPM) return null;
  if ((candidate.accuracy ?? 0) < 0 || (candidate.accuracy ?? 0) > MAX_ACCURACY) return null;
  return {
    wpm: Number(candidate.wpm),
    accuracy: Number(candidate.accuracy),
  };
}

export function getPersonalBest(difficulty: Difficulty, durationSec: number): PersonalBest | null {
  if (!VALID_DIFFICULTIES.has(difficulty) || !VALID_DURATIONS.has(durationSec)) return null;
  try {
    const raw = localStorage.getItem(bestKey(difficulty, durationSec));
    if (!raw) return null;
    return sanitizeBest(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** Saves the score if it beats the existing personal best. Returns true if a new best was set. */
export function maybeSavePersonalBest(
  difficulty: Difficulty,
  durationSec: number,
  wpm: number,
  accuracy: number
): boolean {
  if (
    !VALID_DIFFICULTIES.has(difficulty) ||
    !VALID_DURATIONS.has(durationSec) ||
    !Number.isFinite(wpm) ||
    !Number.isFinite(accuracy) ||
    wpm < 0 ||
    wpm > MAX_WPM ||
    accuracy < 0 ||
    accuracy > MAX_ACCURACY
  ) {
    return false;
  }

  try {
    const current = getPersonalBest(difficulty, durationSec);
    if (!current || wpm > current.wpm) {
      localStorage.setItem(bestKey(difficulty, durationSec), JSON.stringify({ wpm, accuracy }));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function getPreferences(): { difficulty: Difficulty; duration: number } {
  try {
    const raw = localStorage.getItem(`${PREFIX}:prefs`);
    if (!raw) return { difficulty: "easy", duration: 60 };
    const parsed = JSON.parse(raw) as { difficulty?: unknown; duration?: unknown };
    const difficulty = VALID_DIFFICULTIES.has(parsed.difficulty as Difficulty)
      ? (parsed.difficulty as Difficulty)
      : "easy";
    const duration = VALID_DURATIONS.has(parsed.duration as number) ? (parsed.duration as number) : 60;
    return { difficulty, duration };
  } catch {
    return { difficulty: "easy", duration: 60 };
  }
}

export function savePreferences(difficulty: Difficulty, duration: number) {
  if (!VALID_DIFFICULTIES.has(difficulty) || !VALID_DURATIONS.has(duration)) return;
  try {
    localStorage.setItem(`${PREFIX}:prefs`, JSON.stringify({ difficulty, duration }));
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}
