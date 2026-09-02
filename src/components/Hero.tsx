export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32" aria-labelledby="hero-title">
      <div className="mx-auto max-w-5xl text-center">
        <div className="animate-fade-up mb-7">
          <span className="inline-flex items-center rounded-full border border-hairline bg-canvas-soft px-4 py-2 font-label text-ink">
            Free typing test · WPM test · typing test practice
          </span>
        </div>

        <h1
          id="hero-title"
          className="animate-fade-up font-display text-ink"
          style={{ animationDelay: "40ms" }}
        >
          Take a free typing test online and measure your WPM.
        </h1>

        <p
          className="animate-fade-up mx-auto mt-7 max-w-3xl font-body-lg text-text-muted"
          style={{ animationDelay: "80ms" }}
        >
          Check your typing speed, accuracy, and errors with a fast online free typing test. Practice with a 1, 2, 3, or 5 minute typing test, build consistency, and improve your keyboard speed.
        </p>

        <div
          className="animate-fade-up mt-8 flex flex-wrap items-center justify-center gap-2"
          style={{ animationDelay: "120ms" }}
          aria-label="Typing test options"
        >
          {[
            "Free Typing Test WPM",
            "Free Typing Test Practice",
            "Online Free Typing Test",
            "Free Typing Test With Certificate",
            "Free Typing Test Games",
          ].map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-hairline bg-canvas px-3.5 py-2 font-caption text-text-muted"
            >
              {keyword}
            </span>
          ))}
        </div>

        <div
          className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "160ms" }}
        >
          <a
            href="#tester"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 font-link text-on-primary transition-transform duration-200 hover:-translate-y-0.5"
          >
            Start Typing Test
          </a>
          <a
            href="/leaderboard"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-hairline bg-canvas px-6 font-link text-ink transition-colors duration-200 hover:border-text-muted hover:bg-canvas-soft"
          >
            See Typing Scores
          </a>
        </div>

        <p
          className="animate-fade-up mx-auto mt-5 max-w-2xl font-caption text-text-faint"
          style={{ animationDelay: "200ms" }}
        >
          Popular searches include free typing test online, free typing test WPM, typing test practice, and how to test your typing speed. FreeTypingTestGoat gives you a simple browser-based typing test with multiple durations and practice options.
        </p>
      </div>
    </section>
  );
}
