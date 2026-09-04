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

export default function TypingMotionSection({ locale = "en" }: TypingMotionSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const setEntryOrigins = () => {
      const viewportCenterX = window.innerWidth / 2;
      const viewportBottomY = window.innerHeight + 90;

      section.querySelectorAll<HTMLElement>(".typing-motion-float").forEach((key) => {
        const rect = key.getBoundingClientRect();
        const keyCenterX = rect.left + rect.width / 2;
        const keyCenterY = rect.top + rect.height / 2;

        key.style.setProperty("--entry-x", `${viewportCenterX - keyCenterX}px`);
        key.style.setProperty("--entry-y", `${viewportBottomY - keyCenterY}px`);
      });
    };

    setEntryOrigins();
    window.addEventListener("resize", setEntryOrigins, { passive: true });
    return () => window.removeEventListener("resize", setEntryOrigins);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const keys = Array.from(section.querySelectorAll<HTMLElement>(".typing-motion-float"));
    if (keys.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.dataset.motionState = "entered";
      return;
    }

    let hasEntered = false;

    const reveal = () => {
      if (hasEntered) return;
      hasEntered = true;
      section.dataset.motionState = "entering";

      requestAnimationFrame(() => {
        keys.forEach((key, index) => {
          key.style.transitionDelay = `${index * 85}ms`;
          key.style.transitionDuration = key.dataset.duration || "1.65s";
          key.style.setProperty("--entry-x", "0px");
          key.style.setProperty("--entry-y", "0px");
        });

        window.setTimeout(() => {
          section.dataset.motionState = "entered";
        }, 2100);
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
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
      data-motion-state="pre-enter"
      className="typing-motion-section relative overflow-hidden border-y border-hairline"
      aria-label={locale === "es" ? "Práctica de mecanografía" : "Typing practice showcase"}
    >
      <div className="typing-motion-grid" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[620px] max-w-[1500px] items-center justify-center px-5 py-24 sm:min-h-[700px] sm:px-8 lg:min-h-[760px] lg:px-12">
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

        {LETTERS.map((item) => (
          <div
            key={`${item.value}-${item.position}`}
            data-duration={item.duration}
            className={`typing-motion-float absolute ${item.position} ${item.size}`}
            style={{ ["--tile-rotation" as string]: item.rotate }}
            aria-hidden="true"
          >
            <div className="typing-motion-tile">
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

        .typing-motion-float {
          z-index: 2;
          pointer-events: none;
          transform: translate3d(var(--entry-x, 0px), var(--entry-y, 0px), 0);
          transition-property: transform;
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform;
        }

        /* The important part: before the first reveal, every key is physically positioned around the same bottom-center origin. */
        [data-motion-state="pre-enter"] .typing-motion-float {
          transform: translate3d(var(--entry-x, 0px), var(--entry-y, 0px), 0);
        }

        [data-motion-state="entering"] .typing-motion-float,
        [data-motion-state="entered"] .typing-motion-float {
          transform: translate3d(0, 0, 0);
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

        .typing-motion-section[data-motion-state="entered"] .typing-motion-tile {
          animation: typingMotionFloat 3.2s ease-in-out infinite;
          animation-delay: calc(var(--float-index, 0) * -180ms);
        }

        .typing-motion-float:nth-of-type(3) .typing-motion-tile { --float-index: 1; }
        .typing-motion-float:nth-of-type(4) .typing-motion-tile { --float-index: 2; }
        .typing-motion-float:nth-of-type(5) .typing-motion-tile { --float-index: 3; }
        .typing-motion-float:nth-of-type(6) .typing-motion-tile { --float-index: 4; }
        .typing-motion-float:nth-of-type(7) .typing-motion-tile { --float-index: 5; }
        .typing-motion-float:nth-of-type(8) .typing-motion-tile { --float-index: 6; }
        .typing-motion-float:nth-of-type(9) .typing-motion-tile { --float-index: 7; }
        .typing-motion-float:nth-of-type(10) .typing-motion-tile { --float-index: 8; }
        .typing-motion-float:nth-of-type(11) .typing-motion-tile { --float-index: 9; }
        .typing-motion-float:nth-of-type(12) .typing-motion-tile { --float-index: 10; }
        .typing-motion-float:nth-of-type(13) .typing-motion-tile { --float-index: 11; }

        .typing-motion-tile span {
          font-family: var(--font-mono);
          font-size: clamp(1.6rem, 3vw, 2.35rem);
          font-weight: 700;
          color: var(--color-ink);
          line-height: 1;
          text-shadow: 0 0 28px color-mix(in srgb, var(--color-accent) 8%, transparent);
        }

        @keyframes typingMotionFloat {
          0%, 100% { transform: rotate(var(--tile-rotation)) translate3d(0, 0, 0); }
          50% { transform: rotate(var(--tile-rotation)) translate3d(7px, -15px, 0); }
        }

        @media (max-width: 700px) {
          .typing-motion-section .relative.mx-auto {
            min-height: 560px;
            padding-block: 88px;
          }
          .typing-motion-float:nth-of-type(3),
          .typing-motion-float:nth-of-type(7),
          .typing-motion-float:nth-of-type(10),
          .typing-motion-float:nth-of-type(11),
          .typing-motion-float:nth-of-type(12) {
            display: none;
          }
          .typing-motion-tile { border-radius: 18px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .typing-motion-float {
            transition: none;
            transform: translate3d(0, 0, 0);
          }
          .typing-motion-tile {
            animation: none !important;
            transform: rotate(var(--tile-rotation));
          }
        }
      `}</style>
    </section>
  );
}
