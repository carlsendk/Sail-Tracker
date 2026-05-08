#!/usr/bin/env node
/** @file Configures git to use the .githooks directory for hooks. */

import { execFileSync } from "node:child_process";

// eslint-disable-next-line sonarjs/no-os-command-from-path -- git is a known trusted tool, always resolved from PATH
execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
  stdio: "inherit",
});

console.log("Configured git hooks path to .githooks");
