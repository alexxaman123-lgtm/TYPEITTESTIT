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

  const { error } = await supabase.from("typing_history").insert({
    user_id: user.id,
    difficulty: result.difficulty,
    duration_sec: result.durationSec,
    target_duration_sec: result.targetDurationSec,
    wpm: result.wpm,
    accuracy: result.accuracy,
    words_written: result.wordsWritten,
    correct_chars: result.correctChars,
    incorrect_chars: result.incorrectChars,
    total_typed: result.totalTyped,
    language: result.language,
    is_custom: result.isCustom,
  });

  if (error) {
    console.error("Could not save typing history:", error.message);
    return false;
  }

  return true;
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
