import { useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { cn } from "../utils/cn";

type KeyDefinition = { code: string; label: string; width?: number };
type NumpadDefinition = KeyDefinition & { gridClass?: string };

const FUNCTION_KEYS: KeyDefinition[] = [
  { code: "Escape", label: "Esc", width: 1.25 },
  { code: "F1", label: "F1" }, { code: "F2", label: "F2" }, { code: "F3", label: "F3" }, { code: "F4", label: "F4" },
  { code: "F5", label: "F5" }, { code: "F6", label: "F6" }, { code: "F7", label: "F7" }, { code: "F8", label: "F8" },
  { code: "F9", label: "F9" }, { code: "F10", label: "F10" }, { code: "F11", label: "F11" }, { code: "F12", label: "F12" },
  { code: "PrintScreen", label: "PrtSc", width: 1.2 }, { code: "ScrollLock", label: "ScrLk", width: 1.2 }, { code: "Pause", label: "Pause", width: 1.2 },
];

const MAIN_ROWS: KeyDefinition[][] = [
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
    { code: "ControlLeft", label: "Ctrl", width: 1.3 }, { code: "MetaLeft", label: "⌘ / Win", width: 1.5 }, { code: "AltLeft", label: "Alt", width: 1.3 },
    { code: "Space", label: "Space", width: 6.2 }, { code: "AltRight", label: "Alt", width: 1.3 }, { code: "MetaRight", label: "⌘ / Win", width: 1.5 },
    { code: "ContextMenu", label: "Menu", width: 1.3 }, { code: "ControlRight", label: "Ctrl", width: 1.3 },
  ],
];

const NAVIGATION_KEYS: Array<KeyDefinition | null> = [
  { code: "Insert", label: "Insert" }, { code: "Home", label: "Home" }, { code: "PageUp", label: "PgUp" },
  { code: "Delete", label: "Delete" }, { code: "End", label: "End" }, { code: "PageDown", label: "PgDn" },
  null, { code: "ArrowUp", label: "↑" }, null,
  { code: "ArrowLeft", label: "←" }, { code: "ArrowDown", label: "↓" }, { code: "ArrowRight", label: "→" },
];

const NUMPAD_KEYS: NumpadDefinition[] = [
  { code: "NumLock", label: "Num" }, { code: "NumpadDivide", label: "/" }, { code: "NumpadMultiply", label: "×" }, { code: "NumpadSubtract", label: "−" },
  { code: "Numpad7", label: "7" }, { code: "Numpad8", label: "8" }, { code: "Numpad9", label: "9" }, { code: "NumpadAdd", label: "+", gridClass: "row-span-2" },
  { code: "Numpad4", label: "4" }, { code: "Numpad5", label: "5" }, { code: "Numpad6", label: "6" },
  { code: "Numpad1", label: "1" }, { code: "Numpad2", label: "2" }, { code: "Numpad3", label: "3" }, { code: "NumpadEnter", label: "Enter", gridClass: "row-span-2" },
  { code: "Numpad0", label: "0", gridClass: "col-span-2" }, { code: "NumpadDecimal", label: "." },
];

const TESTABLE_CODES = new Set([
  ...FUNCTION_KEYS.map((key) => key.code),
  ...MAIN_ROWS.flat().map((key) => key.code),
  ...NAVIGATION_KEYS.flatMap((key) => key ? [key.code] : []),
  ...NUMPAD_KEYS.map((key) => key.code),
]);

const FAQS = [
  { q: "How can I test whether my keyboard is working properly?", a: "Click inside the tester, then press each physical key. A working key flashes in the active theme color and remains marked after release. Test letters, numbers, modifiers, function keys, navigation keys, arrow keys, and the numeric keypad. A key that never appears may be blocked by the browser, disabled by Num Lock or Fn Lock, or affected by a hardware or driver problem." },
  { q: "Can this keyboard tester check the number pad?", a: "Yes. The full numeric keypad is shown on the right, including Num Lock, divide, multiply, subtract, add, Enter, decimal, and numbers 0–9. Turn Num Lock on and off if a number-pad key reports navigation behavior instead of a number." },
  { q: "How do I test F1–F12 and the F6 key?", a: "Focus the tester and press the function key. On compact laptops you may need to hold Fn while pressing F1–F12, or toggle Fn Lock. Browsers and operating systems reserve some function keys—F1 may open Help and F5 may refresh—so a reserved shortcut may run even when the physical key works." },
  { q: "Can a keyboard tester detect ghosting?", a: "It can help. Hold several keys together and watch the Held now count and highlighted keys. If one key disappears or never registers during a combination, the keyboard may have a rollover limitation or ghosting issue. Browser tests cannot certify a manufacturer's full anti-ghosting specification, but they are useful for practical combinations." },
  { q: "How do I diagnose a key that works only sometimes?", a: "Reset the test, then press the suspect key repeatedly using normal pressure. Compare it with nearby keys and test it in different combinations. Intermittent detection often points to debris, a worn switch, a loose laptop ribbon cable, wireless interference, low battery, or a software remapping utility." },
  { q: "What should I do if my keyboard is not typing?", a: "Reconnect the keyboard, try a different USB port, replace or recharge wireless batteries, confirm the correct input language, restart the device, and test in another application. For a laptop, check Fn Lock and accessibility settings such as Filter Keys. If no keys register before the operating system starts, professional hardware service may be needed." },
  { q: "Can I use this on an HP, Dell, Lenovo, Mac, or external keyboard?", a: "Yes. The tester uses standard browser keyboard events and works with most laptop, desktop, mechanical, membrane, Bluetooth, and USB keyboards. Labels are based on a common full-size ANSI layout, so the physical shape or printed symbols may differ on compact, ISO, regional, and Apple keyboards." },
  { q: "How do I know whether my laptop keyboard is physically damaged?", a: "A single key that fails consistently across browsers and applications—especially after cleaning and restarting—is more likely to be a hardware issue. Several keys in the same row or column failing together can indicate a keyboard matrix or ribbon-cable problem. Liquid exposure, sticking, double input, and keys that require excessive pressure are also hardware warning signs." },
  { q: "Can keyboard keys be replaced?", a: "Desktop mechanical keycaps and switches are often replaceable. Laptop keycaps may be replaceable, but their clips are delicate and model-specific. Do not force a keycap; check the device service manual or use an authorized repair provider, especially after liquid damage or when the device is under warranty." },
  { q: "Does the keyboard test record what I type?", a: "No. The diagnostic runs locally in your browser, displays key events only while the tester is focused, and does not save the keys you press. Avoid entering passwords into any diagnostic website; this tool only needs individual test keystrokes." },
] as const;

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
    if (!event.metaKey && !event.ctrlKey && !event.altKey) event.preventDefault();
    const code = event.code || "Unknown";
    setLastKey(event.key === " " ? "Space" : event.key);
    setLastCode(code);
    setPressed((current) => new Set(current).add(code));
    if (TESTABLE_CODES.has(code)) setTested((current) => new Set(current).add(code));
    if (code === "Escape") window.requestAnimationFrame(() => testerRef.current?.blur());
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
          Test a complete full-size keyboard—including function keys, navigation controls, arrow keys, and the numeric keypad. Working keys respond instantly and remain marked so missing, stuck, or inconsistent input is easy to identify.
        </p>
      </div>

      <div
        ref={testerRef}
        tabIndex={0}
        role="application"
        aria-label="Interactive full-size keyboard tester"
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
            <p className="mt-1 font-caption text-text-muted">Press each key. Esc records the key and exits the tester.</p>
          </div>
          <button type="button" onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-canvas-soft px-4 py-2.5 font-link text-ink transition-colors hover:border-text-muted">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset keys
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
          <div className="mx-auto min-w-[1180px] max-w-[1320px] space-y-3" aria-live="polite">
            <div className="flex gap-2">
              {FUNCTION_KEYS.map((key) => <FlexKey key={key.code} definition={key} pressed={pressed} tested={tested} compact />)}
            </div>
            <div className="grid grid-cols-[minmax(0,4.8fr)_minmax(190px,1.15fr)_minmax(255px,1.55fr)] gap-4">
              <div className="space-y-2.5">
                {MAIN_ROWS.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2.5">
                    {row.map((key) => <FlexKey key={key.code} definition={key} pressed={pressed} tested={tested} />)}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 grid-rows-4 gap-2.5">
                {NAVIGATION_KEYS.map((key, index) => key
                  ? <KeyTile key={key.code} definition={key} pressed={pressed} tested={tested} />
                  : <div key={`blank-${index}`} aria-hidden="true" />)}
              </div>
              <div className="grid grid-cols-4 grid-rows-5 gap-2.5">
                {NUMPAD_KEYS.map((key) => <KeyTile key={key.code} definition={key} pressed={pressed} tested={tested} className={key.gridClass} />)}
              </div>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center font-caption text-text-faint lg:hidden">Swipe sideways to inspect the function, navigation, arrow, and number-pad keys.</p>
      </div>

      <div className="mt-14 border-t border-hairline pt-12">
        <h2 className="font-heading-3 text-ink">How to test every keyboard key</h2>
        <div className="mt-7 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-heading-5 text-ink">Run a complete key test</h3>
            <ol className="mt-4 space-y-3 font-body text-text-muted">
              <li><span className="text-ink">1.</span> Click inside the keyboard diagram so it says Listening for keys.</li>
              <li><span className="text-ink">2.</span> Press each key once. Tested keys stay outlined in the active theme color.</li>
              <li><span className="text-ink">3.</span> Check F1–F12, Insert/Delete, arrows, and every number-pad key.</li>
              <li><span className="text-ink">4.</span> Hold common combinations to check multi-key rollover and practical ghosting.</li>
              <li><span className="text-ink">5.</span> Reset and repeat any key that seemed delayed, doubled, or inconsistent.</li>
            </ol>
          </div>
          <div>
            <h3 className="font-heading-5 text-ink">Understand the result</h3>
            <p className="mt-4 font-body text-text-muted">A bright key is currently held. A softly marked key has been detected at least once. An unmarked key has not been detected during the current session. Compare the on-screen key code with the physical key position when testing regional layouts.</p>
            <p className="mt-4 font-body text-text-muted">For speed and accuracy after confirming the hardware works, continue with the <a href="/#tester" className="text-accent underline underline-offset-4">free typing test</a>.</p>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-8 border-t border-hairline pt-12 md:grid-cols-2">
        <div>
          <h2 className="font-heading-4 text-ink">Keyboard ghosting and rollover</h2>
          <p className="mt-4 font-body text-text-muted">Ghosting occurs when a keyboard fails to report one or more keys in a combination, or reports a key that was not pressed. Rollover describes how many simultaneous keys the keyboard can correctly register. Use the Held now counter and highlighted keys to test combinations used in gaming, shortcuts, and fast typing.</p>
        </div>
        <div>
          <h2 className="font-heading-4 text-ink">Private and browser-based</h2>
          <p className="mt-4 font-body text-text-muted">This diagnostic runs locally in your browser and does not save your keystrokes. Some operating-system shortcuts, media controls, Fn-layer commands, power buttons, and manufacturer-specific keys cannot be captured by a webpage.</p>
        </div>
      </div>

      <section className="mt-16 border-t border-hairline pt-12" aria-labelledby="keyboard-faq-heading">
        <p className="font-label uppercase tracking-[0.14em] text-accent">Keyboard troubleshooting</p>
        <h2 id="keyboard-faq-heading" className="mt-3 font-heading-3 text-ink">Keyboard Tester FAQ</h2>
        <p className="mt-4 max-w-3xl font-body text-text-muted">Answers to common questions about checking laptop, desktop, mechanical, wireless, function, and number-pad keys.</p>
        <div className="mt-8 divide-y divide-hairline border-y border-hairline">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-heading-5 text-ink marker:content-none">
                <span>{item.q}</span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline text-text-muted transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="max-w-4xl pb-6 pr-12 font-body text-text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </section>
  );
}

function keyClasses(isPressed: boolean, isTested: boolean) {
  return cn(
    "flex min-w-0 items-center justify-center rounded-xl border px-1 text-center font-mono-sm transition-[transform,background-color,border-color,color,box-shadow] duration-100",
    isPressed && "scale-[0.96] border-accent bg-accent text-on-primary shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]",
    !isPressed && isTested && "border-accent/55 bg-accent/10 text-accent",
    !isPressed && !isTested && "border-hairline bg-canvas-soft text-text-muted",
  );
}

function FlexKey({ definition, pressed, tested, compact = false }: { definition: KeyDefinition; pressed: Set<string>; tested: Set<string>; compact?: boolean }) {
  return (
    <div style={{ flex: `${definition.width ?? 1} 1 0%` }} className={cn(keyClasses(pressed.has(definition.code), tested.has(definition.code)), compact ? "h-10" : "h-12 sm:h-14")}>
      <span className="truncate">{definition.label}</span>
    </div>
  );
}

function KeyTile({ definition, pressed, tested, className }: { definition: KeyDefinition; pressed: Set<string>; tested: Set<string>; className?: string }) {
  return <div className={cn(keyClasses(pressed.has(definition.code), tested.has(definition.code)), "h-full min-h-0", className)}><span className="truncate">{definition.label}</span></div>;
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
