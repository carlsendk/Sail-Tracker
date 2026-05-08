/** @file Tenant resolution logic: maps incoming hostname to a TenantContext. */

import { headers } from "next/headers";

import { getServerEnvironment } from "./server-environment";
import { lookupTenantByHostname } from "./supabase-admin";

/** Represents the resolved tenant for the current request, including lookup metadata. */
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
export const getTenantContext = async (): Promise<null | TenantContext> => {
  const requestHeaders = await headers();
  const rawHost =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!rawHost) {
    // eslint-disable-next-line unicorn/no-null -- no host header → no tenant
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

  const environmentTenant = resolveTenantFromEnvironment(hostname);
  if (!environmentTenant) {
    // eslint-disable-next-line unicorn/no-null -- no environment tenant matched either
    return null;
  }

  return {
    hostname,
    lookup: "environment",
    tenant: environmentTenant,
  };
};

/**
 * Returns a human-readable label for the resolved tenant context.
 * @param context - The resolved TenantContext, or null.
 * @returns A label string such as "Club (club)" or "No tenant resolved".
 */
export const getTenantLabel = (context: null | TenantContext): string => {
  if (!context) {
    return "No tenant resolved";
  }

  return `${context.tenant.name} (${context.tenant.slug})`;
};

/**
 * Resolves a tenant from environment-configured slugs without a Supabase query.
 * @param slug - The slug to match against NEXT_PUBLIC_REAL_TENANT_SLUG and NEXT_PUBLIC_DEMO_TENANT_SLUG.
 * @param matchedBy - How the slug was obtained ("domain" or "localhost-fallback").
 * @returns The tenant object, or null if the slug does not match any configured tenant.
 */
const getEnvironmentTenant = (
  slug: string,
  matchedBy: "domain" | "localhost-fallback",
): null | TenantContext["tenant"] => {
  const realSlug =
    getServerEnvironment("NEXT_PUBLIC_REAL_TENANT_SLUG") ?? "club";
  const demoSlug =
    getServerEnvironment("NEXT_PUBLIC_DEMO_TENANT_SLUG") ?? "demo";
  const defaultLocale =
    getServerEnvironment("NEXT_PUBLIC_DEFAULT_LOCALE") ?? "en";

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

  // eslint-disable-next-line unicorn/no-null -- no matching tenant slug
  return null;
};

/**
 * Returns the localhost-fallback tenant slug if the hostname is localhost or *.localhost.
 * @param hostname - The normalised hostname from the incoming request.
 * @returns The fallback slug string, or null if the hostname is not a localhost variant.
 */
const getLocalFallbackSlug = (hostname: string): null | string => {
  const localhostFallbackEnabled =
    (getServerEnvironment("NEXT_PUBLIC_ENABLE_LOCALHOST_TENANT_FALLBACK") ??
      "true") === "true";

  if (!localhostFallbackEnabled) {
    // eslint-disable-next-line unicorn/no-null -- feature flag disabled
    return null;
  }

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return getServerEnvironment("NEXT_PUBLIC_REAL_TENANT_SLUG") ?? "club";
  }

  const localhostMatch = /^([\d\-a-z]+)\.localhost$/v.exec(hostname);
  if (localhostMatch) {
    // eslint-disable-next-line unicorn/no-null -- capture group can be undefined, null matches return type
    return localhostMatch[1] ?? null;
  }

  // eslint-disable-next-line unicorn/no-null -- hostname is not a localhost variant
  return null;
};

/**
 * Queries Supabase for the tenant associated with the given hostname.
 * @param hostname - The normalised hostname to look up in the tenant_domains table.
 * @returns The tenant object shaped as TenantContext["tenant"], or null if not found.
 */
const lookupSupabaseTenantByHostname = async (
  hostname: string,
): Promise<null | TenantContext["tenant"]> => {
  const tenantData = await lookupTenantByHostname(hostname);
  if (!tenantData) {
    // eslint-disable-next-line unicorn/no-null -- Supabase lookup returned null/undefined
    return null;
  }

  return {
    defaultLocale: tenantData.default_locale,
    matchedBy: "domain",
    name: tenantData.name,
    slug: tenantData.slug,
    status: tenantData.status,
  };
};

/**
 * Strips the port from a Host header value and lower-cases the result.
 * @param host - The raw Host header value (e.g. "example.com:3000").
 * @returns The normalised hostname without port (e.g. "example.com").
 */
const normalizeHostname = (host: string): string =>
  (host.split(":")[0] ?? host).trim().toLowerCase();

/**
 * Resolves a tenant from environment configuration when Supabase returns nothing.
 * @param hostname - The normalised hostname to attempt environment-based resolution for.
 * @returns The resolved tenant object, or null if no environment tenant matches.
 */
const resolveTenantFromEnvironment = (
  hostname: string,
): null | TenantContext["tenant"] => {
  const localhostFallbackSlug = getLocalFallbackSlug(hostname);
  if (localhostFallbackSlug) {
    return getEnvironmentTenant(localhostFallbackSlug, "localhost-fallback");
  }

  return getEnvironmentTenant(hostname.split(".")[0] ?? "", "domain");
};
