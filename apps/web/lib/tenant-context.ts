/** @file Tenant resolution logic: maps incoming hostname to a TenantContext. */

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
 * Resolves the active tenant from the current request's Host header.
 * @returns The resolved TenantContext, or null if no tenant could be matched.
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
 * Returns a human-readable label for the resolved tenant context.
 * @param context - The resolved TenantContext, or null.
 * @returns A label string such as "Club (club)" or "No tenant resolved".
 */
export function getTenantLabel(context: null | TenantContext): string {
  if (!context) {
    return "No tenant resolved";
  }

  return `${context.tenant.name} (${context.tenant.slug})`;
}

/**
 * Resolves a tenant from environment-configured slugs without a Supabase query.
 * @param slug - The slug to match against NEXT_PUBLIC_REAL_TENANT_SLUG and NEXT_PUBLIC_DEMO_TENANT_SLUG.
 * @param matchedBy - How the slug was obtained ("domain" or "localhost-fallback").
 * @returns The tenant object, or null if the slug does not match any configured tenant.
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
 * Returns the localhost-fallback tenant slug if the hostname is localhost or *.localhost.
 * @param hostname - The normalised hostname from the incoming request.
 * @returns The fallback slug string, or null if the hostname is not a localhost variant.
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
 * Queries Supabase for the tenant associated with the given hostname.
 * @param hostname - The normalised hostname to look up in the tenant_domains table.
 * @returns The tenant object shaped as TenantContext["tenant"], or null if not found.
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
 * Strips the port from a Host header value and lower-cases the result.
 * @param host - The raw Host header value (e.g. "example.com:3000").
 * @returns The normalised hostname without port (e.g. "example.com").
 */
function normalizeHostname(host: string): string {
  return (host.split(":")[0] ?? host).trim().toLowerCase();
}

/**
 * Resolves a tenant from environment configuration when Supabase returns nothing.
 * @param hostname - The normalised hostname to attempt environment-based resolution for.
 * @returns The tenant object, or null if no environment tenant could be matched.
 */
async function resolveTenantFromEnvironment(hostname: string): Promise<null | TenantContext["tenant"]> {
  const localhostFallbackSlug = getLocalFallbackSlug(hostname);
  if (localhostFallbackSlug) {
    return getEnvironmentTenant(localhostFallbackSlug, "localhost-fallback");
  }

  return getEnvironmentTenant(hostname.split(".")[0] ?? "", "domain");
}
