import { detectLocaleFromPathname, type Locale } from "../lib/i18n";
import TypingTester from "./TypingTester";
import SecurityBoundary from "./SecurityBoundary";

export default function TypingTesterIsland({ locale }: { locale?: Locale }) {
  const detectedLocale: Locale = locale ?? (typeof window !== "undefined" ? detectLocaleFromPathname(window.location.pathname) : "en");
  return <SecurityBoundary><TypingTester locale={detectedLocale} /></SecurityBoundary>;
}
