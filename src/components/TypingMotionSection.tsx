import { useEffect, useRef } from "react";

interface TypingMotionSectionProps {
  locale?: "en" | "es";
}

// Mobbin-style icon-grid reveal: every tile rests at its own anchored spot
// (no travel from a center point, no spin) and simply fades in while
// scaling up from slightly smaller, resolving from a soft blur to sharp.
// The staggered --reveal-delay per tile is what creates the wave-like,
// premium-feeling choreography -- the same restrained motion Mobbin uses
// when its app-icon grids resolve in on scroll.
const LETTERS = [
  { value: "A", position: "top-[8%] left-[10%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotateDeg: -8, floatDelay: "-1.2s", floatDuration: "2.7s", revealDelay: 0 },
  { value: "S", position: "top-[18%] left-[29%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotateDeg: 6, floatDelay: "-4s", floatDuration: "3.0s", revealDelay: 0.06 },
  { value: "D", position: "top-[6%] right-[28%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotateDeg: -5, floatDelay: "-7s", floatDuration: "3.3s", revealDelay: 0.12 },
  { value: "F", position: "top-[15%] right-[8%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotateDeg: 9, floatDelay: "-2.4s", floatDuration: "2.8s", revealDelay: 0.18 },
  { value: "J", position: "top-[43%] left-[3%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotateDeg: 7, floatDelay: "-6.2s", floatDuration: "3.5s", revealDelay: 0.24 },
  { value: "K", position: "top-[46%] right-[3%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotateDeg: -7, floatDelay: "-3.1s", floatDuration: "3.1s", revealDelay: 0.3 },
  { value: "L", position: "bottom-[12%] left-[11%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotateDeg: -10, floatDelay: "-5.7s", floatDuration: "3.2s", revealDelay: 0.36 },
  { value: ";", position: "bottom-[8%] right-[12%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotateDeg: 8, floatDelay: "-8s", floatDuration: "2.9s", revealDelay: 0.42 },
  { value: "Q", position: "bottom-[20%] left-[29%]", size: "h-14 w-14 sm:h-16 sm:w-16", rotateDeg: 5, floatDelay: "-2.8s", floatDuration: "2.8s", revealDelay: 0.48 },
  { value: "P", position: "bottom-[21%] right-[29%]", size: "h-14 w-14 sm:h-16 sm:w-16", rotateDeg: -6, floatDelay: "-6.5s", floatDuration: "3.4s", revealDelay: 0.54 },
  { value: "1", position: "top-[61%] left-[17%]", size: "h-12 w-12 sm:h-14 sm:w-14", rotateDeg: -4, floatDelay: "-1.8s", floatDuration: "2.6s", revealDelay: 0.6 },
  { value: "0", position: "top-[65%] right-[17%]", size: "h-12 w-12 sm:h-14 sm:w-14", rotateDeg: 6, floatDelay: "-4.9s", floatDuration: "3.1s", revealDelay: 0.66 },
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
        title: "ESCRIBE.\nPONTE A PRUEBA.",
        subtitle: "La velocidad empieza practicando.",
        accuracy: "100% PRECISIÓN",
      }
    : {
        eyebrow: "TYPING PRACTICE",
        title: "TYPE IT.\nTEST IT.",
        subtitle: "Speed starts with practice.",
        accuracy: "100% ACCURACY",
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
            <span className="typing-motion-pill font-caption">{content.accuracy}</span>
            <span className="typing-motion-pill font-caption">1–5 MIN</span>
          </div>
        </div>

        {LETTERS.map((item) => (
          <div
            key={`${item.value}-${item.position}`}
            className={`typing-motion-float absolute ${item.position} ${item.size}`}
            style={{
              ["--tile-rotation" as string]: `${item.rotateDeg}deg`,
              ["--reveal-delay" as string]: `${item.revealDelay}s`,
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

        /* Mobbin-style icon-grid reveal: each tile rests at its final anchor
           and just fades in, scaling up from slightly smaller with a soft
           blur-to-sharp resolve -- no travel, no spin, no burst. Staggering
           --reveal-delay tile-by-tile is what makes it read as premium. */
        .typing-motion-float {
          z-index: 2;
          pointer-events: none;
          opacity: 0;
          transform: scale(0.82) translate3d(0, 14px, 0);
          filter: blur(6px);
          will-change: transform, opacity, filter;
        }

        [data-motion-defer="active"] .typing-motion-float {
          animation: tileReveal 0.72s cubic-bezier(0.16, 1, 0.3, 1) var(--reveal-delay, 0s) both;
        }

        .typing-motion-tile {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          border: 1px solid color-mix(in srgb, var(--color-ink) 14%, transparent);
          border-radius: 24px;
          background: linear-gradient(160deg, color-mix(in srgb, var(--color-canvas-soft) 92%, transparent), color-mix(in srgb, var(--color-accent) 6%, transparent) 120%);
          box-shadow:
            0 30px 54px -28px color-mix(in srgb, var(--color-ink) 45%, transparent),
            0 8px 18px -10px color-mix(in srgb, var(--color-accent) 22%, transparent),
            inset 0 1px 0 color-mix(in srgb, white 22%, transparent),
            inset 0 -1px 0 color-mix(in srgb, var(--color-ink) 8%, transparent);
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

        /* Fade + scale-up + blur-to-sharp settle, in place. */
        @keyframes tileReveal {
          0% { opacity: 0; transform: scale(0.82) translate3d(0, 14px, 0); filter: blur(6px); }
          60% { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: scale(1) translate3d(0, 0, 0); filter: blur(0); }
        }

        @keyframes typingMotionFloat {
          0%, 100% { transform: rotate(var(--tile-rotation)) translate3d(0, 0, 0) scale(1); }
          50% { transform: rotate(var(--tile-rotation)) translate3d(12px, -22px, 0) scale(1.03); }
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
            transform: scale(1) translate3d(0, 0, 0);
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
