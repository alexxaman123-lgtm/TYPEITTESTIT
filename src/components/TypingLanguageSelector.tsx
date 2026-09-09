import { LOCALES, LOCALE_META } from "../lib/i18n";
import type { TypingLocale } from "../lib/useTypingTest";
import { cn } from "../utils/cn";

interface Props {
  value: TypingLocale;
  onChange: (locale: TypingLocale) => void;
  disabled?: boolean;
}

// Lets the typist choose which language the practice passage itself is
// written in. This now covers every site locale (not just ES/EN), and each
// button is labeled with that language's own native name so the control
// reads correctly no matter which localized page it appears on.
export default function TypingLanguageSelector({ value, onChange, disabled = false }: Props) {
  return (
    <div className="flex justify-center pb-1 pt-1" aria-label="Typing text language">
      <div className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full border border-hairline bg-canvas-soft p-1 shadow-sm">
        {LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => onChange(locale)}
            disabled={disabled}
            aria-pressed={value === locale}
            aria-label={LOCALE_META[locale].nativeName}
            className={cn(
              "whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.04em] transition-colors",
              value === locale ? "bg-primary text-on-primary" : "text-text-muted hover:bg-canvas hover:text-ink",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {LOCALE_META[locale].nativeName}
          </button>
        ))}
      </div>
    </div>
  );
}
