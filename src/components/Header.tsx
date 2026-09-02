import { useEffect, useState, type MouseEvent } from "react";
import { cn } from "../utils/cn";
import { navigateTo } from "../utils/navigation";
import { supabase } from "../supabaseClient";
import AuthModal from "./AuthModal";
import UsernameModal from "./UsernameModal";
import ThemePicker from "./ThemePicker";

const NAV_LINKS = [
  { label: "Typing Speed Test", href: "/#tester" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function GoatMark() {
  return (
    <svg
      aria-hidden="true"
      className="ml-1.5 h-7 w-7 shrink-0 text-accent"
      viewBox="0 0 362 400"
      fill="currentColor"
    >
      <path d="M 169 349 193 350 181 377 179 376 168 351 Z M 171 306 189 305 190 307 180 316 Z M 248 180 252 181 256 185 256 189 250 194 246 193 243 190 243 184 Z M 111 180 115 181 118 184 118 190 113 194 109 193 105 189 105 185 Z M 267 132 278 118 290 111 297 109 318 108 342 113 344 115 333 123 312 131 297 132 281 130 270 133 Z M 17 115 19 113 35 109 64 109 71 111 83 118 94 132 91 133 79 130 65 132 49 131 34 126 Z M 325 97 328 97 Z M 33 97 36 97 Z M 36 95 50 91 74 91 98 97 115 105 121 105 124 101 124 88 128 85 152 81 163 97 166 99 195 99 198 97 206 84 209 81 235 86 237 88 237 101 240 105 246 105 263 97 286 91 310 91 320 93 326 96 305 96 286 100 269 110 259 122 254 132 250 145 250 152 254 168 244 169 238 172 234 176 219 202 219 208 223 211 228 210 235 199 244 205 254 205 255 208 251 225 245 241 230 266 221 286 213 321 201 333 187 338 186 328 206 307 206 298 201 294 160 294 155 298 154 305 156 309 175 328 175 337 172 338 162 334 149 323 140 286 131 266 117 243 110 225 106 208 107 205 117 205 126 199 131 208 135 211 140 210 143 205 127 176 117 169 107 168 111 152 111 145 107 132 102 122 92 110 80 102 64 97 36 97 Z M 261 19 262 20 254 29 243 46 235 64 233 72 230 73 219 70 221 64 234 41 249 26 Z M 100 19 112 26 127 41 140 64 142 70 131 73 128 72 126 64 117 44 106 28 100 22 Z M 261 19 263 19 Z M 98 19 100 19 Z M 66 0 62 4 63 9 77 17 88 26 98 37 106 49 116 72 116 75 112 79 112 89 111 90 89 82 72 79 52 79 41 81 27 86 14 94 0 109 0 115 6 122 15 129 32 138 49 143 81 142 89 144 99 151 94 170 93 199 96 219 102 238 126 283 131 296 138 328 151 341 175 396 178 399 183 399 188 392 210 341 223 328 233 288 257 243 264 223 268 200 268 178 265 159 262 151 268 146 280 142 312 143 329 138 343 131 357 120 361 115 361 109 348 95 338 88 316 80 281 80 265 84 250 90 249 89 249 79 245 75 245 72 255 49 263 37 273 26 298 9 299 4 295 0 283 0 265 4 248 12 241 17 223 36 213 53 208 67 206 69 201 70 190 87 171 87 160 70 155 69 153 67 148 53 138 36 120 17 96 4 78 0 Z" />
    </svg>
  );
}

function handleInternalNavigation(event: MouseEvent<HTMLAnchorElement>, href: string): void {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) {
    return;
  }

  if (href.startsWith("/") && !href.startsWith("/#")) {
    event.preventDefault();
    navigateTo(href);
  }
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
    <span className="max-w-[120px] truncate font-link text-ink" title={username}>{username}</span>
  ) : isAuthenticated ? (
    <span className="font-link text-ink">Signed in</span>
  ) : (
    <button onClick={() => setIsAuthModalOpen(true)} className="font-link text-ink transition-colors hover:text-text-muted">Log in</button>
  );

  const mobileAccountLabel = username ? (
    <span className="max-w-[120px] truncate font-link text-ink" title={username}>{username}</span>
  ) : isAuthenticated ? (
    <span className="font-link text-ink">Signed in</span>
  ) : (
    <button onClick={() => setIsAuthModalOpen(true)} className="font-link text-ink transition-colors hover:text-text-muted">Log in</button>
  );

  return (
    <>
      <header className="sticky top-6 z-50 w-full px-4 sm:px-6 pointer-events-none">
        <div className={cn(
          "pointer-events-auto mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full px-4 sm:px-6 transition-all duration-300",
          scrolled ? "bg-canvas-soft/95 shadow-sm backdrop-blur-md" : "bg-canvas-soft"
        )}>
          <a href="/" onClick={(event) => handleInternalNavigation(event, "/")} className="flex items-center gap-1 select-none whitespace-nowrap" aria-label="FreeTypingTestGoat home">
            <span className="font-title text-ink tracking-tight">FreeTypingTest</span><span className="font-title text-primary tracking-tight">Goat</span>
            <div className="w-5 h-5 ml-1 text-primary"><GoatMark /></div>
          </a>

          <nav className="hidden items-center gap-4 lg:gap-6 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={(event) => handleInternalNavigation(event, link.href)} className="whitespace-nowrap font-link text-ink transition-colors duration-200 hover:text-text-muted">{link.label}</a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:gap-4 md:flex">
            <ThemePicker />
            {accountLabel}
            <a href="/#tester" className="whitespace-nowrap flex items-center justify-center h-[36px] rounded-full bg-primary px-4 font-link text-on-primary transition-opacity hover:opacity-90">Start Typing</a>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <ThemePicker />
            {mobileAccountLabel}
            <button type="button" onClick={() => setOpen((o) => !o)} className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas text-ink shadow-sm" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                {open ? <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" /> : <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="pointer-events-auto mx-auto mt-2 max-w-7xl rounded-2xl bg-canvas-soft p-2 shadow-lg md:hidden backdrop-blur-md">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={(event) => { handleInternalNavigation(event, link.href); setOpen(false); }} className="rounded-xl px-4 py-3 font-link text-ink hover:bg-canvas">
                  {link.label}
                </a>
              ))}
              <a href="/#tester" onClick={() => setOpen(false)} className="mt-2 rounded-xl bg-primary px-4 py-3 text-center font-link text-on-primary">
                Start Typing
              </a>
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <UsernameModal isOpen={isUsernameModalOpen && isAuthenticated} initialUsername={username || ""} onSaved={saveUsername} />
    </>
  );
}
