import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { supabase } from "../supabaseClient";
import AuthModal from "./AuthModal";
import UsernameModal from "./UsernameModal";

const NAV_LINKS = [
  { label: "Typing Speed Test", href: "#tester" },
  { label: "Guides", href: "#guides" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;

    const syncUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;
      const currentUsername = user?.user_metadata?.username?.trim() || null;
      setUsername(currentUsername);
      if (user && !currentUsername) setIsUsernameModalOpen(true);
    };

    syncUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      const currentUsername = user?.user_metadata?.username?.trim() || null;
      setUsername(currentUsername);
      setIsAuthModalOpen(false);
      if (user && !currentUsername) setIsUsernameModalOpen(true);
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

  return (
    <>
      <header className={cn("sticky top-0 z-50 w-full border-b transition-all duration-300", scrolled ? "border-white/10 bg-bg/85 shadow-[0_8px_24px_-20px_rgba(0,255,102,0.35)] backdrop-blur-md" : "border-transparent bg-transparent")}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#tester" className="select-none text-lg font-extrabold tracking-[-0.03em] text-ink" aria-label="TypeItTestIt home">
            TYPING<span className="text-accent">TEST</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-muted transition-colors duration-200 hover:text-accent">{link.label}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            {username ? (
              <span className="max-w-[180px] truncate text-sm font-semibold text-ink" title={username}>{username}</span>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-medium text-ink transition-colors hover:text-accent">Sign In</button>
            )}
            <a href="#tester" className="rounded-full border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-all duration-200 hover:border-accent/70 hover:bg-accent/20">Start Typing</a>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            {username ? (
              <span className="max-w-[120px] truncate text-sm font-semibold text-ink" title={username}>{username}</span>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-medium text-ink transition-colors hover:text-accent">Sign In</button>
            )}
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
              {NAV_LINKS.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-white/5 hover:text-ink">{link.label}</a>)}
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <UsernameModal isOpen={isUsernameModalOpen} initialUsername={username || ""} onSaved={saveUsername} />
    </>
  );
}
