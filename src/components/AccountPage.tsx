import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { fetchTypingHistory, type TypingHistoryEntry } from "../lib/typingHistory";
import AuthModal from "./AuthModal";
import type { Locale } from "../lib/i18n";

interface AccountPageProps { locale?: Locale; }

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
      setLoading(true); setError(null);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (!mounted) return;
        if (authError || !user) { setSignedIn(false); setUsername(null); setEntries([]); setLoading(false); return; }
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
        setError(isSpanish ? "No se pudo cargar tu historial. Comprueba la configuración de tu cuenta y vuelve a intentarlo." : "We couldn't load your typing history. Check your account setup and try again.");
      } finally { if (mounted) setLoading(false); }
    };
    void load();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT") { setSignedIn(false); setUsername(null); setEntries([]); setError(null); setLoading(false); return; }
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "USER_UPDATED") { void load(); if (event === "SIGNED_IN") setAuthOpen(false); }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
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
            <p className="mx-auto mt-4 max-w-lg font-body text-text-muted">{isSpanish ? "Inicia sesión para ver tu historial de pruebas, tus mejores resultados y tu progreso personal." : "Sign in to view your test history, personal bests, and typing progress."}</p>
            <button type="button" onClick={() => setAuthOpen(true)} className="mt-8 rounded-full bg-primary px-6 py-3 font-link text-on-primary">{isSpanish ? "Iniciar sesión" : "Sign in"}</button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4 border-b border-hairline pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="font-label uppercase tracking-[0.2em] text-text-muted">{isSpanish ? "Cuenta" : "Account"}</p><h1 className="mt-2 font-heading-2 text-ink">{isSpanish ? "Historial de escritura" : "Typing History"}</h1><p className="mt-2 font-body text-text-muted">{username || (isSpanish ? "Tu progreso personal" : "Your personal progress")}</p></div>
              <button type="button" onClick={() => window.location.reload()} className="rounded-full border border-hairline px-4 py-2 font-link text-ink hover:bg-canvas-soft">{isSpanish ? "Actualizar" : "Refresh"}</button>
            </div>
            {error ? (
              <div className="rounded-2xl border border-hairline bg-canvas-soft px-5 py-10 text-center"><p className="font-body text-text-muted">{error}</p><button type="button" onClick={() => window.location.reload()} className="mt-5 rounded-full border border-hairline px-4 py-2 font-link text-ink hover:bg-canvas">{isSpanish ? "Volver a intentar" : "Try again"}</button></div>
            ) : (
              <>
                <div className="mt-7 grid gap-4 sm:grid-cols-2"><MetricCard label={isSpanish ? "Mejor WPM" : "Best WPM"} value={bestWpm ? bestWpm.wpm.toFixed(1) : "—"} suffix=" WPM" /><MetricCard label={isSpanish ? "Mejor precisión" : "Best accuracy"} value={bestAccuracy ? bestAccuracy.accuracy.toFixed(2) : "—"} suffix="%" /></div>
                <ProgressGraph entries={entries} locale={locale} />
                <div className="mt-8 overflow-hidden rounded-2xl border border-hairline">
                  <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_1fr] gap-2 border-b border-hairline bg-canvas-soft px-4 py-3 font-label uppercase tracking-[0.12em] text-text-muted sm:px-5"><span>{isSpanish ? "Fecha" : "Date"}</span><span className="text-right">WPM</span><span className="text-right">{isSpanish ? "Precisión" : "Accuracy"}</span><span className="text-right">{isSpanish ? "Errores" : "Errors"}</span><span className="text-right">{isSpanish ? "Prueba" : "Test"}</span></div>
                  {loading ? <div className="px-5 py-12 text-center font-body text-text-muted">{isSpanish ? "Cargando…" : "Loading…"}</div> : entries.length === 0 ? <div className="px-5 py-12 text-center font-body text-text-muted">{isSpanish ? "Completa una prueba de al menos un minuto para empezar tu historial." : "Complete a test of at least one minute to start your history."}</div> : entries.map((entry) => <HistoryRow key={entry.id} entry={entry} locale={locale} />)}
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

function MetricCard({ label, value, suffix }: { label: string; value: string; suffix: string }) { return <div className="rounded-2xl border border-hairline bg-canvas-soft p-5"><p className="font-label uppercase tracking-[0.14em] text-text-muted">{label}</p><p className="mt-2 font-heading-3 text-ink">{value}<span className="text-base font-semibold text-text-muted">{suffix}</span></p></div>; }

function ProgressGraph({ entries, locale }: { entries: TypingHistoryEntry[]; locale: Locale }) {
  if (!entries.length) return null;
  const points = entries.slice(0, 30).reverse();
  const width = 1000, height = 430;
  const pad = { top: 40, right: 88, bottom: 76, left: 66 };
  const chartWidth = width - pad.left - pad.right;
  const chartHeight = height - pad.top - pad.bottom;
  const latest = points[points.length - 1];
  const previous = points.length > 1 ? points[points.length - 2] : null;
  const maxWpm = Math.max(40, Math.ceil(Math.max(...points.map((p) => p.wpm), 0) / 20) * 20 + 20);
  const wpmTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => maxWpm * r);
  const accuracyTicks = [0, 25, 50, 75, 100];
  const WPM_COLOR = "#2563eb";
  const ACCURACY_COLOR = "#f97316";
  const xFor = (i: number) => points.length === 1 ? pad.left + chartWidth / 2 : pad.left + (i / (points.length - 1)) * chartWidth;
  const yWpm = (v: number) => pad.top + chartHeight - (v / maxWpm) * chartHeight;
  const yAcc = (v: number) => pad.top + chartHeight - (v / 100) * chartHeight;
  const smoothPath = (values: number[], yFor: (v: number) => number) => {
    if (values.length === 1) return `M ${xFor(0)} ${yFor(values[0])}`;
    return values.map((v, i) => {
      const x = xFor(i), y = yFor(v);
      if (i === 0) return `M ${x} ${y}`;
      const px = xFor(i - 1), py = yFor(values[i - 1]), c = (x - px) / 2;
      return `C ${px + c} ${py}, ${x - c} ${y}, ${x} ${y}`;
    }).join(" ");
  };
  const wpmPath = smoothPath(points.map((p) => p.wpm), yWpm);
  const accuracyPath = smoothPath(points.map((p) => p.accuracy), yAcc);
  const fmt = (d: string) => new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", { month: "short", day: "numeric" }).format(new Date(d));
  const labelIndexes = points.length <= 6 ? points.map((_, i) => i) : [0, Math.floor((points.length - 1) / 2), points.length - 1];
  const wpmDelta = previous ? latest.wpm - previous.wpm : 0;
  const accDelta = previous ? latest.accuracy - previous.accuracy : 0;
  const signed = (v: number, suffix: string) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}${suffix}`;
  const latestX = xFor(points.length - 1);
  const latestWpmY = yWpm(latest.wpm);
  const latestAccY = yAcc(latest.accuracy);
  const showTrend = points.length > 1;

  return <section className="mt-8 rounded-2xl border border-hairline bg-canvas-soft p-4 sm:p-6" aria-labelledby="typing-progress-heading">
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div><p className="font-label uppercase tracking-[0.16em] text-text-muted">{locale === "es" ? "Progreso" : "Progress"}</p><h2 id="typing-progress-heading" className="mt-1 font-heading-3 text-ink">{locale === "es" ? "Velocidad y precisión" : "Speed & accuracy"}</h2><p className="mt-1 font-body-sm text-text-muted">{showTrend ? (locale === "es" ? "Evolución de tus últimas pruebas" : "Track how your performance changes over time") : (locale === "es" ? "Tu resultado actual" : "Your current result")}</p></div>
        <div className="grid grid-cols-2 gap-2 sm:flex"><MetricMini label="WPM" value={latest.wpm.toFixed(1)} delta={previous ? signed(wpmDelta, "") : "—"} /><MetricMini label={locale === "es" ? "Precisión" : "Accuracy"} value={`${latest.accuracy.toFixed(1)}%`} delta={previous ? signed(accDelta, " pp") : "—"} /></div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-hairline py-3 font-label text-text-muted">
        <span className="inline-flex items-center gap-2"><span className="h-0.5 w-8 rounded-full" style={{ backgroundColor: WPM_COLOR }} />WPM</span>
        <span className="inline-flex items-center gap-2"><span className="h-0.5 w-8 rounded-full" style={{ backgroundColor: ACCURACY_COLOR }} />{locale === "es" ? "Precisión" : "Accuracy"}</span>
        <span className="text-text-faint">{locale === "es" ? `${points.length} ${points.length === 1 ? "prueba" : "pruebas"}` : `${points.length} ${points.length === 1 ? "test" : "tests"}`}</span>
      </div>

      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={locale === "es" ? "Gráfico de progreso de WPM y precisión" : "Typing progress graph showing WPM and accuracy"} className="min-w-[760px] w-full">
          {wpmTicks.map((tick, i) => { const y=yWpm(tick); return <g key={`grid-${i}`}><line x1={pad.left} x2={width-pad.right} y1={y} y2={y} stroke="currentColor" className="text-hairline" strokeWidth="1" /><text x={pad.left-12} y={y+4} textAnchor="end" fontSize="11" className="fill-text-muted">{Math.round(tick)}</text><text x={width-pad.right+12} y={y+4} fontSize="11" className="fill-text-muted">{accuracyTicks[i]}%</text></g>; })}
          <line x1={pad.left} x2={pad.left} y1={pad.top} y2={pad.top+chartHeight} stroke="currentColor" className="text-hairline" /><line x1={width-pad.right} x2={width-pad.right} y1={pad.top} y2={pad.top+chartHeight} stroke="currentColor" className="text-hairline" /><line x1={pad.left} x2={width-pad.right} y1={pad.top+chartHeight} y2={pad.top+chartHeight} stroke="currentColor" className="text-hairline" />
          <text x={pad.left} y={pad.top-16} fontSize="11" className="fill-text-faint">WPM</text><text x={width-pad.right} y={pad.top-16} textAnchor="end" fontSize="11" className="fill-text-faint">% {locale === "es" ? "precisión" : "accuracy"}</text>

          {showTrend ? <>
            <path d={wpmPath} fill="none" stroke={WPM_COLOR} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <path d={accuracyPath} fill="none" stroke={ACCURACY_COLOR} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </> : <>
            <line x1={pad.left} x2={latestX} y1={latestWpmY} y2={latestWpmY} stroke={WPM_COLOR} strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            <line x1={pad.left} x2={latestX} y1={latestAccY} y2={latestAccY} stroke={ACCURACY_COLOR} strokeWidth="3.5" strokeLinecap="round" strokeDasharray="8 8" vectorEffect="non-scaling-stroke" />
          </>}

          {points.map((entry,i)=>{const x=xFor(i),yw=yWpm(entry.wpm),ya=yAcc(entry.accuracy),latestPoint=i===points.length-1;return <g key={entry.id}><circle cx={x} cy={yw} r={latestPoint?7:4} fill={WPM_COLOR} stroke="white" strokeWidth={latestPoint?2:0}><title>{`${entry.wpm.toFixed(1)} WPM · ${fmt(entry.completedAt)}`}</title></circle><circle cx={x} cy={ya} r={latestPoint?6:3.5} fill={ACCURACY_COLOR} stroke="white" strokeWidth={latestPoint?2:0}><title>{`${entry.accuracy.toFixed(1)}% · ${fmt(entry.completedAt)}`}</title></circle>{labelIndexes.includes(i)&&<text x={x} y={height-28} textAnchor="middle" fontSize="11" className="fill-text-muted">{fmt(entry.completedAt)}</text>}</g>;})}
          <g><rect x={Math.min(width-pad.right-136, Math.max(pad.left, latestX-68))} y={Math.max(pad.top+5, Math.min(pad.top+chartHeight-40, Math.min(latestWpmY,latestAccY)-48))} width="136" height="34" rx="10" fill="white" fillOpacity="0.9" stroke="currentColor" className="text-hairline"/><text x={Math.min(width-pad.right-68, Math.max(pad.left+68, latestX))} y={Math.max(pad.top+27, Math.min(pad.top+chartHeight-18, Math.min(latestWpmY,latestAccY)-25))} textAnchor="middle" fontSize="11" fontWeight="600" className="fill-text-muted">{showTrend ? (locale === "es" ? "Última prueba" : "Latest test") : (locale === "es" ? "Resultado actual" : "Current result")}</text></g>
        </svg>
      </div>

      <div className="grid gap-3 border-t border-hairline pt-4 text-text-muted sm:grid-cols-2">
        <div><p className="font-label uppercase tracking-[0.12em]">{locale === "es" ? "Último resultado" : "Latest result"}</p><p className="mt-1 font-body-sm">{latest.wpm.toFixed(1)} WPM · {latest.accuracy.toFixed(1)}% {locale === "es" ? "precisión" : "accuracy"}</p></div>
        <div className="sm:text-right"><p className="font-label uppercase tracking-[0.12em]">{showTrend ? (locale === "es" ? "Cambio desde la prueba anterior" : "Change from previous test") : (locale === "es" ? "Tendencia" : "Trend")}</p><p className="mt-1 font-body-sm">{showTrend ? `${signed(wpmDelta," WPM")} · ${signed(accDelta," pp")}` : (locale === "es" ? "Completa otra prueba para ver la tendencia." : "Complete another test to see the trend.")}</p></div>
      </div>
    </div>
  </section>;
}

function MetricMini({label,value,delta}:{label:string;value:string;delta:string}){return <div className="min-w-[140px] rounded-xl border border-hairline bg-canvas px-3 py-2.5"><p className="font-label uppercase tracking-[0.12em] text-text-muted">{label}</p><div className="mt-1 flex items-baseline justify-between gap-3"><span className="font-heading-3 text-ink">{value}</span><span className="font-mono text-xs text-text-muted">{delta}</span></div></div>}

function HistoryRow({ entry, locale }: { entry: TypingHistoryEntry; locale: Locale }) {
  const date = new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(entry.completedAt));
  const errors = Math.max(0, entry.incorrectChars);
  const testLabel = entry.isCustom ? (locale === "es" ? "Personalizada" : "Custom") : `${entry.durationSec / 60} min · ${entry.difficulty}`;
  return <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr_1fr] gap-2 border-b border-hairline px-4 py-4 last:border-b-0 sm:px-5"><span className="truncate font-body-sm text-text-muted">{date}</span><span className="text-right font-mono text-sm font-semibold text-accent">{entry.wpm.toFixed(1)}</span><span className="text-right font-mono text-sm text-ink-soft">{entry.accuracy.toFixed(2)}%</span><span className="text-right font-mono text-sm text-text-muted">{errors}</span><span className="truncate text-right font-body-sm capitalize text-text-muted">{testLabel}</span></div>;
}
