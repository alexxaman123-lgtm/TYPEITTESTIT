import { useEffect, useRef } from "react";

interface TypingMotionSectionProps {
  locale?: "en" | "es";
}

// emergeX / emergeY are the offset (in cqw / cqh) from each letter's anchor
// to the section's center. The Mobbin-style burst starts every tile stacked
// at the center and springs them out to these anchor points.
const LETTERS = [
  { value: "A", position: "top-[8%] left-[10%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotate: "-8deg", floatDelay: "-1.2s", floatDuration: "5.3s", emergeX: 40, emergeY: 42, emergeDelay: 0.05 },
  { value: "S", position: "top-[18%] left-[29%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotate: "6deg", floatDelay: "-4s", floatDuration: "5.9s", emergeX: 21, emergeY: 32, emergeDelay: 0.12 },
  { value: "D", position: "top-[6%] right-[28%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotate: "-5deg", floatDelay: "-7s", floatDuration: "6.6s", emergeX: -22, emergeY: 44, emergeDelay: 0.19 },
  { value: "F", position: "top-[15%] right-[8%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotate: "9deg", floatDelay: "-2.4s", floatDuration: "5.6s", emergeX: -42, emergeY: 35, emergeDelay: 0.26 },
  { value: "J", position: "top-[43%] left-[3%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotate: "7deg", floatDelay: "-6.2s", floatDuration: "6.9s", emergeX: 47, emergeY: 7, emergeDelay: 0.33 },
  { value: "K", position: "top-[46%] right-[3%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotate: "-7deg", floatDelay: "-3.1s", floatDuration: "6.1s", emergeX: -47, emergeY: 4, emergeDelay: 0.4 },
  { value: "L", position: "bottom-[12%] left-[11%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotate: "-10deg", floatDelay: "-5.7s", floatDuration: "6.4s", emergeX: 39, emergeY: -38, emergeDelay: 0.47 },
  { value: ";", position: "bottom-[8%] right-[12%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotate: "8deg", floatDelay: "-8s", floatDuration: "5.8s", emergeX: -38, emergeY: -42, emergeDelay: 0.54 },
  { value: "Q", position: "bottom-[20%] left-[29%]", size: "h-14 w-14 sm:h-16 sm:w-16", rotate: "5deg", floatDelay: "-2.8s", floatDuration: "5.5s", emergeX: 21, emergeY: -30, emergeDelay: 0.61 },
  { value: "P", position: "bottom-[21%] right-[29%]", size: "h-14 w-14 sm:h-16 sm:w-16", rotate: "-6deg", floatDelay: "-6.5s", floatDuration: "6.8s", emergeX: -21, emergeY: -29, emergeDelay: 0.68 },
  { value: "1", position: "top-[61%] left-[17%]", size: "h-12 w-12 sm:h-14 sm:w-14", rotate: "-4deg", floatDelay: "-1.8s", floatDuration: "5.1s", emergeX: 33, emergeY: -11, emergeDelay: 0.75 },
  { value: "0", position: "top-[65%] right-[17%]", size: "h-12 w-12 sm:h-14 sm:w-14", rotate: "6deg", floatDelay: "-4.9s", floatDuration: "6.1s", emergeX: -33, emergeY: -15, emergeDelay: 0.82 },
] as const;

export default function TypingMotionSection({ locale = "en" }: TypingMotionSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.dataset.motionDefer = "active";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        section.dataset.motionDefer = "active";
        observer.disconnect();
      },
      { threshold: 0.12 }
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
    <section ref={sectionRef} data-motion-defer className="typing-motion-section relative overflow-hidden border-y border-hairline" aria-label={locale === "es" ? "Práctica de mecanografía" : "Typing practice showcase"}>
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
            className={`typing-motion-float absolute ${item.position} ${item.size}`}
            style={{
              ["--tile-rotation" as string]: item.rotate,
              ["--emerge-x" as string]: `${item.emergeX}cqw`,
              ["--emerge-y" as string]: `${item.emergeY}cqh`,
              ["--emerge-delay" as string]: `${item.emergeDelay}s`,
              ["--float-duration" as string]: item.floatDuration,
              ["--float-delay" as string]: item.floatDelay,
            }}
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
          content-visibility: auto;
          contain-intrinsic-size: 700px;
          /* Container query units make the emerge offset
             proportional to the section, so the burst stays
             centered on any viewport size. */
          container-type: inline-size;
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

        /* Mobbin-style: each tile starts stacked at the section's center,
           then springs out to its final anchor with a slight overshoot.
           Staggered delays (via --emerge-delay) create the wave-like
           choreography. */
        .typing-motion-float {
          z-index: 2;
          pointer-events: none;
          opacity: 0;
          transform: translate(var(--emerge-x, 0cqw), var(--emerge-y, 0cqh)) scale(0.2);
          filter: blur(6px);
          will-change: transform, opacity, filter;
        }

        /* When the section scrolls into view, run the emerge burst. */
        [data-motion-defer="active"] .typing-motion-float {
          animation:
            emergeFromCenter 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) var(--emerge-delay, 0s) both;
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
          animation: typingMotionFloat var(--float-duration) ease-in-out infinite;
          animation-delay: var(--float-delay);
          will-change: transform;
        }

        .typing-motion-tile span {
          font-family: var(--font-mono);
          font-size: clamp(1.6rem, 3vw, 2.35rem);
          font-weight: 700;
          color: var(--color-ink);
          line-height: 1;
          text-shadow: 0 0 28px color-mix(in srgb, var(--color-accent) 8%, transparent);
        }

        /* The Mobbin-style emerge: each tile starts stacked at the
           section's center, then springs out to its anchor point
           with a slight overshoot. Container query units keep the
           burst centered on any screen size. */
        @keyframes emergeFromCenter {
          0% {
            transform: translate(var(--emerge-x, 0cqw), var(--emerge-y, 0cqh)) scale(0.2);
            opacity: 0;
            filter: blur(6px);
          }
          55% {
            opacity: 1;
            filter: blur(0);
          }
          75% {
            transform: translate(calc(var(--emerge-x, 0cqw) * 0.12), calc(var(--emerge-y, 0cqh) * 0.12)) scale(1.08);
            opacity: 1;
            filter: blur(0);
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
            filter: blur(0);
          }
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
            animation: none;
            opacity: 1;
            transform: translate(0, 0) scale(1);
            filter: none;
          }
          .typing-motion-tile {
            animation: none;
            transform: rotate(var(--tile-rotation));
          }
        }
      `}</style>
    </section>
  );
}
