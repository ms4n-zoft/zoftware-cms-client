import type {
  CatalogCategory,
  CatalogProduct,
  CatalogSubcategory,
} from "./catalog";

const DEFAULT_API_BASE_URL = "http://localhost:3002/api/v1";
const DEFAULT_PARTNER_SLUG = "peko";

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
  total?: number;
  meta?: Record<string, unknown>;
};

export type TenantClientConfig = {
  partnerId: string;
  slug: string;
  name: string;
  themeId: string;
  contentOverrides: Record<string, unknown>;
  features: {
    rfp: boolean;
    leads: boolean;
    sales: boolean;
    publicClient: boolean;
  };
  scope: {
    parentCategoryWeburls: string[];
    subCategoryWeburls: string[];
  };
};

export type ProductListResponse = {
  parentCategory?: CatalogCategory;
  subCategory?: CatalogSubcategory;
  products: CatalogProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

export type SubcategoryListResponse = {
  parentCategory: CatalogCategory | null;
  subCategories: CatalogSubcategory[];
};

function getApiBaseUrl() {
  return (
    import.meta.env.ZOFTWARE_API_BASE_URL ||
    import.meta.env.PUBLIC_ZOFTWARE_API_BASE_URL ||
    DEFAULT_API_BASE_URL
  ).replace(/\/$/, "");
}

export function getDefaultPartnerSlug() {
  return (
    import.meta.env.PUBLIC_DEFAULT_PARTNER_SLUG ||
    import.meta.env.DEFAULT_PARTNER_SLUG ||
    DEFAULT_PARTNER_SLUG
  );
}

function encodePathPart(value: string) {
  return encodeURIComponent(value);
}

async function apiGet<T>(path: string): Promise<T | null> {
  const response = await fetch(`${getApiBaseUrl()}${path}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Backend request failed: GET ${path} returned ${response.status}`,
    );
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
}

async function apiPost<T>(path: string, body: unknown): Promise<T | null> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Backend request failed: POST ${path} returned ${response.status}`,
    );
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
}

export function getTenantConfig(partnerSlug: string) {
  return apiGet<TenantClientConfig>(
    `/client/${encodePathPart(partnerSlug)}/config`,
  );
}

export function resolveTenantByHost(host: string) {
  return apiGet<TenantClientConfig>(
    `/client/resolve?host=${encodeURIComponent(host)}`,
  );
}

export function getParentCategories(partnerSlug: string) {
  return apiGet<CatalogCategory[]>(
    `/client/${encodePathPart(partnerSlug)}/categories/parent`,
  );
}

export function getParentCategory(partnerSlug: string, categorySlug: string) {
  return apiGet<CatalogCategory>(
    `/client/${encodePathPart(partnerSlug)}/categories/parent/${encodePathPart(
      categorySlug,
    )}`,
  );
}

export function getParentSubcategories(
  partnerSlug: string,
  categorySlug: string,
) {
  return apiGet<SubcategoryListResponse>(
    `/client/${encodePathPart(
      partnerSlug,
    )}/categories/parent/${encodePathPart(categorySlug)}/subcategories`,
  );
}

export function getSubcategory(partnerSlug: string, subcategorySlug: string) {
  return apiGet<CatalogSubcategory>(
    `/client/${encodePathPart(partnerSlug)}/categories/sub/${encodePathPart(
      subcategorySlug,
    )}`,
  );
}

export function getProductsByParentCategory(
  partnerSlug: string,
  categorySlug: string,
  options: { page?: number; limit?: number; sortBy?: "rating" | "name" } = {},
) {
  const params = new URLSearchParams();
  if (options.page) params.set("page", String(options.page));
  if (options.limit) params.set("limit", String(options.limit));
  if (options.sortBy) params.set("sortBy", options.sortBy);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiGet<ProductListResponse>(
    `/client/${encodePathPart(
      partnerSlug,
    )}/products/parent-category/${encodePathPart(categorySlug)}${query}`,
  );
}

export function getProductsBySubcategory(
  partnerSlug: string,
  subcategorySlug: string,
  options: { page?: number; limit?: number; sortBy?: "rating" | "name" } = {},
) {
  const params = new URLSearchParams();
  if (options.page) params.set("page", String(options.page));
  if (options.limit) params.set("limit", String(options.limit));
  if (options.sortBy) params.set("sortBy", options.sortBy);

  const query = params.toString() ? `?${params.toString()}` : "";
  return apiGet<ProductListResponse>(
    `/client/${encodePathPart(
      partnerSlug,
    )}/products/sub-category/${encodePathPart(subcategorySlug)}${query}`,
  );
}

export function getProduct(partnerSlug: string, productSlug: string) {
  return apiGet<CatalogProduct>(
    `/client/${encodePathPart(partnerSlug)}/products/details/${encodePathPart(
      productSlug,
    )}`,
  );
}

export function getBatchProducts(partnerSlug: string, weburls: string[]) {
  return apiPost<CatalogProduct[]>(
    `/client/${encodePathPart(partnerSlug)}/products/batch`,
    { weburls },
  );
}
