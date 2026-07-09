# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-07-09

### Added

- **`ignore` option**: List of environment variable keys to skip — they won't be set on `process.env`.
- **`fs.watch` fallback**: When `chokidar` is not installed, the watcher falls back to Node's built-in `fs.watch` instead of failing silently.
- **`/etc/shared-secrets.env`**: `SYSTEM_SECRETS_PATH` is now an array supporting both `/etc/internal-secrets.env` and `/etc/shared-secrets.env`.

### Changed

- **`generateEnvFile` no longer skips client frameworks**: The `isClientFramework()` check was removed. The generated `env.ts` works in any Node.js context — it's up to the developer to avoid importing it from client components.
- **`chokidar` moved to `optionalDependencies`**: Properly signals it's an optional enhancement without triggering peer-dep warnings.
- **`_internalReload` → `__internalReload`**: Fixed the reload guard flag mismatch that caused duplicate watchers on every file change.

## [0.1.6] - 2026-04-15

### Added

- **Centralized Environment Resolution**: Introduced `getEnvFiles` utility to standardize environment file priority across the package.
- **Enhanced File Resolution**: Added support for modern environment patterns (`.env.[NODE_ENV].local`, `.env.[NODE_ENV]`, `.env.local`, `.env`) in priority order, matching Next.js and CRA standards.

### Fixed

- **Absolute Path Resolution**: Fixed a bug where absolute system paths (e.g., `/etc/internal-secrets.env`) were being incorrectly resolved relative to the project root during path mapping.

### Changed

- Refactored `loadEnv` and auto-configuration entry points (`/auto` and `/auto/watch`) to utilize the centralized resolution logic.

## [0.1.5] - 2026-01-26

### Added

- Created a robust internal `readTsConfig` utility utilizing the official TypeScript parser to ensure accurate project configuration reading.

### Fixed

- Improved `tsconfig.json` validation logic to check both `include` and `files` arrays, reducing false-positive warnings for generated declaration files.
- Added early exit logic during environment file generation to handle edge cases where no environment keys are identified.

### Changed

- Refined `env.ts` generation to consistently prepend `NODE_ENV` to the exported keys for better predictability.
- Updated package metadata to explicitly support ESM (`type: module`) and optimize tree-shaking (`sideEffects: false`).

## [0.1.4] - 2026-01-21

### Added

- **Expanded Auto-config**: Separated auto-loading into two entry points:
  - `@explita/env-loader/auto`: Default auto-loading without watcher.
  - `@explita/env-loader/auto/watch`: Auto-loading with Hot Reload (watcher) enabled by default.
- Added `auto/watch` export to `package.json` for easier consumption.

### Changed

- Refactored `auto-config.ts` to disable watching by default, promoting explicit opt-in via `/auto/watch` or manual configuration.

## [0.1.3] - 2026-01-18

### Added

- Enhanced `getVal` and `hasKeys` utility functions with full TypeScript autocompletion by using `keyof NodeJS.ProcessEnv`.
- Added automatic detection of client-side frameworks to intelligently include public variables (`NEXT_PUBLIC_`, `VITE_`) in generated declarations.
- **Hot Reload**: Added `watch: true` option to automatically reload environment variables when `.env` files change. Requires `chokidar` to be installed.

### Changed

- Improved cross-platform compatibility by normalizing line endings for generated declaration files.
- Added prefix `[env-loader]` to console logs for better identification in application logs.
- Refined `generateEnvFile` logic to prevent accidental exposure of server-side secrets when client frameworks are detected.

## [0.1.2] - 2026-01-16

### Added

- New `generateEnvFile` feature to generate a centralized `env.ts` file exporting all environment variables.
- Smart detection of client-side frameworks (Next.js, Vite) to prevent insecure environment variable exposure.
- Automated `.gitignore` updates for generated declaration files.
- `NODE_ENV` is now included by default in all generated files.
- Added `EnvLoader` helper object for common loading patterns (`loadWithPrecedence`, `loadSystemAndApp`, `loadForEnvironment`).
- Added utility functions: `getVal` (type-safe getter), `hasKeys` (existence check), and `getKeys` (retrieval of all keys from files).

### Changed

- Refined `env.d.ts` generation to automatically detect if it should be added to `.gitignore` based on `tsconfig.json` inclusion.
- Improved alphabetical sorting of exported variables in generated files for better readability.

## [0.1.1] - 2026-01-15

### Changed

- Improved system-wide secrets path resolution to be drive-relative on Windows (using `/etc/internal-secrets.env`).
- Centralized internal constants in `src/lib/constants.ts`.
- Refined automatic type generation for more concise `env.d.ts` output.

### Added

- Comprehensive documentation for Next.js production environment pitfalls and best practices.
- Advanced usage guidelines for enterprise environments.

### Removed

- Removed the timestamp from the auto-generated `env.d.ts` file.

## [0.1.0] - 2026-01-14

### Added

- Initial release of `@explita/env-loader`.
- Support for multi-file loading with priority ordering.
- Automatic type generation for environment variables (`env.d.ts`).
- Semantic parsing of `.env` files (comments, `export` prefix, quoted values).
- Secret masking in verbose logs for better security.
- System-wide secret support via `/etc/internal-secrets.env`.
- Auto-loading entry point via `@explita/env-loader/auto`.
- Comprehensive TypeScript support.
