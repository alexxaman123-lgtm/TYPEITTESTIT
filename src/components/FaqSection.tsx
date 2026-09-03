export const FAQS = [
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
];

export default function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="font-heading-4 text-ink">Frequently Asked Questions About Typing Tests</h2>
      <p className="mt-3 font-body text-text-muted">Clear answers about free typing tests, typing practice, WPM, accuracy, test durations, English typing, custom tests, accounts, and results.</p>

      <div className="mt-8 divide-y divide-hairline rounded-[24px] border border-hairline bg-canvas shadow-sm">
        {FAQS.map((item) => (
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
