/** @file Foundation smoke test to verify the test infrastructure is operational. */

import { describe, expect, it } from "vitest";

describe("foundation", () => {
  it("keeps the hello-world smoke test green", () => {
    expect.hasAssertions();
    expect("Sail Tracker").toContain("Tracker");
  });
});
