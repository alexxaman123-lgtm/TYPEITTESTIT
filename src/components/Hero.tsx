import BlurTypeReveal from "./BlurTypeReveal";
import type { Locale } from "../lib/i18n";

export default function Hero({ locale = "en" as Locale }: { locale?: Locale }) {
  const isEs = locale === "es";

  return (
    <section
      className="hero-banner relative w-full overflow-hidden px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-10 lg:px-8 lg:pb-28"
      aria-labelledby={isEs ? "hero-title-es" : "hero-title"}
    >
      <div className="hero-banner-grid" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-0 w-full max-w-7xl items-center gap-8 py-10 sm:min-h-[720px] sm:gap-10 sm:py-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-14">
        <div className="min-w-0 w-full max-w-4xl">
          <div className="animate-fade-up flex min-w-0 flex-wrap items-center gap-2 sm:gap-3" style={{ animationDelay: "40ms" }}>
            <span className="hero-kicker min-w-0 max-w-full truncate font-label">{isEs ? "TEST DE MECANOGRAF\u00cdA" : "FREE TYPING TEST"}</span>
            <span className="hero-kicker-muted min-w-0 max-w-full truncate font-caption">{isEs ? "WPM \u00b7 PRECISI\u00d3N \u00b7 VELOCIDAD" : "WPM \u00b7 ACCURACY \u00b7 SPEED"}</span>
          </div>

          {/* Letter-by-letter blur-to-focus reveal: the headline types itself in. */}
          <BlurTypeReveal
            as="h1"
            id={isEs ? "hero-title-es" : "hero-title"}
            className="hero-title mt-6 max-w-full break-words font-display sm:mt-7"
            style={isEs ? { fontSize: "clamp(2.55rem, 12vw, 5.2rem)" } : undefined}
            text={isEs ? "Test de mecanograf\u00eda gratis.\nMide tu velocidad de escritura." : "Free Typing Test Online.\nMeasure Your WPM."}
            by="char"
            stagger={isEs ? 20 : 22}
            delay={120}
          />

          {/* Word-by-word so a long paragraph resolves quickly but still softly. */}
          <BlurTypeReveal
            as="p"
            className="hero-lede mt-6 max-w-3xl break-words font-body-lg sm:mt-7"
            text={
              isEs
                ? "Haz un test de mecanograf\u00eda online para medir tu velocidad de escritura, palabras por minuto (WPM), precisi\u00f3n y errores. Practica con pruebas de 1, 2, 3 o 5 minutos y mejora tus habilidades de teclado con sesiones claras y repetibles."
                : "Take a free typing test online to measure your typing speed, words per minute, accuracy, and errors. Practice with 1, 2, 3, or 5 minute tests and build faster, more confident keyboard skills."
            }
            by="word"
            stagger={26}
            delay={420}
            caret={false}
          />

          <div className="mt-8 flex min-w-0 flex-col items-start gap-3 animate-fade-up sm:mt-9 sm:flex-row" style={{ animationDelay: "190ms" }}>
            <a
              href="#tester"
              className="hero-primary-cta inline-flex min-h-14 max-w-full items-center justify-center rounded-full px-6 font-link transition-transform duration-200 hover:-translate-y-0.5 sm:px-7"
            >
              {isEs ? "Empezar test de mecanograf\u00eda \u2192" : "Start Free Typing Test \u2192"}
            </a>
            <a
              href={isEs ? "/es/leaderboard/" : "/leaderboard"}
              className="hero-secondary-cta inline-flex min-h-14 max-w-full items-center justify-center rounded-full border px-6 font-link transition-colors duration-200 sm:px-7"
            >
              {isEs ? "Ver clasificaci\u00f3n" : "View Leaderboard"}
            </a>
          </div>

          <div
            className="mt-8 flex min-w-0 max-w-full flex-wrap gap-2 sm:mt-10"
            data-reveal-group="left"
            aria-label={isEs ? "Funciones del test de mecanograf\u00eda" : "Typing test features"}
          >
            <span className="hero-feature font-caption">{isEs ? "Test de mecanograf\u00eda gratis" : "Free typing test WPM"}</span>
            <span className="hero-feature font-caption">{isEs ? "Pr\u00e1ctica de mecanograf\u00eda" : "Typing test practice"}</span>
            <span className="hero-feature font-caption">{isEs ? "1 / 2 / 3 / 5 minutos" : "1 / 2 / 3 / 5 minute tests"}</span>
            <span className="hero-feature font-caption">{isEs ? "Seguimiento de precisi\u00f3n" : "Accuracy tracking"}</span>
          </div>

          <div
            className="mt-8 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-[24px] border border-current/10 sm:mt-12 sm:grid-cols-3 sm:rounded-[28px]"
            data-reveal-group="up"
            aria-label={isEs ? "Destacados del test" : "Typing test highlights"}
          >
            <div className="hero-stat premium-card">
              <span className="hero-stat-value font-heading-3">WPM</span>
              <span className="hero-stat-label font-caption">{isEs ? "Mide tu velocidad de escritura" : "Measure your typing speed"}</span>
            </div>
            <div className="hero-stat premium-card">
              <span className="hero-stat-value font-heading-3">{isEs ? "95%+" : "Accuracy"}</span>
              <span className="hero-stat-label font-caption">{isEs ? "La precisi\u00f3n tambi\u00e9n importa" : "See speed and accuracy together"}</span>
            </div>
            <div className="hero-stat premium-card">
              <span className="hero-stat-value font-heading-3">1\u20135 min</span>
              <span className="hero-stat-label font-caption">{isEs ? "Pr\u00e1ctica r\u00e1pida o sostenida" : "Quick or sustained practice"}</span>
            </div>
          </div>
        </div>

        <div
          className="relative mx-auto w-full min-w-0 max-w-[560px] lg:max-w-none"
          data-reveal="right"
          aria-label={isEs ? "V\u00eddeo de una cabra escribiendo" : "Goat typing video"}
        >
          <div className="hero-video-shell relative w-full max-w-full overflow-hidden rounded-[28px] border border-current/10 bg-canvas-soft shadow-2xl sm:rounded-[32px]">
            <video
              className="block aspect-[4/5] h-auto w-full max-w-full object-cover lg:aspect-[5/6]"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={isEs ? undefined : "Animated goat typing on a laptop"}
              style={{ backgroundColor: "var(--color-canvas-soft)" }}
            >
              <source src="/goat-typing-on-laptop-1080p-202609030103-1_QfYbMZo0.mp4" type="video/mp4" />
              <source src="/Goat_typing_on_laptop_1080p_202609030103.mp4" type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent px-4 pb-4 pt-16 sm:px-5 sm:pb-5 sm:pt-20">
              <p className="font-caption font-semibold text-white">{isEs ? "La cabra est\u00e1 escribiendo." : "The GOAT is typing."}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
