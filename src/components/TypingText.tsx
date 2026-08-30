import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../utils/cn";

interface Props {
  target: string;
  typed: string;
  status: "idle" | "running" | "finished";
  resetKey: string | number;
  onChange: (value: string) => void;
  reducedMotion: boolean;
  freeTyping?: boolean;
}

const WINDOW_SIZE = 620;
const SHIFT_THRESHOLD = 460;

export default function TypingText({
  target,
  typed,
  status,
  resetKey,
  onChange,
  reducedMotion,
  freeTyping = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [windowStart, setWindowStart] = useState(0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setWindowStart(0);
    if (inputRef.current) inputRef.current.value = "";
  }, [resetKey]);

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

  const windowEnd = Math.min(target.length, windowStart + WINDOW_SIZE);
  const slice = target.slice(windowStart, windowEnd);

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        tabIndex={-1}
        onClick={focusInput}
        className={cn(
          "typing-surface relative min-h-[168px] cursor-text select-none rounded-2xl border bg-surface2/70 p-5 font-sans text-[17px] leading-8 tracking-normal transition-all duration-300 sm:p-7 sm:text-[19px] sm:leading-9",
          focused ? "border-accent/45 shadow-[0_0_0_1px_rgba(0,255,102,0.05),0_0_35px_-20px_rgba(0,255,102,0.45)]" : "border-white/10",
          disabled && "opacity-60"
        )}
      >
        {freeTyping ? (
          <p className="whitespace-pre-wrap break-words text-ink-soft">
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
          <p className="whitespace-pre-wrap break-words">
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
              if (state === "correct") return <span key={absIndex} className="text-accent2">{ch}</span>;
              if (state === "incorrect") {
                return (
                  <span key={absIndex} className={cn("rounded-[3px] text-danger", ch === " " ? "bg-danger/25" : "bg-danger/10")}>
                    {ch === " " ? "\u00B7" : ch}
                  </span>
                );
              }
              return <span key={absIndex} className="text-faint">{ch}</span>;
            })}
          </p>
        )}

        {!focused && status !== "finished" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-bg/70 backdrop-blur-[2px]">
            <span className="rounded-full border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent">Click here and start typing</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        defaultValue=""
        disabled={disabled}
        onInput={(e) => onChange(e.currentTarget.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label={freeTyping ? "Free typing input. Type anything you want." : "Typing test input. Type the passage displayed above this field."}
        tabIndex={disabled ? -1 : 0}
        className="absolute inset-0 h-full w-full cursor-text opacity-0"
      />
    </div>
  );
}
