import zoftwareHubThemePackage from "../data/theme-packages/zoftware-hub.json";
import violetAtlasThemePackage from "../data/theme-packages/violet-atlas.json";

export const THEME_STORAGE_KEY = "zoftware.activeThemeId";
export const THEME_CHANGE_EVENT = "zoftware:theme-change";

export const themePackages = [zoftwareHubThemePackage, violetAtlasThemePackage] as const;

export type ThemePackage = (typeof themePackages)[number];
export type ThemeConfig = Omit<ThemePackage, "landing">;

export const themes: readonly ThemeConfig[] = themePackages.map(({ landing: _landing, ...theme }) => theme);

export const appTheme: ThemeConfig = {
  id: "zoftware-app",
  name: "Zoftware App",
  description: "Default internal app theme",
  character: "Clean product UI",
  colors: {
    background: "#ffffff",
    text: "#0a0a0a",
    mutedText: "#575757",
    softText: "#969696",
    brand: "#1447e6",
    brandDark: "#2c4e9b",
    brandSoft: "#eff6ff",
    border: "#e6e6e6",
    panel: "#ffffff",
    panelSoft: "#f9f9fc",
    heroStart: "#e6efff",
    accent: "#155dfc",
    success: "#00a63e",
  },
  typography: {
    body: "\"Poppins\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    heading: "\"Poppins\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    headingLabel: "Poppins",
    bodyLabel: "Poppins",
  },
  assets: {
    logo: "/static/full_logo.svg",
    miniLogo: "/static/mini_logo.svg",
    ratingStar: "/static/rating_star.svg",
    trustedVendorPath: "/v2/trusted-vendors",
  },
  layout: {
    maxWidth: "1212px",
    radius: {
      mode: "rounded",
      pill: "80px",
      panel: "16px",
      card: "12px",
    },
  },
};

export function resolveTheme(themeId?: string | null): ThemeConfig {
  return themes.find((theme) => theme.id === themeId) ?? themes[0];
}

export function resolveThemePackage(themeId?: string | null): ThemePackage {
  return themePackages.find((theme) => theme.id === themeId) ?? themePackages[0];
}

export function getStoredThemeId() {
  if (typeof window === "undefined") {
    return themes[0].id;
  }

  return window.localStorage.getItem(THEME_STORAGE_KEY) ?? themes[0].id;
}

export function storeThemeId(themeId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, themeId);
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: themeId }));
}

export function themeVariables(theme: ThemeConfig) {
  return {
    "--color-background": theme.colors.background,
    "--color-text": theme.colors.text,
    "--color-muted-text": theme.colors.mutedText,
    "--color-soft-text": theme.colors.softText,
    "--color-brand": theme.colors.brand,
    "--color-brand-dark": theme.colors.brandDark,
    "--color-brand-soft": theme.colors.brandSoft,
    "--color-border": theme.colors.border,
    "--color-panel": theme.colors.panel,
    "--color-panel-soft": theme.colors.panelSoft,
    "--color-hero-start": theme.colors.heroStart,
    "--color-accent": theme.colors.accent,
    "--color-success": theme.colors.success,
    "--font-body": theme.typography.body,
    "--font-heading": theme.typography.heading,
    "--layout-max-width": theme.layout.maxWidth,
    "--radius-pill": theme.layout.radius.pill,
    "--radius-panel": theme.layout.radius.panel,
    "--radius-card": theme.layout.radius.card,
  } as const;
}

export function themeStyle(theme: ThemeConfig) {
  return Object.entries(themeVariables(theme))
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
}

export function applyTheme(theme: ThemeConfig) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const variables = themeVariables(theme);

  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.dataset.theme = theme.id;
  root.dataset.radiusMode = theme.layout.radius.mode;

  if (document.body) {
    document.body.dataset.theme = theme.id;
    document.body.dataset.radiusMode = theme.layout.radius.mode;
  }
}
