import { useEffect, useRef, useState } from "react";
import { applyTheme, loadTheme, THEMES, type ThemeId } from "../lib/themes";
import { cn } from "../utils/cn";

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [themeId, setThemeId] = useState<ThemeId>(() => loadTheme());
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    applyTheme(themeId);
  }, [themeId]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const currentTheme = THEMES.find((theme) => theme.id === themeId) ?? THEMES[0];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-semibold text-ink-soft transition-colors",
          open ? "border-accent/40 bg-accent/10 text-ink" : "border-white/10 bg-surface2/70 hover:border-accent/30 hover:text-ink"
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Theme: ${currentTheme.name}`}
        title={`Theme: ${currentTheme.name}`}
      >
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 rounded-full border border-white/20"
          style={{ background: currentTheme.preview }}
        />
        <span className="hidden lg:inline">Theme</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose a theme"
          className="absolute right-0 top-[calc(100%+10px)] z-[70] w-[280px] rounded-2xl border border-white/10 bg-surface2/95 p-3 shadow-[0_22px_70px_-28px_rgba(0,0,0,0.95)] backdrop-blur-xl"
        >
          <div className="px-2 pb-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-faint">Choose a theme</p>
            <p className="mt-1 text-xs text-muted">Your choice stays saved on this device.</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {THEMES.map((theme) => {
              const selected = theme.id === themeId;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    setThemeId(theme.id);
                    applyTheme(theme.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "group rounded-xl border p-2 text-left transition-all",
                    selected
                      ? "border-accent/60 bg-accent/10"
                      : "border-white/8 bg-surface1/70 hover:border-white/20 hover:bg-surface1"
                  )}
                  aria-pressed={selected}
                >
                  <span
                    aria-hidden="true"
                    className="mb-2 block h-7 rounded-lg border border-white/10"
                    style={{ background: theme.preview }}
                  />
                  <span className="flex items-center justify-between gap-2">
                    <span className={cn("truncate text-xs font-semibold", selected ? "text-accent" : "text-ink-soft")}>
                      {theme.name}
                    </span>
                    {selected && <span className="text-[10px] font-bold text-accent">✓</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
