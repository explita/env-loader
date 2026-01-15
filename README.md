# @explita/env-loader

Advanced environment variable loader with multi-file support, hot reload, and cross-platform file watching. Ideal for Node.js, Next.js, and enterprise applications.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- **Multi-file Support**: Load multiple `.env` files in a specific order with override control.
- **Auto Type Generation**: Automatically generates `env.d.ts` for your environment variables.
- **Zero Dependencies**: Lightweight and fast, no external runtime dependencies.
- **Secret Masking**: Automatically masks sensitive values (keys, tokens, passwords) in verbose logs.
- **Enterprise Ready**: Supports `/etc/internal-secrets.env` out of the box for secure deployments.
- **Standard Compliant**: Supports `#` comments, inline comments, and `export` prefixes.

#

## 📦 Installation

```bash
npm install @explita/env-loader
# or
yarn add @explita/env-loader
# or
pnpm add @explita/env-loader
```

## 🛠 Usage

### Basic Usage

Load the default `.env` files (current directory `.env` and `/etc/internal-secrets.env`):

```typescript
import { loadEnv } from "@explita/env-loader";

loadEnv();
```

#

### Automatic Loading (Preload)

You can automatically load environment variables by importing the auto-config module. This is ideal for an environment or scripts where you want zero-config loading based on your `NODE_ENV`.

```typescript
// ES Modules
import "@explita/env-loader/auto";

// CommonJS
require("@explita/env-loader/auto");
```

Import this once at the start of your application or entry point.

The auto-loader searches for files in this priority order:

1. `/etc/internal-secrets.env`
2. `.env.${NODE_ENV}.local`
3. `.env.${NODE_ENV}`
4. `.env.local`
5. `.env`

#

### Custom Configuration

```typescript
import { loadEnv } from "@explita/env-loader";

loadEnv({
  paths: [".env", ".env.local", "secrets.env"],
  verbose: true,
  overrideExisting: true,
  generateTypes: true, // Generates env.d.ts in the root
});
```

#

### 🏢 System-wide Secrets & Enterprise Use

The `internal-secrets.env` file is a powerful feature for enterprise environments and local development workflows. It allows you to maintain a single source of truth for sensitive credentials that are shared across multiple projects (e.g., database passwords, cloud provider keys).

#### Why use it?

- **No Duplication**: Stop copying `.env` files from project to project. Update a secret once, and every project that uses `@explita/env-loader` gets the update instantly.
- **Security**: Keep your most sensitive secrets outside of your project directory, reducing the risk of accidental git commits.
- **Cross-platform Compatibility**:
  - **Linux/macOS**: `/etc/internal-secrets.env`
  - **Windows**: `\etc\internal-secrets.env` (resolves to the root of the current drive, e.g., `C:\etc\...` or `D:\etc\...`)

#

### ⚠️ Next.js Production Warning

When using this loader with **Next.js**, especially for files outside the project root (like system-wide secrets), you **must** access variables directly via `process.env.YOUR_KEY`.

**Avoid doing this in a config file:**

```typescript
// config.ts - THIS WILL BREAK IN PRODUCTION
import { loadEnv } from "@explita/env-loader";
loadEnv();
export const API_KEY = process.env.API_KEY;
```

**Do this instead:**

```typescript
// Anywhere in your app
import "@explita/env-loader/auto";
const apiKey = process.env.API_KEY; // Access directly
```

Next.js performs static analysis and "inlines" environment variables during the build process. If you export them from a custom configuration file that loads them at runtime from an external path, they may not be correctly captured or available in the production bundle.

#

### ⚙️ API Reference

#### `loadEnv(options?: LoadOptions | string | string[])`

##### `LoadOptions`

| Option             | Type                 | Default                      | Description                                                                                      |
| :----------------- | :------------------- | :--------------------------- | :----------------------------------------------------------------------------------------------- |
| `paths`            | `string \| string[]` | `['.env', 'system-secrets']` | Path or array of paths to `.env` files. (Roots: `/etc` on Unix, current drive `\etc` on Windows) |
| `verbose`          | `boolean \| 'debug'` | `false`                      | Enable detailed logging. `'debug'` shows variable sources.                                       |
| `overrideExisting` | `boolean`            | `false`                      | If `true`, later files will override variables set by earlier files or the environment.          |
| `requireAll`       | `boolean`            | `false`                      | If `true`, the loader will fail if any specified file is missing.                                |
| `requireAny`       | `boolean`            | `true`                       | If `true`, at least one file must exist for the loader to succeed.                               |
| `generateTypes`    | `boolean \| string`  | `false`                      | If `true`, generates `env.d.ts`. If a string, specifies the output path.                         |

#

### 🛡 Security

Sensitive variables containing keywords like `key`, `secret`, `token`, or `password` are automatically masked in the verbose output to prevent accidental exposure in logs.

#

### 📄 License

MIT © [Explita](https://github.com/explita)
