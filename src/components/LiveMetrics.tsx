import { RefObject, useEffect, useRef } from "react";
import { formatTime } from "../lib/stats";

interface Props {
  accuracy: number;
  status: "idle" | "running" | "finished";
  duration: number;
  liveCharCountRef: RefObject<number>;
  startTimeRef: RefObject<number | null>;
  focusMode?: boolean;
}

export default function LiveMetrics({
  accuracy,
  status,
  duration,
  liveCharCountRef,
  startTimeRef,
  focusMode = false,
}: Props) {
  const actualWpmElementRef = useRef<HTMLSpanElement | null>(null);
  const timeElementRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let animationFrame = 0;
    let mounted = true;
    let lastWpm = "0.0";
    let lastTime = formatTime(duration);

    const renderLiveMetrics = () => {
      if (!mounted) return;

      const actualElement = actualWpmElementRef.current;
      const timeElement = timeElementRef.current;
      const start = startTimeRef.current;

      if (status !== "running" || start === null) {
        if (actualElement && actualElement.textContent !== "0.0") actualElement.textContent = "0.0";
        if (timeElement && timeElement.textContent !== lastTime) {
          lastTime = formatTime(duration);
          timeElement.textContent = lastTime;
        }
        return;
      }

      const elapsedMs = Math.max(0, Date.now() - start);
      const elapsedMinutes = elapsedMs / 60000;
      const typedCharacters = liveCharCountRef.current;
      const actualWpm = elapsedMinutes > 0
        ? Math.max(0, Math.round((typedCharacters / 5 / elapsedMinutes) * 10) / 10)
        : 0;
      const nextWpm = actualWpm.toFixed(1);

      if (actualElement && nextWpm !== lastWpm) {
        lastWpm = nextWpm;
        actualElement.textContent = nextWpm;
      }

      const remainingMs = Math.max(0, duration * 1000 - elapsedMs);
      const remainingSec = Math.ceil(remainingMs / 1000);
      const nextTime = formatTime(remainingSec);
      if (timeElement && nextTime !== lastTime) {
        lastTime = nextTime;
        timeElement.textContent = nextTime;
      }

      animationFrame = window.requestAnimationFrame(renderLiveMetrics);
    };

    renderLiveMetrics();

    return () => {
      mounted = false;
      window.cancelAnimationFrame(animationFrame);
    };
  }, [duration, liveCharCountRef, startTimeRef, status]);

  return (
    <div className={focusMode
      ? "metric-surface grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-surface2/65"
      : "metric-surface grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-surface2/70"
    }>
      <div className={focusMode
        ? "flex min-h-[112px] flex-col items-center justify-center gap-2 px-3 py-5 sm:min-h-[132px] sm:py-6"
        : "flex min-h-[88px] flex-col items-center justify-center gap-1 px-3 py-4 sm:py-5"
      }>
        <span className={focusMode
          ? "text-[10px] font-semibold uppercase tracking-[0.18em] text-faint sm:text-xs"
          : "text-[10px] font-semibold uppercase tracking-[0.18em] text-faint sm:text-xs"
        }>
          Actual WPM
        </span>
        <span
          ref={actualWpmElementRef}
          aria-live="off"
          className={focusMode
            ? "font-mono text-4xl font-bold tabular-nums text-accent sm:text-5xl lg:text-6xl"
            : "font-mono text-2xl font-bold tabular-nums text-accent sm:text-3xl"
          }
        >
          0.0
        </span>
      </div>

      <div className={focusMode
        ? "flex min-h-[112px] flex-col items-center justify-center gap-2 px-3 py-5 sm:min-h-[132px] sm:py-6"
        : "flex min-h-[88px] flex-col items-center justify-center gap-1 px-3 py-4 sm:py-5"
      }>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint sm:text-xs">
          Accuracy
        </span>
        <span className={focusMode
          ? "font-mono text-4xl font-bold tabular-nums text-ink sm:text-5xl lg:text-6xl"
          : "font-mono text-2xl font-bold tabular-nums text-ink sm:text-3xl"
        }>
          {accuracy}%
        </span>
      </div>

      <div className={focusMode
        ? "flex min-h-[112px] flex-col items-center justify-center gap-2 px-3 py-5 sm:min-h-[132px] sm:py-6"
        : "flex min-h-[88px] flex-col items-center justify-center gap-1 px-3 py-4 sm:py-5"
      }>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint sm:text-xs">
          Time
        </span>
        <span
          ref={timeElementRef}
          className={focusMode
            ? "font-mono text-4xl font-bold tabular-nums text-ink sm:text-5xl lg:text-6xl"
            : "font-mono text-2xl font-bold tabular-nums text-ink sm:text-3xl"
          }
        >
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
