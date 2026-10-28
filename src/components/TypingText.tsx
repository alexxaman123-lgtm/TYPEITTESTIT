import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";
import { getSoundEnabled, setSoundEnabled } from "../lib/useSound";
import {
  getTypingSoundStyle,
  playTypingKeySound,
  preloadTypingSounds,
  setTypingSoundStyle,
  setTypingSoundsEnabled,
  unlockTypingSounds,
  type TypingSoundStyle,
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
  // Track X is kept numerically so the animation frame never has to force a
  // computed-style/layout read just to discover the transform we wrote last frame.
  const trackXRef = useRef(0);
  // Stable first-line marker: measuring against the paragraph bounding box can
  // be ambiguous when inline content fragments across multiple wrapped lines.
  const passageStartRef = useRef<HTMLSpanElement | null>(null);
  const [focused, setFocused] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(getSoundEnabled());
  const [soundStyle, setSoundStyleState] = useState<TypingSoundStyle>(getTypingSoundStyle());
  // The caret holds still (solid) while you are typing and only breathes once
  // you pause - a caret that blinks mid-keystroke looks like it is stuttering.
  const [caretBlinking, setCaretBlinking] = useState(true);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const caretRef = useRef<HTMLSpanElement | null>(null);
  const currentCharRef = useRef<HTMLSpanElement | null>(null);
  const arcElementsRef = useRef<HTMLElement[]>([]);
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

  // Keep the active caret near the visual center while the passage glides
  // right-to-left. The easing loop only reads the numeric ref it updates; it
  // never calls getComputedStyle/DOMMatrix on every frame (which forced layout
  // on slower devices and made the line feel like it was dragging behind).
  useLayoutEffect(() => {
    if (disabled) return;
    const track = wordsRef.current;
    const anchor = currentCharRef.current;
    const typingSurface = surfaceRef.current;
    if (!track || !anchor || !typingSurface) return;

    let trackFrame = 0;

    const alignTrack = () => {
      const activeAnchor = currentCharRef.current;
      const currentTrack = wordsRef.current;
      const surface = surfaceRef.current;
      if (!activeAnchor || !currentTrack || !surface) return;

      const surfaceRect = surface.getBoundingClientRect();
      const styles = window.getComputedStyle(surface);
      const paddingLeft = parseFloat(styles.paddingLeft) || 0;
      const paddingRight = parseFloat(styles.paddingRight) || 0;
      const contentWidth = Math.max(1, surfaceRect.width - paddingLeft - paddingRight);
      const centerX = surfaceRect.left + paddingLeft + contentWidth * 0.5;
      const anchorRect = activeAnchor.getBoundingClientRect();
      const targetX = trackXRef.current + centerX - anchorRect.left;
      const snap = (typed.length === 0 && status === "idle") || reducedMotion;

      cancelAnimationFrame(trackFrame);
      currentTrack.style.transition = "none";

      if (snap) {
        trackXRef.current = targetX;
        currentTrack.style.transform = `translate3d(${targetX}px, 0, 0)`;
        trackFrame = 0;
        return;
      }

      let previousTime = 0;
      const easeTrack = (now: number) => {
        const elapsed = previousTime === 0 ? 16 : Math.min(32, now - previousTime);
        previousTime = now;
        const liveX = trackXRef.current;
        const delta = targetX - liveX;

        if (Math.abs(delta) < 0.14) {
          trackXRef.current = targetX;
          currentTrack.style.transform = `translate3d(${targetX}px, 0, 0)`;
          trackFrame = 0;
          return;
        }

        // A gentle exponential ease stays responsive at high WPM, yet carries
        // the line continuously between keystrokes instead of snapping each time.
        const blend = 1 - Math.exp(-elapsed / 68);
        const nextX = liveX + delta * blend;
        trackXRef.current = nextX;
        currentTrack.style.transform = `translate3d(${nextX}px, 0, 0)`;
        trackFrame = requestAnimationFrame(easeTrack);
      };

      trackFrame = requestAnimationFrame(easeTrack);
    };

    alignTrack();

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => alignTrack())
      : undefined;
    resizeObserver?.observe(typingSurface);
    window.addEventListener("resize", alignTrack);
    return () => {
      cancelAnimationFrame(trackFrame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", alignTrack);
    };
  }, [typed, target, resetKey, freeTyping, disabled, focusMode, status, reducedMotion]);

  // The arc and caret are animated with cached geometry. Measuring every glyph
  // on every frame was an expensive layout loop, especially with long passages.
  // We now measure visible words once per keystroke and update only their
  // transforms while the line is moving.

  // Keep the caret attached to the active glyph while the track glides. Only
  // the visible words (plus a generous overscan) are measured; glyph positions
  // are cached for the short animation window, so a large passage can't trigger
  // hundreds of getBoundingClientRect calls on each animation frame.
  useLayoutEffect(() => {
    const words = wordsRef.current;
    const caret = caretRef.current;
    const passageStart = passageStartRef.current;
    const surface = surfaceRef.current;
    if (!words || !caret || !passageStart || !surface) return;

    const clearArcTransforms = () => {
      arcElementsRef.current.forEach((element) => {
        element.style.transform = "";
        element.style.transition = "";
      });
      arcElementsRef.current = [];
    };

    const anchor = disabled ? null : currentCharRef.current;
    if (!focusMode || reducedMotion) {
      clearArcTransforms();
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
      return;
    }

    type ArcMetric = { element: HTMLElement; baseX: number };
    let surfaceRect = surface.getBoundingClientRect();
    let arcMetrics: ArcMetric[] = [];
    let caretTargetX = 0;
    let caretBaseY = 0;
    let caretHeight = CARET_MIN_HEIGHT_PX;
    let caretAnchorMetric: ArcMetric | undefined;

    const captureArcMetrics = () => {
      surfaceRect = surface.getBoundingClientRect();
      const overscan = surfaceRect.width * 0.7;
      const minX = surfaceRect.left - overscan;
      const maxX = surfaceRect.right + overscan;
      const nextMetrics: ArcMetric[] = [];
      const seen = new Set<HTMLElement>();
      const currentTrackX = trackXRef.current;

      const addMetric = (element: HTMLElement) => {
        if (seen.has(element)) return;
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        if (centerX < minX || centerX > maxX) return;
        seen.add(element);
        nextMetrics.push({ element, baseX: centerX - currentTrackX });
      };

      // Test mode words wrap all their glyphs. Check word bounds first and only
      // measure the letters belonging to words near the visible banner.
      const wordNodes = Array.from(surface.querySelectorAll<HTMLElement>(".typing-arc-word"));
      wordNodes.forEach((word) => {
        const rect = word.getBoundingClientRect();
        if (rect.right < minX || rect.left > maxX) return;
        word.querySelectorAll<HTMLElement>(".typing-arc-letter, .typing-arc-space").forEach(addMetric);
      });

      // Spaces between words and the trailing caret anchor are not always nested
      // inside a word wrapper (notably in free-typing mode).
      surface.querySelectorAll<HTMLElement>(".typing-arc-space").forEach((space) => {
        if (!space.closest(".typing-arc-word")) addMetric(space);
      });
      const liveAnchor = currentCharRef.current;
      if (liveAnchor) addMetric(liveAnchor);

      const nextSet = new Set(nextMetrics.map((metric) => metric.element));
      arcElementsRef.current.forEach((element) => {
        if (!nextSet.has(element)) {
          element.style.transform = "";
          element.style.transition = "";
        }
      });
      arcElementsRef.current = nextMetrics.map((metric) => metric.element);
      arcMetrics = nextMetrics;
      caretAnchorMetric = liveAnchor
        ? arcMetrics.find((metric) => metric.element === liveAnchor)
        : undefined;
    };

    const getArcGeometry = () => {
      const halfWidth = Math.max(surfaceRect.width / 2, 1);
      return {
        centerX: surfaceRect.left + halfWidth,
        halfWidth,
        arcDepth: Math.min(42, Math.max(20, surfaceRect.width * 0.026)),
      };
    };

    const arcOffsetForX = (x: number) => {
      const { centerX, halfWidth, arcDepth } = getArcGeometry();
      const normalized = Math.max(-1, Math.min(1, (x - centerX) / halfWidth));
      return arcDepth * normalized * normalized;
    };

    const updateArc = () => {
      const currentTrackX = trackXRef.current;
      const { centerX, halfWidth, arcDepth } = getArcGeometry();
      arcMetrics.forEach(({ element, baseX }) => {
        const normalized = Math.max(-1, Math.min(1, (baseX + currentTrackX - centerX) / halfWidth));
        const y = arcDepth * normalized * normalized;
        element.style.transition = "none";
        element.style.transformOrigin = "center center";
        element.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      });
    };

    const measureCaretTarget = (): boolean => {
      const liveAnchor = disabled ? null : currentCharRef.current;
      if (!liveAnchor) {
        caret.style.opacity = "0";
        return false;
      }

      const startRect = passageStart.getBoundingClientRect();
      const anchorRect = liveAnchor.getBoundingClientRect();
      const anchorStyles = window.getComputedStyle(liveAnchor);
      const fontSize = parseFloat(anchorStyles.fontSize) || 16;
      const parsedLineHeight = parseFloat(anchorStyles.lineHeight);
      const lineBoxHeight =
        anchorRect.height ||
        (Number.isFinite(parsedLineHeight) ? parsedLineHeight : 0) ||
        fontSize * 1.6;
      caretHeight = Math.max(CARET_MIN_HEIGHT_PX, fontSize * CARET_HEIGHT_EM);
      caretTargetX = anchorRect.left - startRect.left;

      const transformMatch = liveAnchor.style.transform.match(/translate3d\(0,\s*(-?[\d.]+)px,\s*0\)/u);
      const currentArcY = transformMatch ? Number(transformMatch[1]) : 0;
      caretBaseY =
        anchorRect.top - startRect.top - currentArcY +
        (lineBoxHeight - caretHeight) / 2;
      return true;
    };

    captureArcMetrics();
    updateArc();
    if (!measureCaretTarget()) return;

    const initialTransform = caret.style.transform.match(
      /translate\(\s*(-?[\d.]+)px(?:,\s*(-?[\d.]+)px)?\s*\)/u,
    );
    let caretX = initialTransform ? Number(initialTransform[1]) : 0;
    let caretY = initialTransform?.[2] ? Number(initialTransform[2]) : 0;
    caret.style.transition = "none";
    caret.style.opacity = "1";

    let arcFrame = 0;
    let previousTime = 0;
    let stableFrames = 0;
    const animationStart = performance.now();

    const followTrack = (now: number) => {
      const elapsed = previousTime === 0 ? 16 : Math.min(32, now - previousTime);
      previousTime = now;
      updateArc();

      const blend = 1 - Math.exp(-Math.max(0, elapsed) / 42);
      caretX += (caretTargetX - caretX) * blend;

      const liveAnchorX = caretAnchorMetric
        ? caretAnchorMetric.baseX + trackXRef.current
        : surfaceRect.left + surfaceRect.width / 2;
      const targetY = caretBaseY + (caretAnchorMetric ? arcOffsetForX(liveAnchorX) : 0);
      caretY += (targetY - caretY) * blend;

      caret.style.height = `${caretHeight}px`;
      caret.style.transform = `translate(${caretX}px, ${caretY}px)`;

      const remaining = Math.max(Math.abs(caretTargetX - caretX), Math.abs(targetY - caretY));
      const elapsedTotal = now - animationStart;
      stableFrames = remaining < 0.18 ? stableFrames + 1 : 0;
      if (elapsedTotal < 420 && (elapsedTotal < 260 || stableFrames < 4)) {
        arcFrame = requestAnimationFrame(followTrack);
      } else {
        caretX = caretTargetX;
        caretY = targetY;
        caret.style.transform = `translate(${caretX}px, ${caretY}px)`;
        updateArc();
        arcFrame = 0;
      }
    };

    arcFrame = requestAnimationFrame(followTrack);

    const refreshAfterResize = () => {
      captureArcMetrics();
      updateArc();
      if (measureCaretTarget()) {
        caretX = caretTargetX;
        caretY = caretBaseY + (caretAnchorMetric
          ? arcOffsetForX(caretAnchorMetric.baseX + trackXRef.current)
          : 0);
        caret.style.height = `${caretHeight}px`;
        caret.style.transform = `translate(${caretX}px, ${caretY}px)`;
      }
    };

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(refreshAfterResize)
      : undefined;
    resizeObserver?.observe(surface);
    window.addEventListener("resize", refreshAfterResize);
    return () => {
      cancelAnimationFrame(arcFrame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", refreshAfterResize);
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

  const changeSoundStyle = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = event.currentTarget.value as TypingSoundStyle;
    setTypingSoundStyle(next);
    setSoundStyleState(next);
    unlockTypingSounds();
    preloadTypingSounds();
    if (getSoundEnabled()) playTypingKeySound("correct");
    inputRef.current?.focus({ preventScroll: true });
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
        className="typing-arc-letter inline-block w-0 align-baseline"
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
          targetLetters.push(<span key={idx} className="typing-arc-letter typing-correct">{targetChar}</span>);
        } else {
          hasError = true;
          targetLetters.push(<span key={idx} className="typing-arc-letter text-red-500">{targetChar}</span>);
        }
      }

      const extraLetters: React.ReactNode[] = [];
      for (let idx = targetWord.length; idx < typedWord.length; idx += 1) {
        hasError = true;
        extraLetters.push(
          <span key={`extra-${idx}`} className="typing-arc-letter text-red-400">{typedWord[idx]}</span>,
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
        letters.push(<span key={idx} className="typing-arc-letter typing-correct">{targetChar}</span>);
      } else if (typedChar !== undefined) {
        hasError = true;
        letters.push(<span key={idx} className="typing-arc-letter text-red-500">{targetChar}</span>);
      } else if (kind === "completed") {
        hasError = true;
        letters.push(<span key={idx} className="typing-arc-letter text-red-500/50">{targetChar}</span>);
      } else {
        letters.push(<span key={idx} className="typing-arc-letter typing-pending">{targetChar}</span>);
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
                      <span key={`free-word-${index}`} className="typing-arc-word">
                        {Array.from(part).map((character, charIndex) => (
                          <span key={`free-glyph-${index}-${charIndex}`} className="typing-arc-letter">{character}</span>
                        ))}
                      </span>
                    )
                  ))}
                  {status !== "finished" && (
                    <span
                      ref={currentCharRef}
                      aria-hidden="true"
                      className="typing-arc-letter inline-block w-0 align-baseline"
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
      <div className={cn(
        focusMode ? "focus-sound-toggle flex items-center gap-2" : "mt-3 flex flex-wrap items-center justify-end gap-2",
      )}>
        <label className={cn(
          "inline-flex items-center rounded-full border px-3 py-2 font-label",
          soundEnabled ? "border-hairline bg-canvas-soft/90 text-ink" : "border-hairline bg-canvas-soft text-text-muted opacity-70",
        )}>
          <span className="sr-only">{locale === "es" ? "Estilo de sonido" : "Typing sound style"}</span>
          <select
            value={soundStyle}
            disabled={!soundEnabled}
            onChange={changeSoundStyle}
            aria-label={locale === "es" ? "Estilo de sonido" : "Typing sound style"}
            className="typing-sound-select max-w-[136px] cursor-pointer bg-transparent text-sm outline-none disabled:cursor-not-allowed"
          >
            <option value="mechanical">{locale === "es" ? "Teclado" : "Mechanical"}</option>
            <option value="soft">{locale === "es" ? "Suave" : "Soft"}</option>
            <option value="typewriter">{locale === "es" ? "Mecánica de escribir" : "Typewriter"}</option>
            <option value="retro">{locale === "es" ? "Retro" : "Retro"}</option>
          </select>
        </label>
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
