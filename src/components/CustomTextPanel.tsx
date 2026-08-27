import { useState } from "react";
import DurationSelector from "./DurationSelector";
import { cn } from "../utils/cn";

type CustomMode = "free" | "paste";

interface Props {
  duration: number;
  onStartFree: (duration: number) => void;
  onStartPaste: (text: string, duration: number) => void;
  onCancel: () => void;
}

export default function CustomTextPanel({ duration, onStartFree, onStartPaste, onCancel }: Props) {
  const [mode, setMode] = useState<CustomMode>("free");
  const [text, setText] = useState("");
  const [localDuration, setLocalDuration] = useState(duration);
  const [error, setError] = useState<string | null>(null);

  const handleStartPaste = () => {
    if (text.trim().length < 20) {
      setError("Please enter at least a few sentences before starting a custom test.");
      return;
    }
    setError(null);
    onStartPaste(text, localDuration);
  };

  const selectMode = (nextMode: CustomMode) => {
    setMode(nextMode);
    setError(null);
  };

  return (
    <div className="animate-fade-up rounded-2xl border border-white/10 bg-surface2/70 p-6 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.95)] sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Custom mode</span>
          <h3 className="mt-1 text-lg font-bold text-ink">Custom Typing Test</h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          Cancel
        </button>
      </div>
      <p className="mt-1 text-sm text-muted">
        Choose how you want to use Custom Text, then start typing or load your own passage.
      </p>

      <div className="mt-5 grid gap-2 sm:grid-cols-2" role="tablist" aria-label="Custom text mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "free"}
          onClick={() => selectMode("free")}
          className={cn(
            "interactive-lift rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-200",
            mode === "free"
              ? "border-accent/50 bg-accent/10 text-accent"
              : "border-white/12 bg-surface3/50 text-ink-soft hover:border-accent/40 hover:text-ink"
          )}
        >
          <span className="block">Type Your Own Text</span>
          <span className="mt-1 block text-xs font-normal text-muted">Start writing immediately</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "paste"}
          onClick={() => selectMode("paste")}
          className={cn(
            "interactive-lift rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all duration-200",
            mode === "paste"
              ? "border-accent/50 bg-accent/10 text-accent"
              : "border-white/12 bg-surface3/50 text-ink-soft hover:border-accent/40 hover:text-ink"
          )}
        >
          <span className="block">Paste Text</span>
          <span className="mt-1 block text-xs font-normal text-muted">Use a passage as the source</span>
        </button>
      </div>

      {mode === "free" ? (
        <div className="mt-5 rounded-xl border border-accent/10 bg-surface3/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-6">
          <p className="text-sm leading-6 text-muted">
            Type anything you want. The timer starts with your first character and the same live WPM and
            accuracy metrics are used during the test.
          </p>
        </div>
      ) : (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or write your own text here..."
            rows={6}
            aria-label="Custom text passage"
            className={cn(
              "mt-4 w-full resize-none rounded-xl border bg-surface3/80 p-4 font-sans text-sm text-ink-soft placeholder:text-faint focus:outline-none",
              error ? "border-danger/50" : "border-white/10 focus:border-accent/50"
            )}
          />

          {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        </>
      )}

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-faint">Duration</span>
          <DurationSelector value={localDuration} onChange={setLocalDuration} />
        </div>

        {mode === "free" ? (
          <button
            type="button"
            onClick={() => onStartFree(localDuration)}
            className="rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black shadow-[0_0_18px_rgba(0,255,102,0.35)] transition-all duration-200 hover:brightness-110 active:translate-y-0.5"
          >
            Start Free Typing
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStartPaste}
            className="rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black shadow-[0_0_18px_rgba(0,255,102,0.35)] transition-all duration-200 hover:brightness-110 active:translate-y-0.5"
          >
            Use This Text
          </button>
        )}
      </div>
    </div>
  );
}
