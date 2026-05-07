/**
 * @file apps/web ESLint config — extends the root flat config.
 *
 * This file intentionally keeps only Next.js app-specific overrides.
 * All plugin loading and base rule configuration lives in the root
 * eslint.config.mjs to avoid duplication across workspace packages.
 */

import rootConfig from "../../eslint.config.mjs";

export default [
  ...rootConfig,
  // Next.js app-specific overrides can go here as B3-B6 issues land.
  // Example: tightening specific rule families to "error" once cleaned up.
];
