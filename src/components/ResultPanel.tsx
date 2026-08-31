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
  FAST: "text-accent2 border-accent2/40 bg-accent2/10",
  GOOD: "text-ink-soft border-white/20 bg-white/5",
  AVERAGE: "text-muted border-white/15 bg-white/5",
  POOR: "text-muted border-white/10 bg-white/5",
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
    <div className="animate-fade-up rounded-2xl border border-white/10 bg-surface2/70 p-6 shadow-[0_18px_60px_-34px_rgba(0,0,0,0.95)] sm:p-10">
      {isProfileBest && (
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Best on your profile
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-faint">Your typing performance</span>
        <span className="theme-accent-text-glow mt-2 font-mono text-7xl font-extrabold tabular-nums text-accent sm:text-8xl">
          {wpm.toFixed(1)}
        </span>
        <span className="mt-1 text-sm font-semibold uppercase tracking-[0.25em] text-muted">ACTUAL WPM</span>

        {statsAvailable ? (
          <>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xl font-bold text-ink">{result.accuracy}%</span>
              <span className="text-sm uppercase tracking-wide text-muted">Accuracy</span>
            </div>

            <span
              className={cn(
                "mt-5 inline-block rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em]",
                LABEL_STYLES[label]
              )}
            >
              {label}
            </span>

            <div className="mt-5 w-full max-w-2xl rounded-xl border border-white/10 bg-surface3/50 px-4 py-4 text-left sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">Typing speed level</span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-lg font-bold text-ink">{speedTier.name}</span>
                    <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                      {Math.round(measuredWpm * 10) / 10} WPM
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-muted">
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
              <p className="mt-3 text-sm leading-6 text-muted">
                {speedTier.message} {speedTier.nextTarget !== null ? `Aim for ${speedTier.nextTarget} WPM next while keeping accuracy high.` : "Keep accuracy high and work on consistency to stay in the elite range."}
              </p>
            </div>
          </>
        ) : (
          <div className="mt-5 w-full max-w-2xl rounded-xl border border-accent/20 bg-accent/5 px-5 py-5">
            <p className="text-sm font-semibold text-accent">
              Please complete at least 1 minute to check your stats.
            </p>
            <p className="mt-2 text-xs leading-5 text-muted">
              Results such as WPM, accuracy, and the performance breakdown become available after you have completed at least one minute.
            </p>
          </div>
        )}
      </div>

      {statsAvailable ? (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatBox label="Letters Correct" value={result.correctChars} />
          <StatBox label="Letters Incorrect" value={result.incorrectChars} />
          <StatBox label="Words Written" value={wordsWritten} />
          <StatBox label="Letters Typed" value={result.totalTyped} />
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-white/10 bg-surface3/50 px-5 py-6 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">Stats unavailable</div>
          <p className="mt-2 text-sm text-muted">Please complete at least 1 minute to check your stats.</p>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-white/10 bg-surface3/70 p-5 sm:p-6">
        <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-faint">What you typed in the test</div>
        <div className="mt-4 rounded-lg border border-white/5 bg-bg/40 p-4 font-sans text-sm leading-7 sm:text-base sm:leading-8">
          {result.isCustom && result.typedText && !targetText ? (
            <p className="whitespace-pre-wrap break-words text-ink-soft">{result.typedText}</p>
          ) : targetText ? (
            <ResultPassage target={targetText} typed={result.typedText} />
          ) : (
            <p className="text-muted">No text was typed during this test.</p>
          )}
        </div>
        <p className="mt-3 text-xs text-faint">Only the portion you typed is shown. Correct characters stay green, mistyped characters stay red.</p>
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
            className={correct ? "text-accent2" : "rounded-[3px] bg-danger/10 text-danger"}
            title={correct ? undefined : `Typed: ${typedChar === " " ? "space" : typedChar}`}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
      {typed.length > target.length && (
        <span className="text-danger">{typed.slice(target.length)}</span>
      )}
    </p>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="interactive-lift rounded-xl border border-white/10 bg-surface3/70 px-3 py-4 text-center">
      <div className="font-mono text-xl font-bold text-ink sm:text-2xl">{value}</div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-faint sm:text-xs">
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
        "rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0",
        primary
          ? "bg-accent text-black theme-accent-glow hover:brightness-110"
          : "border border-white/12 bg-surface3 text-ink-soft hover:border-accent/40 hover:text-ink"
      )}
    >
      {children}
    </button>
  );
}
