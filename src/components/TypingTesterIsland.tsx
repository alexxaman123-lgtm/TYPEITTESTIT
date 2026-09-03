import type { Locale } from "../lib/i18n";
import TypingTester from "./TypingTester";
import SecurityBoundary from "./SecurityBoundary";

export default function TypingTesterIsland({ locale = "en" }: { locale?: Locale }) {
  return (
    <SecurityBoundary>
      <TypingTester locale={locale} />
    </SecurityBoundary>
  );
}
