import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { Maximize2, Minimize2, RotateCcw } from "lucide-react";
import { cn } from "../utils/cn";

type KeyDefinition = { code: string; label: string; width?: number };
type NumpadDefinition = KeyDefinition & { gridClass?: string };
type NavigatorWithKeyboardLock = Navigator & { keyboard?: { lock?: (keys?: string[]) => Promise<void>; unlock?: () => void } };

const FUNCTION_KEYS: KeyDefinition[] = [
  { code: "Escape", label: "Esc", width: 1.25 },
  ...Array.from({ length: 12 }, (_, index) => ({ code: `F${index + 1}`, label: `F${index + 1}` })),
  { code: "PrintScreen", label: "PrtSc", width: 1.2 }, { code: "ScrollLock", label: "ScrLk", width: 1.2 }, { code: "Pause", label: "Pause", width: 1.2 },
];

const MAIN_ROWS: KeyDefinition[][] = [
  [
    { code: "Backquote", label: "`" }, ...Array.from({ length: 10 }, (_, index) => ({ code: `Digit${(index + 1) % 10}`, label: String((index + 1) % 10) })),
    { code: "Minus", label: "-" }, { code: "Equal", label: "=" }, { code: "Backspace", label: "Backspace", width: 2 },
  ],
  [
    { code: "Tab", label: "Tab", width: 1.5 }, ..."QWERTYUIOP".split("").map((letter) => ({ code: `Key${letter}`, label: letter })),
    { code: "BracketLeft", label: "[" }, { code: "BracketRight", label: "]" }, { code: "Backslash", label: "\\", width: 1.5 },
  ],
  [
    { code: "CapsLock", label: "Caps Lock", width: 1.8 }, ..."ASDFGHJKL".split("").map((letter) => ({ code: `Key${letter}`, label: letter })),
    { code: "Semicolon", label: ";" }, { code: "Quote", label: "'" }, { code: "Enter", label: "Enter", width: 2.2 },
  ],
  [
    { code: "ShiftLeft", label: "Shift", width: 2.3 }, ..."ZXCVBNM".split("").map((letter) => ({ code: `Key${letter}`, label: letter })),
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
  ...FUNCTION_KEYS.map((key) => key.code), ...MAIN_ROWS.flat().map((key) => key.code),
  ...NAVIGATION_KEYS.flatMap((key) => key ? [key.code] : []), ...NUMPAD_KEYS.map((key) => key.code),
]);

const FAQS = [
  { q: "How can I test whether my keyboard is working properly?", a: "Start the tester, then press each physical key. A working key flashes in the active theme color and remains marked after release. Check letters, number row, modifiers, function keys, navigation keys, arrows, and numeric keypad. An unmarked key may be browser-reserved, disabled by Num Lock or Fn Lock, or affected by hardware, firmware, or driver problems." },
  { q: "Can the tester stop brightness, volume, screenshot, and other system actions?", a: "Dedicated Test Mode uses fullscreen and the browser Keyboard Lock API when available, and it also prevents normal webpage shortcuts. This can suppress many browser actions, but a website cannot override keys handled directly by laptop firmware or the operating system. Brightness, volume, microphone, power, Fn-layer, Print Screen, and security shortcuts may still operate or may never reach the browser." },
  { q: "Can this keyboard tester check the number pad?", a: "Yes. The full numeric keypad includes Num Lock, divide, multiply, subtract, add, Enter, decimal, and numbers 0–9. Toggle Num Lock if a keypad key reports navigation behavior instead of a number." },
  { q: "How do I test F1–F12 and the F6 key?", a: "Use Dedicated Test Mode and press the function key. On compact laptops you may need to hold Fn, disable the Action Keys setting, or toggle Fn Lock. The tester can only mark a key if the browser receives a keyboard event; a firmware-handled brightness or media action might not produce one." },
  { q: "Can a keyboard tester detect ghosting?", a: "It can reveal practical ghosting and rollover limits. Hold several keys together and compare the highlighted keys with the Held now counter. If a pressed key disappears or never registers in a combination, that combination may exceed the keyboard matrix's rollover capability." },
  { q: "How do I diagnose a key that works only sometimes?", a: "Reset the test and press the suspect key repeatedly with normal pressure. Compare it with nearby keys and test several combinations. Intermittent detection can indicate debris, a worn switch, a loose laptop ribbon cable, low wireless battery, radio interference, or remapping software." },
  { q: "What should I do if my keyboard is not typing?", a: "Reconnect it, try another USB port, replace or recharge wireless batteries, verify the selected input language, restart the device, and test another application. On laptops, check Fn Lock and accessibility settings such as Filter Keys. If the keyboard also fails before the operating system starts, it likely needs hardware service." },
  { q: "Can I use this on an HP, Dell, Lenovo, Mac, Chromebook, or external keyboard?", a: "Yes. It works with most laptop, desktop, mechanical, membrane, Bluetooth, and USB keyboards that expose standard browser events. The diagram follows a common full-size ANSI layout, so compact, ISO, JIS, regional, and Apple keyboards may have different physical shapes or printed legends." },
  { q: "How do I know whether my laptop keyboard is physically damaged?", a: "A key that fails consistently in multiple applications and browsers after cleaning and restarting is more likely to have a hardware issue. Several keys in the same row or column failing together can indicate a matrix or ribbon-cable fault. Liquid exposure, sticking, repeated characters, or excessive pressure are additional warning signs." },
  { q: "Does the keyboard test record what I type?", a: "No. Detection runs locally in your browser and the page does not save your keystrokes. Avoid typing passwords into any diagnostic site; this tool only requires individual test keystrokes." },
] as const;

export default function KeyboardTester() {
  const testerRef = useRef<HTMLDivElement | null>(null);
  const [pressed, setPressed] = useState<Set<string>>(() => new Set());
  const [tested, setTested] = useState<Set<string>>(() => new Set());
  const [lastKey, setLastKey] = useState("—");
  const [lastCode, setLastCode] = useState("—");
  const [listening, setListening] = useState(false);
  const [dedicated, setDedicated] = useState(false);
  const [modeNote, setModeNote] = useState("Fullscreen Keyboard Lock is attempted in supported browsers.");
  const progress = Math.round((tested.size / TESTABLE_CODES.size) * 100);
  const progressLabel = useMemo(() => `${tested.size} of ${TESTABLE_CODES.size} keys tested`, [tested.size]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = document.fullscreenElement === testerRef.current;
      setDedicated(active);
      if (!active) {
        (navigator as NavigatorWithKeyboardLock).keyboard?.unlock?.();
        setPressed(new Set());
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      (navigator as NavigatorWithKeyboardLock).keyboard?.unlock?.();
    };
  }, []);

  const stopDedicatedMode = async () => {
    (navigator as NavigatorWithKeyboardLock).keyboard?.unlock?.();
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => undefined);
    setDedicated(false);
    setListening(false);
    setPressed(new Set());
  };

  const startDedicatedMode = async () => {
    const element = testerRef.current;
    if (!element?.requestFullscreen) {
      setModeNote("Fullscreen is unavailable in this browser. Standard focused testing is still active.");
      element?.focus();
      return;
    }
    try {
      await element.requestFullscreen();
      const keyboard = (navigator as NavigatorWithKeyboardLock).keyboard;
      if (keyboard?.lock) {
        try {
          await keyboard.lock();
          setModeNote("Dedicated mode active. Browser shortcuts are locked where supported; system and firmware keys may still run.");
        } catch {
          setModeNote("Fullscreen is active, but this browser did not allow Keyboard Lock. System shortcuts may still run.");
        }
      } else {
        setModeNote("Fullscreen is active. Keyboard Lock is not supported by this browser, so some shortcuts may still run.");
      }
      setDedicated(true);
      element.focus();
    } catch {
      setModeNote("Dedicated mode was blocked. Allow fullscreen or use a Chromium-based desktop browser, then try again.");
      element.focus();
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    if (dedicated || (!event.metaKey && !event.ctrlKey && !event.altKey)) event.preventDefault();
    event.stopPropagation();
    const code = event.code || "Unknown";
    setLastKey(event.key === " " ? "Space" : event.key);
    setLastCode(code);
    setPressed((current) => new Set(current).add(code));
    if (TESTABLE_CODES.has(code)) setTested((current) => new Set(current).add(code));
    if (code === "Escape") {
      if (dedicated) void stopDedicatedMode();
      else window.requestAnimationFrame(() => testerRef.current?.blur());
    }
  };

  const handleKeyUp = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    setPressed((current) => { const next = new Set(current); next.delete(event.code); return next; });
  };

  const reset = () => {
    setPressed(new Set()); setTested(new Set()); setLastKey("—"); setLastCode("—");
    window.requestAnimationFrame(() => testerRef.current?.focus());
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-3xl">
        <p className="font-label uppercase tracking-[0.16em] text-accent">Free hardware diagnostic</p>
        <h1 className="mt-4 font-heading-1 text-ink">Online Keyboard Tester</h1>
        <p className="mt-5 font-body-lg text-text-muted">Test a complete full-size keyboard—including function keys, navigation controls, arrows, and the numeric keypad. Working keys respond instantly and stay marked so missing, stuck, doubled, or inconsistent input is easy to identify.</p>
      </div>

      <div ref={testerRef} tabIndex={0} role="application" aria-label="Interactive full-size keyboard tester"
        onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onFocus={() => setListening(true)}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null) && !dedicated) { setListening(false); setPressed(new Set()); } }}
        onPointerDown={(event) => { if (!(event.target as HTMLElement).closest("button")) testerRef.current?.focus(); }}
        className={cn("mt-10 rounded-[24px] border bg-canvas p-4 shadow-sm outline-none transition-[border-color,box-shadow] sm:p-6 lg:p-8", "fullscreen:m-0 fullscreen:h-screen fullscreen:max-w-none fullscreen:overflow-auto fullscreen:rounded-none", listening ? "border-accent shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_12%,transparent)]" : "border-hairline")}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2"><span className={cn("h-2.5 w-2.5 rounded-full", listening ? "bg-accent" : "bg-text-faint")} /><span className="font-label text-ink">{dedicated ? "Dedicated Test Mode" : listening ? "Listening for keys" : "Click the tester to begin"}</span></div>
            <p className="mt-1 max-w-2xl font-caption text-text-muted">{modeNote}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={dedicated ? stopDedicatedMode : startDedicatedMode} className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 font-link text-on-primary transition-transform hover:-translate-y-px">
              {dedicated ? <Minimize2 className="h-4 w-4" aria-hidden="true" /> : <Maximize2 className="h-4 w-4" aria-hidden="true" />}{dedicated ? "End dedicated test" : "Start dedicated test"}
            </button>
            <button type="button" onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-full border border-hairline bg-canvas-soft px-4 py-2.5 font-link text-ink transition-colors hover:border-text-muted"><RotateCcw className="h-4 w-4" aria-hidden="true" />Reset keys</button>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-hairline bg-canvas-soft px-4 py-3 font-caption text-text-muted"><strong className="text-ink">Important:</strong> dedicated mode is best-effort, not an operating-system bypass. Firmware-controlled brightness, volume, microphone, power, Fn actions, Print Screen, and security shortcuts may still execute. A normal webpage cannot safely disable those controls.</div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4"><Metric label="Progress" value={`${progress}%`} detail={progressLabel} /><Metric label="Last key" value={lastKey} detail="Browser key value" /><Metric label="Key code" value={lastCode} detail="Physical key position" /><Metric label="Held now" value={String(pressed.size)} detail="Simultaneous keys" /></div>
        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-field" aria-label={progressLabel}><div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>

        <div className="mt-8 overflow-x-auto pb-3">
          <div className="mx-auto min-w-[1180px] max-w-[1320px] space-y-3" aria-live="polite">
            <div className="flex gap-2">{FUNCTION_KEYS.map((key) => <FlexKey key={key.code} definition={key} pressed={pressed} tested={tested} compact />)}</div>
            <div className="grid grid-cols-[minmax(0,4.8fr)_minmax(190px,1.15fr)_minmax(255px,1.55fr)] gap-4">
              <div className="space-y-2.5">{MAIN_ROWS.map((row, rowIndex) => <div key={rowIndex} className="flex gap-2.5">{row.map((key) => <FlexKey key={key.code} definition={key} pressed={pressed} tested={tested} />)}</div>)}</div>
              <div className="grid grid-cols-3 grid-rows-4 gap-2.5">{NAVIGATION_KEYS.map((key, index) => key ? <KeyTile key={key.code} definition={key} pressed={pressed} tested={tested} /> : <div key={`blank-${index}`} aria-hidden="true" />)}</div>
              <div className="grid grid-cols-4 grid-rows-5 gap-2.5">{NUMPAD_KEYS.map((key) => <KeyTile key={key.code} definition={key} pressed={pressed} tested={tested} className={key.gridClass} />)}</div>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center font-caption text-text-faint lg:hidden">Swipe sideways to inspect the function, navigation, arrow, and number-pad keys.</p>
      </div>

      <article className="mt-16 space-y-16 border-t border-hairline pt-14">
        <section>
          <p className="font-label uppercase tracking-[0.14em] text-accent">Complete guide</p>
          <h2 className="mt-3 font-heading-3 text-ink">How an online keyboard test works</h2>
          <div className="mt-6 grid gap-8 font-body text-text-muted md:grid-cols-2">
            <div className="space-y-4"><p>When the tester is focused, the browser sends a <code className="text-ink">keydown</code> event as a physical key is pressed and a <code className="text-ink">keyup</code> event when it is released. GOATTYPE uses the event's physical <code className="text-ink">code</code> to match the position on the keyboard diagram. That is why the page can distinguish the left and right Shift, Control, Alt, and Meta keys.</p><p>The displayed key value can change with keyboard language, Shift, Caps Lock, and Num Lock, while the physical code normally stays tied to the same position. Comparing both values is useful when diagnosing an unexpected regional layout or remapping.</p></div>
            <div className="space-y-4"><p>The bright state means the key is currently held. The softer accent state means the key has registered at least once in this session. Untested keys retain their neutral appearance, and the progress counter shows how much of the standard full-size layout has been verified.</p><p>This browser test confirms that an event reaches the webpage. It does not electrically inspect the switch, key matrix, cable, Bluetooth radio, firmware, or operating-system driver, so results should be combined with the troubleshooting steps below.</p></div>
          </div>
        </section>

        <section className="border-t border-hairline pt-12">
          <h2 className="font-heading-3 text-ink">Standard mode versus Dedicated Test Mode</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <GuideCard title="Standard focused testing"><p>Clicking the tester focuses it and prevents ordinary webpage actions such as scrolling with Space or the arrow keys. It is fast and appropriate for letters, number keys, punctuation, modifiers, navigation keys, and most keypad testing.</p><p>Browser and operating-system shortcuts can still win. For example, F5 may refresh, Ctrl combinations may run browser commands, and an Fn-layer key may change volume or brightness before the browser sees anything.</p></GuideCard>
            <GuideCard title="Dedicated fullscreen testing"><p>Dedicated mode requests fullscreen and, in supported Chromium browsers, requests the Keyboard Lock API. It then prevents default actions for captured keyboard events until the mode ends. This gives the tester the strongest isolation a normal website is allowed to request.</p><p>Press Esc or choose End dedicated test to unlock the keyboard and leave fullscreen. Keys handled by firmware or protected by the operating system remain outside the website's control for security and accessibility reasons.</p></GuideCard>
          </div>
        </section>

        <section className="border-t border-hairline pt-12">
          <h2 className="font-heading-3 text-ink">A complete keyboard testing procedure</h2>
          <div className="mt-7 grid gap-8 md:grid-cols-3">
            <GuideCard title="1. Prepare the keyboard"><p>Connect the keyboard directly if possible, charge wireless models, select the intended input language, close applications using global shortcuts, and turn Num Lock on. Clean loose debris without removing laptop keycaps.</p></GuideCard>
            <GuideCard title="2. Test by sections"><p>Start with letters and number row, then punctuation, left and right modifiers, function row, navigation block, arrows, and the full number pad. Press each key normally rather than holding excessive pressure.</p></GuideCard>
            <GuideCard title="3. Repeat suspicious input"><p>Reset and repeat a delayed, missing, sticking, or double-registering key at least ten times. Test the same key in another browser or application to separate a webpage issue from a system-wide fault.</p></GuideCard>
          </div>
        </section>

        <section className="border-t border-hairline pt-12">
          <h2 className="font-heading-3 text-ink">Testing function, media, brightness, and Fn keys</h2>
          <div className="mt-6 grid gap-8 font-body text-text-muted md:grid-cols-2"><div className="space-y-4"><p>Many laptops combine F1–F12 with brightness, speaker volume, microphone mute, keyboard lighting, airplane mode, or media playback. The firmware may be configured so the printed media action is primary and the traditional F-key requires holding Fn. Some models reverse this through Fn Lock, a BIOS/UEFI setting, or a manufacturer utility.</p><p>If pressing the key changes brightness but the on-screen F key does not highlight, that does not automatically mean the switch is broken. It often means the laptop handled the command below the browser level. Try Fn plus the key, toggle Fn Lock, and compare the event code shown by the tester.</p></div><div className="space-y-4"><p>Print Screen, power, sleep, fingerprint, Touch ID, and security shortcuts are intentionally difficult or impossible for websites to suppress. Print Screen may create a screenshot without exposing a normal event. Volume and brightness may appear as media codes on one device and produce no browser event on another.</p><p>Dedicated mode improves capture for browser-reserved keys, but it cannot bypass hardware firmware or operating-system security. This limitation protects users from webpages that could otherwise trap essential escape, privacy, accessibility, or power controls.</p></div></div>
        </section>

        <section className="border-t border-hairline pt-12">
          <h2 className="font-heading-3 text-ink">Number pad, Num Lock, and navigation behavior</h2>
          <p className="mt-5 max-w-4xl font-body text-text-muted">A full-size keypad has separate physical codes for 0–9, decimal, arithmetic operators, and Enter. With Num Lock enabled, the keys usually enter numbers. With Num Lock disabled, several systems interpret them as Insert, Delete, Home, End, Page Up, Page Down, and arrows. The tester follows the physical keypad position, so the numpad key can still highlight even when its browser key value reports navigation. Compact keyboards may provide the keypad through an Fn layer instead of dedicated switches.</p>
        </section>

        <section className="border-t border-hairline pt-12">
          <h2 className="font-heading-3 text-ink">Ghosting, rollover, and simultaneous key input</h2>
          <div className="mt-6 grid gap-8 font-body text-text-muted md:grid-cols-2"><div><h3 className="font-heading-5 text-ink">What ghosting means</h3><p className="mt-3">Keyboard switches are wired in a matrix. On some combinations, a limited matrix cannot identify every pressed switch. A key may fail to register, or older designs may report a key that was never pressed. Modern firmware usually blocks the false key, which users experience as a missing input.</p></div><div><h3 className="font-heading-5 text-ink">How to test rollover</h3><p className="mt-3">Hold combinations used in your real work or games and compare them with the highlighted keys and Held now count. Test both modifier shortcuts and nearby letter clusters. A result for one combination does not guarantee the same rollover across the entire keyboard matrix.</p></div></div>
        </section>

        <section className="border-t border-hairline pt-12">
          <h2 className="font-heading-3 text-ink">Troubleshooting by keyboard type</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            <GuideCard title="Laptop keyboards"><p>Restart, check Fn Lock and Filter Keys, update manufacturer utilities, and test before login if possible. Adjacent rows failing together can indicate a ribbon cable or matrix fault. Use professional service after liquid exposure.</p></GuideCard>
            <GuideCard title="USB and mechanical keyboards"><p>Try another cable and USB port, avoid an unpowered hub, inspect removable switches only if the board supports hot swap, and disable macros or remapping profiles. Compare the keyboard on a second computer.</p></GuideCard>
            <GuideCard title="Bluetooth and wireless keyboards"><p>Recharge or replace batteries, pair again, move closer to the receiver, reduce 2.4 GHz interference, and test with a cable if supported. Delayed bursts of several keys often indicate connection or power issues.</p></GuideCard>
          </div>
        </section>

        <section className="border-t border-hairline pt-12">
          <h2 className="font-heading-3 text-ink">Layouts, languages, and compact keyboards</h2>
          <p className="mt-5 max-w-4xl font-body text-text-muted">The visual diagram represents a common 104-key ANSI keyboard. ISO layouts often use a taller Enter key and add an extra key near the left Shift. JIS and other regional layouts add or relocate keys. Sixty-percent, 65%, 75%, tenkeyless, ergonomic, and Apple keyboards omit or layer parts of the full-size arrangement. The tester can still report recognized physical codes, but a code without a matching tile may appear only in the Last key and Key code metrics.</p>
        </section>

        <section className="border-t border-hairline pt-12">
          <h2 className="font-heading-3 text-ink">When cleaning helps—and when repair is safer</h2>
          <div className="mt-6 grid gap-8 font-body text-text-muted md:grid-cols-2"><div><p>Power down and disconnect the device before cleaning. Use compressed air at an angle and a lightly dampened microfiber cloth. Do not spray liquid directly onto a keyboard. Mechanical keycaps may be removable when the manufacturer permits it, but laptop scissor clips are fragile and model-specific.</p></div><div><p>Seek repair when keys fail across devices or applications, several keys in a row or column stop together, the keyboard shows liquid damage, a laptop case is swollen, or input continues without touching a key. Stop using a swollen laptop immediately because the battery may be unsafe.</p></div></div>
          <p className="mt-6 font-body text-text-muted">Once the hardware is responding correctly, measure practical performance with the <a href="/#tester" className="text-accent underline underline-offset-4">GOATTYPE typing speed test</a>.</p>
        </section>
      </article>

      <section className="mt-16 border-t border-hairline pt-12" aria-labelledby="keyboard-faq-heading">
        <p className="font-label uppercase tracking-[0.14em] text-accent">Keyboard troubleshooting</p><h2 id="keyboard-faq-heading" className="mt-3 font-heading-3 text-ink">Keyboard Tester FAQ</h2><p className="mt-4 max-w-3xl font-body text-text-muted">Answers to common questions about laptop, desktop, mechanical, wireless, function, and number-pad keys.</p>
        <div className="mt-8 divide-y divide-hairline border-y border-hairline">{FAQS.map((item) => <details key={item.q} className="group py-1"><summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-heading-5 text-ink marker:content-none"><span>{item.q}</span><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-hairline text-text-muted transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary><p className="max-w-4xl pb-6 pr-12 font-body text-text-muted">{item.a}</p></details>)}</div>
      </section>
    </section>
  );
}

function keyClasses(isPressed: boolean, isTested: boolean) { return cn("flex min-w-0 items-center justify-center rounded-xl border px-1 text-center font-mono-sm transition-[transform,background-color,border-color,color,box-shadow] duration-100", isPressed && "scale-[0.96] border-accent bg-accent text-on-primary shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]", !isPressed && isTested && "border-accent/55 bg-accent/10 text-accent", !isPressed && !isTested && "border-hairline bg-canvas-soft text-text-muted"); }
function FlexKey({ definition, pressed, tested, compact = false }: { definition: KeyDefinition; pressed: Set<string>; tested: Set<string>; compact?: boolean }) { return <div style={{ flex: `${definition.width ?? 1} 1 0%` }} className={cn(keyClasses(pressed.has(definition.code), tested.has(definition.code)), compact ? "h-10" : "h-12 sm:h-14")}><span className="truncate">{definition.label}</span></div>; }
function KeyTile({ definition, pressed, tested, className }: { definition: KeyDefinition; pressed: Set<string>; tested: Set<string>; className?: string }) { return <div className={cn(keyClasses(pressed.has(definition.code), tested.has(definition.code)), "h-full min-h-0", className)}><span className="truncate">{definition.label}</span></div>; }
function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="rounded-2xl border border-hairline bg-canvas-soft px-4 py-4"><div className="font-caption uppercase tracking-wide text-text-faint">{label}</div><div className="mt-1 truncate font-mono text-xl font-semibold text-ink">{value}</div><div className="mt-1 font-caption text-text-muted">{detail}</div></div>; }
function GuideCard({ title, children }: { title: string; children: React.ReactNode }) { return <div className="rounded-2xl border border-hairline bg-canvas-soft p-6"><h3 className="font-heading-5 text-ink">{title}</h3><div className="mt-4 space-y-4 font-body text-text-muted">{children}</div></div>; }
