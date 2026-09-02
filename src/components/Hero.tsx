export default function Hero() {
  return (
    <section
      className="hero-banner relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28"
      aria-labelledby="hero-title"
    >
      <div className="hero-banner-grid" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center py-14 sm:min-h-[720px] sm:py-20">
        <div className="w-full max-w-4xl">
          <div className="animate-fade-up flex flex-wrap items-center gap-3" style={{ animationDelay: "40ms" }}>
            <span className="hero-kicker font-label">FREE TYPING TEST</span>
            <span className="hero-kicker-muted font-caption">WPM · ACCURACY · SPEED</span>
          </div>

          <h1
            id="hero-title"
            className="hero-title mt-7 animate-fade-up font-display"
            style={{ animationDelay: "90ms" }}
          >
            Free typing test.
            <br />
            Measure your WPM.
          </h1>

          <p
            className="hero-lede mt-7 max-w-3xl animate-fade-up font-body-lg"
            style={{ animationDelay: "140ms" }}
          >
            Take a free typing test online to measure your typing speed, words per minute, accuracy, and errors. Practice with 1, 2, 3, or 5 minute tests and build faster, more confident keyboard skills.
          </p>

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
            className="mt-10 flex flex-wrap gap-2 animate-fade-up"
            style={{ animationDelay: "240ms" }}
            aria-label="Typing test features"
          >
            <span className="hero-feature font-caption">Free typing test WPM</span>
            <span className="hero-feature font-caption">Typing test practice</span>
            <span className="hero-feature font-caption">1 / 2 / 3 / 5 minute tests</span>
            <span className="hero-feature font-caption">Accuracy tracking</span>
          </div>

          <div
            className="mt-12 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-[28px] border border-current/10 animate-fade-up sm:grid-cols-3"
            style={{ animationDelay: "290ms" }}
            aria-label="Typing test highlights"
          >
            <div className="hero-stat">
              <span className="hero-stat-value font-heading-3">WPM</span>
              <span className="hero-stat-label font-caption">Measure your typing speed</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value font-heading-3">95%+</span>
              <span className="hero-stat-label font-caption">Accuracy matters too</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value font-heading-3">1–5 min</span>
              <span className="hero-stat-label font-caption">Quick or sustained practice</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
