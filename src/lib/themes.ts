export type ThemeId =
  | "goat-neon"
  | "royal-azure"
  | "sunset-orange"
  | "orchid-purple"
  | "cherry-red"
  | "slate-minimal";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  primary: string; // Used for the swatch preview
  variables: Record<string, string>;
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "goat-neon",
    name: "Goat Neon",
    primary: "#00ff66",
    variables: {
      "--color-primary": "#00ff66",
      "--color-on-primary": "#000000",
      "--color-accent": "#00aa44",
    },
  },
  {
    id: "royal-azure",
    name: "Royal Azure",
    primary: "#0066FF",
    variables: {
      "--color-primary": "#0066FF",
      "--color-on-primary": "#ffffff",
      "--color-accent": "#0052CC",
    },
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    primary: "#FF5500",
    variables: {
      "--color-primary": "#FF5500",
      "--color-on-primary": "#ffffff",
      "--color-accent": "#CC4400",
    },
  },
  {
    id: "orchid-purple",
    name: "Orchid Purple",
    primary: "#A32CC4",
    variables: {
      "--color-primary": "#A32CC4",
      "--color-on-primary": "#ffffff",
      "--color-accent": "#82239C",
    },
  },
  {
    id: "cherry-red",
    name: "Cherry Red",
    primary: "#E62E2D",
    variables: {
      "--color-primary": "#E62E2D",
      "--color-on-primary": "#ffffff",
      "--color-accent": "#B82524",
    },
  },
  {
    id: "slate-minimal",
    name: "Slate Minimal",
    primary: "#141414",
    variables: {
      "--color-primary": "#141414",
      "--color-on-primary": "#ffffff",
      "--color-accent": "#141414",
    },
  },
];

export const DEFAULT_THEME: ThemeId = "goat-neon";
const STORAGE_KEY = "goattype-theme-light";

export function applyTheme(themeId: ThemeId): void {
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const root = document.documentElement;
  
  for (const [name, value] of Object.entries(theme.variables)) {
    root.style.setProperty(name, value);
  }
  
  window.localStorage.setItem(STORAGE_KEY, theme.id);
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme.id }));
}

export function loadTheme(): ThemeId {
  const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
  const themeId = THEMES.some((t) => t.id === saved) ? saved! : DEFAULT_THEME;
  applyTheme(themeId);
  return themeId;
}
