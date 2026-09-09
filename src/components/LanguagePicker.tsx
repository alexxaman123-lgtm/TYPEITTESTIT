import { useEffect, useRef, useState } from "react";
import { LOCALES, LOCALE_META, stripLocalePrefix, withLocalePrefix, type Locale } from "../lib/i18n";

function getLocalizedPath(targetLocale: Locale, pathname: string): string {
  const rootPath = stripLocalePrefix(pathname || "/");
  return withLocalePrefix(targetLocale, rootPath);
}

export default function LanguagePicker({ locale = "en" as Locale }: { locale?: Locale }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const current = LOCALE_META[locale] ?? LOCALE_META.en;
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-8 min-w-[38px] items-center justify-center px-1 font-label text-[11px] font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:text-text-muted sm:h-9 sm:min-w-[42px] sm:px-1.5 sm:text-xs"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${current.nativeName}`}
      >
        {current.htmlLang.toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[80] mt-2 max-h-[70vh] min-w-[190px] overflow-y-auto rounded-[18px] border border-hairline bg-canvas-soft p-1 shadow-2xl">
          {LOCALES.map((code) => {
            const language = LOCALE_META[code];
            const href = getLocalizedPath(code, pathname);
            const active = code === locale;
            return (
              <a
                key={code}
                href={href}
                onClick={() => setOpen(false)}
                className={`block rounded-[12px] px-3 py-2.5 font-link transition-colors ${active ? "bg-canvas text-ink" : "text-text-muted hover:bg-canvas hover:text-ink"}`}
                aria-current={active ? "page" : undefined}
                hrefLang={language.htmlLang}
              >
                {language.nativeName}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
