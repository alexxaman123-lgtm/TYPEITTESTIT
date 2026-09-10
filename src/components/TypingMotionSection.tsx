import { useEffect, useRef } from "react";

interface TypingMotionSectionProps {
  locale?: "en" | "es";
}

// Mobbin-caliber entrance: every tile starts collapsed at the exact center
// of the section, spins through a smooth counter-rotating sweep while it
// converges outward along a single decelerating ease curve, and settles
// into its own anchored spot at its resting tilt. No blur, no flashing
// "pulse" marker, no elastic bounce -- just one confident, staggered,
// ease-out motion per tile so the whole cluster reads as a coordinated
// spiral unfurling from the middle of the screen.
//
// dx / dy describe each tile's anchor position as an offset from the
// section's center, expressed as a percent of the section's own width
// (dx) and height (dy). Container query units (cqw/cqh) turn that into a
// real pixel translation at render time, so the tile's starting transform
// exactly cancels its resting position and lands it dead-center.
const LETTERS = [
  { value: "A", position: "top-[8%] left-[10%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotateDeg: -8, dx: -40, dy: -42, spin: -300, floatDelay: "-1.2s", floatDuration: "2.7s", revealDelay: 0 },
  { value: "S", position: "top-[18%] left-[29%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotateDeg: 6, dx: -21, dy: -32, spin: -270, floatDelay: "-4s", floatDuration: "3.0s", revealDelay: 0.035 },
  { value: "D", position: "top-[6%] right-[28%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotateDeg: -5, dx: 22, dy: -44, spin: -330, floatDelay: "-7s", floatDuration: "3.3s", revealDelay: 0.07 },
  { value: "F", position: "top-[15%] right-[8%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotateDeg: 9, dx: 42, dy: -35, spin: -290, floatDelay: "-2.4s", floatDuration: "2.8s", revealDelay: 0.105 },
  { value: "J", position: "top-[43%] left-[3%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotateDeg: 7, dx: -47, dy: -7, spin: -310, floatDelay: "-6.2s", floatDuration: "3.5s", revealDelay: 0.14 },
  { value: "K", position: "top-[46%] right-[3%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotateDeg: -7, dx: 47, dy: -4, spin: -260, floatDelay: "-3.1s", floatDuration: "3.1s", revealDelay: 0.175 },
  { value: "L", position: "bottom-[12%] left-[11%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotateDeg: -10, dx: -39, dy: 38, spin: -320, floatDelay: "-5.7s", floatDuration: "3.2s", revealDelay: 0.21 },
  { value: ";", position: "bottom-[8%] right-[12%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotateDeg: 8, dx: 38, dy: 42, spin: -280, floatDelay: "-8s", floatDuration: "2.9s", revealDelay: 0.245 },
  { value: "Q", position: "bottom-[20%] left-[29%]", size: "h-14 w-14 sm:h-16 sm:w-16", rotateDeg: 5, dx: -21, dy: 30, spin: -300, floatDelay: "-2.8s", floatDuration: "2.8s", revealDelay: 0.28 },
  { value: "P", position: "bottom-[21%] right-[29%]", size: "h-14 w-14 sm:h-16 sm:w-16", rotateDeg: -6, dx: 21, dy: 29, spin: -270, floatDelay: "-6.5s", floatDuration: "3.4s", revealDelay: 0.315 },
  { value: "1", position: "top-[61%] left-[17%]", size: "h-12 w-12 sm:h-14 sm:w-14", rotateDeg: -4, dx: -33, dy: 11, spin: -310, floatDelay: "-1.8s", floatDuration: "2.6s", revealDelay: 0.35 },
  { value: "0", position: "top-[65%] right-[17%]", size: "h-12 w-12 sm:h-14 sm:w-14", rotateDeg: 6, dx: 33, dy: 15, spin: -290, floatDelay: "-4.9s", floatDuration: "3.1s", revealDelay: 0.385 },
] as const;

// Fires once roughly half of the section's own height has scrolled into the
// viewport, rather than waiting for the section to be perfectly framed
// edge-to-edge. Waiting for a full, edge-to-edge frame meant the reveal only
// fired once the user had already scrolled well past the section's top --
// on many screens that point sits close to (or past) the section's bottom,
// which read as "the animation happens after I've left the section". Using
// the fraction of the section's own height that is currently visible (capped
// by the viewport height for sections taller than the screen) gives a
// consistent "I've reached the midpoint of this section" trigger on every
// device, including short mobile screens and sections taller than the
// viewport.
function isSectionHalfwayInViewport(section: HTMLElement): boolean {
  const rect = section.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, viewportHeight);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
  const referenceHeight = Math.min(rect.height, viewportHeight) || 1;
  return visibleHeight / referenceHeight >= 0.5;
}

const VISIBILITY_THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

// NOTE: this section intentionally does NOT use the shared `data-motion-defer`
// attribute that SiteLayout.astro's generic script watches. That global
// observer uses a loose `rootMargin: '0px 0px 10% 0px'` and fires as soon as
// an element merely starts intersecting -- which was flipping this section's
// reveal state active the instant it began peeking into view (e.g. on mobile
// while only its very top edge was visible), well before it was scrolled
// meaningfully into frame. This component owns its own `data-spiral-defer`
// attribute, gated by the halfway check above, so the two observers can
// never race each other.
//
// This component is hydrated with `client:load` (not `client:visible`) on
// every page that uses it. That is intentional: with `client:visible`, the
// browser only starts downloading and running this component's JS once the
// section itself begins entering the viewport, so on a fast or continuous
// scroll the code can still be loading by the moment the halfway condition
// is met, making the reveal fire a beat late. Hydrating immediately on load
// means the observer and scroll listener below are already armed well
// before the user ever reaches this section, so the reveal fires the exact
// instant the halfway-in-viewport condition is met, with no perceptible delay.
export default function TypingMotionSection({ locale = "en" }: TypingMotionSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.dataset.spiralDefer = "active";
      return;
    }

    let triggered = false;

    const tryTrigger = () => {
      if (triggered || !isSectionHalfwayInViewport(section)) return;
      triggered = true;
      section.dataset.spiralDefer = "active";
      observer.disconnect();
      window.removeEventListener("scroll", tryTrigger);
      window.removeEventListener("resize", tryTrigger);
    };

    const observer = new IntersectionObserver(tryTrigger, { threshold: VISIBILITY_THRESHOLDS });
    observer.observe(section);
    // Scroll/resize fallback: IntersectionObserver only re-checks at the
    // threshold steps above, so these catch the exact frame the section
    // crosses the halfway point even on fast or inertial scrolls.
    window.addEventListener("scroll", tryTrigger, { passive: true });
    window.addEventListener("resize", tryTrigger);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", tryTrigger);
      window.removeEventListener("resize", tryTrigger);
    };
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
    <section ref={sectionRef} data-spiral-defer className="typing-motion-section relative overflow-hidden border-y border-hairline" aria-label={locale === "es" ? "Práctica de mecanografía" : "Typing practice showcase"}>
      <div className="typing-motion-grid" aria-hidden="true" />
      <div className="typing-motion-stage relative mx-auto flex min-h-[620px] max-w-[1500px] items-center justify-center px-5 py-24 sm:min-h-[700px] sm:px-8 lg:min-h-[760px] lg:px-12">
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
              ["--dx" as string]: item.dx,
              ["--dy" as string]: item.dy,
              ["--spiral-spin" as string]: `${item.spin}deg`,
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
        }

        .typing-motion-stage {
          container-type: size;
          container-name: typing-motion-stage;
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

        /* Each tile's resting spot is set by its absolute top/left/right/bottom
           classes. --dx/--dy (percent of the stage's own width/height, via
           cqw/cqh) describe that same spot as an offset from dead-center.
           Negating them gives the exact translation needed to pull the tile
           back to the middle, so the spiral-in animation always starts
           perfectly centered no matter where the tile finally rests. */
        .typing-motion-float {
          z-index: 2;
          pointer-events: none;
          opacity: 0;
          transform:
            translate(calc(var(--dx) * -1cqw), calc(var(--dy) * -1cqh))
            rotate(calc(var(--tile-rotation) + var(--spiral-spin)))
            scale(0.22);
          will-change: transform, opacity;
        }

        [data-spiral-defer="active"] .typing-motion-float {
          animation: spiralConverge 0.95s cubic-bezier(0.19, 1, 0.22, 1) var(--reveal-delay, 0s) both;
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

        /* One continuous ease-out sweep: unwind the extra spin while
           converging from dead-center to the resting anchor and growing to
           full size. A gentler mid-flight opacity ramp (vs. an early, abrupt
           one) makes each tile feel like it is materializing smoothly out of
           the center rather than popping in partway through the motion. No
           blur, no flicker, no overshoot past 100%. */
        @keyframes spiralConverge {
          0% {
            opacity: 0;
            transform:
              translate(calc(var(--dx) * -1cqw), calc(var(--dy) * -1cqh))
              rotate(calc(var(--tile-rotation) + var(--spiral-spin)))
              scale(0.22);
          }
          38% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translate(0, 0) rotate(var(--tile-rotation)) scale(1);
          }
        }

        @keyframes typingMotionFloat {
          0%, 100% { transform: rotate(var(--tile-rotation)) translate3d(0, 0, 0) scale(1); }
          50% { transform: rotate(var(--tile-rotation)) translate3d(12px, -22px, 0) scale(1.03); }
        }

        @media (max-width: 700px) {
          .typing-motion-section .typing-motion-stage {
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
            transform: translate(0, 0) rotate(var(--tile-rotation)) scale(1);
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
