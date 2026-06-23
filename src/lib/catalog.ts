export type CatalogCategory = {
  name: string;
  title?: string;
  weburl: string;
  description?: string;
  meta_description?: string;
  trending?: boolean;
  monthly_searches?: number;
  interest_generated?: number;
  subcategories?: CatalogSubcategory[];
  products?: string[];
};

export type CatalogSubcategory = {
  name: string;
  title?: string;
  weburl: string;
  description?: string;
  meta_description?: string;
  parent_cat_weburl?: string;
  parent?: {
    name: string;
    weburl: string;
  };
  product_count?: number;
  products?: string[];
};

export type CatalogProduct = {
  product_name: string;
  company?: string;
  logo_url?: string | null;
  weburl: string;
  overview?: string;
  description?: string;
  usp?: string;
  website?: string;
  hq_location?: string;
  year_founded?: number;
  social_links?: Record<string, string>;
  snapshots?: Array<{ name: string; Location: string }>;
  videos?: string[];
  ratings?: {
    overall_rating?: number;
    ease_of_use?: number;
    breadth_of_features?: number;
    ease_of_implementation?: number;
    value_for_money?: number;
    customer_support?: number;
    total_reviews?: number;
  };
  tags?: Array<{ color: string; tag: string }>;
  badges?: Array<{ name: string; icon?: string }>;
  parent_categories?: Array<{ name: string; weburl: string }>;
  category?: Array<{ name: string; weburl: string }>;
  features?: Array<{ name: string }>;
  other_features?: string[];
  integrations?: Array<{ name: string; website: string; logo: string }>;
  languages?: string[];
  feature_overview?: string;
  pricing_overview?: string;
  pricing?: Array<Record<string, unknown>>;
  pricing_details_web_url?: string;
  reviews_strengths?: string[];
  reviews_weakness?: string[];
  is_verify?: boolean;
  keywords?: string[];
  best_for?: string;
};

export function formatNumber(value?: number) {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

export function getProductInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function getLocalProductLogo(product: CatalogProduct) {
  const logo = product.logo_url;
  return typeof logo === "string" && logo.trim().length > 0 ? logo : "";
}

export function getRating(product: CatalogProduct) {
  return product.ratings?.overall_rating ?? 0;
}

export function getReviewCount(product: CatalogProduct) {
  return product.ratings?.total_reviews ?? 0;
}
