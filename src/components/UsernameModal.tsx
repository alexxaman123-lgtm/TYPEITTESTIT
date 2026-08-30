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

    // Never allow username setup without an authenticated Supabase user.
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSaving(false);
      setError("Please sign in with Google before choosing a username.");
      return;
    }

    // Store the username directly against the authenticated user's UUID.
    // This avoids depending on a database RPC/function that may not exist.
    const { error: saveError } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        username: validation.username,
      },
      { onConflict: "user_id" },
    );

    setSaving(false);

    if (saveError) {
      if (saveError.code === "23505" || /unique|already taken/i.test(saveError.message || "")) {
        setError("That username is already taken. Please choose another one.");
      } else if (saveError.code === "42501") {
        setError("Username setup is not enabled yet. Please try again after the database permissions are set up.");
      } else {
        setError(saveError.message || "Could not save your username.");
      }
      return;
    }

    onSaved(validation.username);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#080b09] p-6 shadow-2xl sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-white">Choose your username</h2>
        <p className="mt-2 text-sm leading-6 text-[#a7aea9]">
          This name may be displayed with your leaderboard results.
        </p>
        <form onSubmit={saveUsername} className="mt-6">
          <label htmlFor="username" className="text-xs font-medium text-[#a7aea9]">Username</label>
          <input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            maxLength={24}
            autoFocus
            autoComplete="nickname"
            aria-describedby="username-help username-error"
            placeholder="e.g. SpeedTyper"
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0c100d] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#00ff66] focus:bg-[#101510] focus:ring-1 focus:ring-[#00ff66]"
          />
          <p id="username-help" className="mt-2 text-xs leading-5 text-[#a7aea9]">
            Use 3–24 letters, numbers, underscores, or hyphens. Usernames are unique and must be respectful.
          </p>
          {error && <p id="username-error" className="mt-2 text-xs text-red-400" role="alert">{error}</p>}
          <button type="submit" disabled={saving} className="mt-5 w-full rounded-xl bg-[#00ff66] px-4 py-3 text-sm font-bold text-black transition-transform hover:-translate-y-[1px] disabled:opacity-50">
            {saving ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
