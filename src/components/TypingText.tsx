import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { getSoundEnabled, setSoundEnabled, useSound } from "../lib/useSound";

interface Props {
  target: string;
  typed: string;
  status: "idle" | "running" | "finished";
  resetKey: string | number;
  onChange: (value: string) => void;
  reducedMotion: boolean;
  freeTyping?: boolean;
  focusMode?: boolean;
  onFocusModeRequest?: () => void;
}

const WINDOW_SIZE = 620;
const SHIFT_THRESHOLD = 460;
const CORRECT_KEY_SOUND = "/koiroylers-keyboard-press-351952_[cut_0sec].mp3";
const CORRECT_KEY_VOLUME = 0.10;

export default function TypingText({
  target,
  typed,
  status,
  resetKey,
  onChange,
  reducedMotion,
  freeTyping = false,
  focusMode = false,
  onFocusModeRequest,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { playSound } = useSound();
  const [windowStart, setWindowStart] = useState(0);
  const [focused, setFocused] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(getSoundEnabled());

  useEffect(() => {
    setWindowStart(0);
    if (inputRef.current) inputRef.current.value = "";
  }, [resetKey]);

  useEffect(() => {
    setSoundEnabledState(getSoundEnabled());
  }, [status, resetKey]);

  useEffect(() => {
    if (!freeTyping && typed.length - windowStart > SHIFT_THRESHOLD) {
      setWindowStart(Math.max(0, typed.length - 80));
    }
  }, [typed.length, windowStart, freeTyping]);

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (el && document.activeElement === el) {
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [typed]);

  const disabled = status === "finished";

  const focusInput = () => {
    if (!disabled) inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || !getSoundEnabled()) return;
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    if (freeTyping) return;

    const expected = target[typed.length];
    if (event.key === expected) {
      playSound(CORRECT_KEY_SOUND, CORRECT_KEY_VOLUME);
    }
  };

  const toggleSound = () => {
    const nextEnabled = !getSoundEnabled();
    setSoundEnabled(nextEnabled);
    setSoundEnabledState(nextEnabled);

    if (nextEnabled) {
      playSound("/piano-noise-suprise.mp3", 0.01);
    }

    inputRef.current?.focus();
  };

  const windowEnd = Math.min(target.length, windowStart + WINDOW_SIZE);
  const slice = target.slice(windowStart, windowEnd);
  const copyClass = focusMode ? "typing-copy" : "text-left";

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        tabIndex={-1}
        onClick={focusInput}
        className={cn(
          "typing-surface relative cursor-text select-none rounded-[24px] border bg-canvas-soft/70 font-sans tracking-normal transition-[border-color,box-shadow] duration-300",
          focusMode
            ? "min-h-[220px] p-6 text-[22px] leading-[1.68] sm:min-h-[260px] sm:p-8 sm:text-[24px] sm:leading-[1.72] lg:min-h-[300px] lg:p-9 lg:text-[26px] lg:leading-[1.72]"
            : "min-h-[132px] p-4 text-[16px] leading-7 sm:min-h-[150px] sm:p-5 sm:text-[17px] sm:leading-8",
          focused ? "border-accent shadow-sm" : "border-hairline",
          disabled && "opacity-60"
        )}
      >
        {freeTyping ? (
          <p className={cn("whitespace-pre-wrap break-words text-ink-soft", copyClass)}>
            {typed.length > 0 ? typed : <span className="text-faint">Start typing anything you want...</span>}
            {status !== "finished" && typed.length > 0 && (
              <span
                className={cn(
                  "ml-[1px] inline-block h-[1.15em] w-[2px] translate-y-[0.12em] rounded-full bg-accent",
                  !reducedMotion && "caret-blink"
                )}
                aria-hidden="true"
              />
            )}
          </p>
        ) : (
          <p className={cn("whitespace-pre-wrap break-words", copyClass)}>
            {slice.split("").map((ch, i) => {
              const absIndex = windowStart + i;
              let state: "correct" | "incorrect" | "current" | "pending" = "pending";
              if (absIndex < typed.length) state = typed[absIndex] === ch ? "correct" : "incorrect";
              else if (absIndex === typed.length) state = "current";

              if (state === "current") {
                return (
                  <span key={absIndex} className="relative">
                    <span className={cn("absolute -left-[1px] top-[2px] bottom-[2px] w-[2px] rounded-full bg-accent", !reducedMotion && "caret-blink")} aria-hidden="true" />
                    <span className="rounded-[3px] bg-accent/15 text-ink">{ch}</span>
                  </span>
                );
              }
              if (state === "correct") {
                return <span key={absIndex} className="typing-correct">{ch}</span>;
              }
              if (state === "incorrect") {
                return (
                  <span key={absIndex} className={cn("rounded-[3px] text-red-600", ch === " " ? "bg-red-500/25" : "bg-red-500/10")}>
                    {ch === " " ? "·" : ch}
                  </span>
                );
              }
              return <span key={absIndex} className="typing-pending">{ch}</span>;
            })}
          </p>
        )}
        {!focused && status !== "finished" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[24px] bg-canvas/70 backdrop-blur-[2px]">
            <span className={cn(
              "rounded-full border border-accent bg-accent/10 px-6 py-3 font-link text-accent",
              focusMode && "px-8 py-4 text-[18px]"
            )}>Click here and start typing</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          defaultValue=""
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onInput={(e) => onChange(e.currentTarget.value)}
          onFocus={() => {
            setFocused(true);
            onFocusModeRequest?.();
          }}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label={freeTyping ? "Free typing input. Type anything you want." : "Typing test input. Type the passage displayed above this field."}
          tabIndex={disabled ? -1 : 0}
          className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
        />
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={toggleSound}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? "Turn typing sounds off" : "Turn typing sounds on"}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-label transition-colors duration-200",
            soundEnabled
              ? "border-accent/30 bg-accent/10 text-accent hover:bg-accent/15"
              : "border-hairline bg-canvas-soft text-text-muted hover:bg-canvas"
          )}
        >
          <span aria-hidden="true" className="text-base leading-none">{soundEnabled ? "🔊" : "🔇"}</span>
          <span>{soundEnabled ? "Sound on" : "Sound off"}</span>
        </button>
      </div>
    </div>
  );
}
