import { cn } from "../utils/cn";

interface Props {
  onRestart: () => void;
  onReset: () => void;
  onStop: () => void;
  canStop: boolean;
  focusMode?: boolean;
}

export default function TestControls({ onRestart, onReset, onStop, canStop, focusMode = false }: Props) {
  return (
    <div className={cn(
      "flex flex-wrap items-center justify-center gap-3",
      focusMode && "pt-1 sm:pt-2"
    )}>
      <p className="hidden font-caption text-text-faint sm:block">
        {focusMode ? "Controls" : "Use the controls to manage your current session."}
      </p>
      <div className="flex w-full flex-wrap justify-center gap-3 sm:w-auto">
        <button
          type="button"
          onClick={onRestart}
          className={cn(
            "rounded-full border border-hairline bg-canvas px-5 py-2.5 font-link text-ink transition-colors duration-200 hover:border-text-muted hover:bg-canvas-soft",
            focusMode && "px-6 py-3"
          )}
        >
          Restart
        </button>
        <button
          type="button"
          onClick={onReset}
          className={cn(
            "rounded-full border border-hairline bg-canvas px-5 py-2.5 font-link text-ink transition-colors duration-200 hover:border-text-muted hover:bg-canvas-soft",
            focusMode && "px-6 py-3"
          )}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={onStop}
          disabled={!canStop}
          className={cn(
            "rounded-full border px-5 py-2.5 font-link transition-colors duration-200",
            focusMode && "px-6 py-3",
            canStop
              ? "border-red-500/40 bg-red-500/10 text-red-600 hover:bg-red-500/20"
              : "cursor-not-allowed border-hairline bg-canvas text-text-faint opacity-50"
          )}
        >
          Stop
        </button>
      </div>
    </div>
  );
}
