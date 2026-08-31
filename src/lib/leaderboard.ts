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

const VALID_DIFFICULTIES = new Set<Difficulty>(["easy", "medium", "hard"]);
const VALID_DURATIONS = new Set([60, 120, 180, 300]);

export async function saveLeaderboardScore(result: LeaderboardResultInput): Promise<void> {
  if (
    !VALID_DIFFICULTIES.has(result.difficulty) ||
    !VALID_DURATIONS.has(result.durationSec) ||
    !Number.isFinite(result.wpm) ||
    !Number.isFinite(result.accuracy) ||
    result.wpm < 0 ||
    result.accuracy < 0 ||
    result.accuracy > 100
  ) {
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data: current, error: currentError } = await supabase
    .from("leaderboard_scores")
    .select("wpm, accuracy")
    .eq("user_id", user.id)
    .eq("difficulty", result.difficulty)
    .eq("duration_sec", result.durationSec)
    .maybeSingle();

  if (currentError) {
    console.error("Could not read leaderboard score:", currentError.message);
    return;
  }

  const currentWpm = Number(current?.wpm ?? -1);
  const currentAccuracy = Number(current?.accuracy ?? -1);

  const isBetter =
    !current ||
    result.wpm > currentWpm ||
    (result.wpm === currentWpm && result.accuracy > currentAccuracy);

  if (!isBetter) return;

  const { error } = await supabase.from("leaderboard_scores").upsert(
    {
      user_id: user.id,
      difficulty: result.difficulty,
      duration_sec: result.durationSec,
      wpm: result.wpm,
      accuracy: result.accuracy,
      words_written: result.wordsWritten,
      correct_chars: result.correctChars,
      incorrect_chars: result.incorrectChars,
      total_typed: result.totalTyped,
      submitted_at: new Date().toISOString(),
    },
    { onConflict: "user_id,difficulty,duration_sec" },
  );

  if (error) {
    console.error("Could not save leaderboard score:", error.message);
  }
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
  if (!scores?.length) return [];

  const userIds = [...new Set(scores.map((score) => score.user_id))];
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select("user_id, username")
    .in("user_id", userIds);

  if (profileError) throw new Error(profileError.message);

  const usernames = new Map<string, string>();
  for (const profile of profiles ?? []) {
    if (typeof profile.username === "string" && profile.username.trim()) {
      usernames.set(profile.user_id, profile.username.trim());
    }
  }

  return scores
    .map((score) => ({
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
