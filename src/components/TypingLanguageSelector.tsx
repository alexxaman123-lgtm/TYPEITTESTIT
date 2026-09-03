import type { TypingLocale } from "../lib/useTypingTest";
import { cn } from "../utils/cn";

interface Props {
  value: TypingLocale;
  onChange: (locale: TypingLocale) => void;
  disabled?: boolean;
}

export default function TypingLanguageSelector({ value, onChange, disabled = false }: Props) {
  return (
    <div className="flex justify-center pb-1 pt-1" aria-label="Typing language">
      <div className="inline-flex items-center rounded-full border border-hairline bg-canvas-soft p-1 shadow-sm">
        <button
          type="button"
          onClick={() => onChange("es")}
          disabled={disabled}
          aria-pressed={value === "es"}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
            value === "es" ? "bg-primary text-on-primary" : "text-text-muted hover:bg-canvas hover:text-ink",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          ES
        </button>
        <button
          type="button"
          onClick={() => onChange("en")}
          disabled={disabled}
          aria-pressed={value === "en"}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
            value === "en" ? "bg-primary text-on-primary" : "text-text-muted hover:bg-canvas hover:text-ink",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          EN
        </button>
      </div>
    </div>
  );
}
