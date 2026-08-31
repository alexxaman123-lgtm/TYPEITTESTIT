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

      {/* Large animated ambient fields. They remain subtle, but are intentionally visible on desktop. */}
      <div
        className="ambient-glow ambient-glow-primary absolute left-[-22vw] top-[-18vw] h-[72vw] w-[72vw] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--color-accent-glow) 0%, transparent 68%)",
        }}
      />

      <div
        className="ambient-glow ambient-glow-secondary absolute right-[-18vw] top-[18vh] h-[68vw] w-[68vw] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--color-accent-glow-secondary) 0%, transparent 68%)",
        }}
      />

      <div
        className="ambient-glow ambient-glow-tertiary absolute left-[10vw] bottom-[-30vw] h-[70vw] w-[70vw] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)",
        }}
      />

      <div
        className="ambient-glow ambient-glow-center absolute left-1/2 top-[46%] h-[58vw] w-[58vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, var(--color-accent-glow-secondary) 0%, transparent 72%)",
        }}
      />

      {/* Extra low-frequency field keeps the atmosphere distributed rather than side-loaded. */}
      <div
        className="ambient-glow ambient-glow-fourth absolute left-[34vw] top-[8vh] h-[42vw] w-[42vw] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--color-accent-glow) 0%, transparent 74%)",
        }}
      />

      {/* Vignette keeps the center readable while allowing the moving glow to remain visible. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.02) 18%, rgba(0,0,0,0.16) 62%, rgba(0,0,0,0.38) 100%)",
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
