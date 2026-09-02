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
    <div className="animate-fade-up rounded-[24px] border border-hairline bg-canvas p-6 shadow-sm sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-label text-accent">Custom mode</span>
          <h3 className="mt-1 font-heading-5 text-ink">Custom Typing Test</h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="font-link text-text-muted transition-colors hover:text-ink"
        >
          Cancel
        </button>
      </div>
      <p className="mt-2 font-body text-text-muted">
        Choose how you want to use Custom Text, then start typing or load your own passage.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2" role="tablist" aria-label="Custom text mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "free"}
          onClick={() => selectMode("free")}
          className={cn(
            "rounded-[20px] border px-4 py-4 text-left font-link transition-colors duration-200",
            mode === "free"
              ? "border-accent bg-accent/10 text-accent"
              : "border-hairline bg-canvas-soft text-ink hover:border-text-muted"
          )}
        >
          <span className="block">Type Your Own Text</span>
          <span className={cn("mt-1 block font-caption", mode === "free" ? "text-accent/80" : "text-text-muted")}>Start writing immediately</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "paste"}
          onClick={() => selectMode("paste")}
          className={cn(
            "rounded-[20px] border px-4 py-4 text-left font-link transition-colors duration-200",
            mode === "paste"
              ? "border-accent bg-accent/10 text-accent"
              : "border-hairline bg-canvas-soft text-ink hover:border-text-muted"
          )}
        >
          <span className="block">Paste Text</span>
          <span className={cn("mt-1 block font-caption", mode === "paste" ? "text-accent/80" : "text-text-muted")}>Use a passage as the source</span>
        </button>
      </div>

      {mode === "free" ? (
        <div className="mt-6 rounded-[20px] border border-hairline bg-canvas-soft p-5 sm:p-6">
          <p className="font-body text-text-muted">
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
              "mt-5 w-full resize-none rounded-[20px] border bg-canvas-soft p-4 font-body text-ink placeholder:text-text-faint focus:outline-none",
              error ? "border-red-500" : "border-hairline focus:border-accent"
            )}
          />
          {error && <p className="mt-2 font-caption text-red-500">{error}</p>}
        </>
      )}

      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mb-3 block font-label text-text-muted">Duration</span>
          <DurationSelector value={localDuration} onChange={setLocalDuration} />
        </div>
        {mode === "free" ? (
          <button
            type="button"
            onClick={() => onStartFree(localDuration)}
            className="rounded-full bg-primary px-6 py-3 font-link text-on-primary transition-opacity hover:opacity-90"
          >
            Start Free Typing
          </button>
        ) : (
          <button
            type="button"
            onClick={handleStartPaste}
            className="rounded-full bg-primary px-6 py-3 font-link text-on-primary transition-opacity hover:opacity-90"
          >
            Use This Text
          </button>
        )}
      </div>
    </div>
  );
}
