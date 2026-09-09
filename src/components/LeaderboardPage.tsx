import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchLeaderboardScores, type LeaderboardScore } from "../lib/leaderboard";
import { cn } from "../utils/cn";
import type { Locale } from "../lib/i18n";

type SortMode = "wpm" | "accuracy";
type DifficultyFilter = "all" | "easy" | "medium" | "hard";
type DurationFilter = "all" | "60" | "120" | "180" | "300";

const MIN_LEADERBOARD_ACCURACY = 95;

const TEXT: Record<Locale, {
  brand: string;
  title: string;
  subtitle: string;
  refresh: string;
  refreshing: string;
  sortWpm: string;
  sortAccuracy: string;
  difficultyLabel: string;
  durationLabel: string;
  allDifficulties: string;
  easy: string;
  medium: string;
  hard: string;
  allDurations: string;
  columnRank: string;
  columnUsername: string;
  columnWpm: string;
  columnAccuracy: string;
  columnWords: string;
  columnTest: string;
  loading: string;
  errorTitle: string;
  errorHint: string;
  noResults: string;
}> = {
  en: {
    brand: "FreeTypingTestGoat",
    title: "Typing Test Leaderboard",
    subtitle: "See the fastest and most accurate FreeTypingTestGoat typists. One account earns one leaderboard position, with difficulty and test-duration filters.",
    refresh: "Refresh",
    refreshing: "Refreshing\u2026",
    sortWpm: "Top WPM",
    sortAccuracy: "Top Accuracy",
    difficultyLabel: "Difficulty",
    durationLabel: "Duration",
    allDifficulties: "All difficulties",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    allDurations: "All durations",
    columnRank: "#",
    columnUsername: "Username",
    columnWpm: "WPM",
    columnAccuracy: "Accuracy",
    columnWords: "Words",
    columnTest: "Test",
    loading: "Loading leaderboard\u2026",
    errorTitle: "Could not load leaderboard data.",
    errorHint: "Run the Supabase leaderboard SQL setup first, then refresh.",
    noResults: "No leaderboard scores match these filters yet.",
  },
  es: {
    brand: "Test de mecanografía Cabra",
    title: "Clasificación del test de mecanografía",
    subtitle: "Consulta a los usuarios más rápidos y precisos. Cada cuenta ocupa una sola posición, con filtros por dificultad y duración.",
    refresh: "Actualizar",
    refreshing: "Actualizando\u2026",
    sortWpm: "Mejor WPM",
    sortAccuracy: "Mejor precisión",
    difficultyLabel: "Dificultad",
    durationLabel: "Duración",
    allDifficulties: "Todas las dificultades",
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
    allDurations: "Todas las duraciones",
    columnRank: "#",
    columnUsername: "Usuario",
    columnWpm: "WPM",
    columnAccuracy: "Precisión",
    columnWords: "Palabras",
    columnTest: "Prueba",
    loading: "Cargando clasificación\u2026",
    errorTitle: "No se pudieron cargar los datos.",
    errorHint: "Comprueba la configuración de la clasificación en Supabase y vuelve a actualizar.",
    noResults: "Todavía no hay resultados que coincidan con estos filtros.",
  },
};

export default function LeaderboardPage({ locale = "en" as Locale }: { locale?: Locale }) {
  const t = TEXT[locale];
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
      setError(err instanceof Error ? err.message : t.errorTitle);
    } finally {
      setLoading(false);
    }
  }, [t.errorTitle]);

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

  const difficultyLabel = (value: LeaderboardScore["difficulty"]) =>
    value === "easy" ? t.easy : value === "medium" ? t.medium : t.hard;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-white/10 bg-surface1/75 p-5 shadow-[0_0_70px_-24px_rgba(0,0,0,0.7)] backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-5 border-b border-white/8 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-faint">{t.brand}</span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{t.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{t.subtitle}</p>
          </div>

          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="rounded-lg border border-white/12 bg-surface2 px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:border-accent/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? t.refreshing : t.refresh}
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {(["wpm", "accuracy"] as SortMode[]).map((mode) => (
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
                {mode === "wpm" ? t.sortWpm : t.sortAccuracy}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterSelect
              label={t.difficultyLabel}
              value={difficulty}
              onChange={(value) => setDifficulty(value as DifficultyFilter)}
              options={[
                ["all", t.allDifficulties],
                ["easy", t.easy],
                ["medium", t.medium],
                ["hard", t.hard],
              ]}
            />
            <FilterSelect
              label={t.durationLabel}
              value={duration}
              onChange={(value) => setDuration(value as DurationFilter)}
              options={[
                ["all", t.allDurations],
                ["60", "1 min"],
                ["120", "2 min"],
                ["180", "3 min"],
                ["300", "5 min"],
              ]}
            />
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-surface2/50">
          <div className="grid grid-cols-[32px_minmax(100px,1fr)_65px_80px_80px_75px] gap-2 border-b border-white/8 px-3 py-3 text-[9px] font-bold uppercase tracking-[0.12em] text-faint sm:grid-cols-[48px_minmax(150px,1fr)_100px_105px_110px_95px] sm:gap-3 sm:px-5 sm:text-[10px] sm:tracking-[0.16em]">
            <span>{t.columnRank}</span>
            <span>{t.columnUsername}</span>
            <span className="text-right">{t.columnWpm}</span>
            <span className="text-right">{t.columnAccuracy}</span>
            <span className="text-right">{t.columnWords}</span>
            <span className="text-right">{t.columnTest}</span>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-sm text-muted">{t.loading}</div>
          ) : error ? (
            <div className="px-5 py-12 text-center text-sm text-muted">
              <p>{t.errorTitle}</p>
              <p className="mt-2 text-xs text-faint">{t.errorHint}</p>
            </div>
          ) : filteredScores.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-muted">{t.noResults}</div>
          ) : (
            filteredScores.map((score, index) => (
              <LeaderboardRow key={score.user_id} rank={index + 1} score={score} difficultyLabel={difficultyLabel(score.difficulty)} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}

function LeaderboardRow({ rank, score, difficultyLabel }: { rank: number; score: LeaderboardScore; difficultyLabel: string }) {
  return (
    <div className="grid grid-cols-[32px_minmax(100px,1fr)_65px_80px_80px_75px] gap-2 border-b border-white/6 px-3 py-4 last:border-b-0 sm:grid-cols-[48px_minmax(150px,1fr)_100px_105px_110px_95px] sm:gap-3 sm:px-5">
      <div className="font-mono text-xs font-bold text-faint sm:text-sm">{rank}</div>
      <div className="min-w-0">
        <div className="truncate text-xs font-bold text-ink sm:text-sm">{score.username}</div>
        <div className="mt-1 text-[9px] uppercase tracking-[0.1em] text-faint sm:text-[10px] sm:tracking-[0.12em]">{difficultyLabel}</div>
      </div>
      <div className="text-right font-mono text-xs font-bold text-accent sm:text-sm">{score.wpm.toFixed(1)}</div>
      <div className="text-right font-mono text-xs font-bold text-ink-soft sm:text-sm">{score.accuracy.toFixed(2)}%</div>
      <div className="text-right font-mono text-xs text-muted sm:text-sm">{score.words_written.toFixed(1)}</div>
      <div className="text-right text-xs text-muted sm:text-sm">{score.duration_sec / 60} min</div>
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
