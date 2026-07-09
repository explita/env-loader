import fs from "fs";
import path from "path";
import { SYSTEM_SECRETS_PATH } from "./constants.js";

let timer: NodeJS.Timeout | undefined;

export function scheduleReload(fn: () => void) {
  clearTimeout(timer);
  timer = setTimeout(fn, 500);
}

export function isClientFramework() {
  const files = [
    "next-env.d.ts",
    "next.config.ts",
    "next.config.js",
    "next.config.mjs",
    "vite.config.ts",
    "vite.config.js",
    "vite.config.mjs",
  ];
  return files.some((f) => fs.existsSync(path.join(process.cwd(), f)));
}

/**
 * Filter out Next.js/Vite public variables (they have special handling)
 */
export function isPublicKey(key: string) {
  return key.startsWith("NEXT_PUBLIC_") || key.startsWith("VITE_");
}

export const normalize = (s: string) => s.replace(/\r\n/g, "\n");

export async function readTsConfig(): Promise<any | null> {
  try {
    const { default: ts } = await import("typescript");
    const text = fs.readFileSync("tsconfig.json", "utf8");
    const result = ts.parseConfigFileTextToJson("tsconfig.json", text);
    return result.error ? null : result.config;
  } catch {
    return null;
  }
}

export function getEnvFiles(NODE_ENV: string) {
  return [
    ...SYSTEM_SECRETS_PATH,
    ...[`.env.${NODE_ENV}.local`, `.env.${NODE_ENV}`, ".env.local", ".env"].map(
      (p) => path.resolve(process.cwd(), p),
    ),
  ];
}
