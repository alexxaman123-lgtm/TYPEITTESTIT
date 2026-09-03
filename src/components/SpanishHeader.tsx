import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { supabase } from "../supabaseClient";
import AuthModal from "./AuthModal";
import UsernameModal from "./UsernameModal";
import SpanishThemePicker from "./SpanishThemePicker";
import LanguagePicker from "./LanguagePicker";

const NAV_LINKS = [
  { label: "Test de mecanografía", href: "/es/#tester" },
  { label: "Clasificación", href: "/es/leaderboard/" },
  { label: "Cómo funciona", href: "/es/#how-it-works" },
  { label: "Acerca de", href: "/es/about/" },
  { label: "Contacto", href: "/es/contact/" },
];

function GoatMark() {
  return (
    <svg aria-hidden="true" className="ml-1 h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6 lg:h-7 lg:w-7" viewBox="0 0 362 400" fill="currentColor">
      <path d="M 169 349 193 350 181 377 179 376 168 351 Z M 171 306 189 305 190 307 180 316 Z M 248 180 252 181 256 185 256 189 250 194 246 193 243 190 243 184 Z M 111 180 115 181 118 184 118 190 113 194 109 193 105 189 105 185 Z M 267 132 278 118 290 111 297 109 318 108 342 113 344 115 333 123 312 131 297 132 281 130 270 133 Z M 17 115 19 113 35 109 64 109 71 111 83 118 94 132 91 133 79 130 65 132 49 131 34 126 Z M 325 97 328 97 Z M 33 97 36 97 Z M 36 95 50 91 74 91 98 97 115 105 121 105 124 101 124 88 128 85 152 81 163 97 166 99 195 99 198 97 206 84 209 81 235 86 237 88 237 101 240 105 246 105 263 97 286 91 310 91 320 93 326 96 305 96 286 100 269 110 259 122 254 132 250 145 250 152 254 168 244 169 238 172 234 176 219 202 219 208 223 211 228 210 235 199 244 205 254 205 255 208 251 225 245 241 230 266 221 286 213 321 201 333 187 338 186 328 206 307 206 298 201 294 160 294 155 298 154 305 156 309 175 328 175 337 172 338 162 334 149 323 140 286 131 266 117 243 110 225 106 208 107 205 117 205 126 199 131 208 135 211 140 210 143 205 127 176 117 169 107 168 111 152 111 145 107 132 102 122 92 110 80 102 64 97 36 97 Z M 261 19 262 20 254 29 243 46 235 64 233 72 230 73 219 70 221 64 234 41 249 26 Z M 100 19 112 26 127 41 140 64 142 70 131 73 128 72 126 64 117 44 106 28 100 22 Z M 261 19 263 19 Z M 98 19 100 19 Z M 66 0 62 4 63 9 77 17 88 26 98 37 106 49 116 72 116 75 112 79 112 89 111 90 89 82 72 79 52 79 41 81 27 86 14 94 0 109 0 115 6 122 15 129 32 138 49 143 81 142 89 144 99 151 94 170 93 199 96 219 102 238 126 283 131 296 138 328 151 341 175 396 178 399 183 399 188 392 210 341 223 328 233 288 257 243 264 223 268 200 268 178 265 159 262 151 268 146 280 142 312 143 329 138 343 131 357 120 361 115 361 109 348 95 338 88 316 80 281 80 265 84 250 90 249 89 249 79 245 75 245 72 255 49 263 37 273 26 298 9 299 4 295 0 283 0 265 4 248 12 241 17 223 36 213 53 208 67 206 69 201 70 190 87 171 87 160 70 155 69 153 67 148 53 138 36 120 17 96 4 78 0 Z" />
    </svg>
  );
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
    <span className="max-w-[78px] truncate text-[12px] font-semibold leading-none text-ink sm:max-w-[110px] sm:text-sm" title={username}>{username}</span>
  ) : (
    <button type="button" onClick={() => setIsAuthModalOpen(true)} className="max-w-[84px] truncate whitespace-nowrap text-[12px] font-semibold leading-none text-ink transition-colors hover:text-text-muted sm:max-w-[110px] sm:text-sm">
      {isAuthenticated ? "Sesión iniciada" : "Iniciar sesión"}
    </button>
  );

  return (
    <>
      <header className="sticky top-3 z-50 w-full px-2 pointer-events-none sm:top-5 sm:px-4 lg:px-6">
        <div className={cn(
          "pointer-events-auto mx-auto flex w-full max-w-none min-w-0 items-center rounded-full border border-hairline/70 shadow-sm",
          "h-12 gap-1.5 bg-canvas-soft px-2.5 sm:h-14 sm:gap-2 sm:px-4 lg:gap-3 lg:px-5",
          scrolled && "bg-canvas-soft/95 backdrop-blur-md"
        )}>
          <a href="/es/" className="flex min-w-0 flex-[1.15] items-center select-none" aria-label="Inicio de Test de mecanografía Goat">
            <span className="font-title min-w-0 truncate text-[13px] font-semibold leading-none tracking-tight sm:text-lg lg:text-xl">Test de mecanografía</span>
            <span className="font-title ml-1 shrink-0 text-[13px] font-semibold leading-none tracking-tight text-primary sm:text-lg lg:text-xl">Goat</span>
            <GoatMark />
          </a>

          <nav className="hidden shrink-0 items-center gap-3 lg:gap-5 md:flex" aria-label="Navegación principal">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="whitespace-nowrap font-link text-sm text-ink transition-colors duration-200 hover:text-text-muted lg:text-[15px]">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2.5 lg:gap-3 md:flex">
            <LanguagePicker locale="es" />
            <SpanishThemePicker />
            {accountLabel}
            <a href="/es/#tester" className="flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-primary px-4 font-link text-sm text-on-primary transition-opacity hover:opacity-90">Empezar a escribir</a>
          </div>

          <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2 md:hidden">
            <LanguagePicker locale="es" />
            <SpanishThemePicker />
            {mobileAccountLabel}
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
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-link text-ink hover:bg-canvas">{link.label}</a>
              ))}
              <a href="/es/#tester" onClick={() => setOpen(false)} className="mt-2 rounded-xl bg-primary px-4 py-3 text-center font-link text-on-primary">Empezar a escribir</a>
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} locale="es" />
      <UsernameModal isOpen={isUsernameModalOpen && isAuthenticated} initialUsername={username || ""} onSaved={(value) => { setUsername(value); setIsUsernameModalOpen(false); }} locale="es" />
    </>
  );
}
