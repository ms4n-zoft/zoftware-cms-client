# Theme Design System

This project now has a shared public-page design-system layer for theme packages.

The goal is simple:

- new pages should be built with a small page skeleton
- the active theme package should control layout feel, typography, color, radii, and shared chrome
- page code should describe structure, not restyle each theme manually

## Active theme contract

Public pages should use `useActiveTheme={true}` on [`src/layouts/BaseLayout.astro`](/Users/work/dev/zoftware-client/src/layouts/BaseLayout.astro).

That applies the currently selected theme package and exposes semantic CSS variables such as:

- `--theme-page-top`
- `--theme-layout-gap`
- `--theme-sidebar-width`
- `--theme-section-gap`
- `--theme-panel-padding`
- `--theme-surface-page`
- `--theme-surface-card`
- `--theme-surface-soft`
- `--theme-surface-hero`
- `--theme-text-heading`
- `--theme-text-body`
- `--theme-text-muted`
- `--theme-border-default`
- `--theme-action-primary`
- `--theme-shadow-card`

These come from [`src/lib/themeEngine.ts`](/Users/work/dev/zoftware-client/src/lib/themeEngine.ts) and the package JSON files in [`src/data/theme-packages`](/Users/work/dev/zoftware-client/src/data/theme-packages).

## Public primitives

Use these Astro components for new public pages:

- [`ThemePageFrame.astro`](/Users/work/dev/zoftware-client/src/components/theme-system/ThemePageFrame.astro)
- [`ThemeSplitLayout.astro`](/Users/work/dev/zoftware-client/src/components/theme-system/ThemeSplitLayout.astro)
- [`ThemeBreadcrumbs.astro`](/Users/work/dev/zoftware-client/src/components/theme-system/ThemeBreadcrumbs.astro)
- [`ThemePageHeader.astro`](/Users/work/dev/zoftware-client/src/components/theme-system/ThemePageHeader.astro)
- [`ThemePanel.astro`](/Users/work/dev/zoftware-client/src/components/theme-system/ThemePanel.astro)
- [`ThemeSection.astro`](/Users/work/dev/zoftware-client/src/components/theme-system/ThemeSection.astro)

## Recommended page skeleton

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import ThemeBreadcrumbs from "../components/theme-system/ThemeBreadcrumbs.astro";
import ThemePageFrame from "../components/theme-system/ThemePageFrame.astro";
import ThemePageHeader from "../components/theme-system/ThemePageHeader.astro";
import ThemePanel from "../components/theme-system/ThemePanel.astro";
import ThemeSection from "../components/theme-system/ThemeSection.astro";
import ThemeSplitLayout from "../components/theme-system/ThemeSplitLayout.astro";
---

<BaseLayout title="Page title" description="Page description" useActiveTheme={true}>
  <ThemePageFrame>
    <ThemeSplitLayout>
      <ThemeBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Page" }]} />
      <ThemePageHeader title="Page" eyebrow="Context" description="Theme-aware page content." />
      <ThemePanel variant="hero">
        <p>Primary summary content</p>
      </ThemePanel>
      <ThemeSection title="Section title" description="Section description">
        <div>Section body</div>
      </ThemeSection>

      <ThemePanel slot="aside">
        <p>Sidebar content</p>
      </ThemePanel>
    </ThemeSplitLayout>
  </ThemePageFrame>
</BaseLayout>
```

## Rules for future pages

- Keep public pages on the public shell so header and footer follow the active package.
- Use semantic primitives first; only add page-specific classes for domain content.
- Add new theme differences through package layout/color/type tokens, not page-level `if theme === ...`.
- Keep internal app pages, settings, and onboarding on the app theme unless explicitly themed.
- If a new page needs a new primitive, add it once to the theme-system layer and reuse it.
