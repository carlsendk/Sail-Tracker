/**
 * @file Stylelint configuration for the Sail-Tracker monorepo.
 *
 * Stylelint v16+ dropped all stylistic rules, so Prettier owns formatting
 * and Stylelint owns CSS correctness only. No `stylelint-config-prettier`
 * is needed (no rule overlap with Prettier).
 *
 * Tailwind v4 integration: at-rules introduced by Tailwind are whitelisted
 * via `at-rule-no-unknown`'s `ignoreAtRules` so plain CSS files using
 * `@import "tailwindcss"`, `@theme`, `@apply`, etc. don't error.
 */

const tailwindAtRules = [
  "apply",
  "config",
  "custom-variant",
  "layer",
  "plugin",
  "reference",
  "source",
  "theme",
  "utility",
  "variant",
];

/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "at-rule-no-unknown": [true, { ignoreAtRules: tailwindAtRules }],
    "import-notation": "string",
  },
};
