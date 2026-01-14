import { loadEnv } from "./loader";
import path from "path";
import { SYSTEM_SECRETS_PATH } from "../lib/constants";

// Export something
(function auto() {
  // Determine NODE_ENV
  const NODE_ENV = process.env.NODE_ENV || "development";

  // Build paths in dotenv's priority order
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
    generateTypes: NODE_ENV === "development",
  });
})();

export const envLoaded = true;
