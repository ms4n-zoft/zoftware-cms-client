import { useEffect, useMemo, useState } from "react";
import {
  adminFetch,
  DEFAULT_API_BASE_URL,
  readAdminSettings,
  writeAdminSettings,
  type TenantAdminPayload,
} from "../lib/adminClient";

export default function AdminHome() {
  const apiBaseUrl = DEFAULT_API_BASE_URL;
  const [adminKey, setAdminKey] = useState("");
  const [tenants, setTenants] = useState<TenantAdminPayload[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const activeTenants = useMemo(
    () => tenants.filter((tenant) => tenant.status === "active").length,
    [tenants],
  );
  const disabledTenants = tenants.length - activeTenants;

  useEffect(() => {
    const savedSettings = readAdminSettings();

    if (!savedSettings) {
      return;
    }

    setAdminKey(savedSettings.adminKey || "");

    if (savedSettings.adminKey) {
      void loadTenants(DEFAULT_API_BASE_URL, savedSettings.adminKey);
    }
  }, []);

  async function loadTenants(nextApiBaseUrl = apiBaseUrl, nextAdminKey = adminKey) {
    setIsLoading(true);
    setMessage("");

    try {
      writeAdminSettings({
        apiBaseUrl: nextApiBaseUrl,
        adminKey: nextAdminKey,
      });

      const payload = await adminFetch<TenantAdminPayload[]>(
        nextApiBaseUrl,
        nextAdminKey,
        "/admin/tenants",
      );
      const sortedTenants = [...(payload.data || [])].sort((left, right) =>
        left.name.localeCompare(right.name),
      );

      setTenants(sortedTenants);
      setHasLoaded(true);
      setMessage(`Loaded ${payload.total ?? sortedTenants.length} partners`);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  function rememberTenant(tenant: TenantAdminPayload) {
    writeAdminSettings({
      apiBaseUrl,
      adminKey,
      partnerId: tenant.partnerId,
      tenantSlug: tenant.slug,
    });
  }

  return (
    <main className="admin-management-shell">
      <header className="admin-management-header">
        <a href="/admin" aria-current="page">
          Partner Admin
        </a>
        <nav aria-label="Admin navigation">
          <a href="/admin/onboarding">Create partner</a>
          <a href="/admin/manage">Edit partner</a>
        </nav>
      </header>

      <section className="admin-management-hero">
        <div>
          <p>Admin home</p>
          <h1>Manage partners.</h1>
          <span>Create a partner or edit an existing one.</span>
        </div>
        <a className="theme-button-link theme-button-link--primary" href="/admin/onboarding">
          Create partner
        </a>
      </section>

      <section className="admin-management-panel" aria-label="Connection settings">
        <div className="admin-home__connection">
          <label className="editor-field">
            <span>
              <b>Access key</b>
              <small>Stored only in this browser.</small>
            </span>
            <input
              type="password"
              value={adminKey}
              autoComplete="off"
              spellCheck="false"
              onChange={(event) => setAdminKey(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="admin-reset"
            disabled={isLoading || !adminKey}
            onClick={() => void loadTenants()}
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {message ? (
          <p className="admin-status" aria-live="polite">
            {message}
          </p>
        ) : null}
      </section>

      <section className="admin-overview-stats" aria-label="Partner summary">
        <article>
          <span>Total partners</span>
          <strong>{tenants.length}</strong>
        </article>
        <article>
          <span>Active</span>
          <strong>{activeTenants}</strong>
        </article>
        <article>
          <span>Disabled</span>
          <strong>{disabledTenants}</strong>
        </article>
      </section>

      <section className="admin-partner-grid" aria-label="Partners">
        <a className="admin-partner-card admin-partner-card--create" href="/admin/onboarding">
          <span>
            <small>New partner</small>
            <b>Create partner</b>
            <em>Set up a new partner.</em>
          </span>
          <i aria-hidden="true">+</i>
        </a>

        {tenants.map((tenant) => (
          <article className="admin-partner-card" key={tenant.slug}>
            <span>
              <small>{tenant.status}</small>
              <b>{tenant.name}</b>
              <em>/{tenant.slug}</em>
            </span>
            <p>
              {tenant.allowedParentCategoryWeburls.length} categories
            </p>
            <div>
              <a
                href={`/admin/manage?tenant=${encodeURIComponent(tenant.slug)}`}
                onClick={() => rememberTenant(tenant)}
              >
                Edit
              </a>
              <a href={`/${tenant.slug}`} target="_blank" rel="noreferrer">
                Open
              </a>
            </div>
          </article>
        ))}
      </section>

      {!hasLoaded && !tenants.length ? (
        <p className="admin-empty-note">
          Add the access key and refresh to load partners.
        </p>
      ) : null}
    </main>
  );
}
