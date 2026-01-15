# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
