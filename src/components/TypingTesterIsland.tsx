import type { Locale } from "../lib/i18n";
import TypingTester from "./TypingTester";
import SecurityBoundary from "./SecurityBoundary";

export default function TypingTesterIsland({ locale }: { locale?: Locale }) {
  const detectedLocale: Locale = locale ?? (typeof window !== "undefined" && window.location.pathname.startsWith("/es") ? "es" : "en");
  return <SecurityBoundary><TypingTester locale={detectedLocale} /></SecurityBoundary>;
}
