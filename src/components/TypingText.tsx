import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { getSoundEnabled, setSoundEnabled } from "../lib/useSound";
import { playTypingKeySound, preloadTypingSounds, unlockTypingSounds } from "../lib/useTypingSounds";
import { expectedNextChar } from "../lib/grade";
import type { Locale } from "../lib/i18n";
import { tr } from "../lib/i18n";

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
  locale?: Locale;
}

const WORD_WINDOW_SIZE = 70;
const WORD_SHIFT_THRESHOLD = 50;
const WORD_LOOKBACK = 15;

type WordKind = "completed" | "current" | "future";

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
  locale = "en",
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [wordWindowStart, setWordWindowStart] = useState(0);
  const [focused, setFocused] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(getSoundEnabled());
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const caretRef = useRef<HTMLSpanElement | null>(null);
  const currentCharRef = useRef<HTMLSpanElement | null>(null);

  const targetWords = useMemo(() => target.split(" "), [target]);
  const typedWords = useMemo(() => typed.split(" "), [typed]);
  const completedCount = Math.max(0, typedWords.length - 1);

  useEffect(() => { setWordWindowStart(0); }, [resetKey]);
  useEffect(() => { setSoundEnabledState(getSoundEnabled()); }, [status, resetKey]);
  useEffect(() => { preloadTypingSounds(); }, []);
  useEffect(() => {
    if (freeTyping) return;
    if (completedCount - wordWindowStart > WORD_SHIFT_THRESHOLD) {
      setWordWindowStart(Math.max(0, completedCount - WORD_LOOKBACK));
    }
  }, [completedCount, wordWindowStart, freeTyping]);

  const disabled = status === "finished";

  // Smooth sliding caret: a single persistent element whose position is measured
  // against a zero-width anchor placed exactly where the next keystroke will land,
  // then animated with a CSS transition so it glides between letters/words instead
  // of teleporting (modeled after Monkeytype's "smooth caret" setting —
  // frontend/src/ts/elements/caret.ts / caret.scss in monkeytypegame/monkeytype).
  useLayoutEffect(() => {
    const surface = surfaceRef.current;
    const caret = caretRef.current;
    if (!surface || !caret || freeTyping) return;
    const anchor = disabled ? null : currentCharRef.current;
    if (!anchor) {
      caret.style.opacity = "0";
      return;
    }
    const surfaceRect = surface.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    caret.style.opacity = "1";
    caret.style.height = `${anchorRect.height}px`;
    caret.style.transform = `translate(${anchorRect.left - surfaceRect.left}px, ${anchorRect.top - surfaceRect.top}px)`;
  }, [typed, target, wordWindowStart, freeTyping, disabled]);

  const focusInput = () => {
    if (!disabled) {
      unlockTypingSounds();
      inputRef.current?.focus();
    }
  };

  // Key sounds fire here and nowhere else, so the error sound can only ever be
  // heard on the keystroke that was actually wrong — never again afterwards.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled || !getSoundEnabled()) return;
    if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) return;
    if (freeTyping) return;

    // Space just separates words. It is never a mistake, so finishing a word
    // that contained a typo can no longer re-trigger the error sound.
    if (event.key === " ") {
      playTypingKeySound("correct");
      return;
    }

    // Word-aligned expected character: a mistake in one word never makes the
    // keystrokes that follow it sound wrong.
    const expected = expectedNextChar(target, typed);
    playTypingKeySound(expected !== undefined && event.key === expected ? "correct" : "wrong");
  };

  const toggleSound = () => {
    const next = !getSoundEnabled();
    setSoundEnabled(next);
    setSoundEnabledState(next);
    if (next) { unlockTypingSounds(); preloadTypingSounds(); }
    inputRef.current?.focus();
  };

  const copyClass = focusMode ? "typing-copy" : "text-left";

  // Letter states follow Monkeytype's renderer (frontend/src/styles/test.scss):
  //   .correct          → normal text colour
  //   .incorrect        → error colour, but the TARGET letter is still the glyph
  //                       that is displayed, so you can always read what you were
  //                       supposed to type
  //   .incorrect.extra  → dimmer "error-extra" colour, showing the character you
  //                       actually typed, because there is no target letter here
  //   .missing          → target letter at 50% opacity (skipped letters)
  //   .word.error       → 2px red underline under a finished word that had errors
  const renderWord = (wordIndex: number, kind: WordKind) => {
    const targetWord = targetWords[wordIndex] ?? "";
    const typedWord = kind === "future" ? "" : (typedWords[wordIndex] ?? "");
    const length = Math.max(targetWord.length, typedWord.length);
    const letters: React.ReactNode[] = [];
    let hasError = false;

    const caretAnchor = (key: string) => (
      <span
        key={key}
        ref={(el) => { currentCharRef.current = el; }}
        aria-hidden="true"
        className="inline-block w-0"
      />
    );

    for (let idx = 0; idx < length; idx += 1) {
      if (kind === "current" && idx === typedWord.length) {
        letters.push(caretAnchor(`caret-${idx}`));
      }

      const tChar = targetWord[idx];
      const pChar = typedWord[idx];

      if (tChar !== undefined && pChar !== undefined) {
        if (tChar === pChar) {
          letters.push(<span key={idx} className="typing-correct">{tChar}</span>);
        } else {
          // Mistyped: keep showing the letter you needed to type, in red.
          hasError = true;
          letters.push(<span key={idx} className="text-red-500">{tChar}</span>);
        }
      } else if (pChar !== undefined) {
        // Extra character typed past the end of the word: show what you typed,
        // in the dimmer "extra" red, which grows the word just like Monkeytype.
        hasError = true;
        letters.push(
          <span key={idx} className="text-red-400">{pChar === " " ? "\u00b7" : pChar}</span>,
        );
      } else if (kind === "completed") {
        // Word was left before finishing it: remaining letters are "missing".
        hasError = true;
        letters.push(<span key={idx} className="text-red-500/50">{tChar}</span>);
      } else {
        letters.push(<span key={idx} className="typing-pending">{tChar}</span>);
      }
    }

    if (kind === "current" && typedWord.length >= length) {
      letters.push(caretAnchor("caret-end"));
    }

    return (
      <span
        key={`w${wordIndex}`}
        className={cn(
          "inline-block",
          kind === "completed" && hasError && "border-b-2 border-red-500/70",
        )}
      >
        {letters}
      </span>
    );
  };

  const windowEndIndex = Math.min(targetWords.length, wordWindowStart + WORD_WINDOW_SIZE);
  const visibleNodes: React.ReactNode[] = [];
  for (let i = wordWindowStart; i < windowEndIndex; i += 1) {
    const kind: WordKind = i < completedCount ? "completed" : i === completedCount ? "current" : "future";
    visibleNodes.push(renderWord(i, kind));
    if (i < targetWords.length - 1) {
      visibleNodes.push(
        <span key={`sp-${i}`} className={i < completedCount ? "typing-correct" : "typing-pending"}> </span>,
      );
    }
  }

  return (
    <div className="relative">
      <div
        ref={surfaceRef}
        aria-hidden="true"
        tabIndex={-1}
        onClick={focusInput}
        onPointerDown={unlockTypingSounds}
        className={cn(
          "typing-surface relative cursor-text select-none rounded-[24px] border bg-canvas-soft/70 font-sans tracking-normal transition-[border-color,box-shadow] duration-300",
          focusMode
            ? "min-h-[220px] p-6 text-[22px] leading-[1.68] sm:min-h-[260px] sm:p-8 sm:text-[24px] sm:leading-[1.72] lg:min-h-[300px] lg:p-9 lg:text-[26px] lg:leading-[1.72]"
            : "min-h-[132px] p-4 text-[16px] leading-7 sm:min-h-[150px] sm:p-5 sm:text-[17px] sm:leading-8",
          focused ? "border-accent shadow-sm" : "border-hairline",
          disabled && "opacity-60",
        )}
      >
        {freeTyping ? (
          <p className={cn("whitespace-pre-wrap break-words text-ink-soft", copyClass)}>
            {typed.length > 0 ? typed : (
              <span className="text-faint">
                {locale === "es" ? "Empieza a escribir lo que quieras..." : "Start typing anything you want..."}
              </span>
            )}
            {status !== "finished" && typed.length > 0 && (
              <span
                className={cn("ml-[1px] inline-block h-[1.15em] w-[2px] translate-y-[0.12em] rounded-full bg-accent", !reducedMotion && "caret-blink")}
                aria-hidden="true"
              />
            )}
          </p>
        ) : (
          <>
            <span
              ref={caretRef}
              aria-hidden="true"
              style={{ opacity: 0 }}
              className={cn(
                "pointer-events-none absolute left-0 top-0 w-[2px] rounded-full bg-accent will-change-transform",
                !reducedMotion && "transition-transform duration-100 ease-out",
                !reducedMotion && "caret-blink",
              )}
            />
            <p className={cn("whitespace-pre-wrap break-words", copyClass)}>{visibleNodes}</p>
          </>
        )}
        {!focused && status !== "finished" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[24px] bg-canvas/70 backdrop-blur-[2px]">
            <span className={cn("rounded-full border border-accent bg-accent/10 px-6 py-3 font-link text-accent", focusMode && "px-8 py-4 text-[18px]")}>
              {tr(locale, "tester", "clickStart")}
            </span>
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={typed}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          onChange={(e) => onChange(e.currentTarget.value)}
          onFocus={() => { setFocused(true); unlockTypingSounds(); preloadTypingSounds(); onFocusModeRequest?.(); }}
          onBlur={() => setFocused(false)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label={freeTyping
            ? (locale === "es" ? "Entrada para escribir libremente." : "Free typing input. Type anything you want.")
            : (locale === "es" ? "Entrada de test de mecanograf\u00eda. Escribe el texto mostrado." : "Typing test input. Type the passage displayed above this field.")}
          tabIndex={disabled ? -1 : 0}
          className="absolute inset-0 z-10 h-full w-full cursor-text opacity-0"
        />
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={toggleSound}
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? tr(locale, "tester", "soundOff") : tr(locale, "tester", "soundOn")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 font-label transition-colors duration-200",
            soundEnabled ? "border-accent/30 bg-accent/10 text-accent hover:bg-accent/15" : "border-hairline bg-canvas-soft text-text-muted hover:bg-canvas",
          )}
        >
          <span aria-hidden="true" className="text-base leading-none">{soundEnabled ? "\ud83d\udd0a" : "\ud83d\udd07"}</span>
          <span>{soundEnabled ? tr(locale, "tester", "soundOn") : tr(locale, "tester", "soundOff")}</span>
        </button>
      </div>
    </div>
  );
}
