# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
