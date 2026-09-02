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
        FREE TYPING TEST
      </h1>
      <p className="animate-fade-up mx-auto mt-3 text-lg font-bold uppercase tracking-[0.18em] text-accent" style={{ animationDelay: "120ms" }}>
        ONLINE WPM TYPING TEST PRACTICE
      </p>
      <p className="animate-fade-up mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg" style={{ animationDelay: "160ms" }}>
        Use our free typing test to check your typing speed, measure your words per minute (WPM), and track your accuracy. 
        Whether you need a quick 1 minute typing test or want to practice typing test skills for a job, start typing to improve.
      </p>
      <p className="animate-fade-up mx-auto mt-5 max-w-xl text-sm font-semibold text-ink-soft sm:text-base" style={{ animationDelay: "220ms" }}>
        Ready to see how fast you type? Start the live typing speed test below, beat your personal best, and master keyboard typing.
      </p>
    </div>
  );
}
