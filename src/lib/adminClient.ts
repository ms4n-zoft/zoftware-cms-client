export const ADMIN_SETTINGS_STORAGE_KEY = "zoftware.adminSettings";

export const DEFAULT_API_BASE_URL =
  import.meta.env.PUBLIC_ZOFTWARE_API_BASE_URL || "http://localhost:3002/api/v1";

export type TenantAdminPayload = {
  partnerId: string;
  slug: string;
  name: string;
  status: "active" | "disabled";
  allowedParentCategoryWeburls: string[];
  allowedSubCategoryWeburls: string[];
  domains: string[];
  themeId: string;
  contentOverrides: Record<string, unknown>;
  features: {
    rfp: boolean;
    leads: boolean;
    sales: boolean;
    publicClient: boolean;
  };
  inventoryPartnerName: string;
};

export type AdminApiResponse<T> = {
  success: boolean;
  data?: T;
  total?: number;
  message?: string;
};

export type AdminSettings = {
  apiBaseUrl?: string;
  adminKey?: string;
  partnerId?: string;
  tenantSlug?: string;
};

export function csvToList(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

export function listToCsv(value: string[] | undefined) {
  return (value ?? []).join(", ");
}

export function normalizeApiBaseUrl(value: string) {
  return value.trim().replace(/\/$/, "");
}

export function normalizeTenantSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function readAdminSettings() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return JSON.parse(
      window.localStorage.getItem(ADMIN_SETTINGS_STORAGE_KEY) ?? "null",
    ) as AdminSettings | null;
  } catch {
    return null;
  }
}

export function writeAdminSettings(settings: AdminSettings) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    ADMIN_SETTINGS_STORAGE_KEY,
    JSON.stringify({
      ...settings,
      apiBaseUrl: normalizeApiBaseUrl(settings.apiBaseUrl || DEFAULT_API_BASE_URL),
    }),
  );
}

export async function adminFetch<T>(
  apiBaseUrl: string,
  adminKey: string,
  path: string,
  options: RequestInit = {},
) {
  const response = await fetch(`${normalizeApiBaseUrl(apiBaseUrl)}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Admin-API-Key": adminKey,
      ...(options.headers || {}),
    },
  });
  const payload = (await response.json()) as AdminApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || `Admin request failed (${response.status})`);
  }

  return payload;
}
