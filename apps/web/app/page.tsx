import { getTenantContext, getTenantLabel } from "../lib/tenant-context";

const foundations = [
  "Multi-tenant platform with club subdomains",
  "Permissions-based authorization model",
  "Internationalization from day 0",
  "Local-first development with GitHub, Vercel, and Supabase",
];

export default async function HomePage() {
  const tenantContext = await getTenantContext();

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Sail Tracker</p>
        <h1>Hello world, foundation first.</h1>
        <p className="lede">
          This workspace is set up to prove the path from local development to CI
          before product features are added.
        </p>
      </section>

      <section className="panel">
        <h2>Tenant context</h2>
        <dl className="details">
          <div>
            <dt>Resolved tenant</dt>
            <dd>{getTenantLabel(tenantContext)}</dd>
          </div>
          <div>
            <dt>Hostname</dt>
            <dd>{tenantContext?.hostname ?? "Unavailable"}</dd>
          </div>
          <div>
            <dt>Lookup source</dt>
            <dd>{tenantContext?.lookup ?? "None"}</dd>
          </div>
          <div>
            <dt>Matched by</dt>
            <dd>{tenantContext?.tenant.matchedBy ?? "None"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{tenantContext?.tenant.status ?? "Unknown"}</dd>
          </div>
          <div>
            <dt>Default locale</dt>
            <dd>{tenantContext?.tenant.defaultLocale ?? "Unknown"}</dd>
          </div>
        </dl>
      </section>

      <section className="panel">
        <h2>Current baseline</h2>
        <ul>
          {foundations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
