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

// High-contrast three-tone themes: real base color, readable text, distinct typing/accent.
export const THEMES: ThemeDefinition[] = [
  {
    id: "ivory-black",
    name: "Ivory Black",
    type: "light",
    primary: "#141414",
    canvas: "#fffdf7",
    swatch: ["#fffdf7", "#141414", "#141414"],
    variables: {
      "--app-primary": "#141414",
      "--app-on-primary": "#fffdf7",
      "--app-ink": "#141414",
      "--app-ink-soft": "#242424",
      "--app-text-muted": "#5d5d5d",
      "--app-text-faint": "#929292",
      "--app-canvas": "#fffdf7",
      "--app-canvas-soft": "#f6f3ea",
      "--app-field": "#ece7dc",
      "--app-hairline-soft": "#e7e1d5",
      "--app-hairline": "#d8d0c2",
      "--app-accent": "#141414",
    },
  },
  {
    id: "plum-brass",
    name: "Plum Brass",
    type: "dark",
    primary: "#f3c969",
    canvas: "#21132b",
    swatch: ["#21132b", "#f3c969", "#e5a93a"],
    variables: {
      "--app-primary": "#f3c969",
      "--app-on-primary": "#21132b",
      "--app-ink": "#f3c969",
      "--app-ink-soft": "#ebbd56",
      "--app-text-muted": "#c8a95b",
      "--app-text-faint": "#816c3d",
      "--app-canvas": "#21132b",
      "--app-canvas-soft": "#2b1938",
      "--app-field": "#351f44",
      "--app-hairline-soft": "#3c254d",
      "--app-hairline": "#4a2d5d",
      "--app-accent": "#e5a93a",
    },
  },
  {
    id: "cobalt-peach",
    name: "Cobalt Peach",
    type: "dark",
    primary: "#ffad7a",
    canvas: "#10213a",
    swatch: ["#10213a", "#ffcfad", "#ffad7a"],
    variables: {
      "--app-primary": "#ffad7a",
      "--app-on-primary": "#10213a",
      "--app-ink": "#ffcfad",
      "--app-ink-soft": "#ffc19a",
      "--app-text-muted": "#dfaa8b",
      "--app-text-faint": "#7a6a67",
      "--app-canvas": "#10213a",
      "--app-canvas-soft": "#162b49",
      "--app-field": "#1c3557",
      "--app-hairline-soft": "#254267",
      "--app-hairline": "#2d4d74",
      "--app-accent": "#ff8f5c",
    },
  },
  {
    id: "forest-copper",
    name: "Forest Copper",
    type: "dark",
    primary: "#eab56f",
    canvas: "#10251d",
    swatch: ["#10251d", "#eab56f", "#cf8241"],
    variables: {
      "--app-primary": "#eab56f",
      "--app-on-primary": "#10251d",
      "--app-ink": "#eab56f",
      "--app-ink-soft": "#dfaa60",
      "--app-text-muted": "#b9955c",
      "--app-text-faint": "#647057",
      "--app-canvas": "#10251d",
      "--app-canvas-soft": "#153126",
      "--app-field": "#1d3d2f",
      "--app-hairline-soft": "#28503d",
      "--app-hairline": "#315b46",
      "--app-accent": "#cf8241",
    },
  },
  {
    id: "indigo-citrine",
    name: "Indigo Citrine",
    type: "dark",
    primary: "#d9e86c",
    canvas: "#17172b",
    swatch: ["#17172b", "#e9f0ad", "#d9e86c"],
    variables: {
      "--app-primary": "#d9e86c",
      "--app-on-primary": "#17172b",
      "--app-ink": "#e9f0ad",
      "--app-ink-soft": "#e1eb91",
      "--app-text-muted": "#b7bd78",
      "--app-text-faint": "#6e7149",
      "--app-canvas": "#17172b",
      "--app-canvas-soft": "#20203a",
      "--app-field": "#2b2b4c",
      "--app-hairline-soft": "#36365a",
      "--app-hairline": "#44446a",
      "--app-accent": "#c4d74f",
    },
  },
  {
    id: "oxblood-sand",
    name: "Oxblood Sand",
    type: "dark",
    primary: "#f0c78a",
    canvas: "#2a1118",
    swatch: ["#2a1118", "#f2d7a8", "#f0c78a"],
    variables: {
      "--app-primary": "#f0c78a",
      "--app-on-primary": "#2a1118",
      "--app-ink": "#f2d7a8",
      "--app-ink-soft": "#edcb98",
      "--app-text-muted": "#c9a97a",
      "--app-text-faint": "#785c4e",
      "--app-canvas": "#2a1118",
      "--app-canvas-soft": "#35171f",
      "--app-field": "#451f28",
      "--app-hairline-soft": "#572833",
      "--app-hairline": "#68323d",
      "--app-accent": "#dca85d",
    },
  },
  {
    id: "teal-saffron",
    name: "Teal Saffron",
    type: "dark",
    primary: "#f2bf4f",
    canvas: "#082d31",
    swatch: ["#082d31", "#f5d27a", "#f2bf4f"],
    variables: {
      "--app-primary": "#f2bf4f",
      "--app-on-primary": "#082d31",
      "--app-ink": "#f5d27a",
      "--app-ink-soft": "#eed07c",
      "--app-text-muted": "#a9b487",
      "--app-text-faint": "#55746f",
      "--app-canvas": "#082d31",
      "--app-canvas-soft": "#0d3d41",
      "--app-field": "#145157",
      "--app-hairline-soft": "#1b6267",
      "--app-hairline": "#247078",
      "--app-accent": "#e7a92f",
    },
  },
  {
    id: "charcoal-coral",
    name: "Charcoal Coral",
    type: "dark",
    primary: "#ff8d7a",
    canvas: "#17191f",
    swatch: ["#17191f", "#ffd1c8", "#ff8d7a"],
    variables: {
      "--app-primary": "#ff8d7a",
      "--app-on-primary": "#17191f",
      "--app-ink": "#ffd1c8",
      "--app-ink-soft": "#ffc0b5",
      "--app-text-muted": "#c59e99",
      "--app-text-faint": "#6d5c5f",
      "--app-canvas": "#17191f",
      "--app-canvas-soft": "#20232b",
      "--app-field": "#2b2f38",
      "--app-hairline-soft": "#393d48",
      "--app-hairline": "#4a4f5c",
      "--app-accent": "#ff6f61",
    },
  },
  {
    id: "navy-mint",
    name: "Navy Mint",
    type: "dark",
    primary: "#7de2c4",
    canvas: "#0b1f2a",
    swatch: ["#0b1f2a", "#b9f0df", "#7de2c4"],
    variables: {
      "--app-primary": "#7de2c4",
      "--app-on-primary": "#0b1f2a",
      "--app-ink": "#b9f0df",
      "--app-ink-soft": "#a8e8d6",
      "--app-text-muted": "#83bbaa",
      "--app-text-faint": "#4e716b",
      "--app-canvas": "#0b1f2a",
      "--app-canvas-soft": "#102b38",
      "--app-field": "#163b4b",
      "--app-hairline-soft": "#1e4c5d",
      "--app-hairline": "#285b6d",
      "--app-accent": "#52c7a5",
    },
  },
  {
    id: "slate-lime",
    name: "Slate Lime",
    type: "dark",
    primary: "#c6e56b",
    canvas: "#1b2024",
    swatch: ["#1b2024", "#e3efb0", "#c6e56b"],
    variables: {
      "--app-primary": "#c6e56b",
      "--app-on-primary": "#1b2024",
      "--app-ink": "#e3efb0",
      "--app-ink-soft": "#d6e78f",
      "--app-text-muted": "#a8b47b",
      "--app-text-faint": "#626a57",
      "--app-canvas": "#1b2024",
      "--app-canvas-soft": "#242a2f",
      "--app-field": "#30383e",
      "--app-hairline-soft": "#3c454c",
      "--app-hairline": "#4b565e",
      "--app-accent": "#a9ce43",
    },
  },
];

export const DEFAULT_THEME: ThemeId = "ivory-black";
const STORAGE_KEY = "goattype-theme-v5";

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
