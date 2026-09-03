import { useEffect, useRef, useState } from "react";
import { THEMES, ThemeId, applyTheme, loadTheme } from "../lib/themes";
import { cn } from "../utils/cn";
import { Palette, Check } from "lucide-react";

export default function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>("carbon-mint");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentThemeId(loadTheme());

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeId>;
      setCurrentThemeId(customEvent.detail);
    };

    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentTheme = THEMES.find((t) => t.id === currentThemeId) ?? THEMES[0];

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-[34px] items-center justify-center gap-2 rounded-full border px-2.5 font-label transition-colors sm:h-[36px] sm:px-3",
          isOpen
            ? "border-primary bg-primary/10 text-primary"
            : "border-hairline bg-canvas text-ink hover:bg-canvas-soft"
        )}
        aria-label={`Pick theme. Current theme: ${currentTheme.name}`}
      >
        <div className={isOpen ? "text-primary" : "text-ink"}>
          <Palette size={14} />
        </div>
        <span className="hidden sm:inline-block">Theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 flex max-h-[65vh] w-[min(18rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-[20px] border border-hairline bg-canvas-soft shadow-2xl animate-fade-up">
          <div className="border-b border-hairline px-3 py-2">
            <p className="font-caption text-text-muted">Three-tone palettes: background, text, typed</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
            <div className="flex flex-col gap-1">
              {THEMES.map((theme) => {
                const isActive = currentThemeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => applyTheme(theme.id)}
                    className={cn(
                      "group flex w-full min-w-0 items-center justify-between rounded-[14px] px-3 py-2.5 transition-all",
                      isActive
                        ? "bg-canvas text-ink shadow-sm border border-hairline"
                        : "border border-transparent text-text-muted hover:bg-canvas hover:text-ink hover:shadow-sm hover:border-hairline"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex w-4 shrink-0 justify-center">
                        {isActive && <Check size={14} className="text-primary" />}
                      </div>
                      <span className="truncate font-mono text-sm lowercase">{theme.name}</span>
                    </div>

                    <div
                      className="ml-2 flex shrink-0 items-center gap-1 rounded-full border border-black/5 bg-canvas p-1 dark:border-white/5"
                      aria-label={`${theme.name} colors`}
                    >
                      {theme.swatch.map((color, i) => (
                        <div
                          key={i}
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: color }}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
