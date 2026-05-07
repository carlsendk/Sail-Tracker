#!/usr/bin/env node
/**
 * Map a `state:*` label change to the Sail-Tracker Backlog Project's Status field.
 *
 * SAFETY:
 *   - Every external value is passed via `execFileSync` arg arrays (no shell, no string
 *     interpolation), so command injection is impossible even if GH webhooks deliver
 *     hostile values.
 *   - The issue number is validated as a positive integer before use.
 *
 * Usage:
 *   node scripts/gh-sync-status.mjs --issue 42 --label state:ready --action labeled
 *
 * Env required:
 *   GH_TOKEN         (PAT with project + issues scopes)
 *   PROJECT_OWNER    (e.g. "carlsendk")
 *   PROJECT_NUMBER   (e.g. "1")
 */
import { parseArgs } from "node:util";
import { execFileSync } from "node:child_process";
import process from "node:process";

const STATE_TO_STATUS = {
  "state:ready": "Ready",
  "state:in-progress": "In Progress",
  "state:in-review": "In Review",
  "state:blocked": "Blocked",
};

function gh(args) {
  return execFileSync("gh", args, { encoding: "utf8" });
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function main() {
  const { values } = parseArgs({
    options: {
      issue: { type: "string" },
      label: { type: "string" },
      action: { type: "string" },
    },
  });

  if (!values.label?.startsWith("state:")) {
    return;
  }
  if (values.action !== "labeled") {
    return;
  }

  const status = STATE_TO_STATUS[values.label];
  if (!status) {
    return;
  }

  const issueNumber = Number(values.issue);
  if (!Number.isInteger(issueNumber) || issueNumber <= 0) {
    fail(`Invalid issue number: ${values.issue}`);
  }

  const owner = process.env.PROJECT_OWNER;
  const projectNumber = process.env.PROJECT_NUMBER;
  if (!owner || !projectNumber) {
    fail("PROJECT_OWNER and PROJECT_NUMBER env vars required");
  }

  const itemList = JSON.parse(
    gh(["project", "item-list", projectNumber, "--owner", owner, "--format", "json", "--limit", "500"]),
  );
  const item = itemList.items.find((i) => i.content?.number === issueNumber);
  if (!item) {
    console.log(`Issue #${issueNumber} not in project; nothing to do.`);
    return;
  }

  const fieldList = JSON.parse(
    gh(["project", "field-list", projectNumber, "--owner", owner, "--format", "json"]),
  );
  const statusField = fieldList.fields.find((f) => f.name === "Status");
  if (!statusField) {
    fail("Status field not found on project");
  }
  const option = statusField.options.find((o) => o.name === status);
  if (!option) {
    fail(`Status option not found: ${status}`);
  }

  const projectId = item.projectId ?? itemList.items[0]?.projectId;
  if (!projectId) {
    fail("Could not resolve project id from item list");
  }

  gh([
    "project",
    "item-edit",
    "--id",
    item.id,
    "--field-id",
    statusField.id,
    "--project-id",
    projectId,
    "--single-select-option-id",
    option.id,
  ]);
  console.log(`Set issue #${issueNumber} Status → ${status}`);
}

main();
