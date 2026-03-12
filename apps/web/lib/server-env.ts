import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(currentDir, "../../..");
const appRoot = resolve(currentDir, "../..");

export function parseEnvContents(contents: string): Map<string, string> {
  const parsed = new Map<string, string>();

  for (const line of contents.split(/\r?\n/)) {
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
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (!parsed.has(key)) {
      parsed.set(key, value);
    }
  }

  return parsed;
}

export function buildEnvLookup(
  fileValues: Iterable<Map<string, string>>,
  runtimeEnv: NodeJS.ProcessEnv,
) {
  return (name: string): string | null => {
    const runtimeValue = runtimeEnv[name];
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

const loadedEnv: Map<string, string>[] = [];

function parseEnvFile(filepath: string) {
  if (!existsSync(filepath)) {
    return;
  }

  const contents = readFileSync(filepath, "utf8");
  loadedEnv.push(parseEnvContents(contents));
}

// Prefer the app-local env file, then fall back to the workspace root env file.
parseEnvFile(resolve(appRoot, ".env.local"));
parseEnvFile(resolve(workspaceRoot, ".env.local"));
parseEnvFile(resolve(appRoot, ".env"));
parseEnvFile(resolve(workspaceRoot, ".env"));

const lookupServerEnv = buildEnvLookup(loadedEnv, process.env);

export function getServerEnv(name: string): string | null {
  return lookupServerEnv(name);
}
