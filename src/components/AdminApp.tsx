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
import {
  adminFetch,
  csvToList,
  DEFAULT_API_BASE_URL,
  listToCsv,
  normalizeApiBaseUrl,
  readAdminSettings,
  writeAdminSettings,
  type TenantAdminPayload,
} from "../lib/adminClient";

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
    help: "Name shown on the site.",
  },
  {
    label: "Logo image path",
    path: "landing.brand.logo",
    help: "Leave blank to use the default logo.",
    placeholder: "/static/zoftwarehub-logo.svg",
  },
  {
    label: "Logo alt text",
    path: "landing.brand.logoAlt",
    help: "Short label for the logo.",
  },
  {
    label: "Announcement text",
    path: "landing.announcement.text",
    help: "Short message above the navigation.",
  },
  {
    label: "Announcement link label",
    path: "landing.announcement.linkLabel",
    help: "Clickable label shown in the announcement bar.",
  },
  {
    label: "Announcement link",
    path: "landing.announcement.linkHref",
    help: "Where the announcement link opens.",
  },
  {
    label: "Main menu button",
    path: "landing.navigation.primaryCtaLabel",
    help: "Main button in the menu.",
  },
  {
    label: "Navigation sign-in label",
    path: "landing.navigation.signInLabel",
    help: "Sign-in button text.",
  },
  {
    label: "Top section small label",
    path: "landing.hero.eyebrow",
    help: "Small text above the main heading.",
  },
  {
    label: "Top heading line 1",
    path: "landing.hero.headlineLines.0",
    help: "First line of the hero headline.",
  },
  {
    label: "Top heading line 2",
    path: "landing.hero.headlineLines.1",
    help: "Second line of the hero headline.",
  },
  {
    label: "Top heading line 3",
    path: "landing.hero.headlineLines.2",
    help: "Third line of the hero headline.",
  },
  {
    label: "Top section description",
    path: "landing.hero.description",
    help: "Text below the main heading.",
    multiline: true,
  },
  {
    label: "Search placeholder",
    path: "landing.hero.searchPlaceholder",
    help: "Placeholder text inside the homepage search box.",
  },
  {
    label: "Search button",
    path: "landing.hero.searchButtonLabel",
    help: "Label for the hero search action.",
  },
  {
    label: "Top stat 1 value",
    path: "landing.hero.stats.0.value",
    help: "First hero metric value.",
  },
  {
    label: "Top stat 1 label",
    path: "landing.hero.stats.0.label",
    help: "First hero metric label.",
  },
  {
    label: "Top stat 2 value",
    path: "landing.hero.stats.1.value",
    help: "Second hero metric value.",
  },
  {
    label: "Top stat 2 label",
    path: "landing.hero.stats.1.label",
    help: "Second hero metric label.",
  },
  {
    label: "Top stat 3 value",
    path: "landing.hero.stats.2.value",
    help: "Third hero metric value.",
  },
  {
    label: "Top stat 3 label",
    path: "landing.hero.stats.2.label",
    help: "Third hero metric label.",
  },
  {
    label: "Trusted-by label",
    path: "landing.trustedBy.label",
    help: "Label before the trusted-by strip.",
  },
  {
    label: "Tools small label",
    path: "landing.aiTools.eyebrow",
    help: "Small text above the tools section.",
  },
  {
    label: "Tools heading line 1",
    path: "landing.aiTools.headingLines.0",
    help: "First heading line for the tools section.",
  },
  {
    label: "Tools heading line 2",
    path: "landing.aiTools.headingLines.1",
    help: "Second heading line for the tools section.",
  },
  {
    label: "Tool 1 title",
    path: "landing.aiTools.items.0.title",
    help: "Title for the first tool card.",
  },
  {
    label: "Tool 1 description",
    path: "landing.aiTools.items.0.description",
    help: "Description for the first tool card.",
    multiline: true,
  },
  {
    label: "Catalog heading",
    path: "landing.catalog.heading",
    help: "Heading above the software grid.",
  },
  {
    label: "Catalog small label",
    path: "landing.catalog.eyebrow",
    help: "Small text above the software grid.",
  },
  {
    label: "Product primary button",
    path: "landing.catalog.primaryActionLabel",
    help: "Main button on product cards.",
  },
  {
    label: "Product secondary button",
    path: "landing.catalog.secondaryActionLabel",
    help: "Second button on product cards.",
  },
  {
    label: "Process small label",
    path: "landing.process.eyebrow",
    help: "Small text above the process section.",
  },
  {
    label: "Process heading",
    path: "landing.process.heading",
    help: "Heading for the process section.",
  },
  {
    label: "Process step 1 title",
    path: "landing.process.steps.0.title",
    help: "Title for the first process step.",
  },
  {
    label: "Process step 1 description",
    path: "landing.process.steps.0.description",
    help: "Description for the first process step.",
    multiline: true,
  },
  {
    label: "Browse categories heading",
    path: "landing.browseCategories.heading",
    help: "Heading for the category browse section.",
  },
  {
    label: "Why choose small label",
    path: "landing.whyChoose.eyebrow",
    help: "Small text above the why-choose section.",
  },
  {
    label: "Why choose heading line 1",
    path: "landing.whyChoose.headingLines.0",
    help: "First heading line for the why-choose section.",
  },
  {
    label: "Why choose heading line 2",
    path: "landing.whyChoose.headingLines.1",
    help: "Second heading line for the why-choose section.",
  },
  {
    label: "Testimonials heading",
    path: "landing.testimonials.heading",
    help: "Heading above testimonials.",
  },
  {
    label: "Final section heading line 1",
    path: "landing.cta.headlineLines.0",
    help: "First line of the final heading.",
  },
  {
    label: "Final section heading line 2",
    path: "landing.cta.headlineLines.1",
    help: "Second line of the final heading.",
  },
  {
    label: "Final section description",
    path: "landing.cta.description",
    help: "Text in the final section.",
    multiline: true,
  },
  {
    label: "Final primary button",
    path: "landing.cta.primaryLabel",
    help: "Main button in the final section.",
  },
  {
    label: "Final secondary button",
    path: "landing.cta.secondaryLabel",
    help: "Second button in the final section.",
  },
  {
    label: "Footer description",
    path: "landing.footer.description",
    help: "Short brand description in the footer.",
    multiline: true,
  },
  {
    label: "Footer newsletter title",
    path: "landing.footer.newsletter.title",
    help: "Newsletter block title.",
  },
  {
    label: "Footer copyright",
    path: "landing.footer.copyright",
    help: "Copyright text shown at the bottom of the public site.",
  },
];

const featureLabels: Record<keyof TenantAdminPayload["features"], string> = {
  publicClient: "Partner website",
  rfp: "Request forms",
  leads: "Customer requests",
  sales: "Sales",
};

export default function AdminApp() {
  const [activePanel, setActivePanel] = useState<"tenant" | "theme" | "editor">("tenant");
  const apiBaseUrl = DEFAULT_API_BASE_URL;
  const [adminKey, setAdminKey] = useState("");
  const [routeTenantSlug, setRouteTenantSlug] = useState("");
  const [partnerId, setPartnerId] = useState("peko");
  const [tenantSlug, setTenantSlug] = useState("peko");
  const [tenantName, setTenantName] = useState("Peko");
  const [tenantStatus, setTenantStatus] = useState<"active" | "disabled">("active");
  const [parentScopes, setParentScopes] = useState(
    "crm-and-sales, marketing, digital-workspace-productivity, customer-service-communication, security",
  );
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
  const [focusedEditorPath, setFocusedEditorPath] = useState("");
  const [previewSelectionMessage, setPreviewSelectionMessage] = useState("");
  const previewRef = useRef<HTMLIFrameElement | null>(null);
  const fieldRefs = useRef<Record<string, HTMLLabelElement | null>>({});
  const autoLoadedTenantRef = useRef("");
  const defaultTheme = appTheme;

  const activeTheme = useMemo(
    () => themePackages.find((theme) => theme.id === activeThemeId) ?? themePackages[0],
    [activeThemeId],
  );
  const effectiveContent = useMemo(() => mergeDeep(activeTheme, draft), [activeTheme, draft]);

  useEffect(() => {
    const storedTheme = resolveThemePackage(getStoredThemeId());
    const savedSettings = readAdminSettings();
    const requestedTenantSlug = new URLSearchParams(window.location.search)
      .get("tenant")
      ?.trim();
    const initialTenantSlug = requestedTenantSlug || savedSettings?.tenantSlug || "peko";

    if (savedSettings) {
      setAdminKey(savedSettings.adminKey || "");
      setPartnerId(savedSettings.partnerId || initialTenantSlug);
    } else {
      setPartnerId(initialTenantSlug);
    }

    setRouteTenantSlug(requestedTenantSlug || "");
    setTenantSlug(initialTenantSlug);
    setActiveThemeId(storedTheme.id);
    setDraft(readSiteDraft());
    applyTheme(appTheme);
  }, []);

  useEffect(() => {
    if (!routeTenantSlug || !adminKey || autoLoadedTenantRef.current === routeTenantSlug) {
      return;
    }

    autoLoadedTenantRef.current = routeTenantSlug;
    void loadTenant();
  }, [routeTenantSlug, adminKey]);

  function persistAdminSettings(nextSlug = tenantSlug, nextPartnerId = partnerId) {
    writeAdminSettings({
      apiBaseUrl: normalizeApiBaseUrl(apiBaseUrl),
      adminKey,
      tenantSlug: nextSlug,
      partnerId: nextPartnerId,
    });
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

  async function adminRequest<T = TenantAdminPayload>(path: string, options: RequestInit = {}) {
    return adminFetch<T>(apiBaseUrl, adminKey, path, options);
  }

  async function loadTenant() {
    setAdminBusy(true);
    setAdminMessage("");

    try {
      persistAdminSettings();
      const payload = await adminRequest(`/admin/tenants/${tenantSlug}`);
      if (!payload.data) throw new Error("Partner was not found.");
      applyTenantResponse(payload.data);
      setAdminMessage(`Loaded ${payload.data.name}`);
    } catch (error) {
      setAdminMessage((error as Error).message);
    } finally {
      setAdminBusy(false);
    }
  }

  async function saveTenant() {
    return saveTenantPayload(tenantSlug, {
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
    });
  }

  async function saveTenantPayload(
    routeSlug: string,
    payloadBody: Omit<TenantAdminPayload, "contentOverrides"> & {
      contentOverrides: Record<string, unknown>;
    },
  ) {
    setAdminBusy(true);
    setAdminMessage("");

    try {
      const payload = await adminRequest<TenantAdminPayload>(`/admin/tenants/${routeSlug}`, {
        method: "PUT",
        body: JSON.stringify(payloadBody),
      });

      if (!payload.data) throw new Error("Partner was not saved.");
      applyTenantResponse(payload.data);
      setAdminMessage(`Saved ${payload.data.name}`);
      return payload.data;
    } catch (error) {
      setAdminMessage((error as Error).message);
      return null;
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
    installPreviewClickBridge();
  }

  function installPreviewClickBridge() {
    const previewFrame = previewRef.current;
    const previewWindow = previewFrame?.contentWindow as (Window & {
      __ZOFTWARE_ADMIN_PREVIEW_CLICK__?: (event: MouseEvent) => void;
    }) | null;
    const previewDocument = previewFrame?.contentDocument;

    if (!previewFrame || !previewWindow || !previewDocument) {
      return;
    }

    if (previewWindow.__ZOFTWARE_ADMIN_PREVIEW_CLICK__) {
      previewDocument.removeEventListener(
        "click",
        previewWindow.__ZOFTWARE_ADMIN_PREVIEW_CLICK__,
        true,
      );
    }

    const handler = (event: MouseEvent) => {
      const matchedField = findEditorFieldForPreviewClick(event.target);

      if (!matchedField) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      focusEditorField(matchedField);
    };

    previewWindow.__ZOFTWARE_ADMIN_PREVIEW_CLICK__ = handler;
    previewDocument.addEventListener("click", handler, true);
  }

  function findEditorFieldForPreviewClick(target: EventTarget | null) {
    const explicitField = findEditorFieldByCmsPath(target);

    if (explicitField) {
      return explicitField;
    }

    const candidates = collectPreviewTextCandidates(target);

    if (!candidates.length) {
      return null;
    }

    const editableValues = editorFields
      .map((field) => ({
        field,
        value: normalizePreviewText(String(getByPath(effectiveContent, field.path) ?? "")),
      }))
      .filter((item) => item.value.length >= 2);

    let bestMatch: { field: EditorField; score: number } | null = null;

    candidates.forEach((candidate) => {
      const normalizedCandidate = normalizePreviewText(candidate);

      if (normalizedCandidate.length < 2) {
        return;
      }

      editableValues.forEach(({ field, value }) => {
        const score = scorePreviewTextMatch(normalizedCandidate, value);

        if (score > 0 && (!bestMatch || score > bestMatch.score)) {
          bestMatch = { field, score };
        }
      });
    });

    return bestMatch?.field ?? null;
  }

  function findEditorFieldByCmsPath(target: EventTarget | null) {
    const initialNode = target as (Node & { parentElement?: Element | null }) | null;
    const element = initialNode?.nodeType === 1
      ? (initialNode as unknown as Element)
      : initialNode?.parentElement ?? null;
    const path = element
      ?.closest?.("[data-cms-path]")
      ?.getAttribute("data-cms-path");

    if (!path) {
      return null;
    }

    return editorFields.find((field) => field.path === path) ?? null;
  }

  function collectPreviewTextCandidates(target: EventTarget | null) {
    const initialNode = target as (Node & { parentElement?: Element | null }) | null;
    let element = initialNode?.nodeType === 1
      ? (initialNode as unknown as Element)
      : initialNode?.parentElement ?? null;
    const candidates = new Set<string>();

    while (element && element.tagName !== "BODY" && element.tagName !== "HTML") {
      const text = readPreviewElementText(element);

      if (text && text.length <= 240) {
        candidates.add(text);
      }

      element = element.parentElement;
    }

    return Array.from(candidates);
  }

  function readPreviewElementText(element: Element) {
    const tagName = element.tagName.toLowerCase();

    if (tagName === "input" || tagName === "textarea") {
      const input = element as HTMLInputElement | HTMLTextAreaElement;
      return input.value || input.placeholder || "";
    }

    if (tagName === "img") {
      return element.getAttribute("alt") || "";
    }

    return (element as HTMLElement).innerText || element.textContent || "";
  }

  function scorePreviewTextMatch(candidate: string, value: string) {
    if (candidate === value) {
      return 10000 + value.length;
    }

    if (value.length >= 4 && candidate.includes(value)) {
      return 5000 + value.length;
    }

    if (candidate.length >= 4 && value.includes(candidate)) {
      return 2500 + candidate.length;
    }

    return 0;
  }

  function normalizePreviewText(value: string) {
    return value.replace(/\s+/g, " ").trim().toLowerCase();
  }

  function focusEditorField(field: EditorField) {
    setActivePanel("editor");
    setFocusedEditorPath(field.path);
    setPreviewSelectionMessage(`Selected from preview: ${field.label}`);

    window.setTimeout(() => {
      const fieldElement = fieldRefs.current[field.path];
      const control = fieldElement?.querySelector("input, textarea") as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;

      fieldElement?.scrollIntoView({ block: "center", behavior: "smooth" });
      control?.focus({ preventScroll: true });
      control?.select();
    }, 80);
  }

  const previewHref = tenantSlug ? `/${tenantSlug}` : "/admin/manage";
  const previewSrc = tenantSlug
    ? `/${tenantSlug}?previewTheme=${activeThemeId}`
    : "about:blank";

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin sections">
        <div className="admin-sidebar__brand">
          <img src={defaultTheme.assets.miniLogo} alt="" />
          <span>Partner Admin</span>
        </div>
        <nav>
          <button
            type="button"
            className={activePanel === "tenant" ? "is-active" : ""}
            onClick={() => setActivePanel("tenant")}
          >
            <small>01</small>
            Partner
          </button>
          <button
            type="button"
            className={activePanel === "theme" ? "is-active" : ""}
            onClick={() => setActivePanel("theme")}
          >
            <small>02</small>
            Look
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
                ? "Partner"
                : activePanel === "theme"
                  ? "Look"
                  : "Content"}
            </p>
            <h1>
              {activePanel === "tenant"
                ? "Edit partner settings."
                : activePanel === "theme"
                  ? "Choose the site look."
                  : "Edit landing content."}
            </h1>
            <span>
              {activePanel === "tenant"
                ? "Update who this partner is and what they can show."
                : activePanel === "theme"
                  ? "Pick the style used on the public site."
                  : "Change the words shown on the public site."}
            </span>
          </div>

          {activePanel === "tenant" ? (
            <div className="editor-fields">
              <label className="editor-field">
                <span>
                  <b>Access key</b>
                  <small>Stored only in this browser.</small>
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
                  <b>Partner code</b>
                  <small>Internal partner code.</small>
                </span>
                <input
                  value={partnerId}
                  onChange={(event) => setPartnerId(event.target.value)}
                />
              </label>

              <label className="editor-field">
                <span>
                  <b>Page path</b>
                  <small>Example: /peko or /acme.</small>
                </span>
                <input
                  value={tenantSlug}
                  onChange={(event) => setTenantSlug(event.target.value)}
                />
              </label>

              <label className="editor-field">
                <span>
                  <b>Partner name</b>
                  <small>Name shown in admin and on the site.</small>
                </span>
                <input
                  value={tenantName}
                  onChange={(event) => setTenantName(event.target.value)}
                />
              </label>

              <label className="editor-field">
                <span>
                  <b>Status</b>
                  <small>Turn the public site on or off.</small>
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
                  <b>Main categories</b>
                  <small>Separate multiple categories with commas.</small>
                </span>
                <textarea
                  value={parentScopes}
                  rows={2}
                  onChange={(event) => setParentScopes(event.target.value)}
                />
              </label>

              <label className="editor-field">
                <span>
                  <b>Subcategories</b>
                  <small>Optional. Leave blank for all.</small>
                </span>
                <textarea
                  value={subScopes}
                  rows={2}
                  onChange={(event) => setSubScopes(event.target.value)}
                />
              </label>

              <label className="editor-field">
                <span>
                  <b>Web domains</b>
                  <small>Optional. Separate multiple domains with commas.</small>
                </span>
                <textarea
                  value={domains}
                  rows={2}
                  onChange={(event) => setDomains(event.target.value)}
                />
              </label>

              <label className="editor-field">
                <span>
                  <b>Catalog partner name</b>
                  <small>Name used for the product catalog.</small>
                </span>
                <input
                  value={inventoryPartnerName}
                  onChange={(event) => setInventoryPartnerName(event.target.value)}
                />
              </label>

              <div className="editor-field">
                <span>
                  <b>Features</b>
                  <small>Choose what this partner can use.</small>
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
                      <span>{featureLabels[feature]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {adminMessage ? <p className="admin-status">{adminMessage}</p> : null}

              <div className="admin-action-row">
                <button type="button" className="admin-reset" disabled={adminBusy} onClick={loadTenant}>
                  {adminBusy ? "Loading..." : "Load partner"}
                </button>
                <button type="button" className="theme-button-link theme-button-link--primary" disabled={adminBusy} onClick={saveTenant}>
                  {adminBusy ? "Saving..." : "Save partner"}
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
                    {theme.character}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="editor-fields">
              {previewSelectionMessage ? (
                <p className="admin-status admin-status--selection">{previewSelectionMessage}</p>
              ) : null}
              {editorFields.map((field) => (
                <label
                  className={`editor-field ${focusedEditorPath === field.path ? "is-preview-selected" : ""}`}
                  data-editor-path={field.path}
                  key={field.path}
                  ref={(node) => {
                    fieldRefs.current[field.path] = node;
                  }}
                >
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
              {adminMessage ? <p className="admin-status">{adminMessage}</p> : null}

              <div className="admin-action-row">
                <button type="button" className="admin-reset" disabled={adminBusy} onClick={resetEditor}>
                  Reset edits
                </button>
                <button type="button" className="theme-button-link theme-button-link--primary" disabled={adminBusy} onClick={saveTenant}>
                  {adminBusy ? "Saving..." : "Save partner"}
                </button>
              </div>
            </div>
          )}
        </section>

        <aside className="admin-preview">
          <div className="admin-preview__bar">
            <span>
              <small>Public preview</small>
              <b>{tenantName || activeTheme.name}</b>
              <em>{tenantSlug ? `/${tenantSlug}` : "No partner selected"}</em>
              <i>Click preview text to edit</i>
            </span>
            <a href={previewHref} target="_blank" rel="noreferrer">
              Open public page
            </a>
          </div>
          <iframe
            ref={previewRef}
            src={previewSrc}
            title="Partner site preview"
            onLoad={() => {
              syncPreviewStorage(activeThemeId, draft);
              installPreviewClickBridge();
            }}
          />
        </aside>
      </main>
    </div>
  );
}
