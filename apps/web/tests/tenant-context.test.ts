/** @file Tests for tenant context resolution from hostname. */

import { describe, expect, it } from "vitest";

import { getTenantLabel } from "../lib/tenant-context";

describe("tenant context", () => {
  it("formats the resolved tenant label", () => {
    expect.hasAssertions();
    expect(
      getTenantLabel({
        hostname: "club.localhost",
        lookup: "environment",
        tenant: {
          defaultLocale: "en",
          matchedBy: "localhost-fallback",
          name: "Club",
          slug: "club",
          status: "active",
        },
      }),
    ).toBe("Club (club)");
  });

  it("returns a fallback label when no tenant exists", () => {
    expect.hasAssertions();
    // eslint-disable-next-line unicorn/no-null -- testing the null path of getTenantLabel (accepts null | TenantContext)
    expect(getTenantLabel(null)).toBe("No tenant resolved");
  });
});
