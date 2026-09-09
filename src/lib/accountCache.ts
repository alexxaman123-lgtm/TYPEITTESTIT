// Lightweight, best-effort local cache of the signed-in user's display
// name and avatar. Header.tsx seeds its initial render from this so a
// returning visitor's username/avatar appears in the very first paint --
// the same paint as the static Leaderboard/About/Contact nav links --
// instead of only appearing after the Supabase auth + profile network
// round trip resolves. This is purely a perceived-performance optimization:
// the real source of truth is always the live Supabase session, which
// corrects or clears this cache shortly after mount.
const USERNAME_CACHE_KEY = "goattype-cached-username-v1";
const AVATAR_CACHE_KEY = "goattype-cached-avatar-v1";

export function getCachedUsername(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(USERNAME_CACHE_KEY) || null;
  } catch {
    return null;
  }
}

export function setCachedUsername(username: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (username) {
      window.localStorage.setItem(USERNAME_CACHE_KEY, username);
    } else {
      window.localStorage.removeItem(USERNAME_CACHE_KEY);
    }
  } catch {
    // Ignore storage errors (private browsing, quota, disabled storage).
  }
}

// Google profile picture URL (from Supabase user_metadata.avatar_url /
// .picture after "Continue with Google"). Cached the same way as the
// username so the header avatar doesn't pop in late.
export function getCachedAvatarUrl(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(AVATAR_CACHE_KEY) || null;
  } catch {
    return null;
  }
}

export function setCachedAvatarUrl(avatarUrl: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (avatarUrl) {
      window.localStorage.setItem(AVATAR_CACHE_KEY, avatarUrl);
    } else {
      window.localStorage.removeItem(AVATAR_CACHE_KEY);
    }
  } catch {
    // Ignore storage errors (private browsing, quota, disabled storage).
  }
}
