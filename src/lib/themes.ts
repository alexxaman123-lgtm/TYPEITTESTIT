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
    id: "carbon-mint",
    name: "Carbon Mint",
    type: "dark",
    primary: "#35f28b",
    canvas: "#080d0a",
    swatch: ["#080d0a", "#f3fff7", "#35f28b"],
    variables: {
      "--app-primary": "#35f28b",
      "--app-on-primary": "#05110a",
      "--app-ink": "#f3fff7",
      "--app-ink-soft": "#d4f7e2",
      "--app-text-muted": "#94b7a1",
      "--app-text-faint": "#50665a",
      "--app-canvas": "#080d0a",
      "--app-canvas-soft": "#101811",
      "--app-field": "#172219",
      "--app-hairline-soft": "#1b2b20",
      "--app-hairline": "#294132",
      "--app-accent": "#20d977",
      "--app-typed": "#35f28b",
    },
  },
  {
    id: "ember-ink",
    name: "Ember Ink",
    type: "dark",
    primary: "#ff765f",
    canvas: "#120a09",
    swatch: ["#120a09", "#fff2ed", "#ff765f"],
    variables: {
      "--app-primary": "#ff765f",
      "--app-on-primary": "#180704",
      "--app-ink": "#fff2ed",
      "--app-ink-soft": "#f8d9cf",
      "--app-text-muted": "#bb9188",
      "--app-text-faint": "#67443e",
      "--app-canvas": "#120a09",
      "--app-canvas-soft": "#1d110f",
      "--app-field": "#291815",
      "--app-hairline-soft": "#35201c",
      "--app-hairline": "#4b2c26",
      "--app-accent": "#f45a43",
      "--app-typed": "#ff765f",
    },
  },
  {
    id: "tide-glow",
    name: "Tide Glow",
    type: "dark",
    primary: "#38d9ff",
    canvas: "#061118",
    swatch: ["#061118", "#edfaff", "#38d9ff"],
    variables: {
      "--app-primary": "#38d9ff",
      "--app-on-primary": "#031018",
      "--app-ink": "#edfaff",
      "--app-ink-soft": "#d1f1fa",
      "--app-text-muted": "#8db4c3",
      "--app-text-faint": "#4a6974",
      "--app-canvas": "#061118",
      "--app-canvas-soft": "#0c1b24",
      "--app-field": "#112832",
      "--app-hairline-soft": "#17333f",
      "--app-hairline": "#254956",
      "--app-accent": "#1ebee6",
      "--app-typed": "#38d9ff",
    },
  },
  {
    id: "violet-pulse",
    name: "Violet Pulse",
    type: "dark",
    primary: "#c084ff",
    canvas: "#0f0a18",
    swatch: ["#0f0a18", "#f4eeff", "#c084ff"],
    variables: {
      "--app-primary": "#c084ff",
      "--app-on-primary": "#14071f",
      "--app-ink": "#f4eeff",
      "--app-ink-soft": "#e6d9f8",
      "--app-text-muted": "#ad99c3",
      "--app-text-faint": "#5d4c6b",
      "--app-canvas": "#0f0a18",
      "--app-canvas-soft": "#191127",
      "--app-field": "#24183a",
      "--app-hairline-soft": "#30224a",
      "--app-hairline": "#463461",
      "--app-accent": "#a855f7",
      "--app-typed": "#c084ff",
    },
  },
  {
    id: "forge-gold",
    name: "Forge Gold",
    type: "dark",
    primary: "#ffbd45",
    canvas: "#171006",
    swatch: ["#171006", "#fff5d9", "#ffbd45"],
    variables: {
      "--app-primary": "#ffbd45",
      "--app-on-primary": "#1b1000",
      "--app-ink": "#fff5d9",
      "--app-ink-soft": "#f5dfab",
      "--app-text-muted": "#b99f70",
      "--app-text-faint": "#69552e",
      "--app-canvas": "#171006",
      "--app-canvas-soft": "#22170a",
      "--app-field": "#30210d",
      "--app-hairline-soft": "#3a2a11",
      "--app-hairline": "#59421b",
      "--app-accent": "#eda62b",
      "--app-typed": "#ffbd45",
    },
  },
  {
    id: "moss-current",
    name: "Moss Current",
    type: "dark",
    primary: "#b4ea45",
    canvas: "#0b1209",
    swatch: ["#0b1209", "#f1fbe4", "#b4ea45"],
    variables: {
      "--app-primary": "#b4ea45",
      "--app-on-primary": "#0d1707",
      "--app-ink": "#f1fbe4",
      "--app-ink-soft": "#dcebc8",
      "--app-text-muted": "#9fb18d",
      "--app-text-faint": "#536147",
      "--app-canvas": "#0b1209",
      "--app-canvas-soft": "#121d0f",
      "--app-field": "#1b2b14",
      "--app-hairline-soft": "#24381a",
      "--app-hairline": "#34511f",
      "--app-accent": "#8fcf28",
      "--app-typed": "#b4ea45",
    },
  },
  {
    id: "arctic-wire",
    name: "Arctic Wire",
    type: "dark",
    primary: "#67e8f9",
    canvas: "#071117",
    swatch: ["#071117", "#effcff", "#67e8f9"],
    variables: {
      "--app-primary": "#67e8f9",
      "--app-on-primary": "#041014",
      "--app-ink": "#effcff",
      "--app-ink-soft": "#d9f4f7",
      "--app-text-muted": "#93b7bd",
      "--app-text-faint": "#506b71",
      "--app-canvas": "#071117",
      "--app-canvas-soft": "#0e1a21",
      "--app-field": "#142832",
      "--app-hairline-soft": "#1b3540",
      "--app-hairline": "#2b4c57",
      "--app-accent": "#22c7dc",
      "--app-typed": "#67e8f9",
    },
  },
  {
    id: "paper-volt",
    name: "Paper Volt",
    type: "light",
    primary: "#087f5b",
    canvas: "#f6f8f2",
    swatch: ["#f6f8f2", "#111610", "#087f5b"],
    variables: {
      "--app-primary": "#087f5b",
      "--app-on-primary": "#ffffff",
      "--app-ink": "#111610",
      "--app-ink-soft": "#253126",
      "--app-text-muted": "#546458",
      "--app-text-faint": "#8d9b90",
      "--app-canvas": "#f6f8f2",
      "--app-canvas-soft": "#eef2e9",
      "--app-field": "#e3e9df",
      "--app-hairline-soft": "#d5ddd1",
      "--app-hairline": "#c3d0c1",
      "--app-accent": "#0aa06f",
      "--app-typed": "#087f5b",
    },
  },
  {
    id: "peach-signal",
    name: "Peach Signal",
    type: "light",
    primary: "#d95732",
    canvas: "#fff7f2",
    swatch: ["#fff7f2", "#1d120e", "#d95732"],
    variables: {
      "--app-primary": "#d95732",
      "--app-on-primary": "#ffffff",
      "--app-ink": "#1d120e",
      "--app-ink-soft": "#39231d",
      "--app-text-muted": "#72534b",
      "--app-text-faint": "#a88e86",
      "--app-canvas": "#fff7f2",
      "--app-canvas-soft": "#ffede4",
      "--app-field": "#f9ded2",
      "--app-hairline-soft": "#efd0c2",
      "--app-hairline": "#e0b8a7",
      "--app-accent": "#e66a43",
      "--app-typed": "#d95732",
    },
  },
  {
    id: "violet-paper",
    name: "Violet Paper",
    type: "light",
    primary: "#6f35c9",
    canvas: "#f8f5ff",
    swatch: ["#f8f5ff", "#17111f", "#6f35c9"],
    variables: {
      "--app-primary": "#6f35c9",
      "--app-on-primary": "#ffffff",
      "--app-ink": "#17111f",
      "--app-ink-soft": "#2b2038",
      "--app-text-muted": "#645371",
      "--app-text-faint": "#9585a5",
      "--app-canvas": "#f8f5ff",
      "--app-canvas-soft": "#f0ebfb",
      "--app-field": "#e4dcf4",
      "--app-hairline-soft": "#d5cae9",
      "--app-hairline": "#c2b2dd",
      "--app-accent": "#8145df",
      "--app-typed": "#6f35c9",
    },
  },
];

export const DEFAULT_THEME: ThemeId = "carbon-mint";
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
