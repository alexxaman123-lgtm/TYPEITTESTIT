import { useMemo, useState } from "react";
import { useTypingTest } from "../lib/useTypingTest";
import { useReducedMotion } from "../lib/useReducedMotion";
import { getPersonalBest, getPreferences, savePreferences } from "../lib/storage";
import DifficultySelector from "./DifficultySelector";
import DurationSelector from "./DurationSelector";
import TypingText from "./TypingText";
import LiveMetrics from "./LiveMetrics";
import TestControls from "./TestControls";
import ResultPanel from "./ResultPanel";
import CustomTextPanel from "./CustomTextPanel";
import { cn } from "../utils/cn";

type ViewMode = "test" | "custom";

export default function TypingTester() {
  const prefs = useMemo(() => getPreferences(), []);
  const reducedMotion = useReducedMotion();
  const test = useTypingTest(prefs.difficulty, prefs.duration);
  const [viewMode, setViewMode] = useState<ViewMode>("test");

  const personalBest = test.isCustom ? null : getPersonalBest(test.difficulty, test.duration);

  const handleDifficultyChange = (d: typeof test.difficulty) => {
    test.setDifficulty(d);
    savePreferences(d, test.duration);
  };

  const handleDurationChange = (secs: number) => {
    test.setDuration(secs);
    savePreferences(test.difficulty, secs);
  };

  const controlsDisabled = test.status === "running" || viewMode === "custom";

  return (
    <div id="tester" className="scroll-mt-20">
      <div className="test-shell animate-fade-up rounded-3xl border border-white/10 bg-surface1/75 p-4 shadow-[0_0_70px_-24px_rgba(0,0,0,0.7)] backdrop-blur-sm surface-lift sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 border-b border-white/8 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <SettingLabel text="Difficulty" />
            <DifficultySelector value={test.difficulty} onChange={handleDifficultyChange} disabled={controlsDisabled} />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SettingLabel text="Duration" />
            <DurationSelector value={test.duration} onChange={handleDurationChange} disabled={controlsDisabled} />
          </div>
          <button
            type="button"
            onClick={() => setViewMode(viewMode === "custom" ? "test" : "custom")}
            disabled={test.status === "running"}
            className={cn(
              "rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40",
              viewMode === "custom"
                ? "border-accent/50 bg-accent/10 text-accent"
                : "border-white/12 bg-surface2 text-ink-soft hover:border-accent/40 hover:text-ink"
            )}
          >
            Custom Test
          </button>
        </div>

        {personalBest && viewMode === "test" && test.status !== "finished" && (
          <p className="mt-4 text-center text-xs font-medium uppercase tracking-wide text-faint sm:text-left">
            Best on this device for {test.difficulty} · {test.duration / 60}min:{" "}
            <span className="text-accent">{personalBest.wpm} WPM</span> at <span className="text-ink-soft">{personalBest.accuracy}%</span>
          </p>
        )}

        <div className="mt-6">
          {viewMode === "custom" ? (
            <CustomTextPanel
              duration={test.duration}
              onStartFree={(secs) => {
                test.startFreeTypingTest(secs);
                setViewMode("test");
              }}
              onStartPaste={(text, secs) => {
                test.startCustomTest(text, secs);
                setViewMode("test");
              }}
              onCancel={() => setViewMode("test")}
            />
          ) : test.status === "finished" && test.result ? (
            <ResultPanel
              result={test.result}
              targetText={test.targetText}
              reducedMotion={reducedMotion}
              onRetry={test.retry}
              onNewText={test.newText}
              onChangeDifficulty={() => test.reset()}
              onCustomTest={() => setViewMode("custom")}
            />
          ) : (
            <div className="space-y-5">
              <LiveMetrics
                status={test.status}
                duration={test.duration}
                startTimeRef={test.startTimeRef}
                liveWpmRef={test.liveWordProgressRef}
                predictedWpm={test.liveStats.predictedWpm}
                accuracy={test.liveStats.accuracy}
              />
              <TypingText
                target={test.targetText}
                typed={test.typed}
                status={test.status}
                resetKey={test.sessionId}
                onChange={test.handleInputChange}
                reducedMotion={reducedMotion}
                freeTyping={test.isFreeTyping}
              />
              <TestControls
                onRestart={test.retry}
                onReset={test.reset}
                onStop={test.stop}
                canStop={test.status === "running"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingLabel({ text }: { text: string }) {
  return <span className="text-xs font-semibold uppercase tracking-[0.15em] text-faint">{text}</span>;
}
