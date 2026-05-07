/** @file Supabase admin API client for server-side tenant and bootstrap queries. */

import { getServerEnv as getServerEnvironment } from "./server-env";

export interface SupabaseTenant {
  default_locale: string;
  name: string;
  slug: string;
  status: TenantStatus;
}

interface SupabaseTenantDomainRow {
  hostname: string;
  tenants: null | SupabaseTenant | SupabaseTenant[];
}

type TenantStatus = "active" | "archived" | "suspended";

/**
 * Checks whether the platform admin profile exists in Supabase.
 * @returns An object describing the bootstrap source and readiness state.
 */
export async function getBootstrapStatus() {
  const platformAdminEmail = getServerEnvironment("PLATFORM_ADMIN_EMAIL");
  const config = getSupabaseAdminConfig();

  if (!config || !platformAdminEmail) {
    return {
      isConfigured: false,
      platformAdminReady: false,
      source: "environment" as const,
    };
  }

  try {
    const response = await supabaseAdminFetch(
      "/rest/v1/profiles?select=id,email&limit=1&email=eq." + encodeURIComponent(platformAdminEmail),
    );

    if (!response?.ok) {
      return {
        isConfigured: true,
        platformAdminReady: false,
        source: "supabase" as const,
      };
    }

    const rows = (await response.json()) as { email: string; id: string; }[];

    return {
      isConfigured: true,
      platformAdminReady: rows.length > 0,
      source: "supabase" as const,
    };
  } catch {
    return {
      isConfigured: true,
      platformAdminReady: false,
      source: "supabase" as const,
    };
  }
}

/**
 * Looks up a tenant record by hostname via the Supabase REST API.
 * @param hostname - The fully-qualified hostname to look up.
 * @returns The matched tenant, or null if not found or on error.
 */
export async function lookupTenantByHostname(hostname: string): Promise<null | SupabaseTenant> {
  try {
    const response = await supabaseAdminFetch("/rest/v1/tenant_domains?select=hostname,tenants!inner(slug,name,status,default_locale)&limit=1&hostname=eq." + encodeURIComponent(hostname));

    if (!response?.ok) {
      return null;
    }

    const rows = (await response.json()) as SupabaseTenantDomainRow[];
    const row = rows[0];
    const tenantData = Array.isArray(row?.tenants) ? row.tenants[0] : row?.tenants;

    return tenantData ?? null;
  } catch {
    return null;
  }
}

/**
 * Resolves the Supabase admin URL and key from the given env reader.
 * @param readEnvironment - A function to read an environment variable by name.
 * @returns An object with url and adminKey, or null if either is missing.
 */
export function resolveSupabaseAdminConfig(readEnvironment: (name: string) => null | string) {
  const url = readEnvironment("NEXT_PUBLIC_SUPABASE_URL");
  const adminKey = readEnvironment("SUPABASE_SECRET_KEY") ?? readEnvironment("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !adminKey) {
    return null;
  }

  return { adminKey, url };
}

/**
 * Retrieves the Supabase admin config from the server environment.
 * @returns The resolved admin config, or null if env vars are missing.
 */
function getSupabaseAdminConfig() {
  return resolveSupabaseAdminConfig(getServerEnvironment);
}

/**
 * Issues an authenticated fetch request to the Supabase REST API.
 * @param pathname - The API path to call (e.g. "/rest/v1/tenants").
 * @param init - Optional fetch init options (method, headers, body).
 * @returns The fetch Response, or null if admin config is unavailable.
 */
async function supabaseAdminFetch(pathname: string, init?: RequestInit) {
  const config = getSupabaseAdminConfig();
  if (!config) {
    return null;
  }

  const url = new URL(pathname, config.url);
  return fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: config.adminKey,
      Authorization: `Bearer ${config.adminKey}`,
      ...init?.headers,
    },
  });
}
