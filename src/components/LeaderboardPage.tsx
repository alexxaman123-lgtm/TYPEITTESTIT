import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchLeaderboardScores, type LeaderboardScore } from "../lib/leaderboard";
import { cn } from "../utils/cn";

type SortMode = "wpm" | "accuracy";
type DifficultyFilter = "all" | "easy" | "medium" | "hard";
type DurationFilter = "all" | "60" | "120" | "180" | "300";

const SORT_LABELS: Record<SortMode, string> = {
  wpm: "Top WPM",
  accuracy: "Top Accuracy",
};

const MIN_LEADERBOARD_ACCURACY = 95;

export default function LeaderboardPage() {
  const [scores, setScores] = useState<LeaderboardScore[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("wpm");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [duration, setDuration] = useState<DurationFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setScores(await fetchLeaderboardScores());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the leaderboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredScores = useMemo(() => {
    const filtered = scores.filter((score) => {
      if (score.accuracy < MIN_LEADERBOARD_ACCURACY) return false;

      const difficultyMatch = difficulty === "all" || score.difficulty === difficulty;
      const durationMatch = duration === "all" || score.duration_sec === Number(duration);
      return difficultyMatch && durationMatch;
    });

    // Public rankings always contain one entry per account.
    // Keep the strongest qualifying performance for the active view.
    const bestByUser = new Map<string, LeaderboardScore>();

    for (const score of filtered) {
      const existing = bestByUser.get(score.user_id);
      if (!existing) {
        bestByUser.set(score.user_id, score);
        continue;
      }

      const isBetter =
        sortMode === "accuracy"
          ? score.accuracy > existing.accuracy ||
            (score.accuracy === existing.accuracy && score.wpm > existing.wpm)
          : score.wpm > existing.wpm ||
            (score.wpm === existing.wpm && score.accuracy > existing.accuracy);

      if (isBetter) bestByUser.set(score.user_id, score);
    }

    return [...bestByUser.values()].sort((a, b) => {
      if (sortMode === "accuracy") {
        return b.accuracy - a.accuracy || b.wpm - a.wpm || a.username.localeCompare(b.username);
      }
      return b.wpm - a.wpm || b.accuracy - a.accuracy || a.username.localeCompare(b.username);
    });
  }, [scores, sortMode, difficulty, duration]);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-white/10 bg-surface1/75 p-5 shadow-[0_0_70px_-24px_rgba(0,0,0,0.7)] backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-5 border-b border-white/8 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-faint">GOATTYPE</span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Leaderboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              See the fastest and most accurate GOATTYPE typists. One account earns one leaderboard position, with difficulty and test-duration filters.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="rounded-lg border border-white/12 bg-surface2 px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-accent/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSortMode(mode)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors",
                  sortMode === mode
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-white/10 bg-surface2 text-muted hover:border-accent/30 hover:text-ink"
                )}
              >
                {SORT_LABELS[mode]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterSelect
              label="Difficulty"
              value={difficulty}
              onChange={(value) => setDifficulty(value as DifficultyFilter)}
              options={[
                ["all", "All difficulties"],
                ["easy", "Easy"],
                ["medium", "Medium"],
                ["hard", "Hard"],
              ]}
            />
            <FilterSelect
              label="Duration"
              value={duration}
              onChange={(value) => setDuration(value as DurationFilter)}
              options={[
                ["all", "All durations"],
                ["60", "1 min"],
                ["120", "2 min"],
                ["180", "3 min"],
                ["300", "5 min"],
              ]}
            />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-surface2/50">
          <div className="grid grid-cols-[48px_minmax(150px,1fr)_100px_105px_110px_95px] gap-3 border-b border-white/8 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-faint sm:px-5">
            <span>#</span>
            <span>Username</span>
            <span className="text-right">WPM</span>
            <span className="text-right">Accuracy</span>
            <span className="text-right">Words</span>
            <span className="text-right">Test</span>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-sm text-muted">Loading leaderboard…</div>
          ) : error ? (
            <div className="px-5 py-12 text-center text-sm text-muted">
              <p>Could not load leaderboard data.</p>
              <p className="mt-2 text-xs text-faint">Run the Supabase leaderboard SQL setup first, then refresh.</p>
            </div>
          ) : filteredScores.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-muted">
              No leaderboard scores match these filters yet.
            </div>
          ) : (
            filteredScores.map((score, index) => (
              <LeaderboardRow key={score.user_id} rank={index + 1} score={score} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function LeaderboardRow({ rank, score }: { rank: number; score: LeaderboardScore }) {
  return (
    <div className="grid grid-cols-[48px_minmax(150px,1fr)_100px_105px_110px_95px] gap-3 border-b border-white/6 px-4 py-4 last:border-b-0 sm:px-5">
      <div className="font-mono text-sm font-bold text-faint">{rank}</div>
      <div className="min-w-0">
        <div className="truncate text-sm font-bold text-ink">{score.username}</div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-faint">{score.difficulty}</div>
      </div>
      <div className="text-right font-mono text-sm font-bold text-accent">{score.wpm.toFixed(1)}</div>
      <div className="text-right font-mono text-sm font-bold text-ink-soft">{score.accuracy.toFixed(2)}%</div>
      <div className="text-right font-mono text-sm text-muted">{score.words_written.toFixed(1)}</div>
      <div className="text-right text-sm text-muted">{score.duration_sec / 60} min</div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-xs text-muted">
      <span className="uppercase tracking-[0.12em] text-faint">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent font-semibold text-ink outline-none"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option
            key={optionValue}
            value={optionValue}
            style={{ backgroundColor: "var(--color-surface3)", color: "var(--color-ink)" }}
          >
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
