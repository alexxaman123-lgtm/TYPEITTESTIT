export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-surface1/50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">About</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">ABOUT FREETYPINGTESTGOAT</h1>
        <p className="mt-6 leading-7 text-muted">
          FreeTypingTestGoat was built around a simple idea: a typing speed test should be fast, honest, and
          immediately usable — no clutter, no waiting, and nothing complicated standing between you and practice.
        </p>
        <p className="mt-4 leading-7 text-muted">
          Our typing tester measures your words per minute, accuracy, and errors so you can practice typing
          and see your results immediately after every test.
        </p>
        <p className="mt-4 leading-7 text-muted">
          FreeTypingTestGoat offers three difficulty levels — Easy, Medium, and Hard — with different passages to
          help you build speed while improving accuracy. You can also choose 1, 2, 3, or 5 minute test durations and use
          longer sessions to work on consistency and endurance.
        </p>
        <p className="mt-4 leading-7 text-muted">
          You can take any typing test without signing in. Google Sign-In is optional, but it is required to
          save progress to an account and participate in leaderboard features. When you choose a username, it
          must be unique and may be displayed with your qualifying public leaderboard results.
        </p>
      </div>
    </section>
  );
}
