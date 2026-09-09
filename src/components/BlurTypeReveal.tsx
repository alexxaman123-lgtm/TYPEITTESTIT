import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../utils/cn";

type SplitMode = "char" | "word";

interface Props {
  /** The sentence to reveal. Use "\n" to force a line break. */
  text: string;
  /** Element to render. Defaults to a span so it can be dropped anywhere. */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  /** Reveal letter by letter (typing feel) or word by word (calmer). */
  by?: SplitMode;
  /** Milliseconds between units. Defaults per mode. */
  stagger?: number;
  /** Delay before the first unit, in ms. */
  delay?: number;
  /** Show the trailing blinking bar while the line resolves. */
  caret?: boolean;
  id?: string;
}

/** Per-unit gap. Characters need to be quick or long headlines drag. */
const DEFAULT_STAGGER: Record<SplitMode, number> = { char: 26, word: 55 };
/** Must match the blurTypeIn duration in index.css. */
const UNIT_DURATION_MS = 620;
const LINE_BREAK = "\n";

function splitText(text: string, by: SplitMode): string[] {
  const units: string[] = [];
  text.split(LINE_BREAK).forEach((line, lineIndex) => {
    if (lineIndex > 0) units.push(LINE_BREAK);
    if (by === "word") {
      // Keep the whitespace runs as their own units so spacing is preserved.
      line.split(/(\s+)/).forEach((token) => {
        if (token.length > 0) units.push(token);
      });
    } else {
      Array.from(line).forEach((char) => units.push(char));
    }
  });
  return units;
}

/**
 * Scroll-triggered "blurred text types itself into focus" reveal.
 *
 * Each character (or word) animates from blurred + transparent to sharp, in
 * sequence, so the sentence resolves left to right like it is being typed.
 * The animation is pure CSS (see .blur-type in index.css); this component only
 * splits the text and flips a class when the element scrolls into view.
 */
export default function BlurTypeReveal({
  text,
  as = "span",
  className,
  by = "char",
  stagger,
  delay = 0,
  caret = true,
  id,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);

  const step = stagger ?? DEFAULT_STAGGER[by];
  const units = useMemo(() => splitText(text, by), [text, by]);
  const totalMs = delay + units.length * step + UNIT_DURATION_MS;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // No motion, or no observer support: show the finished state immediately.
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      setPlaying(true);
      setDone(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setPlaying(true);
          observer.disconnect();
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Drop the trailing caret once the last unit has resolved.
  useEffect(() => {
    if (!playing || done) return;
    const timeoutId = window.setTimeout(() => setDone(true), totalMs);
    return () => window.clearTimeout(timeoutId);
  }, [playing, done, totalMs]);

  return createElement(
    as,
    {
      ref,
      id,
      // Screen readers get the whole sentence; the split spans are decorative.
      "aria-label": text,
      className: cn("blur-type", playing && "blur-type-playing", className),
    },
    <span aria-hidden="true">
      {units.map((unit, index) =>
        unit === LINE_BREAK ? (
          <br key={`br-${index}`} />
        ) : (
          <span
            key={`u-${index}`}
            className="blur-type-unit"
            style={{ animationDelay: `${delay + index * step}ms` }}
          >
            {unit}
          </span>
        ),
      )}
      {caret && !done && <span className="blur-type-caret caret-blink" />}
    </span>,
  );
}
