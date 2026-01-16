import { loadEnv } from "./loader.js";
import path from "path";
import { SYSTEM_SECRETS_PATH } from "../lib/constants.js";

(function auto() {
  // Determine NODE_ENV
  const NODE_ENV = process.env.NODE_ENV || "development";

  // Build paths in priority order
  const paths = [
    SYSTEM_SECRETS_PATH,
    `.env.${NODE_ENV}.local`,
    `.env.${NODE_ENV}`,
    ".env.local",
    ".env",
  ].map((p) => path.resolve(process.cwd(), p));

  loadEnv({
    paths,
    verbose: false,
    requireAll: false,
    overrideExisting: true,
    generateTypes: NODE_ENV === "development",
    generateEnvFile: true,
  });
})();

// Export something
export const envLoaded = true;
