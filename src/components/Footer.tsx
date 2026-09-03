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
    [tr(locale,"footer","privacy"), `${prefix}/privacy-policy/`],
    [tr(locale,"footer","terms"), `${prefix}/terms-of-use/`],
  ] as const;
  return <footer className="border-t border-hairline bg-canvas"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"><div><div className="font-title text-ink tracking-tight">{brand}</div><p className="mt-3 max-w-sm font-body-sm text-text-muted">{tr(locale,"footer","description")}</p></div><nav className="flex flex-wrap gap-x-6 gap-y-3 font-link text-ink" aria-label={locale === "es" ? "Pie de página" : "Footer"}>{links.map(([label,href])=><a key={href} href={href} className="text-text-muted transition-colors hover:text-ink">{label}</a>)}</nav></div><div className="mt-12 flex flex-col gap-2 border-t border-hairline pt-6 font-caption text-text-faint sm:flex-row sm:items-center sm:justify-between"><p>&copy; {new Date().getFullYear()} {brand}. {tr(locale,"footer","rights")}</p><p>{tr(locale,"footer","tagline")}</p></div></div></footer>;
}
