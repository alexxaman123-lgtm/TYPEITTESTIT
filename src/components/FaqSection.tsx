const FAQS = [
  {
    q: "What is a free typing test?",
    a: "A free typing test measures how quickly and accurately you can type a passage within a set time. FreeTypingTestGoat reports useful results such as WPM, typing accuracy, and errors so you can understand your current performance and practice again.",
  },
  {
    q: "How does the online typing test work?",
    a: "Choose a difficulty and test duration, then start typing the displayed passage. The timer begins when you start typing, live metrics update during the test, and the result panel shows your final performance when the test ends.",
  },
  {
    q: "What is WPM in a typing speed test?",
    a: "WPM means words per minute. The test uses the common five-character standard for a word, allowing typing speed to be calculated consistently from the characters you type and the time taken.",
  },
  {
    q: "Is FreeTypingTestGoat free to use?",
    a: "Yes. You can take a typing test without paying and without signing in. Google Sign-In is optional for account-based features such as saving progress and participating in the leaderboard.",
  },
  {
    q: "What is the best length for a 1 minute typing test?",
    a: "A 1 minute typing test is a convenient benchmark because it is long enough to produce a useful WPM result while remaining quick to repeat. It works well for daily practice and short speed checks.",
  },
  {
    q: "Is there a typing test for kids and beginners?",
    a: "Yes. The Easy difficulty level is suitable for beginners and can be used by younger learners who are becoming familiar with keyboard typing. Choose a short duration and focus on accurate keystrokes before increasing speed.",
  },
  {
    q: "Can adults and professionals use the typing test?",
    a: "Yes. Adults, students, and professionals can use the different difficulty levels and timed sessions to benchmark their current typing speed, accuracy, and consistency.",
  },
  {
    q: "Does FreeTypingTestGoat provide an English typing test?",
    a: "Yes. The standard test uses English passages and vocabulary, making it suitable for English typing practice and keyboard speed checks.",
  },
  {
    q: "Does FreeTypingTestGoat have typing test games?",
    a: "The site is focused on timed typing practice rather than traditional game-style typing experiences. You can use the test repeatedly to improve speed, accuracy, and consistency.",
  },
  {
    q: "Can I get a typing test with a certificate?",
    a: "No. FreeTypingTestGoat does not currently issue official typing certificates. It is intended for free typing practice and performance measurement rather than certification.",
  },
  {
    q: "How can I improve my typing accuracy?",
    a: "Start by prioritizing correct keystrokes over speed. Repeat short tests, keep your hands positioned consistently, and gradually increase your pace while maintaining a high accuracy percentage.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="font-heading-4 text-ink">Frequently Asked Questions</h2>
      <p className="mt-3 font-body text-text-muted">Answers about free typing tests, WPM, accuracy, typing test practice, durations, and using FreeTypingTestGoat.</p>

      <div className="mt-8 divide-y divide-hairline rounded-[24px] border border-hairline bg-canvas shadow-sm">
        {FAQS.map((item) => (
          <details key={item.q} className="group px-6 py-5 open:pb-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-1 text-left font-heading-5 text-ink marker:content-none">
              {item.q}
              <span className="shrink-0 text-lg text-accent transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 font-body text-text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
