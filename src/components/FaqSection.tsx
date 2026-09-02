const FAQS = [
  {
    q: "How can I test my typing?",
    a: "You can test your typing easily using a <strong>free online typing test</strong> like <strong>FreeTypingTestGoat</strong>. Simply select a 1, 2, 3, or 5-minute test and start typing to instantly measure your <strong>WPM</strong> and <strong>typing accuracy</strong>.",
  },
  {
    q: "Is typing 37 WPM good?",
    a: "37 <strong>WPM</strong> (words per minute) is slightly below the global average of about 40 WPM. It is a functional speed for everyday tasks, but regular <strong>typing practice</strong> can easily bring you up to a faster, more efficient pace.",
  },
  {
    q: "Is 70 WPM with 2 fingers good?",
    a: "Yes, 70 <strong>WPM</strong> with just two fingers is exceptionally fast for that method! However, transitioning to 10-finger touch typing will improve your endurance and reduce hand strain during long <strong>typing practice</strong> sessions.",
  },
  {
    q: "What is 20 WPM in typing?",
    a: "20 <strong>WPM</strong> is considered a beginner <strong>typing speed</strong>. At this pace, you are likely still searching for keys. Consistent <strong>keyboard typing practice</strong> on <strong>FreeTypingTestGoat</strong> can quickly double this speed.",
  },
  {
    q: "What is Gen Z typing?",
    a: "\"Gen Z typing\" often refers to the highly proficient thumb-typing speed on mobile devices that Generation Z exhibits, though their physical keyboard <strong>typing speed</strong> is also generally fast due to growing up with computers.",
  },
  {
    q: "Is 500 WPM possible?",
    a: "No, 500 <strong>WPM</strong> is not humanly possible on a standard QWERTY keyboard. The fastest recorded speeds are around 212 to 216 WPM. Speeds near 500 WPM are only achievable using specialized stenotype machines used by court reporters.",
  },
  {
    q: "What is Gen Z's average typing speed?",
    a: "The average <strong>typing speed</strong> for Gen Z on a physical keyboard is around 40 to 50 <strong>WPM</strong>, similar to other generations. However, they often excel at mobile thumb typing, sometimes reaching 60+ WPM on smartphones.",
  },
  {
    q: "How fast should a 20 year old type?",
    a: "A 20-year-old should ideally type between 40 and 60 <strong>WPM</strong>, which is the standard requirement for most academic and professional environments. Using a <strong>free online typing test</strong> can help you track your progress to reach this goal.",
  },
  {
    q: "Is 40 WPM too slow?",
    a: "No, 40 <strong>WPM</strong> is the average <strong>typing speed</strong> for most adults. While it isn't exceptionally fast, it is perfectly adequate for general email writing and web browsing. If you want to type faster for work, <strong>typing practice</strong> is recommended.",
  },
  {
    q: "What is basic 10 key typing?",
    a: "Basic 10-key typing refers to using the numeric keypad on the right side of a standard keyboard to enter numbers quickly, typically used for data entry, accounting, and calculations.",
  },
  {
    q: "Is a 200 WPM possible?",
    a: "Yes, 200 <strong>WPM</strong> is possible but incredibly rare. It is reserved for the top elite typists in the world. Reaching this speed requires years of dedicated <strong>typing practice</strong> and perfect <strong>typing accuracy</strong>.",
  },
  {
    q: "How can I learn to type?",
    a: "The best way to learn to type is to master the home row (ASDF JKL;) and use all 10 fingers. Combine proper technique with daily 10-15 minute sessions on a tool like <strong>FreeTypingTestGoat</strong> to build muscle memory.",
  },
  {
    q: "How fast should a 14-year-old type?",
    a: "A 14-year-old should aim for an average <strong>typing speed</strong> of about 35 to 45 <strong>WPM</strong>. This is a great age to build solid touch-typing habits before entering high school and college.",
  },
  {
    q: "What was Mark Zuckerberg's typing speed?",
    a: "While there is no official public record of Mark Zuckerberg's exact <strong>WPM</strong>, experienced programmers typically type between 70 and 100 WPM. It is safe to assume he is a fast and efficient typist.",
  },
  {
    q: "What is a poor typing speed?",
    a: "A <strong>typing speed</strong> below 30 <strong>WPM</strong> is generally considered poor or beginner-level for adults, as it often involves the \"hunt-and-peck\" method. Regular <strong>keyboard typing practice</strong> can easily elevate this to average levels.",
  },
  {
    q: "How fast can a 9 year old type?",
    a: "A 9-year-old typically types at around 15 to 25 <strong>WPM</strong>. At this age, the focus should be on proper finger placement and <strong>typing accuracy</strong> rather than raw speed.",
  },
  {
    q: "Is 18 WPM bad?",
    a: "18 <strong>WPM</strong> is a beginner speed. If you are just starting to learn touch typing, this is completely normal! Stick with it, take a daily <strong>free online typing test</strong>, and your speed will improve rapidly.",
  },
  {
    q: "How fast can JK Rowling type?",
    a: "Though her exact <strong>typing speed</strong> isn't definitively published, professional authors usually type between 60 and 90 <strong>WPM</strong>. Rowling's extensive writing volume suggests she is a very fluent and capable typist.",
  },
  {
    q: "Why am I typing so slowly?",
    a: "You may be typing slowly because you are looking at the keyboard, using only two fingers (hunt-and-peck), or lacking muscle memory. Correcting your posture, using all ten fingers, and focusing on <strong>typing accuracy</strong> first will solve this.",
  },
  {
    q: "Is fast typing a hard skill?",
    a: "Yes, fast typing is considered a \"hard skill\" on a resume. It is a quantifiable, teachable technical ability that is highly valued in administrative, programming, data entry, and customer service roles.",
  },
  {
    q: "Who has the fastest WPM in the world?",
    a: "The fastest recorded <strong>typing speed</strong> in the world on an English language QWERTY keyboard was set by Stella Pajunas in 1946, achieving 216 <strong>WPM</strong> on an IBM electric typewriter. Modern typists like Sean Wrona also regularly surpass 200 WPM in bursts.",
  },
  {
    q: "Are Gen Z fast typers?",
    a: "Yes, Gen Z generally types fast due to early exposure to digital devices. They are particularly known for their exceptional thumb-typing speeds on mobile devices, often rivaling their physical keyboard <strong>WPM</strong>.",
  },
  {
    q: "Is typing 40 words per minute hard?",
    a: "No, achieving 40 <strong>WPM</strong> is not hard for most people. It is the global average and can be reached by almost anyone within a few weeks of consistent, daily 10-finger <strong>typing practice</strong>.",
  },
  {
    q: "Is 80 WPM good for an 11 year old?",
    a: "80 <strong>WPM</strong> is incredibly fast for an 11-year-old! It places them well above the adult average and shows excellent fine motor skills and keyboard familiarity.",
  },
  {
    q: "What is 10 finger typing?",
    a: "10-finger typing, also known as touch typing, is the method of typing without looking at the keyboard by resting your fingers on the \"home row\" keys and using all 10 fingers to press specific keys.",
  },
  {
    q: "How to improve 10 finger typing?",
    a: "To improve your 10-finger typing, always return your hands to the home row, never look down at the keys, and focus entirely on <strong>typing accuracy</strong> before speed. Taking a daily <strong>free online typing test</strong> on <strong>FreeTypingTestGoat</strong> will build your speed naturally.",
  },
];

export default function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="font-heading-4 text-ink">Frequently Asked Questions</h2>
      <p className="mt-3 font-body text-text-muted">Answers about free typing tests, WPM, accuracy, typing test practice, durations, and using FreeTypingTestGoat.</p>

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
