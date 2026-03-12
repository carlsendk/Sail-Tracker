import { headers } from "next/headers";
import { lookupTenantByHostname } from "./supabase-admin";

type TenantStatus = "active" | "suspended" | "archived";

export type TenantContext = {
  hostname: string;
  lookup: "supabase" | "environment";
  tenant: {
    slug: string;
    name: string;
    status: TenantStatus;
    defaultLocale: string;
    matchedBy: "domain" | "localhost-fallback";
  };
};

function normalizeHostname(host: string): string {
  return host.split(":")[0].trim().toLowerCase();
}

function getLocalFallbackSlug(hostname: string): string | null {
  const localhostFallbackEnabled =
    (process.env.NEXT_PUBLIC_ENABLE_LOCALHOST_TENANT_FALLBACK ?? "true") === "true";

  if (!localhostFallbackEnabled) {
    return null;
  }

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return process.env.NEXT_PUBLIC_REAL_TENANT_SLUG ?? "club";
  }

  const localhostMatch = hostname.match(/^([a-z0-9-]+)\.localhost$/);
  if (localhostMatch) {
    return localhostMatch[1] ?? null;
  }

  return null;
}

function getEnvironmentTenant(slug: string, matchedBy: "domain" | "localhost-fallback"): TenantContext["tenant"] | null {
  const realSlug = process.env.NEXT_PUBLIC_REAL_TENANT_SLUG ?? "club";
  const demoSlug = process.env.NEXT_PUBLIC_DEMO_TENANT_SLUG ?? "demo";
  const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "en";

  if (slug === realSlug) {
    return {
      slug: realSlug,
      name: "Club",
      status: "active",
      defaultLocale,
      matchedBy,
    };
  }

  if (slug === demoSlug) {
    return {
      slug: demoSlug,
      name: "Demo Club",
      status: "active",
      defaultLocale,
      matchedBy,
    };
  }

  return null;
}

async function lookupSupabaseTenantByHostname(hostname: string): Promise<TenantContext["tenant"] | null> {
  const tenantData = await lookupTenantByHostname(hostname);
  if (!tenantData) {
    return null;
  }

  return {
    slug: tenantData.slug,
    name: tenantData.name,
    status: tenantData.status,
    defaultLocale: tenantData.default_locale,
    matchedBy: "domain",
  };
}

async function resolveTenantFromEnvironment(hostname: string): Promise<TenantContext["tenant"] | null> {
  const localhostFallbackSlug = getLocalFallbackSlug(hostname);
  if (localhostFallbackSlug) {
    return getEnvironmentTenant(localhostFallbackSlug, "localhost-fallback");
  }

  return getEnvironmentTenant(hostname.split(".")[0] ?? "", "domain");
}

export async function getTenantContext(): Promise<TenantContext | null> {
  const requestHeaders = await headers();
  const rawHost = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!rawHost) {
    return null;
  }

  const hostname = normalizeHostname(rawHost);
  const supabaseTenant = await lookupSupabaseTenantByHostname(hostname);

  if (supabaseTenant) {
    return {
      hostname,
      lookup: "supabase",
      tenant: supabaseTenant,
    };
  }

  const environmentTenant = await resolveTenantFromEnvironment(hostname);
  if (!environmentTenant) {
    return null;
  }

  return {
    hostname,
    lookup: "environment",
    tenant: environmentTenant,
  };
}

export function getTenantLabel(context: TenantContext | null): string {
  if (!context) {
    return "No tenant resolved";
  }

  return `${context.tenant.name} (${context.tenant.slug})`;
}
