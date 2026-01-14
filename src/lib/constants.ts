import path from "path";

/**
 * System-wide secrets path
 * Windows: C:\etc\internal-secrets.env
 * Linux/macOS: /etc/internal-secrets.env
 */
export const SYSTEM_SECRETS_PATH = "/etc/internal-secrets.env";

/**
 * Default environment variable files priority
 */
export const DEFAULT_ENV_PATHS = [
  path.join(process.cwd(), ".env"),
  SYSTEM_SECRETS_PATH,
];
