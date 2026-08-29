import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

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
    const trimmed = username.trim();

    if (trimmed.length < 2) return setError("Username must be at least 2 characters.");
    if (trimmed.length > 24) return setError("Username must be 24 characters or fewer.");

    setSaving(true);
    setError(null);
    const { error: updateError } = await supabase.auth.updateUser({ data: { username: trimmed } });
    setSaving(false);

    if (updateError) {
      setError(updateError.message || "Could not save your username.");
      return;
    }
    onSaved(trimmed);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#080b09] p-6 shadow-2xl sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-white">Choose your username</h2>
        <p className="mt-2 text-sm leading-6 text-[#a7aea9]">Pick the name you want to use on TypeItTestIt.</p>
        <form onSubmit={saveUsername} className="mt-6">
          <label htmlFor="username" className="text-xs font-medium text-[#a7aea9]">Username</label>
          <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} maxLength={24} autoFocus autoComplete="nickname" placeholder="e.g. SpeedTyper" className="mt-2 w-full rounded-xl border border-white/10 bg-[#0c100d] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#00ff66] focus:bg-[#101510] focus:ring-1 focus:ring-[#00ff66]" />
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={saving} className="mt-5 w-full rounded-xl bg-[#00ff66] px-4 py-3 text-sm font-bold text-black transition-transform hover:-translate-y-[1px] disabled:opacity-50">{saving ? "Saving..." : "Continue"}</button>
        </form>
      </div>
    </div>
  );
}
