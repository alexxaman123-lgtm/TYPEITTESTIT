const FAQS = [
  {
    q: "What is GOATTYPE?",
    a: "GOATTYPE is a free typing test and practice tool. It measures your typing speed (WPM), typing accuracy, and errors while you practice with timed passages at different difficulty levels.",
  },
  {
    q: "How does the online typing test work?",
    a: "A typing speed test measures how quickly and accurately you can type. When you start, we track every character you type and report your words per minute (WPM), accuracy percentage, and error count once the timer ends.",
  },
  {
    q: "How is WPM calculated in a typing speed test?",
    a: "We use the standard character-based WPM calculation. One word is represented by five typed characters. Our wpm typing test displays your live speed so you can compare your pace while ensuring high accuracy.",
  },
  {
    q: "Is this a free typing test?",
    a: "Yes! GOATTYPE is a completely free typing test practice platform. You do not need to pay or even create an account to take a test. Google Sign-In is strictly optional for users who want to save their progress.",
  },
  {
    q: "Should I take a 1 minute typing test or something longer?",
    a: "A 1 minute typing test is perfect for a fast benchmark and quick daily typing test practice. However, if you want to test your endurance, we recommend longer durations like a 5-minute test to see if you can maintain your typing speed and accuracy.",
  },
  {
    q: "Is there a free typing test for kids or beginners?",
    a: "Yes. Our 'Easy' difficulty level is perfect as a free typing test for kids and beginners. It features shorter words and simple punctuation, making it ideal for learning touch typing before moving on to advanced vocabulary.",
  },
  {
    q: "Can adults and professionals use this tool?",
    a: "Absolutely. Our 'Hard' mode is a rigorous typing test for adults and professionals. It includes complex punctuation, capitalization, and technical vocabulary to challenge even elite typists.",
  },
  {
    q: "Is this an English typing test?",
    a: "Currently, our primary focus is providing an English typing test. All generated passages, quotes, and word lists are written in English to help you practice standard English vocabulary.",
  },
  {
    q: "Do you offer typing test games?",
    a: "We do not offer traditional typing test games with animations. Our platform is a distraction-free, professional environment designed for serious practice, much like minimalist typing testers, helping you focus purely on improving your word typing test performance.",
  },
  {
    q: "Can I get a typing test with a certificate?",
    a: "Currently, GOATTYPE does not issue official certificates. Our tool is best used for free typing test practice to improve your skills and prepare for official certification exams offered by employers or educational institutions.",
  },
  {
    q: "How can I improve my typing accuracy?",
    a: "Accuracy is the percentage of correctly typed characters. The best way to improve is to slow down, focus on correct finger placement on the keyboard, and gradually increase your speed. Consistent typing test practice is key.",
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
      <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Frequently Asked Questions</h2>
      <p className="mt-3 text-muted">Common questions about taking a free typing test, measuring WPM, and getting the most out of your typing test practice.</p>
      
      <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-surface1/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
        {FAQS.map((item) => (
          <details key={item.q} className="group px-5 py-4 open:pb-5 sm:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-left font-semibold text-ink-soft marker:content-none">
              {item.q}
              <span className="shrink-0 text-lg text-accent transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 leading-7 text-muted">{item.a}</p>
          </details>
        ))}
      </div>
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
