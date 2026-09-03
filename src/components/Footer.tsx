import type { Locale } from "../lib/i18n";
import { tr } from "../lib/i18n";

const FOOTER_KEYS = [
  ["typingTester", "/#tester"],
  ["typingPractice", "/#typing-practice"],
  ["guides", "/#guides"],
  ["howItWorks", "/#how-it-works"],
  ["faq", "/#faq"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["privacy", "/privacy-policy"],
  ["terms", "/terms-of-use"],
] as const;

export default function Footer({ locale = "en" as Locale }: { locale?: Locale }) {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="font-title text-ink tracking-tight">FreeTypingTest<span className="text-accent">Goat</span></div>
            <p className="mt-3 max-w-sm font-body-sm text-text-muted">
              {tr(locale, "footer", "description")}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 font-link text-ink" aria-label={locale === "es" ? "Pie de página" : "Footer"}>
            {FOOTER_KEYS.map(([key, href]) => (
              <a key={href} href={href} className="text-text-muted transition-colors hover:text-ink">
                {tr(locale, "footer", key)}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-hairline pt-6 font-caption text-text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} FreeTypingTestGoat. {tr(locale, "footer", "rights")}</p>
          <p>{tr(locale, "footer", "tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
