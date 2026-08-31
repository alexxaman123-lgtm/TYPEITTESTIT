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

      {/* Main atmospheric glow: large and deliberately slow, so the movement is visible without becoming distracting. */}
      <div
        className="ambient-glow ambient-glow-primary absolute -left-[18vw] -top-[12vw] h-[72vw] w-[72vw] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--color-accent-glow) 0%, transparent 68%)",
        }}
      />

      {/* Secondary glow uses the theme's second accent so the palette feels dimensional. */}
      <div
        className="ambient-glow ambient-glow-secondary absolute -right-[18vw] top-[18vh] h-[64vw] w-[64vw] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--color-accent-glow-secondary) 0%, transparent 68%)",
        }}
      />

      {/* Low background glow keeps the lower page/footer from feeling static. */}
      <div
        className="ambient-glow ambient-glow-tertiary absolute -bottom-[28vw] left-[22vw] h-[58vw] w-[58vw] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)",
        }}
      />

      {/* Soft center haze ties the three moving fields together. */}
      <div
        className="ambient-glow ambient-glow-center absolute left-1/2 top-1/2 h-[42vw] w-[42vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, var(--color-accent-glow-secondary) 0%, transparent 72%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 34%, rgba(0,0,0,0.48) 100%)",
        }}
      />

      {/* Static grain */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.45) 0.5px, transparent 0.5px)",
          backgroundSize: "3px 3px",
        }}
      />
    </div>
  );
}
