import { useEffect, useMemo, useRef, useState } from "react";
import {
  clearSiteDraft,
  getByPath,
  mergeDeep,
  readSiteDraft,
  setByPath,
  storeSiteDraft,
} from "../lib/contentOverrides";
import {
  applyTheme,
  appTheme,
  getStoredThemeId,
  resolveThemePackage,
  storeThemeId,
  themePackages,
  type ThemePackage,
} from "../lib/themeEngine";

const ADMIN_SETTINGS_STORAGE_KEY = "zoftware.adminSettings";
const DEFAULT_API_BASE_URL =
  import.meta.env.PUBLIC_ZOFTWARE_API_BASE_URL || "http://localhost:3002/api/v1";

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

type TenantAdminPayload = {
  partnerId: string;
  slug: string;
  name: string;
  status: "active" | "disabled";
  allowedParentCategoryWeburls: string[];
  allowedSubCategoryWeburls: string[];
  domains: string[];
  themeId: string;
  contentOverrides: Record<string, unknown>;
  features: {
    rfp: boolean;
    leads: boolean;
    sales: boolean;
    publicClient: boolean;
  };
  inventoryPartnerName: string;
};

type TenantAdminResponse = {
  success: boolean;
  data?: TenantAdminPayload;
  message?: string;
};

function csvToList(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

function listToCsv(value: string[] | undefined) {
  return (value ?? []).join(", ");
}

function normalizeApiBaseUrl(value: string) {
  return value.trim().replace(/\/$/, "");
}

export default function AdminApp() {
  const [activePanel, setActivePanel] = useState<"tenant" | "theme" | "editor">("tenant");
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_API_BASE_URL);
  const [adminKey, setAdminKey] = useState("");
  const [partnerId, setPartnerId] = useState("peko");
  const [tenantSlug, setTenantSlug] = useState("peko");
  const [tenantName, setTenantName] = useState("Peko");
  const [tenantStatus, setTenantStatus] = useState<"active" | "disabled">("active");
  const [parentScopes, setParentScopes] = useState("crm-and-sales, marketing");
  const [subScopes, setSubScopes] = useState("");
  const [domains, setDomains] = useState("localhost");
  const [inventoryPartnerName, setInventoryPartnerName] = useState("Peko");
  const [features, setFeatures] = useState({
    rfp: true,
    leads: true,
    sales: true,
    publicClient: true,
  });
  const [adminMessage, setAdminMessage] = useState("");
  const [adminBusy, setAdminBusy] = useState(false);
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
    const savedSettings = readAdminSettings();

    if (savedSettings) {
      setApiBaseUrl(savedSettings.apiBaseUrl || DEFAULT_API_BASE_URL);
      setAdminKey(savedSettings.adminKey || "");
      setPartnerId(savedSettings.partnerId || "peko");
      setTenantSlug(savedSettings.tenantSlug || "peko");
    }

    setActiveThemeId(storedTheme.id);
    setDraft(readSiteDraft());
    applyTheme(appTheme);
  }, []);

  function readAdminSettings() {
    try {
      return JSON.parse(
        window.localStorage.getItem(ADMIN_SETTINGS_STORAGE_KEY) ?? "null",
      ) as {
        apiBaseUrl?: string;
        adminKey?: string;
        partnerId?: string;
        tenantSlug?: string;
      } | null;
    } catch {
      return null;
    }
  }

  function persistAdminSettings(nextSlug = tenantSlug, nextPartnerId = partnerId) {
    window.localStorage.setItem(
      ADMIN_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        apiBaseUrl: normalizeApiBaseUrl(apiBaseUrl),
        adminKey,
        tenantSlug: nextSlug,
        partnerId: nextPartnerId,
      }),
    );
  }

  function applyTenantResponse(tenant: TenantAdminPayload) {
    setPartnerId(tenant.partnerId);
    setTenantSlug(tenant.slug);
    setTenantName(tenant.name);
    setTenantStatus(tenant.status);
    setParentScopes(listToCsv(tenant.allowedParentCategoryWeburls));
    setSubScopes(listToCsv(tenant.allowedSubCategoryWeburls));
    setDomains(listToCsv(tenant.domains));
    setInventoryPartnerName(tenant.inventoryPartnerName || tenant.name);
    setFeatures(tenant.features);
    setActiveThemeId(tenant.themeId);
    setDraft(tenant.contentOverrides || {});
    storeThemeId(tenant.themeId);
    storeSiteDraft(tenant.contentOverrides || {});
    syncPreviewStorage(tenant.themeId, tenant.contentOverrides || {});
    persistAdminSettings(tenant.slug, tenant.partnerId);
  }

  async function adminFetch(path: string, options: RequestInit = {}) {
    const response = await fetch(`${normalizeApiBaseUrl(apiBaseUrl)}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Admin-API-Key": adminKey,
        ...(options.headers || {}),
      },
    });
    const payload = (await response.json()) as TenantAdminResponse;

    if (!response.ok || !payload.success) {
      throw new Error(payload.message || `Admin request failed (${response.status})`);
    }

    return payload;
  }

  async function loadTenant() {
    setAdminBusy(true);
    setAdminMessage("");

    try {
      persistAdminSettings();
      const payload = await adminFetch(`/admin/tenants/${tenantSlug}`);
      if (!payload.data) throw new Error("Tenant response was empty");
      applyTenantResponse(payload.data);
      setAdminMessage(`Loaded ${payload.data.name}`);
    } catch (error) {
      setAdminMessage((error as Error).message);
    } finally {
      setAdminBusy(false);
    }
  }

  async function saveTenant() {
    setAdminBusy(true);
    setAdminMessage("");

    try {
      const payload = await adminFetch(`/admin/tenants/${tenantSlug}`, {
        method: "PUT",
        body: JSON.stringify({
          partnerId,
          slug: tenantSlug,
          name: tenantName,
          status: tenantStatus,
          allowedParentCategoryWeburls: csvToList(parentScopes),
          allowedSubCategoryWeburls: csvToList(subScopes),
          domains: csvToList(domains),
          themeId: activeThemeId,
          contentOverrides: draft,
          features,
          inventoryPartnerName,
        }),
      });

      if (!payload.data) throw new Error("Tenant response was empty");
      applyTenantResponse(payload.data);
      setAdminMessage(`Saved ${payload.data.name}`);
    } catch (error) {
      setAdminMessage((error as Error).message);
    } finally {
      setAdminBusy(false);
    }
  }

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

  const previewHref = tenantSlug ? `/${tenantSlug}` : "/home";
  const previewSrc = tenantSlug
    ? `/${tenantSlug}?previewTheme=${activeThemeId}`
    : "/home";

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
            className={activePanel === "tenant" ? "is-active" : ""}
            onClick={() => setActivePanel("tenant")}
          >
            <small>01</small>
            Tenant
          </button>
          <button
            type="button"
            className={activePanel === "theme" ? "is-active" : ""}
            onClick={() => setActivePanel("theme")}
          >
            <small>02</small>
            Package
          </button>
          <button
            type="button"
            className={activePanel === "editor" ? "is-active" : ""}
            onClick={() => setActivePanel("editor")}
          >
            <small>03</small>
            Content
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <section className="admin-panel">
          <div className="admin-panel__header">
            <p>
              {activePanel === "tenant"
                ? "Step one"
                : activePanel === "theme"
                  ? "Step two"
                  : "Step three"}
            </p>
            <h1>
              {activePanel === "tenant"
                ? "Configure the partner tenant."
                : activePanel === "theme"
                  ? "Choose the site package."
                  : "Edit landing content."}
            </h1>
            <span>
              {activePanel === "tenant"
                ? "Load or provision the backend tenant that powers the public client route."
                : activePanel === "theme"
                  ? "A package controls layout, colors, typography, and the landing page structure together."
                  : "Update the package copy without changing the visual direction."}
            </span>
          </div>

          {activePanel === "tenant" ? (
            <div className="editor-fields">
              <label className="editor-field">
                <span>
                  <b>Backend API URL</b>
                  <small>Base API endpoint used by the admin save/load actions.</small>
                </span>
                <input
                  value={apiBaseUrl}
                  onChange={(event) => setApiBaseUrl(event.target.value)}
                />
              </label>

              <label className="editor-field">
                <span>
                  <b>Admin API key</b>
                  <small>Sent as X-Admin-API-Key. Stored locally in this browser.</small>
                </span>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(event) => setAdminKey(event.target.value)}
                  autoComplete="off"
                />
              </label>

              <label className="editor-field">
                <span>
                  <b>Partner ID</b>
                  <small>Stable backend ownership key for sessions, leads, RFPs, and sales.</small>
                </span>
                <input
                  value={partnerId}
                  onChange={(event) => setPartnerId(event.target.value)}
                />
              </label>

              <label className="editor-field">
                <span>
                  <b>Public slug</b>
                  <small>Customer-facing route root, for example /peko or /acme.</small>
                </span>
                <input
                  value={tenantSlug}
                  onChange={(event) => setTenantSlug(event.target.value)}
                />
              </label>

              <label className="editor-field">
                <span>
                  <b>Tenant name</b>
                  <small>Display name used by client pages and admin lists.</small>
                </span>
                <input
                  value={tenantName}
                  onChange={(event) => setTenantName(event.target.value)}
                />
              </label>

              <label className="editor-field">
                <span>
                  <b>Status</b>
                  <small>Disabled tenants cannot be served by the public client.</small>
                </span>
                <select
                  value={tenantStatus}
                  onChange={(event) =>
                    setTenantStatus(event.target.value === "disabled" ? "disabled" : "active")
                  }
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </label>

              <label className="editor-field">
                <span>
                  <b>Allowed parent categories</b>
                  <small>Comma-separated backend category weburls.</small>
                </span>
                <textarea
                  value={parentScopes}
                  rows={2}
                  onChange={(event) => setParentScopes(event.target.value)}
                />
              </label>

              <label className="editor-field">
                <span>
                  <b>Allowed subcategories</b>
                  <small>Optional comma-separated subcategory weburls. Empty means all under allowed parents.</small>
                </span>
                <textarea
                  value={subScopes}
                  rows={2}
                  onChange={(event) => setSubScopes(event.target.value)}
                />
              </label>

              <label className="editor-field">
                <span>
                  <b>Custom domains</b>
                  <small>Comma-separated hostnames that resolve to this tenant.</small>
                </span>
                <textarea
                  value={domains}
                  rows={2}
                  onChange={(event) => setDomains(event.target.value)}
                />
              </label>

              <label className="editor-field">
                <span>
                  <b>Inventory partner name</b>
                  <small>Name sent to the inventory/sales service for this partner.</small>
                </span>
                <input
                  value={inventoryPartnerName}
                  onChange={(event) => setInventoryPartnerName(event.target.value)}
                />
              </label>

              <div className="editor-field">
                <span>
                  <b>Features</b>
                  <small>Enable the modules this partner is allowed to use.</small>
                </span>
                <div className="admin-feature-grid">
                  {(["publicClient", "rfp", "leads", "sales"] as const).map((feature) => (
                    <label key={feature}>
                      <input
                        type="checkbox"
                        checked={features[feature]}
                        onChange={(event) =>
                          setFeatures((current) => ({
                            ...current,
                            [feature]: event.target.checked,
                          }))
                        }
                      />
                      <span>{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {adminMessage ? <p className="admin-status">{adminMessage}</p> : null}

              <div className="admin-action-row">
                <button type="button" className="admin-reset" disabled={adminBusy} onClick={loadTenant}>
                  {adminBusy ? "Loading..." : "Load tenant"}
                </button>
                <button type="button" className="theme-button-link theme-button-link--primary" disabled={adminBusy} onClick={saveTenant}>
                  {adminBusy ? "Saving..." : "Save tenant"}
                </button>
              </div>
            </div>
          ) : activePanel === "theme" ? (
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
              {tenantSlug ? `/${tenantSlug}` : "Live landing preview"}
            </span>
            <a href={previewHref} target="_blank" rel="noreferrer">
              Open site
            </a>
          </div>
          <iframe
            ref={previewRef}
            src={previewSrc}
            title="Tenant client preview"
            onLoad={() => syncPreviewStorage(activeThemeId, draft)}
          />
        </aside>
      </main>
    </div>
  );
}
