import { useEffect, useRef, useState } from "react";

const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
] as const;

function getLocalizedPath(targetCode: string, pathname: string): string {
  const clean = pathname || "/";
  const withoutSpanish = clean.replace(/^\/es(?=\/|$)/, "") || "/";
  return targetCode === "es" ? (withoutSpanish === "/" ? "/es/" : `/es${withoutSpanish}`) : withoutSpanish;
}

export default function LanguagePicker({ locale = "en" }: { locale?: "en" | "es" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const current = LANGUAGES.find((language) => language.code === locale) ?? LANGUAGES[0];
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
        aria-label={locale === "es" ? "Cambiar idioma. Español" : "Change language. English"}
      >
        {current.short}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[80] mt-2 min-w-[170px] overflow-hidden rounded-[18px] border border-hairline bg-canvas-soft p-1 shadow-2xl">
          {LANGUAGES.map((language) => {
            const href = getLocalizedPath(language.code, pathname);
            const active = language.code === locale;
            return (
              <a
                key={language.code}
                href={href}
                onClick={() => setOpen(false)}
                className={`block rounded-[12px] px-3 py-2.5 font-link transition-colors ${active ? "bg-canvas text-ink" : "text-text-muted hover:bg-canvas hover:text-ink"}`}
                aria-current={active ? "page" : undefined}
              >
                {language.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
