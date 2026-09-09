import type { Locale } from "../lib/i18n";

type Faq = { q: string; a: string };

export const FAQS_BY_LOCALE: Record<Locale, Faq[]> = {
  en: [
    {
      q: "What is a free typing test?",
      a: "A <strong>free typing test</strong> measures how quickly and accurately you can type by asking you to enter displayed text for a set amount of time. FreeTypingTestGoat reports useful results such as WPM, accuracy, errors, and words written, so you can understand both your pace and your control. The core test can be taken online without paying for access.",
    },
    {
      q: "How can I use this for typing test practice?",
      a: "Use the test as a repeatable <strong>typing test practice</strong> routine: choose a duration and difficulty, complete an attempt, review your WPM and accuracy, then try again after identifying areas to improve. Keeping the same settings for several sessions makes it easier to see genuine progress before increasing the difficulty or changing the duration.",
    },
    {
      q: "What is WPM in a typing test?",
      a: "WPM means <strong>words per minute</strong> and is a standard way to describe typing speed. The test uses the common five-character convention for a word, so your score is based on the amount of text typed relative to the time spent typing. WPM is most useful when considered together with accuracy rather than as a speed number on its own.",
    },
    {
      q: "How is typing accuracy calculated?",
      a: "Typing accuracy reflects how closely the characters you enter match the target text. Correct characters contribute to a higher accuracy result, while incorrect characters reduce it. Looking at accuracy alongside WPM helps you tell the difference between typing faster and typing efficiently, because a high-speed attempt with many mistakes is not necessarily a better performance.",
    },
    {
      q: "What is a good typing speed?",
      a: "There is no single WPM score that is right for everyone. A useful typing speed depends on the work you do, the difficulty of the text, and how accurately you can maintain the pace. Use the speed chart as a general reference, but compare your own results under similar conditions and aim for steady improvement without sacrificing accuracy.",
    },
    {
      q: "How long is the typing test?",
      a: "You can choose <strong>1, 2, 3, or 5 minute</strong> tests. A one minute typing test is convenient for a quick benchmark or daily warm-up. Two- and three-minute sessions give you more time to settle into a consistent rhythm, while a five-minute typing test is useful for practicing sustained pace and endurance.",
    },
    {
      q: "Is there a 1 minute typing test?",
      a: "Yes. The site includes a <strong>1 minute typing test</strong> that measures your performance over a short, focused session. It is useful when you want a quick speed check or a practice session that is easy to repeat. For a longer view of consistency, you can switch to the 2, 3, or 5 minute options.",
    },
    {
      q: "Can I take the typing test online for free?",
      a: "Yes. FreeTypingTestGoat provides an <strong>online typing test</strong> that runs in a modern web browser. You do not need to install separate typing software to complete the standard test, and the core typing experience is available without a paid subscription.",
    },
    {
      q: "Can I use this as an English typing test?",
      a: "Yes. The standard passages are in English, so the homepage can be used as an <strong>English typing test</strong> for measuring speed and accuracy while typing English text. It is also useful for keyboard practice because the exercise takes place directly in the browser using your keyboard.",
    },
    {
      q: "Can children and adults use this typing test?",
      a: "Yes. The test is suitable for beginners, students, adults, and professionals who want to measure or practice keyboard skills. Beginners can start with the Easy difficulty, while experienced typists can choose Medium or Hard. Shorter sessions can be convenient for younger learners or anyone who prefers brief practice periods.",
    },
    {
      q: "Can I use my own text for typing practice?",
      a: "Yes. The homepage includes a <strong>custom typing test</strong> option that lets you paste your own text and practice with it. This can be useful when you want to work with material that resembles what you type for school, work, writing, or another specific task instead of using the standard passages.",
    },
    {
      q: "Do I need an account to take a typing test?",
      a: "No. You can take the standard typing test without signing in. Account features are available for users who want to save qualifying progress and participate in the public leaderboard, but an account is not required simply to practice or check your typing speed.",
    },
    {
      q: "Can I save my typing results?",
      a: "Account features can save qualifying progress and leaderboard results. Anonymous test sessions are not saved to an account. If you want to compare your performance over time, using an account and keeping your practice conditions consistent can make those comparisons more useful.",
    },
    {
      q: "How can I improve my typing speed?",
      a: "Practice regularly and prioritize accuracy before trying to increase your pace. Keep your hands relaxed, work on recurring mistakes, and use a consistent test duration when comparing results. A useful goal is to gradually raise WPM while keeping accuracy stable or improving it. Repeated short sessions can be easier to maintain than occasional long practice sessions.",
    },
    {
      q: "Does FreeTypingTestGoat provide a typing certificate?",
      a: "No. FreeTypingTestGoat currently focuses on measuring and practicing typing speed rather than issuing a typing certificate. Your results can show performance metrics such as WPM and accuracy, but the site should not be treated as a certification service.",
    },
  ],
  es: [
    {
      q: "¿Cómo aprender mecanografía fácil y rápido?",
      a: "La forma más eficaz de aprender mecanografía es practicar de manera constante, empezar con precisión y acostumbrar los dedos a las teclas sin mirar el teclado. Las sesiones cortas y repetidas con un test de mecanografía ayudan a crear memoria muscular y mejorar poco a poco la velocidad.",
    },
    {
      q: "¿Qué hace un mecanógrafo?",
      a: "Un mecanógrafo escribe textos con un teclado de forma rápida y precisa. La mecanografía se utiliza en tareas de oficina, estudio, atención al cliente, programación y cualquier actividad que requiera introducir texto con frecuencia.",
    },
    {
      q: "¿Qué significa mecanografiado?",
      a: "Mecanografiado significa que un texto ha sido escrito mediante un teclado. La mecanografía se refiere a la técnica y práctica de escribir de forma eficiente con el teclado.",
    },
    {
      q: "¿Cuánto tiempo se tarda en aprender mecanografía?",
      a: "El tiempo depende de tu experiencia y de la frecuencia con la que practiques. Con sesiones regulares puedes mejorar la precisión y la velocidad de forma gradual; lo más importante es practicar de manera constante en lugar de intentar alcanzar una velocidad máxima desde el principio.",
    },
    {
      q: "¿Cuáles son los 5 mejores programas para aprender mecanografía?",
      a: "La mejor herramienta depende del tipo de práctica que buscas. Para medir velocidad, precisión y progreso, un test de mecanografía online ofrece una forma sencilla de comprobar tu rendimiento en sesiones de duración controlada.",
    },
    {
      q: "¿Qué ejercicios puedo hacer para practicar mecanografía?",
      a: "Puedes practicar con palabras frecuentes, frases, textos variados y pruebas cronometradas. Alternar ejercicios de precisión con un test de mecanografía de 1, 2, 3 o 5 minutos ayuda a trabajar tanto el control como la velocidad.",
    },
    {
      q: "¿Cuántos tipos de mecanografía hay?",
      a: "La práctica de mecanografía puede variar según la técnica, el teclado y el objetivo. Por ejemplo, puedes trabajar mecanografía táctil, velocidad, precisión, teclado numérico o diferentes distribuciones de teclado.",
    },
    {
      q: "¿Cuál es la mejor forma de aprender mecanografía?",
      a: "Una buena estrategia es aprender la posición de las teclas, utilizar los dedos de forma consistente, priorizar la precisión y practicar con regularidad. Un test de mecanografía te permite medir si tu velocidad y precisión mejoran con el tiempo.",
    },
    {
      q: "¿Qué beneficios trae la mecanografía?",
      a: "Una mejor técnica de mecanografía puede ayudarte a escribir con más fluidez, reducir errores, trabajar con mayor eficiencia y sentirte más cómodo al utilizar un teclado durante periodos largos.",
    },
    {
      q: "¿Cómo escribir en mecanografía?",
      a: "Coloca las manos de forma estable, utiliza los dedos de manera consistente y evita mirar continuamente el teclado. Empieza a un ritmo que puedas controlar y aumenta la velocidad cuando tu precisión sea estable.",
    },
    {
      q: "¿Cuál es el origen de la mecanografía?",
      a: "La mecanografía moderna se desarrolló junto con las máquinas de escribir y posteriormente con los teclados de ordenador. Las técnicas actuales de escritura al tacto evolucionaron para facilitar una entrada de texto rápida y sistemática.",
    },
    {
      q: "¿Cuáles son las técnicas de mecanografía?",
      a: "Entre las técnicas más habituales están la escritura al tacto, la práctica por filas del teclado, los ejercicios centrados en precisión y los ejercicios de velocidad. La técnica adecuada depende del teclado y del objetivo de cada persona.",
    },
  ],
};

const HEADING: Record<Locale, string> = {
  en: "Frequently Asked Questions About Typing Tests",
  es: "Preguntas frecuentes sobre mecanografía",
};

const INTRO: Record<Locale, string> = {
  en: "Clear answers about free typing tests, typing practice, WPM, accuracy, test durations, English typing, custom tests, accounts, and results.",
  es: "Respuestas sobre tests de mecanografía, velocidad de escritura, WPM, precisión y práctica con teclado.",
};

export default function FaqSection({ locale = "en" as Locale }: { locale?: Locale }) {
  const faqs = FAQS_BY_LOCALE[locale];
  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="font-heading-4 text-ink">{HEADING[locale]}</h2>
      <p className="mt-3 font-body text-text-muted">{INTRO[locale]}</p>

      <div className="mt-8 divide-y divide-hairline rounded-[24px] border border-hairline bg-canvas shadow-sm">
        {faqs.map((item) => (
          <details key={item.q} className="group px-6 py-5 open:pb-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-left font-heading-5 text-ink marker:content-none">
              {item.q}
              <span className="shrink-0 text-lg text-accent transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 font-body text-text-muted [&_strong]:font-semibold [&_strong]:text-ink" dangerouslySetInnerHTML={{ __html: item.a }}></p>
          </details>
        ))}
      </div>
    </section>
  );
}
