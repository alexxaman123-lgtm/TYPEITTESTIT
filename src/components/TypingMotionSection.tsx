import { useEffect, useRef } from "react";

interface TypingMotionSectionProps {
  locale?: "en" | "es";
}

// emergeX / emergeY are the offset (in cqw / cqh) from each letter's anchor
// to the section's center. The Mobbin-style burst starts every tile stacked
// at the center and springs them out to these anchor points.
const LETTERS = [
  { value: "A", position: "top-[8%] left-[10%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotateDeg: -8, floatDelay: "-1.2s", floatDuration: "2.7s", emergeX: 40, emergeY: 42, emergeDelay: 0.05 },
  { value: "S", position: "top-[18%] left-[29%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotateDeg: 6, floatDelay: "-4s", floatDuration: "3.0s", emergeX: 21, emergeY: 32, emergeDelay: 0.12 },
  { value: "D", position: "top-[6%] right-[28%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotateDeg: -5, floatDelay: "-7s", floatDuration: "3.3s", emergeX: -22, emergeY: 44, emergeDelay: 0.19 },
  { value: "F", position: "top-[15%] right-[8%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotateDeg: 9, floatDelay: "-2.4s", floatDuration: "2.8s", emergeX: -42, emergeY: 35, emergeDelay: 0.26 },
  { value: "J", position: "top-[43%] left-[3%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotateDeg: 7, floatDelay: "-6.2s", floatDuration: "3.5s", emergeX: 47, emergeY: 7, emergeDelay: 0.33 },
  { value: "K", position: "top-[46%] right-[3%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotateDeg: -7, floatDelay: "-3.1s", floatDuration: "3.1s", emergeX: -47, emergeY: 4, emergeDelay: 0.4 },
  { value: "L", position: "bottom-[12%] left-[11%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotateDeg: -10, floatDelay: "-5.7s", floatDuration: "3.2s", emergeX: 39, emergeY: -38, emergeDelay: 0.47 },
  { value: ";", position: "bottom-[8%] right-[12%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotateDeg: 8, floatDelay: "-8s", floatDuration: "2.9s", emergeX: -38, emergeY: -42, emergeDelay: 0.54 },
  { value: "Q", position: "bottom-[20%] left-[29%]", size: "h-14 w-14 sm:h-16 sm:w-16", rotateDeg: 5, floatDelay: "-2.8s", floatDuration: "2.8s", emergeX: 21, emergeY: -30, emergeDelay: 0.61 },
  { value: "P", position: "bottom-[21%] right-[29%]", size: "h-14 w-14 sm:h-16 sm:w-16", rotateDeg: -6, floatDelay: "-6.5s", floatDuration: "3.4s", emergeX: -21, emergeY: -29, emergeDelay: 0.68 },
  { value: "1", position: "top-[61%] left-[17%]", size: "h-12 w-12 sm:h-14 sm:w-14", rotateDeg: -4, floatDelay: "-1.8s", floatDuration: "2.6s", emergeX: 33, emergeY: -11, emergeDelay: 0.75 },
  { value: "0", position: "top-[65%] right-[17%]", size: "h-12 w-12 sm:h-14 sm:w-14", rotateDeg: 6, floatDelay: "-4.9s", floatDuration: "3.1s", emergeX: -33, emergeY: -15, emergeDelay: 0.82 },
] as const;

// --- Mobbin-style spiral burst math ---------------------------------------
// Every tile starts stacked exactly at the section's center. Instead of
// flying out in a straight line, it spirals outward along a curved arc
// (rotateVector) that unwinds as it travels, then springs past its anchor
// point with a small overshoot before settling — the same "hub burst"
// choreography used by icon-grid reveal animations, adapted for letters.
const SWIRL_DEG = 58;
const SPIN_DEG = 150;
const MID_FRACTION = 0.62;

function rotateVector(x: number, y: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return { x: x * cos - y * sin, y: x * sin + y * cos };
}

function computeEmergeMotion(emergeX: number, emergeY: number, rotateDeg: number) {
  const midRadius = 1 - MID_FRACTION;
  const midAngle = SWIRL_DEG * MID_FRACTION;
  const mid = rotateVector(emergeX, emergeY, midAngle);
  const wobble = emergeX >= 0 ? 4 : -4;

  return {
    midX: mid.x * midRadius,
    midY: mid.y * midRadius,
    overshootX: emergeX * -0.07,
    overshootY: emergeY * -0.07,
    rotateStart: rotateDeg - SPIN_DEG,
    rotateMid: rotateDeg - SPIN_DEG * (1 - MID_FRACTION),
    rotateOvershoot: rotateDeg + wobble,
  };
}

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
      <div className="typing-motion-orbit-ring" aria-hidden="true" />
      <div className="typing-motion-origin-pulse" aria-hidden="true" />
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

        {LETTERS.map((item) => {
          const motion = computeEmergeMotion(item.emergeX, item.emergeY, item.rotateDeg);
          return (
            <div
              key={`${item.value}-${item.position}`}
              className={`typing-motion-float absolute ${item.position} ${item.size}`}
              style={{
                ["--tile-rotation" as string]: `${item.rotateDeg}deg`,
                ["--tile-rotation-start" as string]: `${motion.rotateStart}deg`,
                ["--tile-rotation-mid" as string]: `${motion.rotateMid}deg`,
                ["--tile-rotation-overshoot" as string]: `${motion.rotateOvershoot}deg`,
                ["--emerge-x" as string]: `${item.emergeX}cqw`,
                ["--emerge-y" as string]: `${item.emergeY}cqh`,
                ["--emerge-mid-x" as string]: `${motion.midX}cqw`,
                ["--emerge-mid-y" as string]: `${motion.midY}cqh`,
                ["--emerge-overshoot-x" as string]: `${motion.overshootX}cqw`,
                ["--emerge-overshoot-y" as string]: `${motion.overshootY}cqh`,
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
          );
        })}
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

        /* A soft rotating halo behind the burst that fades in once, echoing
           the circular motif of the letters spiraling out from the center. */
        .typing-motion-orbit-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: min(60cqw, 600px);
          height: min(60cqw, 600px);
          transform: translate(-50%, -50%) scale(0.55);
          border-radius: 50%;
          border: 1px solid color-mix(in srgb, var(--color-accent) 14%, transparent);
          background: radial-gradient(circle at center, color-mix(in srgb, var(--color-accent) 9%, transparent), transparent 68%);
          opacity: 0;
          filter: blur(1px);
          pointer-events: none;
          z-index: 1;
        }

        [data-motion-defer="active"] .typing-motion-orbit-ring {
          animation: orbitRingReveal 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
        }

        /* A quick radial flash marking the exact burst origin at the
           section's center — the spark the letters fly out from. */
        .typing-motion-origin-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 14px;
          height: 14px;
          transform: translate(-50%, -50%) scale(1);
          border-radius: 50%;
          background: radial-gradient(circle, color-mix(in srgb, var(--color-accent) 55%, transparent), transparent 72%);
          opacity: 0;
          pointer-events: none;
          z-index: 1;
        }

        [data-motion-defer="active"] .typing-motion-origin-pulse {
          animation: originPulse 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
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

        /* Mobbin-style: each tile starts stacked at the section's exact
           center, spirals outward along a curving arc that unwinds as it
           travels (0% \u2192 38%), then springs past its final anchor with a
           small overshoot before settling into rest (68% \u2192 100%). The
           staggered per-tile delays (--emerge-delay) create the wave-like
           choreography of the burst. */
        .typing-motion-float {
          z-index: 2;
          pointer-events: none;
          opacity: 0;
          transform: translate(var(--emerge-x, 0cqw), var(--emerge-y, 0cqh)) scale(0.16);
          filter: blur(10px);
          will-change: transform, opacity, filter;
        }

        /* When the section scrolls into view, run the emerge burst. */
        [data-motion-defer="active"] .typing-motion-float {
          animation:
            emergeFromCenter 1.25s cubic-bezier(0.22, 1, 0.36, 1) var(--emerge-delay, 0s) both;
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

        @keyframes orbitRingReveal {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.55); }
          45% { opacity: .5; }
          100% { opacity: .22; transform: translate(-50%, -50%) scale(1); }
        }

        @keyframes originPulse {
          0% { opacity: .9; transform: translate(-50%, -50%) scale(0.4); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(18); }
        }

        /* The spiral burst: unwind from a big initial spin at the center,
           curve outward through the swirl waypoint, overshoot slightly
           past the anchor, then settle. */
        @keyframes emergeFromCenter {
          0% {
            transform: translate(var(--emerge-x, 0cqw), var(--emerge-y, 0cqh)) scale(0.16) rotate(var(--tile-rotation-start));
            opacity: 0;
            filter: blur(10px);
          }
          38% {
            transform: translate(var(--emerge-mid-x, 0cqw), var(--emerge-mid-y, 0cqh)) scale(0.6) rotate(var(--tile-rotation-mid));
            opacity: 1;
            filter: blur(2px);
          }
          68% {
            transform: translate(var(--emerge-overshoot-x, 0cqw), var(--emerge-overshoot-y, 0cqh)) scale(1.09) rotate(var(--tile-rotation-overshoot));
            opacity: 1;
            filter: blur(0);
          }
          100% {
            transform: translate(0, 0) scale(1) rotate(var(--tile-rotation));
            opacity: 1;
            filter: blur(0);
          }
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
          .typing-motion-orbit-ring { width: min(78cqw, 460px); height: min(78cqw, 460px); }
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
          .typing-motion-orbit-ring,
          .typing-motion-origin-pulse {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
