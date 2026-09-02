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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-[36px] items-center justify-center gap-2 rounded-full border px-3 font-label transition-colors",
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
        <div className="absolute right-0 top-full mt-2 w-72 max-h-[60vh] flex flex-col overflow-hidden animate-fade-up rounded-[20px] border border-hairline bg-canvas-soft shadow-2xl">
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
                      "group flex w-full items-center justify-between rounded-[14px] px-3 py-2.5 transition-all",
                      isActive
                        ? "bg-canvas text-ink shadow-sm border border-hairline"
                        : "border border-transparent text-text-muted hover:bg-canvas hover:text-ink hover:shadow-sm hover:border-hairline"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex w-4 justify-center">
                        {isActive && <Check size={14} className="text-primary" />}
                      </div>
                      <span className="font-mono text-sm lowercase">{theme.name}</span>
                    </div>

                    <div
                      className="flex items-center gap-1 rounded-full border border-black/5 bg-canvas p-1 dark:border-white/5"
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
