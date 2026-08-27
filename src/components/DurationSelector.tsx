import { cn } from "../utils/cn";

const OPTIONS: { value: number; label: string }[] = [
  { value: 60, label: "1 MIN" },
  { value: 120, label: "2 MIN" },
  { value: 180, label: "3 MIN" },
  { value: 300, label: "5 MIN" },
];

interface Props {
  value: number;
  onChange: (secs: number) => void;
  disabled?: boolean;
}

export default function DurationSelector({ value, onChange, disabled }: Props) {
  return (
    <div role="radiogroup" aria-label="Test duration" className="flex items-center gap-1.5 rounded-xl bg-surface2 p-1.5">
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-semibold tracking-wide transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
              active
                ? "bg-accent text-black shadow-[0_0_18px_rgba(0,255,102,0.35)]"
                : "text-muted hover:text-ink hover:bg-white/5"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
