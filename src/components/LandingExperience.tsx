import { useEffect, useMemo, useState } from "react";
import AdminFloatingButton from "./AdminFloatingButton";
import VioletAtlasLanding from "./VioletAtlasLanding";
import {
  getStoredThemeId,
  resolveThemePackage,
  THEME_CHANGE_EVENT,
  type ThemePackage,
} from "../lib/themeEngine";
import { useCmsContent } from "../lib/useCmsContent";

type SoftwareItem = ThemePackage["landing"]["catalog"]["items"][number];

export default function LandingExperience() {
  const [activeTheme, setActiveTheme] = useState(() => resolveThemePackage(getRequestedThemeId()));
  const content = useCmsContent(activeTheme.landing, "landing");
  const [activeCategory, setActiveCategory] = useState(content.catalog.categories[0] ?? "All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const previewThemeId = getPreviewThemeId();

    const syncTheme = () => {
      const nextThemeId = previewThemeId || getStoredThemeId();
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

  useEffect(() => {
    if (!content.catalog.categories.includes(activeCategory)) {
      setActiveCategory(content.catalog.categories[0] ?? "All");
    }
  }, [activeCategory, content.catalog.categories]);

  const filteredSoftware = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return content.catalog.items.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category.includes(activeCategory);
      const matchesQuery = !query
        || [item.name, item.category, item.description].some((value) => value.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, content.catalog.items, searchQuery]);

  const brandLogo = resolveBrandLogo(content.brand, activeTheme);
  const brandName = content.brand.name || activeTheme.name;

  if (activeTheme.id === "violet-atlas") {
    return (
      <VioletAtlasLanding
        activeTheme={activeTheme}
        content={content}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        setActiveCategory={setActiveCategory}
        setSearchQuery={setSearchQuery}
        filteredSoftware={filteredSoftware}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white font-manrope text-[#0A0A0A]">
      <div className="bg-[#0A0A0A] py-2.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="font-syne text-sm font-semibold tracking-tight text-white">
              {content.announcement.text}
            </span>
            <a href={content.announcement.linkHref} className="font-syne text-sm font-semibold text-[#FF5C35] underline">
              {content.announcement.linkLabel}
            </a>
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-50 border-b-2 border-[#0A0A0A] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">
            <div className="flex items-center gap-8 lg:gap-12">
              <a href="/" aria-label={content.brand.logoAlt}>
                {brandLogo}
              </a>
              <div className="hidden items-center gap-6 md:flex lg:gap-8">
                {content.navigation.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="whitespace-nowrap font-manrope text-sm font-semibold text-[#0A0A0A] transition-colors hover:text-[#FF5C35]"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 lg:gap-6">
              <a
                href={content.navigation.signInHref}
                className="hidden font-manrope text-sm font-semibold text-[#0A0A0A] sm:block"
              >
                {content.navigation.signInLabel}
              </a>
              <a
                href={content.navigation.primaryCtaHref}
                className="whitespace-nowrap border-2 border-[#0A0A0A] bg-[#0A0A0A] px-5 py-2.5 font-manrope text-sm font-semibold text-white transition-colors hover:border-[#FF5C35] hover:bg-[#FF5C35]"
              >
                {content.navigation.primaryCtaLabel}
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
                  <span className="font-syne text-xs uppercase tracking-[2.4px] text-[#737373]">
                    {content.hero.eyebrow}
                  </span>
                </div>
                <h1 className="mb-8 font-syne text-4xl font-normal uppercase leading-none tracking-tight text-[#0A0A0A] sm:text-5xl lg:text-[72px]">
                  {content.hero.headlineLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
                <p className="mb-10 max-w-xl font-manrope text-lg font-semibold leading-relaxed text-[#737373] sm:text-xl">
                  {content.hero.description}
                </p>

                <div className="mb-12 flex max-w-2xl border-2 border-[#0A0A0A]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={content.hero.searchPlaceholder}
                    className="min-w-0 flex-1 border-none bg-white px-6 py-4 font-manrope text-base font-semibold text-[#0A0A0A] outline-none placeholder:text-[#AAAAAA]"
                  />
                  <button className="whitespace-nowrap border-l-2 border-[#0A0A0A] bg-[#FF5C35] px-8 py-4 font-syne text-sm uppercase tracking-wide text-white transition-colors hover:bg-[#E84E27]">
                    {content.hero.searchButtonLabel}
                  </button>
                </div>

                <div className="flex flex-col gap-8 border-t-2 border-[#E5E5E5] pt-8 sm:flex-row sm:gap-0">
                  {content.hero.stats.map((stat, index) => (
                    <div
                      key={stat.value}
                      className={[
                        "flex-1",
                        index < content.hero.stats.length - 1 ? "sm:border-r-2 sm:border-[#E5E5E5] sm:pr-8" : "",
                        index > 0 ? "sm:pl-8" : "",
                      ].join(" ")}
                    >
                      <div className="mb-1 font-syne text-3xl font-normal text-[#0A0A0A] lg:text-4xl">{stat.value}</div>
                      <div className="font-manrope text-sm font-semibold text-[#737373]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full flex-shrink-0 lg:w-[460px] xl:w-[520px]">
              <div className="border-2 border-[#222] bg-[#0A0A0A] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="font-syne text-xs uppercase tracking-[1.2px] text-[#FF5C35]">
                    {content.hero.recommendationsEyebrow}
                  </div>
                  <div className="size-2 rounded-full bg-[#FF5C35] animate-pulse" />
                </div>
                <div className="mb-6 font-syne text-lg uppercase text-white">
                  {content.hero.recommendationsTitle}
                </div>
                <div className="flex flex-col gap-3">
                  {content.hero.recommendations.map((item) => (
                    <div key={item.name} className="flex items-center gap-4 border border-[#333] bg-[#161616] p-4">
                      <div className="flex size-10 flex-shrink-0 items-center justify-center border border-[#333] bg-[#222]">
                        <span className="font-syne text-xs text-[#737373]">{item.name.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-syne text-sm text-white">{item.name}</div>
                        <div className="font-manrope text-xs text-[#FF5C35]">{item.category}</div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="font-syne text-lg text-[#FF5C35]">{item.score}%</div>
                        <div className="font-manrope text-xs text-[#555]">match</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-[#222] pt-4">
                  <div className="mb-3 font-manrope text-xs text-[#555]">{content.hero.recommendationsFilterLabel}</div>
                  <button className="w-full bg-[#FF5C35] py-3 font-syne text-sm uppercase tracking-wide text-white transition-colors hover:bg-[#E84E27]">
                    {content.hero.recommendationsCtaLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-[#E5E5E5] bg-white py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto">
            <span className="whitespace-nowrap font-syne text-xs uppercase tracking-[1.2px] text-[#737373]">
              {content.trustedBy.label}
            </span>
            {content.trustedBy.items.map((item) => (
              <span key={item} className="whitespace-nowrap font-manrope text-sm font-semibold text-[#AAAAAA]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b-2 border-[#E5E5E5] bg-white py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute left-8 top-[-1.5rem] select-none font-syne text-[80px] font-normal leading-none text-[#F0F0F0] lg:text-[120px]">
            02
          </div>
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="size-3 bg-[#FF5C35]" />
              <span className="font-syne text-xs uppercase tracking-[2.4px] text-[#737373]">{content.aiTools.eyebrow}</span>
            </div>
            <h2 className="mb-12 font-syne text-3xl font-normal uppercase leading-tight text-[#0A0A0A] sm:text-4xl lg:text-5xl">
              {content.aiTools.headingLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {content.aiTools.items.map((tool) => (
                <div
                  key={tool.number}
                  className="group relative flex flex-col gap-3 border-2 border-[#0A0A0A] bg-white p-8 transition-colors hover:border-[#FF5C35]"
                >
                  <div className="flex size-12 items-center justify-center border-2 border-[#FF5C35]">
                    <ToolIcon icon={tool.icon} />
                  </div>
                  <h3 className="mt-3 font-syne text-xl uppercase text-[#0A0A0A]">{tool.title}</h3>
                  <p className="font-manrope text-sm font-semibold leading-relaxed text-[#737373]">{tool.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-manrope text-sm font-semibold text-[#FF5C35]">{content.aiTools.ctaLabel}</span>
                    <ArrowRightIcon />
                  </div>
                  <div className="pointer-events-none absolute bottom-6 right-6 select-none font-syne text-4xl text-[#F0F0F0]">
                    {tool.number}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b-2 border-[#E5E5E5] bg-[#F7F7F7] py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute left-6 top-[-1rem] select-none font-syne text-[80px] font-normal leading-none text-[#EBEBEB] lg:text-[120px]">
            03
          </div>
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="size-3 bg-[#FF5C35]" />
              <span className="font-syne text-xs uppercase tracking-[2.4px] text-[#737373]">{content.catalog.eyebrow}</span>
            </div>
            <h2 className="mb-8 font-syne text-3xl font-normal uppercase leading-tight text-[#0A0A0A] sm:text-4xl lg:text-5xl">
              {content.catalog.heading}
            </h2>

            <div className="mb-8 flex flex-wrap gap-2">
              {content.catalog.categories.map((category) => (
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
                <article key={software.name} className="flex flex-col gap-3 border border-[#0A0A0A] bg-white p-6 transition-colors hover:border-[#FF5C35]">
                  <div className="flex items-start gap-4">
                    <div className="flex size-14 flex-shrink-0 items-center justify-center border border-[#E5E5E5] bg-[#F0F0F0]">
                      <span className="font-syne text-sm text-[#737373]">{software.abbr}</span>
                    </div>
                    <div>
                      <div className="font-syne text-lg leading-snug text-[#0A0A0A]">{software.name}</div>
                      <div className="mt-1 inline-block bg-[#FFF0EC] px-2 py-0.5">
                        <span className="font-manrope text-xs font-semibold text-[#FF5C35]">{software.category}</span>
                      </div>
                    </div>
                  </div>
                  <StarRating rating={software.rating} />
                  <p className="font-manrope text-[13px] font-semibold leading-relaxed text-[#737373]">{software.description}</p>
                  <div className={resolveTierClassName(software)}>
                    <span className={resolveTierTextClassName(software)}>{software.tier}</span>
                  </div>
                  <div className="mt-auto flex gap-2 pt-1">
                    <button className="flex-1 border-2 border-[#0A0A0A] bg-[#0A0A0A] py-2.5 font-syne text-xs uppercase tracking-wide text-white transition-colors hover:border-[#FF5C35] hover:bg-[#FF5C35]">
                      {content.catalog.primaryActionLabel}
                    </button>
                    <button className="flex-1 border-2 border-[#0A0A0A] bg-white py-2.5 font-syne text-xs uppercase tracking-wide text-[#0A0A0A] transition-colors hover:bg-[#F0F0F0]">
                      {content.catalog.secondaryActionLabel}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b-2 border-[#222] bg-[#0A0A0A] py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute right-8 top-[-1rem] select-none font-syne text-[80px] font-normal leading-none text-[#161616] lg:text-[120px]">
            04
          </div>
          <div className="relative grid grid-cols-2 gap-0 lg:grid-cols-4">
            {content.impactStats.map((stat, index) => (
              <div
                key={stat.value}
                className={`flex flex-col gap-3 px-8 py-8 ${index < content.impactStats.length - 1 ? "lg:border-r lg:border-[#333]" : ""}`}
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
          <div className="pointer-events-none absolute left-6 top-[-1rem] select-none font-syne text-[80px] font-normal leading-none text-[#F0F0F0] lg:text-[120px]">
            05
          </div>
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="size-3 bg-[#FF5C35]" />
              <span className="font-syne text-xs uppercase tracking-[2.4px] text-[#737373]">{content.process.eyebrow}</span>
            </div>
            <h2 className="mb-12 font-syne text-3xl font-normal uppercase leading-tight text-[#0A0A0A] sm:text-4xl lg:text-5xl">
              {content.process.heading}
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {content.process.steps.map((step) => (
                <div key={step.number} className="flex flex-col items-center text-center">
                  <div className="mb-6 flex size-12 items-center justify-center bg-[#FF5C35]">
                    <span className="font-syne text-base text-white">{step.number}</span>
                  </div>
                  <h3 className="mb-3 font-syne text-lg uppercase text-[#0A0A0A]">{step.title}</h3>
                  <p className="font-manrope text-sm font-semibold leading-relaxed text-[#737373]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b-2 border-[#E5E5E5] bg-[#F7F7F7] py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute left-6 top-[-1rem] select-none font-syne text-[80px] font-normal leading-none text-[#EBEBEB] lg:text-[120px]">
            06
          </div>
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="size-3 bg-[#FF5C35]" />
              <span className="font-syne text-xs uppercase tracking-[2.4px] text-[#737373]">{content.browseCategories.eyebrow}</span>
            </div>
            <h2 className="mb-10 font-syne text-3xl font-normal uppercase leading-tight text-[#0A0A0A] sm:text-4xl lg:text-5xl">
              {content.browseCategories.heading}
            </h2>
            <div className="space-y-6">
              {content.browseCategories.groups.map((group) => (
                <div key={group.label}>
                  <div className="mb-3 font-syne text-xs uppercase tracking-[1.2px] text-[#737373]">{group.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <button
                        type="button"
                        key={item}
                        className="border border-[#0A0A0A] bg-white px-5 py-2 font-manrope text-sm font-semibold text-[#0A0A0A] transition-colors hover:bg-[#0A0A0A] hover:text-white"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b-2 border-[#E5E5E5] bg-white py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute left-6 top-[-1rem] select-none font-syne text-[80px] font-normal leading-none text-[#F0F0F0] lg:text-[120px]">
            07
          </div>
          <div className="relative flex flex-col items-start gap-16 lg:flex-row">
            <div className="min-w-0 flex-1">
              <div className="mb-4 flex items-center gap-3">
                <div className="size-3 bg-[#FF5C35]" />
                <span className="font-syne text-xs uppercase tracking-[2.4px] text-[#737373]">{content.whyChoose.eyebrow}</span>
              </div>
              <h2 className="mb-8 font-syne text-3xl font-normal uppercase leading-tight text-[#0A0A0A] sm:text-4xl lg:text-[42px]">
                {content.whyChoose.headingLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <div className="divide-y divide-[#E5E5E5]">
                {content.whyChoose.items.map((item) => (
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
              <div className="flex-1 bg-[#F7F7F7] p-6">
                <div className="mb-4 border-b border-[#E5E5E5] pb-3 font-syne text-xs uppercase tracking-[1.2px] text-[#737373]">
                  {content.whyChoose.beforeLabel}
                </div>
                <div className="space-y-4">
                  {content.whyChoose.beforeItems.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 font-semibold text-red-500">✗</span>
                      <span className="font-manrope text-sm font-semibold text-[#666]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 bg-[#0A0A0A] p-6">
                <div className="mb-4 border-b border-[#333] pb-3 font-syne text-xs uppercase tracking-[1.2px] text-[#FF5C35]">
                  {content.whyChoose.afterLabel}
                </div>
                <div className="space-y-4">
                  {content.whyChoose.afterItems.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 flex-shrink-0 font-semibold text-[#FF5C35]">✓</span>
                      <span className="font-manrope text-sm font-semibold text-white">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-b-2 border-[#E5E5E5] bg-[#F7F7F7] py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute left-6 top-[-1rem] select-none font-syne text-[80px] font-normal leading-none text-[#EBEBEB] lg:text-[120px]">
            08
          </div>
          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="size-3 bg-[#FF5C35]" />
              <span className="font-syne text-xs uppercase tracking-[2.4px] text-[#737373]">{content.testimonials.eyebrow}</span>
            </div>
            <h2 className="mb-10 font-syne text-3xl font-normal uppercase leading-tight text-[#0A0A0A] sm:text-4xl lg:text-5xl">
              {content.testimonials.heading}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {content.testimonials.items.map((item) => (
                <div key={item.name} className="flex flex-col gap-6 border border-[#FF5C35]/30 border-t-4 border-t-[#FF5C35] bg-white p-8">
                  <div className="font-syne text-5xl leading-none text-[#FF5C35]">"</div>
                  <p className="flex-1 font-manrope text-[15px] font-semibold leading-relaxed text-[#444]">"{item.quote}"</p>
                  <div className="flex items-center gap-4 border-t border-[#E5E5E5] pt-6">
                    <img src={item.avatar} alt={item.name} className="size-12 rounded-full object-cover" />
                    <div>
                      <div className="font-syne text-sm text-[#0A0A0A]">{item.name}</div>
                      <div className="font-manrope text-xs font-semibold text-[#737373]">{item.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-[#E5E5E5]">
        <div className="flex flex-col lg:flex-row">
          {content.audiences.map((audience) => (
            <div
              key={audience.eyebrow}
              className={audience.tone === "dark" ? "flex-1 bg-[#0A0A0A] p-12 lg:p-16" : "flex-1 bg-[#FF5C35] p-12 lg:p-16"}
            >
              <div className="max-w-md">
                <div className={audience.tone === "dark" ? "mb-4 font-syne text-xs uppercase tracking-[2.4px] text-[#666]" : "mb-4 font-syne text-xs uppercase tracking-[2.4px] text-[#CC4428]"}>
                  {audience.eyebrow}
                </div>
                <h2 className={audience.tone === "dark" ? "mb-5 font-syne text-3xl font-normal uppercase leading-tight text-white lg:text-[42px]" : "mb-5 font-syne text-3xl font-normal uppercase leading-tight text-white lg:text-[42px]"}>
                  {audience.titleLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <p className={audience.tone === "dark" ? "mb-6 font-manrope text-base font-semibold leading-relaxed text-[#888]" : "mb-6 font-manrope text-base font-semibold leading-relaxed text-white/90"}>
                  {audience.description}
                </p>
                <div className="mb-8 space-y-3">
                  {audience.items.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className={audience.tone === "dark" ? "h-1.5 w-1.5 flex-shrink-0 bg-[#FF5C35]" : "h-1.5 w-1.5 flex-shrink-0 bg-[#0A0A0A]"} />
                      <span className={audience.tone === "dark" ? "font-manrope text-sm font-semibold text-[#AAA]" : "font-manrope text-sm font-semibold text-white/90"}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  href={audience.ctaHref}
                  className={audience.tone === "dark"
                    ? "inline-block border-2 border-[#FF5C35] bg-[#FF5C35] px-8 py-4 font-syne text-sm uppercase tracking-wide text-white transition-colors hover:bg-[#E84E27]"
                    : "inline-block border-2 border-[#0A0A0A] bg-[#0A0A0A] px-8 py-4 font-syne text-sm uppercase tracking-wide text-white transition-colors hover:bg-[#222]"}
                >
                  {audience.ctaLabel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-b-2 border-[#222] bg-[#0A0A0A] py-24 lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #2A2A2A 0%, transparent 70%)" }}
          />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 font-syne text-4xl font-normal uppercase leading-tight text-white sm:text-5xl lg:text-[64px]">
            {content.cta.headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mb-10 font-manrope text-lg font-semibold text-[#888]">{content.cta.description}</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={content.cta.primaryHref}
              className="w-full border-2 border-[#FF5C35] bg-[#FF5C35] px-10 py-4 font-syne text-sm uppercase tracking-wide text-[#0A0A0A] transition-colors hover:bg-[#E84E27] hover:text-white sm:w-auto"
            >
              {content.cta.primaryLabel}
            </a>
            <a
              href={content.cta.secondaryHref}
              className="w-full border-2 border-white bg-transparent px-10 py-4 font-syne text-sm uppercase tracking-wide text-white transition-colors hover:bg-white hover:text-[#0A0A0A] sm:w-auto"
            >
              {content.cta.secondaryLabel}
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t-2 border-[#0A0A0A] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-4">{brandLogo}</div>
              <p className="mb-5 font-manrope text-sm font-semibold leading-relaxed text-[#737373]">
                {content.footer.description}
              </p>
              <div className="flex items-center gap-3">
                {content.footer.socialLinks.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    className="flex size-8 items-center justify-center border border-[#E5E5E5] transition-colors hover:border-[#0A0A0A]"
                    aria-label={item.id}
                  >
                    <SocialIcon id={item.id} />
                  </a>
                ))}
              </div>
            </div>

            {content.footer.columns.map((column) => (
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
              <div className="mb-5 border-b border-[#E5E5E5] pb-3 font-syne text-xs uppercase tracking-[1.2px] text-[#0A0A0A]">
                {content.footer.newsletter.title}
              </div>
              <p className="mb-4 font-manrope text-sm font-semibold text-[#737373]">
                {content.footer.newsletter.description}
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder={content.footer.newsletter.placeholder}
                  className="w-full border border-[#E5E5E5] bg-[#F7F7F7] px-4 py-3 font-manrope text-sm font-semibold text-[#0A0A0A] outline-none transition-colors placeholder:text-[#AAAAAA] focus:border-[#0A0A0A]"
                />
                <button className="w-full border-2 border-[#0A0A0A] bg-[#0A0A0A] py-3 font-syne text-xs uppercase tracking-wide text-white transition-colors hover:border-[#FF5C35] hover:bg-[#FF5C35]">
                  {content.footer.newsletter.buttonLabel}
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 border-t-2 border-[#0A0A0A] pt-8 sm:flex-row sm:items-center">
            <span className="font-manrope text-sm font-semibold text-[#737373]">{content.footer.copyright}</span>
            <div className="flex flex-wrap items-center gap-6">
              {content.footer.legalLinks.map((link) => (
                <a key={link} href="#" className="font-manrope text-sm font-semibold text-[#737373] transition-colors hover:text-[#0A0A0A]">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <AdminFloatingButton />
    </div>
  );
}

function getPreviewThemeId() {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get("previewTheme");
}

function getRequestedThemeId() {
  return getPreviewThemeId() || getStoredThemeId();
}

function resolveBrandLogo(
  brand: ThemePackage["landing"]["brand"] & { logo?: string },
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

function resolveTierClassName(item: SoftwareItem) {
  if (item.tierTone === "dark") {
    return "inline-block bg-[#0A0A0A] px-3 py-1";
  }

  if (item.tierTone === "accent") {
    return "inline-block bg-[#FFE4D9] px-3 py-1";
  }

  return "inline-block bg-[#F0F0F0] px-3 py-1";
}

function resolveTierTextClassName(item: SoftwareItem) {
  if (item.tierTone === "dark") {
    return "font-syne text-xs uppercase tracking-wide text-white";
  }

  return "font-syne text-xs uppercase tracking-wide text-[#0A0A0A]";
}

function ToolIcon({ icon }: { icon: string }) {
  if (icon === "rfp") {
    return (
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.25 0C1.00898 0 0 1.00898 0 2.25V15.75C0 16.991 1.00898 18 2.25 18H11.25C12.491 18 13.5 16.991 13.5 15.75V5.625H9C8.37773 5.625 7.875 5.12227 7.875 4.5V0H2.25ZM9 0V4.5H13.5L9 0Z" fill="#FF5C35" />
      </svg>
    );
  }

  if (icon === "compare") {
    return (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 3.375C0 2.13398 1.00898 1.125 2.25 1.125H15.75C16.991 1.125 18 2.13398 18 3.375V14.625C18 15.866 16.991 16.875 15.75 16.875H2.25C1.00898 16.875 0 15.866 0 14.625V3.375ZM2.25 5.625V14.625H7.875V5.625H2.25ZM15.75 5.625H10.125V14.625H15.75V5.625Z" fill="#FF5C35" />
      </svg>
    );
  }

  if (icon === "expert") {
    return (
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.875 9C6.68153 9 5.53693 8.52589 4.69302 7.68198C3.84911 6.83807 3.375 5.69347 3.375 4.5C3.375 3.30653 3.84911 2.16193 4.69302 1.31802C5.53693 0.474106 6.68153 0 7.875 0C9.06847 0 10.2131 0.474106 11.057 1.31802C11.9009 2.16193 12.375 3.30653 12.375 4.5C12.375 5.69347 11.9009 6.83807 11.057 7.68198C10.2131 8.52589 9.06847 9 7.875 9Z" fill="#FF5C35" />
      </svg>
    );
  }

  return (
    <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <span className="ml-1 font-manrope text-xs font-semibold text-[#737373]">{rating}</span>
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.4274 0.421875C7.30318 0.164062 7.04068 0 6.7524 0C6.46412 0 6.20396 0.164062 6.0774 0.421875L4.57037 3.52266L1.20474 4.01953C0.923491 4.06172 0.689116 4.25859 0.602397 4.52812C0.515678 4.79766 0.585991 5.09531 0.787553 5.29453L3.22974 7.71094L2.65318 11.1258C2.6063 11.407 2.72349 11.693 2.95552 11.8594C3.18755 12.0258 3.49458 12.0469 3.74771 11.9133L6.75474 10.3078L9.76177 11.9133C10.0149 12.0469 10.3219 12.0281 10.554 11.8594C10.786 11.6906 10.9032 11.407 10.8563 11.1258L10.2774 7.71094L12.7196 5.29453C12.9211 5.09531 12.9938 4.79766 12.9047 4.52812C12.8157 4.25859 12.5836 4.06172 12.3024 4.01953L8.93443 3.52266L7.4274 0.421875Z" fill="#FF5C35" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.2797 6.52974C10.5727 6.23677 10.5727 5.76099 10.2797 5.46802L6.52969 1.71802C6.23672 1.42505 5.76094 1.42505 5.46797 1.71802C5.175 2.01099 5.175 2.48677 5.46797 2.77974L7.94062 5.25005H0.75C0.335156 5.25005 0 5.5852 0 6.00005C0 6.41489 0.335156 6.75005 0.75 6.75005H7.93828L5.47031 9.22036C5.17734 9.51333 5.17734 9.98911 5.47031 10.2821C5.76328 10.575 6.23906 10.575 6.53203 10.2821L10.282 6.53208L10.2797 6.52974Z" fill="#FF5C35" />
    </svg>
  );
}

function SocialIcon({ id }: { id: string }) {
  if (id === "youtube") {
    return (
      <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.8826 2.9082C12.7354 2.3539 12.3017 1.91735 11.751 1.7692C10.7528 1.5 6.75011 1.5 6.75011 1.5C6.75011 1.5 2.74745 1.5 1.74922 1.7692C1.19851 1.91738 0.764777 2.3539 0.617566 2.9082C0.350098 3.91289 0.350098 6.00909 0.350098 6.00909C0.350098 6.00909 0.350098 8.1053 0.617566 9.10999C0.764777 9.66429 1.19851 10.0826 1.74922 10.2308C2.74745 10.5 6.75011 10.5 6.75011 10.5C6.75011 10.5 10.7528 10.5 11.751 10.2308C12.3017 10.0826 12.7354 9.66429 12.8826 9.10999C13.1501 8.1053 13.1501 6.00909 13.1501 6.00909C13.1501 6.00909 13.1501 3.91289 12.8826 2.9082ZM5.441 7.91229V4.1059L8.78645 6.00914L5.441 7.91229Z" fill="#737373" />
      </svg>
    );
  }

  return (
    <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.35031 10.4998H0.173438V3.48961H2.35031V10.4998ZM1.2607 2.53336C0.564609 2.53336 0 1.9568 0 1.2607C0 0.926344 0.132824 0.605679 0.369251 0.369251C0.605679 0.132824 0.926344 0 1.2607 0C1.59506 0 1.91573 0.132824 2.15215 0.369251C2.38858 0.605679 2.52141 0.926344 2.52141 1.2607C2.52141 1.9568 1.95656 2.53336 1.2607 2.53336ZM10.4977 10.4998H8.32547V7.08727C8.32547 6.27398 8.30906 5.23102 7.19367 5.23102C6.06187 5.23102 5.88844 6.11461 5.88844 7.02867V10.4998H3.71391V3.48961H5.80172V4.44586H5.83219C6.12281 3.89508 6.83273 3.31383 7.89188 3.31383C10.095 3.31383 10.5 4.76461 10.5 6.64898V10.4998H10.4977Z" fill="#737373" />
    </svg>
  );
}
