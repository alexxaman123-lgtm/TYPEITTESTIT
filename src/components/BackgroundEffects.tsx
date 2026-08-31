export default function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="background-effects pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      {/* Faint grid */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-ink) 9%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 9%, transparent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Broad colour fields spread across the whole viewport. The page stays black while themed colour softly fills the atmosphere. */}
      <div
        className="ambient-glow ambient-glow-primary absolute left-[-28vw] top-[-16vw] h-[82vw] w-[82vw] rounded-full"
        style={{
          background: "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 30%, transparent) 0%, color-mix(in srgb, var(--color-accent) 14%, transparent) 42%, transparent 72%)",
        }}
      />

      <div
        className="ambient-glow ambient-glow-secondary absolute right-[-28vw] top-[2vh] h-[82vw] w-[82vw] rounded-full"
        style={{
          background: "radial-gradient(circle, color-mix(in srgb, var(--color-accent2) 24%, transparent) 0%, color-mix(in srgb, var(--color-accent2) 11%, transparent) 44%, transparent 74%)",
        }}
      />

      <div
        className="ambient-glow ambient-glow-tertiary absolute left-[-8vw] bottom-[-38vw] h-[88vw] w-[88vw] rounded-full"
        style={{
          background: "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 24%, transparent) 0%, color-mix(in srgb, var(--color-accent) 10%, transparent) 46%, transparent 76%)",
        }}
      />

      <div
        className="ambient-glow ambient-glow-center absolute left-1/2 top-1/2 h-[78vw] w-[78vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 18%, transparent) 0%, color-mix(in srgb, var(--color-accent2) 10%, transparent) 34%, transparent 74%)",
        }}
      />

      <div
        className="ambient-glow ambient-glow-fourth absolute left-[48vw] top-[20vh] h-[62vw] w-[62vw] rounded-full"
        style={{
          background: "radial-gradient(circle, color-mix(in srgb, var(--color-accent2) 18%, transparent) 0%, transparent 72%)",
        }}
      />

      <div
        className="ambient-glow ambient-glow-fifth absolute left-[-22vw] top-[38vh] h-[58vw] w-[58vw] rounded-full"
        style={{
          background: "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 16%, transparent) 0%, transparent 72%)",
        }}
      />

      {/* Vignette keeps the middle readable while allowing the moving colour to remain visible. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.01) 18%, rgba(0,0,0,0.12) 62%, rgba(0,0,0,0.38) 100%)",
        }}
      />

      {/* Static grain */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.45) 0.5px, transparent 0.5px)",
          backgroundSize: "3px 3px",
        }}
      />
    </div>
  );
}
