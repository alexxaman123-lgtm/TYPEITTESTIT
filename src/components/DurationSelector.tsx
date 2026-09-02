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
    <div role="radiogroup" aria-label="Test duration" className="flex items-center gap-1 rounded-full bg-canvas-soft p-1">
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
              "rounded-full px-4 py-1.5 font-label transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
              active
                ? "bg-canvas shadow-sm text-ink"
                : "text-text-muted hover:text-ink hover:bg-canvas-soft"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
