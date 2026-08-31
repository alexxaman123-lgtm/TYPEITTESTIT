import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { supabase } from "../supabaseClient";
import AuthModal from "./AuthModal";
import UsernameModal from "./UsernameModal";

const NAV_LINKS = [
  { label: "Typing Speed Test", href: "/#tester" },
  { label: "Guides", href: "/#guides" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function GoatMark() {
  return (
    <svg
      aria-hidden="true"
      className="h-7 w-7 shrink-0 text-accent"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 10.5C7 9 5.7 6.6 7 4.2c2.2.6 3.8 2.1 4.5 4.1 1.7-1 3.6-1.5 5.5-1.5s3.8.5 5.5 1.5c.7-2 2.3-3.5 4.5-4.1 1.3 2.4 0 4.8-2.5 6.3 1.6 2 2.3 4.4 2.1 6.8-.3 4.3-3.9 8.4-9.6 8.4s-9.3-4.1-9.6-8.4c-.2-2.4.5-4.8 2.1-6.8Z" />
      <path d="M11 8.6C10.1 6.8 9.2 5.4 8 4.5M21 8.6c.9-1.8 1.8-3.2 3-4.1" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    let lastScrolled = window.scrollY > 8;
    setScrolled(lastScrolled);

    const onScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const nextScrolled = window.scrollY > 8;
        if (nextScrolled === lastScrolled) return;
        lastScrolled = nextScrolled;
        setScrolled(nextScrolled);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const syncUser = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!mounted) return;
      if (authError || !user) {
        setIsAuthenticated(false);
        setUsername(null);
        setIsUsernameModalOpen(false);
        return;
      }

      setIsAuthenticated(true);
      const metadataUsername = typeof user.user_metadata?.username === "string"
        ? user.user_metadata.username.trim()
        : null;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!mounted) return;
      if (profileError) {
        console.error("Could not load profile:", profileError.message);
        setUsername(metadataUsername);
        setIsUsernameModalOpen(!metadataUsername);
        return;
      }

      const currentUsername = profile?.username?.trim() || metadataUsername || null;
      setUsername(currentUsername);
      setIsUsernameModalOpen(!currentUsername);
    };

    void syncUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setUsername(null);
        setIsUsernameModalOpen(false);
        setIsAuthModalOpen(false);
        return;
      }
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "USER_UPDATED") {
        void syncUser();
        if (event === "SIGNED_IN") setIsAuthModalOpen(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const saveUsername = (newUsername: string) => {
    setUsername(newUsername);
    setIsUsernameModalOpen(false);
  };

  const accountLabel = username ? (
    <span className="max-w-[180px] truncate text-sm font-semibold text-ink" title={username}>{username}</span>
  ) : isAuthenticated ? (
    <span className="text-sm font-medium text-ink">Signed in</span>
  ) : (
    <button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-medium text-ink transition-colors hover:text-accent">Sign In</button>
  );

  const mobileAccountLabel = username ? (
    <span className="max-w-[120px] truncate text-sm font-semibold text-ink" title={username}>{username}</span>
  ) : isAuthenticated ? (
    <span className="text-sm font-medium text-ink">Signed in</span>
  ) : (
    <button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-medium text-ink transition-colors hover:text-accent">Sign In</button>
  );

  return (
    <>
      <header className={cn("sticky top-0 z-50 w-full border-b transition-all duration-300", scrolled ? "border-white/10 bg-bg/85 shadow-[0_8px_24px_-20px_rgba(0,255,102,0.35)] backdrop-blur-md" : "border-transparent bg-transparent")}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2.5 select-none text-lg font-extrabold tracking-[-0.03em] text-ink" aria-label="GOATTYPE home">
            <GoatMark />
            <span>GOATTYPE</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-muted transition-colors duration-200 hover:text-accent">{link.label}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {accountLabel}
            <a href="/#tester" className="rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-all duration-200 hover:border-accent/70 hover:bg-accent/20">Start Typing</a>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            {mobileAccountLabel}
            <button type="button" onClick={() => setOpen((o) => !o)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-ink" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                {open ? <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" /> : <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-white/10 bg-bg/95 backdrop-blur-md md:hidden">
            <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile">
              {NAV_LINKS.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-ink-soft hover:bg-white/5 hover:text-ink">{link.label}</a>)}
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <UsernameModal isOpen={isUsernameModalOpen && isAuthenticated} initialUsername={username || ""} onSaved={saveUsername} />
    </>
  );
}
