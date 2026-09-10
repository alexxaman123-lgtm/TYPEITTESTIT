import { useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "../utils/cn";

type KeyDefinition = { code: string; label: string; width?: number };

const KEY_ROWS: KeyDefinition[][] = [
  [
    { code: "Escape", label: "Esc" },
    { code: "F1", label: "F1" }, { code: "F2", label: "F2" }, { code: "F3", label: "F3" }, { code: "F4", label: "F4" },
    { code: "F5", label: "F5" }, { code: "F6", label: "F6" }, { code: "F7", label: "F7" }, { code: "F8", label: "F8" },
    { code: "F9", label: "F9" }, { code: "F10", label: "F10" }, { code: "F11", label: "F11" }, { code: "F12", label: "F12" },
  ],
  [
    { code: "Backquote", label: "`" }, { code: "Digit1", label: "1" }, { code: "Digit2", label: "2" }, { code: "Digit3", label: "3" },
    { code: "Digit4", label: "4" }, { code: "Digit5", label: "5" }, { code: "Digit6", label: "6" }, { code: "Digit7", label: "7" },
    { code: "Digit8", label: "8" }, { code: "Digit9", label: "9" }, { code: "Digit0", label: "0" }, { code: "Minus", label: "-" },
    { code: "Equal", label: "=" }, { code: "Backspace", label: "Backspace", width: 2 },
  ],
  [
    { code: "Tab", label: "Tab", width: 1.5 }, { code: "KeyQ", label: "Q" }, { code: "KeyW", label: "W" }, { code: "KeyE", label: "E" },
    { code: "KeyR", label: "R" }, { code: "KeyT", label: "T" }, { code: "KeyY", label: "Y" }, { code: "KeyU", label: "U" },
    { code: "KeyI", label: "I" }, { code: "KeyO", label: "O" }, { code: "KeyP", label: "P" }, { code: "BracketLeft", label: "[" },
    { code: "BracketRight", label: "]" }, { code: "Backslash", label: "\\", width: 1.5 },
  ],
  [
    { code: "CapsLock", label: "Caps Lock", width: 1.8 }, { code: "KeyA", label: "A" }, { code: "KeyS", label: "S" }, { code: "KeyD", label: "D" },
    { code: "KeyF", label: "F" }, { code: "KeyG", label: "G" }, { code: "KeyH", label: "H" }, { code: "KeyJ", label: "J" },
    { code: "KeyK", label: "K" }, { code: "KeyL", label: "L" }, { code: "Semicolon", label: ";" }, { code: "Quote", label: "'" },
    { code: "Enter", label: "Enter", width: 2.2 },
  ],
  [
    { code: "ShiftLeft", label: "Shift", width: 2.3 }, { code: "KeyZ", label: "Z" }, { code: "KeyX", label: "X" }, { code: "KeyC", label: "C" },
    { code: "KeyV", label: "V" }, { code: "KeyB", label: "B" }, { code: "KeyN", label: "N" }, { code: "KeyM", label: "M" },
    { code: "Comma", label: "," }, { code: "Period", label: "." }, { code: "Slash", label: "/" }, { code: "ShiftRight", label: "Shift", width: 2.7 },
  ],
  [
    { code: "ControlLeft", label: "Ctrl", width: 1.3 }, { code: "MetaLeft", label: "Win", width: 1.3 }, { code: "AltLeft", label: "Alt", width: 1.3 },
    { code: "Space", label: "Space", width: 6.2 }, { code: "AltRight", label: "Alt", width: 1.3 }, { code: "MetaRight", label: "Win", width: 1.3 },
    { code: "ContextMenu", label: "Menu", width: 1.3 }, { code: "ControlRight", label: "Ctrl", width: 1.3 },
  ],
];

const TESTABLE_CODES = new Set(KEY_ROWS.flat().map((key) => key.code));
const PREVENT_DEFAULT_CODES = new Set(["Tab", "Space", "Backspace", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

export default function KeyboardTester() {
  const testerRef = useRef<HTMLDivElement | null>(null);
  const [pressed, setPressed] = useState<Set<string>>(() => new Set());
  const [tested, setTested] = useState<Set<string>>(() => new Set());
  const [lastKey, setLastKey] = useState("—");
  const [lastCode, setLastCode] = useState("—");
  const [listening, setListening] = useState(false);
  const progress = Math.round((tested.size / TESTABLE_CODES.size) * 100);
  const progressLabel = useMemo(() => `${tested.size} of ${TESTABLE_CODES.size} keys tested`, [tested.size]);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    if (PREVENT_DEFAULT_CODES.has(event.code)) event.preventDefault();
    setLastKey(event.key === " " ? "Space" : event.key);
    setLastCode(event.code || "Unknown");
    setPressed((current) => new Set(current).add(event.code));
    if (TESTABLE_CODES.has(event.code)) setTested((current) => new Set(current).add(event.code));
  };

  const handleKeyUp = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    setPressed((current) => {
      const next = new Set(current);
      next.delete(event.code);
      return next;
    });
  };

  const reset = () => {
    setPressed(new Set());
    setTested(new Set());
    setLastKey("—");
    setLastCode("—");
    window.requestAnimationFrame(() => testerRef.current?.focus());
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-3xl">
        <p className="font-label uppercase tracking-[0.16em] text-accent">Free hardware diagnostic</p>
        <h1 className="mt-4 font-heading-1 text-ink">Online Keyboard Tester</h1>
        <p className="mt-5 font-body-lg text-text-muted">
          Press every key to check whether your keyboard responds correctly. Keys light up live, and tested keys stay marked so you can quickly spot a key that is missing, stuck, or inconsistent.
        </p>
      </div>

      <div
        ref={testerRef}
        tabIndex={0}
        role="application"
        aria-label="Interactive keyboard tester"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onFocus={() => setListening(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setListening(false);
            setPressed(new Set());
          }
        }}
        onPointerDown={(event) => {
          if (!(event.target as HTMLElement).closest("button")) testerRef.current?.focus();
        }}
        className={cn(
          "mt-10 rounded-[24px] border bg-canvas p-4 shadow-sm outline-none transition-[border-color,box-shadow] sm:p-6 lg:p-8",
          listening ? "border-accent shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_12%,transparent)]" : "border-hairline",
        )}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={cn("h-2.5 w-2.5 rounded-full", listening ? "bg-accent" : "bg-text-faint")} />
              <span className="font-label text-ink">{listening ? "Listening for keys" : "Click the tester to begin"}</span>
            </div>
            <p className="mt-1 font-caption text-text-muted">Press Esc or click outside when you are finished.</p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-canvas-soft px-4 py-2.5 font-link text-ink transition-colors hover:border-text-muted">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset keys
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <Metric label="Progress" value={`${progress}%`} detail={progressLabel} />
          <Metric label="Last key" value={lastKey} detail="Browser key value" />
          <Metric label="Key code" value={lastCode} detail="Physical key position" />
          <Metric label="Held now" value={String(pressed.size)} detail="Simultaneous keys" />
        </div>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-field" aria-label={progressLabel}>
          <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-8 overflow-x-auto pb-3">
          <div className="mx-auto min-w-[820px] max-w-[1040px] space-y-2.5" aria-live="polite">
            {KEY_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2.5">
                {row.map((key) => {
                  const isPressed = pressed.has(key.code);
                  const isTested = tested.has(key.code);
                  return (
                    <div
                      key={key.code}
                      style={{ flex: `${key.width ?? 1} 1 0%` }}
                      className={cn(
                        "flex h-12 min-w-0 items-center justify-center rounded-xl border px-1 font-mono-sm transition-[transform,background-color,border-color,color,box-shadow] duration-100 sm:h-14",
                        isPressed && "scale-[0.96] border-accent bg-accent text-on-primary shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]",
                        !isPressed && isTested && "border-accent/55 bg-accent/10 text-accent",
                        !isPressed && !isTested && "border-hairline bg-canvas-soft text-text-muted",
                      )}
                    >
                      <span className="truncate">{key.label}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 text-center font-caption text-text-faint sm:hidden">Swipe sideways to inspect the complete keyboard.</p>
      </div>

      <div className="mt-12 grid gap-8 border-t border-hairline pt-10 md:grid-cols-2">
        <div>
          <h2 className="font-heading-4 text-ink">How to test your keyboard</h2>
          <ol className="mt-4 space-y-3 font-body text-text-muted">
            <li><span className="text-ink">1.</span> Click anywhere inside the keyboard tester.</li>
            <li><span className="text-ink">2.</span> Press keys one at a time and confirm each key lights up.</li>
            <li><span className="text-ink">3.</span> Hold several keys together to check simultaneous input.</li>
            <li><span className="text-ink">4.</span> Use Reset keys to repeat the keyboard test.</li>
          </ol>
        </div>
        <div>
          <h2 className="font-heading-4 text-ink">Private and browser-based</h2>
          <p className="mt-4 font-body text-text-muted">
            The keyboard test runs locally in your browser. It displays key events only while the tester is focused and does not save what you press. Some operating-system shortcuts and special hardware keys may be reserved and unavailable to websites.
          </p>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-hairline bg-canvas-soft px-4 py-4">
      <div className="font-caption uppercase tracking-wide text-text-faint">{label}</div>
      <div className="mt-1 truncate font-mono text-xl font-semibold text-ink">{value}</div>
      <div className="mt-1 font-caption text-text-muted">{detail}</div>
    </div>
  );
}
