import { useMemo } from "react";
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

export default function PublicThemeFooter({ partnerSlug }: Props) {
  const activeTheme = useActiveThemePackage();
  const content = useCmsContent(activeTheme.landing, "landing");

  const brandLogo = useMemo(() => {
    if ("logo" in content.brand && typeof content.brand.logo === "string" && content.brand.logo) {
      return content.brand.logo;
    }

    return activeTheme.assets.miniLogo || activeTheme.assets.logo;
  }, [activeTheme.assets.logo, activeTheme.assets.miniLogo, content.brand]);

  return (
    <footer className="public-theme-footer">
      <div className="public-theme-footer__inner page">
        <div className="public-theme-footer__grid">
          <div className="public-theme-footer__brand">
            <a href={withPartnerPath("/home", partnerSlug)} aria-label={content.brand.logoAlt}>
              {brandLogo ? <img src={brandLogo} alt={content.brand.logoAlt} /> : <span>{content.brand.name}</span>}
            </a>
            <p>{content.footer.description}</p>
          </div>

          {content.footer.columns.map((column) => (
            <div key={column.title}>
              <h2>{column.title}</h2>
              {column.links.map((link) => (
                <a key={link} href="#">
                  {link}
                </a>
              ))}
            </div>
          ))}

          <div>
            <h2>{content.footer.newsletter.title}</h2>
            <p>{content.footer.newsletter.description}</p>
            <form className="public-theme-footer__form">
              <input
                type="email"
                placeholder={content.footer.newsletter.placeholder}
                aria-label="Email address"
              />
              <button type="button">{content.footer.newsletter.buttonLabel}</button>
            </form>
          </div>
        </div>

        <div className="public-theme-footer__bottom">
          <span>{content.footer.copyright}</span>
          <span>
            {content.footer.legalLinks.map((link, index) => (
              <a key={link} href="#">
                {link}
                {index < content.footer.legalLinks.length - 1 ? <i aria-hidden="true">•</i> : null}
              </a>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
