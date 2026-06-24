import {
  getProductInitials,
  getRating,
  getReviewCount,
  type CatalogCategory,
  type CatalogProduct,
} from "./catalog";
import type { ThemePackage } from "./themeEngine";

export type LandingSoftwareItem = ThemePackage["landing"]["catalog"]["items"][number] & {
  categoryWeburl?: string;
  company?: string;
  logoUrl?: string | null;
  reviewCount?: number;
  weburl?: string;
};

export type LandingCategoryLink = {
  name: string;
  weburl: string;
  description?: string;
};

export function buildLandingCategories(categories: CatalogCategory[]) {
  const names = categories.map((category) => category.name).filter(Boolean);
  return ["All", ...Array.from(new Set(names))];
}

export function buildLandingCategoryLinks(categories: CatalogCategory[]): LandingCategoryLink[] {
  return categories.map((category) => ({
    name: category.name,
    weburl: category.weburl,
    description: category.description || category.meta_description,
  }));
}

export function productsToLandingItems(products: CatalogProduct[]): LandingSoftwareItem[] {
  return products.map((product, index) => {
    const parentCategory = product.parent_categories?.[0] ?? product.category?.[0] ?? null;
    const rating = getRating(product);

    return {
      abbr: getProductInitials(product.product_name),
      name: product.product_name,
      category: parentCategory?.name || "Software",
      categoryWeburl: parentCategory?.weburl,
      company: product.company,
      logoUrl: product.logo_url,
      rating,
      reviewCount: getReviewCount(product),
      tier: product.best_for || product.company || "Recommended",
      tierTone: resolveTierTone(rating, index),
      description: product.overview || product.description || product.usp || "Software profile available for comparison.",
      weburl: product.weburl,
    };
  });
}

function resolveTierTone(rating: number, index: number): LandingSoftwareItem["tierTone"] {
  if (rating >= 4.7 || index % 5 === 0) {
    return "dark";
  }

  if (rating >= 4.4 || index % 3 === 0) {
    return "accent";
  }

  return "neutral";
}
