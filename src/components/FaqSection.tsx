const FAQS = [
  {
    q: "What is a typing test and how does an online typing test work?",
    a: "A typing test is a tool that measures how quickly and accurately you can type a piece of text. TYPEITTESTIT shows you a passage, tracks every character you type, and reports your words per minute (WPM), accuracy, and error count once the timer ends.",
  },
  {
    q: "How is WPM calculated in a typing speed test?",
    a: "TYPEITTESTIT shows your actual word progress and a predicted one-minute pace during the test. For standard WPM comparisons, one word is represented by five typed characters. The live display helps you compare your pace while accuracy shows how reliably you typed the passage.",
  },
  {
    q: "What is a good typing speed in WPM?",
    a: "A practical benchmark is roughly 30–44 WPM for average, 45–59 WPM for good, 60–79 WPM for fast, 80–99 WPM for excellent, and 100+ WPM for elite or competitive typing. These are guidance ranges rather than official universal grades, and accuracy matters alongside speed.",
  },
  {
    q: "Is this typing test free online?",
    a: "Yes. TYPEITTESTIT is completely free to use, requires no account or sign-up, and every core feature — easy, medium and hard tests, 1, 2, 3 and 5 minute durations, and custom text — is available immediately.",
  },
  {
    q: "What is the difference between a one minute and a five minute typing test?",
    a: "A one minute typing test gives a quick snapshot of your peak typing speed, while a five minute typing test measures endurance and consistency over a longer stretch. Longer tests tend to reveal fatigue and produce a more realistic average WPM, while shorter tests are great for quick daily practice.",
  },
  {
    q: "Can I practice typing with easy, medium, and hard tests?",
    a: "Yes. Easy mode uses short words and simple sentences, medium mode introduces longer words and more varied punctuation, and hard mode uses technical vocabulary, complex sentence structures and dense punctuation. Each difficulty pulls from its own set of passages, chosen at random each time.",
  },
  {
    q: "Can I use my own custom text for the typing test?",
    a: "Yes. Select Custom Test, paste or write any text you would like to practice with, choose a duration, and start the test. The same typing engine tracks your WPM, accuracy and errors for custom text exactly as it does for the built-in passages.",
  },
  {
    q: "How is typing accuracy calculated?",
    a: "Accuracy is the percentage of correctly typed characters out of all characters you typed, calculated as (correct characters ÷ total typed characters) × 100. Backspacing to fix a mistake changes what is counted as your final typed character at that position.",
  },
  {
    q: "How can I improve my typing speed?",
    a: "Practice regularly with varied text, focus on accuracy before speed, learn proper touch-typing finger placement, and track your personal best over time. Gradually increasing difficulty from easy to hard typing tests is one of the most effective ways to build both speed and control.",
  },
];

export default function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        Frequently Asked Questions
      </h2>
      <p className="mt-3 text-muted">
        Common questions about the TYPEITTESTIT typing tester, WPM scoring, and how to get the
        most out of your practice.
      </p>

      <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-surface1/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
        {FAQS.map((item) => (
          <details key={item.q} className="group px-5 py-4 open:pb-5 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-left font-semibold text-ink-soft marker:content-none">
              {item.q}
              <span className="shrink-0 text-lg text-accent transition-transform duration-200 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 leading-7 text-muted">{item.a}</p>
          </details>
        ))}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
