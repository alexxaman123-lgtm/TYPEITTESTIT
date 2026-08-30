export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-surface1/50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">About</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">About TYPEITTESTIT</h1>
        <p className="mt-6 leading-7 text-muted">
          TYPEITTESTIT was built around a simple idea: a typing speed test should be fast, honest, and
          immediately usable — no clutter, no waiting, and nothing complicated standing between you and practice.
        </p>
        <p className="mt-4 leading-7 text-muted">
          Our typing tester measures your words per minute, accuracy, and errors so you can practice typing
          and see whether your speed is actually improving. The calculations happen directly in your browser,
          giving you instant results after every test.
        </p>
        <p className="mt-4 leading-7 text-muted">
          TYPEITTESTIT offers three difficulty levels — Easy, Medium, and Hard — with different passages to
          help you build speed while improving accuracy. You can also choose different test durations and use
          longer sessions to work on consistency and endurance.
        </p>
        <p className="mt-4 leading-7 text-muted">
          Your personal best is saved locally in your browser, giving you a simple benchmark to beat as you
          continue practicing. Our goal is to make typing practice straightforward, useful, and focused on real improvement.
        </p>
      </div>
    </section>
  );
}
