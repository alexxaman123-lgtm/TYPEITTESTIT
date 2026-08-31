export default function Hero() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-8 pt-14 text-center sm:pt-20">
      <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Free typing speed test · No sign-in to take a test · Instant results
      </div>
      <div className="animate-fade-up eyebrow-line mt-8 text-[10px] font-semibold uppercase tracking-[0.28em] text-faint" style={{ animationDelay: "40ms" }}>
        Measure · Practice · Improve
      </div>
      <h1 className="animate-fade-up mt-4 text-4xl font-extrabold tracking-[-0.035em] text-ink sm:text-5xl lg:text-6xl" style={{ animationDelay: "80ms" }}>
        GOATTYPE TYPING TEST
      </h1>
      <p className="animate-fade-up mx-auto mt-3 text-lg font-bold uppercase tracking-[0.18em] text-accent" style={{ animationDelay: "120ms" }}>
        TYPE LIKE A GOAT
      </p>
      <p className="animate-fade-up mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg" style={{ animationDelay: "160ms" }}>
        GOATTYPE is a free online typing speed test for measuring WPM and typing accuracy in real time.
        Sign in with Google to save progress to an account and participate in leaderboard features.
      </p>
      <p className="animate-fade-up mx-auto mt-5 max-w-xl text-sm font-semibold text-ink-soft sm:text-base" style={{ animationDelay: "220ms" }}>
        Are you a pro typer? Measure your typing speed, beat your personal best, and see how fast you can really type.
      </p>
    </div>
  );
}
