import { RefObject } from "react";
import { formatTime } from "../lib/stats";
import { cn } from "../utils/cn";

interface Props {
  wpm: number;
  predictedWpm: number | null;
  accuracy: number;
  remainingSec: number;
  urgent: boolean;
  liveWpmRef: RefObject<number>;
  actualWpmElementRef: RefObject<HTMLSpanElement | null>;
}

export default function LiveMetrics({
  predictedWpm,
  accuracy,
  remainingSec,
  urgent,
  actualWpmElementRef,
}: Props) {
  // Actual WPM is intentionally NOT synchronized from React state here.
  // TypingText writes the freshest value directly to this shared DOM element
  // from the browser's native input event. Keeping this element childless from
  // React prevents reconciliation from overwriting that low-latency value.
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
        />
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
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-faint sm:text-xs">{label}</span>
      <span className={cn("font-mono text-2xl font-bold tabular-nums transition-colors duration-300 sm:text-3xl", valueClass, pulse && "caret-blink")}>
        {value}
      </span>
    </div>
  );
}
