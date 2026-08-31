const STEPS = [
  {
    title: "Choose your setup",
    body: "Pick Easy, Medium or Hard, then choose a duration — 1, 2, 3 or 5 minutes. Your preference is remembered for next time.",
  },
  {
    title: "Start typing",
    body: "There's no separate start button to click. The timer begins automatically the moment you type the first character.",
  },
  {
    title: "Type the passage",
    body: "Correct characters turn green, mistakes are marked in red, and a bright caret always shows your current position.",
  },
  {
    title: "Get your results",
    body: "When the timer hits zero, GOATTYPE instantly shows your WPM, accuracy, and errors. You can take a test without signing in; account-based progress and leaderboard features require Google Sign-In.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">How It Works</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted">
          GOATTYPE is built to be understood in seconds. No tutorials, no setup screens — just
          a fast, focused online typing speed test for practice, WPM feedback, and real improvement.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <div key={step.title} className="interactive-lift animate-fade-up rounded-2xl border border-white/10 bg-surface1/55 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]" style={{ animationDelay: String(i * 80) + "ms" }}>
            <span className="font-mono text-sm font-bold text-accent">0{i + 1}</span>
            <h3 className="mt-3 font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
