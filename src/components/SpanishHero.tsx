import BlurTypeReveal from "./BlurTypeReveal";

export default function SpanishHero() {
  return (
    <section className="hero-banner relative w-full overflow-hidden px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8 lg:pb-28" aria-labelledby="hero-title-es">
      <div className="hero-banner-grid" aria-hidden="true" />
      <div className="relative mx-auto grid min-h-0 w-full max-w-7xl items-center gap-8 py-10 sm:min-h-[720px] sm:gap-10 sm:py-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-14">
        <div className="min-w-0 w-full max-w-4xl">
          <div className="animate-fade-up flex min-w-0 flex-wrap items-center gap-2 sm:gap-3" style={{ animationDelay: "40ms" }}>
            <span className="hero-kicker min-w-0 max-w-full truncate font-label">TEST DE MECANOGRAFÍA</span>
            <span className="hero-kicker-muted min-w-0 max-w-full truncate font-caption">WPM · PRECISIÓN · VELOCIDAD</span>
          </div>
          <BlurTypeReveal
            as="h1"
            id="hero-title-es"
            className="hero-title mt-6 max-w-full break-words font-display sm:mt-7"
            style={{ fontSize: "clamp(2.55rem, 12vw, 5.2rem)" }}
            text={"Test de mecanografía gratis.\nMide tu velocidad de escritura."}
            by="char"
            stagger={20}
            delay={120}
          />
          <BlurTypeReveal
            as="p"
            className="hero-lede mt-6 max-w-3xl break-words font-body-lg sm:mt-7"
            text="Haz un test de mecanografía online para medir tu velocidad de escritura, palabras por minuto (WPM), precisión y errores. Practica con pruebas de 1, 2, 3 o 5 minutos y mejora tus habilidades de teclado con sesiones claras y repetibles."
            by="word"
            stagger={26}
            delay={420}
            caret={false}
          />
          <div className="mt-8 flex min-w-0 flex-col items-start gap-3 animate-fade-up sm:mt-9 sm:flex-row" style={{ animationDelay: "190ms" }}>
            <a href="#tester" className="hero-primary-cta inline-flex min-h-14 max-w-full items-center justify-center rounded-full px-6 font-link transition-transform duration-200 hover:-translate-y-0.5 sm:px-7">Empezar test de mecanografía →</a>
            <a href="/es/leaderboard/" className="hero-secondary-cta inline-flex min-h-14 max-w-full items-center justify-center rounded-full border px-6 font-link transition-colors duration-200 sm:px-7">Ver clasificación</a>
          </div>
          <div className="mt-8 flex min-w-0 max-w-full flex-wrap gap-2 sm:mt-10" data-reveal-group="left" aria-label="Funciones del test de mecanografía">
            <span className="hero-feature font-caption">Test de mecanografía gratis</span>
            <span className="hero-feature font-caption">Práctica de mecanografía</span>
            <span className="hero-feature font-caption">1 / 2 / 3 / 5 minutos</span>
            <span className="hero-feature font-caption">Seguimiento de precisión</span>
          </div>
          <div className="mt-8 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-[24px] border border-current/10 sm:mt-12 sm:grid-cols-3 sm:rounded-[28px]" data-reveal-group="up" aria-label="Destacados del test">
            <div className="hero-stat premium-card"><span className="hero-stat-value font-heading-3">WPM</span><span className="hero-stat-label font-caption">Mide tu velocidad de escritura</span></div>
            <div className="hero-stat premium-card"><span className="hero-stat-value font-heading-3">95%+</span><span className="hero-stat-label font-caption">La precisión también importa</span></div>
            <div className="hero-stat premium-card"><span className="hero-stat-value font-heading-3">1–5 min</span><span className="hero-stat-label font-caption">Práctica rápida o sostenida</span></div>
          </div>
        </div>
        <div className="relative mx-auto w-full min-w-0 max-w-[560px]" data-reveal="right" aria-label="Vídeo de una cabra escribiendo">
          <div className="hero-video-shell relative w-full max-w-full overflow-hidden rounded-[28px] border border-current/10 bg-canvas-soft shadow-2xl sm:rounded-[32px]">
            <video className="block aspect-[4/5] h-auto w-full max-w-full object-cover lg:aspect-[5/6]" autoPlay muted loop playsInline preload="metadata" style={{ backgroundColor: "var(--color-canvas-soft)" }}>
              <source src="/goat-typing-on-laptop-1080p-202609030103-1_QfYbMZo0.mp4" type="video/mp4" />
              <source src="/Goat_typing_on_laptop_1080p_202609030103.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent px-4 pb-4 pt-16 sm:px-5 sm:pb-5 sm:pt-20">
              <p className="font-caption font-semibold text-white">La cabra está escribiendo.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
