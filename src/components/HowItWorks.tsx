import BlurTypeReveal from "./BlurTypeReveal";
import type { Locale } from "../lib/i18n";

const STEPS_EN = [
  { title: "Choose your setup", body: "Pick Easy, Medium or Hard, then choose a duration \u2014 1, 2, 3 or 5 minutes. Your preference is remembered for next time." },
  { title: "Start typing", body: "There's no separate start button to click. The timer begins automatically the moment you type the first character." },
  { title: "Type the passage", body: "Correct characters turn black, mistakes are marked in red, and a bright caret always shows your current position." },
  { title: "Get your results", body: "When the timer hits zero, FreeTypingTestGoat instantly shows your WPM, accuracy, and errors. You can take a test without signing in; account-based progress and leaderboard features require Google Sign-In." },
];

const STEPS_ES = [
  { title: "Elige tu configuraci\u00f3n", body: "Selecciona F\u00e1cil, Medio o Dif\u00edcil y despu\u00e9s una duraci\u00f3n de 1, 2, 3 o 5 minutos. Tu preferencia se recuerda para la pr\u00f3xima sesi\u00f3n." },
  { title: "Empieza a escribir", body: "No necesitas pulsar un bot\u00f3n de inicio. El cron\u00f3metro comienza autom\u00e1ticamente cuando escribes el primer car\u00e1cter." },
  { title: "Escribe el texto", body: "Los caracteres correctos permanecen en pantalla, los errores se marcan y el cursor muestra siempre tu posici\u00f3n actual." },
  { title: "Consulta tus resultados", body: "Al terminar, puedes ver WPM, precisi\u00f3n, errores y otras m\u00e9tricas. Puedes hacer la prueba sin iniciar sesi\u00f3n; algunas funciones de cuenta y clasificaci\u00f3n requieren iniciar sesi\u00f3n con Google." },
];

export default function HowItWorks({ locale = "en" as Locale }: { locale?: Locale }) {
  const isEs = locale === "es";
  const steps = isEs ? STEPS_ES : STEPS_EN;

  return (
    <section id="how-it-works" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <BlurTypeReveal as="h2" className="font-heading-4 text-ink" text={isEs ? "C\u00f3mo funciona" : "How It Works"} by="char" stagger={34} />
        <BlurTypeReveal
          as="p"
          className="mx-auto mt-3 max-w-2xl font-body text-text-muted"
          text={
            isEs
              ? "Test de mecanograf\u00eda Cabra est\u00e1 dise\u00f1ado para que entiendas la prueba en segundos: elige una dificultad, escribe, mide tu rendimiento y vuelve a practicar."
              : "FreeTypingTestGoat is built to be understood in seconds. No tutorials, no setup screens \u2014 just a fast, focused online typing speed test for practice, WPM feedback, and real improvement."
          }
          by="word"
          stagger={22}
          delay={220}
          caret={false}
        />
      </div>

      {/* Odd cards enter from the left, even cards from the right, staggered. */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" data-reveal-group="alternate">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="premium-card rounded-[24px] border border-hairline bg-canvas p-6 shadow-sm"
          >
            <span className="font-label text-accent">0{i + 1}</span>
            <h3 className="mt-3 font-heading-5 text-ink">{step.title}</h3>
            <p className="mt-2 font-body-sm text-text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
