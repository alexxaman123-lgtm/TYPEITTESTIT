export type ThemeId = string;

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  type: "light" | "dark";
  primary: string; 
  canvas: string; 
  swatch: [string, string, string];
  variables: Record<string, string>;
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "ivory-black",
    name: "Ivory Black",
    type: "light",
    primary: "#141414",
    canvas: "#ffffff",
    swatch: ["#ffffff", "#666666", "#141414"],
    variables: {
      "--app-primary": "#141414",
      "--app-on-primary": "#ffffff",
      "--app-ink": "#141414",
      "--app-ink-soft": "#262626",
      "--app-text-muted": "#666666",
      "--app-text-faint": "#a3a3a3",
      "--app-canvas": "#ffffff",
      "--app-canvas-soft": "#f9f9f9",
      "--app-field": "#f0f0f0",
      "--app-hairline-soft": "#f0f0f0",
      "--app-hairline": "#e5e5e5",
      "--app-accent": "#000000",
    },
  },
  {
    id: "goat-neon",
    name: "GOAT Neon",
    type: "dark",
    primary: "#00ff66",
    canvas: "#0a0a0a",
    swatch: ["#0a0a0a", "#a3a3a3", "#00ff66"],
    variables: {
      "--app-primary": "#00ff66",
      "--app-on-primary": "#000000",
      "--app-ink": "#ffffff",
      "--app-ink-soft": "#e5e5e5",
      "--app-text-muted": "#a3a3a3",
      "--app-text-faint": "#525252",
      "--app-canvas": "#0a0a0a",
      "--app-canvas-soft": "#141414",
      "--app-field": "#1f1f1f",
      "--app-hairline-soft": "#1f1f1f",
      "--app-hairline": "#262626",
      "--app-accent": "#00aa44",
    },
  },
  {
    id: "retrocast",
    name: "Retrocast",
    type: "dark",
    primary: "#fde047",
    canvas: "#0f766e",
    swatch: ["#0f766e", "#ccfbf1", "#fde047"],
    variables: {
      "--app-primary": "#fde047",
      "--app-on-primary": "#0f766e",
      "--app-ink": "#ffffff",
      "--app-ink-soft": "#ccfbf1",
      "--app-text-muted": "#5eead4",
      "--app-text-faint": "#14b8a6",
      "--app-canvas": "#0f766e",
      "--app-canvas-soft": "#115e59",
      "--app-field": "#134e4a",
      "--app-hairline-soft": "#134e4a",
      "--app-hairline": "#042f2e",
      "--app-accent": "#eab308",
    },
  },
  {
    id: "gruvbox-warm",
    name: "Gruvbox Warm",
    type: "dark",
    primary: "#fe8019",
    canvas: "#282828",
    swatch: ["#282828", "#ebdbb2", "#fe8019"],
    variables: {
      "--app-primary": "#fe8019",
      "--app-on-primary": "#282828",
      "--app-ink": "#fbf1c7",
      "--app-ink-soft": "#ebdbb2",
      "--app-text-muted": "#bdae93",
      "--app-text-faint": "#7c6f64",
      "--app-canvas": "#282828",
      "--app-canvas-soft": "#3c3836",
      "--app-field": "#504945",
      "--app-hairline-soft": "#504945",
      "--app-hairline": "#665c54",
      "--app-accent": "#d65d0e",
    },
  },
  {
    id: "dracula",
    name: "Dracula",
    type: "dark",
    primary: "#50fa7b",
    canvas: "#282a36",
    swatch: ["#282a36", "#f8f8f2", "#50fa7b"],
    variables: {
      "--app-primary": "#50fa7b",
      "--app-on-primary": "#282a36",
      "--app-ink": "#f8f8f2",
      "--app-ink-soft": "#e2e2dc",
      "--app-text-muted": "#6272a4",
      "--app-text-faint": "#44475a",
      "--app-canvas": "#282a36",
      "--app-canvas-soft": "#383a59",
      "--app-field": "#44475a",
      "--app-hairline-soft": "#44475a",
      "--app-hairline": "#6272a4",
      "--app-accent": "#8be9fd",
    },
  },
  {
    id: "midnight-bloom",
    name: "Midnight Bloom",
    type: "dark",
    primary: "#ff4794",
    canvas: "#0f0f13",
    swatch: ["#0f0f13", "#f4f4f5", "#ff4794"],
    variables: {
      "--app-primary": "#ff4794",
      "--app-on-primary": "#ffffff",
      "--app-ink": "#ffffff",
      "--app-ink-soft": "#e4e4e7",
      "--app-text-muted": "#a1a1aa",
      "--app-text-faint": "#52525b",
      "--app-canvas": "#0f0f13",
      "--app-canvas-soft": "#18181b",
      "--app-field": "#27272a",
      "--app-hairline-soft": "#27272a",
      "--app-hairline": "#3f3f46",
      "--app-accent": "#e02874",
    },
  },
  {
    id: "ocean-drive",
    name: "Ocean Drive",
    type: "dark",
    primary: "#38bdf8",
    canvas: "#08101a",
    swatch: ["#08101a", "#e2e8f0", "#38bdf8"],
    variables: {
      "--app-primary": "#38bdf8",
      "--app-on-primary": "#08101a",
      "--app-ink": "#ffffff",
      "--app-ink-soft": "#f1f5f9",
      "--app-text-muted": "#94a3b8",
      "--app-text-faint": "#475569",
      "--app-canvas": "#08101a",
      "--app-canvas-soft": "#0f172a",
      "--app-field": "#1e293b",
      "--app-hairline-soft": "#1e293b",
      "--app-hairline": "#334155",
      "--app-accent": "#0ea5e9",
    },
  },
  {
    id: "sunset-ember",
    name: "Sunset Ember",
    type: "dark",
    primary: "#ff6e40",
    canvas: "#170c08",
    swatch: ["#170c08", "#fbe9e7", "#ff6e40"],
    variables: {
      "--app-primary": "#ff6e40",
      "--app-on-primary": "#000000",
      "--app-ink": "#ffffff",
      "--app-ink-soft": "#fbe9e7",
      "--app-text-muted": "#ffab91",
      "--app-text-faint": "#8a4b38",
      "--app-canvas": "#170c08",
      "--app-canvas-soft": "#24130d",
      "--app-field": "#331c14",
      "--app-hairline-soft": "#331c14",
      "--app-hairline": "#4a2a1d",
      "--app-accent": "#ff3d00",
    },
  },
  {
    id: "nordic-ice",
    name: "Nordic Ice",
    type: "dark",
    primary: "#88c0d0",
    canvas: "#2e3440",
    swatch: ["#2e3440", "#eceff4", "#88c0d0"],
    variables: {
      "--app-primary": "#88c0d0",
      "--app-on-primary": "#2e3440",
      "--app-ink": "#ffffff",
      "--app-ink-soft": "#eceff4",
      "--app-text-muted": "#d8dee9",
      "--app-text-faint": "#4c566a",
      "--app-canvas": "#2e3440",
      "--app-canvas-soft": "#3b4252",
      "--app-field": "#434c5e",
      "--app-hairline-soft": "#434c5e",
      "--app-hairline": "#4c566a",
      "--app-accent": "#8fbcbb",
    },
  },
  {
    id: "matcha-light",
    name: "Matcha Light",
    type: "light",
    primary: "#059669",
    canvas: "#f0fdf4",
    swatch: ["#f0fdf4", "#064e3b", "#059669"],
    variables: {
      "--app-primary": "#059669",
      "--app-on-primary": "#ffffff",
      "--app-ink": "#022c22",
      "--app-ink-soft": "#064e3b",
      "--app-text-muted": "#047857",
      "--app-text-faint": "#6ee7b7",
      "--app-canvas": "#f0fdf4",
      "--app-canvas-soft": "#dcfce3",
      "--app-field": "#bbf7d0",
      "--app-hairline-soft": "#bbf7d0",
      "--app-hairline": "#86efac",
      "--app-accent": "#10b981",
    },
  },
  {
    id: "lavender-dusk",
    name: "Lavender Dusk",
    type: "light",
    primary: "#7e22ce",
    canvas: "#faf5ff",
    swatch: ["#faf5ff", "#3b0764", "#7e22ce"],
    variables: {
      "--app-primary": "#7e22ce",
      "--app-on-primary": "#ffffff",
      "--app-ink": "#2e064d",
      "--app-ink-soft": "#3b0764",
      "--app-text-muted": "#6b21a8",
      "--app-text-faint": "#c084fc",
      "--app-canvas": "#faf5ff",
      "--app-canvas-soft": "#f3e8ff",
      "--app-field": "#e9d5ff",
      "--app-hairline-soft": "#e9d5ff",
      "--app-hairline": "#d8b4fe",
      "--app-accent": "#9333ea",
    },
  },
  {
    id: "rose-quartz",
    name: "Rose Quartz",
    type: "light",
    primary: "#be123c",
    canvas: "#fff1f2",
    swatch: ["#fff1f2", "#4c0519", "#be123c"],
    variables: {
      "--app-primary": "#be123c",
      "--app-on-primary": "#ffffff",
      "--app-ink": "#28020d",
      "--app-ink-soft": "#4c0519",
      "--app-text-muted": "#9f1239",
      "--app-text-faint": "#fda4af",
      "--app-canvas": "#fff1f2",
      "--app-canvas-soft": "#ffe4e6",
      "--app-field": "#fecdd3",
      "--app-hairline-soft": "#fecdd3",
      "--app-hairline": "#fda4af",
      "--app-accent": "#e11d48",
    },
  }
];

export const DEFAULT_THEME: ThemeId = "ivory-black";
const STORAGE_KEY = "goattype-theme-v3";

export function applyTheme(themeId: ThemeId): void {
  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];
  const root = document.documentElement;
  
  if (theme.type === "dark") {
    root.classList.add("dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }

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
