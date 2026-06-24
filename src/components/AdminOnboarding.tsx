import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  FileIcon,
  SearchIcon,
  SparkIcon,
  TargetIcon,
} from "./icons";
import type { CatalogCategory } from "../lib/catalog";
import {
  adminFetch,
  csvToList,
  DEFAULT_API_BASE_URL,
  normalizeTenantSlug,
  readAdminSettings,
  writeAdminSettings,
  type TenantAdminPayload,
} from "../lib/adminClient";
import {
  resolveThemePackage,
  themePackages,
} from "../lib/themeEngine";

type CreatePartnerState = {
  partnerId: string;
  slug: string;
  name: string;
  domains: string;
  inventoryPartnerName: string;
  allowedParentCategoryWeburls: string[];
  allowedSubCategoryWeburls: string;
  themeId: string;
  features: TenantAdminPayload["features"];
  heroLineOne: string;
  heroDescription: string;
};

type ModuleOption = {
  id: keyof TenantAdminPayload["features"];
  title: string;
  description: string;
  badge: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const createSteps = ["Partner", "Categories", "Features", "Look", "Review"] as const;

const moduleOptions: ModuleOption[] = [
  {
    id: "publicClient",
    title: "Partner website",
    description: "Show the public catalog for this partner.",
    badge: "Website",
    icon: SearchIcon,
  },
  {
    id: "rfp",
    title: "Request forms",
    description: "Let buyers send their software needs.",
    badge: "Forms",
    icon: FileIcon,
  },
  {
    id: "leads",
    title: "Customer requests",
    description: "Collect and manage incoming requests.",
    badge: "Requests",
    icon: TargetIcon,
  },
  {
    id: "sales",
    title: "Sales",
    description: "Share requests with the sales team.",
    badge: "Sales",
    icon: SparkIcon,
  },
];

function initialCreatePartnerState(): CreatePartnerState {
  return {
    partnerId: "",
    slug: "",
    name: "",
    domains: "localhost",
    inventoryPartnerName: "",
    allowedParentCategoryWeburls: [],
    allowedSubCategoryWeburls: "",
    themeId: themePackages[0].id,
    features: {
      rfp: true,
      leads: true,
      sales: true,
      publicClient: true,
    },
    heroLineOne: "",
    heroDescription: "",
  };
}

export default function AdminOnboarding() {
  const apiBaseUrl = DEFAULT_API_BASE_URL;
  const [adminKey, setAdminKey] = useState("");
  const [parentCategoryOptions, setParentCategoryOptions] = useState<CatalogCategory[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState<CreatePartnerState>(() => initialCreatePartnerState());
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedSettings = readAdminSettings();

    if (!savedSettings) {
      return;
    }

    setAdminKey(savedSettings.adminKey || "");

    if (savedSettings.adminKey) {
      void loadParentCategoryOptions(DEFAULT_API_BASE_URL, savedSettings.adminKey);
    }
  }, []);

  async function loadParentCategoryOptions(
    nextApiBaseUrl = apiBaseUrl,
    nextAdminKey = adminKey,
  ) {
    if (!nextAdminKey) {
      return;
    }

    try {
      const payload = await adminFetch<CatalogCategory[]>(
        nextApiBaseUrl,
        nextAdminKey,
        "/admin/categories/parent",
      );
      const categories = payload.data || [];
      setParentCategoryOptions(categories);

      if (!draft.allowedParentCategoryWeburls.length && categories.length) {
        setDraft((current) => ({
          ...current,
          allowedParentCategoryWeburls: categories
            .slice(0, 2)
            .map((category) => category.weburl),
        }));
      }
    } catch (error) {
      setMessage((error as Error).message);
    }
  }

  function persistSettings(nextSlug = draft.slug, nextPartnerId = draft.partnerId) {
    writeAdminSettings({
      apiBaseUrl,
      adminKey,
      tenantSlug: nextSlug,
      partnerId: nextPartnerId,
    });
  }

  function updateDraft(patch: Partial<CreatePartnerState>) {
    setDraft((current) => {
      const next = { ...current, ...patch };

      if (patch.name !== undefined) {
        if (!current.slug) {
          next.slug = normalizeTenantSlug(patch.name);
        }

        if (!current.heroLineOne) {
          next.heroLineOne = patch.name;
        }

        if (!current.inventoryPartnerName) {
          next.inventoryPartnerName = patch.name;
        }
      }

      if (patch.slug !== undefined) {
        next.slug = normalizeTenantSlug(patch.slug);
        if (!current.partnerId || current.partnerId === current.slug) {
          next.partnerId = next.slug;
        }
      }

      if (patch.partnerId !== undefined) {
        next.partnerId = normalizeTenantSlug(patch.partnerId);
      }

      return next;
    });
  }

  function toggleCategory(weburl: string) {
    setDraft((current) => {
      const selected = current.allowedParentCategoryWeburls.includes(weburl);

      return {
        ...current,
        allowedParentCategoryWeburls: selected
          ? current.allowedParentCategoryWeburls.filter((item) => item !== weburl)
          : [...current.allowedParentCategoryWeburls, weburl],
      };
    });
  }

  function toggleFeature(feature: keyof TenantAdminPayload["features"]) {
    setDraft((current) => ({
      ...current,
      features: {
        ...current.features,
        [feature]: !current.features[feature],
      },
    }));
  }

  async function finishCreateTenant() {
    const normalizedSlug = normalizeTenantSlug(draft.slug);
    const normalizedPartnerId = normalizeTenantSlug(draft.partnerId || normalizedSlug);
    const displayName = draft.name.trim();

    if (!adminKey) {
      setMessage("Access key is required.");
      return;
    }

    if (!normalizedSlug || !normalizedPartnerId || !displayName) {
      setMessage("Partner name, page path, and partner code are required.");
      return;
    }

    if (draft.allowedParentCategoryWeburls.length === 0) {
      setMessage("Select at least one parent category.");
      return;
    }

    setIsBusy(true);
    setMessage("");
    persistSettings(normalizedSlug, normalizedPartnerId);

    try {
      const brandName = displayName;
      const payload = await adminFetch<TenantAdminPayload>(
        apiBaseUrl,
        adminKey,
        `/admin/tenants/${normalizedSlug}`,
        {
          method: "PUT",
          body: JSON.stringify({
            partnerId: normalizedPartnerId,
            slug: normalizedSlug,
            name: displayName,
            status: "active",
            allowedParentCategoryWeburls: draft.allowedParentCategoryWeburls,
            allowedSubCategoryWeburls: csvToList(draft.allowedSubCategoryWeburls),
            domains: csvToList(draft.domains),
            themeId: draft.themeId,
            contentOverrides: {
              landing: {
                brand: {
                  name: brandName,
                  logoAlt: `${brandName} logo`,
                },
                hero: {
                  headlineLines: [
                    draft.heroLineOne.trim() || brandName,
                    "software for",
                    "your business.",
                  ],
                  description:
                    draft.heroDescription.trim() ||
                    `Explore software options from ${brandName}.`,
                },
                footer: {
                  copyright: `Copyright ${new Date().getFullYear()} ${brandName}. All rights reserved.`,
                },
              },
            },
            features: draft.features,
            inventoryPartnerName: draft.inventoryPartnerName.trim() || displayName,
          }),
        },
      );

      if (!payload.data) {
        throw new Error("Partner was not saved.");
      }

      writeAdminSettings({
        apiBaseUrl,
        adminKey,
        partnerId: payload.data.partnerId,
        tenantSlug: payload.data.slug,
      });
      setMessage(`Created ${payload.data.name}. Opening editor...`);
      window.location.assign(`/admin/manage?tenant=${encodeURIComponent(payload.data.slug)}`);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setIsBusy(false);
    }
  }

  const canContinue =
    stepIndex === 0
      ? Boolean(draft.name.trim() && draft.slug.trim() && draft.partnerId.trim())
      : stepIndex === 1
        ? draft.allowedParentCategoryWeburls.length > 0
        : true;

  return (
    <main className="admin-management-shell admin-management-shell--onboarding">
      <header className="admin-management-header">
        <a href="/admin">Partner Admin</a>
        <nav aria-label="Admin navigation">
          <a href="/admin">Overview</a>
          <a href="/admin/manage">Edit partner</a>
        </nav>
      </header>

      <section className="admin-management-hero">
        <div>
          <p>Create partner</p>
          <h1>Create a partner.</h1>
          <span>Set the page, categories, features, and site look.</span>
        </div>
      </section>

      <section className="admin-management-panel" aria-label="Connection settings">
        <div className="admin-home__connection">
          <label className="editor-field">
            <span>
              <b>Access key</b>
              <small>Stored only in this browser.</small>
            </span>
            <input
              type="password"
              value={adminKey}
              autoComplete="off"
              spellCheck="false"
              onChange={(event) => setAdminKey(event.target.value)}
              onBlur={() => {
                persistSettings();
                void loadParentCategoryOptions();
              }}
            />
          </label>
          <button
            type="button"
            className="admin-reset"
            disabled={isBusy || !adminKey}
            onClick={() => {
              persistSettings();
              void loadParentCategoryOptions();
            }}
          >
            Load categories
          </button>
        </div>
      </section>

      <section className="admin-onboarding" aria-label="Create partner flow">
        <aside className="admin-onboarding__rail">
          <div className="onboarding-progress">
            {createSteps.map((step, index) => (
              <button
                type="button"
                key={step}
                className={index === stepIndex ? "is-active" : index < stepIndex ? "is-complete" : ""}
                onClick={() => setStepIndex(index)}
              >
                <span>{index < stepIndex ? <CheckCircleIcon /> : index + 1}</span>
                {step}
              </button>
            ))}
          </div>
          <div className="onboarding-summary">
            <small>Draft</small>
            <strong>{draft.name || "New partner"}</strong>
            <p>{draft.allowedParentCategoryWeburls.length} selected</p>
          </div>
        </aside>

        <section className="admin-onboarding__main">
          <div className="onboarding-step-header">
            <p>{createSteps[stepIndex]}</p>
            <h2>{getStepTitle(stepIndex)}</h2>
          </div>

          <div className="onboarding-step-body">
            {stepIndex === 0 ? (
              <div className="onboarding-grid onboarding-grid--two">
                <label className="onboarding-field">
                  <span>Partner name</span>
                  <input
                    value={draft.name}
                    placeholder="Acme"
                    onChange={(event) => updateDraft({ name: event.target.value })}
                  />
                </label>
                <label className="onboarding-field">
                  <span>Page path</span>
                  <input
                    value={draft.slug}
                    placeholder="acme"
                    spellCheck="false"
                    onChange={(event) => updateDraft({ slug: event.target.value })}
                  />
                </label>
                <label className="onboarding-field">
                  <span>Partner code</span>
                  <input
                    value={draft.partnerId}
                    placeholder="acme"
                    spellCheck="false"
                    onChange={(event) => updateDraft({ partnerId: event.target.value })}
                  />
                </label>
                <label className="onboarding-field">
                  <span>Web domains</span>
                  <input
                    value={draft.domains}
                    placeholder="localhost, acme.com"
                    spellCheck="false"
                    onChange={(event) => updateDraft({ domains: event.target.value })}
                  />
                </label>
                <label className="onboarding-field onboarding-field--wide">
                  <span>Catalog partner name</span>
                  <input
                    value={draft.inventoryPartnerName}
                    placeholder={draft.name || "Acme"}
                    onChange={(event) => updateDraft({ inventoryPartnerName: event.target.value })}
                  />
                </label>
              </div>
            ) : null}

            {stepIndex === 1 ? (
              <div className="admin-create-scope">
                <label className="onboarding-field">
                  <span>Main categories</span>
                  <input
                    value={draft.allowedParentCategoryWeburls.join(", ")}
                    placeholder="crm-and-sales, marketing"
                    spellCheck="false"
                    onChange={(event) =>
                      updateDraft({
                        allowedParentCategoryWeburls: csvToList(event.target.value),
                      })
                    }
                  />
                </label>
                <div className="category-select-grid">
                  {parentCategoryOptions.map((category) => {
                    const selected = draft.allowedParentCategoryWeburls.includes(category.weburl);
                    return (
                      <button
                        type="button"
                        key={category.weburl}
                        className={`category-select-card ${selected ? "is-selected" : ""}`}
                        onClick={() => toggleCategory(category.weburl)}
                      >
                        <span>
                          <strong>{category.name}</strong>
                          <small>{category.weburl}</small>
                        </span>
                        {selected ? <i><CheckCircleIcon /></i> : null}
                      </button>
                    );
                  })}
                </div>
                <label className="onboarding-field">
                  <span>Subcategories</span>
                  <input
                    value={draft.allowedSubCategoryWeburls}
                    placeholder="Optional; leave blank for all"
                    spellCheck="false"
                    onChange={(event) => updateDraft({ allowedSubCategoryWeburls: event.target.value })}
                  />
                </label>
              </div>
            ) : null}

            {stepIndex === 2 ? (
              <div className="option-grid">
                {moduleOptions.map((module) => {
                  const Icon = module.icon;
                  const selected = draft.features[module.id];
                  return (
                    <button
                      type="button"
                      key={module.id}
                      className={`selection-card ${selected ? "is-selected" : ""}`}
                      onClick={() => toggleFeature(module.id)}
                    >
                      <span className="selection-card__icon">
                        <Icon />
                      </span>
                      <span>
                        <em>{module.badge}</em>
                        <strong>{module.title}</strong>
                        <small>{module.description}</small>
                      </span>
                      <i>{selected ? <CheckCircleIcon /> : null}</i>
                    </button>
                  );
                })}
              </div>
            ) : null}

            {stepIndex === 3 ? (
              <div className="theme-pkg-grid">
                {themePackages.map((theme) => (
                  <button
                    type="button"
                    key={theme.id}
                    className={`theme-pkg-card ${draft.themeId === theme.id ? "is-selected" : ""}`}
                    onClick={() => updateDraft({ themeId: theme.id })}
                  >
                    <span className="theme-pkg-card__head">
                      <img src={theme.assets.logo} alt="" />
                      <span className="theme-pkg-card__check"><CheckCircleIcon /></span>
                    </span>
                    <span className="theme-pkg-card__name">{theme.name}</span>
                    <span className="theme-pkg-card__desc">{theme.description}</span>
                    <span className="theme-pkg-card__swatches">
                      <i style={{ background: theme.colors.background }} />
                      <i style={{ background: theme.colors.brand }} />
                      <i style={{ background: theme.colors.brandDark }} />
                      <i style={{ background: theme.colors.panelSoft }} />
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            {stepIndex === 4 ? (
              <div className="admin-create-review">
                <dl>
                  <div><dt>Name</dt><dd>{draft.name}</dd></div>
                  <div><dt>Page</dt><dd>/{draft.slug}</dd></div>
                  <div><dt>Partner code</dt><dd>{draft.partnerId}</dd></div>
                  <div><dt>Categories</dt><dd>{draft.allowedParentCategoryWeburls.join(", ")}</dd></div>
                  <div><dt>Look</dt><dd>{resolveThemePackage(draft.themeId).name}</dd></div>
                </dl>
                <label className="onboarding-field">
                  <span>Main heading line 1</span>
                  <input
                    value={draft.heroLineOne}
                    placeholder={draft.name || "Acme"}
                    onChange={(event) => updateDraft({ heroLineOne: event.target.value })}
                  />
                </label>
                <label className="onboarding-field">
                  <span>Main description</span>
                  <input
                    value={draft.heroDescription}
                    placeholder="Optional short homepage description"
                    onChange={(event) => updateDraft({ heroDescription: event.target.value })}
                  />
                </label>
              </div>
            ) : null}
          </div>

          {message ? (
            <p className="admin-status" aria-live="polite">
              {message}
            </p>
          ) : null}

          <footer className="onboarding-actions">
            <button
              type="button"
              className="onboarding-button onboarding-button--secondary"
              disabled={isBusy || stepIndex === 0}
              onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
            >
              Back
            </button>
            <button
              type="button"
              className="onboarding-button onboarding-button--primary"
              disabled={isBusy || !canContinue}
              onClick={() =>
                stepIndex === createSteps.length - 1
                  ? void finishCreateTenant()
                  : setStepIndex((current) => Math.min(current + 1, createSteps.length - 1))
              }
            >
              {stepIndex === createSteps.length - 1 ? (isBusy ? "Creating..." : "Create partner") : "Continue"}
              <ArrowRightIcon />
            </button>
          </footer>
        </section>
      </section>
    </main>
  );
}

function getStepTitle(stepIndex: number) {
  switch (stepIndex) {
    case 0:
      return "Name the partner.";
    case 1:
      return "Choose their categories.";
    case 2:
      return "Choose what they can use.";
    case 3:
      return "Pick the site look.";
    default:
      return "Review and create.";
  }
}
