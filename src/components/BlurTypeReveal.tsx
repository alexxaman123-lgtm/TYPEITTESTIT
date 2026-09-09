import { createElement, useMemo, type CSSProperties } from "react";
import { cn } from "../utils/cn";

type SplitMode = "char" | "word";

interface Props {
  /** The sentence to reveal. Use "\n" to force a line break. */
  text: string;
  /** Element to render. Defaults to a span so it can be dropped anywhere. */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  /** Optional inline style passthrough (e.g. a locale-specific font-size clamp). */
  style?: CSSProperties;
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
 * This component carries no observer or state of its own -- it marks itself
 * data-reveal="blur-type" and lets the single shared scroll-reveal engine in
 * App.tsx flip on .reveal-visible, exactly like every other animated element
 * on the site. CSS (index.css) does the rest. Because it is just a text-in,
 * config-out component with no page-specific wiring, dropping it into any
 * locale's copy (English, Spanish, or a future language) behaves identically
 * with zero extra setup.
 */
export default function BlurTypeReveal({
  text,
  as = "span",
  className,
  style,
  by = "char",
  stagger,
  delay = 0,
  caret = true,
  id,
}: Props) {
  const step = stagger ?? DEFAULT_STAGGER[by];
  const units = useMemo(() => splitText(text, by), [text, by]);
  const totalMs = delay + units.length * step + UNIT_DURATION_MS;

  return createElement(
    as,
    {
      id,
      // Screen readers get the whole sentence; the split spans are decorative.
      "aria-label": text,
      // Hooks into the shared reveal engine -- see REVEAL_SELECTOR in App.tsx.
      "data-reveal": "blur-type",
      className: cn("blur-type", className),
      style,
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
      {/* Visible only for the sentence's typing-in window -- see the
          blurTypeCaretLife keyframes in index.css, driven by this duration. */}
      {caret && (
        <span
          className="blur-type-caret"
          style={{ "--caret-life-ms": `${totalMs}ms` } as CSSProperties}
        />
      )}
    </span>,
  );
}
