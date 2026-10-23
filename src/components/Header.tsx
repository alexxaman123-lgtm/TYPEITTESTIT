import GoatMark from "./GoatMark";
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
        <div className={cn("pointer-events-auto mx-auto flex h-12 min-w-0 max-w-7xl items-center gap-1.5 rounded-full border px-3 sm:h-14 sm:gap-2 sm:px-6", "border-hairline-soft bg-canvas-soft/70 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.18)]", scrolled && "bg-canvas-soft/55")}>
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
          <div className="pointer-events-auto mx-auto mt-2 max-w-7xl rounded-2xl border border-hairline-soft bg-canvas-soft/65 p-2 shadow-lg backdrop-blur-xl">
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
