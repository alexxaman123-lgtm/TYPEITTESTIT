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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
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

  const bestWpm = entries.reduce<TypingHistoryEntry | null>((best, entry) => (!best || entry.wpm > best.wpm ? entry : best), null);
  const bestAccuracy = entries.reduce<TypingHistoryEntry | null>((best, entry) => (!best || entry.accuracy > best.accuracy ? entry : best), null);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-hairline bg-canvas p-5 shadow-sm sm:p-8">
        {!loading && !signedIn ? (
          <div className="mx-auto max-w-xl py-16 text-center">
            <p className="font-label uppercase tracking-[0.2em] text-text-muted">{isSpanish ? "Tu cuenta" : "Your account"}</p>
            <h1 className="mt-3 font-heading-2 text-ink">{isSpanish ? "Guarda tu progreso de escritura" : "Keep your typing progress"}</h1>
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
                <p className="font-label uppercase tracking-[0.2em] text-text-muted">{isSpanish ? "Cuenta" : "Account"}</p>
                <h1 className="mt-2 font-heading-2 text-ink">{isSpanish ? "Historial de escritura" : "Typing History"}</h1>
                <p className="mt-2 font-body text-text-muted">{username || (isSpanish ? "Tu progreso personal" : "Your personal progress")}</p>
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
                  <MetricCard label={isSpanish ? "Mejor WPM" : "Best WPM"} value={bestWpm ? bestWpm.wpm.toFixed(1) : "—"} suffix=" WPM" />
                  <MetricCard label={isSpanish ? "Mejor precisión" : "Best accuracy"} value={bestAccuracy ? bestAccuracy.accuracy.toFixed(2) : "—"} suffix="%" />
                </div>

                <div className="mt-8 overflow-hidden rounded-2xl border border-hairline">
                  <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_1fr] gap-2 border-b border-hairline bg-canvas-soft px-4 py-3 font-label uppercase tracking-[0.12em] text-text-muted sm:px-5">
                    <span>{isSpanish ? "Fecha" : "Date"}</span>
                    <span className="text-right">WPM</span>
                    <span className="text-right">{isSpanish ? "Precisión" : "Accuracy"}</span>
                    <span className="text-right">{isSpanish ? "Errores" : "Errors"}</span>
                    <span className="text-right">{isSpanish ? "Prueba" : "Test"}</span>
                  </div>
                  {loading ? (
                    <div className="px-5 py-12 text-center font-body text-text-muted">{isSpanish ? "Cargando…" : "Loading…"}</div>
                  ) : entries.length === 0 ? (
                    <div className="px-5 py-12 text-center font-body text-text-muted">
                      {isSpanish ? "Completa una prueba de al menos un minuto para empezar tu historial." : "Complete a test of at least one minute to start your history."}
                    </div>
                  ) : (
                    entries.map((entry) => (
                      <HistoryRow key={entry.id} entry={entry} locale={locale} />
                    ))
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
      <p className="mt-2 font-heading-3 text-ink">{value}<span className="text-base font-semibold text-text-muted">{suffix}</span></p>
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
    ? (locale === "es" ? "Personalizada" : "Custom")
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
