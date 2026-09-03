export const SPANISH_FAQS = [
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
];

export default function SpanishFaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="font-heading-4 text-ink">Preguntas frecuentes sobre mecanografía</h2>
      <p className="mt-3 font-body text-text-muted">Respuestas sobre tests de mecanografía, velocidad de escritura, WPM, precisión y práctica con teclado.</p>
      <div className="mt-8 divide-y divide-hairline rounded-[24px] border border-hairline bg-canvas shadow-sm">
        {SPANISH_FAQS.map((item) => (
          <details key={item.q} className="group px-6 py-5 open:pb-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-left font-heading-5 text-ink marker:content-none">
              {item.q}<span className="shrink-0 text-lg text-accent transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 font-body text-text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
