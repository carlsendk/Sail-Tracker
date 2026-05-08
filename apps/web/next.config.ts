/** @file Next.js configuration for the web application. */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next's build-time lint pass uses a legacy .eslintrc API and cannot parse
  // our flat config's TypeScript blocks (it errors on `interface`/`as`/etc.).
  // We run `pnpm lint` (eslint . with the flat config + TS parser) in the
  // validate step of pre-commit and CI, so the build-time pass is redundant.
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
};

export default nextConfig;

