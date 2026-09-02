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
    body: "Correct characters turn black, mistakes are marked in red, and a bright caret always shows your current position.",
  },
  {
    title: "Get your results",
    body: "When the timer hits zero, FreeTypingTestGoat instantly shows your WPM, accuracy, and errors. You can take a test without signing in; account-based progress and leaderboard features require Google Sign-In.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="font-heading-4 text-ink">How It Works</h2>
        <p className="mx-auto mt-3 max-w-2xl font-body text-text-muted">
          FreeTypingTestGoat is built to be understood in seconds. No tutorials, no setup screens — just
          a fast, focused online typing speed test for practice, WPM feedback, and real improvement.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <div key={step.title} className="animate-fade-up rounded-[24px] border border-hairline bg-canvas p-6 shadow-sm" style={{ animationDelay: String(i * 80) + "ms" }}>
            <span className="font-label text-accent">0{i + 1}</span>
            <h3 className="mt-3 font-heading-5 text-ink">{step.title}</h3>
            <p className="mt-2 font-body-sm text-text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
