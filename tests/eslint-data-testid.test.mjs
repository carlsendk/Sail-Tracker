/**
 * @file Programmatic lint spec for the data-testid architectural rule (B5 #9).
 * Asserts that interactive elements (`<button>`, `<a>`, JSX with `role="button"`)
 * are required to carry a `data-testid` attribute outside test files. Run via:
 * node --test tests/eslint-data-testid.test.mjs
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

// Synthetic file paths — must NEVER exist on disk. The non-test fixture lives
// under `packages/ui/src/` (sibling of icons opt-out, NOT in apps/web/ to avoid
// the type-aware parser rejecting synthetic non-existent paths). The test
// fixture lives at a `*.test.tsx` path so the test-file override engages.
const componentFixture = path.join(
  rootDirectory,
  "packages/ui/src/__lint-fixture__.synthetic.tsx",
);
const testFixture = path.join(
  rootDirectory,
  "packages/ui/src/__lint-fixture__.synthetic.test.tsx",
);

for (const fixture of [componentFixture, testFixture]) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- path is built from import.meta.dirname + a constant string; no user input
  if (existsSync(fixture)) {
    throw new Error(
      `Synthetic test fixture path "${fixture}" must not exist on disk; ` +
        "rename or delete the real file. See tests/eslint-data-testid.test.mjs.",
    );
  }
}

const RULE_ID = "no-restricted-syntax";

// Pinned to the rule's exact remediation prefix so the matcher does not
// false-positive on a future co-tenant of `no-restricted-syntax` whose
// message happens to mention test-id. Update if the rule's message changes
// in `eslint.config.mjs`.
const TESTID_PREFIX = "Interactive element requires a `data-testid`";

const lintAt = async (source, filePath) => {
  const [result] = await eslint.lintText(source, { filePath });
  return result?.messages ?? [];
};

const hasMissingTestidViolation = messages =>
  messages.some(
    m =>
      m.ruleId === RULE_ID &&
      typeof m.message === "string" &&
      m.message.startsWith(TESTID_PREFIX),
  );

const ruleSummary = messages =>
  messages.map(m => `${m.ruleId}:${m.line}:${m.column}`).join(", ");

describe("data-testid — <button>", () => {
  it("fires when a <button> has no data-testid", async () => {
    const messages = await lintAt(
      "export const X = () => <button>Click</button>;\n",
      componentFixture,
    );
    assert.ok(
      hasMissingTestidViolation(messages),
      `expected ${RULE_ID} violation on <button> without data-testid; got: ${ruleSummary(messages)}`,
    );
  });

  it("does not fire when a <button> has data-testid", async () => {
    const messages = await lintAt(
      'export const X = () => <button data-testid="x">Click</button>;\n',
      componentFixture,
    );
    assert.ok(
      !hasMissingTestidViolation(messages),
      `unexpected ${RULE_ID} violation on <button data-testid>; got: ${ruleSummary(messages)}`,
    );
  });
});

describe("data-testid — <a>", () => {
  it("fires when an <a> has no data-testid", async () => {
    const messages = await lintAt(
      'export const X = () => <a href="/">Home</a>;\n',
      componentFixture,
    );
    assert.ok(
      hasMissingTestidViolation(messages),
      `expected ${RULE_ID} violation on <a> without data-testid; got: ${ruleSummary(messages)}`,
    );
  });

  it("does not fire when an <a> has data-testid", async () => {
    const messages = await lintAt(
      'export const X = () => <a href="/" data-testid="x">Home</a>;\n',
      componentFixture,
    );
    assert.ok(
      !hasMissingTestidViolation(messages),
      `unexpected ${RULE_ID} violation on <a data-testid>; got: ${ruleSummary(messages)}`,
    );
  });
});

describe("data-testid — role='button'", () => {
  it("fires when a JSX element with role='button' has no data-testid", async () => {
    const messages = await lintAt(
      'export const X = () => <div role="button">Click</div>;\n',
      componentFixture,
    );
    assert.ok(
      hasMissingTestidViolation(messages),
      `expected ${RULE_ID} violation on role='button' without data-testid; got: ${ruleSummary(messages)}`,
    );
  });

  it("does not fire when a JSX element with role='button' has data-testid", async () => {
    const messages = await lintAt(
      'export const X = () => <div role="button" data-testid="x">Click</div>;\n',
      componentFixture,
    );
    assert.ok(
      !hasMissingTestidViolation(messages),
      `unexpected ${RULE_ID} violation on role='button' with data-testid; got: ${ruleSummary(messages)}`,
    );
  });

  // Locks in the documented limit: `role={"button"}` (expression form) is NOT
  // caught by the selector. If a future maintainer tightens the selector to
  // cover the expression form, they must also update this test.
  it('does NOT fire on role={"button"} (expression form) — documented limit', async () => {
    const messages = await lintAt(
      'export const X = () => <div role={"button"}>Click</div>;\n',
      componentFixture,
    );
    assert.ok(
      !hasMissingTestidViolation(messages),
      `expected the expression-form role={"button"} to be uncaught (documented limit); got: ${ruleSummary(messages)}`,
    );
  });
});

describe("data-testid — test-file exemption", () => {
  it("does not fire inside *.test.tsx files", async () => {
    const messages = await lintAt(
      "export const X = () => <button>Click</button>;\n",
      testFixture,
    );
    assert.ok(
      !hasMissingTestidViolation(messages),
      `unexpected ${RULE_ID} violation inside test file; got: ${ruleSummary(messages)}`,
    );
  });
});
