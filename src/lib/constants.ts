/**
 * System-wide secrets paths
 * Windows: C:\etc\internal-secrets.env, C:\etc\shared-secrets.env
 * Linux/macOS: /etc/internal-secrets.env, /etc/shared-secrets.env
 */
export const SYSTEM_SECRETS_PATH = [
  "/etc/internal-secrets.env",
  "/etc/shared-secrets.env",
];
