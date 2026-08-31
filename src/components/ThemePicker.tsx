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
  const currentBackground = currentTheme.variables["--color-bg"] ?? "#050706";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-semibold text-ink-soft transition-all duration-200",
          open
            ? "border-accent/45 bg-accent/10 text-ink shadow-[0_8px_24px_-18px_var(--color-accent)]"
            : "border-white/10 bg-surface2/70 hover:border-accent/30 hover:text-ink"
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Theme: ${currentTheme.name}`}
        title={`Theme: ${currentTheme.name}`}
      >
        <span className="flex items-center gap-0.5" aria-hidden="true">
          <span
            className="h-3 w-3 rounded-full border border-white/20 shadow-sm"
            style={{ backgroundColor: currentTheme.accent }}
          />
          <span
            className="-ml-0.5 h-2.5 w-2.5 rounded-full border border-white/15 shadow-sm"
            style={{ backgroundColor: currentBackground }}
          />
        </span>
        <span className="hidden lg:inline">Theme</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose a theme"
          className="absolute right-0 top-[calc(100%+10px)] z-[70] w-[340px] rounded-2xl border border-white/10 bg-surface2/96 p-4 shadow-[0_26px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
        >
          <div className="px-1 pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-faint">Choose a theme</p>
                <p className="mt-1 text-xs text-muted">Saved automatically on this device.</p>
              </div>
              <span
                className="h-2.5 w-2.5 rounded-full shadow-[0_0_16px_var(--color-accent)]"
                style={{ backgroundColor: "var(--color-accent)" }}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {THEMES.map((theme) => {
              const selected = theme.id === themeId;
              const themeBackground = theme.variables["--color-bg"] ?? "#050706";

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
                    "group rounded-xl border p-3 text-left transition-all duration-200",
                    selected
                      ? "border-accent/55 bg-accent/8 shadow-[0_10px_28px_-20px_var(--color-accent)]"
                      : "border-white/8 bg-surface1/65 hover:-translate-y-px hover:border-white/18 hover:bg-surface1"
                  )}
                  aria-pressed={selected}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
                      Palette
                    </span>
                    {selected && <span className="text-xs font-bold text-accent">Selected</span>}
                  </div>

                  <span className="mb-2.5 flex items-center gap-2" aria-hidden="true">
                    <span
                      className="h-9 w-9 rounded-full border border-white/15 shadow-[0_0_14px_rgba(0,0,0,0.18)]"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <span
                      className="h-9 w-9 rounded-full border border-white/15 shadow-[0_0_14px_rgba(0,0,0,0.18)]"
                      style={{ backgroundColor: themeBackground }}
                    />
                  </span>

                  <span className={cn("block truncate text-xs font-semibold", selected ? "text-accent" : "text-ink-soft")}>
                    {theme.name}
                  </span>
                  <span className="mt-1 block text-[10px] text-faint">Accent + background</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
