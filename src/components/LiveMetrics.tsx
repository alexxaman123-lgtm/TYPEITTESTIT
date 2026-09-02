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
      const nextTime = formatTime(Math.ceil(remainingMs / 1000));
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

  const cell = focusMode
    ? "flex min-h-[112px] flex-col items-center justify-center gap-2 px-3 py-5 sm:min-h-[132px] sm:py-6"
    : "flex min-h-[72px] flex-col items-center justify-center gap-0.5 px-2.5 py-3 sm:min-h-[78px] sm:py-3.5";

  return (
    <div className={focusMode
      ? "metric-surface grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-surface2/65"
      : "metric-surface grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-surface2/70"
    }>
      <div className={cell}>
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-faint sm:text-[10px]">Actual WPM</span>
        <span
          ref={actualWpmElementRef}
          aria-live="off"
          className={focusMode ? "font-mono text-4xl font-bold tabular-nums text-accent sm:text-5xl lg:text-6xl" : "font-mono text-2xl font-bold tabular-nums text-accent sm:text-[28px]"}
        >0.0</span>
      </div>

      <div className={cell}>
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-faint sm:text-[10px]">Accuracy</span>
        <span className={focusMode ? "font-mono text-4xl font-bold tabular-nums text-ink sm:text-5xl lg:text-6xl" : "font-mono text-2xl font-bold tabular-nums text-ink sm:text-[28px]"}>
          {accuracy}%
        </span>
      </div>

      <div className={cell}>
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-faint sm:text-[10px]">Time</span>
        <span
          ref={timeElementRef}
          className={focusMode ? "font-mono text-4xl font-bold tabular-nums text-ink sm:text-5xl lg:text-6xl" : "font-mono text-2xl font-bold tabular-nums text-ink sm:text-[28px]"}
        >
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
