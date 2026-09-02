export default function Hero() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-12 pt-20 text-center sm:pt-32">
      <div className="animate-fade-up mb-6">
        <span className="inline-flex items-center rounded-full bg-canvas-soft px-4 py-1.5 font-label text-ink">
          Free online typing practice
        </span>
      </div>
      <h1 className="animate-fade-up font-display text-ink" style={{ animationDelay: "40ms" }}>
        Measure your typing speed.
      </h1>
      <p className="animate-fade-up mx-auto mt-6 max-w-2xl font-body-lg text-text-muted" style={{ animationDelay: "80ms" }}>
        Use our free typing test to check your typing speed, measure your words per minute, and track your accuracy. 
        Whether you need a quick 1 minute typing test or want to practice for a job, start typing to improve.
      </p>
    </div>
  );
}
