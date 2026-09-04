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

const ENTRY_DURATION = 1800;
const ENTRY_STAGGER = 70;
const ENTRY_STAGGER_TOTAL = ENTRY_STAGGER * (LETTERS.length - 1);
const SETTLE_DELAY = 100;

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
      const sourceXInStage = viewportCenterX - stageRect.left;
      const sourceYInStage = viewportCenterY - stageRect.top;

      stage.querySelectorAll<HTMLElement>(".typing-motion-float").forEach((key) => {
        // Absolute positioning defines the destination. We calculate the
        // translation required to move each key's CENTER to the viewport CENTER.
        const targetCenterX = key.offsetLeft + key.offsetWidth / 2;
        const targetCenterY = key.offsetTop + key.offsetHeight / 2;

        key.style.setProperty("--entry-x", `${sourceXInStage - targetCenterX}px`);
        key.style.setProperty("--entry-y", `${sourceYInStage - targetCenterY}px`);
      });
    };

    // Run after all layout styles have resolved, then keep the origin correct
    // across viewport changes.
    requestAnimationFrame(updateOrigins);
    window.addEventListener("resize", updateOrigins, { passive: true });

    return () => window.removeEventListener("resize", updateOrigins);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.classList.add("is-entered", "is-settled");
      return;
    }

    const triggerEntry = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;

      // Force the browser to commit the center-origin state first. This makes
      // the following class change a real transition instead of a first-paint
      // jump directly to the final positions.
      section.getBoundingClientRect();
      requestAnimationFrame(() => {
        section.classList.add("is-entered");

        settleTimerRef.current = window.setTimeout(() => {
          section.classList.add("is-settled");
        }, ENTRY_DURATION + ENTRY_STAGGER_TOTAL + SETTLE_DELAY);
      });
    };

    const checkPosition = () => {
      if (hasTriggeredRef.current) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Trigger only when the section itself is the main thing on screen:
      // enough of its height is visible and its center is close to the viewport
      // center. This prevents the animation from firing while merely approaching
      // the section.
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, viewportHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibilityRatio = visibleHeight / Math.max(rect.height, 1);
      const centerDistance = Math.abs((rect.top + rect.height / 2) - viewportHeight / 2);

      if (visibilityRatio >= 0.78 && centerDistance <= viewportHeight * 0.18) {
        triggerEntry();
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        checkPosition();
      });
    };

    checkPosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", checkPosition, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", checkPosition);
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
      }
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

        /* BEFORE FIRST SCROLL REVEAL:
           every key is stacked around one common point - the exact browser
           viewport center. opacity + scale make the cluster feel like it is
           only partially emerging from that point. */
        .typing-motion-float {
          z-index: 2;
          pointer-events: none;
          transform: translate3d(var(--entry-x, 0px), var(--entry-y, 0px), 0) scale(.52);
          transform-origin: 50% 50%;
          opacity: .28;
          transition:
            transform ${ENTRY_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 720ms ease;
          transition-delay: calc(var(--entry-order, 0) * ${ENTRY_STAGGER}ms), calc(var(--entry-order, 0) * ${ENTRY_STAGGER}ms);
          will-change: transform, opacity;
        }

        /* After the section becomes the main viewport focus, all keys slowly
           distribute outward to their final positions. */
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

        /* Floating motion is deliberately isolated on the INNER tile. It only
           starts after every outer entry transform has reached its destination. */
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

          /* Keep the mobile composition light, but select the intended keys by
             explicit index rather than fragile nth-of-type selectors. */
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
