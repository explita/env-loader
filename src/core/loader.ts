import type { LoadOptions } from "../types.js";
import fs from "fs";
import path from "path";
import { generateEnvTypes } from "./generate-types.js";
import { SYSTEM_SECRETS_PATH } from "../lib/constants.js";
import { generateEnvFileImpl } from "./generate-env-file.js";
import { watchFiles } from "./watcher.js";

export function loadEnv(options?: LoadOptions | string | string[]): boolean {
  // Handle various input types
  let config: LoadOptions;

  if (typeof options === "string") {
    config = { paths: options };
  } else if (Array.isArray(options)) {
    config = { paths: options };
  } else if (options) {
    config = options;
  } else {
    config = {};
  }

  // Default paths if none specified
  const defaultPaths = [
    path.join(process.cwd(), ".env"), // Project .env
    SYSTEM_SECRETS_PATH, // System-wide secrets
  ];

  // Normalize paths to array
  const envPaths: string[] = [];

  if (config.paths) {
    if (Array.isArray(config.paths)) {
      envPaths.push(...config.paths);
    } else {
      envPaths.push(config.paths);
    }
  } else {
    envPaths.push(...defaultPaths);
  }

  const verbose = config.verbose ?? false;
  const overrideExisting = config.overrideExisting ?? false;
  const requireAll = config.requireAll ?? false;
  const requireAny = config.requireAny ?? true;
  let generateTypes = config.generateTypes ?? false;
  let generateEnvFile = config.generateEnvFile ?? false;
  const watch = config.watch ?? false;

  if (process.env.NODE_ENV === "production") {
    generateTypes = false;
    generateEnvFile = false;
  }

  try {
    // Find which files exist
    const existingFiles: string[] = [];
    const missingFiles: string[] = [];

    envPaths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        existingFiles.push(filePath);
      } else {
        missingFiles.push(filePath);
      }
    });

    // Log missing files if verbose
    if (verbose && missingFiles.length > 0) {
      console.warn(
        `[env-loader]: Env files not found: ${missingFiles.join(", ")}`,
      );
    }

    // Check if we have enough files
    if (existingFiles.length === 0) {
      if (verbose) {
        console.warn(
          `[env-loader]: No env files found. Tried: ${envPaths.join(", ")}`,
        );
      }
      return !requireAny; // If we don't require any, return true
    }

    if (requireAll && missingFiles.length > 0) {
      if (verbose) {
        console.error(
          `[env-loader]: Required files missing: ${missingFiles.join(", ")}`,
        );
      }
      return false;
    }

    if (verbose) {
      console.log(
        `[env-loader]: Loading env files (${existingFiles.length} of ${envPaths.length}):`,
      );

      existingFiles.forEach((file) => console.log(`[env-loader]: ✓ ${file}`));

      if (missingFiles.length > 0) {
        missingFiles.forEach((file) =>
          console.log(`[env-loader]: ✗ ${file} (not found)`),
        );
      }
    }

    // Load files in order (later files override earlier ones if overrideExisting is true)
    let totalLoaded = 0;
    const loadedVars = new Set<string>();

    for (const filePath of existingFiles) {
      try {
        const content = fs.readFileSync(filePath, "utf8");
        const lines = content.split("\n");
        let fileLoaded = 0;
        const fileName = path.basename(filePath);

        lines.forEach((line: string, lineNumber: number) => {
          const trimmedLine = line.trim();

          // Skip comments and empty lines
          if (!trimmedLine || trimmedLine.startsWith("#")) {
            return;
          }

          // Handle 'export ' prefix
          let workingLine = trimmedLine;
          if (workingLine.startsWith("export ")) {
            workingLine = workingLine.substring(7).trim();
          }

          // Find the first equals sign
          const equalsIndex = workingLine.indexOf("=");
          if (equalsIndex === -1) {
            if (verbose) {
              console.warn(
                `[env-loader]: ${fileName}:${lineNumber}: No '=' found, skipping: "${workingLine.substring(
                  0,
                  50,
                )}..."`,
              );
            }
            return;
          }

          // Extract key and value
          const key = workingLine.substring(0, equalsIndex).trim();
          let value = workingLine.substring(equalsIndex + 1).trim();

          // Skip if no key
          if (!key) {
            if (verbose) {
              console.warn(
                `[env-loader]: ${fileName}:${lineNumber}: Empty key, skipping`,
              );
            }
            return;
          }

          // Remove inline comments
          const commentIndex = value.indexOf("#");
          if (commentIndex !== -1) {
            value = value.substring(0, commentIndex).trim();
          }

          // Remove surrounding quotes
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }

          // Skip empty values (unless explicitly empty string)
          // if (value === "") {
          //   // Check if it's meant to be empty string vs missing
          //   if (workingLine.substring(equalsIndex + 1).trim() === "") {
          //     // It's an explicit empty string
          //     value = "";
          //   } else {
          //     // It's actually empty
          //     if (verbose) {
          //       console.warn(
          //         `[env-loader]: ${fileName}:${lineNumber}: Empty value for key '${key}', skipping`
          //       );
          //     }
          //     return;
          //   }
          // }

          // Check if we should override
          const alreadyLoaded = loadedVars.has(key);
          if (alreadyLoaded && !overrideExisting) {
            if (verbose) {
              console.log(
                `[env-loader]: ${fileName}:${lineNumber}: Key '${key}' already loaded, skipping`,
              );
            }
            return;
          }

          // Set the environment variable
          process.env[key] = value;
          loadedVars.add(key);
          fileLoaded++;
          totalLoaded++;

          if (verbose) {
            const shouldMask =
              key.toLowerCase().includes("key") ||
              key.toLowerCase().includes("secret") ||
              key.toLowerCase().includes("password") ||
              key.toLowerCase().includes("token");

            const displayValue = shouldMask
              ? "***" + (value.length > 4 ? value.slice(-4) : "****")
              : value;

            const overrideFlag = alreadyLoaded ? " (override)" : "";
            console.log(
              `[env-loader]: ${fileName}:${lineNumber}: ${key}=${displayValue}${overrideFlag}`,
            );
          }
        });

        if (verbose && fileLoaded > 0) {
          console.log(
            `[env-loader]: → Loaded ${fileLoaded} variables from ${fileName}`,
          );
        }
      } catch (fileError) {
        console.error(
          `[env-loader]: Error reading file ${filePath}:`,
          fileError,
        );
        if (requireAll) {
          return false;
        }
      }
    }

    const sortedKeys = Array.from(loadedVars).sort();

    generateEnvTypes(sortedKeys, generateTypes);
    generateEnvFileImpl(sortedKeys, generateEnvFile);
    //@ts-ignore
    if (!config?.__internalReload) {
      watchFiles({
        watch,
        path: existingFiles,
        options: { ...config, paths: existingFiles },
      });
    }

    if (verbose) {
      const loadedKeys = Array.from(loadedVars);
      console.log(
        `\n[env-loader]: ✅ Loaded ${totalLoaded} unique environment variables:`,
      );
      console.log(`   Files: ${existingFiles.length}/${envPaths.length}`);
      console.log(`   Variables: ${loadedKeys.sort().join(", ")}`);

      // Show which file each var came from (for debugging)
      if (verbose === "debug") {
        console.log("\nVariable sources:");
        existingFiles.forEach((filePath) => {
          const content = fs.readFileSync(filePath, "utf8");
          const lines = content.split("\n");
          const fileVars: string[] = [];

          lines.forEach((line) => {
            const trimmedLine = line.trim();
            if (
              trimmedLine &&
              !trimmedLine.startsWith("#") &&
              trimmedLine.includes("=")
            ) {
              const equalsIndex = trimmedLine.indexOf("=");
              const key = trimmedLine.substring(0, equalsIndex).trim();
              if (key && loadedVars.has(key)) {
                fileVars.push(key);
              }
            }
          });

          if (fileVars.length > 0) {
            console.log(
              `  ${path.basename(filePath)}: ${fileVars.sort().join(", ")}`,
            );
          }
        });
      }
    }

    return totalLoaded > 0 || !requireAny;
  } catch (error) {
    console.error(`[env-loader]: Error in loadEnv:`, error);
    return false;
  }
}
