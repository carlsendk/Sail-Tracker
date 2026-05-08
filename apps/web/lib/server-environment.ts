/** @file Server-side environment variable loading from .env files and process.env. */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Use fileURLToPath rather than import.meta.dirname: Next's webpack server
// bundle does not propagate import.meta.dirname (it resolves to undefined),
// which causes "paths[0] argument must be of type string" at build time
// during page-data collection.
// eslint-disable-next-line unicorn/prefer-import-meta-properties -- import.meta.dirname is undefined in Next's server webpack bundle (verified at build time); see comment above
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(currentDirectory, "../../..");
const appRoot = path.resolve(currentDirectory, "../..");

/**
 * Builds a lookup function that checks runtime env first, then file-loaded values.
 * @param fileValues - Iterable of parsed env file maps (app-local then workspace root).
 * @param runtimeEnvironment - The process.env record to check first.
 * @returns A function that resolves a variable name to its string value or null.
 */
export const buildEnvironmentLookup = (
  fileValues: Iterable<Map<string, string>>,
  runtimeEnvironment: Record<string, string | undefined>,
) => {
  return (name: string): null | string => {
    // eslint-disable-next-line security/detect-object-injection -- name is a controlled env var key, not user input
    const runtimeValue = runtimeEnvironment[name];
    if (runtimeValue && runtimeValue.length > 0) {
      return runtimeValue;
    }

    for (const values of fileValues) {
      const fileValue = values.get(name);
      if (fileValue && fileValue.length > 0) {
        return fileValue;
      }
    }

    // eslint-disable-next-line unicorn/no-null -- variable not found in any source
    return null;
  };
}

/**
 * Parses the text content of a .env file into a key-value map.
 * @param contents - Raw text content of the .env file.
 * @returns A map of environment variable names to their string values.
 */
export const parseEnvironmentContents = (contents: string): Map<string, string> => {
  const parsed = new Map<string, string>();

  // eslint-disable-next-line sonarjs/too-many-break-or-continue-in-loop -- two continues needed: skip blank/comment lines and skip lines without '='
  for (const line of contents.split(/\r?\n/v)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replaceAll(/^["']|["']$/gv, "");

    if (!parsed.has(key)) {
      parsed.set(key, value);
    }
  }

  return parsed;
}

const loadedEnvironment: Map<string, string>[] = [];

/**
 * Reads and parses an .env file at the given path, if it exists.
 * @param filepath - Absolute path to the env file to load.
 */
const parseEnvironmentFile = (filepath: string) => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- filepath is a resolved absolute path, not user input
  if (!existsSync(filepath)) {
    return;
  }

  // eslint-disable-next-line security/detect-non-literal-fs-filename -- filepath is a resolved absolute path, not user input
  const contents = readFileSync(filepath, "utf8");
  loadedEnvironment.push(parseEnvironmentContents(contents));
}

// Prefer the app-local env file, then fall back to the workspace root env file.
parseEnvironmentFile(path.resolve(appRoot, ".env.local"));
parseEnvironmentFile(path.resolve(workspaceRoot, ".env.local"));
parseEnvironmentFile(path.resolve(appRoot, ".env"));
parseEnvironmentFile(path.resolve(workspaceRoot, ".env"));

// eslint-disable-next-line sonarjs/no-reference-error -- process is available in Next.js server-side runtime (Node.js)
const lookupServerEnvironment = buildEnvironmentLookup(loadedEnvironment, process.env);

/**
 * Looks up an environment variable by name from loaded .env files and process.env.
 * @param name - The environment variable name to resolve.
 * @returns The resolved value, or null if not set.
 */
export const getServerEnvironment = (name: string): null | string => lookupServerEnvironment(name);
