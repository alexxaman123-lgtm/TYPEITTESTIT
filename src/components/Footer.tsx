const FOOTER_LINKS = [
  { label: "Typing Tester", href: "/#tester" },
  { label: "Typing Practice", href: "/#typing-practice" },
  { label: "Guides", href: "/#guides" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-of-use" },
];

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="font-title text-ink tracking-tight">FreeTypingTest<span className="text-accent">Goat</span></div>
            <p className="mt-3 max-w-sm font-body-sm text-text-muted">
              FreeTypingTestGoat is a free online typing test and typing practice tool for measuring WPM, accuracy, and typing consistency.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 font-link text-ink" aria-label="Footer">
            {FOOTER_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-text-muted transition-colors hover:text-ink">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-hairline pt-6 font-caption text-text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} FreeTypingTestGoat. All rights reserved.</p>
          <p>TYPE LIKE A GOAT.</p>
        </div>
      </div>
    </footer>
  );
}
