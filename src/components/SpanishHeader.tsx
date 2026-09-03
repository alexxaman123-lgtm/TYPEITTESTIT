import { useEffect, useState, type MouseEvent } from "react";
import { cn } from "../utils/cn";
import { supabase } from "../supabaseClient";
import AuthModal from "./AuthModal";
import UsernameModal from "./UsernameModal";
import SpanishThemePicker from "./SpanishThemePicker";

const NAV_LINKS = [
  { label: "Test de velocidad de escritura", href: "/es/#tester" },
  { label: "Clasificación", href: "/leaderboard" },
  { label: "Cómo funciona", href: "/es/#how-it-works" },
  { label: "Sobre nosotros", href: "/about" },
  { label: "Contacto", href: "/contact" },
];

function handleNavigation(event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
}

export default function SpanishHeader() {
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
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const nextScrolled = window.scrollY > 8;
        if (nextScrolled !== lastScrolled) {
          lastScrolled = nextScrolled;
          setScrolled(nextScrolled);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
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
      const metadataUsername = typeof user.user_metadata?.username === "string" ? user.user_metadata.username.trim() : null;
      const { data: profile, error: profileError } = await supabase.from("profiles").select("username").eq("user_id", user.id).maybeSingle();
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
      } else if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "USER_UPDATED") {
        void syncUser();
        if (event === "SIGNED_IN") setIsAuthModalOpen(false);
      }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const saveUsername = (newUsername: string) => {
    setUsername(newUsername);
    setIsUsernameModalOpen(false);
  };

  const accountLabel = username ? (
    <span className="max-w-[120px] truncate font-link text-ink" title={username}>{username}</span>
  ) : isAuthenticated ? (
    <span className="font-link text-ink">Sesión iniciada</span>
  ) : (
    <button type="button" onClick={() => setIsAuthModalOpen(true)} className="font-link text-ink transition-colors hover:text-text-muted">Iniciar sesión</button>
  );

  const mobileAccountLabel = username ? (
    <span className="max-w-[74px] truncate text-[14px] font-semibold leading-none text-ink sm:max-w-[120px] sm:text-base" title={username}>{username}</span>
  ) : isAuthenticated ? (
    <span className="whitespace-nowrap text-[14px] font-semibold leading-none text-ink sm:text-base">Sesión iniciada</span>
  ) : (
    <button type="button" onClick={() => setIsAuthModalOpen(true)} className="whitespace-nowrap text-[14px] font-semibold leading-none text-ink transition-colors hover:text-text-muted sm:text-base">Iniciar sesión</button>
  );

  return (
    <>
      <header className="sticky top-4 z-50 w-full px-3 pointer-events-none sm:top-6 sm:px-6">
        <div className={cn("pointer-events-auto mx-auto flex h-13 min-w-0 max-w-7xl items-center gap-2 rounded-full px-3.5 sm:h-14 sm:px-6", scrolled ? "bg-canvas-soft/95 shadow-sm backdrop-blur-md" : "bg-canvas-soft", "transition-all duration-300")}>
          <a href="/es/" onClick={handleNavigation} className="flex min-w-0 flex-1 items-center gap-0.5 select-none" aria-label="Inicio de FreeTypingTestGoat">
            <span className="font-title min-w-0 shrink truncate text-[16px] font-semibold leading-tight tracking-tight sm:text-xl">FreeTypingTest</span><span className="font-title shrink-0 text-[16px] font-semibold leading-tight tracking-tight text-primary sm:text-xl">Goat</span>
            <img src="/goat-mark.svg" alt="" className="ml-1 h-6 w-6 shrink-0 sm:h-7 sm:w-7" aria-hidden="true" />
          </a>
          <nav className="hidden items-center gap-4 lg:gap-6 md:flex" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => <a key={link.href} href={link.href} onClick={handleNavigation} className="whitespace-nowrap font-link text-ink transition-colors duration-200 hover:text-text-muted">{link.label}</a>)}
          </nav>
          <div className="hidden items-center gap-3 lg:gap-4 md:flex">
            <SpanishThemePicker />
            {accountLabel}
            <a href="/es/#tester" className="flex h-[36px] items-center justify-center whitespace-nowrap rounded-full bg-primary px-4 font-link text-on-primary transition-opacity hover:opacity-90">Empezar a escribir</a>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:hidden">
            <SpanishThemePicker />
            {mobileAccountLabel}
            <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas text-ink shadow-sm sm:h-10 sm:w-10" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>{open ? <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" /> : <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />}</svg>
            </button>
          </div>
        </div>
        {open && (
          <div className="pointer-events-auto mx-auto mt-2 max-w-7xl rounded-2xl bg-canvas-soft p-2 shadow-lg md:hidden backdrop-blur-md">
            <nav className="flex flex-col gap-1" aria-label="Menú móvil">
              {NAV_LINKS.map((link) => <a key={link.href} href={link.href} onClick={(event) => { handleNavigation(event); setOpen(false); }} className="rounded-xl px-4 py-3 font-link text-ink hover:bg-canvas">{link.label}</a>)}
              <a href="/es/#tester" onClick={() => setOpen(false)} className="mt-2 rounded-xl bg-primary px-4 py-3 text-center font-link text-on-primary">Empezar a escribir</a>
            </nav>
          </div>
        )}
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <UsernameModal isOpen={isUsernameModalOpen && isAuthenticated} initialUsername={username || ""} onSaved={saveUsername} />
    </>
  );
}
