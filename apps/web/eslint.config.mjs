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
  // Next.js app-specific overrides
  {
    // Next.js uses conventional filenames like page.tsx, layout.tsx, error.tsx, etc.
    // that differ from the exported component name.
    // NOTE: sonarjs/file-name-differ-from-class reports at loc:{line:0,column:0} —
    // ESLint inline disables cannot suppress violations reported before line 1.
    // This scoped config-level override is the only available suppression mechanism.
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      "sonarjs/file-name-differ-from-class": "off",
    },
  },
];
