import { useEffect, useState } from "react";
import {
  getStoredThemeId,
  resolveThemePackage,
  THEME_CHANGE_EVENT,
  type ThemePackage,
} from "./themeEngine";

type TenantThemeWindow = Window & {
  __ZOFTWARE_TENANT_CONFIG__?: {
    themeId?: string;
  };
};

function getPreviewThemeId() {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get("previewTheme");
}

function getTenantThemeId() {
  if (typeof window === "undefined") {
    return null;
  }

  return (window as TenantThemeWindow).__ZOFTWARE_TENANT_CONFIG__?.themeId ?? null;
}

function getRequestedThemeId() {
  return getPreviewThemeId() || getTenantThemeId() || getStoredThemeId();
}

export function useActiveThemePackage() {
  const [activeTheme, setActiveTheme] = useState<ThemePackage>(() =>
    resolveThemePackage(getRequestedThemeId()),
  );

  useEffect(() => {
    const previewThemeId = getPreviewThemeId();

    const syncTheme = () => {
      const nextThemeId = previewThemeId || getTenantThemeId() || getStoredThemeId();
      setActiveTheme(resolveThemePackage(nextThemeId));
    };

    syncTheme();

    if (previewThemeId) {
      return;
    }

    window.addEventListener("storage", syncTheme);
    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);

    return () => {
      window.removeEventListener("storage", syncTheme);
      window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
    };
  }, []);

  return activeTheme;
}
