/** @file Home page component displaying the resolved tenant context and bootstrap status. */

import { getBootstrapStatus } from "../lib/supabase-admin";
import { getTenantContext, getTenantLabel } from "../lib/tenant-context";

const foundations = [
  "Multi-tenant platform with club subdomains",
  "Permissions-based authorization model",
  "Internationalization from day 0",
  "Local-first development with GitHub, Vercel, and Supabase",
];

const TEXT = {
  appName: "Sail Tracker",
  bootstrapReady: "Bootstrap ready",
  bootstrapSource: "Bootstrap source",
  currentBaseline: "Current baseline",
  defaultLocale: "Default locale",
  heading: "Hello world, foundation first.",
  hostname: "Hostname",
  lede: "This workspace is set up to prove the path from local development to CI before product features are added.",
  lookupSource: "Lookup source",
  matchedBy: "Matched by",
  no: "No",
  resolvedTenant: "Resolved tenant",
  status: "Status",
  tenantContext: "Tenant context",
  yes: "Yes",
} as const;

/**
 * The homepage server component, rendering tenant and bootstrap information.
 * @returns The rendered homepage markup.
 */
const HomePage = async () => {
  const tenantContext = await getTenantContext();
  const bootstrapStatus = await getBootstrapStatus();

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">{TEXT.appName}</p>
        <h1>{TEXT.heading}</h1>
        <p className="lede">{TEXT.lede}</p>
      </section>

      <section className="panel">
        <h2>{TEXT.tenantContext}</h2>
        <dl className="details">
          <div>
            <dt>{TEXT.resolvedTenant}</dt>
            <dd>{getTenantLabel(tenantContext)}</dd>
          </div>
          <div>
            <dt>{TEXT.hostname}</dt>
            <dd>{tenantContext?.hostname ?? "Unavailable"}</dd>
          </div>
          <div>
            <dt>{TEXT.lookupSource}</dt>
            <dd>{tenantContext?.lookup ?? "None"}</dd>
          </div>
          <div>
            <dt>{TEXT.matchedBy}</dt>
            <dd>{tenantContext?.tenant.matchedBy ?? "None"}</dd>
          </div>
          <div>
            <dt>{TEXT.status}</dt>
            <dd>{tenantContext?.tenant.status ?? "Unknown"}</dd>
          </div>
          <div>
            <dt>{TEXT.defaultLocale}</dt>
            <dd>{tenantContext?.tenant.defaultLocale ?? "Unknown"}</dd>
          </div>
          <div>
            <dt>{TEXT.bootstrapSource}</dt>
            <dd>{bootstrapStatus.source}</dd>
          </div>
          <div>
            <dt>{TEXT.bootstrapReady}</dt>
            <dd>{bootstrapStatus.platformAdminReady ? TEXT.yes : TEXT.no}</dd>
          </div>
        </dl>
      </section>

      <section className="panel">
        <h2>{TEXT.currentBaseline}</h2>
        <ul>
          {foundations.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default HomePage;
