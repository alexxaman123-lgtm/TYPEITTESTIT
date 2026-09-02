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

// Deliberately small, high-contrast palette: the page has a real base color,
// a distinct text color, and a distinct typing/accent color. Avoid pastel/tint
// backgrounds so the three-tone relationship stays obvious during typing.
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
];

export const DEFAULT_THEME: ThemeId = "ivory-black";
const STORAGE_KEY = "goattype-theme-v4";

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
