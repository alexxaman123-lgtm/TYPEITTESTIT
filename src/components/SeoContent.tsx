import type { Locale } from "../lib/i18n";

const SPEED_LEVELS_EN: Array<[string, string, string, string]> = [
  ["Developing", "0\u201329", "Build basic keyboard control, rhythm, and accuracy.", "30"],
  ["Everyday", "30\u201344", "A practical pace for routine typing and school work.", "45"],
  ["Good", "45\u201359", "A solid pace for regular writing and office tasks.", "60"],
  ["Fast", "60\u201379", "A strong practical typing speed for many writing-heavy tasks.", "80"],
  ["Advanced", "80\u201399", "High-speed typing with an emphasis on maintaining accuracy.", "100"],
  ["100+", "100+", "A very fast benchmark reached by highly skilled typists.", "\u2014"],
];

const SPEED_LEVELS_ES: Array<[string, string, string, string]> = [
  ["En desarrollo", "0\u201329", "Construye control básico del teclado, ritmo y precisión.", "30"],
  ["Cotidiana", "30\u201344", "Velocidad práctica para tareas habituales y estudio.", "45"],
  ["Buena", "45\u201359", "Ritmo sólido para escritura y tareas de oficina.", "60"],
  ["Rápida", "60\u201379", "Velocidad práctica alta para muchas tareas de escritura.", "80"],
  ["Avanzada", "80\u201399", "Alta velocidad con atención a mantener la precisión.", "100"],
  ["100+", "100+", "Un nivel muy rápido alcanzado por mecanógrafos con mucha práctica.", "\u2014"],
];

function SpeedChart({ locale }: { locale: Locale }) {
  const isEs = locale === "es";
  const rows = isEs ? SPEED_LEVELS_ES : SPEED_LEVELS_EN;
  return (
    <div id="typing-speed-levels" className="scroll-mt-20 mt-16 pt-8 border-t border-hairline">
      <h2>{isEs ? "Tabla orientativa de velocidad de escritura" : "Typing Speed Chart"}</h2>
      <p>
        {isEs
          ? "La velocidad puede variar según la dificultad del texto, la duración, la familiaridad con las palabras y la concentración. Utiliza estos rangos como una referencia práctica, no como una calificación estricta."
          : "WPM is a helpful benchmark, but it should be interpreted alongside accuracy and the conditions of the test. The ranges below are practical reference points, not strict grades or requirements. Your personal baseline and improvement over repeated tests are often more useful than comparison with a single number."}
      </p>
      <div className="mt-6 overflow-hidden rounded-[24px] border border-hairline bg-canvas shadow-sm">
        <div className="grid grid-cols-3 border-b border-hairline bg-canvas-soft px-4 py-3 font-caption text-text-muted sm:grid-cols-4">
          <span>{isEs ? "Nivel" : "Level"}</span>
          <span>WPM</span>
          <span className="col-span-1 hidden sm:block">{isEs ? "Qué significa" : "What it means"}</span>
          <span>{isEs ? "Siguiente objetivo" : "Next target"}</span>
        </div>
        {rows.map(([level, range, meaning, next]) => (
          <div key={level} className="grid grid-cols-3 items-center gap-3 border-b border-hairline px-4 py-4 last:border-b-0 sm:grid-cols-4">
            <span className="font-heading-6 text-ink">{level}</span>
            <span className="font-mono font-bold text-accent">{range}</span>
            <span className="col-span-1 hidden font-body-sm text-text-muted sm:block">{meaning}</span>
            <span className="text-right font-body-sm font-semibold text-text-muted">{next === "\u2014" ? "\u2014" : `\u2191 ${next} WPM`}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnglishContent() {
  return (
    <>
      <div>
        <h2>What Is a Free Typing Test?</h2>
        <p>
          A <strong>free typing test</strong> is a practical way to find out how quickly and accurately you can type on a keyboard. Instead of estimating your speed, you type a passage for a set amount of time and receive measurable results. The most useful results are your words per minute (WPM), typing accuracy, errors, and other performance details that show how well speed and control work together.
        </p>
        <p>
          FreeTypingTestGoat is an <strong>online typing test</strong> designed to make that process simple. You can begin from the homepage, choose a difficulty and duration, type directly in your browser, and review your result when the session ends. The core test does not require an account, making it suitable for a quick benchmark as well as regular <strong>typing test practice</strong>.
        </p>
      </div>

      <div>
        <h2>How the Online Typing Test Works</h2>
        <p>
          Choose Easy, Medium, or Hard difficulty and select the amount of time you want to practice. When you start entering the displayed passage, the test measures your typing activity while the live interface keeps you focused on the text and keyboard. You can also switch to the custom test option when you want to practice with text of your own.
        </p>
        <p>
          During the session, live metrics give you feedback on your current pace and accuracy. At the end, the result panel brings the important measurements together so you can understand how the attempt went. This makes the tool useful both as a <strong>speed typing test</strong> and as a repeatable practice exercise.
        </p>
      </div>

      <div>
        <h3>How WPM and Typing Accuracy Are Measured</h3>
        <p>
          WPM stands for <strong>words per minute</strong> and is one of the most common ways to describe typing speed. The test uses the standard five-character word convention, which helps make scores comparable across passages. In simple terms, the number of characters you type and the time spent typing are used to calculate your pace.
        </p>
        <p>
          Accuracy adds an important second dimension. It reflects how closely your typed characters match the target text, so mistakes reduce the accuracy result. Looking at WPM and accuracy together is more informative than pursuing speed alone. A slightly slower result with consistently correct keystrokes can be a better indication of efficient typing than a faster attempt filled with errors.
        </p>
      </div>

      <div>
        <h2>Use Typing Test Practice to Improve Your Skills</h2>
        <p>
          The most useful <strong>typing test practice</strong> is consistent and purposeful. Take several tests over time rather than treating one score as a final grade. Keep the difficulty and duration consistent when you want to compare progress, then increase the challenge after the current level becomes comfortable. This turns a simple test into a repeatable way to work on keyboard control, rhythm, and accuracy.
        </p>
        <p>
          For better results, focus on clean keystrokes before trying to force a higher number. Keep your hands relaxed, pay attention to words that repeatedly cause mistakes, and allow speed to develop as accuracy becomes more reliable. A regular practice typing test can be useful for students, beginners, professionals, and adults who want a measurable way to build or refresh everyday keyboard skills.
        </p>
      </div>

      <div>
        <h3>Choose a 1, 2, 3, or 5 Minute Typing Test</h3>
        <p>Different practice sessions suit different goals. FreeTypingTestGoat currently offers four standard durations:</p>
        <ul>
          <li><strong>1 minute typing test:</strong> A quick benchmark, warm-up, or daily check when you want useful feedback without a long session.</li>
          <li><strong>2 minute test:</strong> A balanced session for practicing pace while still keeping the exercise short.</li>
          <li><strong>3 minute test:</strong> Helpful when you want to work on consistency and maintain your rhythm for longer.</li>
          <li><strong>5 minute typing test:</strong> A longer session for sustained typing speed, accuracy, and endurance.</li>
        </ul>
        <p>
          Short tests make it easy to repeat several focused attempts, while a longer session can reveal whether you can maintain your typing speed after the initial burst. Choose the duration that matches your goal instead of assuming that a longer test is always better.
        </p>
      </div>

      <div>
        <h2>English Typing and Keyboard Practice</h2>
        <p>
          The standard typing passages on this site are in English, so the homepage can also be used as an <strong>English typing test</strong>. Practicing with ordinary words and sentences helps you measure how comfortably you type English text on a standard keyboard without needing separate software.
        </p>
        <p>
          Because the exercise happens directly through your keyboard, it also provides focused <strong>keyboard typing practice</strong>. Try to look at the screen rather than the keys, maintain a consistent finger position, and correct recurring weak spots through repetition. Over time, these habits can make everyday writing feel more natural and controlled.
        </p>
      </div>

      <div>
        <h2>Who Can Use a Free Online Typing Test?</h2>
        <p>
          A <strong>free online typing test</strong> can be useful at almost any skill level. Beginners can start with Easy passages and concentrate on accurate keystrokes. Students can use short sessions as part of study or keyboard practice. Professionals can benchmark their current speed before work that involves substantial typing, while adults can use the test to refresh skills they have not practiced recently.
        </p>
        <p>
          The tool is also useful for anyone who is simply curious about their current WPM. Since a basic test can be started without signing in, you can use it for an occasional speed check or return regularly and compare your performance. Account features are available for users who want to save qualifying progress and participate in the public leaderboard.
        </p>
      </div>

      <div>
        <h2>What Makes a Useful Typing Test?</h2>
        <p>
          A useful <strong>typing test</strong> should make the result easy to understand and the practice easy to repeat. FreeTypingTestGoat combines timed passages, difficulty choices, live feedback, and a results view so you can see more than a single speed number. You can also use the custom test option when a particular passage or piece of text is more relevant to your practice.
        </p>
        <p>
          There is no single WPM score that defines a good typist. Your result depends on the passage, difficulty, duration, familiarity with the words, and concentration. The best way to use a WPM typing test is to compare your own results under similar conditions and aim for steady improvement without sacrificing accuracy.
        </p>
      </div>
    </>
  );
}

function SpanishContent() {
  return (
    <>
      <div>
        <h2>Test de mecanografía online gratis</h2>
        <p>Un <strong>test de mecanografía</strong> es una forma sencilla de medir la velocidad y precisión con la que escribes en el teclado. En FreeTypingTestGoat puedes hacer un <strong>test de mecanografía gratis</strong> directamente desde el navegador y obtener un resultado claro de palabras por minuto (WPM), precisión y errores.</p>
        <p>El objetivo no es solo escribir rápido, sino escribir de forma constante y con pocos errores. Por eso este <strong>test de mecanografía online</strong> combina velocidad y precisión para que puedas comparar tus resultados entre sesiones y mejorar con práctica regular.</p>
      </div>
      <div>
        <h2>¿Cómo funciona el test de mecanografía?</h2>
        <p>Elige un nivel de dificultad y una duración de 1, 2, 3 o 5 minutos. Cuando escribes el primer carácter, el cronómetro comienza automáticamente. Mientras escribes, el sistema compara tus caracteres con el texto objetivo y muestra tu rendimiento en tiempo real.</p>
        <p>Al finalizar, puedes consultar WPM, precisión, errores, palabras escritas y otros datos del test. También puedes repetir la prueba, cambiar el nivel, elegir un texto nuevo o utilizar un texto personalizado.</p>
      </div>
      <div>
        <h2>Velocidad de escritura, WPM y precisión</h2>
        <p>WPM significa <strong>palabras por minuto</strong> y es una medida habitual de la velocidad de escritura. El cálculo utiliza el estándar de cinco caracteres por palabra para que los resultados sean comparables entre diferentes textos y sesiones.</p>
        <p>La <strong>precisión de escritura</strong> indica cuánto de lo que escribiste coincide con el texto objetivo. Un WPM alto con muchos errores puede ser menos útil que una velocidad algo menor con una precisión estable. Practicar ambas métricas ayuda a construir una escritura más eficiente.</p>
      </div>
      <div>
        <h2>Práctica de mecanografía para mejorar</h2>
        <p>Una buena rutina de <strong>práctica de mecanografía</strong> consiste en repetir pruebas, mantener una técnica estable y observar la tendencia de tus resultados. Empieza con un nivel cómodo, prioriza la precisión y aumenta la velocidad poco a poco.</p>
        <p>Puedes utilizar el test para estudiar, prepararte para una evaluación de teclado, practicar para tareas de oficina o simplemente conocer tu velocidad actual. Las sesiones cortas son útiles para practicar con frecuencia, mientras que las sesiones largas ayudan a desarrollar constancia y resistencia.</p>
      </div>
      <div>
        <h3>Prueba de mecanografía de 1, 2, 3 o 5 minutos</h3>
        <ul>
          <li><strong>1 minuto:</strong> una prueba de velocidad rápida para calentamiento y comprobaciones frecuentes.</li>
          <li><strong>2 minutos:</strong> una sesión equilibrada para medir velocidad y precisión durante más tiempo.</li>
          <li><strong>3 minutos:</strong> útil para comprobar la estabilidad del ritmo y la concentración.</li>
          <li><strong>5 minutos:</strong> una prueba más larga para practicar resistencia, precisión y velocidad sostenida.</li>
        </ul>
        <p>Puedes repetir cualquiera de estas duraciones. Mantener la misma duración durante varias sesiones facilita comparar tu progreso.</p>
      </div>
      <div>
        <h2>Mecanografía en español</h2>
        <p>Esta versión en español está pensada para quienes quieren practicar <strong>mecanografía en español</strong> y medir su velocidad con textos en español. Las palabras, acentos y signos del idioma forman parte del contenido de práctica para ofrecer una experiencia más relevante a los usuarios hispanohablantes.</p>
        <p>Además de la búsqueda general de un test de mecanografía, algunos usuarios necesitan una prueba de un minuto, una práctica de velocidad, una prueba de texto en español o una sesión centrada en precisión. Esta página reúne esas necesidades dentro de una misma herramienta para evitar crear páginas separadas con contenido prácticamente idéntico.</p>
      </div>
      <div>
        <h2>Variaciones y tipos de test</h2>
        <p>Según el objetivo, una persona puede buscar una prueba de escritura, una prueba de velocidad de teclado, una práctica de mecanografía en línea o una sesión con diferentes formatos de texto. También existen necesidades específicas relacionadas con teclados numéricos, distribuciones como Dvorak o textos sin acentos.</p>
        <p>El sitio se centra en una experiencia sencilla y medible desde el navegador: elegir la dificultad y duración, practicar, revisar WPM y precisión y repetir la sesión para comprobar la mejora. Cuando necesitas un formato concreto, el modo de texto personalizado permite adaptar la práctica sin crear una página independiente para cada variante.</p>
      </div>
      <div>
        <h2>¿Para quién sirve un test de mecanografía?</h2>
        <p>Un <strong>test de mecanografía</strong> puede servir a principiantes, estudiantes, profesionales y a cualquier persona que quiera conocer su velocidad. Los principiantes pueden empezar con una dificultad sencilla, mientras que los usuarios con más experiencia pueden utilizar niveles superiores para comprobar su consistencia.</p>
        <p>No necesitas iniciar sesión para realizar una prueba. Las funciones de cuenta, como guardar determinados resultados y participar en la clasificación pública, pueden utilizar Google Sign-In.</p>
      </div>
    </>
  );
}

export default function SeoContent({ locale = "en" as Locale }: { locale?: Locale }) {
  return (
    <section id="typing-practice" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="font-body text-text-muted space-y-12 [&_h2]:font-heading-4 [&_h2]:text-ink [&_h3]:font-heading-5 [&_h3]:text-ink [&_h3]:mt-8 [&_p]:mt-3 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_strong]:text-ink [&_strong]:font-semibold">
        {locale === "es" ? <SpanishContent /> : <EnglishContent />}
        <SpeedChart locale={locale} />
      </div>
    </section>
  );
}
