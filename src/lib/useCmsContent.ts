import { useEffect, useState } from "react";
import {
  getByPath,
  mergeDeep,
  readSiteDraft,
  SITE_DRAFT_CHANGE_EVENT,
} from "./contentOverrides";

type TenantWindow = Window & {
  __ZOFTWARE_TENANT_OVERRIDES__?: Record<string, unknown>;
};

function readTenantOverrides() {
  if (typeof window === "undefined") {
    return {};
  }

  return (window as TenantWindow).__ZOFTWARE_TENANT_OVERRIDES__ ?? {};
}

export function useCmsContent<T>(baseContent: T, path = "") {
  const [content, setContent] = useState(baseContent);

  useEffect(() => {
    const applyDraft = () => {
      const tenantContent = mergeDeep(
        baseContent,
        getByPath(readTenantOverrides(), path),
      );
      setContent(mergeDeep(tenantContent, getByPath(readSiteDraft(), path)));
    };

    applyDraft();
    window.addEventListener("storage", applyDraft);
    window.addEventListener(SITE_DRAFT_CHANGE_EVENT, applyDraft);

    return () => {
      window.removeEventListener("storage", applyDraft);
      window.removeEventListener(SITE_DRAFT_CHANGE_EVENT, applyDraft);
    };
  }, [baseContent, path]);

  return content;
}
