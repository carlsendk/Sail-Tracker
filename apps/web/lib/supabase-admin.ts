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
 *
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
 *
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
 *
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
 *
 */
function getSupabaseAdminConfig() {
  return resolveSupabaseAdminConfig(getServerEnvironment);
}

/**
 *
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
