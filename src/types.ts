export interface LoadOptions {
  /**
   * Single path or array of paths to `.env` files to load.
   * Defaults to environment-appropriate files (`.env`, `.env.local`, `.env.{NODE_ENV}`, etc.).
   */
  paths?: string | string[];

  /**
   * Enable verbose logging. Set to `"debug"` for even more detail (includes variable source tracking).
   */
  verbose?: boolean | "debug";

  /**
   * Whether to override existing environment variables.
   * When `false` (default), the first occurrence of a key wins.
   */
  overrideExisting?: boolean;

  /**
   * Require all specified `.env` files to exist. If any are missing, loading fails.
   */
  requireAll?: boolean;

  /**
   * Require at least one `.env` file to exist (default: `true`).
   * Set to `false` to silently succeed when no env files are found.
   */
  requireAny?: boolean;

  /**
   * Generate TypeScript declaration files (e.g., `env.d.ts`) for type-safe env access.
   * Pass a string to specify a custom output path.
   */
  generateTypes?: boolean | string;

  /**
   * Generate a typed `env.ts` helper file for accessing environment variables.
   * Pass a string to specify a custom output path.
   */
  generateEnvFile?: boolean | string;

  /**
   * Watch `.env` files for changes and automatically reload environment variables.
   * Uses `chokidar` if available, otherwise falls back to `fs.watch`.
   */
  watch?: boolean;

  /**
   * List of environment variable keys to ignore.
   * Matching keys will be skipped and not set on `process.env`.
   */
  ignore?: string[];
}
