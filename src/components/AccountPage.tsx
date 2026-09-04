import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { fetchTypingHistory, type TypingHistoryEntry } from "../lib/typingHistory";
import AuthModal from "./AuthModal";
import type { Locale } from "../lib/i18n";

interface AccountPageProps {
  locale?: Locale;
}

export default function AccountPage({ locale = "en" }: AccountPageProps) {
  const isSpanish = locale === "es";
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<TypingHistoryEntry[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!mounted) return;

        if (authError || !user) {
          setSignedIn(false);
          setUsername(null);
          setEntries([]);
          setLoading(false);
          return;
        }

        setSignedIn(true);

        const [{ data: profile }, historyResult] = await Promise.all([
          supabase.from("profiles").select("username").eq("user_id", user.id).maybeSingle(),
          fetchTypingHistory(50),
        ]);

        if (!mounted) return;

        setUsername(profile?.username?.trim() || user.user_metadata?.username?.trim() || null);
        setEntries(historyResult);
      } catch (loadError) {
        if (!mounted) return;
        console.error("Could not load typing history:", loadError);
        setEntries([]);
        setError(
          isSpanish
            ? "No se pudo cargar tu historial. Comprueba la configuración de tu cuenta y vuelve a intentarlo."
            : "We couldn't load your typing history. Check your account setup and try again."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT") {
        setSignedIn(false);
        setUsername(null);
        setEntries([]);
        setError(null);
        setLoading(false);
        return;
      }
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "USER_UPDATED") {
        void load();
        if (event === "SIGNED_IN") setAuthOpen(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isSpanish]);

  const bestWpm = entries.reduce<TypingHistoryEntry | null>(
    (best, entry) => (!best || entry.wpm > best.wpm ? entry : best),
    null,
  );
  const bestAccuracy = entries.reduce<TypingHistoryEntry | null>(
    (best, entry) => (!best || entry.accuracy > best.accuracy ? entry : best),
    null,
  );

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-hairline bg-canvas p-5 shadow-sm sm:p-8">
        {!loading && !signedIn ? (
          <div className="mx-auto max-w-xl py-16 text-center">
            <p className="font-label uppercase tracking-[0.2em] text-text-muted">
              {isSpanish ? "Tu cuenta" : "Your account"}
            </p>
            <h1 className="mt-3 font-heading-2 text-ink">
              {isSpanish ? "Guarda tu progreso de escritura" : "Keep your typing progress"}
            </h1>
            <p className="mx-auto mt-4 max-w-lg font-body text-text-muted">
              {isSpanish
                ? "Inicia sesión para ver tu historial de pruebas, tus mejores resultados y tu progreso personal."
                : "Sign in to view your test history, personal bests, and typing progress."}
            </p>
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="mt-8 rounded-full bg-primary px-6 py-3 font-link text-on-primary"
            >
              {isSpanish ? "Iniciar sesión" : "Sign in"}
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 border-b border-hairline pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-label uppercase tracking-[0.2em] text-text-muted">
                  {isSpanish ? "Cuenta" : "Account"}
                </p>
                <h1 className="mt-2 font-heading-2 text-ink">
                  {isSpanish ? "Historial de escritura" : "Typing History"}
                </h1>
                <p className="mt-2 font-body text-text-muted">
                  {username || (isSpanish ? "Tu progreso personal" : "Your personal progress")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-full border border-hairline px-4 py-2 font-link text-ink hover:bg-canvas-soft"
              >
                {isSpanish ? "Actualizar" : "Refresh"}
              </button>
            </div>

            {error ? (
              <div className="rounded-2xl border border-hairline bg-canvas-soft px-5 py-10 text-center">
                <p className="font-body text-text-muted">{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-5 rounded-full border border-hairline px-4 py-2 font-link text-ink hover:bg-canvas"
                >
                  {isSpanish ? "Volver a intentar" : "Try again"}
                </button>
              </div>
            ) : (
              <>
                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <MetricCard
                    label={isSpanish ? "Mejor WPM" : "Best WPM"}
                    value={bestWpm ? bestWpm.wpm.toFixed(1) : "—"}
                    suffix=" WPM"
                  />
                  <MetricCard
                    label={isSpanish ? "Mejor precisión" : "Best accuracy"}
                    value={bestAccuracy ? bestAccuracy.accuracy.toFixed(2) : "—"}
                    suffix="%"
                  />
                </div>

                <ProgressGraph entries={entries} locale={locale} />

                <div className="mt-8 overflow-hidden rounded-2xl border border-hairline">
                  <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_1fr] gap-2 border-b border-hairline bg-canvas-soft px-4 py-3 font-label uppercase tracking-[0.12em] text-text-muted sm:px-5">
                    <span>{isSpanish ? "Fecha" : "Date"}</span>
                    <span className="text-right">WPM</span>
                    <span className="text-right">{isSpanish ? "Precisión" : "Accuracy"}</span>
                    <span className="text-right">{isSpanish ? "Errores" : "Errors"}</span>
                    <span className="text-right">{isSpanish ? "Prueba" : "Test"}</span>
                  </div>
                  {loading ? (
                    <div className="px-5 py-12 text-center font-body text-text-muted">
                      {isSpanish ? "Cargando…" : "Loading…"}
                    </div>
                  ) : entries.length === 0 ? (
                    <div className="px-5 py-12 text-center font-body text-text-muted">
                      {isSpanish
                        ? "Completa una prueba de al menos un minuto para empezar tu historial."
                        : "Complete a test of at least one minute to start your history."}
                    </div>
                  ) : (
                    entries.map((entry) => <HistoryRow key={entry.id} entry={entry} locale={locale} />)
                  )}
                </div>
              </>
            )}
          </>
        )}
      </section>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} locale={locale} />
    </main>
  );
}

function MetricCard({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="rounded-2xl border border-hairline bg-canvas-soft p-5">
      <p className="font-label uppercase tracking-[0.14em] text-text-muted">{label}</p>
      <p className="mt-2 font-heading-3 text-ink">
        {value}
        <span className="text-base font-semibold text-text-muted">{suffix}</span>
      </p>
    </div>
  );
}

function ProgressGraph({ entries, locale }: { entries: TypingHistoryEntry[]; locale: Locale }) {
  if (!entries.length) {
    return null;
  }

  const points = entries.slice(0, 30).reverse();
  const width = 980;
  const height = 330;
  const pad = { top: 26, right: 74, bottom: 56, left: 58 };
  const chartWidth = width - pad.left - pad.right;
  const chartHeight = height - pad.top - pad.bottom;

  const rawWpm = points.map((entry) => entry.wpm);
  const wpmMin = Math.floor(Math.min(...rawWpm, 0));
  const wpmMax = Math.ceil(Math.max(...rawWpm, 60));
  const wpmSpan = Math.max(20, wpmMax - wpmMin);

  const xFor = (index: number) =>
    points.length === 1 ? pad.left + chartWidth / 2 : pad.left + (index / (points.length - 1)) * chartWidth;
  const yForWpm = (wpm: number) => pad.top + chartHeight - ((wpm - wpmMin) / wpmSpan) * chartHeight;
  const yForAccuracy = (accuracy: number) => pad.top + chartHeight - (accuracy / 100) * chartHeight;

  const wpmPath = points.map((entry, index) => `${xFor(index)},${yForWpm(entry.wpm)}`).join(" ");
  const accuracyPath = points.map((entry, index) => `${xFor(index)},${yForAccuracy(entry.accuracy)}`).join(" ");

  const wpmTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => wpmMin + wpmSpan * ratio);
  const accuracyTicks = [0, 25, 50, 75, 100];
  const labelIndexes = points.length <= 6
    ? points.map((_, index) => index)
    : [0, Math.floor((points.length - 1) / 3), Math.floor(((points.length - 1) * 2) / 3), points.length - 1];

  return (
    <div className="mt-8 rounded-2xl border border-hairline bg-canvas-soft p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-label uppercase tracking-[0.16em] text-text-muted">
            {locale === "es" ? "Progreso" : "Progress"}
          </p>
          <h2 className="mt-1 font-heading-3 text-ink">
            {locale === "es" ? "Velocidad y precisión" : "Speed & accuracy"}
          </h2>
        </div>
        <div className="flex items-center gap-4 font-label text-text-muted">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
            WPM
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-ink" aria-hidden="true" />
            {locale === "es" ? "Precisión" : "Accuracy"}
          </span>
          <span className="hidden text-text-faint sm:inline">
            {locale === "es" ? "Últimas 30 pruebas" : "Last 30 tests"}
          </span>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={
            locale === "es"
              ? "Gráfico de WPM y precisión de las últimas 30 pruebas"
              : "WPM and accuracy graph for the last 30 tests"
          }
          className="min-w-[720px] w-full"
        >
          {wpmTicks.map((tick, index) => {
            const y = yForWpm(tick);
            return (
              <g key={`wpm-${index}`}>
                <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="currentColor" className="text-hairline" strokeWidth="1" />
                <text x={pad.left - 10} y={y + 4} textAnchor="end" fontSize="11" className="fill-text-muted">
                  {Math.round(tick)}
                </text>
                <text x={width - pad.right + 10} y={y + 4} textAnchor="start" fontSize="11" className="fill-text-muted">
                  {accuracyTicks[index]}%
                </text>
              </g>
            );
          })}

          <line x1={pad.left} x2={pad.left} y1={pad.top} y2={pad.top + chartHeight} stroke="currentColor" className="text-hairline" />
          <line x1={width - pad.right} x2={width - pad.right} y1={pad.top} y2={pad.top + chartHeight} stroke="currentColor" className="text-hairline" />
          <line x1={pad.left} x2={width - pad.right} y1={pad.top + chartHeight} y2={pad.top + chartHeight} stroke="currentColor" className="text-hairline" />

          <polyline points={wpmPath} fill="none" stroke="currentColor" className="text-primary" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <polyline points={accuracyPath} fill="none" stroke="currentColor" className="text-ink" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />

          {points.map((entry, index) => {
            const x = xFor(index);
            const yWpm = yForWpm(entry.wpm);
            const yAccuracy = yForAccuracy(entry.accuracy);
            const showLabel = labelIndexes.includes(index);
            return (
              <g key={entry.id}>
                <circle cx={x} cy={yWpm} r="3.5" fill="currentColor" className="text-primary">
                  <title>{`${entry.wpm.toFixed(1)} WPM`}</title>
                </circle>
                <circle cx={x} cy={yAccuracy} r="3" fill="currentColor" className="text-ink">
                  <title>{`${entry.accuracy.toFixed(2)}% ${locale === "es" ? "precisión" : "accuracy"}`}</title>
                </circle>
                {showLabel && (
                  <text x={x} y={height - 20} textAnchor="middle" fontSize="11" className="fill-text-muted">
                    {new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
                      month: "short",
                      day: "numeric",
                    }).format(new Date(entry.completedAt))}
                  </text>
                )}
              </g>
            );
          })}

          <text x={pad.left - 10} y={pad.top - 9} textAnchor="end" fontSize="10" className="fill-text-faint">
            WPM
          </text>
          <text x={width - pad.right + 10} y={pad.top - 9} fontSize="10" className="fill-text-faint">
            {locale === "es" ? "% precisión" : "% accuracy"}
          </text>
        </svg>
      </div>
    </div>
  );
}

function HistoryRow({ entry, locale }: { entry: TypingHistoryEntry; locale: Locale }) {
  const date = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(entry.completedAt));
  const errors = Math.max(0, entry.incorrectChars);
  const testLabel = entry.isCustom
    ? locale === "es"
      ? "Personalizada"
      : "Custom"
    : `${entry.durationSec / 60} min · ${entry.difficulty}`;

  return (
    <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_1fr] gap-2 border-b border-hairline px-4 py-4 last:border-b-0 sm:px-5">
      <span className="truncate font-body-sm text-text-muted">{date}</span>
      <span className="text-right font-mono text-sm font-semibold text-accent">{entry.wpm.toFixed(1)}</span>
      <span className="text-right font-mono text-sm text-ink-soft">{entry.accuracy.toFixed(2)}%</span>
      <span className="text-right font-mono text-sm text-text-muted">{errors}</span>
      <span className="truncate text-right font-body-sm capitalize text-text-muted">{testLabel}</span>
    </div>
  );
}
