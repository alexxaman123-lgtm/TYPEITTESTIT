import { useEffect, useRef, useState } from "react";
import { THEMES, ThemeId, applyTheme, loadTheme } from "../lib/themes";
import { cn } from "../utils/cn";

export default function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>("goat-neon");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentTheme(loadTheme());

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeId>;
      setCurrentTheme(customEvent.detail);
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

  const activeThemeDef = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[36px] items-center justify-center gap-2 rounded-full border border-hairline bg-canvas px-3 font-label text-ink transition-colors hover:bg-canvas-soft"
        aria-label="Pick theme"
      >
        <div 
          className="h-3.5 w-3.5 rounded-full border border-hairline shadow-[0_1px_2px_rgba(0,0,0,0.1)]" 
          style={{ backgroundColor: activeThemeDef.primary }} 
        />
        <span className="hidden sm:inline-block">Theme</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 animate-fade-up rounded-[20px] border border-hairline bg-canvas p-2 shadow-sm">
          <div className="flex flex-col gap-1">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  applyTheme(theme.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2 font-link transition-colors",
                  currentTheme === theme.id 
                    ? "bg-canvas-soft text-ink" 
                    : "text-text-muted hover:bg-canvas-soft hover:text-ink"
                )}
              >
                <div 
                  className="h-4 w-4 shrink-0 rounded-full border border-hairline shadow-[0_1px_2px_rgba(0,0,0,0.1)]" 
                  style={{ backgroundColor: theme.primary }} 
                />
                <span className="truncate">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
