import BlurTypeReveal from "./BlurTypeReveal";

export default function Hero() {
  return (
    <section
      className="hero-banner relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28"
      aria-labelledby="hero-title"
    >
      <div className="hero-banner-grid" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 py-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-14 sm:min-h-[720px] sm:py-20">
        <div className="w-full max-w-4xl">
          <div className="animate-fade-up flex flex-wrap items-center gap-3" style={{ animationDelay: "40ms" }}>
            <span className="hero-kicker font-label">FREE TYPING TEST</span>
            <span className="hero-kicker-muted font-caption">WPM · ACCURACY · SPEED</span>
          </div>

          {/* Letter-by-letter blur-to-focus reveal: the headline types itself in. */}
          <BlurTypeReveal
            as="h1"
            id="hero-title"
            className="hero-title mt-7 font-display"
            text={"Free Typing Test Online.\nMeasure Your WPM."}
            by="char"
            stagger={22}
            delay={120}
          />

          {/* Word-by-word so a long paragraph resolves quickly but still softly. */}
          <BlurTypeReveal
            as="p"
            className="hero-lede mt-7 max-w-3xl font-body-lg"
            text="Take a free typing test online to measure your typing speed, words per minute, accuracy, and errors. Practice with 1, 2, 3, or 5 minute tests and build faster, more confident keyboard skills."
            by="word"
            stagger={26}
            delay={420}
            caret={false}
          />

          <div
            className="mt-9 flex flex-col items-start gap-3 animate-fade-up sm:flex-row"
            style={{ animationDelay: "190ms" }}
          >
            <a
              href="#tester"
              className="hero-primary-cta inline-flex min-h-14 items-center justify-center rounded-full px-7 font-link transition-transform duration-200 hover:-translate-y-0.5"
            >
              Start Free Typing Test →
            </a>
            <a
              href="/leaderboard"
              className="hero-secondary-cta inline-flex min-h-14 items-center justify-center rounded-full border px-7 font-link transition-colors duration-200"
            >
              View Leaderboard
            </a>
          </div>

          <div
            className="mt-10 flex flex-wrap gap-2"
            data-reveal-group="left"
            aria-label="Typing test features"
          >
            <span className="hero-feature font-caption">Free typing test WPM</span>
            <span className="hero-feature font-caption">Typing test practice</span>
            <span className="hero-feature font-caption">1 / 2 / 3 / 5 minute tests</span>
            <span className="hero-feature font-caption">Accuracy tracking</span>
          </div>

          <div
            className="mt-12 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-[28px] border border-current/10 sm:grid-cols-3"
            data-reveal-group="up"
            aria-label="Typing test highlights"
          >
            <div className="hero-stat premium-card">
              <span className="hero-stat-value font-heading-3">WPM</span>
              <span className="hero-stat-label font-caption">Measure your typing speed</span>
            </div>
            <div className="hero-stat premium-card">
              <span className="hero-stat-value font-heading-3">Accuracy</span>
              <span className="hero-stat-label font-caption">See speed and accuracy together</span>
            </div>
            <div className="hero-stat premium-card">
              <span className="hero-stat-value font-heading-3">1–5 min</span>
              <span className="hero-stat-label font-caption">Quick or sustained practice</span>
            </div>
          </div>
        </div>

        <div
          className="relative mx-auto w-full max-w-[560px] lg:max-w-none"
          data-reveal="right"
          aria-label="Goat typing video"
        >
          <div className="hero-video-shell relative overflow-hidden rounded-[32px] border border-current/10 bg-canvas-soft shadow-2xl">
            <video
              className="block aspect-[4/5] h-auto w-full object-cover lg:aspect-[5/6]"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Animated goat typing on a laptop"
              style={{ backgroundColor: "var(--color-canvas-soft)" }}
            >
              <source src="/goat-typing-on-laptop-1080p-202609030103-1_QfYbMZo0.mp4" type="video/mp4" />
              <source src="/Goat_typing_on_laptop_1080p_202609030103.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent px-5 pb-5 pt-20">
              <p className="font-caption font-semibold text-white">The GOAT is typing.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
