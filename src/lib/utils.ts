import fs from "fs";
import path from "path";

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
