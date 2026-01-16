export interface LoadOptions {
  paths?: string | string[]; // Single path or array of paths
  verbose?: boolean | "debug"; // Enable verbose logging
  overrideExisting?: boolean; // Override existing environment variables
  requireAll?: boolean; // Require all specified files
  requireAny?: boolean; // Require at least one file (default: true)
  generateTypes?: boolean | string; // Generate TypeScript declarations
  generateEnvFile?: boolean | string; // Generate env.ts file
}
