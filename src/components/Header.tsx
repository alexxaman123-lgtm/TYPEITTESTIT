import { useEffect, useState, type MouseEvent } from "react";
import { cn } from "../utils/cn";
import { navigateTo } from "../utils/navigation";
import { supabase } from "../supabaseClient";
import type { Locale } from "../lib/i18n";
import { LOCALE_META, localePrefix, tr, withLocalePrefix } from "../lib/i18n";
import AuthModal from "./AuthModal";
import UsernameModal from "./UsernameModal";
import ThemePicker from "./ThemePicker";
import LanguagePicker from "./LanguagePicker";
import { getCachedAvatarUrl, getCachedUsername, setCachedAvatarUrl, setCachedUsername } from "../lib/accountCache";

function GoatMark() {
  return (
    <svg aria-hidden="true" className="ml-1 h-6 w-6 shrink-0 text-accent sm:h-7 sm:w-7" viewBox="0 0 362 400" fill="currentColor">
      <path d="M 169 349 193 350 181 377 179 376 168 351 Z M 171 306 189 305 190 307 180 316 Z M 248 180 252 181 256 185 256 189 250 194 246 193 243 190 243 184 Z M 111 180 115 181 118 184 118 190 113 194 109 193 105 189 105 185 Z M 267 132 278 118 290 111 297 109 318 108 342 113 344 115 333 123 312 131 297 132 281 130 270 133 Z M 17 115 19 113 35 109 64 109 71 111 83 118 94 132 91 133 79 130 65 132 49 131 34 126 Z M 325 97 328 97 Z M 33 97 36 97 Z M 36 95 50 91 74 91 98 97 115 105 121 105 124 101 124 88 128 85 152 81 163 97 166 99 195 99 198 97 206 84 209 81 235 86 237 88 237 101 240 105 246 105 263 97 286 91 310 91 320 93 326 96 305 96 286 100 269 110 259 122 254 132 250 145 250 152 254 168 244 169 238 172 234 176 219 202 219 208 223 211 228 210 235 199 244 205 254 205 255 208 251 225 245 241 230 266 221 286 213 321 201 333 187 338 186 328 206 307 206 298 201 294 160 294 155 298 154 305 156 309 175 328 175 337 172 338 162 334 149 323 140 286 131 266 117 243 110 225 106 208 107 205 117 205 126 199 131 208 135 211 140 210 143 205 127 176 117 169 107 168 111 152 111 145 107 132 102 122 92 110 80 102 64 97 36 97 Z M 261 19 262 20 254 29 243 46 235 64 233 72 230 73 219 70 221 64 234 41 249 26 Z M 100 19 112 26 127 41 140 64 142 70 131 73 128 72 126 64 117 44 106 28 100 22 Z M 261 19 263 19 Z M 98 19 100 19 Z M 66 0 62 4 63 9 77 17 88 26 98 37 106 49 116 72 116 75 112 79 112 89 111 90 89 82 72 79 52 79 41 81 27 86 14 94 0 109 0 115 6 122 15 129 32 138 49 143 81 142 89 144 99 151 94 170 93 199 96 219 102 238 126 283 131 296 138 328 151 341 175 396 178 399 183 399 188 392 210 341 223 328 233 288 257 243 264 223 268 200 268 178 265 159 262 151 268 146 280 142 312 143 329 138 343 131 357 120 361 115 361 109 348 95 338 88 316 80 281 80 265 84 250 90 249 89 249 79 245 75 245 72 255 49 263 37 273 26 298 9 299 4 295 0 283 0 265 4 248 12 241 17 223 36 213 53 208 67 206 69 201 70 190 87 171 87 160 70 155 69 153 67 148 53 138 36 120 17 96 4 78 0 Z" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {open ? <path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" /> : <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />}
    </svg>
  );
}

function handleInternalNavigation(event: MouseEvent<HTMLAnchorElement>, href: string): void {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
  if (href.startsWith("/") && !href.startsWith("/#")) return;
  if (href.startsWith("/#")) return;
  navigateTo(href);
}

// Small circular avatar used in the header account pill: the user's Google
// profile photo when available (from Supabase auth user_metadata), else an
// initial-letter placeholder in the site's accent color so the pill never
// looks empty while signed in. Falls back to the initial if the image URL
// fails to load (blocked, expired, or otherwise broken).
function HeaderAvatar({ avatarUrl, username, size }: { avatarUrl: string | null; username: string | null; size: number }) {
  const [imgFailed, setImgFailed] = useState(false);
  const style = { width: size, height: size };
  if (avatarUrl && !imgFailed) {
    return <img src={avatarUrl} alt="" referrerPolicy="no-referrer" onError={() => setImgFailed(true)} style={style} className="shrink-0 rounded-full object-cover ring-1 ring-hairline" />;
  }
  const initial = (username || "?").trim().charAt(0).toUpperCase() || "?";
  return <span style={style} className="flex shrink-0 items-center justify-center rounded-full bg-accent/15 font-semibold text-accent" aria-hidden="true">{initial}</span>;
}

/**
 * Site header. Locale drives nav labels, hrefs, and copy through LOCALE_META
 * and tr() -- see Footer.tsx, LanguagePicker.tsx, AuthModal.tsx, and
 * UsernameModal.tsx for the same pattern. Adding a new locale means adding
 * one entry to src/lib/i18n.ts, not a new component file, so structural
 * changes (layout, animation, auth flow) only ever need to be made once.
 */
export default function Header({ locale = "en" as Locale }: { locale?: Locale }) {
  const meta = LOCALE_META[locale] ?? LOCALE_META.en;
  const prefix = localePrefix(locale);

  const NAV_LINKS = [
    { label: tr(locale, "nav", "leaderboard"), href: withLocalePrefix(locale, "/leaderboard/") },
    { label: tr(locale, "nav", "about"), href: withLocalePrefix(locale, "/about/") },
    { label: tr(locale, "nav", "contact"), href: withLocalePrefix(locale, "/contact/") },
  ];
  const typingHistoryLabel = tr(locale, "nav", "typingHistory");
  const primaryNavLabel = tr(locale, "nav", "primaryNav");
  const mobileNavLabel = tr(locale, "nav", "mobileNav");
  const homeHref = withLocalePrefix(locale, "/");

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  // Seed from the locally cached username/avatar (written the last time we
  // confirmed a session) so a returning signed-in visitor sees their name
  // and photo in the same paint as the static Leaderboard/About/Contact
  // links, instead of it popping in only after the Supabase auth + profile
  // round trip resolves. The effect below still runs and corrects/clears
  // this if the cache is stale (e.g. signed out on another tab).
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getCachedUsername()));
  const [username, setUsername] = useState<string | null>(() => getCachedUsername());
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => getCachedAvatarUrl());

  useEffect(() => {
    let frame = 0;
    let lastScrolled = window.scrollY > 8;
    setScrolled(lastScrolled);
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const next = window.scrollY > 8;
        if (next === lastScrolled) return;
        lastScrolled = next;
        setScrolled(next);
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
    const sync = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!mounted) return;
      if (error || !user) {
        setIsAuthenticated(false);
        setUsername(null);
        setAvatarUrl(null);
        setCachedUsername(null);
        setCachedAvatarUrl(null);
        setIsUsernameModalOpen(false);
        return;
      }
      setIsAuthenticated(true);
      const metadataAvatar = typeof user.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : typeof user.user_metadata?.picture === "string" ? user.user_metadata.picture : null;
      setAvatarUrl(metadataAvatar);
      setCachedAvatarUrl(metadataAvatar);
      const metadata = typeof user.user_metadata?.username === "string" ? user.user_metadata.username.trim() : null;
      const { data: profile, error: profileError } = await supabase.from("profiles").select("username").eq("user_id", user.id).maybeSingle();
      if (!mounted) return;
      if (profileError) {
        console.error("Could not load profile:", profileError.message);
        setUsername(metadata);
        setCachedUsername(metadata);
        setIsUsernameModalOpen(!metadata);
        return;
      }
      const current = profile?.username?.trim() || metadata || null;
      setUsername(current);
      setCachedUsername(current);
      setIsUsernameModalOpen(!current);
    };
    void sync();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setUsername(null);
        setAvatarUrl(null);
        setCachedUsername(null);
        setCachedAvatarUrl(null);
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

  const loginLabel = tr(locale, "nav", "login");
  const signedInLabel = tr(locale, "nav", "signedIn");
  const accountHref = `${prefix}/account/`;

  // Signed-in states are now links to the account page (typing history,
  // account info, linked email) -- the whole pill is clickable, not just
  // the separate "Typing History" nav item next to it. The pill also shows
  // the user's Google profile photo (or an initial-letter placeholder) next
  // to their name.
  const accountLabel = username ? (
    <a href={accountHref} onClick={(event) => handleInternalNavigation(event, accountHref)} className="flex min-w-0 items-center gap-2 font-link text-ink hover:text-text-muted" title={username}>
      <HeaderAvatar avatarUrl={avatarUrl} username={username} size={20} />
      <span className="max-w-[100px] truncate">{username}</span>
    </a>
  ) : isAuthenticated ? (
    <a href={accountHref} onClick={(event) => handleInternalNavigation(event, accountHref)} className="flex items-center gap-2 font-link text-ink hover:text-text-muted">
      <HeaderAvatar avatarUrl={avatarUrl} username={username} size={20} />
      <span>{signedInLabel}</span>
    </a>
  ) : (
    <button type="button" onClick={() => setIsAuthModalOpen(true)} className="font-link text-ink hover:text-text-muted">{loginLabel}</button>
  );

  const mobileAccountLabel = username ? (
    <a href={accountHref} onClick={(event) => handleInternalNavigation(event, accountHref)} className="flex min-w-0 items-center gap-1.5" title={username}>
      <HeaderAvatar avatarUrl={avatarUrl} username={username} size={18} />
      <span className="max-w-[56px] truncate text-[12px] font-semibold leading-none text-ink sm:max-w-[100px] sm:text-base">{username}</span>
    </a>
  ) : isAuthenticated ? (
    <a href={accountHref} onClick={(event) => handleInternalNavigation(event, accountHref)} className="flex items-center gap-1.5">
      <HeaderAvatar avatarUrl={avatarUrl} username={username} size={18} />
      <span className="max-w-[64px] truncate whitespace-nowrap text-[12px] font-semibold leading-none text-ink sm:max-w-none sm:text-base">{signedInLabel}</span>
    </a>
  ) : (
    <button type="button" onClick={() => setIsAuthModalOpen(true)} className="max-w-[72px] truncate whitespace-nowrap text-[12px] font-semibold leading-none text-ink hover:text-text-muted">{loginLabel}</button>
  );

  return (
    <>
      <header className="sticky top-3 z-50 w-full px-2 sm:top-6 sm:px-6 pointer-events-none">
        <div className={cn("pointer-events-auto mx-auto flex h-12 min-w-0 max-w-7xl items-center gap-1.5 rounded-full border px-3 sm:h-14 sm:gap-2 sm:px-6", "border-white/10 bg-canvas-soft/70 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.18)]", scrolled && "bg-canvas-soft/55")}>
          <a href={homeHref} onClick={(event) => handleInternalNavigation(event, homeHref)} className="flex min-w-0 flex-1 items-center select-none" aria-label={meta.brandParts.join("").trim() ? tr(locale, "nav", "homeAria") : meta.brand}>
            <span className="font-title min-w-0 shrink truncate text-[14px] font-semibold leading-tight tracking-tight sm:text-xl">{meta.brandParts[0]}</span>
            <span className="font-title hidden shrink-0 text-[14px] font-semibold leading-tight tracking-tight text-primary sm:inline sm:text-xl">{meta.brandParts[1]}</span>
            <div className="hidden shrink-0 text-primary sm:block"><GoatMark /></div>
          </a>
          <nav className="hidden items-center gap-4 lg:gap-6 md:flex" aria-label={primaryNavLabel}>
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={(event) => handleInternalNavigation(event, link.href)} className="whitespace-nowrap font-link text-ink hover:text-text-muted">{link.label}</a>
            ))}
          </nav>
          <div className="hidden items-center gap-3 lg:gap-4 md:flex">
            <ThemePicker locale={locale} />
            <LanguagePicker locale={locale} />
            {isAuthenticated && <a href={accountHref} onClick={(event) => handleInternalNavigation(event, accountHref)} className="whitespace-nowrap font-link text-ink hover:text-text-muted">{typingHistoryLabel}</a>}
            <div className="inline-flex max-w-[180px] items-center rounded-full border border-hairline bg-canvas/55 px-4 py-2">{accountLabel}</div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:hidden">
            <LanguagePicker locale={locale} />
            <ThemePicker locale={locale} />
            <div className="inline-flex max-w-[112px] items-center rounded-full border border-hairline bg-canvas/55 px-3 py-1.5">{mobileAccountLabel}</div>
            <button type="button" onClick={() => setOpen((v) => !v)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas/55 text-ink shadow-sm sm:h-9 sm:w-9" aria-label={open ? tr(locale, "nav", "closeMenu") : tr(locale, "nav", "openMenu")} aria-expanded={open}>
              <MenuIcon open={open} />
            </button>
          </div>
        </div>
        {open && (
          <div className="pointer-events-auto mx-auto mt-2 max-w-7xl rounded-2xl border border-white/10 bg-canvas-soft/65 p-2 shadow-lg backdrop-blur-xl">
            <nav className="flex flex-col gap-1" aria-label={mobileNavLabel}>
              {isAuthenticated && <a href={accountHref} onClick={(event) => { handleInternalNavigation(event, accountHref); setOpen(false); }} className="rounded-xl px-4 py-3 font-link text-ink hover:bg-canvas/60">{typingHistoryLabel}</a>}
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-link text-ink hover:bg-canvas/60">{link.label}</a>
              ))}
            </nav>
          </div>
        )}
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} locale={locale} />
      <UsernameModal isOpen={isUsernameModalOpen && isAuthenticated} initialUsername={username || ""} onSaved={(value) => { setUsername(value); setIsUsernameModalOpen(false); }} locale={locale} />
    </>
  );
}
