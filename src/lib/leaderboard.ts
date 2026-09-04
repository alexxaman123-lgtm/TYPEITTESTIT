import { supabase } from "../supabaseClient";
import type { Difficulty } from "../data/texts";

export interface LeaderboardScore {
  user_id: string;
  username: string;
  difficulty: Difficulty;
  duration_sec: number;
  wpm: number;
  accuracy: number;
  words_written: number;
  correct_chars: number;
  incorrect_chars: number;
  total_typed: number;
  submitted_at: string;
}

export interface LeaderboardResultInput {
  difficulty: Difficulty;
  durationSec: number;
  wpm: number;
  accuracy: number;
  wordsWritten: number;
  correctChars: number;
  incorrectChars: number;
  totalTyped: number;
}

type LeaderboardScoreRow = {
  user_id: string;
  difficulty: Difficulty | string;
  duration_sec: number | string;
  wpm: number | string;
  accuracy: number | string;
  words_written: number | string;
  correct_chars: number | string;
  incorrect_chars: number | string;
  total_typed: number | string;
  submitted_at: string;
};

type ProfileRow = {
  user_id: string;
  username: string | null;
};

const VALID_DIFFICULTIES = new Set<Difficulty>(["easy", "medium", "hard"]);
const VALID_DURATIONS = new Set([60, 120, 180, 300]);

export async function saveLeaderboardScore(result: LeaderboardResultInput): Promise<boolean> {
  if (
    !VALID_DIFFICULTIES.has(result.difficulty) ||
    !VALID_DURATIONS.has(result.durationSec) ||
    !Number.isFinite(result.wpm) ||
    !Number.isFinite(result.accuracy) ||
    result.wpm < 0 ||
    result.accuracy < 0 ||
    result.accuracy > 100
  ) {
    return false;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const language = typeof document !== "undefined" && document.documentElement.lang === "es" ? "es" : "en";

  const { data, error } = await supabase.rpc("submit_leaderboard_score", {
    p_difficulty: result.difficulty,
    p_duration_sec: result.durationSec,
    p_wpm: result.wpm,
    p_accuracy: result.accuracy,
    p_words_written: result.wordsWritten,
    p_correct_chars: result.correctChars,
    p_incorrect_chars: result.incorrectChars,
    p_total_typed: result.totalTyped,
  });

  const { error: historyError } = await supabase.from("typing_history").insert({
    user_id: user.id,
    difficulty: result.difficulty,
    duration_sec: result.durationSec,
    target_duration_sec: result.durationSec,
    wpm: result.wpm,
    accuracy: result.accuracy,
    words_written: result.wordsWritten,
    correct_chars: result.correctChars,
    incorrect_chars: result.incorrectChars,
    total_typed: result.totalTyped,
    language,
    is_custom: false,
  });

  if (historyError) {
    console.error("Could not save typing history:", historyError.message);
  }

  if (error) {
    console.error("Could not save leaderboard score:", error.message);
    return false;
  }

  return data === true;
}

export async function getProfileBest(
  difficulty: Difficulty,
  durationSec: number,
): Promise<{ wpm: number; accuracy: number } | null> {
  if (!VALID_DIFFICULTIES.has(difficulty) || !VALID_DURATIONS.has(durationSec)) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("leaderboard_scores")
    .select("wpm, accuracy")
    .eq("user_id", user.id)
    .eq("difficulty", difficulty)
    .eq("duration_sec", durationSec)
    .maybeSingle();

  if (error) {
    console.error("Could not load profile best:", error.message);
    return null;
  }

  if (!data) return null;

  return {
    wpm: Number(data.wpm),
    accuracy: Number(data.accuracy),
  };
}

export async function fetchLeaderboardScores(): Promise<LeaderboardScore[]> {
  const { data: scores, error: scoreError } = await supabase
    .from("leaderboard_scores")
    .select(
      "user_id, difficulty, duration_sec, wpm, accuracy, words_written, correct_chars, incorrect_chars, total_typed, submitted_at",
    )
    .order("wpm", { ascending: false })
    .order("accuracy", { ascending: false });

  if (scoreError) throw new Error(scoreError.message);
  const scoreRows = (scores ?? []) as unknown as LeaderboardScoreRow[];
  if (!scoreRows.length) return [];

  const userIds = [...new Set(scoreRows.map((score: LeaderboardScoreRow) => score.user_id))];
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("user_id, username")
    .in("user_id", userIds);

  if (profileError) throw new Error(profileError.message);

  const usernames = new Map<string, string>();
  for (const profile of (profiles ?? []) as unknown as ProfileRow[]) {
    if (typeof profile.username === "string" && profile.username.trim()) {
      usernames.set(profile.user_id, profile.username.trim());
    }
  }

  return scoreRows
    .map((score: LeaderboardScoreRow) => ({
      user_id: score.user_id,
      username: usernames.get(score.user_id) ?? "Anonymous",
      difficulty: score.difficulty as Difficulty,
      duration_sec: Number(score.duration_sec),
      wpm: Number(score.wpm),
      accuracy: Number(score.accuracy),
      words_written: Number(score.words_written),
      correct_chars: Number(score.correct_chars),
      incorrect_chars: Number(score.incorrect_chars),
      total_typed: Number(score.total_typed),
      submitted_at: score.submitted_at,
    }))
    .filter((score) => score.username !== "Anonymous");
}
