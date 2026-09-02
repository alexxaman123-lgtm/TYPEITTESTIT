import { useEffect, useRef, useState } from "react";
import { ThemeMode, applyThemeMode, loadTheme } from "../lib/themes";
import { cn } from "../utils/cn";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<ThemeMode>("system");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentMode(loadTheme());

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeMode>;
      setCurrentMode(customEvent.detail);
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

  const getIcon = (mode: ThemeMode) => {
    switch (mode) {
      case "light": return <Sun size={14} />;
      case "dark": return <Moon size={14} />;
      case "system": return <Monitor size={14} />;
    }
  };

  const getLabel = (mode: ThemeMode) => {
    switch (mode) {
      case "light": return "Light";
      case "dark": return "Dark";
      case "system": return "System";
    }
  };

  const MODES: ThemeMode[] = ["light", "dark", "system"];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[36px] items-center justify-center gap-2 rounded-full border border-hairline bg-canvas px-3 font-label text-ink transition-colors hover:bg-canvas-soft"
        aria-label="Pick theme"
      >
        <div className="text-ink">
          {getIcon(currentMode)}
        </div>
        <span className="hidden sm:inline-block">{getLabel(currentMode)}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 animate-fade-up rounded-[20px] border border-hairline bg-canvas p-2 shadow-sm">
          <div className="flex flex-col gap-1">
            {MODES.map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  applyThemeMode(mode);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2 font-link transition-colors",
                  currentMode === mode 
                    ? "bg-canvas-soft text-ink" 
                    : "text-text-muted hover:bg-canvas-soft hover:text-ink"
                )}
              >
                {getIcon(mode)}
                <span className="truncate">{getLabel(mode)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
