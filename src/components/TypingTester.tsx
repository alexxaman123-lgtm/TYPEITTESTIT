import { useEffect, useMemo, useState } from "react";
import { useTypingTest } from "../lib/useTypingTest";
import { useReducedMotion } from "../lib/useReducedMotion";
import { getPreferences, savePreferences } from "../lib/storage";
import { getProfileBest } from "../lib/leaderboard";
import DifficultySelector from "./DifficultySelector";
import DurationSelector from "./DurationSelector";
import TypingText from "./TypingText";
import LiveMetrics from "./LiveMetrics";
import TestControls from "./TestControls";
import ResultPanel from "./ResultPanel";
import CustomTextPanel from "./CustomTextPanel";
import { cn } from "../utils/cn";

type ViewMode = "test" | "custom";
type PersonalBest = { wpm: number; accuracy: number } | null;

export default function TypingTester() {
  const prefs = useMemo(() => getPreferences(), []);
  const reducedMotion = useReducedMotion();
  const test = useTypingTest(prefs.difficulty, prefs.duration);
  const [viewMode, setViewMode] = useState<ViewMode>("test");
  const [personalBest, setPersonalBest] = useState<PersonalBest>(null);
  const [focusMode, setFocusMode] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadPersonalBest = async () => {
      if (test.isCustom) {
        setPersonalBest(null);
        return;
      }
      const best = await getProfileBest(test.difficulty, test.duration);
      if (!cancelled) setPersonalBest(best);
    };
    void loadPersonalBest();
    return () => { cancelled = true; };
  }, [test.difficulty, test.duration, test.isCustom, test.status]);

  useEffect(() => {
    if (test.status === "finished") setFocusMode(false);
  }, [test.status]);

  useEffect(() => {
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.classList.toggle("typing-focus-active", focusMode);
    if (focusMode) body.style.overflow = "hidden";

    return () => {
      body.classList.remove("typing-focus-active");
      body.style.overflow = previousOverflow;
    };
  }, [focusMode]);

  useEffect(() => {
    if (!focusMode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFocusMode(false);
        (document.activeElement as HTMLElement | null)?.blur?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusMode]);

  const handleDifficultyChange = (d: typeof test.difficulty) => {
    setFocusMode(false);
    test.setDifficulty(d);
    savePreferences(d, test.duration);
  };

  const handleDurationChange = (secs: number) => {
    setFocusMode(false);
    test.setDuration(secs);
    savePreferences(test.difficulty, secs);
  };

  const enterFocusMode = () => setFocusMode(true);
  const exitFocusMode = () => {
    setFocusMode(false);
    (document.activeElement as HTMLElement | null)?.blur?.();
  };

  const controlsDisabled = test.status === "running" || viewMode === "custom";

  return (
    <div id="tester" className="scroll-mt-20">
      <div
        onClick={(event) => {
          if (event.target === event.currentTarget && focusMode) exitFocusMode();
        }}
        className={cn(
          "test-shell animate-fade-up rounded-3xl border border-white/10 bg-surface1/75 p-4 shadow-[0_0_70px_-24px_rgba(0,0,0,0.7)] backdrop-blur-sm surface-lift",
          focusMode && "test-shell-focus"
        )}
      >
        {!focusMode && (
          <div className="flex flex-col gap-4 border-b border-white/8 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3"><SettingLabel text="Difficulty" /><DifficultySelector value={test.difficulty} onChange={handleDifficultyChange} disabled={controlsDisabled} /></div>
            <div className="flex flex-wrap items-center gap-3"><SettingLabel text="Duration" /><DurationSelector value={test.duration} onChange={handleDurationChange} disabled={controlsDisabled} /></div>
            <button type="button" onClick={() => setViewMode(viewMode === "custom" ? "test" : "custom")} disabled={test.status === "running"} className={cn("rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40", viewMode === "custom" ? "border-accent/50 bg-accent/10 text-accent" : "border-white/12 bg-surface2 text-ink-soft hover:border-accent/40 hover:text-ink")}>Custom Test</button>
          </div>
        )}

        {!focusMode && personalBest && viewMode === "test" && test.status !== "finished" && (
          <p className="mt-4 text-center text-xs font-medium uppercase tracking-wide text-faint sm:text-left">Best on your profile for {test.difficulty} · {test.duration / 60}min: <span className="text-accent">{personalBest.wpm} WPM</span> at <span className="text-ink-soft">{personalBest.accuracy}%</span></p>
        )}

        <div className={cn("mt-6", focusMode && "focus-content mt-0")}>
          {viewMode === "custom" ? (
            <CustomTextPanel duration={test.duration} onStartFree={(secs) => { test.startFreeTypingTest(secs); setViewMode("test"); }} onStartPaste={(text, secs) => { test.startCustomTest(text, secs); setViewMode("test"); }} onCancel={() => setViewMode("test")} />
          ) : test.status === "finished" && test.result && test.elapsedMs < 60_000 ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-white/10 bg-surface3/60 px-6 py-12 text-center"><p className="text-base font-semibold text-ink">Please complete at least 1 minute to check your stats.</p></div>
          ) : test.status === "finished" && test.result ? (
            <ResultPanel result={test.result} targetText={test.targetText} profileBest={personalBest} reducedMotion={reducedMotion} onRetry={() => { setFocusMode(false); test.retry(); }} onNewText={() => { setFocusMode(false); test.newText(); }} onChangeDifficulty={() => { setFocusMode(false); test.reset(); }} onCustomTest={() => { setFocusMode(false); setViewMode("custom"); }} />
          ) : (
            <div className={cn("space-y-5", focusMode && "focus-test-stack")} onClick={(event) => { if (focusMode) event.stopPropagation(); }}>
              <LiveMetrics status={test.status} duration={test.duration} startTimeRef={test.startTimeRef} liveCharCountRef={test.liveCharCountRef} accuracy={test.liveStats.accuracy} focusMode={focusMode} />
              <TypingText target={test.targetText} typed={test.typed} status={test.status} resetKey={test.sessionId} onChange={test.handleInputChange} reducedMotion={reducedMotion} freeTyping={test.isFreeTyping} focusMode={focusMode} onFocusModeRequest={enterFocusMode} />
              <TestControls onRestart={() => { setFocusMode(false); test.retry(); }} onReset={() => { setFocusMode(false); test.reset(); }} onStop={() => { setFocusMode(false); test.stop(); }} canStop={test.status === "running"} focusMode={focusMode} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingLabel({ text }: { text: string }) { return <span className="text-xs font-semibold uppercase tracking-[0.15em] text-faint">{text}</span>; }
