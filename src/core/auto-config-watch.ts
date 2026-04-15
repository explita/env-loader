import { loadEnv } from "./loader.js";
import { getEnvFiles } from "../lib/utils.js";

(function auto() {
  // Determine NODE_ENV
  const NODE_ENV = process.env.NODE_ENV || "development";

  // Build paths in priority order
  const paths = getEnvFiles(NODE_ENV);

  loadEnv({
    paths,
    verbose: false,
    requireAll: false,
    overrideExisting: true,
    generateTypes: NODE_ENV === "development",
    generateEnvFile: true,
    watch: true,
  });
})();

// Export something
export const envLoaded = true;
