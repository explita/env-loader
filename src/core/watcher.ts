import fs from "fs";
import { scheduleReload } from "../lib/utils.js";
import type { LoadOptions } from "../types.js";
import { loadEnv } from "./loader.js";

function startFsWatch(paths: string[], options?: LoadOptions) {
  for (const filePath of paths) {
    if (!fs.existsSync(filePath)) continue;

    fs.watch(filePath, (eventType) => {
      console.log(`[env-loader]: fs.watch ${eventType} on ${filePath}`);
      scheduleReload(() =>
        //@ts-ignore
        loadEnv({ ...options, watch: false, __internalReload: true }),
      );
    });
  }
}

export async function watchFiles(config: {
  watch: boolean;
  path: string[];
  options?: LoadOptions;
}) {
  if (!config.watch) return;

  try {
    const chokidar = await import("chokidar");
    const watcher = chokidar.watch(config.path, { ignoreInitial: true });

    watcher.on("all", (event, path) => {
      console.log(`[env-loader]: chokidar ${event} on ${path}`);
      scheduleReload(() =>
        //@ts-ignore
        loadEnv({ ...config.options, watch: false, __internalReload: true }),
      );
    });
  } catch {
    console.warn(
      "[env-loader]: 'chokidar' not found, falling back to fs.watch (limited reliability)",
    );
    startFsWatch(config.path, config.options);
  }
}
