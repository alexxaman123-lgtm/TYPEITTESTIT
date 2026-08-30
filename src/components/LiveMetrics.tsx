import { RefObject, useEffect, useRef } from "react";
import { formatTime } from "../lib/stats";
import { cn } from "../utils/cn";

interface Props {
  predictedWpm: number | null;
  accuracy: number;
  status: "idle" | "running" | "finished";
  duration: number;
  liveWpmRef: RefObject<number>;
  startTimeRef: RefObject<number | null>;
}

export default function LiveMetrics({
  predictedWpm,
  accuracy,
  status,
  duration,
  liveWpmRef,
  startTimeRef,
}: Props) {
  const actualWpmElementRef = useRef<HTMLSpanElement | null>(null);
  const timeElementRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let animationFrame = 0;
    let mounted = true;

    const renderLiveMetrics = () => {
      if (!mounted) return;

      const actualElement = actualWpmElementRef.current;
      const timeElement = timeElementRef.current;
      const start = startTimeRef.current;

      if (status !== "running" || start === null) {
        if (actualElement) actualElement.textContent = "0.0";
        if (timeElement) {
          timeElement.textContent = formatTime(duration);
          timeElement.classList.remove("text-danger", "caret-blink");
        }
        return;
      }

      const elapsedMs = Math.max(0, Date.now() - start);
      const elapsedMinutes = elapsedMs / 60000;
      const wordProgress = liveWpmRef.current;
      const actualWpm = elapsedMinutes > 0
        ? Math.max(0, Math.round((wordProgress / elapsedMinutes) * 10) / 10)
        : 0;

      if (actualElement) actualElement.textContent = actualWpm.toFixed(1);

      const remainingMs = Math.max(0, duration * 1000 - elapsedMs);
      const remainingSec = Math.ceil(remainingMs / 1000);
      const urgent = remainingSec <= 10 && remainingSec > 0;

      if (timeElement) {
        timeElement.textContent = formatTime(remainingSec);
        timeElement.classList.toggle("text-danger", urgent);
        timeElement.classList.toggle("caret-blink", urgent);
      }

      animationFrame = window.requestAnimationFrame(renderLiveMetrics);
    };

    renderLiveMetrics();

    return () => {
      mounted = false;
      window.cancelAnimationFrame(animationFrame);
    };
  }, [duration, liveWpmRef, startTimeRef, status]);

  return (
    <div className="metric-surface grid grid-cols-2 divide-x divide-y divide-white/10 rounded-2xl border border-white/10 bg-surface2/70 sm:grid-cols-4 sm:divide-y-0">
      <div className="flex min-h-[88px] flex-col items-center justify-center gap-1 px-3 py-4 sm:py-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint sm:text-xs">
          Actual WPM
        </span>
        <span
          ref={actualWpmElementRef}
          aria-live="off"
          className="font-mono text-2xl font-bold tabular-nums text-accent sm:text-3xl"
        >
          0.0
        </span>
      </div>

      <Metric label="Predicted WPM" value={predictedWpm === null ? "—" : predictedWpm} valueClass="text-ink" />
      <Metric label="Accuracy" value={`${accuracy}%`} valueClass="text-ink" />
      <div className="flex min-h-[88px] flex-col items-center justify-center gap-1 px-3 py-4 sm:py-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint sm:text-xs">
          Time
        </span>
        <span
          ref={timeElementRef}
          className={cn("font-mono text-2xl font-bold tabular-nums text-ink sm:text-3xl")}
        >
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string | number;
  valueClass?: string;
}) {
  return (
    <div className="flex min-h-[88px] flex-col items-center justify-center gap-1 px-3 py-4 sm:py-5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint sm:text-xs">
        {label}
      </span>
      <span
        className={cn(
          "font-mono text-2xl font-bold tabular-nums transition-colors duration-300 sm:text-3xl",
          valueClass
        )}
      >
        {value}
      </span>
    </div>
  );
}
