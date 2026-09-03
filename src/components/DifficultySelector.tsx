import type { Locale } from "../lib/i18n";
import { tr } from "../lib/i18n";
import { cn } from "../utils/cn";

const OPTIONS = [
  { value: "easy" as const, key: "easy" },
  { value: "medium" as const, key: "medium" },
  { value: "hard" as const, key: "hard" },
];

interface Props {
  value: "easy" | "medium" | "hard";
  onChange: (d: "easy" | "medium" | "hard") => void;
  disabled?: boolean;
  locale?: Locale;
}

export default function DifficultySelector({ value, onChange, disabled, locale = "en" }: Props) {
  return (
    <div role="radiogroup" aria-label={tr(locale, "tester", "difficulty")} className="flex items-center gap-1 rounded-full bg-canvas-soft p-1">
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button key={opt.value} type="button" role="radio" aria-checked={active} disabled={disabled} onClick={() => onChange(opt.value)} className={cn("rounded-full px-4 py-1.5 font-label uppercase transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50", active ? "bg-canvas shadow-sm text-ink" : "text-text-muted hover:text-ink hover:bg-canvas-soft")}>
            {tr(locale, "tester", opt.key)}
          </button>
        );
      })}
    </div>
  );
}
