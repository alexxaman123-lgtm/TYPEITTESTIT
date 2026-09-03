export default function SpanishHero() {
  return (
    <section className="hero-banner relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28" aria-labelledby="hero-title-es">
      <div className="hero-banner-grid" aria-hidden="true" />
      <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 py-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-14 sm:min-h-[720px] sm:py-20">
        <div className="w-full max-w-4xl">
          <div className="animate-fade-up flex flex-wrap items-center gap-3" style={{ animationDelay: "40ms" }}>
            <span className="hero-kicker font-label">TEST DE MECANOGRAFÍA</span>
            <span className="hero-kicker-muted font-caption">WPM · PRECISIÓN · VELOCIDAD</span>
          </div>
          <h1 id="hero-title-es" className="hero-title mt-7 animate-fade-up font-display" style={{ animationDelay: "90ms" }}>
            Test de mecanografía gratis.
            <br />
            Mide tu velocidad de escritura.
          </h1>
          <p className="hero-lede mt-7 max-w-3xl animate-fade-up font-body-lg" style={{ animationDelay: "140ms" }}>
            Haz un test de mecanografía online para medir tu velocidad de escritura, palabras por minuto (WPM), precisión y errores. Practica con pruebas de 1, 2, 3 o 5 minutos y mejora tus habilidades de teclado con sesiones claras y repetibles.
          </p>
          <div className="mt-9 flex flex-col items-start gap-3 animate-fade-up sm:flex-row" style={{ animationDelay: "190ms" }}>
            <a href="#tester" className="hero-primary-cta inline-flex min-h-14 items-center justify-center rounded-full px-7 font-link transition-transform duration-200 hover:-translate-y-0.5">Empezar test de mecanografía →</a>
            <a href="/leaderboard" className="hero-secondary-cta inline-flex min-h-14 items-center justify-center rounded-full border px-7 font-link transition-colors duration-200">Ver clasificación</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-2 animate-fade-up" style={{ animationDelay: "240ms" }} aria-label="Funciones del test de mecanografía">
            <span className="hero-feature font-caption">Test de mecanografía gratis</span>
            <span className="hero-feature font-caption">Práctica de mecanografía</span>
            <span className="hero-feature font-caption">1 / 2 / 3 / 5 minutos</span>
            <span className="hero-feature font-caption">Seguimiento de precisión</span>
          </div>
          <div className="mt-12 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-[28px] border border-current/10 animate-fade-up sm:grid-cols-3" style={{ animationDelay: "290ms" }} aria-label="Destacados del test">
            <div className="hero-stat"><span className="hero-stat-value font-heading-3">WPM</span><span className="hero-stat-label font-caption">Mide tu velocidad de escritura</span></div>
            <div className="hero-stat"><span className="hero-stat-value font-heading-3">95%+</span><span className="hero-stat-label font-caption">La precisión también importa</span></div>
            <div className="hero-stat"><span className="hero-stat-value font-heading-3">1–5 min</span><span className="hero-stat-label font-caption">Práctica rápida o sostenida</span></div>
          </div>
        </div>
        <div className="animate-fade-up relative mx-auto w-full max-w-[560px] lg:max-w-none" style={{ animationDelay: "150ms" }} aria-label="Vídeo de una cabra escribiendo">
          <div className="hero-video-shell relative overflow-hidden rounded-[32px] border border-current/10 bg-canvas-soft shadow-2xl">
            <video className="block aspect-[4/5] h-auto w-full object-cover lg:aspect-[5/6]" src="/Goat_typing_on_laptop_1080p_202609030103.mp4" autoPlay muted loop playsInline preload="metadata" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent px-5 pb-5 pt-20">
              <p className="font-caption font-semibold text-white">La GOAT está escribiendo.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
