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

const ENTRY_DURATION = 2200;
const SETTLE_BUFFER = 120;

export default function TypingMotionSection({ locale = "en" }: TypingMotionSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const hasTriggeredRef = useRef(false);
  const settleTimerRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateOrigins = () => {
      const stageRect = stage.getBoundingClientRect();
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;

      stage.querySelectorAll<HTMLElement>(".typing-motion-float").forEach((key) => {
        const sourceX = viewportCenterX - stageRect.left;
        const sourceY = viewportCenterY - stageRect.top;
        const targetCenterX = key.offsetLeft + key.offsetWidth / 2;
        const targetCenterY = key.offsetTop + key.offsetHeight / 2;

        key.style.setProperty("--entry-x", `${sourceX - targetCenterX}px`);
        key.style.setProperty("--entry-y", `${sourceY - targetCenterY}px`);
      });
    };

    // Wait one frame so Tailwind's absolute-positioning classes have resolved.
    requestAnimationFrame(updateOrigins);
    window.addEventListener("resize", updateOrigins, { passive: true });
    return () => window.removeEventListener("resize", updateOrigins);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      section.classList.add("is-entered", "is-settled");
      return;
    }

    const checkAndTrigger = () => {
      if (hasTriggeredRef.current) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = vh / 2;

      // Fire when the letter section is the dominant viewport panel and its
      // center is aligned with the viewport center. This is much more reliable
      // than IntersectionObserver for the requested full-screen scroll moment.
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(vh, rect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibleRatio = visibleHeight / Math.max(rect.height, 1);
      const centerAligned = Math.abs(sectionCenter - viewportCenter) <= vh * 0.16;
      const dominant = visibleRatio >= 0.62;

      if (!dominant || !centerAligned) return;

      hasTriggeredRef.current = true;

      // Ensure the browser has painted the exact center-origin state before the
      // class switch, so the entrance is visibly animated instead of skipped.
      section.getBoundingClientRect();
      requestAnimationFrame(() => {
        section.classList.add("is-entered");

        settleTimerRef.current = window.setTimeout(() => {
          section.classList.add("is-settled");
        }, ENTRY_DURATION + SETTLE_BUFFER);
      });
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(checkAndTrigger);
    };

    checkAndTrigger();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", checkAndTrigger, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", checkAndTrigger);
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
                ["--float-delay" as string]: `${-index * 140}ms`,
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

        /* Initial state: every key is located around ONE common source point —
           the exact browser viewport center — not near its final position. */
        .typing-motion-float {
          z-index: 2;
          pointer-events: none;
          transform: translate3d(var(--entry-x, 0px), var(--entry-y, 0px), 0) scale(.72);
          transform-origin: 50% 50%;
          opacity: .72;
          transition:
            transform ${ENTRY_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 900ms ease;
          transition-delay: 0ms, 0ms;
          will-change: transform, opacity;
        }

        /* When the section becomes the main viewport panel, the complete group
           expands from that center point into the final key positions. */
        .typing-motion-section.is-entered .typing-motion-float {
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

        /* Floating starts only after the entrance finishes. The transforms are
           isolated: outer element = entrance, inner tile = perpetual float. */
        .typing-motion-section.is-settled .typing-motion-tile {
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
          .typing-motion-float {
            transition: none;
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
          .typing-motion-section.is-settled .typing-motion-tile {
            animation: none !important;
            transform: rotate(var(--tile-rotation));
          }
        }
      `}</style>
    </section>
  );
}
