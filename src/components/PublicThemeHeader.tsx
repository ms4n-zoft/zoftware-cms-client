import { useMemo, useState } from "react";
import { useCmsContent } from "../lib/useCmsContent";
import { useActiveThemePackage } from "../lib/useActiveThemePackage";

type Props = {
  partnerSlug?: string;
};

function withPartnerPath(href: string, partnerSlug?: string) {
  if (!partnerSlug || !href.startsWith("/") || href.startsWith("//")) {
    return href;
  }

  if (href === "/home" || href === "/") {
    return `/${partnerSlug}`;
  }

  return `/${partnerSlug}${href}`;
}

export default function PublicThemeHeader({ partnerSlug }: Props) {
  const activeTheme = useActiveThemePackage();
  const content = useCmsContent(activeTheme.landing, "landing");
  const [menuOpen, setMenuOpen] = useState(false);

  const brandLogo = useMemo(() => {
    if ("logo" in content.brand && typeof content.brand.logo === "string" && content.brand.logo) {
      return content.brand.logo;
    }

    return activeTheme.assets.logo;
  }, [activeTheme.assets.logo, content.brand]);

  return (
    <header className="public-theme-header">
      <div className="public-theme-header__inner page">
        <a
          href={withPartnerPath("/home", partnerSlug)}
          className="public-theme-header__brand"
          aria-label={content.brand.logoAlt}
        >
          {brandLogo ? <img src={brandLogo} alt={content.brand.logoAlt} /> : <span>{content.brand.name}</span>}
        </a>

        <button
          type="button"
          className="public-theme-header__menu"
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`public-theme-header__nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <div className="public-theme-header__links">
            {content.navigation.items.map((item) => (
              <a key={item.label} href={withPartnerPath(item.href, partnerSlug)}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="public-theme-header__actions">
            <a
              href={withPartnerPath(content.navigation.signInHref, partnerSlug)}
              className="theme-button-link theme-button-link--ghost"
            >
              {content.navigation.signInLabel}
            </a>
            <a
              href={withPartnerPath(content.navigation.primaryCtaHref, partnerSlug)}
              className="theme-button-link theme-button-link--primary"
            >
              {content.navigation.primaryCtaLabel}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
