import { describe, expect, it } from "vitest";

describe("foundation", () => {
  it("keeps the hello-world smoke test green", () => {
    expect("Sail Tracker").toContain("Tracker");
  });
});

