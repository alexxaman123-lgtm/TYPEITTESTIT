import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Check, LogOut, RotateCcw } from "lucide-react";
import { cn } from "../utils/cn";

type KeyDefinition = { code: string; label: string; width?: number };
type NumpadDefinition = KeyDefinition & { gridClass?: string };

const FUNCTION_KEYS: KeyDefinition[] = [
  { code: "Escape", label: "Esc", width: 1.25 },
  ...Array.from({ length: 12 }, (_, index) => ({ code: `F${index + 1}`, label: `F${index + 1}` })),
  { code: "PrintScreen", label: "PrtSc", width: 1.2 }, { code: "ScrollLock", label: "ScrLk", width: 1.2 }, { code: "Pause", label: "Pause", width: 1.2 },
];

const MAIN_ROWS: KeyDefinition[][] = [
  [{ code: "Backquote", label: "`" }, ...Array.from({ length: 10 }, (_, index) => ({ code: `Digit${(index + 1) % 10}`, label: String((index + 1) % 10) })), { code: "Minus", label: "-" }, { code: "Equal", label: "=" }, { code: "Backspace", label: "Backspace", width: 2 }],
  [{ code: "Tab", label: "Tab", width: 1.5 }, ..."QWERTYUIOP".split("").map((letter) => ({ code: `Key${letter}`, label: letter })), { code: "BracketLeft", label: "[" }, { code: "BracketRight", label: "]" }, { code: "Backslash", label: "\\", width: 1.5 }],
  [{ code: "CapsLock", label: "Caps Lock", width: 1.8 }, ..."ASDFGHJKL".split("").map((letter) => ({ code: `Key${letter}`, label: letter })), { code: "Semicolon", label: ";" }, { code: "Quote", label: "'" }, { code: "Enter", label: "Enter", width: 2.2 }],
  [{ code: "ShiftLeft", label: "Shift", width: 2.3 }, ..."ZXCVBNM".split("").map((letter) => ({ code: `Key${letter}`, label: letter })), { code: "Comma", label: "," }, { code: "Period", label: "." }, { code: "Slash", label: "/" }, { code: "ShiftRight", label: "Shift", width: 2.7 }],
  [{ code: "ControlLeft", label: "Ctrl", width: 1.3 }, { code: "MetaLeft", label: "⌘ / Win", width: 1.5 }, { code: "AltLeft", label: "Alt", width: 1.3 }, { code: "Space", label: "Space", width: 6.2 }, { code: "AltRight", label: "Alt", width: 1.3 }, { code: "MetaRight", label: "⌘ / Win", width: 1.5 }, { code: "ContextMenu", label: "Menu", width: 1.3 }, { code: "ControlRight", label: "Ctrl", width: 1.3 }],
];

const NAVIGATION_KEYS: Array<KeyDefinition | null> = [
  { code: "Insert", label: "Insert" }, { code: "Home", label: "Home" }, { code: "PageUp", label: "PgUp" },
  { code: "Delete", label: "Delete" }, { code: "End", label: "End" }, { code: "PageDown", label: "PgDn" },
  null, { code: "ArrowUp", label: "↑" }, null, { code: "ArrowLeft", label: "←" }, { code: "ArrowDown", label: "↓" }, { code: "ArrowRight", label: "→" },
];

const NUMPAD_KEYS: NumpadDefinition[] = [
  { code: "NumLock", label: "Num" }, { code: "NumpadDivide", label: "/" }, { code: "NumpadMultiply", label: "×" }, { code: "NumpadSubtract", label: "−" },
  { code: "Numpad7", label: "7" }, { code: "Numpad8", label: "8" }, { code: "Numpad9", label: "9" }, { code: "NumpadAdd", label: "+", gridClass: "row-span-2" },
  { code: "Numpad4", label: "4" }, { code: "Numpad5", label: "5" }, { code: "Numpad6", label: "6" },
  { code: "Numpad1", label: "1" }, { code: "Numpad2", label: "2" }, { code: "Numpad3", label: "3" }, { code: "NumpadEnter", label: "Enter", gridClass: "row-span-2" },
  { code: "Numpad0", label: "0", gridClass: "col-span-2" }, { code: "NumpadDecimal", label: "." },
];

const TESTABLE_CODES = new Set([...FUNCTION_KEYS.map((key) => key.code), ...MAIN_ROWS.flat().map((key) => key.code), ...NAVIGATION_KEYS.flatMap((key) => key ? [key.code] : []), ...NUMPAD_KEYS.map((key) => key.code)]);

interface KeyboardTesterProps {
  onExit: () => void;
  modeNote: string;
}

export default function KeyboardTester({ onExit, modeNote }: KeyboardTesterProps) {
  const testerRef = useRef<HTMLDivElement | null>(null);
  const [pressed, setPressed] = useState<Set<string>>(() => new Set());
  const [tested, setTested] = useState<Set<string>>(() => new Set());
  const [lastKey, setLastKey] = useState("—");
  const [lastCode, setLastCode] = useState("—");
  const progress = Math.round((tested.size / TESTABLE_CODES.size) * 100);
  const progressLabel = useMemo(() => `${tested.size} of ${TESTABLE_CODES.size} keys tested`, [tested.size]);

  useEffect(() => {
    const timer = window.setTimeout(() => testerRef.current?.focus({ preventScroll: true }), 40);
    return () => window.clearTimeout(timer);
  }, []);

  const recordDetectedKey = (code: string, key: string) => {
    setLastKey(key === " " ? "Space" : key === "PrintScreen" ? "Print Screen" : key);
    setLastCode(code);
    if (TESTABLE_CODES.has(code)) setTested((current) => new Set(current).add(code));
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    event.preventDefault();
    event.stopPropagation();
    const code = event.code || "Unknown";
    recordDetectedKey(code, event.key);
    setPressed((current) => new Set(current).add(code));
    if (code === "Escape") onExit();
  };

  const handleKeyUp = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const code = event.code || "Unknown";
    // Windows and several browsers often expose Print Screen only on keyup
    // after the OS has already opened its screenshot UI. Counting releases as
    // valid detections makes that browser-delivered event visible in the test.
    recordDetectedKey(code, event.key);
    setPressed((current) => { const next = new Set(current); next.delete(code); return next; });
  };

  const reset = () => {
    setPressed(new Set()); setTested(new Set()); setLastKey("—"); setLastCode("—");
    window.requestAnimationFrame(() => testerRef.current?.focus({ preventScroll: true }));
  };

  const confirmSystemPrintScreen = () => {
    setTested((current) => new Set(current).add("PrintScreen"));
    setLastKey("Print Screen — system confirmed");
    setLastCode("PrintScreen");
    window.requestAnimationFrame(() => testerRef.current?.focus({ preventScroll: true }));
  };

  return (
    <div ref={testerRef} tabIndex={0} role="application" aria-label="Interactive full-size keyboard tester"
      onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) window.setTimeout(() => testerRef.current?.focus({ preventScroll: true }), 0); }}
      onPointerDown={(event) => { if (!(event.target as HTMLElement).closest("button")) testerRef.current?.focus({ preventScroll: true }); }}
      className="mx-auto min-h-screen w-full max-w-[1500px] bg-canvas px-4 py-5 outline-none sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-5 border-b border-hairline pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent" /><span className="font-label uppercase tracking-[0.12em] text-accent">Dedicated keyboard test active</span></div>
          <h1 className="mt-2 font-heading-3 text-ink">Press every key to verify your keyboard</h1>
          <p className="mt-2 max-w-3xl font-body text-text-muted"><strong className="text-ink">To finish:</strong> press <kbd className="rounded border border-hairline bg-canvas-soft px-1.5 py-0.5 font-mono-sm text-ink">Esc</kbd> or select <strong className="text-ink">End test</strong>. Normal page and keyboard behavior will return immediately.</p>
          <p className="mt-2 font-caption text-text-faint">{modeNote}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button type="button" onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-canvas-soft px-4 py-2.5 font-link text-ink transition-colors hover:border-text-muted"><RotateCcw className="h-4 w-4" aria-hidden="true" />Reset keys</button>
          <button type="button" onClick={onExit} className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 font-link text-on-primary"><LogOut className="h-4 w-4" aria-hidden="true" />End test</button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-hairline bg-canvas-soft px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-caption text-text-muted"><strong className="text-ink">Print Screen note:</strong> the OS may open its screenshot tool before the browser can block or detect the key. The tester now counts a browser-delivered Print Screen release. If the screenshot tool opened but PrtSc stayed unmarked, that system action itself confirms the physical key worked.</p>
        <button type="button" onClick={confirmSystemPrintScreen} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-hairline bg-canvas px-4 py-2 font-link text-ink transition-colors hover:border-text-muted"><Check className="h-4 w-4" aria-hidden="true" />Mark PrtSc working</button>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-4"><Metric label="Progress" value={`${progress}%`} detail={progressLabel} /><Metric label="Last key" value={lastKey} detail="Browser or system confirmation" /><Metric label="Key code" value={lastCode} detail="Physical key position" /><Metric label="Held now" value={String(pressed.size)} detail="Simultaneous keys" /></div>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-field" aria-label={progressLabel}><div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>

      <div className="mt-6 overflow-x-auto pb-3">
        <div className="mx-auto min-w-[1180px] max-w-[1380px] space-y-3" aria-live="polite">
          <div className="flex gap-2">{FUNCTION_KEYS.map((key) => <FlexKey key={key.code} definition={key} pressed={pressed} tested={tested} compact />)}</div>
          <div className="grid grid-cols-[minmax(0,4.8fr)_minmax(190px,1.15fr)_minmax(255px,1.55fr)] gap-4">
            <div className="space-y-2.5">{MAIN_ROWS.map((row, rowIndex) => <div key={rowIndex} className="flex gap-2.5">{row.map((key) => <FlexKey key={key.code} definition={key} pressed={pressed} tested={tested} />)}</div>)}</div>
            <div className="grid grid-cols-3 grid-rows-4 gap-2.5">{NAVIGATION_KEYS.map((key, index) => key ? <KeyTile key={key.code} definition={key} pressed={pressed} tested={tested} /> : <div key={`blank-${index}`} aria-hidden="true" />)}</div>
            <div className="grid grid-cols-4 grid-rows-5 gap-2.5">{NUMPAD_KEYS.map((key) => <KeyTile key={key.code} definition={key} pressed={pressed} tested={tested} className={key.gridClass} />)}</div>
          </div>
        </div>
      </div>
      <p className="mt-1 text-center font-caption text-text-faint lg:hidden">Swipe sideways to inspect every key. Press Esc to close the test.</p>
    </div>
  );
}

function keyClasses(isPressed: boolean, isTested: boolean) { return cn("flex min-w-0 items-center justify-center rounded-xl border px-1 text-center font-mono-sm transition-[transform,background-color,border-color,color,box-shadow] duration-100", isPressed && "scale-[0.96] border-accent bg-accent text-on-primary shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]", !isPressed && isTested && "border-accent/55 bg-accent/10 text-accent", !isPressed && !isTested && "border-hairline bg-canvas-soft text-text-muted"); }
function FlexKey({ definition, pressed, tested, compact = false }: { definition: KeyDefinition; pressed: Set<string>; tested: Set<string>; compact?: boolean }) { return <div style={{ flex: `${definition.width ?? 1} 1 0%` }} className={cn(keyClasses(pressed.has(definition.code), tested.has(definition.code)), compact ? "h-10" : "h-12 sm:h-14")}><span className="truncate">{definition.label}</span></div>; }
function KeyTile({ definition, pressed, tested, className }: { definition: KeyDefinition; pressed: Set<string>; tested: Set<string>; className?: string }) { return <div className={cn(keyClasses(pressed.has(definition.code), tested.has(definition.code)), "h-full min-h-0", className)}><span className="truncate">{definition.label}</span></div>; }
function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="rounded-2xl border border-hairline bg-canvas-soft px-4 py-3"><div className="font-caption uppercase tracking-wide text-text-faint">{label}</div><div className="mt-1 truncate font-mono text-xl font-semibold text-ink">{value}</div><div className="mt-1 font-caption text-text-muted">{detail}</div></div>; }
