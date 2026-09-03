export const FAQS = [
  {
    q: "How can I test my typing?",
    a: "Use the <strong>free online typing test</strong> on FreeTypingTestGoat, choose a test duration, and start typing the passage shown on screen. Your result includes <strong>WPM</strong>, accuracy, and typing errors.",
  },
  {
    q: "What is WPM in typing?",
    a: "WPM means <strong>words per minute</strong>. It is a common way to measure typing speed. FreeTypingTestGoat calculates your WPM from the text you type during a timed test.",
  },
  {
    q: "How is typing accuracy calculated?",
    a: "Typing accuracy compares the characters you enter with the characters in the test text. Correct characters increase your accuracy, while incorrect characters lower the result.",
  },
  {
    q: "What is a good typing speed?",
    a: "A good typing speed depends on your goal, the type of work you do, and how accurately you type. A useful benchmark is the combination of WPM and accuracy rather than speed alone.",
  },
  {
    q: "How long are the typing tests?",
    a: "You can choose <strong>1, 2, 3, or 5 minute</strong> tests. Shorter tests are useful for quick practice, while longer tests give you more time to work on consistency and endurance.",
  },
  {
    q: "Is FreeTypingTestGoat free to use?",
    a: "Yes. FreeTypingTestGoat is a <strong>free typing test</strong> and typing practice tool. You can take a typing test without paying for access to the core test experience.",
  },
  {
    q: "Do I need to sign in to take a typing test?",
    a: "No. You can take a typing test without signing in. Google Sign-In is used for account features such as saving progress and participating in the public leaderboard.",
  },
  {
    q: "Can I save my typing results?",
    a: "Account features can save qualifying progress and leaderboard results. Anonymous test sessions are not saved to an account.",
  },
  {
    q: "Can I use my own text for a typing test?",
    a: "Yes. The site includes a <strong>custom typing test</strong> option that lets you paste your own text and practice with it.",
  },
  {
    q: "How can I improve my typing speed?",
    a: "Practice regularly, focus on accuracy before forcing speed, keep your hands relaxed, and use varied passages. Comparing WPM and accuracy over repeated tests makes progress easier to track.",
  },
  {
    q: "What is touch typing?",
    a: "Touch typing is a technique where you use consistent finger positions to type without looking down at the keyboard. Regular practice helps build muscle memory and more efficient keystrokes.",
  },
  {
    q: "What does FreeTypingTestGoat measure?",
    a: "The typing test can measure <strong>WPM, accuracy, errors, words written, and other live typing metrics</strong>. Results vary with the selected difficulty, duration, and your typing performance.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="font-heading-4 text-ink">Frequently Asked Questions</h2>
      <p className="mt-3 font-body text-text-muted">Answers about free typing tests, WPM, accuracy, typing practice, test durations, accounts, and custom typing tests.</p>

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
