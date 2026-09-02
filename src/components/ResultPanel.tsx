import { useState, type ReactNode } from "react";
import type { TestResult } from "../lib/useTypingTest";
import { getSpeedTier } from "../lib/stats";
import { useCountUp } from "../lib/useCountUp";
import { shareResult } from "../lib/share";
import { cn } from "../utils/cn";

interface Props {
  result: TestResult;
  targetText: string;
  profileBest: { wpm: number; accuracy: number } | null;
  onRetry: () => void;
  onNewText: () => void;
  onChangeDifficulty: () => void;
  onCustomTest: () => void;
  reducedMotion: boolean;
}

const LABEL_STYLES: Record<string, string> = {
  ELITE: "text-accent border-accent/40 bg-accent/10",
  EXCELLENT: "text-accent border-accent/40 bg-accent/10",
  FAST: "text-accent border-accent/40 bg-accent/10",
  GOOD: "text-ink border-hairline bg-canvas",
  AVERAGE: "text-text-muted border-hairline bg-canvas",
  POOR: "text-text-muted border-hairline bg-canvas",
};

const MIN_STATS_DURATION_SEC = 60;

export default function ResultPanel({
  result,
  targetText,
  profileBest,
  onRetry,
  onNewText,
  onChangeDifficulty,
  onCustomTest,
  reducedMotion,
}: Props) {
  const statsAvailable = result.isCustom || result.durationSec >= MIN_STATS_DURATION_SEC;
  const wpm = useCountUp(statsAvailable ? result.wpm : 0, 800, reducedMotion);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const measuredWpm = statsAvailable ? result.wpm : 0;
  const speedTier = getSpeedTier(measuredWpm);
  const label = speedTier.name;
  const isProfileBest = statsAvailable && Boolean(
    profileBest &&
    profileBest.wpm === result.wpm &&
    profileBest.accuracy === result.accuracy
  );

  const handleShare = async () => {
    const outcome = await shareResult(result);
    if (outcome === "shared") setShareStatus("Shared!");
    else if (outcome === "copied") setShareStatus("Result copied to clipboard");
    else if (outcome === "downloaded") setShareStatus("Result card downloaded");
    else setShareStatus(null);
    if (outcome !== "failed") {
      window.setTimeout(() => setShareStatus(null), 3200);
    }
  };

  const wordsWritten = result.wordsWritten;

  return (
    <div className="animate-fade-up rounded-[24px] border border-hairline bg-canvas-soft p-6 shadow-sm sm:p-10">
      {isProfileBest && (
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 font-label text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Best on your profile
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <span className="font-label text-text-muted">Your typing performance</span>
        <span className="mt-2 font-mono text-7xl font-bold tabular-nums text-ink sm:text-8xl">
          {wpm.toFixed(1)}
        </span>
        <span className="mt-1 font-label text-text-muted">ACTUAL WPM</span>

        {statsAvailable ? (
          <>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xl font-bold text-ink">{result.accuracy}%</span>
              <span className="font-label text-text-muted">Accuracy</span>
            </div>

            <span
              className={cn(
                "mt-5 inline-block rounded-full border px-4 py-1.5 font-label",
                LABEL_STYLES[label]
              )}
            >
              {label}
            </span>

            <div className="mt-5 w-full max-w-2xl rounded-[24px] border border-hairline bg-canvas px-6 py-6 text-left shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-label text-text-muted">Typing speed level</span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-lg font-bold text-ink">{speedTier.name}</span>
                    <span className="rounded-full border border-accent bg-accent/10 px-2 py-0.5 font-label text-accent">
                      {Math.round(measuredWpm * 10) / 10} WPM
                    </span>
                  </div>
                </div>
                <div className="text-right font-caption text-text-muted">
                  {speedTier.nextTarget === null ? (
                    <span>Elite benchmark reached</span>
                  ) : (
                    <span>
                      <span className="text-accent">↑ {Math.max(0, speedTier.nextTarget - measuredWpm).toFixed(1)} WPM</span>{" "}
                      to reach {speedTier.nextTarget} WPM
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-4 font-body-sm text-text-muted">
                {speedTier.message} {speedTier.nextTarget !== null ? `Aim for ${speedTier.nextTarget} WPM next while keeping accuracy high.` : "Keep accuracy high and work on consistency to stay in the elite range."}
              </p>
            </div>
          </>
        ) : (
          <div className="mt-5 w-full max-w-2xl rounded-[24px] border border-accent/20 bg-accent/5 px-6 py-6">
            <p className="font-link text-accent">
              Please complete at least 1 minute to check your stats.
            </p>
            <p className="mt-2 font-body-sm text-text-muted">
              Results such as WPM, accuracy, and the performance breakdown become available after you have completed at least one minute.
            </p>
          </div>
        )}
      </div>

      {statsAvailable ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatBox label="Letters Correct" value={result.correctChars} />
          <StatBox label="Letters Incorrect" value={result.incorrectChars} />
          <StatBox label="Words Written" value={wordsWritten} />
          <StatBox label="Letters Typed" value={result.totalTyped} />
        </div>
      ) : (
        <div className="mt-8 rounded-[24px] border border-hairline bg-canvas px-6 py-8 text-center shadow-sm">
          <div className="font-label text-text-muted">Stats unavailable</div>
          <p className="mt-2 font-body-sm text-text-muted">Please complete at least 1 minute to check your stats.</p>
        </div>
      )}

      <div className="mt-8 rounded-[24px] border border-hairline bg-canvas p-6 sm:p-8 shadow-sm">
        <div className="font-label text-text-muted">What you typed in the test</div>
        <div className="mt-4 rounded-2xl border border-hairline bg-canvas-soft p-5 font-sans font-body-sm sm:font-body">
          {result.isCustom && result.typedText && !targetText ? (
            <p className="whitespace-pre-wrap break-words text-ink">{result.typedText}</p>
          ) : targetText ? (
            <ResultPassage target={targetText} typed={result.typedText} />
          ) : (
            <p className="text-text-muted">No text was typed during this test.</p>
          )}
        </div>
        <p className="mt-4 font-caption text-text-muted">Only the portion you typed is shown. Correct characters stay black, mistyped characters stay red.</p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ActionButton primary onClick={onRetry}>Retry</ActionButton>
        <ActionButton onClick={onNewText}>New Text</ActionButton>
        <ActionButton onClick={onChangeDifficulty}>Change Difficulty</ActionButton>
        <ActionButton onClick={onCustomTest}>Custom Test</ActionButton>
        <ActionButton onClick={handleShare}>Share Result</ActionButton>
      </div>

      {shareStatus && (
        <p className="mt-4 text-center text-sm font-medium text-accent" role="status">
          {shareStatus}
        </p>
      )}
    </div>
  );
}

function ResultPassage({ target, typed }: { target: string; typed: string }) {
  const visibleTarget = target.slice(0, typed.length);

  return (
    <p className="whitespace-pre-wrap break-words">
      {visibleTarget.split("").map((ch, index) => {
        const typedChar = typed[index];
        const correct = typedChar === ch;
        return (
          <span
            key={index}
            className={correct ? "text-ink" : "rounded-[3px] bg-red-500/10 text-red-600"}
            title={correct ? undefined : `Typed: ${typedChar === " " ? "space" : typedChar}`}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
      {typed.length > target.length && (
        <span className="text-red-600">{typed.slice(target.length)}</span>
      )}
    </p>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-hairline bg-canvas px-4 py-5 text-center shadow-sm">
      <div className="font-mono text-2xl font-bold text-ink sm:text-3xl">{value}</div>
      <div className="mt-2 font-label text-text-muted">
        {label}
      </div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  primary,
}: {
  children: ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-5 py-2.5 font-link transition-colors duration-200",
        primary
          ? "bg-primary text-on-primary hover:opacity-90"
          : "border border-hairline bg-canvas-soft text-ink hover:border-text-muted hover:bg-canvas"
      )}
    >
      {children}
    </button>
  );
}
