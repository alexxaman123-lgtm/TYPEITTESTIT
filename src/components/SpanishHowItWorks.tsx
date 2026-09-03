const STEPS = [
  { title: "Elige tu configuración", body: "Selecciona Fácil, Medio o Difícil y después una duración de 1, 2, 3 o 5 minutos. Tu preferencia se recuerda para la próxima sesión." },
  { title: "Empieza a escribir", body: "No necesitas pulsar un botón de inicio. El cronómetro comienza automáticamente cuando escribes el primer carácter." },
  { title: "Escribe el texto", body: "Los caracteres correctos permanecen en pantalla, los errores se marcan y el cursor muestra siempre tu posición actual." },
  { title: "Consulta tus resultados", body: "Al terminar, puedes ver WPM, precisión, errores y otras métricas. Puedes hacer la prueba sin iniciar sesión; algunas funciones de cuenta y clasificación requieren iniciar sesión con Google." },
];

export default function SpanishHowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="font-heading-4 text-ink">Cómo funciona</h2>
        <p className="mx-auto mt-3 max-w-2xl font-body text-text-muted">Test de mecanografía Cabra está diseñado para que entiendas la prueba en segundos: elige una dificultad, escribe, mide tu rendimiento y vuelve a practicar.</p>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <div key={step.title} className="animate-fade-up rounded-[24px] border border-hairline bg-canvas p-6 shadow-sm" style={{ animationDelay: String(i * 80) + "ms" }}>
            <span className="font-label text-accent">0{i + 1}</span>
            <h3 className="mt-3 font-heading-5 text-ink">{step.title}</h3>
            <p className="mt-2 font-body-sm text-text-muted">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
