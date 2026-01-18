import path from "path";
import fs from "fs";
import type { LoadOptions } from "../types.js";
import { loadEnv } from "./loader.js";
import { SYSTEM_SECRETS_PATH } from "../lib/constants.js";

/**
 * EnvLoader helpers
 *
 * @example
 * ```ts
 * EnvLoader.loadWithPrecedence([
 *   "/etc/internal-secrets.env",
 *   "/etc/default/myapp",
 *   path.join(process.cwd(), ".env"),
 * ]);
 * ```
 */
export const EnvLoader = {
  /**
   * Load with precedence: later files override earlier ones
   *
   * @param paths
   * @param options
   * @returns
   */
  loadWithPrecedence: (
    paths: string[],
    options?: Omit<LoadOptions, "paths">,
  ): boolean => {
    return loadEnv({
      paths,
      overrideExisting: true,
      ...options,
    });
  },

  /**
   * Load system and app envs
   *
   * @param appEnvPath
   * @returns
   */
  loadSystemAndApp: (appEnvPath?: string): boolean => {
    const paths = [
      SYSTEM_SECRETS_PATH,
      appEnvPath || path.join(process.cwd(), ".env"),
    ].filter(Boolean);

    return loadEnv({
      paths,
      verbose: process.env["NODE_ENV"] === "development",
      overrideExisting: true,
    });
  },

  /**
   * Load for different environments
   * @param env
   * @returns
   */
  loadForEnvironment: (
    env: "development" | "staging" | "production" | (string & {}),
  ): boolean => {
    const basePaths = [
      SYSTEM_SECRETS_PATH,
      path.join(process.cwd(), `.env.${env}`),
      path.join(process.cwd(), ".env"),
    ];

    return loadEnv({
      paths: basePaths,
      requireAny: true,
      overrideExisting: true,
      verbose: true,
    });
  },
};

// Type-safe environment variable getter
export function getEnv(
  key: keyof NodeJS.ProcessEnv | (string & {}),
  defaultValue?: string,
): string {
  const value = process.env[key];
  if (value !== undefined) return value;

  if (defaultValue !== undefined) return defaultValue;

  // Throw in development to catch missing env vars early
  if (process.env["NODE_ENV"] === "development") {
    console.warn(`[env-loader]: Environment variable "${key}" is not defined`);
  }

  return "";
}

// Check if variables are loaded
/**
 * Check if variables are loaded
 *
 * @param keys
 * @returns
 */
export function hasKeys(
  ...keys: (keyof NodeJS.ProcessEnv | (string & {}))[]
): boolean {
  return keys.every((key) => process.env[key] !== undefined);
}

// Get all loaded keys from specific files
/**
 * Get all loaded keys from specific files
 *
 * @param filePaths
 * @returns
 */
export function getKeys(filePaths?: string[]): Map<string, string[]> {
  const result = new Map<string, string[]>();

  const basePaths = filePaths || [
    SYSTEM_SECRETS_PATH,
    path.join(process.cwd(), ".env"),
  ];

  basePaths.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const vars: string[] = [];

        content.split("\n").forEach((line) => {
          const trimmedLine = line.trim();
          if (
            trimmedLine &&
            !trimmedLine.startsWith("#") &&
            trimmedLine.includes("=")
          ) {
            const equalsIndex = trimmedLine.indexOf("=");
            const key = trimmedLine.substring(0, equalsIndex).trim();
            if (key) {
              vars.push(key);
            }
          }
        });

        result.set(filePath, vars);
      } catch (error) {
        result.set(filePath, []);
      }
    }
  });

  return result;
}
