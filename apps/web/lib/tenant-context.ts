import { headers } from "next/headers";

import { getServerEnv as getServerEnvironment } from "./server-env";
import { lookupTenantByHostname } from "./supabase-admin";

export interface TenantContext {
  hostname: string;
  lookup: "environment" | "supabase";
  tenant: {
    defaultLocale: string;
    matchedBy: "domain" | "localhost-fallback";
    name: string;
    slug: string;
    status: TenantStatus;
  };
}

type TenantStatus = "active" | "archived" | "suspended";

/**
 *
 */
export async function getTenantContext(): Promise<null | TenantContext> {
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

/**
 *
 */
export function getTenantLabel(context: null | TenantContext): string {
  if (!context) {
    return "No tenant resolved";
  }

  return `${context.tenant.name} (${context.tenant.slug})`;
}

/**
 *
 */
function getEnvironmentTenant(slug: string, matchedBy: "domain" | "localhost-fallback"): null | TenantContext["tenant"] {
  const realSlug = getServerEnvironment("NEXT_PUBLIC_REAL_TENANT_SLUG") ?? "club";
  const demoSlug = getServerEnvironment("NEXT_PUBLIC_DEMO_TENANT_SLUG") ?? "demo";
  const defaultLocale = getServerEnvironment("NEXT_PUBLIC_DEFAULT_LOCALE") ?? "en";

  if (slug === realSlug) {
    return {
      defaultLocale,
      matchedBy,
      name: "Club",
      slug: realSlug,
      status: "active",
    };
  }

  if (slug === demoSlug) {
    return {
      defaultLocale,
      matchedBy,
      name: "Demo Club",
      slug: demoSlug,
      status: "active",
    };
  }

  return null;
}

/**
 *
 */
function getLocalFallbackSlug(hostname: string): null | string {
  const localhostFallbackEnabled =
    (getServerEnvironment("NEXT_PUBLIC_ENABLE_LOCALHOST_TENANT_FALLBACK") ?? "true") === "true";

  if (!localhostFallbackEnabled) {
    return null;
  }

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return getServerEnvironment("NEXT_PUBLIC_REAL_TENANT_SLUG") ?? "club";
  }

  const localhostMatch = /^([a-z\d-]+)\.localhost$/u.exec(hostname);
  if (localhostMatch) {
    return localhostMatch[1] ?? null;
  }

  return null;
}

/**
 *
 */
async function lookupSupabaseTenantByHostname(hostname: string): Promise<null | TenantContext["tenant"]> {
  const tenantData = await lookupTenantByHostname(hostname);
  if (!tenantData) {
    return null;
  }

  return {
    defaultLocale: tenantData.default_locale,
    matchedBy: "domain",
    name: tenantData.name,
    slug: tenantData.slug,
    status: tenantData.status,
  };
}

/**
 *
 */
function normalizeHostname(host: string): string {
  return (host.split(":")[0] ?? host).trim().toLowerCase();
}

/**
 *
 */
async function resolveTenantFromEnvironment(hostname: string): Promise<null | TenantContext["tenant"]> {
  const localhostFallbackSlug = getLocalFallbackSlug(hostname);
  if (localhostFallbackSlug) {
    return getEnvironmentTenant(localhostFallbackSlug, "localhost-fallback");
  }

  return getEnvironmentTenant(hostname.split(".")[0] ?? "", "domain");
}
