export default function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-surface1/50 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] sm:p-10">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          About TYPEITTESTIT
        </h2>
        <p className="mt-4 leading-7 text-muted">
          TYPEITTESTIT was built around a simple idea: a typing speed test should be fast, honest, and
          immediately usable — no accounts, no clutter, no waiting. TYPING TESTER, the core tool on
          this page, measures your words per minute, accuracy, and errors so you can practice typing
          and see whether your speed is actually improving. Every calculation happens directly in your browser.
        </p>
        <p className="mt-4 leading-7 text-muted">
          The passage library spans three difficulty levels — easy, medium, and hard — each with
          multiple long-form texts so you rarely see the same passage twice in a row. For longer
          sessions, TYPEITTESTIT automatically continues into a new passage the moment you reach
          the end of the current one, so a three or five minute typing test never runs out of
          material.
        </p>
        <p className="mt-4 leading-7 text-muted">
          Your personal best is saved locally in your browser, so you always have a benchmark to
          beat. There's no server, no tracking of your typed content, and nothing required beyond a
          keyboard and a few minutes.
        </p>
      </div>
    </section>
  );
}
