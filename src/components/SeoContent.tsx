export default function SeoContent() {
  return (
    <section
      id="typing-practice"
      className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="text-muted [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:tracking-tight [&_p]:mt-3 [&_p]:leading-7">
        <div id="typing-speed-levels" className="scroll-mt-20">
          <h2>Typing Speed Chart</h2>
          <p>
            Use this chart as a simple guide to understand how different WPM ranges compare. Your typing speed
            can vary with the test duration, difficulty, and your focus, so these ranges are best used as practical
            benchmarks rather than strict grades.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-surface1/50">
            <div className="grid grid-cols-3 border-b border-white/10 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-faint sm:grid-cols-4">
              <span>Level</span><span>WPM</span><span className="col-span-1 hidden sm:block">What it means</span><span>Next target</span>
            </div>
            {[
              ["Poor / Developing", "0–29", "Build accuracy, rhythm, and basic keyboard control.", "30"],
              ["Average", "30–44", "Around the everyday range for many casual typists.", "45"],
              ["Good", "45–59", "A solid, useful pace for school, work, and daily writing.", "60"],
              ["Fast", "60–79", "Clearly above everyday speed; strong practical typing.", "80"],
              ["Excellent", "80–99", "Advanced speed suitable for writing-heavy work and skilled typing.", "100"],
              ["Elite", "100+", "A high competitive benchmark reached by a small minority of typists.", "—"],
            ].map(([level, range, meaning, next]) => (
              <div key={level} className="grid grid-cols-3 items-center gap-3 border-b border-white/5 px-4 py-4 last:border-b-0 sm:grid-cols-4">
                <span className="font-semibold text-ink">{level}</span>
                <span className="font-mono font-bold text-accent">{range}</span>
                <span className="col-span-1 hidden text-sm leading-6 text-muted sm:block">{meaning}</span>
                <span className="text-right text-sm font-semibold text-muted">{next === "—" ? "Elite achieved" : `↑ ${next} WPM`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
