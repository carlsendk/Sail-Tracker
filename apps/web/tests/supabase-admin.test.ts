/** @file Tests for Supabase admin config resolution. */

import { describe, expect, it } from "vitest";

import { resolveSupabaseAdminConfig } from "../lib/supabase-admin";

describe("supabase admin config", () => {
  it("uses the documented secret key path", () => {
    const config = resolveSupabaseAdminConfig((name) => {
      const values: Record<string, string> = {
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        SUPABASE_SECRET_KEY: "sb_secret_example",
      };

      return values[name] ?? null;
    });

    expect(config).toEqual({
      adminKey: "sb_secret_example",
      url: "https://example.supabase.co",
    });
  });

  it("accepts the legacy service role fallback", () => {
    const config = resolveSupabaseAdminConfig((name) => {
      const values: Record<string, string> = {
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        SUPABASE_SERVICE_ROLE_KEY: "service-role-example",
      };

      return values[name] ?? null;
    });

    expect(config).toEqual({
      adminKey: "service-role-example",
      url: "https://example.supabase.co",
    });
  });

  it("returns null when config is incomplete", () => {
    expect(resolveSupabaseAdminConfig(() => null)).toBeNull();
  });
});
