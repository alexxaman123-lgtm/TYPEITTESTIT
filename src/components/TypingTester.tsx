import { useEffect, useMemo, useRef, useState } from "react";
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

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => { finished: Promise<void> };
};

export default function TypingTester() {
  const prefs = useMemo(() => getPreferences(), []);
  const reducedMotion = useReducedMotion();
  const test = useTypingTest(prefs.difficulty, prefs.duration);
  const [viewMode, setViewMode] = useState<ViewMode>("test");
  const [personalBest, setPersonalBest] = useState<PersonalBest>(null);
  const [focusMode, setFocusMode] = useState(false);
  const previousStatusRef = useRef(test.status);

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
    const previousStatus = previousStatusRef.current;
    previousStatusRef.current = test.status;
    if (test.status === "finished" || test.status === "idle") setFocusMode(false);
    else if (previousStatus !== "running" && test.status === "running") setFocusMode(true);
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
      if (event.key === "Escape") exitFocusMode();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusMode]);

  const animateFocusState = (next: boolean) => {
    if (focusMode === next) return;

    const doc = document as ViewTransitionDocument;
    if (!reducedMotion && typeof doc.startViewTransition === "function") {
      void doc.startViewTransition(() => setFocusMode(next)).finished.catch(() => undefined);
    } else {
      setFocusMode(next);
    }
  };

  function enterFocusMode() {
    animateFocusState(true);
  }

  function exitFocusMode() {
    animateFocusState(false);
    (document.activeElement as HTMLElement | null)?.blur?.();
  }

  const handleDifficultyChange = (d: typeof test.difficulty) => {
    animateFocusState(false);
    test.setDifficulty(d);
    savePreferences(d, test.duration);
  };

  const handleDurationChange = (secs: number) => {
    animateFocusState(false);
    test.setDuration(secs);
    savePreferences(test.difficulty, secs);
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
          <div className="flex flex-col gap-3 border-b border-white/8 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2"><SettingLabel text="Difficulty" /><DifficultySelector value={test.difficulty} onChange={handleDifficultyChange} disabled={controlsDisabled} /></div>
            <div className="flex flex-wrap items-center gap-2"><SettingLabel text="Duration" /><DurationSelector value={test.duration} onChange={handleDurationChange} disabled={controlsDisabled} /></div>
            <button type="button" onClick={() => setViewMode(viewMode === "custom" ? "test" : "custom")} disabled={test.status === "running"} className={cn("rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40", viewMode === "custom" ? "border-accent/50 bg-accent/10 text-accent" : "border-white/12 bg-surface2 text-ink-soft hover:border-accent/40 hover:text-ink")}>Custom Test</button>
          </div>
        )}

        {!focusMode && personalBest && viewMode === "test" && test.status !== "finished" && (
          <p className="mt-3 text-center text-xs font-medium uppercase tracking-wide text-faint sm:text-left">Best on your profile for {test.difficulty} · {test.duration / 60}min: <span className="text-accent">{personalBest.wpm} WPM</span> at <span className="text-ink-soft">{personalBest.accuracy}%</span></p>
        )}

        <div className={cn("mt-4", focusMode && "focus-content mt-0")}>
          {viewMode === "custom" ? (
            <CustomTextPanel duration={test.duration} onStartFree={(secs) => { test.startFreeTypingTest(secs); setViewMode("test"); }} onStartPaste={(text, secs) => { test.startCustomTest(text, secs); setViewMode("test"); }} onCancel={() => setViewMode("test")} />
          ) : test.status === "finished" && test.result && test.elapsedMs < 60_000 ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-white/10 bg-surface3/60 px-6 py-12 text-center"><p className="text-base font-semibold text-ink">Please complete at least 1 minute to check your stats.</p></div>
          ) : test.status === "finished" && test.result ? (
            <ResultPanel result={test.result} targetText={test.targetText} profileBest={personalBest} reducedMotion={reducedMotion} onRetry={() => { animateFocusState(false); test.retry(); }} onNewText={() => { animateFocusState(false); test.newText(); }} onChangeDifficulty={() => { animateFocusState(false); test.reset(); }} onCustomTest={() => { animateFocusState(false); setViewMode("custom"); }} />
          ) : (
            <div className={cn("space-y-4", focusMode && "focus-test-stack")} onClick={(event) => { if (focusMode) event.stopPropagation(); }}>
              <LiveMetrics status={test.status} duration={test.duration} startTimeRef={test.startTimeRef} liveCharCountRef={test.liveCharCountRef} accuracy={test.liveStats.accuracy} focusMode={focusMode} />
              <TypingText target={test.targetText} typed={test.typed} status={test.status} resetKey={test.sessionId} onChange={test.handleInputChange} reducedMotion={reducedMotion} freeTyping={test.isFreeTyping} focusMode={focusMode} onFocusModeRequest={enterFocusMode} />
              <TestControls onRestart={() => { animateFocusState(false); test.retry(); }} onReset={() => { animateFocusState(false); test.reset(); }} onStop={test.stop} canStop={test.status === "running"} focusMode={focusMode} />
              {focusMode && <p className="text-center text-[11px] font-medium uppercase tracking-[0.16em] text-faint opacity-70">Click outside the test or press Esc to exit focus mode</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingLabel({ text }: { text: string }) { return <span className="text-xs font-semibold uppercase tracking-[0.15em] text-faint">{text}</span>; }
