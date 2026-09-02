import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { validateUsername } from "../lib/username";

interface UsernameModalProps {
  isOpen: boolean;
  initialUsername?: string;
  onSaved: (username: string) => void;
}

export default function UsernameModal({ isOpen, initialUsername = "", onSaved }: UsernameModalProps) {
  const [username, setUsername] = useState(initialUsername);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsername(initialUsername);
    setError(null);
  }, [initialUsername, isOpen]);

  if (!isOpen) return null;

  const saveUsername = async (event: React.FormEvent) => {
    event.preventDefault();
    const validation = validateUsername(username);

    if (validation.error) {
      setError(validation.error);
      return;
    }

    setSaving(true);
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSaving(false);
      setError("Please sign in with Google before choosing a username.");
      return;
    }

    const { error: saveError } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        username: validation.username,
      },
      { onConflict: "user_id" },
    );

    if (saveError) {
      setSaving(false);
      if (saveError.code === "23505" || /unique|already taken/i.test(saveError.message || "")) {
        setError("That username is already taken. Please choose another one.");
      } else if (saveError.code === "42501") {
        setError("Username setup is not enabled yet. Please check the Supabase profiles permissions.");
      } else {
        setError(saveError.message || "Could not save your username.");
      }
      return;
    }

    // Keep the username in Supabase Auth metadata too. This gives the header
    // a reliable client-side fallback even when profile SELECT policies are restricted.
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { username: validation.username },
    });

    setSaving(false);

    if (metadataError) {
      console.warn("Profile username saved, but auth metadata update failed:", metadataError.message);
    }

    onSaved(validation.username);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-ink/10 backdrop-blur-[2px] transition-opacity" />
      <div className="relative w-full max-w-md rounded-[24px] border border-hairline bg-canvas p-6 shadow-sm sm:p-8 animate-fade-up">
        <h2 className="font-heading-4 text-ink">Choose your username</h2>
        <p className="mt-2 font-body text-text-muted">This name may be displayed with your leaderboard results.</p>
        <form onSubmit={saveUsername} className="mt-6">
          <label htmlFor="username" className="font-label text-text-muted">Username</label>
          <input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            maxLength={24}
            autoFocus
            autoComplete="nickname"
            aria-describedby="username-help username-error"
            placeholder="e.g. SpeedTyper"
            className="mt-2 w-full rounded-full border border-hairline bg-canvas px-4 py-3 font-link text-ink outline-none transition-all focus:border-ink"
          />
          <p id="username-help" className="mt-2 font-caption text-text-muted">Use 3–24 letters, numbers, underscores, or hyphens. Usernames are unique and must be respectful.</p>
          {error && <p id="username-error" className="mt-2 font-caption text-error" role="alert">{error}</p>}
          <button type="submit" disabled={saving} className="mt-5 w-full rounded-full bg-primary px-4 py-3 font-link text-on-primary transition-opacity hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
