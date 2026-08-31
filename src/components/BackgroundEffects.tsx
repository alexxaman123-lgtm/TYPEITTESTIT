export default function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="background-effects pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      {/* Faint grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial glow top */}
      <div
        className="animate-drift absolute -top-1/4 left-1/2 h-[60vw] w-[60vw] -translate-x-1/2 rounded-full opacity-[0.14] blur-3xl"
        style={{
          background: "radial-gradient(circle, #00ff66 0%, rgba(0,255,102,0) 70%)",
        }}
      />

      {/* Secondary glow bottom-right */}
      <div
        className="absolute bottom-[-15%] right-[-10%] h-[45vw] w-[45vw] rounded-full opacity-[0.08] blur-3xl"
        style={{
          background: "radial-gradient(circle, #00d95a 0%, rgba(0,217,90,0) 70%)",
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
