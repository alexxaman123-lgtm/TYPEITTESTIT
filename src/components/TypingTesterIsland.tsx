import TypingTester from "./TypingTester";
import SecurityBoundary from "./SecurityBoundary";

export default function TypingTesterIsland() {
  return (
    <SecurityBoundary>
      <TypingTester />
    </SecurityBoundary>
  );
}
