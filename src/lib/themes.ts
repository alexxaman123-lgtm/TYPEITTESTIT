export type ThemeId =
  | "goat-neon"
  | "arctic-pulse"
  | "royal-amethyst"
  | "sunset-ember"
  | "rose-rush"
  | "solar-gold"
  | "ocean-drive"
  | "retro-peach";

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  accent: string;
  preview: string;
  variables: Record<string, string>;
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "goat-neon",
    name: "GOAT Neon",
    accent: "#00ff66",
    preview: "linear-gradient(135deg, #00ff66 0 42%, #0a0d0b 42% 100%)",
    variables: {
      "--color-bg": "#050706",
      "--color-surface1": "#080b09",
      "--color-surface2": "#0c100d",
      "--color-surface3": "#101510",
      "--color-accent": "#00ff66",
      "--color-accent2": "#00d95a",
      "--color-accentdark": "#123b25",
      "--color-ink": "#ffffff",
      "--color-ink-soft": "#e8ece9",
      "--color-muted": "#a7aea9",
      "--color-faint": "#6e7771",
      "--color-danger": "#ff5c5c",
    },
  },
  {
    id: "arctic-pulse",
    name: "Arctic Pulse",
    accent: "#55e8ff",
    preview: "linear-gradient(135deg, #55e8ff 0 42%, #071014 42% 100%)",
    variables: {
      "--color-bg": "#050a0d",
      "--color-surface1": "#091116",
      "--color-surface2": "#0d171d",
      "--color-surface3": "#132027",
      "--color-accent": "#55e8ff",
      "--color-accent2": "#28c8e2",
      "--color-accentdark": "#164552",
      "--color-ink": "#f7fdff",
      "--color-ink-soft": "#e0f1f5",
      "--color-muted": "#a1b4ba",
      "--color-faint": "#687e86",
      "--color-danger": "#ff6b73",
    },
  },
  {
    id: "royal-amethyst",
    name: "Royal Amethyst",
    accent: "#b58cff",
    preview: "linear-gradient(135deg, #b58cff 0 42%, #0b0812 42% 100%)",
    variables: {
      "--color-bg": "#07060b",
      "--color-surface1": "#0c0913",
      "--color-surface2": "#120d1a",
      "--color-surface3": "#181123",
      "--color-accent": "#b58cff",
      "--color-accent2": "#9468ef",
      "--color-accentdark": "#35215d",
      "--color-ink": "#fbf9ff",
      "--color-ink-soft": "#ebe5f7",
      "--color-muted": "#aca2bb",
      "--color-faint": "#746a82",
      "--color-danger": "#ff6d8f",
    },
  },
  {
    id: "sunset-ember",
    name: "Sunset Ember",
    accent: "#ff8a5b",
    preview: "linear-gradient(135deg, #ff8a5b 0 42%, #120a08 42% 100%)",
    variables: {
      "--color-bg": "#0a0706",
      "--color-surface1": "#100b09",
      "--color-surface2": "#17100d",
      "--color-surface3": "#211612",
      "--color-accent": "#ff8a5b",
      "--color-accent2": "#ed6b38",
      "--color-accentdark": "#59301f",
      "--color-ink": "#fffaf7",
      "--color-ink-soft": "#f2e6df",
      "--color-muted": "#b9a39a",
      "--color-faint": "#7d6961",
      "--color-danger": "#ff5d67",
    },
  },
  {
    id: "rose-rush",
    name: "Rose Rush",
    accent: "#ff6fae",
    preview: "linear-gradient(135deg, #ff6fae 0 42%, #11070d 42% 100%)",
    variables: {
      "--color-bg": "#090609",
      "--color-surface1": "#10090e",
      "--color-surface2": "#180d14",
      "--color-surface3": "#21131c",
      "--color-accent": "#ff6fae",
      "--color-accent2": "#ec4f91",
      "--color-accentdark": "#582039",
      "--color-ink": "#fff9fc",
      "--color-ink-soft": "#f4e5ec",
      "--color-muted": "#b7a1ad",
      "--color-faint": "#7c6973",
      "--color-danger": "#ff6868",
    },
  },
  {
    id: "solar-gold",
    name: "Solar Gold",
    accent: "#ffd166",
    preview: "linear-gradient(135deg, #ffd166 0 42%, #100d05 42% 100%)",
    variables: {
      "--color-bg": "#0a0804",
      "--color-surface1": "#110e08",
      "--color-surface2": "#191409",
      "--color-surface3": "#231d0c",
      "--color-accent": "#ffd166",
      "--color-accent2": "#ebb546",
      "--color-accentdark": "#564513",
      "--color-ink": "#fffdf5",
      "--color-ink-soft": "#f2ecd9",
      "--color-muted": "#b3aa91",
      "--color-faint": "#776f5b",
      "--color-danger": "#ff6a5f",
    },
  },
  {
    id: "ocean-drive",
    name: "Ocean Drive",
    accent: "#45b7ff",
    preview: "linear-gradient(135deg, #45b7ff 0 42%, #060b12 42% 100%)",
    variables: {
      "--color-bg": "#05080d",
      "--color-surface1": "#090f17",
      "--color-surface2": "#0d1620",
      "--color-surface3": "#13202d",
      "--color-accent": "#45b7ff",
      "--color-accent2": "#258fd5",
      "--color-accentdark": "#173e5b",
      "--color-ink": "#f8fcff",
      "--color-ink-soft": "#e1edf5",
      "--color-muted": "#9fb1bf",
      "--color-faint": "#667988",
      "--color-danger": "#ff6876",
    },
  },
  {
    id: "retro-peach",
    name: "Retro Peach",
    accent: "#ffad7a",
    preview: "linear-gradient(135deg, #ffad7a 0 42%, #100b09 42% 100%)",
    variables: {
      "--color-bg": "#0a0706",
      "--color-surface1": "#100b09",
      "--color-surface2": "#18100d",
      "--color-surface3": "#211710",
      "--color-accent": "#ffad7a",
      "--color-accent2": "#ed8757",
      "--color-accentdark": "#593421",
      "--color-ink": "#fffaf5",
      "--color-ink-soft": "#f1e4d9",
      "--color-muted": "#b4a094",
      "--color-faint": "#79685e",
      "--color-danger": "#ff6662",
    },
  },
];

export const DEFAULT_THEME: ThemeId = "goat-neon";
const STORAGE_KEY = "goattype-theme";

export function applyTheme(themeId: ThemeId): void {
  const theme = THEMES.find((candidate) => candidate.id === themeId) ?? THEMES[0];
  const root = document.documentElement;

  for (const [name, value] of Object.entries(theme.variables)) {
    root.style.setProperty(name, value);
  }

  root.dataset.theme = theme.id;
  window.localStorage.setItem(STORAGE_KEY, theme.id);
}

export function loadTheme(): ThemeId {
  const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
  return THEMES.some((theme) => theme.id === saved) ? saved! : DEFAULT_THEME;
}
