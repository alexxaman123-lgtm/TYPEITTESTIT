import { useEffect, useRef, useState } from "react";

const LANGUAGES = [
  { code: "en", label: "English", href: "/" },
  { code: "es", label: "Español", href: "/es/" },
];

function getLocalizedPath(targetCode: string, pathname: string): string {
  const clean = pathname || "/";
  const withoutSpanish = clean.replace(/^\/es(?=\/|$)/, "") || "/";
  if (targetCode === "es") return withoutSpanish === "/" ? "/es/" : `/es${withoutSpanish}`;
  return withoutSpanish;
}

export default function LanguagePicker({ locale = "en" }: { locale?: "en" | "es" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const current = LANGUAGES.find((language) => language.code === locale) ?? LANGUAGES[0];

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
        className="flex h-[34px] items-center gap-2 rounded-full border border-hairline bg-canvas px-3 font-label text-ink transition-colors hover:bg-canvas-soft sm:h-[36px]"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={locale === "es" ? "Cambiar idioma" : "Change language"}
      >
        <span aria-hidden="true">A</span>
        <span className="hidden sm:inline">{current.label}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-[80] mt-2 min-w-[170px] overflow-hidden rounded-[18px] border border-hairline bg-canvas-soft p-1 shadow-2xl">
          {LANGUAGES.map((language) => {
            const href = getLocalizedPath(language.code, window.location.pathname);
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
