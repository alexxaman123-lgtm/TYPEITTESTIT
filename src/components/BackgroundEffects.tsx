export default function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="background-effects pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      {/* Faint grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--color-ink) 9%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-ink) 9%, transparent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Theme-aware radial glow */}
      <div
        className="animate-drift absolute -top-1/4 left-1/2 h-[60vw] w-[60vw] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          opacity: 0.14,
          background: "radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)",
        }}
      />

      {/* Theme-aware secondary glow */}
      <div
        className="absolute bottom-[-15%] right-[-10%] h-[45vw] w-[45vw] rounded-full blur-3xl"
        style={{
          opacity: 0.08,
          background: "radial-gradient(circle, var(--color-accent-glow-secondary) 0%, transparent 70%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Static grain — avoids a full-screen SVG turbulence filter on every frame. */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.45) 0.5px, transparent 0.5px)",
          backgroundSize: "3px 3px",
        }}
      />
    </div>
  );
}
