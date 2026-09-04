import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import AuthModal from "./AuthModal";
import UsernameModal from "./UsernameModal";
import SpanishThemePicker from "./SpanishThemePicker";
import LanguagePicker from "./LanguagePicker";

const NAV_LINKS = [
  { label: "Clasificación", href: "/es/leaderboard/" },
  { label: "Acerca de", href: "/es/about/" },
  { label: "Contacto", href: "/es/contact/" },
];

export default function SpanishHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 8);
      });
    };
    setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const sync = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!mounted) return;
      if (error || !user) {
        setIsAuthenticated(false);
        setUsername(null);
        setIsUsernameModalOpen(false);
        return;
      }
      setIsAuthenticated(true);
      const metadata = typeof user.user_metadata?.username === "string" ? user.user_metadata.username.trim() : null;
      const { data: profile } = await supabase.from("profiles").select("username").eq("user_id", user.id).maybeSingle();
      if (!mounted) return;
      const current = profile?.username?.trim() || metadata || null;
      setUsername(current);
      setIsUsernameModalOpen(!current);
    };
    void sync();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setUsername(null);
        setIsUsernameModalOpen(false);
        setIsAuthModalOpen(false);
      } else if (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "USER_UPDATED") {
        void sync();
        if (event === "SIGNED_IN") setIsAuthModalOpen(false);
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const accountLabel = username ? (
    <span className="max-w-[120px] truncate font-link text-ink" title={username}>{username}</span>
  ) : isAuthenticated ? (
    <span className="whitespace-nowrap font-link text-ink">Sesión iniciada</span>
  ) : (
    <button type="button" onClick={() => setIsAuthModalOpen(true)} className="whitespace-nowrap font-link text-ink transition-colors hover:text-text-muted">Iniciar sesión</button>
  );

  const mobileAccountLabel = username ? (
    <span className="max-w-[68px] truncate text-[12px] font-semibold leading-none text-ink sm:max-w-[110px] sm:text-sm" title={username}>{username}</span>
  ) : (
    <button type="button" onClick={() => setIsAuthModalOpen(true)} className="max-w-[68px] truncate whitespace-nowrap text-[11px] font-semibold leading-none text-ink transition-colors hover:text-text-muted sm:max-w-[110px] sm:text-sm">
      {isAuthenticated ? "Sesión iniciada" : "Iniciar sesión"}
    </button>
  );

  return (
    <>
      <header className="sticky top-3 z-50 w-full px-2 pointer-events-none sm:top-5 sm:px-4 lg:px-6">
        <div className={[
          "pointer-events-auto mx-auto flex w-full max-w-none min-w-0 items-center rounded-full border border-hairline/70 shadow-sm",
          "h-11 gap-1 bg-canvas-soft px-2 sm:h-14 sm:gap-2 sm:px-4 lg:gap-3 lg:px-5",
          scrolled && "bg-canvas-soft/95 backdrop-blur-md",
        ].filter(Boolean).join(" ")}>
          <a href="/es/" className="flex min-w-0 flex-1 items-center select-none" aria-label="Inicio de Test de mecanografía Cabra">
            <span className="font-title min-w-0 truncate text-[12px] font-semibold leading-none tracking-tight sm:text-lg lg:text-xl">Test de mecanografía</span>
            <span className="font-title hidden shrink-0 text-[12px] font-semibold leading-none tracking-tight text-primary sm:inline sm:text-lg lg:text-xl"> Cabra</span>
          </a>
          <nav className="hidden shrink-0 items-center gap-3 lg:gap-5 md:flex" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="whitespace-nowrap font-link text-sm text-ink transition-colors duration-200 hover:text-text-muted lg:text-[15px]">{link.label}</a>
            ))}
          </nav>
          <div className="hidden shrink-0 items-center gap-2.5 lg:gap-3 md:flex">
            <SpanishThemePicker />
            <LanguagePicker locale="es" />
            <div className="inline-flex max-w-[160px] items-center rounded-full border border-hairline bg-canvas px-4 py-2">
              {accountLabel}
            </div>
          </div>
          <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2 md:hidden">
            <SpanishThemePicker />
            <LanguagePicker locale="es" />
            <div className="inline-flex max-w-[100px] items-center rounded-full border border-hairline bg-canvas px-3 py-1.5">
              {mobileAccountLabel}
            </div>
            <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas text-ink shadow-sm sm:h-9 sm:w-9" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" /> : <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />}
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <div className="pointer-events-auto mx-1 mt-2 rounded-2xl border border-hairline/70 bg-canvas-soft p-2 shadow-lg md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Menú móvil">
              {isAuthenticated && <a href="/es/account/" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-link text-ink hover:bg-canvas">Historial</a>}
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-link text-ink hover:bg-canvas">{link.label}</a>
              ))}
            </nav>
          </div>
        )}
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} locale="es" />
      <UsernameModal isOpen={isUsernameModalOpen && isAuthenticated} initialUsername={username || ""} onSaved={(value) => { setUsername(value); setIsUsernameModalOpen(false); }} locale="es" />
    </>
  );
}
