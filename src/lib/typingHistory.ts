import { supabase } from "../supabaseClient";
import type { Difficulty } from "../data/texts";

export interface TypingHistoryInput {
  difficulty: Difficulty;
  durationSec: number;
  targetDurationSec: number;
  wpm: number;
  accuracy: number;
  wordsWritten: number;
  correctChars: number;
  incorrectChars: number;
  totalTyped: number;
  language: "en" | "es";
  isCustom: boolean;
}

export interface TypingHistoryEntry extends TypingHistoryInput {
  id: number;
  completedAt: string;
}

export interface AccountStatsBucket {
  durationSec: number;
  difficulty: Difficulty;
  tests: number;
  bestWpm: number;
  avgWpm: number;
  bestAccuracy: number;
  avgAccuracy: number;
}

export interface AccountStats {
  testsCompleted: number;
  totalDurationSec: number;
  bestWpm: number;
  avgWpm: number;
  bestAccuracy: number;
  avgAccuracy: number;
  byBucket: AccountStatsBucket[];
}

const VALID_DIFFICULTIES = new Set<Difficulty>(["easy", "medium", "hard"]);

export async function saveTypingHistory(result: TypingHistoryInput): Promise<boolean> {
  if (
    !VALID_DIFFICULTIES.has(result.difficulty) ||
    !Number.isFinite(result.durationSec) ||
    result.durationSec <= 0 ||
    !Number.isFinite(result.targetDurationSec) ||
    result.targetDurationSec <= 0 ||
    !Number.isFinite(result.wpm) ||
    result.wpm < 0 ||
    !Number.isFinite(result.accuracy) ||
    result.accuracy < 0 ||
    result.accuracy > 100
  ) {
    return false;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase.rpc("record_typing_history", {
    p_difficulty: result.difficulty,
    p_duration_sec: result.durationSec,
    p_target_duration_sec: result.targetDurationSec,
    p_wpm: result.wpm,
    p_accuracy: result.accuracy,
    p_words_written: result.wordsWritten,
    p_correct_chars: result.correctChars,
    p_incorrect_chars: result.incorrectChars,
    p_total_typed: result.totalTyped,
    p_language: result.language,
    p_is_custom: result.isCustom,
  });

  if (error) {
    console.error("Could not save typing history:", error.message);
    return false;
  }

  return data !== null && data !== undefined;
}

export async function fetchTypingHistory(limit = 50): Promise<TypingHistoryEntry[]> {
  const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 100);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("typing_history")
    .select("id, difficulty, duration_sec, target_duration_sec, wpm, accuracy, words_written, correct_chars, incorrect_chars, total_typed, language, is_custom, completed_at")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(safeLimit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: Number(row.id),
    difficulty: row.difficulty as Difficulty,
    durationSec: Number(row.duration_sec),
    targetDurationSec: Number(row.target_duration_sec),
    wpm: Number(row.wpm),
    accuracy: Number(row.accuracy),
    wordsWritten: Number(row.words_written),
    correctChars: Number(row.correct_chars),
    incorrectChars: Number(row.incorrect_chars),
    totalTyped: Number(row.total_typed),
    language: row.language === "es" ? "es" : "en",
    isCustom: Boolean(row.is_custom),
    completedAt: row.completed_at,
  }));
}

/**
 * Server-side aggregate stats for the Monkeytype-style account dashboard:
 * lifetime tests completed, total time spent typing, best/average WPM and
 * accuracy, plus a duration x difficulty breakdown ("byBucket"). Computed
 * via the get_account_stats() RPC so it covers the user's full history
 * (not just the most recent rows fetched by fetchTypingHistory) while
 * staying inside the same per-user RLS boundary.
 */
export async function fetchAccountStats(): Promise<AccountStats | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.rpc("get_account_stats");

  if (error) throw new Error(error.message);
  if (!data) return null;

  const raw = data as Record<string, unknown>;
  const rawBuckets = Array.isArray(raw.byBucket) ? raw.byBucket : [];

  return {
    testsCompleted: Number(raw.testsCompleted ?? 0),
    totalDurationSec: Number(raw.totalDurationSec ?? 0),
    bestWpm: Number(raw.bestWpm ?? 0),
    avgWpm: Number(raw.avgWpm ?? 0),
    bestAccuracy: Number(raw.bestAccuracy ?? 0),
    avgAccuracy: Number(raw.avgAccuracy ?? 0),
    byBucket: rawBuckets.map((row): AccountStatsBucket => {
      const r = row as Record<string, unknown>;
      const difficulty = r.difficulty as Difficulty;
      return {
        durationSec: Number(r.duration_sec ?? 0),
        difficulty: VALID_DIFFICULTIES.has(difficulty) ? difficulty : "easy",
        tests: Number(r.tests ?? 0),
        bestWpm: Number(r.best_wpm ?? 0),
        avgWpm: Number(r.avg_wpm ?? 0),
        bestAccuracy: Number(r.best_accuracy ?? 0),
        avgAccuracy: Number(r.avg_accuracy ?? 0),
      };
    }),
  };
}
