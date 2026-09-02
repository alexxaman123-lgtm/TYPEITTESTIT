import type { Difficulty } from "../data/texts";
import { cn } from "../utils/cn";

const OPTIONS: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

interface Props {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
  disabled?: boolean;
}

export default function DifficultySelector({ value, onChange, disabled }: Props) {
  return (
    <div role="radiogroup" aria-label="Difficulty" className="flex items-center gap-1 rounded-full bg-canvas-soft p-1">
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
              "rounded-full px-4 py-1.5 font-label uppercase transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
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
