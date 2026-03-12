import { getServerEnv } from "./server-env";

type TenantStatus = "active" | "suspended" | "archived";

export type SupabaseTenant = {
  slug: string;
  name: string;
  status: TenantStatus;
  default_locale: string;
};

type SupabaseTenantDomainRow = {
  hostname: string;
  tenants: SupabaseTenant | SupabaseTenant[] | null;
};

export function resolveSupabaseAdminConfig(readEnv: (name: string) => string | null) {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const adminKey = readEnv("SUPABASE_SECRET_KEY") ?? readEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!url || !adminKey) {
    return null;
  }

  return { url, adminKey };
}

function getSupabaseAdminConfig() {
  return resolveSupabaseAdminConfig(getServerEnv);
}

async function supabaseAdminFetch(pathname: string, init?: RequestInit) {
  const config = getSupabaseAdminConfig();
  if (!config) {
    return null;
  }

  const url = new URL(pathname, config.url);
  return fetch(url, {
    ...init,
    headers: {
      apikey: config.adminKey,
      Authorization: `Bearer ${config.adminKey}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}

export async function lookupTenantByHostname(hostname: string): Promise<SupabaseTenant | null> {
  try {
    const response = await supabaseAdminFetch("/rest/v1/tenant_domains?select=hostname,tenants!inner(slug,name,status,default_locale)&limit=1&hostname=eq." + encodeURIComponent(hostname));

    if (!response || !response.ok) {
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

export async function getBootstrapStatus() {
  const platformAdminEmail = getServerEnv("PLATFORM_ADMIN_EMAIL");
  const config = getSupabaseAdminConfig();

  if (!config || !platformAdminEmail) {
    return {
      source: "environment" as const,
      isConfigured: false,
      platformAdminReady: false,
    };
  }

  try {
    const response = await supabaseAdminFetch(
      "/rest/v1/profiles?select=id,email&limit=1&email=eq." + encodeURIComponent(platformAdminEmail),
    );

    if (!response || !response.ok) {
      return {
        source: "supabase" as const,
        isConfigured: true,
        platformAdminReady: false,
      };
    }

    const rows = (await response.json()) as Array<{ id: string; email: string }>;

    return {
      source: "supabase" as const,
      isConfigured: true,
      platformAdminReady: rows.length > 0,
    };
  } catch {
    return {
      source: "supabase" as const,
      isConfigured: true,
      platformAdminReady: false,
    };
  }
}
