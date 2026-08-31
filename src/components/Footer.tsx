const FOOTER_LINKS = [
  { label: "Typing Tester", href: "/#tester" },
  { label: "Guides", href: "/#guides" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-of-use" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface1/60 shadow-[0_-20px_50px_-45px_rgba(0,255,102,0.35)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="font-mono text-base font-bold text-ink">GOATTYPE</div>
            <p className="mt-2 max-w-sm text-sm text-faint">
              GOATTYPE is a free online typing speed test and typing practice tool to measure WPM,
              accuracy, and consistency in seconds.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm" aria-label="Footer">
            {FOOTER_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-muted transition-colors hover:text-accent">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/5 pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} GOATTYPE. All rights reserved.</p>
          <p>TYPE LIKE A GOAT.</p>
        </div>
      </div>
    </footer>
  );
}
