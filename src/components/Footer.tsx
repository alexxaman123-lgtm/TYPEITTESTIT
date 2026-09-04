import type { Locale } from "../lib/i18n";
import { tr } from "../lib/i18n";

export default function Footer({ locale = "en" as Locale }: { locale?: Locale }) {
  const prefix = locale === "es" ? "/es" : "";
  const brand = locale === "es" ? "Test de mecanografía Cabra" : "FreeTypingTestGoat";

  const links = [
    [tr(locale,"footer","typingTester"), `${prefix}/#tester`],
    [tr(locale,"footer","typingPractice"), `${prefix}/#typing-practice`],
    [tr(locale,"footer","guides"), `${prefix}/#guides`],
    [tr(locale,"footer","howItWorks"), `${prefix}/#how-it-works`],
    [tr(locale,"footer","faq"), `${prefix}/#faq`],
    [tr(locale,"footer","about"), `${prefix}/about/`],
    [tr(locale,"footer","contact"), `${prefix}/contact/`],
    [locale === "es" ? "Historial de escritura" : "Typing History", `${prefix}/account/`],
    [tr(locale,"footer","privacy"), `${prefix}/privacy-policy/`],
    [tr(locale,"footer","terms"), `${prefix}/terms-of-use/`],
  ] as const;

  return (
    <footer data-footer-parallax className="relative overflow-hidden border-t border-hairline bg-canvas">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <div className="font-title tracking-tight text-ink">{brand}</div>
            <p className="mt-3 max-w-sm font-body-sm text-text-muted">{tr(locale,"footer","description")}</p>
          </div>
          <nav className="flex max-w-3xl flex-wrap gap-x-6 gap-y-3 font-link text-ink" aria-label={locale === "es" ? "Pie de página" : "Footer"}>
            {links.map(([label,href]) => <a key={href} href={href} className="text-text-muted transition-colors hover:text-ink">{label}</a>)}
          </nav>
        </div>

        <div className="mt-16 border-t border-hairline pt-6 font-caption text-text-faint">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} {brand}. {tr(locale,"footer","rights")}</p>
            <p>{tr(locale,"footer","tagline")}</p>
          </div>
        </div>
      </div>

      <div className="footer-wordmark-stage" aria-hidden="true">
        <div data-footer-wordmark className="footer-wordmark">TYPE IT. TEST IT.</div>
      </div>
    </footer>
  );
}
