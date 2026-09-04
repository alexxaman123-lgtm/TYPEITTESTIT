import { useEffect, useLayoutEffect, useRef } from "react";

interface TypingMotionSectionProps {
  locale?: "en" | "es";
}

const LETTERS = [
  { value: "A", position: "top-[8%] left-[10%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotate: "-8deg", duration: "1.55s" },
  { value: "S", position: "top-[18%] left-[29%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotate: "6deg", duration: "1.72s" },
  { value: "D", position: "top-[6%] right-[28%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotate: "-5deg", duration: "1.62s" },
  { value: "F", position: "top-[15%] right-[8%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotate: "9deg", duration: "1.68s" },
  { value: "J", position: "top-[43%] left-[3%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotate: "7deg", duration: "1.78s" },
  { value: "K", position: "top-[46%] right-[3%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotate: "-7deg", duration: "1.64s" },
  { value: "L", position: "bottom-[12%] left-[11%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotate: "-10deg", duration: "1.82s" },
  { value: ";", position: "bottom-[8%] right-[12%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotate: "8deg", duration: "1.58s" },
  { value: "Q", position: "bottom-[20%] left-[29%]", size: "h-14 w-14 sm:h-16 sm:w-16", rotate: "5deg", duration: "1.74s" },
  { value: "P", position: "bottom-[21%] right-[29%]", size: "h-14 w-14 sm:h-16 sm:w-16", rotate: "-6deg", duration: "1.70s" },
  { value: "1", position: "top-[61%] left-[17%]", size: "h-12 w-12 sm:h-14 sm:w-14", rotate: "-4deg", duration: "1.60s" },
  { value: "0", position: "top-[65%] right-[17%]", size: "h-12 w-12 sm:h-14 sm:w-14", rotate: "6deg", duration: "1.66s" },
] as const;

const ENTRY_DURATION = 2400;
const ENTRY_STAGGER = 100;
const ENTRY_FINISH = ENTRY_DURATION + ENTRY_STAGGER * (LETTERS.length - 1);

export default function TypingMotionSection({ locale = "en" }: TypingMotionSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const hasTriggeredRef = useRef(false);
  const settleTimerRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const section = sectionRef.current;
    if (!stage || !section) return;

    const keys = Array.from(stage.querySelectorAll<HTMLElement>(".typing-motion-float"));
    if (keys.length === 0) return;

    const positionKeysAtViewportCenter = () => {
      const stageRect = stage.getBoundingClientRect();
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      const sourceX = viewportCenterX - stageRect.left;
      const sourceY = viewportCenterY - stageRect.top;

      keys.forEach((key) => {
        const targetX = key.offsetLeft + key.offsetWidth / 2;
        const targetY = key.offsetTop + key.offsetHeight / 2;
        key.style.setProperty("--entry-x", `${sourceX - targetX}px`);
        key.style.setProperty("--entry-y", `${sourceY - targetY}px`);
      });
    };

    // Critical: establish the center-origin state BEFORE enabling any CSS
    // transition. Otherwise the browser can animate to the center during page
    // load, making the effect appear to be missing when the user scrolls.
    section.dataset.entryReady = "false";
    positionKeysAtViewportCenter();

    requestAnimationFrame(() => {
      positionKeysAtViewportCenter();
      section.dataset.entryReady = "true";
    });

    window.addEventListener("resize", positionKeysAtViewportCenter, { passive: true });
    return () => window.removeEventListener("resize", positionKeysAtViewportCenter);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.dataset.motion = "settled";
      return;
    }

    const trigger = () => {
      if (hasTriggeredRef.current || section.dataset.entryReady !== "true") return;
      hasTriggeredRef.current = true;

      // One forced layout guarantees the waiting/center state is painted before
      // the class switch below starts the actual center -> final-position move.
      section.getBoundingClientRect();
      requestAnimationFrame(() => {
        section.dataset.motion = "entering";
        settleTimerRef.current = window.setTimeout(() => {
          section.dataset.motion = "settled";
        }, ENTRY_FINISH + 120);
      });
    };

    const checkScroll = () => {
      if (hasTriggeredRef.current) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(vh, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibleRatio = visibleHeight / Math.max(rect.height, 1);

      // Trigger when the section is effectively filling the viewport. We do not
      // call this check on mount, so simply loading the page cannot consume the
      // one-time entrance animation.
      const nearViewportCenter = Math.abs((rect.top + rect.height / 2) - vh / 2) <= vh * 0.22;
      const dominantScene = visibleRatio >= 0.72;

      if (nearViewportCenter && dominantScene) trigger();
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(checkScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (settleTimerRef.current !== null) window.clearTimeout(settleTimerRef.current);
    };
  }, []);

  const content = locale === "es"
    ? {
        eyebrow: "PRÁCTICA DE MECANOGRAFÍA",
        title: "TYPE IT.\nTEST IT.",
        subtitle: "La velocidad empieza practicando.",
      }
    : {
        eyebrow: "TYPING PRACTICE",
        title: "TYPE IT.\nTEST IT.",
        subtitle: "Speed starts with practice.",
      };

  return (
    <section
      ref={sectionRef}
      data-motion="waiting"
      data-entry-ready="false"
      className="typing-motion-section relative overflow-hidden border-y border-hairline"
      aria-label={locale === "es" ? "Práctica de mecanografía" : "Typing practice showcase"}
    >
      <div className="typing-motion-grid" aria-hidden="true" />

      <div
        ref={stageRef}
        className="relative mx-auto flex min-h-[620px] max-w-[1500px] items-center justify-center px-5 py-24 sm:min-h-[700px] sm:px-8 lg:min-h-[760px] lg:px-12"
      >
        <div className="typing-motion-copy relative z-10 text-center">
          <p className="font-label tracking-[0.16em] text-accent">{content.eyebrow}</p>
          <h2 className="mt-5 whitespace-pre-line font-heading-1 text-ink sm:text-[64px] sm:leading-[0.94] lg:text-[92px]">{content.title}</h2>
          <p className="mt-7 font-body-lg text-text-muted">{content.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="typing-motion-pill font-caption">WPM</span>
            <span className="typing-motion-pill font-caption">100% ACCURACY</span>
            <span className="typing-motion-pill font-caption">1–5 MIN</span>
          </div>
        </div>

        {LETTERS.map((item, index) => (
          <div
            key={`${item.value}-${item.position}`}
            data-letter-index={index}
            className={`typing-motion-float absolute ${item.position} ${item.size}`}
            aria-hidden="true"
          >
            <div
              className="typing-motion-tile"
              style={{
                ["--tile-rotation" as string]: item.rotate,
                ["--float-duration" as string]: item.duration,
                ["--float-delay" as string]: `${-index * 150}ms`,
              }}
            >
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .typing-motion-section {
          background: var(--color-canvas);
          color: var(--color-ink);
          isolation: isolate;
        }

        .typing-motion-grid {
          position: absolute;
          inset: 0;
          opacity: .18;
          background-image:
            linear-gradient(to right, color-mix(in srgb, var(--color-ink) 6%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 6%, transparent) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: radial-gradient(circle at center, black 0%, black 45%, transparent 82%);
          -webkit-mask-image: radial-gradient(circle at center, black 0%, black 45%, transparent 82%);
        }

        .typing-motion-copy {
          width: min(760px, 82vw);
        }

        .typing-motion-pill {
          display: inline-flex;
          min-height: 34px;
          align-items: center;
          justify-content: center;
          padding: .5rem .8rem;
          border: 1px solid color-mix(in srgb, var(--color-ink) 11%, transparent);
          border-radius: 999px;
          background: color-mix(in srgb, var(--color-canvas-soft) 72%, transparent);
          color: var(--color-text-muted);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* WAITING: all keys are stacked at the exact browser viewport center.
           Entry is a SCALE + TRANSLATE transition, not a position jump. */
        .typing-motion-float {
          z-index: 2;
          pointer-events: none;
          transform: translate3d(var(--entry-x, 0px), var(--entry-y, 0px), 0) scale(.5);
          transform-origin: 50% 50%;
          opacity: .9;
          will-change: transform, opacity;
        }

        /* Keep the center-origin state frozen until the user actually scrolls
           the section into the main viewport. */
        .typing-motion-section[data-entry-ready="true"] .typing-motion-float {
          transition:
            transform ${ENTRY_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 850ms ease;
          transition-delay: 0ms;
        }

        /* The FIRST scroll release: all keys leave the single center point and
           travel slowly to their unique absolute-positioned destinations. */
        .typing-motion-section[data-motion="entering"] .typing-motion-float,
        .typing-motion-section[data-motion="settled"] .typing-motion-float {
          transform: translate3d(0, 0, 0) scale(1);
          opacity: 1;
        }

        .typing-motion-tile {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          border: 1px solid color-mix(in srgb, var(--color-ink) 14%, transparent);
          border-radius: 24px;
          background: color-mix(in srgb, var(--color-canvas-soft) 88%, transparent);
          box-shadow:
            0 24px 44px -30px color-mix(in srgb, var(--color-ink) 40%, transparent),
            inset 0 1px 0 color-mix(in srgb, var(--color-ink) 8%, transparent);
          backdrop-filter: blur(9px);
          -webkit-backdrop-filter: blur(9px);
          transform: rotate(var(--tile-rotation));
        }

        /* Continuous motion is isolated on the INNER tile, so it cannot fight
           the outer center-to-destination entrance transform. */
        .typing-motion-section[data-motion="settled"] .typing-motion-tile {
          animation: typingMotionFloat var(--float-duration) ease-in-out infinite;
          animation-delay: var(--float-delay, 0ms);
        }

        @keyframes typingMotionFloat {
          0%, 100% { transform: rotate(var(--tile-rotation)) translate3d(0, 0, 0); }
          50% { transform: rotate(var(--tile-rotation)) translate3d(7px, -15px, 0); }
        }

        .typing-motion-tile span {
          font-family: var(--font-mono);
          font-size: clamp(1.6rem, 3vw, 2.35rem);
          font-weight: 700;
          color: var(--color-ink);
          line-height: 1;
          text-shadow: 0 0 28px color-mix(in srgb, var(--color-accent) 8%, transparent);
        }

        @media (max-width: 700px) {
          .typing-motion-section .relative.mx-auto {
            min-height: 560px;
            padding-block: 88px;
          }

          .typing-motion-float[data-letter-index="2"],
          .typing-motion-float[data-letter-index="6"],
          .typing-motion-float[data-letter-index="9"],
          .typing-motion-float[data-letter-index="10"],
          .typing-motion-float[data-letter-index="11"] {
            display: none;
          }

          .typing-motion-tile { border-radius: 18px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .typing-motion-float,
          .typing-motion-section[data-entry-ready="true"] .typing-motion-float {
            transition: none;
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }

          .typing-motion-section[data-motion="settled"] .typing-motion-tile {
            animation: none !important;
            transform: rotate(var(--tile-rotation));
          }
        }
      `}</style>
    </section>
  );
}
