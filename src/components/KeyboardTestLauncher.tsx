import { flushSync } from "react-dom";
import { useEffect, useRef, useState } from "react";
import KeyboardTester from "./KeyboardTester";

type NavigatorWithKeyboardLock = Navigator & { keyboard?: { lock?: (keys?: string[]) => Promise<void>; unlock?: () => void } };

export default function KeyboardTestLauncher({ label = "Launch keyboard test" }: { label?: string }) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [modeNote, setModeNote] = useState("Keyboard capture is active. Browser Keyboard Lock is used when available.");
  const previousOverflow = useRef("");

  const restorePage = () => {
    document.documentElement.style.overflow = previousOverflow.current;
    (navigator as NavigatorWithKeyboardLock).keyboard?.unlock?.();
  };

  const close = async () => {
    (navigator as NavigatorWithKeyboardLock).keyboard?.unlock?.();
    if (document.fullscreenElement === overlayRef.current) await document.exitFullscreen().catch(() => undefined);
    restorePage();
    setOpen(false);
  };

  const launch = async () => {
    previousOverflow.current = document.documentElement.style.overflow;
    flushSync(() => setOpen(true));
    document.documentElement.style.overflow = "hidden";
    const overlay = overlayRef.current;
    if (!overlay) return;

    try {
      if (overlay.requestFullscreen) await overlay.requestFullscreen();
      const keyboard = (navigator as NavigatorWithKeyboardLock).keyboard;
      if (keyboard?.lock) {
        try {
          await keyboard.lock();
          setModeNote("Fullscreen Keyboard Lock is active where supported. Press Esc or End test to return.");
        } catch {
          setModeNote("Fullscreen test is active. Keyboard Lock was unavailable, so some browser or system shortcuts may still run.");
        }
      } else {
        setModeNote("Fullscreen test is active. This browser does not support Keyboard Lock, so some shortcuts may still run.");
      }
    } catch {
      setModeNote("The full-viewport test is active. Browser fullscreen was blocked, but keys are still captured while testing.");
    }
    window.requestAnimationFrame(() => overlay.querySelector<HTMLElement>('[role="application"]')?.focus({ preventScroll: true }));
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      if (open && !document.fullscreenElement) {
        restorePage();
        setOpen(false);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      restorePage();
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={launch} className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 font-link text-on-primary transition-transform hover:-translate-y-0.5">
        {label}<span className="ml-2" aria-hidden="true">→</span>
      </button>
      <div ref={overlayRef} aria-hidden={!open} className={open ? "fixed inset-0 z-[200] overflow-auto bg-canvas" : "invisible fixed inset-0 -z-10 overflow-hidden bg-canvas opacity-0 pointer-events-none"}>
        {open && <KeyboardTester onExit={() => void close()} modeNote={modeNote} />}
      </div>
    </>
  );
}
