import { LOCALES, LOCALE_META } from "../lib/i18n";
import type { TypingLocale } from "../lib/useTypingTest";
import { cn } from "../utils/cn";

interface Props {
  value: TypingLocale;
  onChange: (locale: TypingLocale) => void;
  disabled?: boolean;
}

// Every language stays inside the selector on narrow screens. Phones use a
// compact three-column grid; larger screens keep the original wrapping pill.
export default function TypingLanguageSelector({ value, onChange, disabled = false }: Props) {
  return (
    <div className="flex w-full justify-center pb-1 pt-1" aria-label="Typing text language">
      <div className="grid w-full max-w-full grid-cols-3 gap-1 rounded-[22px] border border-hairline bg-canvas-soft p-1.5 shadow-sm sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:justify-center sm:rounded-full sm:p-1">
        {LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => onChange(locale)}
            disabled={disabled}
            aria-pressed={value === locale}
            aria-label={LOCALE_META[locale].nativeName}
            className={cn(
              "min-h-10 min-w-0 rounded-2xl px-1.5 py-2 text-center text-[11px] font-semibold leading-tight tracking-normal transition-colors sm:min-h-0 sm:whitespace-nowrap sm:rounded-full sm:px-3 sm:py-1.5 sm:text-xs sm:tracking-[0.04em]",
              value === locale ? "bg-primary text-on-primary" : "text-text-muted hover:bg-canvas hover:text-ink",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <span className="block min-w-0 overflow-hidden text-ellipsis">{LOCALE_META[locale].nativeName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
