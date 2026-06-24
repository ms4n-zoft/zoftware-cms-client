import { createHmac, timingSafeEqual } from "node:crypto";
import type { AstroGlobal } from "astro/dist/types/public/context.js";

const ADMIN_PANEL_COOKIE = "zoftware_admin_panel_access";
const ADMIN_PANEL_MAX_AGE_SECONDS = 60 * 60 * 12;
const DEFAULT_ADMIN_PANEL_PASSKEY = "local-admin-0000";

export type AdminGateResult = {
  errorMessage: string;
  formAction: string;
  isAuthorized: boolean;
  redirect?: Response;
};

function getAdminPanelPasskey() {
  return (
    import.meta.env.ADMIN_PANEL_PASSKEY ||
    process.env.ADMIN_PANEL_PASSKEY ||
    DEFAULT_ADMIN_PANEL_PASSKEY
  ).trim();
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    timingSafeEqual(leftBuffer, leftBuffer);
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signSession(expiresAt: number, passkey: string) {
  return createHmac("sha256", passkey)
    .update(`admin-panel:${expiresAt}`)
    .digest("hex");
}

function createSessionToken(passkey: string) {
  const expiresAt = Date.now() + ADMIN_PANEL_MAX_AGE_SECONDS * 1000;
  return `v1.${expiresAt}.${signSession(expiresAt, passkey)}`;
}

function isSessionTokenValid(token: string | undefined, passkey: string) {
  if (!token) return false;

  const [version, expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);

  if (version !== "v1" || !Number.isFinite(expiresAt) || !signature) {
    return false;
  }

  if (Date.now() > expiresAt) {
    return false;
  }

  return safeCompare(signature, signSession(expiresAt, passkey));
}

export async function requireAdminPanelAccess(
  astro: AstroGlobal,
): Promise<AdminGateResult> {
  const passkey = getAdminPanelPasskey();
  const hasValidPasskeyConfig = passkey.length === 16;
  const formAction = `${astro.url.pathname}${astro.url.search}`;
  let errorMessage = "";
  let isAuthorized =
    hasValidPasskeyConfig &&
    isSessionTokenValid(astro.cookies.get(ADMIN_PANEL_COOKIE)?.value, passkey);

  if (!hasValidPasskeyConfig) {
    astro.response.status = 503;
    errorMessage = "Admin panel passkey must be exactly 16 characters.";
  }

  if (!isAuthorized && hasValidPasskeyConfig && astro.request.method === "POST") {
    const formData = await astro.request.formData();
    const submittedPasskey = String(formData.get("passkey") ?? "").trim();

    if (safeCompare(submittedPasskey, passkey)) {
      astro.cookies.set(ADMIN_PANEL_COOKIE, createSessionToken(passkey), {
        httpOnly: true,
        maxAge: ADMIN_PANEL_MAX_AGE_SECONDS,
        path: "/admin",
        sameSite: "lax",
        secure: astro.url.protocol === "https:",
      });

      isAuthorized = true;

      return {
        errorMessage,
        formAction,
        isAuthorized,
        redirect: astro.redirect(formAction, 303),
      };
    }

    astro.response.status = 401;
    errorMessage = "Passkey is incorrect.";
  }

  return {
    errorMessage,
    formAction,
    isAuthorized,
  };
}
