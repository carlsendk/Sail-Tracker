/**
 * @file Programmatic lint spec for the no-inline-svg architectural rule (B4 #8).
 * Asserts that `<svg>` JSX fires the rule outside `packages/ui/src/icons/`
 * and is silent inside that directory. Run via:
 * node --test tests/eslint-no-inline-svg.test.mjs
 *
 * This file runs under the Node.js built-in test runner (node:test), NOT vitest.
 * Vitest-specific import rules are suppressed accordingly.
 */
/* eslint-disable vitest/require-hook -- node:test runner: describe/it at top level is the correct pattern */
import { ESLint } from "eslint";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
// eslint-disable-next-line vitest/no-import-node-test -- intentional: this spec uses node:test runner, not vitest
import { describe, it } from "node:test";

// eslint-disable-next-line sonarjs/variable-name -- __dirname is the Node.js conventional name
const __dirname = import.meta.dirname;
const rootDirectory = path.resolve(__dirname, "..");

const eslint = new ESLint({ cwd: rootDirectory });

// Synthetic file paths — must NEVER exist on disk. The `.synthetic.` infix
// distinguishes test fixtures from real source files. We use one fixture
// outside the icons directory (rule fires) and one inside (rule silent).
// The "outside" fixture lives directly in `packages/ui/src/` (not `icons/`),
// outside `apps/web/` so it does NOT engage the type-aware parser whose
// tsconfig would reject this synthetic non-existent path.
const outsideFixture = path.join(
  rootDirectory,
  "packages/ui/src/__lint-fixture__.synthetic.tsx",
);
const insideFixture = path.join(
  rootDirectory,
  "packages/ui/src/icons/__lint-fixture__.synthetic.tsx",
);

for (const fixture of [outsideFixture, insideFixture]) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- path is built from import.meta.dirname + a constant string; no user input
  if (existsSync(fixture)) {
    throw new Error(
      `Synthetic test fixture path "${fixture}" must not exist on disk; ` +
        "rename or delete the real file. See tests/eslint-no-inline-svg.test.mjs.",
    );
  }
}

const RULE_ID = "no-restricted-syntax";

// Pinned to the rule's exact remediation prefix so the matcher does not
// false-positive on a future co-tenant of `no-restricted-syntax` whose
// message happens to mention "svg". If the rule's message is changed in
// `eslint.config.mjs`, update this prefix to match.
const NO_INLINE_SVG_PREFIX = "Inline <svg> JSX is not allowed.";

const lintAt = async (source, filePath) => {
  const [result] = await eslint.lintText(source, { filePath });
  return result?.messages ?? [];
};

const hasInlineSvgViolation = messages =>
  messages.some(
    m =>
      m.ruleId === RULE_ID &&
      typeof m.message === "string" &&
      m.message.startsWith(NO_INLINE_SVG_PREFIX),
  );

const ruleSummary = messages =>
  messages.map(m => `${m.ruleId}:${m.line}:${m.column}`).join(", ");

const componentSource = "export const Icon = () => <svg />;\n";

// The "outside" fixture lives directly under `packages/ui/src/` — sibling of
// the icons opt-out scope, NOT under `apps/web/`. This satisfies two
// constraints simultaneously: (a) outside the icons dir so the rule applies,
// (b) outside `apps/web/` so the type-aware parser is not engaged (its
// tsconfig would otherwise reject this synthetic non-existent path).
describe("no-inline-svg — outside packages/ui/src/icons/", () => {
  it("fires on inline <svg> in a TSX component", async () => {
    const messages = await lintAt(componentSource, outsideFixture);
    assert.ok(
      hasInlineSvgViolation(messages),
      `expected ${RULE_ID} violation mentioning svg; got: ${ruleSummary(messages)}`,
    );
  });

  it("does not fire when the component contains no <svg>", async () => {
    const messages = await lintAt(
      "export const Box = () => <div />;\n",
      outsideFixture,
    );
    assert.ok(
      !hasInlineSvgViolation(messages),
      `unexpected ${RULE_ID} violation mentioning svg; got: ${ruleSummary(messages)}`,
    );
  });
});

describe("no-inline-svg — inside packages/ui/src/icons/", () => {
  it("does not fire on inline <svg> when the file lives in the icons directory", async () => {
    const messages = await lintAt(componentSource, insideFixture);
    assert.ok(
      !hasInlineSvgViolation(messages),
      `unexpected ${RULE_ID} violation inside icons dir; got: ${ruleSummary(messages)}`,
    );
  });
});
