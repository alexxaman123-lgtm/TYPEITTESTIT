import { cn } from "../utils/cn";

interface Props {
  onRestart: () => void;
  onReset: () => void;
  onStop: () => void;
  canStop: boolean;
}

export default function TestControls({ onRestart, onReset, onStop, canStop }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-between">
      <p className="hidden text-xs text-faint sm:block">
        Use the controls to manage your current session.
      </p>
      <div className="flex w-full flex-wrap justify-center gap-3 sm:w-auto">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg border border-white/12 bg-surface3 px-4 py-2.5 text-sm font-semibold text-ink-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:text-ink active:translate-y-0"
        >
          Restart
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-white/12 bg-surface3 px-4 py-2.5 text-sm font-semibold text-ink-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:text-ink active:translate-y-0"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onStop}
          disabled={!canStop}
          className={cn(
            "rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:translate-y-0",
            canStop
              ? "border-danger/40 bg-danger/10 text-danger hover:-translate-y-0.5 hover:bg-danger/20"
              : "cursor-not-allowed border-white/10 bg-surface3 text-faint opacity-50"
          )}
        >
          Stop
        </button>
      </div>
    </div>
  );
}
