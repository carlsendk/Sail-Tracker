#!/usr/bin/env node
/** @file Configures git to use the .githooks directory for hooks. */

import { execFileSync } from "node:child_process";

execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
  stdio: "inherit",
});

console.log("Configured git hooks path to .githooks");
