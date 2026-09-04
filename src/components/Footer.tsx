import { useEffect, useRef } from "react";
import type { Locale } from "../lib/i18n";
import { tr } from "../lib/i18n";

export default function Footer({ locale = "en" as Locale }: { locale?: Locale }) {
  const prefix = locale === "es" ? "/es" : "";
  const brand = locale === "es" ? "Test de mecanografía Cabra" : "FreeTypingTestGoat";
  const footerRef = useRef<HTMLElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);

  const links = [
    [tr(locale,"footer","typingTester"), `${prefix}/#tester`],
    [tr(locale,"footer","typingPractice"), `${prefix}/#typing-practice`],
    [tr(locale,"footer","guides"), `${prefix}/#guides`],
    [tr(locale,"footer","howItWorks"), `${prefix}/#how-it-works`],
    [tr(locale,"footer","faq"), `${prefix}/#faq`],
    [tr(locale,"footer","about"), `${prefix}/about/`],
    [tr(locale,"footer","contact"), `${prefix}/contact/`],
    [tr(locale,"footer","privacy"), `${prefix}/privacy-policy/`],
    [tr(locale,"footer","terms"), `${prefix}/terms-of-use/`],
  ] as const;

  useEffect(() => {
    const footer = footerRef.current;
    const wordmark = wordmarkRef.current;
    if (!footer || !wordmark) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = footer.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height)));
      const offset = 72 - progress * 144;
      wordmark.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-hairline bg-canvas">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden" aria-hidden="true">
        <div
          ref={wordmarkRef}
          className="whitespace-nowrap px-4 font-display font-semibold leading-[0.78] tracking-[-0.07em] text-ink/10 transition-transform duration-150 ease-out sm:px-6 lg:px-8"
          style={{ fontSize: "clamp(5.25rem, 19vw, 20rem)", transform: "translate3d(0, 72px, 0)" }}
        >
          TYPE IT. TEST IT.
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <div className="font-title text-ink tracking-tight">{brand}</div>
            <p className="mt-3 max-w-sm font-body-sm text-text-muted">{tr(locale,"footer","description")}</p>
          </div>
          <nav className="flex max-w-3xl flex-wrap gap-x-6 gap-y-3 font-link text-ink" aria-label={locale === "es" ? "Pie de página" : "Footer"}>
            {links.map(([label,href]) => <a key={href} href={href} className="text-text-muted transition-colors hover:text-ink">{label}</a>)}
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-hairline pt-6 font-caption text-text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {brand}. {tr(locale,"footer","rights")}</p>
          <p>{tr(locale,"footer","tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
