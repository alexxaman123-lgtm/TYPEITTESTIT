import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTypingTest } from "../lib/useTypingTest";
import { useReducedMotion } from "../lib/useReducedMotion";
import { getPreferences, savePreferences } from "../lib/storage";
import { getProfileBest } from "../lib/leaderboard";
import { playTestCompleteSound } from "../lib/useTypingSounds";
import { getSoundEnabled, useSound } from "../lib/useSound";
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

const SLOW_GOAT_WPM_THRESHOLD = 30;
const SLOW_GOAT_SOUND = "/fahhh_KcgAXfs.mp3";

export default function TypingTester() {
  const prefs = useMemo(() => getPreferences(), []);
  const reducedMotion = useReducedMotion();
  const test = useTypingTest(prefs.difficulty, prefs.duration);
  const [viewMode, setViewMode] = useState<ViewMode>("test");
  const [personalBest, setPersonalBest] = useState<PersonalBest>(null);
  const [focusMode, setFocusMode] = useState(false);
  const previousStatusRef = useRef(test.status);

  // Uploaded sound for wrong key presses only.
  const { playSound } = useSound();
  const prevErrorCountRef = useRef(0);

  useEffect(() => {
    // Each new test starts a fresh error counter so the first mistake can trigger the sound.
    prevErrorCountRef.current = 0;
  }, [test.sessionId]);

  useEffect(() => {
    if (test.status !== "running") return;

    const currentErrors = test.liveStats.characterErrors;
    const previousErrors = prevErrorCountRef.current;

    if (currentErrors > previousErrors && getSoundEnabled()) {
      const errorCount = currentErrors - previousErrors;
      for (let i = 0; i < errorCount; i += 1) {
        playSound("/piano-noise-suprise.mp3", 0.10);
      }
    }

    prevErrorCountRef.current = currentErrors;
  }, [test.liveStats.characterErrors, test.status, playSound]);

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

    if (previousStatus === "running" && test.status === "finished") {
      const finalWpm = test.result?.wpm ?? 0;
      if (getSoundEnabled() && finalWpm < SLOW_GOAT_WPM_THRESHOLD) {
        playSound(SLOW_GOAT_SOUND, 0.50);
      } else {
        playTestCompleteSound();
      }
    }
  }, [test.status, test.result, playSound]);

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
    setFocusMode(next);
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

  const resetShortTest = () => {
    animateFocusState(false);
    test.reset();
  };

  const controlsDisabled = test.status === "running" || viewMode === "custom";

  const testerShell = (
    <div
      onClick={(event) => {
        if (event.target === event.currentTarget && focusMode) exitFocusMode();
      }}
      className={cn(
        "test-shell rounded-[24px] border border-hairline bg-canvas p-6 shadow-sm transition-all duration-300",
        focusMode && "test-shell-focus"
      )}
    >
      {!focusMode && (
        <div className="flex flex-col gap-4 border-b border-hairline pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <SettingLabel text="Difficulty" />
            <DifficultySelector value={test.difficulty} onChange={handleDifficultyChange} disabled={controlsDisabled} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SettingLabel text="Duration" />
            <DurationSelector value={test.duration} onChange={handleDurationChange} disabled={controlsDisabled} />
          </div>
          <button type="button" onClick={() => setViewMode(viewMode === "custom" ? "test" : "custom")} disabled={test.status === "running"} className={cn("rounded-full border px-5 py-2 font-link transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40", viewMode === "custom" ? "border-accent bg-accent/10 text-accent" : "border-hairline bg-canvas-soft text-ink hover:border-text-muted")}>Custom Test</button>
        </div>
      )}

      {!focusMode && personalBest && viewMode === "test" && test.status !== "finished" && (
        <p className="mt-4 text-center font-caption text-text-muted sm:text-left">Best on your profile for {test.difficulty} · {test.duration / 60}min: <span className="font-semibold text-accent">{personalBest.wpm} WPM</span> at <span className="font-semibold text-ink-soft">{personalBest.accuracy}%</span></p>
      )}

      <div className={cn("mt-6", focusMode && "focus-content mt-0")}>
        {viewMode === "custom" ? (
          <CustomTextPanel duration={test.duration} onStartFree={(secs) => { test.startFreeTypingTest(secs); setViewMode("test"); }} onStartPaste={(text, secs) => { test.startCustomTest(text, secs); setViewMode("test"); }} onCancel={() => setViewMode("test")} />
        ) : test.status === "finished" && test.result && test.elapsedMs < 60_000 ? (
          <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-hairline bg-canvas-soft px-6 py-12 text-center sm:py-14">
            <p className="max-w-md font-body-lg text-ink">
              Please complete at least 1 minute to check your stats.
            </p>
            <button
              type="button"
              onClick={resetShortTest}
              className="rounded-full border border-hairline bg-canvas px-6 py-3 font-link text-ink transition-colors duration-200 hover:border-text-muted hover:bg-canvas-soft"
            >
              Start Again
            </button>
          </div>
        ) : test.status === "finished" && test.result ? (
          <ResultPanel result={test.result} targetText={test.targetText} profileBest={personalBest} reducedMotion={reducedMotion} onRetry={() => { animateFocusState(false); test.retry(); }} onNewText={() => { animateFocusState(false); test.newText(); }} onChangeDifficulty={() => { animateFocusState(false); test.reset(); }} onCustomTest={() => { animateFocusState(false); setViewMode("custom"); }} />
        ) : (
          <div className={cn("space-y-6", focusMode && "focus-test-stack")} onClick={(event) => { if (focusMode) event.stopPropagation(); }}>
            <LiveMetrics status={test.status} duration={test.duration} startTimeRef={test.startTimeRef} liveCharCountRef={test.liveCharCountRef} accuracy={test.liveStats.accuracy} focusMode={focusMode} />
            <TypingText target={test.targetText} typed={test.typed} status={test.status} resetKey={test.sessionId} onChange={test.handleInputChange} reducedMotion={reducedMotion} freeTyping={test.isFreeTyping} focusMode={focusMode} onFocusModeRequest={enterFocusMode} />
            <TestControls onRestart={() => { animateFocusState(false); test.retry(); }} onReset={() => { animateFocusState(false); test.reset(); }} onStop={test.stop} canStop={test.status === "running"} focusMode={focusMode} />
            {focusMode && <p className="text-center font-caption text-text-faint">Click outside the test or press Esc to exit focus mode</p>}
          </div>
        )}
      </div>
    </div>
  );

  if (focusMode) {
    return createPortal(testerShell, document.body);
  }

  return (
    <div id="tester" className="scroll-mt-20">
      {testerShell}
    </div>
  );
}

function SettingLabel({ text }: { text: string }) { return <span className="font-label text-text-muted">{text}</span>; }
