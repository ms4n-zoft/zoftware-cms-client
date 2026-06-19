import { useEffect, useMemo, useRef, useState } from "react";
import {
  clearSiteDraft,
  getByPath,
  mergeDeep,
  readSiteDraft,
  setByPath,
  storeSiteDraft,
} from "../lib/contentOverrides";
import { applyTheme, appTheme, getStoredThemeId, resolveThemePackage, storeThemeId, themePackages } from "../lib/themeEngine";

type EditorField = {
  label: string;
  path: string;
  help: string;
  multiline?: boolean;
  placeholder?: string;
};

const editorFields: EditorField[] = [
  {
    label: "Brand name",
    path: "landing.brand.name",
    help: "Primary white-label brand name for this package.",
  },
  {
    label: "Logo image path",
    path: "landing.brand.logo",
    help: "Optional override logo. Leave blank to use the package logo.",
    placeholder: "/static/zoftwarehub-logo.svg",
  },
  {
    label: "Announcement bar",
    path: "landing.announcement.text",
    help: "Short message above the navigation.",
  },
  {
    label: "Hero headline line 1",
    path: "landing.hero.headlineLines.0",
    help: "First line of the hero headline.",
  },
  {
    label: "Hero headline line 2",
    path: "landing.hero.headlineLines.1",
    help: "Second line of the hero headline.",
  },
  {
    label: "Hero headline line 3",
    path: "landing.hero.headlineLines.2",
    help: "Third line of the hero headline.",
  },
  {
    label: "Hero description",
    path: "landing.hero.description",
    help: "Supporting copy below the hero headline.",
    multiline: true,
  },
  {
    label: "Primary CTA",
    path: "landing.navigation.primaryCtaLabel",
    help: "Main navigation CTA label.",
  },
  {
    label: "Catalog heading",
    path: "landing.catalog.heading",
    help: "Heading above the software grid.",
  },
  {
    label: "CTA description",
    path: "landing.cta.description",
    help: "Supporting copy in the final call-to-action section.",
    multiline: true,
  },
];

export default function AdminApp() {
  const [activePanel, setActivePanel] = useState<"theme" | "editor">("theme");
  const [activeThemeId, setActiveThemeId] = useState(themePackages[0].id);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const previewRef = useRef<HTMLIFrameElement | null>(null);
  const defaultTheme = appTheme;

  const activeTheme = useMemo(
    () => themePackages.find((theme) => theme.id === activeThemeId) ?? themePackages[0],
    [activeThemeId],
  );
  const effectiveContent = useMemo(() => mergeDeep(activeTheme, draft), [activeTheme, draft]);

  useEffect(() => {
    const storedTheme = resolveThemePackage(getStoredThemeId());
    setActiveThemeId(storedTheme.id);
    setDraft(readSiteDraft());
    applyTheme(appTheme);
  }, []);

  function updateTheme(theme: ThemePackage) {
    setActiveThemeId(theme.id);
    storeThemeId(theme.id);
    applyTheme(appTheme);
    syncPreviewStorage(theme.id, draft);
  }

  function updateField(path: string, value: string) {
    const nextDraft = setByPath(draft, path, value);
    setDraft(nextDraft);
    storeSiteDraft(nextDraft);
    syncPreviewStorage(activeThemeId, nextDraft);
  }

  function resetEditor() {
    setDraft({});
    clearSiteDraft();
    syncPreviewStorage(activeThemeId, {});
  }

  function syncPreviewStorage(themeId: string, siteDraft: Record<string, unknown>) {
    const preview = previewRef.current?.contentWindow;

    if (!preview) {
      return;
    }

    preview.localStorage.setItem("zoftware.activeThemeId", themeId);
    preview.localStorage.setItem("zoftware.siteDraft", JSON.stringify(siteDraft));
    preview.dispatchEvent(new StorageEvent("storage", { key: "zoftware.activeThemeId" }));
    preview.dispatchEvent(new StorageEvent("storage", { key: "zoftware.siteDraft" }));
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin sections">
        <a href="/" className="admin-sidebar__brand">
          <img src={defaultTheme.assets.miniLogo} alt="" />
          <span>White-label CMS</span>
        </a>
        <nav>
          <button
            type="button"
            className={activePanel === "theme" ? "is-active" : ""}
            onClick={() => setActivePanel("theme")}
          >
            <small>01</small>
            Package
          </button>
          <button
            type="button"
            className={activePanel === "editor" ? "is-active" : ""}
            onClick={() => setActivePanel("editor")}
          >
            <small>02</small>
            Content
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <section className="admin-panel">
          <div className="admin-panel__header">
            <p>{activePanel === "theme" ? "Step one" : "Step two"}</p>
            <h1>{activePanel === "theme" ? "Choose the site package." : "Edit landing content."}</h1>
            <span>
              {activePanel === "theme"
                ? "A package controls layout, colors, typography, and the landing page structure together."
                : "Update the package copy without changing the visual direction."}
            </span>
          </div>

          {activePanel === "theme" ? (
            <div className="theme-grid">
              {themePackages.map((theme) => (
                <button
                  type="button"
                  className={`theme-card ${theme.id === activeThemeId ? "is-selected" : ""}`}
                  key={theme.id}
                  onClick={() => updateTheme(theme)}
                >
                  <span className="theme-card__top">
                    <img src={theme.assets.logo} alt="" />
                    <b>{theme.name}</b>
                  </span>
                  <span className="theme-card__swatches">
                    <i style={{ background: theme.colors.background }} />
                    <i style={{ background: theme.colors.brand }} />
                    <i style={{ background: theme.colors.brandDark }} />
                    <i style={{ background: theme.colors.panelSoft }} />
                  </span>
                  <span className="theme-card__meta">{theme.description}</span>
                  <span className="theme-card__meta">
                    {theme.typography.heading.includes("Syne") ? "Syne + Manrope" : "Custom font system"}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="editor-fields">
              {editorFields.map((field) => (
                <label className="editor-field" key={field.path}>
                  <span>
                    <b>{field.label}</b>
                    <small>{field.help}</small>
                  </span>
                  {field.multiline ? (
                    <textarea
                      value={String(getByPath(effectiveContent, field.path) ?? "")}
                      placeholder={field.placeholder}
                      rows={3}
                      onChange={(event) => updateField(field.path, event.target.value)}
                    />
                  ) : (
                    <input
                      value={String(getByPath(effectiveContent, field.path) ?? "")}
                      placeholder={field.placeholder}
                      onChange={(event) => updateField(field.path, event.target.value)}
                    />
                  )}
                </label>
              ))}
              <button type="button" className="admin-reset" onClick={resetEditor}>
                Reset edits
              </button>
            </div>
          )}
        </section>

        <aside className="admin-preview">
          <div className="admin-preview__bar">
            <span>
              <b>{activeTheme.name}</b>
              Live landing preview
            </span>
            <a href="/home" target="_blank" rel="noreferrer">
              Open site
            </a>
          </div>
          <iframe
            ref={previewRef}
            src="/home"
            title="Landing page preview"
            onLoad={() => syncPreviewStorage(activeThemeId, draft)}
          />
        </aside>
      </main>
    </div>
  );
}
