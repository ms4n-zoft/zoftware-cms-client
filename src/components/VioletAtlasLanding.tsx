import { useMemo, useState } from "react";
import type { LandingCategoryLink, LandingSoftwareItem } from "../lib/landingCatalog";
import type { ThemePackage } from "../lib/themeEngine";

type SoftwareItem = LandingSoftwareItem;

export default function VioletAtlasLanding({
  activeTheme,
  content,
  activeCategory,
  searchQuery,
  setActiveCategory,
  setSearchQuery,
  filteredSoftware,
  catalogCategories,
  categoryLinks,
  partnerSlug,
}: {
  activeTheme: ThemePackage;
  content: ThemePackage["landing"];
  activeCategory: string;
  searchQuery: string;
  setActiveCategory: (value: string) => void;
  setSearchQuery: (value: string) => void;
  filteredSoftware: LandingSoftwareItem[];
  catalogCategories: string[];
  categoryLinks: LandingCategoryLink[];
  partnerSlug: string;
}) {
  const [activeBrowseGroup, setActiveBrowseGroup] = useState(content.browseCategories.groups[0]?.label ?? "By Function");

  const browseGroup = useMemo(
    () => content.browseCategories.groups.find((group) => group.label === activeBrowseGroup) ?? content.browseCategories.groups[0],
    [activeBrowseGroup, content.browseCategories.groups],
  );

  const brandLogo = resolveBrandLogo(content.brand, activeTheme);
  const popularTags = catalogCategories.filter((item) => item !== "All").slice(0, 6);
  const heroCards = content.hero.recommendations.slice(0, 3);
  const vendorCta = content.audiences[0];
  const browseDisplayItems = categoryLinks.length > 0
    ? categoryLinks
    : (browseGroup?.items ?? []).map((item) => ({ name: item, weburl: "" }));

  return (
    <div className="min-h-screen bg-[#FAFAF6] font-['DM_Sans'] text-[#1A1A2E]">
      <div className="border-b border-[#241C48] bg-[#1A1A2E] px-6 py-3 text-center">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-2 text-sm">
          <span className="font-medium text-[#F3F4F6]" data-cms-path="landing.announcement.text">
            {content.announcement.text}
          </span>
          <a
            href={content.announcement.linkHref}
            className="font-semibold text-[#C4B5FD] transition-colors hover:text-white"
            data-cms-path="landing.announcement.linkLabel"
          >
            {content.announcement.linkLabel}
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#E8E4F0] bg-[rgba(250,250,246,0.94)] backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-6 py-4 lg:px-10">
          <a href={`/${partnerSlug}`} aria-label={content.brand.logoAlt}>
            {brandLogo}
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {content.navigation.items.map((item) => (
              <a
                key={item.label}
                href={withPartnerPath(item.href, partnerSlug)}
                className="text-sm font-medium text-[#1A1A2E] transition-colors hover:text-[#5B35F5]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={withPartnerPath(content.navigation.signInHref, partnerSlug)}
              className="hidden text-sm font-medium text-[#1A1A2E] transition-colors hover:text-[#5B35F5] sm:block"
              data-cms-path="landing.navigation.signInLabel"
            >
              {content.navigation.signInLabel}
            </a>
            <a
              href={withPartnerPath(content.navigation.primaryCtaHref, partnerSlug)}
              className="rounded-full bg-[#5B35F5] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4A28E0]"
              data-cms-path="landing.navigation.primaryCtaLabel"
            >
              {content.navigation.primaryCtaLabel}
            </a>
          </div>
        </div>
      </header>

      <section className="bg-[#FAFAF6] px-6 pb-16 pt-14">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:px-10">
          <div className="flex flex-col gap-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EDE8FF] px-4 py-1.5">
              <span className="flex size-2.5 items-center justify-center rounded-full bg-[rgba(91,53,245,0.25)]">
                <span className="size-1.5 rounded-full bg-[#5B35F5]" />
              </span>
              <span className="text-xs font-semibold text-[#5B35F5]" data-cms-path="landing.hero.eyebrow">
                {content.hero.eyebrow}
              </span>
            </div>

            <h1 className="font-['DM_Serif_Display'] text-4xl leading-[1.08] text-[#1A1A2E] sm:text-5xl lg:text-6xl xl:text-[68px]">
              {content.hero.headlineLines.map((line, index) => (
                <span
                  key={`${line}-${index}`}
                  className={index === content.hero.headlineLines.length - 1 ? "block not-italic" : "block italic"}
                  data-cms-path={`landing.hero.headlineLines.${index}`}
                >
                  {line}
                </span>
              ))}
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-[#6B7280] lg:text-lg" data-cms-path="landing.hero.description">
              {content.hero.description}
            </p>

            <div className="flex items-center gap-3 rounded-[24px] border border-[#E8E4F0] bg-white p-2 pl-4 shadow-[0_8px_40px_0_rgba(91,53,245,0.12)]">
              <SearchGlyph />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={content.hero.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-sm text-[#1A1A2E] outline-none placeholder:text-[#9CA3AF]"
                data-cms-path="landing.hero.searchPlaceholder"
              />
              <button
                className="rounded-xl bg-[#5B35F5] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4A28E0]"
                data-cms-path="landing.hero.searchButtonLabel"
              >
                {content.hero.searchButtonLabel}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs text-[#9CA3AF]">Popular:</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveCategory(tag)}
                  className="rounded-full bg-[#EDE8FF] px-3 py-1.5 text-xs font-medium text-[#5B35F5] transition-colors hover:bg-[#5B35F5] hover:text-white"
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              {content.hero.stats.map((stat, index) => (
                <div key={stat.label}>
                  <div className="font-['DM_Serif_Display'] text-xl text-[#1A1A2E]" data-cms-path={`landing.hero.stats.${index}.value`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#9CA3AF]" data-cms-path={`landing.hero.stats.${index}.label`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden flex-col gap-4 lg:flex">
            <div className="relative rounded-[24px] border border-[#E8E4F0] bg-white p-5 shadow-[0_8px_40px_0_rgba(91,53,245,0.12)]">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <VendorBadge name={heroCards[0]?.name ?? "Salesforce CRM"} />
                  <div>
                    <div className="text-[15px] font-bold text-[#1A1A2E]">{heroCards[0]?.name}</div>
                    <div className="text-xs text-[#9CA3AF]">{heroCards[0]?.category}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full bg-[#5B35F5] px-2.5 py-1 text-[10px] font-bold text-white">
                    {heroCards[0]?.score}% Match
                  </span>
                  <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-semibold text-[#92400E]">
                    Most Popular
                  </span>
                </div>
              </div>
              <RatingPips rating={heroCards[0]?.rating ?? 4.8} />
              <button className="mt-3 w-full rounded-xl bg-[#5B35F5] py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#4A28E0]">
                {content.hero.recommendationsCtaLabel}
              </button>
              <div className="pointer-events-none absolute -right-6 -top-6 size-40 rounded-full bg-[#EDE8FF] opacity-50 blur-3xl" />
            </div>

            {heroCards.slice(1).map((item, index) => (
              <div
                key={item.name}
                className="rounded-[24px] border border-[#7C5FFF] border-l-4 bg-white p-5 shadow-[0_4px_20px_0_rgba(91,53,245,0.07)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <VendorBadge name={item.name} compact indexOffset={index + 1} />
                    <div>
                      <div className="text-[15px] font-bold text-[#1A1A2E]">{item.name}</div>
                      <div className="text-xs text-[#9CA3AF]">{item.category}</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#EDE8FF] px-2.5 py-1 text-[10px] font-bold text-[#5B35F5]">
                    {item.score}% Match
                  </span>
                </div>
                <div className="mt-3">
                  <RatingPips rating={item.rating} />
                </div>
              </div>
            ))}

            <p className="text-center text-xs text-[#9CA3AF]">{content.hero.recommendationsFilterLabel}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F0E8] px-6 py-8">
        <div className="mx-auto max-w-[1280px] lg:px-10">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.28em] text-[#9CA3AF]">
            {content.trustedBy.label}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {content.trustedBy.items.map((item) => (
              <span key={item} className="text-lg font-bold text-[#9CA3AF] opacity-70 transition-opacity hover:opacity-100">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-[1280px] lg:px-10">
          <div className="mb-14 flex flex-col items-center gap-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EDE8FF] px-4 py-1.5">
              <SparkGlyph />
              <span className="text-xs font-semibold text-[#5B35F5]">{content.aiTools.eyebrow}</span>
            </div>
            <h2 className="font-['DM_Serif_Display'] text-3xl text-[#1A1A2E] lg:text-4xl" data-cms-path="landing.aiTools.headingLines.0">
              {content.aiTools.headingLines[0]}
            </h2>
            <p className="max-w-md text-base text-[#6B7280]">
              Four intelligent tools working together to make your software decisions faster, smarter, and more confident.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {content.aiTools.items.map((tool) => (
              <div
                key={tool.number}
                className="relative overflow-hidden rounded-[24px] border border-[#E8E4F0] bg-[#FDF8F0] p-8 min-h-[260px]"
              >
                <div className="pointer-events-none absolute right-0 top-0 translate-x-2 -translate-y-4 select-none font-['DM_Serif_Display'] text-[100px] leading-none text-[#F0EBE0]">
                  {tool.number}
                </div>
                <div className="relative z-10 flex size-12 items-center justify-center rounded-xl bg-[#5B35F5] text-white">
                  <AtlasToolIcon icon={tool.icon} />
                </div>
                <h3
                  className="relative z-10 mt-6 text-xl font-bold text-[#1A1A2E]"
                  data-cms-path={tool.number === "01" ? "landing.aiTools.items.0.title" : undefined}
                >
                  {tool.title}
                </h3>
                <p
                  className="relative z-10 mt-3 text-[15px] leading-relaxed text-[#6B7280]"
                  data-cms-path={tool.number === "01" ? "landing.aiTools.items.0.description" : undefined}
                >
                  {tool.description}
                </p>
                <a href="#software-catalog" className="relative z-10 mt-4 inline-flex text-sm font-semibold text-[#5B35F5] hover:underline">
                  {content.aiTools.ctaLabel}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="software-catalog" className="bg-[#FAFAF6] px-6 py-20">
        <div className="mx-auto max-w-[1280px] lg:px-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-['DM_Serif_Display'] text-3xl text-[#1A1A2E] lg:text-4xl" data-cms-path="landing.catalog.heading">
              {content.catalog.heading}
            </h2>
            <div className="flex items-center gap-1 rounded-full border border-[#E8E4F0] bg-white p-1">
              {catalogCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={[
                    "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                    activeCategory === category ? "bg-[#5B35F5] text-white" : "text-[#6B7280] hover:text-[#5B35F5]",
                  ].join(" ")}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSoftware.map((item, index) => (
              <article
                key={item.name}
                className="flex flex-col gap-3 rounded-[24px] border border-[#E8E4F0] bg-white p-6 shadow-[0_4px_24px_0_rgba(91,53,245,0.06)]"
              >
                <div className="flex items-center gap-3">
                  <VendorBadge name={item.name} square large indexOffset={index} />
                  <div>
                    <div className="text-[18px] font-bold leading-snug text-[#1A1A2E]">{item.name}</div>
                    <div className="text-xs text-[#9CA3AF]">{extractVendorName(item.description)}</div>
                  </div>
                </div>

                <RatingPips rating={item.rating} />

                <div className="flex flex-wrap gap-1.5">
                  {buildTags(item).map((tag) => (
                    <span key={tag} className="rounded-full bg-[#EDE8FF] px-2.5 py-1 text-[11px] font-medium text-[#5B35F5]">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="inline-flex w-fit rounded-xl bg-[#F5F0E8] px-3 py-1.5">
                  <span className="text-xs font-semibold text-[#92400E]">{item.tier}</span>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <a
                    href={getProductHref(item, partnerSlug)}
                    className="flex-1 rounded-full border border-[#5B35F5] py-2.5 text-center text-xs font-semibold text-[#5B35F5] transition-colors hover:bg-[#5B35F5] hover:text-white"
                    data-cms-path="landing.catalog.primaryActionLabel"
                  >
                    {content.catalog.primaryActionLabel}
                  </a>
                  <a
                    href={getCompareHref(item, partnerSlug)}
                    className="flex-1 rounded-full bg-[#F5F0E8] py-2.5 text-center text-xs font-semibold text-[#6B7280] transition-colors hover:bg-[#ECE5D9]"
                    data-cms-path="landing.catalog.secondaryActionLabel"
                  >
                    {content.catalog.secondaryActionLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <a href={`/${partnerSlug}`} className="rounded-full border border-[#5B35F5] px-8 py-3 text-sm font-semibold text-[#5B35F5] transition-colors hover:bg-[#5B35F5] hover:text-white">
              Browse software
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#1A1A2E] px-6 py-16">
        <div className="mx-auto max-w-[1280px] lg:px-10">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {content.impactStats.map((stat, index) => (
              <div key={stat.label} className="relative flex flex-col items-center gap-2">
                {index > 0 ? <div className="absolute left-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-white/10 lg:block" /> : null}
                <div className="text-center font-['DM_Serif_Display'] text-4xl text-white lg:text-5xl">{stat.value}</div>
                <div className="text-center text-sm text-[#9CA3AF]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAFAF6] px-6 py-20">
        <div className="mx-auto max-w-[1280px] lg:px-10">
          <div className="mb-14 text-center">
            <h2 className="font-['DM_Serif_Display'] text-3xl text-[#1A1A2E] lg:text-4xl" data-cms-path="landing.process.heading">
              {content.process.heading}
            </h2>
            <p className="mt-3 text-sm text-[#6B7280]">
              A clear path from uncertainty to implementation — in four simple steps.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {content.process.steps.map((step, index) => {
              const active = index === content.process.steps.length - 1;
              return (
                <div key={step.number} className="flex flex-col items-center gap-4 text-center">
                  <div
                    className={[
                      "flex size-20 items-center justify-center rounded-full border-2 shadow-[0_4px_20px_0_rgba(91,53,245,0.12)]",
                      active ? "border-[#5B35F5] bg-[#5B35F5]" : "border-[#5B35F5] bg-white",
                    ].join(" ")}
                  >
                    <span className={["font-['DM_Serif_Display'] text-3xl", active ? "text-white" : "text-[#5B35F5]"].join(" ")}>
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A2E]" data-cms-path={index === 0 ? "landing.process.steps.0.title" : undefined}>
                    {step.title}
                  </h3>
                  <p className="max-w-[180px] text-sm text-[#6B7280]" data-cms-path={index === 0 ? "landing.process.steps.0.description" : undefined}>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-[1280px] lg:px-10">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-['DM_Serif_Display'] text-3xl text-[#1A1A2E] lg:text-4xl" data-cms-path="landing.browseCategories.heading">
              {content.browseCategories.heading}
            </h2>
            {!categoryLinks.length ? (
              <div className="flex items-center gap-1.5 rounded-full border border-[#E8E4F0] p-1.5">
                {content.browseCategories.groups.map((group) => (
                <button
                  key={group.label}
                  type="button"
                  onClick={() => setActiveBrowseGroup(group.label)}
                  className={[
                    "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                    activeBrowseGroup === group.label ? "bg-[#5B35F5] text-white" : "text-[#6B7280] hover:text-[#5B35F5]",
                  ].join(" ")}
                >
                  {group.label}
                </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {browseDisplayItems.map((item) => (
              <a
                key={item.weburl || item.name}
                href={item.weburl ? `/${partnerSlug}/category/p/${item.weburl}` : "#software-catalog"}
                className="group flex min-h-[120px] flex-col items-center gap-2 rounded-[20px] border border-[#E8E4F0] bg-[#FAFAF6] p-5 text-center transition-all hover:border-[#5B35F5] hover:shadow-md"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-[#EDE8FF] text-[#5B35F5] transition-colors group-hover:bg-[#5B35F5] group-hover:text-white">
                  <CategoryGlyph name={item.name} />
                </span>
                <span className="text-[13px] font-semibold text-[#1A1A2E]">{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAFAF6] px-6 py-20">
        <div className="mx-auto grid max-w-[1280px] gap-16 lg:grid-cols-2 lg:px-10">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EDE8FF] px-4 py-1.5">
              <span className="size-2 rounded-full bg-[#5B35F5]" />
              <span className="text-xs font-semibold text-[#5B35F5]" data-cms-path="landing.whyChoose.eyebrow">
                {content.whyChoose.eyebrow}
              </span>
            </div>

            <h2 className="font-['DM_Serif_Display'] text-3xl leading-[1.15] text-[#1A1A2E] lg:text-4xl xl:text-[44px]">
              {content.whyChoose.headingLines.map((line, index) => (
                <span key={`${line}-${index}`} className="block" data-cms-path={`landing.whyChoose.headingLines.${index}`}>
                  {line}
                </span>
              ))}
            </h2>

            <div className="h-1 w-16 rounded-full bg-[#5B35F5]" />

            <div className="flex flex-col gap-5 pt-2">
              {content.whyChoose.items.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <span className="mt-0.5 flex size-7 items-center justify-center rounded-full bg-[#5B35F5] text-white">
                    <CheckGlyph />
                  </span>
                  <div>
                    <div className="text-[15px] font-semibold text-[#1A1A2E]">{item.title}</div>
                    <div className="mt-0.5 text-[13px] text-[#6B7280]">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-[24px] border border-[#E8E4F0] bg-white p-8 shadow-[0_16px_56px_0_rgba(91,53,245,0.10)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <ComparisonPanel tone="before" label={content.whyChoose.beforeLabel} items={content.whyChoose.beforeItems} />
              <ComparisonPanel tone="after" label={content.whyChoose.afterLabel} items={content.whyChoose.afterItems} />
            </div>

            <div className="border-t border-[#E8E4F0] pt-6 text-center">
              <div className="font-['DM_Serif_Display'] text-[22px]">
                <span className="text-[#1A1A2E]">From 3 months → </span>
                <span className="text-[#5B35F5]">2 weeks</span>
              </div>
              <p className="mt-1 text-[13px] text-[#9CA3AF]">Average time saved on software evaluation</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-[1280px] lg:px-10">
          <div className="mb-14 text-center">
            <h2 className="font-['DM_Serif_Display'] text-3xl text-[#1A1A2E] lg:text-4xl" data-cms-path="landing.testimonials.heading">
              {content.testimonials.heading}
            </h2>
            <p className="mt-3 text-base text-[#6B7280]">Trusted by thousands of business leaders and IT professionals.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.testimonials.items.map((item) => (
              <article
                key={item.name}
                className="flex flex-col gap-3 rounded-[24px] border border-[#E8E4F0] bg-[#FDF8F0] p-7 shadow-[0_8px_32px_0_rgba(91,53,245,0.08)]"
              >
                <div className="font-['DM_Serif_Display'] text-6xl leading-none text-[#5B35F5] opacity-30">"</div>
                <RatingPips rating={5} />
                <p className="font-['DM_Serif_Display'] text-lg italic leading-relaxed text-[#1A1A2E]">{item.quote}</p>
                <div className="mt-3 flex items-center gap-3">
                  <img src={item.avatar} alt={item.name} className="size-10 rounded-full object-cover" />
                  <div>
                    <div className="text-[14px] font-bold text-[#1A1A2E]">{item.name}</div>
                    <div className="text-xs text-[#9CA3AF]">{item.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {vendorCta ? (
        <section className="bg-[#F5F0E8] px-6 py-16">
          <div className="mx-auto max-w-[1280px] lg:px-10">
            <div className="relative overflow-hidden rounded-[24px] bg-[#1A1A2E] p-10 lg:p-16">
              <div className="absolute right-0 top-0 size-48 rounded-full border border-white opacity-5" />
              <div className="absolute bottom-0 left-0 size-32 rounded-full border border-white opacity-5" />

              <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                <div className="flex max-w-xl flex-col gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-[#5B35F5] text-white">
                    <RocketGlyph />
                  </div>
                  <h2 className="font-['DM_Serif_Display'] text-3xl text-white lg:text-4xl">{vendorCta.titleLines[0]}</h2>
                  <p className="text-base text-[#9CA3AF]">{vendorCta.description}</p>
                  <ul className="flex flex-col gap-2">
                    {vendorCta.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-[#D1D5DB]">
                        <span className="text-[#5B35F5]">
                          <CheckGlyph />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <a
                    href={withPartnerPath(vendorCta.ctaHref, partnerSlug)}
                    className="rounded-full bg-[#5B35F5] px-8 py-4 text-center font-semibold text-white transition-colors hover:bg-[#4A28E0]"
                  >
                    {vendorCta.ctaLabel}
                  </a>
                  <a
                    href="#software-catalog"
                    className="rounded-full border border-white/20 px-8 py-4 text-center font-semibold text-white transition-colors hover:border-white/40"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <footer className="bg-[#1A1A2E] px-6 py-12">
        <div className="mx-auto max-w-[1280px] lg:px-10">
          <div className="mb-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-4">{brandLogo}</div>
              <p className="text-sm leading-relaxed text-[#9CA3AF]" data-cms-path="landing.footer.description">
                {content.footer.description}
              </p>
            </div>

            {content.footer.columns.map((column) => (
              <div key={column.title}>
                <h4 className="mb-4 text-sm font-semibold text-white">{column.title}</h4>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link}>
                        <a href="#software-catalog" className="text-sm text-[#9CA3AF] transition-colors hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-sm text-[#6B7280]" data-cms-path="landing.footer.copyright">
              {content.footer.copyright}
            </p>
            <div className="flex gap-4">
              {content.footer.legalLinks.map((link) => (
                <a key={link} href="#software-catalog" className="text-sm text-[#6B7280] transition-colors hover:text-white">
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

function resolveBrandLogo(brand: ThemePackage["landing"]["brand"] & { logo?: string }, theme: ThemePackage) {
  const source = brand.logo || theme.assets.logo;
  return <img src={source} alt={brand.logoAlt || theme.landing.brand.logoAlt} className="h-7 w-auto" />;
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

function getProductHref(item: LandingSoftwareItem, partnerSlug: string) {
  return item.weburl ? `/${partnerSlug}/products/${item.weburl}/overview` : "#software-catalog";
}

function getCompareHref(item: LandingSoftwareItem, partnerSlug: string) {
  return item.weburl ? `/${partnerSlug}/compare/product?products=${item.weburl}` : "#software-catalog";
}

function buildTags(item: SoftwareItem) {
  const description = item.description.split("·")[1]?.trim() ?? item.description;
  return description
    .split(",")
    .slice(0, 3)
    .map((value) => value.trim())
    .filter(Boolean);
}

function extractVendorName(description: string) {
  return description.split("·")[0]?.trim() ?? description;
}

function VendorBadge({
  name,
  compact = false,
  large = false,
  square = false,
  indexOffset = 0,
}: {
  name: string;
  compact?: boolean;
  large?: boolean;
  square?: boolean;
  indexOffset?: number;
}) {
  const palette = [
    "#1098F7",
    "#0070BB",
    "#FF7A59",
    "#F5622D",
    "#0078D4",
    "#C74634",
    "#E74C3C",
    "#25C16F",
    "#FF3D57",
  ];
  const color = palette[indexOffset % palette.length];
  const sizeClass = large ? "size-14" : compact ? "size-11" : "size-11";
  const radiusClass = square ? "rounded-xl" : "rounded-xl";

  return (
    <span className={["flex flex-shrink-0 items-center justify-center text-white", sizeClass, radiusClass].join(" ")} style={{ background: color }}>
      <span className="text-xs font-bold">{getInitials(name, large ? 3 : 2)}</span>
    </span>
  );
}

function getInitials(value: string, max = 2) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, max)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function RatingPips({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className="text-[#F59E0B]">
          <StarGlyph />
        </span>
      ))}
      <span className="ml-1 text-xs text-[#6B7280]">{rating.toFixed(1)}</span>
    </div>
  );
}

function ComparisonPanel({
  tone,
  label,
  items,
}: {
  tone: "before" | "after";
  label: string;
  items: string[];
}) {
  const isAfter = tone === "after";
  return (
    <div
      className={[
        "flex flex-col gap-4 rounded-[24px] border p-6",
        isAfter ? "border-[#A7F3D0] bg-[#F0FDF4]" : "border-[#FECACA] bg-[#FFF5F5]",
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span className={isAfter ? "text-[#059669]" : "text-[#DC2626]"}>
          {isAfter ? <CheckCircleGlyph /> : <CloseCircleGlyph />}
        </span>
        <span className={["text-[15px] font-bold", isAfter ? "text-[#059669]" : "text-[#DC2626]"].join(" ")}>{label}</span>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2">
            <span className={["mt-1", isAfter ? "text-[#059669]" : "text-[#DC2626]"].join(" ")}>
              {isAfter ? <CheckGlyph /> : <CloseGlyph />}
            </span>
            <span className="text-[13px] text-[#6B7280]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryGlyph({ name }: { name: string }) {
  return <span className="text-sm font-bold">{getInitials(name, 2)}</span>;
}

function SearchGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13 6.5C13 7.93438 12.5344 9.25938 11.75 10.3344L15.7063 14.2937C16.0969 14.6844 16.0969 15.3188 15.7063 15.7094C15.3156 16.1 14.6812 16.1 14.2906 15.7094L10.3344 11.75C9.25938 12.5375 7.93438 13 6.5 13C2.90937 13 0 10.0906 0 6.5C0 2.90937 2.90937 0 6.5 0C10.0906 0 13 2.90937 13 6.5ZM6.5 11C9.53757 11 11 8.81372 11 6.5C11 4.18628 8.81372 2 6.5 2C4.18628 2 2 4.18628 2 6.5C2 8.81372 4.18628 11 6.5 11Z" fill="#9CA3AF" />
    </svg>
  );
}

function SparkGlyph() {
  return (
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
      <path d="M4.58398 0.833984L3.84766 1.10937C3.78906 1.13086 3.75 1.1875 3.75 1.25C3.75 1.3125 3.78906 1.36914 3.84766 1.39062L4.58398 1.66602L4.85938 2.40234C4.88086 2.46094 4.9375 2.5 5 2.5C5.0625 2.5 5.11914 2.46094 5.14063 2.40234L5.41602 1.66602L6.15234 1.39062C6.21094 1.36914 6.25 1.3125 6.25 1.25C6.25 1.1875 6.21094 1.13086 6.15234 1.10937L5.41602 0.833984L5.14063 0.0976562C5.11914 0.0390625 5.0625 0 5 0C4.9375 0 4.88086 0.0390625 4.85938 0.0976562L4.58398 0.833984ZM0.900391 7.72266C0.535156 8.08789 0.535156 8.68164 0.900391 9.04883L1.57617 9.72461C1.94141 10.0898 2.53516 10.0898 2.90234 9.72461L10.3496 2.27539C10.7148 1.91016 10.7148 1.31641 10.3496 0.949219L9.67383 0.275391C9.30859 -0.0898438 8.71484 -0.0898438 8.34766 0.275391L0.900391 7.72266Z" fill="#5B35F5" />
    </svg>
  );
}

function AtlasToolIcon({ icon }: { icon: string }) {
  if (icon === "rfp") {
    return (
      <svg width="12" height="16" viewBox="0 0 12 16" fill="none" aria-hidden="true">
        <path d="M2 0C0.896875 0 0 0.896875 0 2V14C0 15.1031 0.896875 16 2 16H10C11.1031 16 12 15.1031 12 14V5H8C7.44687 5 7 4.55313 7 4V0H2ZM8 0V4H12L8 0Z" fill="white" />
      </svg>
    );
  }

  if (icon === "compare") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M1.5 2.5H6.5V13.5H1.5V2.5ZM9.5 5H14.5V13.5H9.5V5Z" fill="white" />
      </svg>
    );
  }

  if (icon === "expert") {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 8C6.34315 8 5 6.65685 5 5C5 3.34315 6.34315 2 8 2C9.65685 2 11 3.34315 11 5C11 6.65685 9.65685 8 8 8ZM3 13C3 10.7909 5.23858 9 8 9C10.7614 9 13 10.7909 13 13V14H3V13Z" fill="white" />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1L9.9375 5.0625L14 7L9.9375 8.9375L8 13L6.0625 8.9375L2 7L6.0625 5.0625L8 1Z" fill="white" />
    </svg>
  );
}

function CheckGlyph() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" aria-hidden="true">
      <path d="M10.2795 2.46973C10.5725 2.7627 10.5725 3.23848 10.2795 3.53145L4.27949 9.53145C3.98652 9.82441 3.51074 9.82441 3.21777 9.53145L0.217773 6.53145C-0.0751953 6.23848 -0.0751953 5.7627 0.217773 5.46973C0.510742 5.17676 0.986523 5.17676 1.27949 5.46973L3.7498 7.9377L9.22012 2.46973C9.51309 2.17676 9.98887 2.17676 10.2818 2.46973H10.2795Z" fill="currentColor" />
    </svg>
  );
}

function CloseGlyph() {
  return (
    <svg width="9" height="12" viewBox="0 0 9 12" fill="none" aria-hidden="true">
      <path d="M8.02974 3.52949C8.32271 3.23652 8.32271 2.76074 8.02974 2.46777C7.73677 2.1748 7.26099 2.1748 6.96802 2.46777L4.50005 4.93809L2.02974 2.47012C1.73677 2.17715 1.26099 2.17715 0.968018 2.47012C0.675049 2.76309 0.675049 3.23887 0.968018 3.53184L3.43833 5.9998L0.970361 8.47012C0.677393 8.76309 0.677393 9.23887 0.970361 9.53184C1.26333 9.82481 1.73911 9.82481 2.03208 9.53184L4.50005 7.06152L6.97036 9.52949C7.26333 9.82246 7.73911 9.82246 8.03208 9.52949C8.32505 9.23652 8.32505 8.76074 8.03208 8.46777L5.56177 5.9998L8.02974 3.52949Z" fill="currentColor" />
    </svg>
  );
}

function CheckCircleGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M7.5 15C9.48912 15 11.3968 14.2098 12.8033 12.8033C14.2098 11.3968 15 9.48912 15 7.5C15 5.51088 14.2098 3.60322 12.8033 2.1967C11.3968 0.790176 9.48912 0 7.5 0C5.51088 0 3.60322 0.790176 2.1967 2.1967C0.790176 3.60322 0 5.51088 0 7.5C0 9.48912 0.790176 11.3968 2.1967 12.8033C3.60322 14.2098 5.51088 15 7.5 15ZM10.8105 6.12305L7.06055 9.87305C6.78516 10.1484 6.33984 10.1484 6.06738 9.87305L4.19238 7.99805C3.91699 7.72266 3.91699 7.27734 4.19238 7.00488C4.46777 6.73242 4.91309 6.72949 5.18555 7.00488L6.5625 8.38184L9.81445 5.12695C10.0898 4.85156 10.5352 4.85156 10.8076 5.12695C11.0801 5.40234 11.083 5.84766 10.8076 6.12012L10.8105 6.12305Z" fill="currentColor" />
    </svg>
  );
}

function CloseCircleGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path d="M7.5 15C9.48912 15 11.3968 14.2098 12.8033 12.8033C14.2098 11.3968 15 9.48912 15 7.5C15 5.51088 14.2098 3.60322 12.8033 2.1967C11.3968 0.790176 9.48912 0 7.5 0C5.51088 0 3.60322 0.790176 2.1967 2.1967C0.790176 3.60322 0 5.51088 0 7.5C0 9.48912 0.790176 11.3968 2.1967 12.8033C3.60322 14.2098 5.51088 15 7.5 15ZM5.12695 5.12695C5.40234 4.85156 5.84766 4.85156 6.12012 5.12695L7.49707 6.50391L8.87402 5.12695C9.14941 4.85156 9.59473 4.85156 9.86719 5.12695C10.1396 5.40234 10.1426 5.84766 9.86719 6.12012L8.49023 7.49707L9.86719 8.87402C10.1426 9.14941 10.1426 9.59473 9.86719 9.86719C9.5918 10.1396 9.14648 10.1426 8.87402 9.86719L7.49707 8.49023L6.12012 9.86719C5.84473 10.1426 5.39941 10.1426 5.12695 9.86719C4.85449 9.5918 4.85156 9.14648 5.12695 8.87402L6.50391 7.49707L5.12695 6.12012C4.85156 5.84473 4.85156 5.39941 5.12695 5.12695Z" fill="currentColor" />
    </svg>
  );
}

function StarGlyph() {
  return (
    <svg width="13" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
      <path d="M7.42789 0.421875C7.30367 0.164062 7.04117 0 6.75289 0C6.4646 0 6.20445 0.164062 6.07789 0.421875L4.57085 3.52266L1.20523 4.01953C0.923979 4.06172 0.689604 4.25859 0.602885 4.52812C0.516167 4.79766 0.586479 5.09531 0.788042 5.29453L3.23023 7.71094L2.65367 11.1258C2.60679 11.407 2.72398 11.693 2.95601 11.8594C3.18804 12.0258 3.49507 12.0469 3.7482 11.9133L6.75523 10.3078L9.76226 11.9133C10.0154 12.0469 10.3224 12.0281 10.5544 11.8594C10.7865 11.6906 10.9037 11.407 10.8568 11.1258L10.2779 7.71094L12.7201 5.29453C12.9216 5.09531 12.9943 4.79766 12.9052 4.52812C12.8162 4.25859 12.5841 4.06172 12.3029 4.01953L8.93492 3.52266L7.42789 0.421875Z" fill="currentColor" />
    </svg>
  );
}

function RocketGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4.89378 12.0274L3.92816 11.0617C3.66253 10.7961 3.56878 10.4117 3.68753 10.0555C3.78128 9.77736 3.90628 9.41486 4.05628 8.99924H0.75003C0.48128 8.99924 0.23128 8.85549 0.0969053 8.62111C-0.0374697 8.38674 -0.0343447 8.09924 0.103155 7.86799L1.74378 5.10236C2.15003 4.41799 2.88441 3.99924 3.67816 3.99924H6.25003C6.32503 3.87424 6.40003 3.75861 6.47503 3.64611C9.03441 -0.128889 12.8469 -0.253888 15.1219 0.164862C15.4844 0.230487 15.7657 0.514862 15.8344 0.877362C16.2532 3.15549 16.125 6.96486 12.3532 9.52424C12.2438 9.59924 12.125 9.67424 12 9.74924V12.3211C12 13.1149 11.5813 13.8524 10.8969 14.2555L8.13128 15.8961C7.90003 16.0336 7.61253 16.0367 7.37816 15.9024C7.14378 15.768 7.00003 15.5211 7.00003 15.2492V11.8992C6.55941 12.0524 6.17503 12.1774 5.88441 12.2711C5.53441 12.3836 5.15316 12.2867 4.89066 12.0274H4.89378Z" fill="white" />
    </svg>
  );
}
