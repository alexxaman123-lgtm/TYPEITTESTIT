import type { Locale } from "../lib/i18n";
import { tr } from "../lib/i18n";
import { cn } from "../utils/cn";

const OPTIONS = [
  { value: 60, key: "oneMin" },
  { value: 120, key: "twoMin" },
  { value: 180, key: "threeMin" },
  { value: 300, key: "fiveMin" },
] as const;

interface Props {
  value: number;
  onChange: (secs: number) => void;
  disabled?: boolean;
  locale?: Locale;
}

export default function DurationSelector({ value, onChange, disabled, locale = "en" }: Props) {
  return (
    <div role="radiogroup" aria-label={tr(locale, "tester", "duration")} className="flex items-center gap-1 rounded-full bg-canvas-soft p-1">
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return <button key={opt.value} type="button" role="radio" aria-checked={active} disabled={disabled} onClick={() => onChange(opt.value)} className={cn("rounded-full px-4 py-1.5 font-label transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50", active ? "bg-canvas shadow-sm text-ink" : "text-text-muted hover:text-ink hover:bg-canvas-soft")}>{tr(locale, "tester", opt.key)}</button>;
      })}
    </div>
  );
}
