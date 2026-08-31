const GUIDES = [
  {
    title: "How to Improve Typing Speed Fast (Without Sacrificing Accuracy)",
    body: "The fastest sustainable progress usually comes from improving technique first. Practice touch typing, keep your hands relaxed, and aim for clean keystrokes before chasing a bigger WPM number. Run a one minute typing speed test to establish a baseline, then practice at a pace where you can stay above roughly 95% accuracy. Once that feels comfortable, increase speed gradually.",
  },
  {
    title: "How to Practice Typing: A 15-Minute Daily Routine",
    body: "A simple routine is enough to build momentum. Spend two minutes warming up, take a one minute typing test, practice the words or punctuation that caused mistakes, then take a three or five minute typing test at a controlled pace. Repeat most days. Short, focused typing practice makes it easier to stay consistent and notice progress from week to week.",
  },
  {
    title: "What Is a Good WPM for Typing?",
    body: "A good typing speed depends on the task, but 30–40 WPM is common for casual typing, 50–70 WPM is solid for many everyday tasks, and 70–100+ WPM is fast. The better goal is to improve your own best score while keeping accuracy high. Use the same difficulty and duration when comparing two results so the benchmark is meaningful.",
  },
  {
    title: "Touch Typing: How to Stop Looking at the Keyboard",
    body: "Touch typing is the foundation of faster typing because your fingers learn where keys are instead of relying on visual searching. Start with the home row, use consistent finger assignments, and practice slowly enough that you rarely need to look down. Your speed may dip at first, but the improved muscle memory can make future typing sessions much faster and more accurate.",
  },
  {
    title: "1-Minute vs 3-Minute vs 5-Minute Typing Test",
    body: "A one minute typing test is great for a quick benchmark or daily warm-up. Three minutes gives you more time to settle into a rhythm, while five minutes tests endurance and consistency. Rotate durations depending on your goal: quick speed checks, regular typing practice, or a realistic longer-session benchmark.",
  },
  {
    title: "Keyboard Speed Test: What Your Score Really Means",
    body: "A keyboard speed test is more than a race to the largest number. WPM shows how quickly you are entering text, while accuracy shows how reliably you are doing it. If your speed jumps but your accuracy falls sharply, you may be typing beyond your sustainable level. A balanced score is a better indicator of useful typing skill.",
  },
  {
    title: "How to Improve Typing Accuracy",
    body: "Accuracy improves when you stop treating mistakes as something to rush past. Slow down, notice which letters or punctuation marks you miss, and repeat those patterns until they feel automatic. Keep your eyes on the text, avoid unnecessary backspacing, and raise your pace only after clean typing becomes consistent.",
  },
  {
    title: "Typing Test for Jobs, School, and Daily Work",
    body: "Typing speed can matter in data entry, customer support, administration, writing, coding, schoolwork, and timed assessments. The most useful preparation is to practice with varied text and the same kind of time pressure you expect in the real task. Use GOATTYPE to measure a baseline, repeat the exercise, and watch your personal best improve.",
  },
  {
    title: "How to Get Faster at Typing Long Sentences and Punctuation",
    body: "Many typists can type simple words quickly but slow down when sentences become longer or punctuation becomes heavier. Medium and hard passages are useful because they introduce capital letters, commas, quotes, numbers, and less familiar vocabulary. Practice those details deliberately so your speed carries over to real writing instead of only simple drills.",
  },
  {
    title: "How Fast Can You Type? Take the Pro Typer Challenge",
    body: "Think you are a fast typist? Take a timed typing speed test and treat your personal best as the target. Try the same duration more than once, compare WPM and accuracy, and move from easy to medium to hard passages as your control improves. The goal is not one lucky score — it is proving that you can type quickly, accurately, and consistently.",
  },
];

export default function GuidesSection() {
  return (
    <section id="guides" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Typing Speed Blog</p>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Typing Practice, Speed & Accuracy Guides</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted">Practical guides for people searching for typing practice, a typing speed test, better WPM, stronger accuracy, and a faster keyboard.</p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {GUIDES.map((guide) => (
          <details key={guide.title} className="interactive-lift group rounded-2xl border border-white/10 bg-surface1/50 p-5 open:border-accent/30">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink-soft marker:content-none">
              {guide.title}
              <span className="shrink-0 text-lg text-accent transition-transform duration-200 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-6 text-muted">{guide.body}</p>
            <a href="#tester" className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">Take a typing speed test &rarr;</a>
          </details>
        ))}
      </div>
    </section>
  );
}
