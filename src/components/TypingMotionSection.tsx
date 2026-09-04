interface TypingMotionSectionProps {
  locale?: "en" | "es";
}

const LETTERS = [
  { value: "A", position: "top-[8%] left-[10%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotate: "-8deg", delay: "-1.2s", duration: "8.5s" },
  { value: "S", position: "top-[18%] left-[29%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotate: "6deg", delay: "-4s", duration: "9.5s" },
  { value: "D", position: "top-[6%] right-[28%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotate: "-5deg", delay: "-7s", duration: "10.5s" },
  { value: "F", position: "top-[15%] right-[8%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotate: "9deg", delay: "-2.4s", duration: "8.9s" },
  { value: "J", position: "top-[43%] left-[3%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotate: "7deg", delay: "-6.2s", duration: "11s" },
  { value: "K", position: "top-[46%] right-[3%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotate: "-7deg", delay: "-3.1s", duration: "9.8s" },
  { value: "L", position: "bottom-[12%] left-[11%]", size: "h-20 w-20 sm:h-24 sm:w-24", rotate: "-10deg", delay: "-5.7s", duration: "10.2s" },
  { value: ";", position: "bottom-[8%] right-[12%]", size: "h-16 w-16 sm:h-20 sm:w-20", rotate: "8deg", delay: "-8s", duration: "9.2s" },
  { value: "Q", position: "bottom-[20%] left-[29%]", size: "h-14 w-14 sm:h-16 sm:w-16", rotate: "5deg", delay: "-2.8s", duration: "8.8s" },
  { value: "P", position: "bottom-[21%] right-[29%]", size: "h-14 w-14 sm:h-16 sm:w-16", rotate: "-6deg", delay: "-6.5s", duration: "10.8s" },
  { value: "1", position: "top-[61%] left-[17%]", size: "h-12 w-12 sm:h-14 sm:w-14", rotate: "-4deg", delay: "-1.8s", duration: "8.2s" },
  { value: "0", position: "top-[65%] right-[17%]", size: "h-12 w-12 sm:h-14 sm:w-14", rotate: "6deg", delay: "-4.9s", duration: "9.7s" },
] as const;

export default function TypingMotionSection({ locale = "en" }: TypingMotionSectionProps) {
  const content = locale === "es"
    ? {
        eyebrow: "PRÁCTICA DE MECANOGRAFÍA",
        title: "Cada pulsación\ncuenta.",
        subtitle: "Velocidad. Precisión. Control.",
      }
    : {
        eyebrow: "TYPING PRACTICE",
        title: "Every keystroke\ncounts.",
        subtitle: "Speed. Accuracy. Control.",
      };

  return (
    <section data-motion-defer className="typing-motion-section relative overflow-hidden border-y border-hairline" aria-label={locale === "es" ? "Práctica de mecanografía" : "Typing practice showcase"}>
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
              animationDelay: item.delay,
              animationDuration: item.duration,
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

        .typing-motion-float {
          z-index: 2;
          pointer-events: none;
          animation-name: typingMotionFloat;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
        }

        /* Defer infinite animation work until the section is on screen. */
        [data-motion-defer] .typing-motion-float {
          animation-play-state: paused;
        }
        [data-motion-defer="active"] .typing-motion-float {
          animation-play-state: running;
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
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .typing-motion-tile span {
          font-family: var(--font-mono);
          font-size: clamp(1.6rem, 3vw, 2.35rem);
          font-weight: 700;
          color: var(--color-ink);
          line-height: 1;
          text-shadow: 0 0 28px color-mix(in srgb, var(--color-accent) 8%, transparent);
        }

        @keyframes typingMotionFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(7px, -15px, 0); }
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
          .typing-motion-float { animation: none; }
          .typing-motion-tile { transform: rotate(var(--tile-rotation)); }
        }
      `}</style>
    </section>
  );
}
