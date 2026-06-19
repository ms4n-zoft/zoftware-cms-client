import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  FileIcon,
  SearchIcon,
  SparkIcon,
  TargetIcon,
} from "./icons";
import parentCategories from "../data/catalog/parentCategories.json";
import {
  applyTheme,
  appTheme,
  resolveThemePackage,
  storeThemeId,
  themePackages,
  type ThemePackage,
} from "../lib/themeEngine";
import { storeSiteDraft } from "../lib/contentOverrides";

const ONBOARDING_STORAGE_KEY = "zoftware.vendorOnboarding";

type ServiceId = "smart-search" | "rfp-service" | "ai-chatbot" | "rag-knowledge-base";

type OnboardingState = {
  vendorName: string;
  website: string;
  logoUrl: string;
  logoFileName: string;
  market: string;
  audience: string;
  services: ServiceId[];
  categorySlugs: string[];
  brandName: string;
  themeId: string;
};

const initialState: OnboardingState = {
  vendorName: "",
  website: "",
  logoUrl: "",
  logoFileName: "",
  market: "MENA",
  audience: "Mid-market buyers",
  services: ["smart-search", "rfp-service"],
  categorySlugs: parentCategories.categories.slice(0, 2).map((category) => category.weburl),
  brandName: "",
  themeId: themePackages[0].id,
};

const serviceOptions = [
  {
    id: "smart-search",
    title: "Smart Search",
    description: "Guided software discovery with ranked distributor matches.",
    badge: "Discovery",
    icon: SearchIcon,
  },
  {
    id: "rfp-service",
    title: "RFP Service",
    description: "Buyer requirement capture and RFP generation workflow.",
    badge: "Planning",
    icon: FileIcon,
  },
  {
    id: "ai-chatbot",
    title: "AI Chatbot",
    description: "Conversational assistant for buyers and internal teams.",
    badge: "Assist",
    icon: SparkIcon,
  },
  {
    id: "rag-knowledge-base",
    title: "RAG Knowledge Base",
    description: "Answer engine grounded in uploaded distributor and category knowledge.",
    badge: "Knowledge",
    icon: TargetIcon,
  },
] as const;

const steps = ["Workspace", "Categories", "Services", "Theme Package"] as const;

// The selector always renders as a balanced 2x2 grid. Real packages fill the
// first slots; remaining slots show "coming soon" placeholders.
const MIN_THEME_SLOTS = 4;

export default function OnboardingGate() {
  const [ready, setReady] = useState(false);
  const [restartPromptOpen, setRestartPromptOpen] = useState(false);
  const [state, setState] = useState<OnboardingState>(initialState);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(ONBOARDING_STORAGE_KEY) ?? "null");
      if (saved?.completed) {
        setState((current) => ({
          ...current,
          ...saved,
          themeId: saved.themeId || current.themeId,
        }));
        setRestartPromptOpen(true);
      }
    } catch {
      setState(initialState);
    }

    applyTheme(appTheme);
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="onboarding-loading" aria-label="Loading setup" />;
  }

  return (
    <>
      <OnboardingFlow
        state={state}
        onChange={setState}
        onComplete={(finalState) => {
          const activeTheme = resolveThemePackage(finalState.themeId);
          const brandName = finalState.brandName || finalState.vendorName || activeTheme.landing.brand.name;

          storeThemeId(activeTheme.id);
          applyTheme(activeTheme);
          storeSiteDraft({
            landing: {
              brand: {
                name: brandName,
                ...(finalState.logoUrl ? { logo: finalState.logoUrl } : {}),
                logoAlt: `${brandName} logo`,
              },
            },
          });
          window.localStorage.setItem(
            ONBOARDING_STORAGE_KEY,
            JSON.stringify({ completed: true, completedAt: new Date().toISOString(), ...finalState }),
          );
          window.location.assign("/home");
        }}
      />
      {restartPromptOpen ? (
        <div className="onboarding-alert" role="alertdialog" aria-modal="true" aria-labelledby="onboarding-alert-title">
          <section className="onboarding-alert__panel">
            <h2 id="onboarding-alert-title">Onboarding already completed</h2>
            <p>You can restart setup from scratch or go back to the configured landing page.</p>
            <div>
              <button
                type="button"
                className="onboarding-button onboarding-button--secondary"
                onClick={() => {
                  window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
                  setState(initialState);
                  setRestartPromptOpen(false);
                  applyTheme(appTheme);
                }}
              >
                Restart onboarding
              </button>
              <button
                type="button"
                className="onboarding-button onboarding-button--primary"
                onClick={() => window.location.assign("/home")}
              >
                Go back to home
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function OnboardingFlow({
  state,
  onChange,
  onComplete,
}: {
  state: OnboardingState;
  onChange: (state: OnboardingState) => void;
  onComplete: (state: OnboardingState) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [fullPreviewOpen, setFullPreviewOpen] = useState(false);
  const activeTheme = useMemo(() => resolveThemePackage(state.themeId), [state.themeId]);
  const defaultTheme = appTheme;
  const canContinue =
    stepIndex === 1
      ? state.categorySlugs.length > 0
      : stepIndex === 2
        ? state.services.length > 0
        : true;

  useEffect(() => {
    applyTheme(appTheme);
  }, []);

  function update(patch: Partial<OnboardingState>) {
    onChange({ ...state, ...patch });
  }

  function goNext() {
    if (stepIndex === steps.length - 1) {
      onComplete(state);
      return;
    }

    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  return (
    <main className="onboarding-shell">
      <section className="onboarding-panel" aria-label="Distributor onboarding">
        <aside className="onboarding-sidebar">
          <a href="/" className="onboarding-brand" aria-label="Zoftware onboarding">
            <img src={defaultTheme.assets.miniLogo} alt="" />
            <span>White-label setup</span>
          </a>

          <div className="onboarding-progress">
            {steps.map((label, index) => (
              <button
                type="button"
                key={label}
                className={index === stepIndex ? "is-active" : index < stepIndex ? "is-complete" : ""}
                onClick={() => setStepIndex(index)}
              >
                <span>{index < stepIndex ? <CheckCircleIcon /> : index + 1}</span>
                {label}
              </button>
            ))}
          </div>

        </aside>

        <section className="onboarding-main">
          <div className="onboarding-step-header" key={`header-${stepIndex}`}>
            <p>Step {stepIndex + 1} of {steps.length}</p>
            <h1>{getStepTitle(stepIndex)}</h1>
          </div>

          <div className="onboarding-step-body" key={stepIndex}>
            {stepIndex === 0 && <WorkspaceStep state={state} update={update} />}
            {stepIndex === 1 && <CategoriesStep state={state} update={update} />}
            {stepIndex === 2 && <ServicesStep state={state} update={update} />}
            {stepIndex === 3 && (
              <ThemeStep
                state={state}
                update={update}
                activeTheme={activeTheme}
                onOpenFullPreview={() => setFullPreviewOpen(true)}
              />
            )}
          </div>

          <footer className="onboarding-actions">
            <button
              type="button"
              className="onboarding-button onboarding-button--secondary"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
            >
              Back
            </button>
            <button
              type="button"
              className="onboarding-button onboarding-button--primary"
              disabled={!canContinue}
              onClick={goNext}
            >
              {stepIndex === steps.length - 1 ? "Finish setup" : "Continue"}
              <ArrowRightIcon />
            </button>
          </footer>
        </section>
      </section>

      {fullPreviewOpen ? (
        <div className="full-preview-modal" role="dialog" aria-modal="true" aria-label="Full landing page preview">
          <div className="full-preview-modal__panel">
            <div className="full-preview-modal__bar">
              <span>
                <b>{activeTheme.name}</b>
                Full landing preview
              </span>
              <button type="button" onClick={() => setFullPreviewOpen(false)}>
                Close
              </button>
            </div>
            <iframe
              src={`/home?previewTheme=${encodeURIComponent(state.themeId)}`}
              title={`${activeTheme.name} full landing preview`}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}

function WorkspaceStep({
  state,
  update,
}: {
  state: OnboardingState;
  update: (patch: Partial<OnboardingState>) => void;
}) {
  return (
    <div className="onboarding-grid onboarding-grid--two">
      <label className="onboarding-field">
        <span>Distributor name</span>
        <input
          value={state.vendorName}
          placeholder="Acme Advisory"
          onChange={(event) => update({ vendorName: event.target.value })}
        />
      </label>
      <label className="onboarding-field">
        <span>Website</span>
        <input
          value={state.website}
          placeholder="https://example.com"
          onChange={(event) => update({ website: event.target.value })}
        />
      </label>
      <div className="onboarding-field onboarding-field--wide">
        <span>Logo</span>
        <div className="logo-input-combo">
          <input
            value={state.logoUrl.startsWith("data:") ? "" : state.logoUrl}
            placeholder="https://example.com/logo.svg"
            onChange={(event) => update({ logoUrl: event.target.value, logoFileName: "" })}
          />
          <label className="logo-upload-action">
            {state.logoFileName || "or upload your logo"}
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (!file) {
                  return;
                }

                const reader = new FileReader();
                reader.onload = () => {
                  update({
                    logoUrl: typeof reader.result === "string" ? reader.result : "",
                    logoFileName: file.name,
                  });
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>
      </div>
      <label className="onboarding-field">
        <span>Primary market</span>
        <select value={state.market} onChange={(event) => update({ market: event.target.value })}>
          <option>MENA</option>
          <option>North America</option>
          <option>Europe</option>
          <option>India</option>
          <option>Global</option>
        </select>
      </label>
      <label className="onboarding-field">
        <span>Buyer audience</span>
        <select value={state.audience} onChange={(event) => update({ audience: event.target.value })}>
          <option>Mid-market buyers</option>
          <option>Enterprise procurement teams</option>
          <option>SMB founders</option>
          <option>Technology consultants</option>
        </select>
      </label>
    </div>
  );
}

function ServicesStep({
  state,
  update,
}: {
  state: OnboardingState;
  update: (patch: Partial<OnboardingState>) => void;
}) {
  return (
    <div className="option-grid">
      {serviceOptions.map((service) => {
        const Icon = service.icon;
        const selected = state.services.includes(service.id);
        return (
          <button
            type="button"
            key={service.id}
            className={`selection-card ${selected ? "is-selected" : ""}`}
            onClick={() =>
              update({
                services: selected
                  ? state.services.filter((id) => id !== service.id)
                  : [...state.services, service.id],
              })
            }
          >
            <span className="selection-card__icon">
              <Icon />
            </span>
            <span>
              <em>{service.badge}</em>
              <strong>{service.title}</strong>
              <small>{service.description}</small>
            </span>
            <i>{selected ? <CheckCircleIcon /> : null}</i>
          </button>
        );
      })}
    </div>
  );
}

function CategoriesStep({
  state,
  update,
}: {
  state: OnboardingState;
  update: (patch: Partial<OnboardingState>) => void;
}) {
  return (
    <div className="category-select-grid">
      {parentCategories.categories.map((category) => {
        const selected = state.categorySlugs.includes(category.weburl);
        return (
          <button
            type="button"
            key={category.weburl}
            className={`category-select-card ${selected ? "is-selected" : ""}`}
            onClick={() =>
              update({
                categorySlugs: selected
                  ? state.categorySlugs.filter((slug) => slug !== category.weburl)
                  : [...state.categorySlugs, category.weburl],
              })
            }
          >
            <span>
              <strong>{category.name}</strong>
              <small>{category.subcategory_count} subcategories</small>
            </span>
            {selected ? <i><CheckCircleIcon /></i> : null}
          </button>
        );
      })}
    </div>
  );
}

function ThemeStep({
  state,
  update,
  activeTheme,
  onOpenFullPreview,
}: {
  state: OnboardingState;
  update: (patch: Partial<OnboardingState>) => void;
  activeTheme: ThemePackage;
  onOpenFullPreview: () => void;
}) {
  const placeholderCount = Math.max(0, MIN_THEME_SLOTS - themePackages.length);

  return (
    <div className="theme-layout-grid">
      <section>
        <p className="theme-step-intro">
          One bundle: layout, colors, typography, and content direction. Pick a package to
          style the public landing experience.
        </p>
        <div className="theme-pkg-grid" role="radiogroup" aria-label="Theme package">
          {themePackages.map((theme) => {
            const selected = state.themeId === theme.id;
            return (
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                key={theme.id}
                className={`theme-pkg-card ${selected ? "is-selected" : ""}`}
                onClick={() => update({ themeId: theme.id })}
              >
                <span className="theme-pkg-card__head">
                  <img src={theme.assets.logo} alt="" />
                  <span className="theme-pkg-card__check" aria-hidden="true">
                    <CheckCircleIcon />
                  </span>
                </span>
                <strong className="theme-pkg-card__name">{theme.name}</strong>
                <span className="theme-pkg-card__desc">{theme.description}</span>
                <span className="theme-pkg-card__swatches" aria-hidden="true">
                  {getThemeSwatches(theme).map((color, index) => (
                    <i key={index} style={{ background: color }} />
                  ))}
                </span>
                <span className="theme-pkg-card__tags">
                  <span className="theme-pkg-card__cue">{theme.typography.headingLabel}</span>
                  <span className="theme-pkg-card__char">{theme.character}</span>
                </span>
                <span className="theme-pkg-card__status">
                  {selected ? "Selected package" : "Select package"}
                </span>
              </button>
            );
          })}
          {Array.from({ length: placeholderCount }).map((_, index) => (
            <div
              key={`theme-placeholder-${index}`}
              className="theme-pkg-card theme-pkg-card--empty"
              aria-hidden="true"
            >
              <span className="theme-pkg-card__empty-mark">+</span>
              <span className="theme-pkg-card__empty-text">More theme packages coming soon</span>
            </div>
          ))}
        </div>
      </section>

      <section className="theme-hero-preview" style={themePreviewStyle(activeTheme)}>
        <div className="theme-hero-preview__top">
          <span>Preview</span>
          <button type="button" onClick={onOpenFullPreview}>
            Show full preview
          </button>
        </div>
        <div className="theme-hero-preview__hero">
          <div className="theme-hero-preview__canvas">
            <div className="theme-hero-preview__masthead">
              <img src={activeTheme.assets.logo} alt="" />
              <span>{activeTheme.landing.hero.eyebrow}</span>
            </div>
            <div className="theme-hero-preview__copy">
              <small>Display typography</small>
              <h2>{state.brandName || state.vendorName || activeTheme.landing.brand.name}</h2>
              <p>{activeTheme.landing.hero.description}</p>
              <div className="theme-hero-preview__actions">
                <span>{activeTheme.landing.navigation.primaryCtaLabel}</span>
                <span>{activeTheme.landing.navigation.signInLabel}</span>
              </div>
            </div>
          </div>
          <aside className="theme-hero-preview__sidebar">
            <div className="theme-hero-preview__sidebar-block">
              <small>Theme name</small>
              <strong>{activeTheme.name}</strong>
            </div>
            <div className="theme-hero-preview__sidebar-block">
              <small>Display face</small>
              <p className="theme-hero-preview__type-sample">{activeTheme.typography.headingLabel}</p>
            </div>
            <div className="theme-hero-preview__sidebar-block">
              <small>Core palette</small>
              <div className="theme-hero-preview__palette">
                <i style={{ background: activeTheme.colors.background }} />
                <i style={{ background: activeTheme.colors.brand }} />
                <i style={{ background: activeTheme.colors.brandDark }} />
                <i style={{ background: activeTheme.colors.panelSoft }} />
              </div>
            </div>
            <div className="theme-hero-preview__sidebar-block">
              <small>Body voice</small>
              <p>Clear, high-contrast copy with a bundled landing structure and distinct visual tone.</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function themePreviewStyle(theme: ThemePackage) {
  return {
    "--preview-background": theme.colors.background,
    "--preview-text": theme.colors.text,
    "--preview-muted": theme.colors.mutedText,
    "--preview-soft": theme.colors.panelSoft,
    "--preview-panel": theme.colors.panel,
    "--preview-brand": theme.colors.brand,
    "--preview-brand-soft": theme.colors.brandSoft,
    "--preview-border": theme.colors.border,
    "--preview-heading": theme.typography.heading,
    "--preview-body": theme.typography.body,
    "--preview-radius": theme.layout.radius.card,
  } as CSSProperties;
}

function getStepTitle(stepIndex: number) {
  if (stepIndex === 0) {
    return "Create the distributor workspace.";
  }

  if (stepIndex === 1) {
    return "Choose parent software categories for the directory.";
  }

  if (stepIndex === 2) {
    return "Select the services this white-label solution should include.";
  }

  return "Choose the theme package.";
}

function getThemeSwatches(theme: ThemePackage) {
  return [
    theme.colors.background,
    theme.colors.panelSoft,
    theme.colors.brand,
    theme.colors.brandDark,
    theme.colors.text,
  ];
}
