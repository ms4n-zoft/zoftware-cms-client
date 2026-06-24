import { useEffect, useMemo, useState } from "react";
import VioletAtlasLanding from "./VioletAtlasLanding";
import type { CatalogCategory, CatalogProduct } from "../lib/catalog";
import {
  buildLandingCategories,
  buildLandingCategoryLinks,
  productsToLandingItems,
  type LandingCategoryLink,
  type LandingSoftwareItem,
} from "../lib/landingCatalog";
import { useActiveThemePackage } from "../lib/useActiveThemePackage";
import { useCmsContent } from "../lib/useCmsContent";
import type { ThemePackage } from "../lib/themeEngine";

type Props = {
  partnerSlug: string;
  parentCategories: CatalogCategory[];
  featuredProducts: CatalogProduct[];
};

type LandingContent = ThemePackage["landing"];

export default function LandingExperience({
  partnerSlug,
  parentCategories,
  featuredProducts,
}: Props) {
  const activeTheme = useActiveThemePackage();
  const content = useCmsContent(activeTheme.landing, "landing");
  const backendCategories = useMemo(() => buildLandingCategories(parentCategories), [parentCategories]);
  const categoryLinks = useMemo(() => buildLandingCategoryLinks(parentCategories), [parentCategories]);
  const backendSoftware = useMemo(() => productsToLandingItems(featuredProducts), [featuredProducts]);
  const softwareItems = backendSoftware.length > 0
    ? backendSoftware
    : (content.catalog.items as LandingSoftwareItem[]);
  const catalogCategories = backendCategories.length > 1 ? backendCategories : content.catalog.categories;
  const contentForLanding = useMemo(
    () => buildLandingContent(content, softwareItems, catalogCategories),
    [content, softwareItems, catalogCategories],
  );

  const [activeCategory, setActiveCategory] = useState(catalogCategories[0] ?? "All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!catalogCategories.includes(activeCategory)) {
      setActiveCategory(catalogCategories[0] ?? "All");
    }
  }, [activeCategory, catalogCategories]);

  const filteredSoftware = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return softwareItems.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category.includes(activeCategory);
      const matchesQuery =
        !query ||
        [item.name, item.category, item.company, item.description]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery, softwareItems]);

  if (activeTheme.id === "violet-atlas") {
    return (
      <VioletAtlasLanding
        activeTheme={activeTheme}
        content={contentForLanding}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        setActiveCategory={setActiveCategory}
        setSearchQuery={setSearchQuery}
        filteredSoftware={filteredSoftware}
        catalogCategories={catalogCategories}
        categoryLinks={categoryLinks}
        partnerSlug={partnerSlug}
      />
    );
  }

  const brandLogo = resolveBrandLogo(contentForLanding.brand, activeTheme);
  const brandName = contentForLanding.brand.name || activeTheme.name;
  const heroRecommendations = softwareItems.slice(0, 3);
  const browseLinks = categoryLinks.slice(0, 12);

  return (
    <div className="min-h-screen bg-white font-manrope text-[#0A0A0A]">
      <div className="bg-[#0A0A0A] py-2.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="font-syne text-sm font-semibold tracking-tight text-white" data-cms-path="landing.announcement.text">
              {contentForLanding.announcement.text}
            </span>
            <a
              href={withPartnerPath(contentForLanding.announcement.linkHref, partnerSlug)}
              className="font-syne text-sm font-semibold text-[#FF5C35] underline"
              data-cms-path="landing.announcement.linkLabel"
            >
              {contentForLanding.announcement.linkLabel}
            </a>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-50 border-b-2 border-[#0A0A0A] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between gap-6">
            <div className="flex min-w-0 items-center gap-8 lg:gap-12">
              <a href={`/${partnerSlug}`} aria-label={contentForLanding.brand.logoAlt}>
                {brandLogo}
              </a>
              <div className="hidden items-center gap-6 md:flex lg:gap-8">
                {contentForLanding.navigation.items.map((item) => (
                  <a
                    key={item.label}
                    href={withPartnerPath(item.href, partnerSlug)}
                    className="whitespace-nowrap font-manrope text-sm font-semibold text-[#0A0A0A] transition-colors hover:text-[#FF5C35]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 lg:gap-6">
              <a
                href={withPartnerPath(contentForLanding.navigation.signInHref, partnerSlug)}
                className="hidden font-manrope text-sm font-semibold text-[#0A0A0A] sm:block"
                data-cms-path="landing.navigation.signInLabel"
              >
                {contentForLanding.navigation.signInLabel}
              </a>
              <a
                href={withPartnerPath(contentForLanding.navigation.primaryCtaHref, partnerSlug)}
                className="whitespace-nowrap border-2 border-[#0A0A0A] bg-[#0A0A0A] px-5 py-2.5 font-manrope text-sm font-semibold text-white transition-colors hover:border-[#FF5C35] hover:bg-[#FF5C35]"
                data-cms-path="landing.navigation.primaryCtaLabel"
              >
                {contentForLanding.navigation.primaryCtaLabel}
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section className="overflow-hidden border-b-2 border-[#E5E5E5] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
            <div className="relative min-w-0 flex-1">
              <div className="pointer-events-none absolute -left-4 -top-8 select-none font-syne text-[120px] font-normal leading-none text-[#F0F0F0] lg:text-[180px]">
                01
              </div>
              <div className="relative">
                <div className="mb-6 flex items-center gap-3">
                  <div className="h-0.5 w-8 bg-[#FF5C35]" />
                  <span className="font-syne text-xs uppercase tracking-[2.4px] text-[#737373]" data-cms-path="landing.hero.eyebrow">
                    {contentForLanding.hero.eyebrow}
                  </span>
                </div>
                <h1 className="mb-8 font-syne text-4xl font-normal uppercase leading-none tracking-tight text-[#0A0A0A] sm:text-5xl lg:text-[72px]">
                  {contentForLanding.hero.headlineLines.map((line, index) => (
                    <span key={`${line}-${index}`} className="block" data-cms-path={`landing.hero.headlineLines.${index}`}>
                      {line}
                    </span>
                  ))}
                </h1>
                <p
                  className="mb-10 max-w-xl font-manrope text-lg font-semibold leading-relaxed text-[#737373] sm:text-xl"
                  data-cms-path="landing.hero.description"
                >
                  {contentForLanding.hero.description}
                </p>

                <div className="mb-12 flex max-w-2xl border-2 border-[#0A0A0A]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={contentForLanding.hero.searchPlaceholder}
                    className="min-w-0 flex-1 border-none bg-white px-6 py-4 font-manrope text-base font-semibold text-[#0A0A0A] outline-none placeholder:text-[#AAAAAA]"
                    data-cms-path="landing.hero.searchPlaceholder"
                  />
                  <button
                    type="button"
                    className="whitespace-nowrap border-l-2 border-[#0A0A0A] bg-[#FF5C35] px-8 py-4 font-syne text-sm uppercase tracking-wide text-white transition-colors hover:bg-[#E84E27]"
                    data-cms-path="landing.hero.searchButtonLabel"
                  >
                    {contentForLanding.hero.searchButtonLabel}
                  </button>
                </div>

                <div className="flex flex-col gap-8 border-t-2 border-[#E5E5E5] pt-8 sm:flex-row sm:gap-0">
                  {contentForLanding.hero.stats.map((stat, index) => (
                    <div
                      key={`${stat.value}-${stat.label}`}
                      className={[
                        "flex-1",
                        index < contentForLanding.hero.stats.length - 1 ? "sm:border-r-2 sm:border-[#E5E5E5] sm:pr-8" : "",
                        index > 0 ? "sm:pl-8" : "",
                      ].join(" ")}
                    >
                      <div className="mb-1 font-syne text-3xl font-normal text-[#0A0A0A] lg:text-4xl" data-cms-path={`landing.hero.stats.${index}.value`}>
                        {stat.value}
                      </div>
                      <div className="font-manrope text-sm font-semibold text-[#737373]" data-cms-path={`landing.hero.stats.${index}.label`}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full flex-shrink-0 lg:w-[460px] xl:w-[520px]">
              <div className="border-2 border-[#222] bg-[#0A0A0A] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="font-syne text-xs uppercase tracking-[1.2px] text-[#FF5C35]">
                    {contentForLanding.hero.recommendationsEyebrow}
                  </div>
                  <div className="size-2 rounded-full bg-[#FF5C35]" />
                </div>
                <div className="mb-6 font-syne text-lg uppercase text-white">
                  {contentForLanding.hero.recommendationsTitle}
                </div>
                <div className="flex flex-col gap-3">
                  {heroRecommendations.map((item) => (
                    <a
                      key={item.name}
                      href={getProductHref(item, partnerSlug)}
                      className="flex items-center gap-4 border border-[#333] bg-[#161616] p-4 transition-colors hover:border-[#FF5C35]"
                    >
                      <div className="flex size-10 flex-shrink-0 items-center justify-center border border-[#333] bg-[#222]">
                        <span className="font-syne text-xs text-[#737373]">{item.abbr || item.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-syne text-sm text-white">{item.name}</div>
                        <div className="font-manrope text-xs text-[#FF5C35]">{item.category}</div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="font-syne text-lg text-[#FF5C35]">{getMatchScore(item)}%</div>
                        <div className="font-manrope text-xs text-[#555]">match</div>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="mt-4 border-t border-[#222] pt-4">
                  <div className="mb-3 font-manrope text-xs text-[#555]">{contentForLanding.hero.recommendationsFilterLabel}</div>
                  <a
                    href="#software-catalog"
                    className="block w-full bg-[#FF5C35] py-3 text-center font-syne text-sm uppercase tracking-wide text-white transition-colors hover:bg-[#E84E27]"
                  >
                    {contentForLanding.hero.recommendationsCtaLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-[#E5E5E5] bg-white py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto">
            <span
              className="whitespace-nowrap font-syne text-xs uppercase tracking-[1.2px] text-[#737373]"
              data-cms-path="landing.trustedBy.label"
            >
              {contentForLanding.trustedBy.label}
            </span>
            {contentForLanding.trustedBy.items.map((item) => (
              <span key={item} className="whitespace-nowrap font-manrope text-sm font-semibold text-[#AAAAAA]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b-2 border-[#E5E5E5] bg-white py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionNumber value="02" />
          <SectionEyebrow cmsPath="landing.aiTools.eyebrow">{contentForLanding.aiTools.eyebrow}</SectionEyebrow>
          <h2 className="mb-12 font-syne text-3xl font-normal uppercase leading-tight text-[#0A0A0A] sm:text-4xl lg:text-5xl">
            {contentForLanding.aiTools.headingLines.map((line, index) => (
              <span key={`${line}-${index}`} className="block" data-cms-path={`landing.aiTools.headingLines.${index}`}>
                {line}
              </span>
            ))}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {contentForLanding.aiTools.items.map((tool) => (
              <article
                key={tool.number}
                className="group relative flex flex-col gap-3 border-2 border-[#0A0A0A] bg-white p-8 transition-colors hover:border-[#FF5C35]"
              >
                <div className="flex size-12 items-center justify-center border-2 border-[#FF5C35]">
                  <ToolIcon icon={tool.icon} />
                </div>
                <h3
                  className="mt-3 font-syne text-xl uppercase text-[#0A0A0A]"
                  data-cms-path={tool.number === "01" ? "landing.aiTools.items.0.title" : undefined}
                >
                  {tool.title}
                </h3>
                <p
                  className="font-manrope text-sm font-semibold leading-relaxed text-[#737373]"
                  data-cms-path={tool.number === "01" ? "landing.aiTools.items.0.description" : undefined}
                >
                  {tool.description}
                </p>
                <a href="#software-catalog" className="mt-2 inline-flex items-center gap-2 font-manrope text-sm font-semibold text-[#FF5C35]">
                  {contentForLanding.aiTools.ctaLabel}
                  <ArrowRightIcon />
                </a>
                <div className="pointer-events-none absolute bottom-6 right-6 select-none font-syne text-4xl text-[#F0F0F0]">
                  {tool.number}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="software-catalog" className="overflow-hidden border-b-2 border-[#E5E5E5] bg-[#F7F7F7] py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionNumber value="03" muted />
          <SectionEyebrow cmsPath="landing.catalog.eyebrow">{contentForLanding.catalog.eyebrow}</SectionEyebrow>
          <h2
            className="mb-8 font-syne text-3xl font-normal uppercase leading-tight text-[#0A0A0A] sm:text-4xl lg:text-5xl"
            data-cms-path="landing.catalog.heading"
          >
            {contentForLanding.catalog.heading}
          </h2>

          <div className="mb-8 flex flex-wrap gap-2">
            {catalogCategories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setActiveCategory(category)}
                className={
                  activeCategory === category
                    ? "border-2 border-[#0A0A0A] bg-[#0A0A0A] px-5 py-2.5 font-syne text-xs uppercase tracking-wide text-white transition-colors"
                    : "border-2 border-[#0A0A0A] bg-white px-5 py-2.5 font-syne text-xs uppercase tracking-wide text-[#0A0A0A] transition-colors hover:bg-[#0A0A0A] hover:text-white"
                }
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSoftware.map((software) => (
              <article
                key={`${software.name}-${software.weburl || software.category}`}
                className="flex min-h-[310px] flex-col gap-3 border border-[#0A0A0A] bg-white p-6 transition-colors hover:border-[#FF5C35]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-14 flex-shrink-0 items-center justify-center border border-[#E5E5E5] bg-[#F0F0F0]">
                    <span className="font-syne text-sm text-[#737373]">{software.abbr || software.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="font-syne text-lg leading-snug text-[#0A0A0A]">{software.name}</div>
                    <a
                      href={getCategoryHref(software, categoryLinks, partnerSlug)}
                      className="mt-1 inline-block bg-[#FFF0EC] px-2 py-0.5"
                    >
                      <span className="font-manrope text-xs font-semibold text-[#FF5C35]">{software.category}</span>
                    </a>
                  </div>
                </div>
                <StarRating rating={software.rating} />
                <p className="line-clamp-3 font-manrope text-[13px] font-semibold leading-relaxed text-[#737373]">
                  {software.description}
                </p>
                <div className={resolveTierClassName(software)}>
                  <span className={resolveTierTextClassName(software)}>{software.tier}</span>
                </div>
                <div className="mt-auto flex gap-2 pt-1">
                  <a
                    href={getProductHref(software, partnerSlug)}
                    className="flex-1 border-2 border-[#0A0A0A] bg-[#0A0A0A] py-2.5 text-center font-syne text-xs uppercase tracking-wide text-white transition-colors hover:border-[#FF5C35] hover:bg-[#FF5C35]"
                    data-cms-path="landing.catalog.primaryActionLabel"
                  >
                    {contentForLanding.catalog.primaryActionLabel}
                  </a>
                  <a
                    href={getCompareHref(software, partnerSlug)}
                    className="flex-1 border-2 border-[#0A0A0A] bg-white py-2.5 text-center font-syne text-xs uppercase tracking-wide text-[#0A0A0A] transition-colors hover:bg-[#F0F0F0]"
                    data-cms-path="landing.catalog.secondaryActionLabel"
                  >
                    {contentForLanding.catalog.secondaryActionLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b-2 border-[#222] bg-[#0A0A0A] py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative grid grid-cols-2 gap-0 lg:grid-cols-4">
            {contentForLanding.impactStats.map((stat, index) => (
              <div
                key={`${stat.value}-${stat.label}`}
                className={`flex flex-col gap-3 px-8 py-8 ${index < contentForLanding.impactStats.length - 1 ? "lg:border-r lg:border-[#333]" : ""}`}
              >
                <div className="font-syne text-5xl font-normal leading-none text-white lg:text-6xl">{stat.value}</div>
                <div className="h-0.5 w-8 bg-[#FF5C35]" />
                <div className="font-manrope text-base font-semibold text-[#888]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b-2 border-[#E5E5E5] bg-white py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionNumber value="04" />
          <SectionEyebrow cmsPath="landing.process.eyebrow">{contentForLanding.process.eyebrow}</SectionEyebrow>
          <h2
            className="mb-12 font-syne text-3xl font-normal uppercase leading-tight text-[#0A0A0A] sm:text-4xl lg:text-5xl"
            data-cms-path="landing.process.heading"
          >
            {contentForLanding.process.heading}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {contentForLanding.process.steps.map((step, index) => (
              <article key={step.number} className="flex flex-col items-center text-center">
                <div className="mb-6 flex size-12 items-center justify-center bg-[#FF5C35]">
                  <span className="font-syne text-base text-white">{step.number}</span>
                </div>
                <h3
                  className="mb-3 font-syne text-lg uppercase text-[#0A0A0A]"
                  data-cms-path={index === 0 ? "landing.process.steps.0.title" : undefined}
                >
                  {step.title}
                </h3>
                <p
                  className="font-manrope text-sm font-semibold leading-relaxed text-[#737373]"
                  data-cms-path={index === 0 ? "landing.process.steps.0.description" : undefined}
                >
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b-2 border-[#E5E5E5] bg-[#F7F7F7] py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionNumber value="05" muted />
          <SectionEyebrow>{contentForLanding.browseCategories.eyebrow}</SectionEyebrow>
          <h2
            className="mb-10 font-syne text-3xl font-normal uppercase leading-tight text-[#0A0A0A] sm:text-4xl lg:text-5xl"
            data-cms-path="landing.browseCategories.heading"
          >
            {contentForLanding.browseCategories.heading}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {browseLinks.map((category) => (
              <a
                key={category.weburl}
                href={`/${partnerSlug}/category/p/${category.weburl}`}
                className="min-h-[130px] border border-[#0A0A0A] bg-white p-5 transition-colors hover:border-[#FF5C35]"
              >
                <span className="font-syne text-lg uppercase text-[#0A0A0A]">{category.name}</span>
                <span className="mt-3 block line-clamp-3 font-manrope text-sm font-semibold leading-relaxed text-[#737373]">
                  {category.description || `Explore ${category.name} software for ${brandName}.`}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b-2 border-[#E5E5E5] bg-white py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionNumber value="06" />
          <div className="relative flex flex-col items-start gap-16 lg:flex-row">
            <div className="min-w-0 flex-1">
              <SectionEyebrow cmsPath="landing.whyChoose.eyebrow">{contentForLanding.whyChoose.eyebrow}</SectionEyebrow>
              <h2 className="mb-8 font-syne text-3xl font-normal uppercase leading-tight text-[#0A0A0A] sm:text-4xl lg:text-[42px]">
                {contentForLanding.whyChoose.headingLines.map((line, index) => (
                  <span key={`${line}-${index}`} className="block" data-cms-path={`landing.whyChoose.headingLines.${index}`}>
                    {line}
                  </span>
                ))}
              </h2>
              <div className="divide-y divide-[#E5E5E5]">
                {contentForLanding.whyChoose.items.map((item) => (
                  <div key={item.title} className="flex gap-4 py-5">
                    <div className="mt-1 h-4 w-4 flex-shrink-0 bg-[#FF5C35]" />
                    <div>
                      <span className="font-syne text-base text-[#0A0A0A]">{item.title}</span>
                      <span className="font-manrope text-base font-semibold text-[#737373]"> - {item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-shrink-0 gap-0 border border-[#E5E5E5] lg:w-[500px]">
              <ComparisonPanel label={contentForLanding.whyChoose.beforeLabel} items={contentForLanding.whyChoose.beforeItems} tone="light" />
              <ComparisonPanel label={contentForLanding.whyChoose.afterLabel} items={contentForLanding.whyChoose.afterItems} tone="dark" />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b-2 border-[#E5E5E5] bg-[#F7F7F7] py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionNumber value="07" muted />
          <SectionEyebrow>{contentForLanding.testimonials.eyebrow}</SectionEyebrow>
          <h2
            className="mb-10 font-syne text-3xl font-normal uppercase leading-tight text-[#0A0A0A] sm:text-4xl lg:text-5xl"
            data-cms-path="landing.testimonials.heading"
          >
            {contentForLanding.testimonials.heading}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contentForLanding.testimonials.items.map((item) => (
              <article key={item.name} className="flex flex-col gap-6 border border-[#FF5C35]/30 border-t-4 border-t-[#FF5C35] bg-white p-8">
                <div className="font-syne text-5xl leading-none text-[#FF5C35]">"</div>
                <p className="flex-1 font-manrope text-[15px] font-semibold leading-relaxed text-[#444]">"{item.quote}"</p>
                <div className="flex items-center gap-4 border-t border-[#E5E5E5] pt-6">
                  <img src={item.avatar} alt={item.name} className="size-12 rounded-full object-cover" />
                  <div>
                    <div className="font-syne text-sm text-[#0A0A0A]">{item.name}</div>
                    <div className="font-manrope text-xs font-semibold text-[#737373]">{item.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b-2 border-[#222] bg-[#0A0A0A] py-24 lg:py-32">
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 font-syne text-4xl font-normal uppercase leading-tight text-white sm:text-5xl lg:text-[64px]">
            {contentForLanding.cta.headlineLines.map((line, index) => (
              <span key={`${line}-${index}`} className="block" data-cms-path={`landing.cta.headlineLines.${index}`}>
                {line}
              </span>
            ))}
          </h2>
          <p className="mb-10 font-manrope text-lg font-semibold text-[#888]" data-cms-path="landing.cta.description">
            {contentForLanding.cta.description}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={withPartnerPath(contentForLanding.cta.primaryHref, partnerSlug)}
              className="w-full border-2 border-[#FF5C35] bg-[#FF5C35] px-10 py-4 font-syne text-sm uppercase tracking-wide text-[#0A0A0A] transition-colors hover:bg-[#E84E27] hover:text-white sm:w-auto"
              data-cms-path="landing.cta.primaryLabel"
            >
              {contentForLanding.cta.primaryLabel}
            </a>
            <a
              href={withPartnerPath(contentForLanding.cta.secondaryHref, partnerSlug)}
              className="w-full border-2 border-white bg-transparent px-10 py-4 font-syne text-sm uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-[#0A0A0A] sm:w-auto"
              data-cms-path="landing.cta.secondaryLabel"
            >
              {contentForLanding.cta.secondaryLabel}
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-[#0A0A0A] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-4">{brandLogo}</div>
              <p
                className="mb-5 font-manrope text-sm font-semibold leading-relaxed text-[#737373]"
                data-cms-path="landing.footer.description"
              >
                {contentForLanding.footer.description}
              </p>
            </div>

            {contentForLanding.footer.columns.map((column) => (
              <div key={column.title}>
                <div className="mb-5 border-b border-[#E5E5E5] pb-3 font-syne text-xs uppercase tracking-[1.2px] text-[#0A0A0A]">
                  {column.title}
                </div>
                <div className="space-y-3">
                  {column.links.map((link) => (
                    <a key={link} href="#" className="block font-manrope text-sm font-semibold text-[#737373] transition-colors hover:text-[#0A0A0A]">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <div
                className="mb-5 border-b border-[#E5E5E5] pb-3 font-syne text-xs uppercase tracking-[1.2px] text-[#0A0A0A]"
                data-cms-path="landing.footer.newsletter.title"
              >
                {contentForLanding.footer.newsletter.title}
              </div>
              <p className="mb-4 font-manrope text-sm font-semibold text-[#737373]">
                {contentForLanding.footer.newsletter.description}
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder={contentForLanding.footer.newsletter.placeholder}
                  className="w-full border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-3 font-manrope text-sm font-semibold text-[#0A0A0A] outline-none transition-colors placeholder:text-[#AAAAAA] focus:border-[#0A0A0A]"
                />
                <button
                  type="button"
                  className="w-full border-2 border-[#0A0A0A] bg-[#0A0A0A] py-3 font-syne text-xs uppercase tracking-wide text-white transition-colors hover:border-[#FF5C35] hover:bg-[#FF5C35]"
                >
                  {contentForLanding.footer.newsletter.buttonLabel}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 border-t-2 border-[#0A0A0A] pt-8 sm:flex-row sm:items-center">
            <span className="font-manrope text-sm font-semibold text-[#737373]" data-cms-path="landing.footer.copyright">
              {contentForLanding.footer.copyright}
            </span>
            <div className="flex flex-wrap items-center gap-6">
              {contentForLanding.footer.legalLinks.map((link) => (
                <a key={link} href="#" className="font-manrope text-sm font-semibold text-[#737373] transition-colors hover:text-[#0A0A0A]">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function buildLandingContent(
  content: LandingContent,
  softwareItems: LandingSoftwareItem[],
  catalogCategories: string[],
): LandingContent {
  const recommendations = softwareItems.slice(0, 3).map((item) => ({
    name: item.name,
    category: item.category,
    score: getMatchScore(item),
    rating: item.rating,
  }));

  return {
    ...content,
    catalog: {
      ...content.catalog,
      categories: catalogCategories,
      items: softwareItems,
    },
    hero: {
      ...content.hero,
      recommendations: recommendations.length > 0 ? recommendations : content.hero.recommendations,
    },
  } as LandingContent;
}

function withPartnerPath(href: string, partnerSlug: string) {
  if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("//")) {
    return href;
  }

  if (href === `/${partnerSlug}` || href.startsWith(`/${partnerSlug}/`)) {
    return href;
  }

  if (href === "/" || href === "/home") {
    return `/${partnerSlug}`;
  }

  return `/${partnerSlug}${href}`;
}

function resolveBrandLogo(
  brand: LandingContent["brand"] & { logo?: string },
  theme: ThemePackage,
) {
  if (brand.logo) {
    return <img src={brand.logo} alt={brand.logoAlt || theme.landing.brand.logoAlt} className="h-7 w-auto" />;
  }

  if (brand.name && brand.name !== theme.landing.brand.name) {
    return <span className="font-syne text-2xl uppercase text-[#0A0A0A]">{brand.name}</span>;
  }

  return <img src={theme.assets.logo} alt={brand.logoAlt || theme.landing.brand.logoAlt} className="h-7 w-auto" />;
}

function getProductHref(item: LandingSoftwareItem, partnerSlug: string) {
  return item.weburl ? `/${partnerSlug}/products/${item.weburl}/overview` : "#software-catalog";
}

function getCompareHref(item: LandingSoftwareItem, partnerSlug: string) {
  return item.weburl ? `/${partnerSlug}/compare/product?products=${item.weburl}` : "#software-catalog";
}

function getCategoryHref(
  item: LandingSoftwareItem,
  categoryLinks: LandingCategoryLink[],
  partnerSlug: string,
) {
  const categoryWeburl = item.categoryWeburl || categoryLinks.find((category) => category.name === item.category)?.weburl;
  return categoryWeburl ? `/${partnerSlug}/category/p/${categoryWeburl}` : "#software-catalog";
}

function getMatchScore(item: LandingSoftwareItem) {
  const score = Math.round(Math.max(80, Math.min(99, item.rating * 20)));
  return Number.isFinite(score) ? score : 88;
}

function resolveTierClassName(item: LandingSoftwareItem) {
  if (item.tierTone === "dark") {
    return "inline-block bg-[#0A0A0A] px-3 py-1";
  }

  if (item.tierTone === "accent") {
    return "inline-block bg-[#FFE4D9] px-3 py-1";
  }

  return "inline-block bg-[#F0F0F0] px-3 py-1";
}

function resolveTierTextClassName(item: LandingSoftwareItem) {
  if (item.tierTone === "dark") {
    return "font-syne text-xs uppercase tracking-wide text-white";
  }

  return "font-syne text-xs uppercase tracking-wide text-[#0A0A0A]";
}

function SectionNumber({ value, muted = false }: { value: string; muted?: boolean }) {
  return (
    <div className={["pointer-events-none absolute left-6 top-[-1rem] select-none font-syne text-[80px] font-normal leading-none lg:text-[120px]", muted ? "text-[#EBEBEB]" : "text-[#F0F0F0]"].join(" ")}>
      {value}
    </div>
  );
}

function SectionEyebrow({ children, cmsPath }: { children: string; cmsPath?: string }) {
  return (
    <div className="relative mb-4 flex items-center gap-3">
      <div className="size-3 bg-[#FF5C35]" />
      <span className="font-syne text-xs uppercase tracking-[2.4px] text-[#737373]" data-cms-path={cmsPath}>
        {children}
      </span>
    </div>
  );
}

function ComparisonPanel({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "light" | "dark";
}) {
  const isDark = tone === "dark";

  return (
    <div className={isDark ? "flex-1 bg-[#0A0A0A] p-6" : "flex-1 bg-[#F7F7F7] p-6"}>
      <div className={isDark ? "mb-4 border-b border-[#333] pb-3 font-syne text-xs uppercase tracking-[1.2px] text-[#FF5C35]" : "mb-4 border-b border-[#E5E5E5] pb-3 font-syne text-xs uppercase tracking-[1.2px] text-[#737373]"}>
        {label}
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <span className={isDark ? "mt-0.5 flex-shrink-0 font-semibold text-[#FF5C35]" : "mt-0.5 flex-shrink-0 font-semibold text-red-500"}>
              {isDark ? "+" : "-"}
            </span>
            <span className={isDark ? "font-manrope text-sm font-semibold text-white" : "font-manrope text-sm font-semibold text-[#666]"}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolIcon({ icon }: { icon: string }) {
  if (icon === "rfp") {
    return (
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M2.25 0C1.00898 0 0 1.00898 0 2.25V15.75C0 16.991 1.00898 18 2.25 18H11.25C12.491 18 13.5 16.991 13.5 15.75V5.625H9C8.37773 5.625 7.875 5.12227 7.875 4.5V0H2.25ZM9 0V4.5H13.5L9 0Z" fill="#FF5C35" />
      </svg>
    );
  }

  if (icon === "compare") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M0 3.375C0 2.13398 1.00898 1.125 2.25 1.125H15.75C16.991 1.125 18 2.13398 18 3.375V14.625C18 15.866 16.991 16.875 15.75 16.875H2.25C1.00898 16.875 0 15.866 0 14.625V3.375ZM2.25 5.625V14.625H7.875V5.625H2.25ZM15.75 5.625H10.125V14.625H15.75V5.625Z" fill="#FF5C35" />
      </svg>
    );
  }

  if (icon === "expert") {
    return (
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M7.875 9C6.68153 9 5.53693 8.52589 4.69302 7.68198C3.84911 6.83807 3.375 5.69347 3.375 4.5C3.375 3.30653 3.84911 2.16193 4.69302 1.31802C5.53693 0.474106 6.68153 0 7.875 0C9.06847 0 10.2131 0.474106 11.057 1.31802C11.9009 2.16193 12.375 3.30653 12.375 4.5C12.375 5.69347 11.9009 6.83807 11.057 7.68198C10.2131 8.52589 9.06847 9 7.875 9Z" fill="#FF5C35" />
      </svg>
    );
  }

  return (
    <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7.3125 2.8125C7.3125 1.88086 8.06836 1.125 9 1.125H11.25C12.1816 1.125 12.9375 1.88086 12.9375 2.8125V5.0625C12.9375 5.99414 12.1816 6.75 11.25 6.75H10.9688V8.15625H16.3125C17.3988 8.15625 18.2812 9.03867 18.2812 10.125V11.25H18.5625C19.4941 11.25 20.25 12.0059 20.25 12.9375V15.1875C20.25 16.1191 19.4941 16.875 18.5625 16.875H16.3125C15.3809 16.875 14.625 16.1191 14.625 15.1875V12.9375C14.625 12.0059 15.3809 11.25 16.3125 11.25H16.5938V10.125C16.5938 9.97031 16.4672 9.84375 16.3125 9.84375H10.9688V11.25H11.25C12.1816 11.25 12.9375 12.0059 12.9375 12.9375V15.1875C12.9375 16.1191 12.1816 16.875 11.25 16.875H9C8.06836 16.875 7.3125 16.1191 7.3125 15.1875V12.9375C7.3125 12.0059 8.06836 11.25 9 11.25H9.28125V9.84375H3.9375C3.78281 9.84375 3.65625 9.97031 3.65625 10.125V11.25H3.9375C4.86914 11.25 5.625 12.0059 5.625 12.9375V15.1875C5.625 16.1191 4.86914 16.875 3.9375 16.875H1.6875C0.755859 16.875 0 16.1191 0 15.1875V12.9375C0 12.0059 0.755859 11.25 1.6875 11.25H1.96875V10.125C1.96875 9.03867 2.85117 8.15625 3.9375 8.15625H9.28125V6.75H9C8.06836 6.75 7.3125 5.99414 7.3125 5.0625V2.8125Z" fill="#FF5C35" />
    </svg>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <StarIcon key={value} />
      ))}
      <span className="ml-1 font-manrope text-xs font-semibold text-[#737373]">{rating.toFixed(1)}</span>
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M7.4274 0.421875C7.30318 0.164062 7.04068 0 6.7524 0C6.46412 0 6.20396 0.164062 6.0774 0.421875L4.57037 3.52266L1.20474 4.01953C0.923491 4.06172 0.689116 4.25859 0.602397 4.52812C0.515678 4.79766 0.585991 5.09531 0.787553 5.29453L3.22974 7.71094L2.65318 11.1258C2.6063 11.407 2.72349 11.693 2.95552 11.8594C3.18755 12.0258 3.49458 12.0469 3.74771 11.9133L6.75474 10.3078L9.76177 11.9133C10.0149 12.0469 10.3219 12.0281 10.554 11.8594C10.786 11.6906 10.9032 11.407 10.8563 11.1258L10.2774 7.71094L12.7196 5.29453C12.9211 5.09531 12.9938 4.79766 12.9047 4.52812C12.8157 4.25859 12.5836 4.06172 12.3024 4.01953L8.93443 3.52266L7.4274 0.421875Z" fill="#FF5C35" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10.2797 6.52974C10.5727 6.23677 10.5727 5.76099 10.2797 5.46802L6.52969 1.71802C6.23672 1.42505 5.76094 1.42505 5.46797 1.71802C5.175 2.01099 5.175 2.48677 5.46797 2.77974L7.94062 5.25005H0.75C0.335156 5.25005 0 5.5852 0 6.00005C0 6.41489 0.335156 6.75005 0.75 6.75005H7.93828L5.47031 9.22036C5.17734 9.51333 5.17734 9.98911 5.47031 10.2821C5.76328 10.575 6.23906 10.575 6.53203 10.2821L10.282 6.53208L10.2797 6.52974Z" fill="#FF5C35" />
    </svg>
  );
}
