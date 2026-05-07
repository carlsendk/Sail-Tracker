import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const currentDir = import.meta.dirname;
const workspaceRoot = resolve(currentDir, "../../..");
const appRoot = resolve(currentDir, "../..");

/**
 *
 */
export function buildEnvLookup(
  fileValues: Iterable<Map<string, string>>,
  runtimeEnvironment: Record<string, string | undefined>,
) {
  return (name: string): null | string => {
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

    return null;
  };
}

/**
 *
 */
export function parseEnvContents(contents: string): Map<string, string> {
  const parsed = new Map<string, string>();

  for (const line of contents.split(/\r?\n/u)) {
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
    const value = rawValue.replaceAll(/^["']|["']$/gu, "");

    if (!parsed.has(key)) {
      parsed.set(key, value);
    }
  }

  return parsed;
}

const loadedEnvironment: Map<string, string>[] = [];

/**
 *
 */
function parseEnvironmentFile(filepath: string) {
  if (!existsSync(filepath)) {
    return;
  }

  const contents = readFileSync(filepath, "utf8");
  loadedEnvironment.push(parseEnvContents(contents));
}

// Prefer the app-local env file, then fall back to the workspace root env file.
parseEnvironmentFile(resolve(appRoot, ".env.local"));
parseEnvironmentFile(resolve(workspaceRoot, ".env.local"));
parseEnvironmentFile(resolve(appRoot, ".env"));
parseEnvironmentFile(resolve(workspaceRoot, ".env"));

const lookupServerEnvironment = buildEnvLookup(loadedEnvironment, process.env);

/**
 *
 */
export function getServerEnv(name: string): null | string {
  return lookupServerEnvironment(name);
}
