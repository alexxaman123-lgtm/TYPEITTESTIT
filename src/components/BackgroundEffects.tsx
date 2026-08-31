export default function BackgroundEffects() {
  return (
    <div aria-hidden="true" className="background-effects pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg">
      <div className="background-grid absolute inset-0" />

      <div className="background-glow background-glow-primary absolute left-[-24vw] top-[-18vw] h-[76vw] w-[76vw] rounded-full" />
      <div className="background-glow background-glow-secondary absolute right-[-24vw] top-[8vh] h-[70vw] w-[70vw] rounded-full" />

      <div className="background-vignette absolute inset-0" />
    </div>
  );
}
