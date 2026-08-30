const FOOTER_LINKS = [
  { label: "Typing Tester", href: "#tester" },
  { label: "Guides", href: "#guides" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface1/60 shadow-[0_-20px_50px_-45px_rgba(0,255,102,0.35)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="font-mono text-base font-bold text-ink">
              TYPING<span className="text-accent">TEST</span>
            </div>
            <p className="mt-2 max-w-sm text-sm text-faint">
              TYPEITTESTIT is a free online typing speed test and typing practice tool to measure WPM,
              accuracy, and consistency in seconds.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm" aria-label="Footer">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-muted transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} TYPEITTESTIT. All rights reserved.</p>
          <p>Built for typists who want real, honest numbers.</p>
        </div>

        <div id="privacy" className="mt-10 scroll-mt-24 border-t border-white/5 pt-8 text-sm text-muted">
          <h3 className="font-semibold text-ink-soft">Privacy Policy</h3>
          <p className="mt-2 max-w-3xl">
            TYPEITTESTIT does not require an account to use the typing test. Your difficulty and
            duration preferences and your personal best scores are stored only in your browser's
            local storage so they can be restored on your next visit. This data never leaves your
            device and is never sold or shared. Custom text you paste into the custom typing mode
            is processed locally in your browser and is not transmitted to any server.
          </p>
        </div>

        <div id="terms" className="mt-8 scroll-mt-24 border-t border-white/5 pt-8 pb-2 text-sm text-muted">
          <h3 className="font-semibold text-ink-soft">Terms of Use</h3>
          <p className="mt-2 max-w-3xl">
            TYPEITTESTIT is provided as a free tool for practicing and measuring typing speed. The
            typing passages are provided for practice purposes only. Results are generated
            locally in your browser based on your own input and are provided for personal,
            informational use without any warranty of accuracy for any specific purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}
