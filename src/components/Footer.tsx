import type { Locale } from "../lib/i18n";
import { LOCALE_META, tr, withLocalePrefix } from "../lib/i18n";

const WORDMARK: Record<Locale, string> = {
  en: "TYPE IT. TEST IT.", es: "ESCRIBE. PONTE A PRUEBA.", de: "TIPPEN. TESTEN.", fr: "TAPEZ. TESTEZ.", it: "DIGITA. TESTATI.", pt: "DIGITE. TESTE-SE.", pl: "PISZ. TESTUJ SIĘ.", tr: "YAZ. TEST ET.", uk: "ПИШИ. ТЕСТУЙСЯ.", id: "KETIK. UJI DIRIMU.", zh: "打字。测试。", ja: "タイプして。テストして。", ko: "타이핑하세요. 테스트하세요.",
};
const KEYBOARD_TEST_LABEL: Record<Locale, string> = { en: "Keyboard Tester", es: "Prueba de teclado", de: "Tastatur testen", fr: "Test clavier", it: "Test tastiera", pt: "Teste de teclado", pl: "Test klawiatury", tr: "Klavye testi", uk: "Тест клавіатури", id: "Tes keyboard", zh: "在线键盘测试", ja: "キーボードテスト", ko: "키보드 테스트" };
const WORDMARK_STYLE: Partial<Record<Locale, { fontSize: string }>> = { es: { fontSize: "clamp(3.2rem, 7.8vw, 10rem)" }, de: { fontSize: "clamp(2.9rem, 7vw, 9rem)" }, fr: { fontSize: "clamp(3rem, 7.2vw, 9.2rem)" }, pt: { fontSize: "clamp(2.9rem, 7vw, 9rem)" }, pl: { fontSize: "clamp(2.8rem, 6.8vw, 8.8rem)" }, uk: { fontSize: "clamp(2.9rem, 7vw, 9rem)" }, id: { fontSize: "clamp(2.9rem, 7vw, 9rem)" } };

function useFooterColumns(locale: Locale) {
  return [
    { heading: tr(locale, "footer", "practiceHeading"), links: [[tr(locale, "footer", "typingTester"), withLocalePrefix(locale, "/#tester")], [tr(locale, "footer", "typingPractice"), withLocalePrefix(locale, "/#typing-practice")], [KEYBOARD_TEST_LABEL[locale], withLocalePrefix(locale, "/keyboard-test/")], [tr(locale, "footer", "howItWorks"), withLocalePrefix(locale, "/#how-it-works")]] },
    { heading: tr(locale, "footer", "exploreHeading"), links: [[tr(locale, "footer", "faq"), withLocalePrefix(locale, "/#faq")], [tr(locale, "nav", "leaderboard"), withLocalePrefix(locale, "/leaderboard/")], [tr(locale, "footer", "blog"), "/blog/"], [tr(locale, "footer", "typingHistory"), withLocalePrefix(locale, "/account/")]] },
    { heading: tr(locale, "footer", "companyHeading"), links: [[tr(locale, "footer", "about"), withLocalePrefix(locale, "/about/")], [tr(locale, "footer", "contact"), withLocalePrefix(locale, "/contact/")]] },
    { heading: tr(locale, "footer", "legalHeading"), links: [[tr(locale, "footer", "privacy"), withLocalePrefix(locale, "/privacy-policy/")], [tr(locale, "footer", "terms"), withLocalePrefix(locale, "/terms-of-use/")]] },
  ] as const;
}

export default function Footer({ locale = "en" as Locale }: { locale?: Locale }) {
  const meta = LOCALE_META[locale] ?? LOCALE_META.en; const brand = meta.brand; const wordmark = WORDMARK[locale] ?? WORDMARK.en; const columns = useFooterColumns(locale);
  return <footer data-footer-parallax className="relative overflow-hidden border-t border-hairline bg-canvas"><div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"><div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] lg:gap-x-10"><div className="col-span-2 sm:col-span-4 lg:col-span-1"><div className="font-title tracking-tight text-ink">{brand}</div><p className="mt-3 max-w-sm font-body-sm text-text-muted">{tr(locale, "footer", "description")}</p></div>{columns.map((column) => <nav key={column.heading} aria-label={column.heading}><div className="font-caption uppercase tracking-wide text-text-faint">{column.heading}</div><ul className="mt-4 space-y-3">{column.links.map(([label, href]) => <li key={href}><a href={href} className="font-link text-text-muted transition-colors hover:text-ink">{label}</a></li>)}</ul></nav>)}</div><div className="mt-16 border-t border-hairline pt-6 font-caption text-text-faint"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><p>&copy; {new Date().getFullYear()} {brand}. {tr(locale, "footer", "rights")}</p><p>{tr(locale, "footer", "tagline")}</p></div></div></div><div className="footer-wordmark-stage" aria-hidden="true"><div data-footer-wordmark className="footer-wordmark" style={WORDMARK_STYLE[locale]}>{wordmark}</div></div></footer>;
}
