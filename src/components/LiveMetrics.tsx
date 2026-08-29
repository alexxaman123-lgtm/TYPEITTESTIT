import { RefObject, useEffect } from "react";
import { formatTime } from "../lib/stats";
import { cn } from "../utils/cn";

interface Props {
  predictedWpm: number | null;
  accuracy: number;
  remainingSec: number;
  urgent: boolean;
  liveWpmRef: RefObject<number>;
}

export default function LiveMetrics({
  predictedWpm,
  accuracy,
  remainingSec,
  urgent,
  liveWpmRef,
}: Props) {
  useEffect(() => {
    let animationFrame = 0;
    let mounted = true;
    let lastDisplayed = -1;

    const updateActualWpm = () => {
      if (!mounted) return;

      const element = document.querySelector<HTMLSpanElement>('[data-actual-wpm="true"]');
      if (element) {
        const value = liveWpmRef.current;
        if (value !== lastDisplayed) {
          element.textContent = value.toFixed(1);
          lastDisplayed = value;
        }
      }

      animationFrame = window.requestAnimationFrame(updateActualWpm);
    };

    updateActualWpm();

    return () => {
      mounted = false;
      window.cancelAnimationFrame(animationFrame);
    };
  }, [liveWpmRef]);

  return (
    <div className="metric-surface grid grid-cols-2 divide-x divide-y divide-white/10 rounded-2xl border border-white/10 bg-surface2/70 sm:grid-cols-4 sm:divide-y-0">
      <div className="flex min-h-[88px] flex-col items-center justify-center gap-1 px-3 py-4 sm:py-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint sm:text-xs">
          Actual WPM
        </span>
        <span
          data-actual-wpm="true"
          className="font-mono text-2xl font-bold tabular-nums text-accent sm:text-3xl"
        >
          0.0
        </span>
      </div>

      <Metric label="Predicted WPM" value={predictedWpm === null ? "—" : predictedWpm} valueClass="text-ink" />
      <Metric label="Accuracy" value={`${accuracy}%`} valueClass="text-ink" />
      <Metric
        label="Time"
        value={formatTime(remainingSec)}
        valueClass={cn("text-ink font-mono", urgent && "text-danger")}
        pulse={urgent}
      />
    </div>
  );
}

function Metric({
  label,
  value,
  valueClass,
  pulse,
}: {
  label: string;
  value: string | number;
  valueClass?: string;
  pulse?: boolean;
}) {
  return (
    <div className="flex min-h-[88px] flex-col items-center justify-center gap-1 px-3 py-4 sm:py-5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint sm:text-xs">
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-2xl font-bold tabular-nums transition-colors duration-300 sm:text-3xl",
          valueClass,
          pulse && "caret-blink"
        )}
      >
        {value}
      </span>
    </div>
  );
}
