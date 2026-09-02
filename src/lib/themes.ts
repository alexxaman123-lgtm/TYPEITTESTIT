export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "goattype-theme-mode";

export function applyThemeMode(mode: ThemeMode): void {
  const root = document.documentElement;
  
  if (mode === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  } else if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  window.localStorage.setItem(STORAGE_KEY, mode);
  window.dispatchEvent(new CustomEvent("themechange", { detail: mode }));
}

export function loadTheme(): ThemeMode {
  const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  const validModes: ThemeMode[] = ["light", "dark", "system"];
  const mode = saved && validModes.includes(saved) ? saved : "system";
  
  applyThemeMode(mode);
  
  return mode;
}

// Watch for system theme changes if in system mode
if (typeof window !== "undefined") {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    const currentMode = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (currentMode === "system" || !currentMode) {
      applyThemeMode("system");
    }
  });
}
