import { RefObject, useEffect, useRef } from "react";
import { formatTime } from "../lib/stats";
import type { Locale } from "../lib/i18n";
import { tr } from "../lib/i18n";

interface Props {
  accuracy: number;
  status: "idle" | "running" | "finished";
  duration: number;
  liveCharCountRef: RefObject<number>;
  startTimeRef: RefObject<number | null>;
  focusMode?: boolean;
  locale?: Locale;
}

export default function LiveMetrics({
  accuracy,
  status,
  duration,
  liveCharCountRef,
  startTimeRef,
  focusMode = false,
  locale = "en",
}: Props) {
  const actualWpmElementRef = useRef<HTMLSpanElement | null>(null);
  const timeElementRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let animationFrame = 0;
    let mounted = true;
    let lastWpm = "0.0";
    let lastTime = formatTime(duration);

    const render = () => {
      if (!mounted) return;
      const wpmElement = actualWpmElementRef.current;
      const timeElement = timeElementRef.current;
      const start = startTimeRef.current;

      if (status !== "running" || start === null) {
        if (wpmElement && wpmElement.textContent !== "0.0") wpmElement.textContent = "0.0";
        if (timeElement && timeElement.textContent !== lastTime) {
          lastTime = formatTime(duration);
          timeElement.textContent = lastTime;
        }
        return;
      }

      const elapsedMs = Math.max(0, Date.now() - start);
      const elapsedMinutes = elapsedMs / 60000;
      const typedCharacters = liveCharCountRef.current;
      const wpm = elapsedMinutes > 0
        ? Math.max(0, Math.round((typedCharacters / 5 / elapsedMinutes) * 10) / 10)
        : 0;
      const nextWpm = wpm.toFixed(1);

      if (wpmElement && nextWpm !== lastWpm) {
        lastWpm = nextWpm;
        wpmElement.textContent = nextWpm;
      }

      const nextTime = formatTime(Math.ceil(Math.max(0, duration * 1000 - elapsedMs) / 1000));
      if (timeElement && nextTime !== lastTime) {
        lastTime = nextTime;
        timeElement.textContent = nextTime;
      }
      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => {
      mounted = false;
      cancelAnimationFrame(animationFrame);
    };
  }, [duration, liveCharCountRef, startTimeRef, status]);

  const cell = focusMode
    ? "flex flex-col items-center justify-center gap-1 px-2 py-1"
    : "flex min-h-[72px] flex-col items-center justify-center gap-1 px-2.5 py-3 sm:min-h-[78px] sm:py-3.5";
  const metricValue = focusMode
    ? "font-sans text-xl font-semibold tracking-tight tabular-nums sm:text-2xl lg:text-3xl"
    : "font-sans text-2xl font-semibold tracking-tight tabular-nums sm:text-[28px]";
  const metricLabel = focusMode
    ? "font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-text-muted sm:text-[11px]"
    : "font-label text-text-muted";

  return (
    <div
      className={focusMode
        ? "metric-surface focus-metrics mx-auto grid w-full max-w-[720px] grid-cols-3 gap-3"
        : "metric-surface grid grid-cols-3 divide-x divide-hairline rounded-[24px] border border-hairline bg-canvas-soft"}
    >
      <div className={cell}>
        <span className={metricLabel}>{tr(locale, "tester", "actualWpm")}</span>
        <span ref={actualWpmElementRef} aria-live="off" className={`${metricValue} text-accent`}>0.0</span>
      </div>
      <div className={cell}>
        <span className={metricLabel}>{tr(locale, "tester", "accuracy")}</span>
        <span className={`${metricValue} text-ink`}>{accuracy}%</span>
      </div>
      <div className={cell}>
        <span className={metricLabel}>{tr(locale, "tester", "time")}</span>
        <span ref={timeElementRef} className={`${metricValue} text-ink`}>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
