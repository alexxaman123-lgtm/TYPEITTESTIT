import type { Locale } from "../lib/i18n";
import { LOCALE_META, tr, withLocalePrefix } from "../lib/i18n";

const WORDMARK: Record<Locale, string> = {
  en: "TYPE IT. TEST IT.",
  es: "ESCRIBE. PONTE A PRUEBA.",
  de: "TIPPEN. TESTEN.",
  fr: "TAPEZ. TESTEZ.",
  it: "DIGITA. TESTATI.",
  pt: "DIGITE. TESTE-SE.",
  pl: "PISZ. TESTUJ SI\u0118.",
  tr: "YAZ. TEST ET.",
  uk: "ПИШИ. ТЕСТУйСя.",
  id: "KETIK. UJI DIRIMU.",
  zh: "打字。测试。",
  ja: "タイプして。テストして。",
  ko: "타이핑하세요. 테스트하세요.",
};

const WORDMARK_STYLE: Partial<Record<Locale, { fontSize: string }>> = {
  es: { fontSize: "clamp(3.2rem, 7.8vw, 10rem)" },
  de: { fontSize: "clamp(2.9rem, 7vw, 9rem)" },
  fr: { fontSize: "clamp(3rem, 7.2vw, 9.2rem)" },
  pt: { fontSize: "clamp(2.9rem, 7vw, 9rem)" },
  pl: { fontSize: "clamp(2.8rem, 6.8vw, 8.8rem)" },
  uk: { fontSize: "clamp(2.9rem, 7vw, 9rem)" },
  id: { fontSize: "clamp(2.9rem, 7vw, 9rem)" },
};

export default function Footer({ locale = "en" as Locale }: { locale?: Locale }) {
  const meta = LOCALE_META[locale] ?? LOCALE_META.en;
  const brand = meta.brand;
  const wordmark = WORDMARK[locale] ?? WORDMARK.en;
  const wordmarkStyle = WORDMARK_STYLE[locale];

  const links = [
    [tr(locale, "footer", "typingTester"), withLocalePrefix(locale, "/#tester")],
    [tr(locale, "footer", "typingPractice"), withLocalePrefix(locale, "/#typing-practice")],
    [tr(locale, "footer", "guides"), withLocalePrefix(locale, "/#guides")],
    [tr(locale, "footer", "howItWorks"), withLocalePrefix(locale, "/#how-it-works")],
    [tr(locale, "footer", "faq"), withLocalePrefix(locale, "/#faq")],
    [tr(locale, "footer", "about"), withLocalePrefix(locale, "/about/")],
    [tr(locale, "footer", "blog"), "/blog/"],
    [tr(locale, "footer", "contact"), withLocalePrefix(locale, "/contact/")],
    [tr(locale, "footer", "typingHistory"), withLocalePrefix(locale, "/account/")],
    [tr(locale, "footer", "privacy"), withLocalePrefix(locale, "/privacy-policy/")],
    [tr(locale, "footer", "terms"), withLocalePrefix(locale, "/terms-of-use/")],
  ] as const;

  return (
    <footer data-footer-parallax className="relative overflow-hidden border-t border-hairline bg-canvas">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <div>
            <div className="font-title tracking-tight text-ink">{brand}</div>
            <p className="mt-3 max-w-sm font-body-sm text-text-muted">{tr(locale, "footer", "description")}</p>
          </div>
          <nav className="flex max-w-3xl flex-wrap gap-x-6 gap-y-3 font-link text-ink" aria-label={tr(locale, "footer", "footerNav")}>
            {links.map(([label, href]) => <a key={href} href={href} className="text-text-muted transition-colors hover:text-ink">{label}</a>)}
          </nav>
        </div>

        <div className="mt-16 border-t border-hairline pt-6 font-caption text-text-faint">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} {brand}. {tr(locale, "footer", "rights")}</p>
            <p>{tr(locale, "footer", "tagline")}</p>
          </div>
        </div>
      </div>

      <div className="footer-wordmark-stage" aria-hidden="true">
        <div data-footer-wordmark className="footer-wordmark" style={wordmarkStyle}>{wordmark}</div>
      </div>
    </footer>
  );
}
