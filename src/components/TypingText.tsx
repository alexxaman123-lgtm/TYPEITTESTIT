import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { getSoundEnabled, setSoundEnabled } from "../lib/useSound";
import {
  playTypingKeySound,
  preloadTypingSounds,
  setTypingSoundsEnabled,
  unlockTypingSounds,
} from "../lib/useTypingSounds";
import { typingSoundForInput } from "../lib/grade";
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

/** Visible lines in the typing viewport; the view slides exactly one line at a time. */
/** How long after the last keystroke the caret starts blinking again. */
const CARET_BLINK_RESUME_MS = 650;
/** Caret height as a multiple of the font size, and an absolute floor in px. */
const CARET_HEIGHT_EM = 1.25;
const CARET_MIN_HEIGHT_PX = 12;
/**
 * Zero-width space. The measurement anchor needs *some* content: an empty
 * inline-block generates no line box, so it measures 0px tall - which is
 * exactly why the caret was invisible. A ZWSP has no advance width, so the
 * text layout is unaffected.
 */
const ANCHOR_CHAR = "\u200b";

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
  // The passage is a single horizontal track. Its transform is updated directly
  // from measured caret geometry so rapid keystrokes can interrupt the motion
  // without accumulating cursor drift.
  const wordsRef = useRef<HTMLParagraphElement | null>(null);
  // Stable first-line marker: measuring against the paragraph bounding box can
  // be ambiguous when inline content fragments across multiple wrapped lines.
  const passageStartRef = useRef<HTMLSpanElement | null>(null);
  const [focused, setFocused] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(getSoundEnabled());
  // The caret holds still (solid) while you are typing and only breathes once
  // you pause - a caret that blinks mid-keystroke looks like it is stuttering.
  const [caretBlinking, setCaretBlinking] = useState(true);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const caretRef = useRef<HTMLSpanElement | null>(null);
  const currentCharRef = useRef<HTMLSpanElement | null>(null);
  // The value from the last real input event. Unlike React state or keydown,
  // this remains exact when a mobile IME emits several events quickly.
  const inputValueRef = useRef(typed);

  const targetWords = useMemo(() => target.split(" "), [target]);
  const typedWords = useMemo(() => typed.split(" "), [typed]);
  const completedCount = Math.max(0, typedWords.length - 1);

  useEffect(() => { inputValueRef.current = typed; }, [typed, resetKey]);
  useEffect(() => { setSoundEnabledState(getSoundEnabled()); }, [status, resetKey]);
  useEffect(() => { preloadTypingSounds(); }, []);
  // The test starts on the first keystroke, so the input is focused as soon as
  // the test mounts (and after every restart) - no click needed to begin.
  // Programmatic focus never opens the mobile keyboard; it just readies input.
  useEffect(() => {
    if (status !== "finished") inputRef.current?.focus({ preventScroll: true });
  }, [resetKey, status]);
  useEffect(() => {
    setCaretBlinking(false);
    const timeoutId = window.setTimeout(() => setCaretBlinking(true), CARET_BLINK_RESUME_MS);
    return () => window.clearTimeout(timeoutId);
  }, [typed, resetKey]);
  const disabled = status === "finished";

  // Cinematic horizontal banner: keep the active caret around 42% of the
  // viewport while the passage glides from right to left as the user types.
  // Read the in-flight transform before calculating the next one, so a fast
  // typist can interrupt the previous animation without overshooting.
  useLayoutEffect(() => {
    if (disabled) return;
    const words = wordsRef.current;
    const anchor = currentCharRef.current;
    const surface = surfaceRef.current;
    if (!words || !anchor || !surface) return;

    const alignTrack = () => {
      const activeAnchor = currentCharRef.current;
      if (!activeAnchor || !wordsRef.current || !surfaceRef.current) return;

      const surfaceRect = surfaceRef.current.getBoundingClientRect();
      const surfaceStyles = window.getComputedStyle(surfaceRef.current);
      const paddingLeft = parseFloat(surfaceStyles.paddingLeft) || 0;
      const paddingRight = parseFloat(surfaceStyles.paddingRight) || 0;
      const contentWidth = Math.max(1, surfaceRect.width - paddingLeft - paddingRight);
      const targetX = surfaceRect.left + paddingLeft + contentWidth * 0.5;
      const anchorRect = activeAnchor.getBoundingClientRect();
      const currentTransform = window.getComputedStyle(wordsRef.current).transform;
      const currentX = currentTransform === "none"
        ? 0
        : new DOMMatrixReadOnly(currentTransform).m41;
      const nextX = currentX + targetX - anchorRect.left;
      const snapToStart = typed.length === 0 && status === "idle";

      // On reset, place the first word immediately. During a test, use a smooth
      // eased transform. Reduced-motion preferences disable the animation.
      // Match the caret's 110ms movement. A long transition restarts on
      // every key and makes the passage perpetually chase the user's typing.
      wordsRef.current.style.transition = snapToStart || reducedMotion
        ? "none"
        : "transform 85ms linear";
      wordsRef.current.style.transform = `translate3d(${nextX}px, 0, 0)`;
    };

    alignTrack();

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => alignTrack())
      : undefined;
    resizeObserver?.observe(surface);
    window.addEventListener("resize", alignTrack);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", alignTrack);
    };
  }, [typed, target, resetKey, freeTyping, disabled, focusMode, status, reducedMotion]);

  // Keep the caret locked to the active character and refresh the curve while
  // the horizontal track is gliding. The short RAF window follows the CSS scroll
  // transition, so words never jump back to a flat baseline between keystrokes.
  useLayoutEffect(() => {
    const words = wordsRef.current;
    const caret = caretRef.current;
    const passageStart = passageStartRef.current;
    const surface = surfaceRef.current;
    if (!words || !caret || !passageStart || !surface) return;

    const arcElements = Array.from(
      surface.querySelectorAll<HTMLElement>(".typing-arc-word, .typing-arc-space"),
    );

    const updateArc = () => {
      const surfaceRect = surface.getBoundingClientRect();
      const trackRect = words.getBoundingClientRect();
      const halfWidth = Math.max(surfaceRect.width / 2, 1);
      const centerX = surfaceRect.left + halfWidth;
      const arcDepth = Math.min(42, Math.max(18, surfaceRect.width * 0.025));

      if (!focusMode || reducedMotion) {
        arcElements.forEach((element) => {
          element.style.transform = "";
          element.style.transition = "";
        });
        return;
      }

      // Read all positions before writing transforms. offsetLeft/offsetWidth
      // describe each word's untransformed inline layout, while trackRect includes
      // the live horizontal scroll position. This avoids transform feedback loops.
      const updates = arcElements.map((element) => {
        const layoutCenterX = trackRect.left + element.offsetLeft + element.offsetWidth / 2;
        const normalized = Math.max(-1, Math.min(1, (layoutCenterX - centerX) / halfWidth));
        const y = arcDepth * normalized * normalized;
        const angle = Math.max(
          -2.2,
          Math.min(2.2, Math.atan((2 * arcDepth * normalized) / halfWidth) * (180 / Math.PI)),
        );
        return { element, transform: `translate3d(0, ${y.toFixed(2)}px, 0) rotate(${angle.toFixed(2)}deg)` };
      });

      updates.forEach(({ element, transform }) => {
        // RAF updates follow the scrolling track frame by frame; CSS transitions
        // here would restart every frame and make the letters shimmer.
        element.style.transition = "none";
        element.style.transformOrigin = "center center";
        element.style.transform = transform;
      });
    };

    const positionCaret = () => {
      updateArc();

      const anchor = disabled ? null : currentCharRef.current;
      if (!anchor) {
        caret.style.opacity = "0";
        return;
      }

      const startRect = passageStart.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const anchorStyles = window.getComputedStyle(anchor);
      const fontSize = parseFloat(anchorStyles.fontSize) || 16;
      const parsedLineHeight = parseFloat(anchorStyles.lineHeight);
      const lineBoxHeight =
        anchorRect.height ||
        (Number.isFinite(parsedLineHeight) ? parsedLineHeight : 0) ||
        fontSize * 1.6;
      const caretHeight = Math.max(CARET_MIN_HEIGHT_PX, fontSize * CARET_HEIGHT_EM);

      const x = anchorRect.left - startRect.left;
      const y = anchorRect.top - startRect.top + (lineBoxHeight - caretHeight) / 2;
      caret.style.height = `${caretHeight}px`;
      caret.style.transform = `translate(${x}px, ${y}px)`;
      caret.style.opacity = "1";
    };

    positionCaret();

    // Follow the active scroll transition for 180ms. If another key arrives,
    // the effect restarts from the current geometry and never clears the line.
    let arcFrame = 0;
    const animationStart = performance.now();
    const followTrack = () => {
      positionCaret();
      if (performance.now() - animationStart < 180) {
        arcFrame = requestAnimationFrame(followTrack);
      }
    };
    if (focusMode && !reducedMotion) {
      arcFrame = requestAnimationFrame(followTrack);
    }

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => positionCaret())
      : undefined;
    resizeObserver?.observe(surface);
    window.addEventListener("resize", positionCaret);
    return () => {
      cancelAnimationFrame(arcFrame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", positionCaret);
    };
  }, [typed, target, freeTyping, disabled, focusMode, focused, status, reducedMotion]);

  const focusInput = () => {
    if (!disabled) {
      unlockTypingSounds();
      inputRef.current?.focus();
    }
  };

  // Classify feedback from the value produced by the browser's input event.
  // This works for desktop keys and Android/iOS virtual keyboards; keydown
  // does not, because mobile IMEs can omit it or report "Unidentified".
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value;
    const previousValue = inputValueRef.current;
    inputValueRef.current = nextValue;

    if (!disabled && !freeTyping && getSoundEnabled()) {
      unlockTypingSounds();
      const sound = typingSoundForInput(target, previousValue, nextValue);
      if (sound) playTypingKeySound(sound);
    }

    onChange(nextValue);
  };

  const toggleSound = () => {
    const next = !getSoundEnabled();
    setSoundEnabled(next);
    setTypingSoundsEnabled(next);
    setSoundEnabledState(next);
    if (next) { unlockTypingSounds(); preloadTypingSounds(); }
    inputRef.current?.focus();
  };

  const copyClass = focusMode ? "typing-copy-focus" : "text-left";

  // Letter states follow Monkeytype's renderer (frontend/src/styles/test.scss):
  //   .correct          -> normal text colour
  //   .incorrect        -> error colour, but the TARGET letter is still the glyph
  //                        that is displayed, so you can always read what you were
  //                        supposed to type
  //   .incorrect.extra  -> dimmer "error-extra" colour, showing the character you
  //                        actually typed, because there is no target letter here
  //   .missing          -> target letter at 50% opacity (skipped letters)
  //   .word.error       -> 2px red underline under a finished word that had errors
  const renderWord = (wordIndex: number, kind: WordKind) => {
    const targetWord = targetWords[wordIndex] ?? "";
    const typedWord = kind === "future" ? "" : (typedWords[wordIndex] ?? "");
    const hasExtraCharacters = typedWord.length > targetWord.length;
    const letters: React.ReactNode[] = [];
    let hasError = false;

    const caretAnchor = (key: string) => (
      <span
        key={key}
        ref={(el) => { currentCharRef.current = el; }}
        aria-hidden="true"
        className="inline-block w-0 align-baseline"
      >
        {ANCHOR_CHAR}
      </span>
    );

    // Keep the actual target word as one inline-block. Only the accidental
    // over-typed suffix is allowed to wrap as ordinary inline content. Making
    // the whole word inline caused its error underline to fragment across lines.
    if (hasExtraCharacters) {
      const targetLetters: React.ReactNode[] = [];
      for (let idx = 0; idx < targetWord.length; idx += 1) {
        const targetChar = targetWord[idx];
        const typedChar = typedWord[idx];

        if (targetChar === typedChar) {
          targetLetters.push(<span key={idx} className="typing-correct">{targetChar}</span>);
        } else {
          hasError = true;
          targetLetters.push(<span key={idx} className="text-red-500">{targetChar}</span>);
        }
      }

      const extraLetters: React.ReactNode[] = [];
      for (let idx = targetWord.length; idx < typedWord.length; idx += 1) {
        hasError = true;
        extraLetters.push(
          <span key={`extra-${idx}`} className="text-red-400">{typedWord[idx]}</span>,
        );
      }
      if (kind === "current") extraLetters.push(caretAnchor("caret-end"));

      return (
        <Fragment key={`w${wordIndex}`}>
          {targetWord.length > 0 && (
            <span
              className={cn(
                "inline-block",
                "typing-arc-word",
                kind === "current" && "typing-word-current",
                kind === "completed" && hasError && "border-b-2 border-red-500/70",
              )}
            >
              {targetLetters}
            </span>
          )}
          <span className="inline break-all">{extraLetters}</span>
        </Fragment>
      );
    }

    const length = targetWord.length;
    for (let idx = 0; idx < length; idx += 1) {
      if (kind === "current" && idx === typedWord.length) {
        letters.push(caretAnchor(`caret-${idx}`));
      }

      const targetChar = targetWord[idx];
      const typedChar = typedWord[idx];

      if (typedChar !== undefined && targetChar === typedChar) {
        letters.push(<span key={idx} className="typing-correct">{targetChar}</span>);
      } else if (typedChar !== undefined) {
        hasError = true;
        letters.push(<span key={idx} className="text-red-500">{targetChar}</span>);
      } else if (kind === "completed") {
        hasError = true;
        letters.push(<span key={idx} className="text-red-500/50">{targetChar}</span>);
      } else {
        letters.push(<span key={idx} className="typing-pending">{targetChar}</span>);
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
          "typing-arc-word",
          kind === "current" && "typing-word-current",
          kind === "completed" && hasError && "border-b-2 border-red-500/70",
        )}
      >
        {letters}
      </span>
    );
  };

  // The full passage renders - no word window. A fixed-height viewport shows
  // three lines and slides one line at a time, so typing never reflows or
  // jumps the text the user is reading.
  const visibleNodes: React.ReactNode[] = [];
  for (let i = 0; i < targetWords.length; i += 1) {
    const kind: WordKind = i < completedCount ? "completed" : i === completedCount ? "current" : "future";
    visibleNodes.push(renderWord(i, kind));
    if (i < targetWords.length - 1) {
      visibleNodes.push(
        <span key={`sp-${i}`} className={cn("typing-arc-space", i < completedCount ? "typing-correct" : "typing-pending")}> </span>,
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
          focusMode
            ? "typing-surface typing-surface-focus relative flex cursor-text select-none items-center font-sans tracking-normal"
            : "typing-surface relative cursor-text select-none rounded-[24px] border bg-canvas-soft/70 font-sans tracking-normal transition-[border-color,box-shadow] duration-300 min-h-[132px] p-4 text-[16px] leading-7 sm:min-h-[150px] sm:p-5 sm:text-[17px] sm:leading-8",
          !freeTyping && "flex items-center",
          focusMode && "text-[34px] leading-[1.28] tracking-[-0.04em] sm:text-[42px] lg:text-[52px] xl:text-[58px]",
          !focusMode && (focused ? "border-accent shadow-sm" : "border-hairline"),
          disabled && "opacity-60",
        )}
      >
        {freeTyping ? (
          <div className="typing-banner-viewport">
            <p
              ref={wordsRef}
              className={cn("typing-track typing-track-free relative", copyClass, "text-ink-soft")}
            >
              <span
                ref={caretRef}
                aria-hidden="true"
                style={{ opacity: 0, height: `${CARET_MIN_HEIGHT_PX}px` }}
                className={cn(
                  "pointer-events-none absolute left-0 top-0 z-[1] w-[2px] rounded-full bg-accent",
                  !reducedMotion && "typing-caret",
                  !reducedMotion && caretBlinking && "caret-blink",
                )}
              />
              <span
                ref={passageStartRef}
                aria-hidden="true"
                className="inline-block w-0 align-baseline"
              >
                {ANCHOR_CHAR}
              </span>
              {typed.length > 0 ? (
                <>
                  {typed.split(/(\s+)/u).filter((part) => part.length > 0).map((part, index) => (
                    /^\s+$/u.test(part) ? (
                      <span key={`free-space-${index}`} className="typing-arc-space">{part}</span>
                    ) : (
                      <span key={`free-word-${index}`} className="typing-arc-word">{part}</span>
                    )
                  ))}
                  {status !== "finished" && (
                    <span
                      ref={currentCharRef}
                      aria-hidden="true"
                      className="inline-block w-0 align-baseline"
                    >
                      {ANCHOR_CHAR}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-faint">
                  {locale === "es" ? "Empieza a escribir lo que quieras..." : "Start typing anything you want..."}
                </span>
              )}
            </p>
          </div>
        ) : (
          <div className="typing-banner-viewport">
            <p
              ref={wordsRef}
              className={cn("typing-track relative whitespace-nowrap", copyClass)}
            >
              <span
                ref={caretRef}
                aria-hidden="true"
                style={{ opacity: 0, height: `${CARET_MIN_HEIGHT_PX}px` }}
                className={cn(
                  "pointer-events-none absolute left-0 top-0 z-[1] w-[2px] rounded-full bg-accent",
                  !reducedMotion && "typing-caret",
                  !reducedMotion && caretBlinking && "caret-blink",
                )}
              />
              <span
                ref={passageStartRef}
                aria-hidden="true"
                className="inline-block w-0 align-baseline"
              >
                {ANCHOR_CHAR}
              </span>
              {visibleNodes}
            </p>
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          value={typed}
          disabled={disabled}
          onChange={handleInputChange}
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
      <div className={focusMode ? "focus-sound-toggle" : "mt-3 flex justify-end"}>
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
