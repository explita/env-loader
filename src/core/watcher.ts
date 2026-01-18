import { scheduleReload } from "../lib/utils.js";
import type { LoadOptions } from "../types.js";
import { loadEnv } from "./loader.js";

export async function watchFiles(config: {
  watch: boolean;
  path: string[];
  options?: LoadOptions;
}) {
  if (!config.watch) return;

  let chokidar: typeof import("chokidar") | undefined;

  try {
    chokidar = await import("chokidar");
  } catch {
    console.warn(
      "[env-loader]: Watcher requested but 'chokidar' is not installed. Please install it to enable watching.",
    );
    return;
  }

  const watcher = chokidar.watch(config.path, { ignoreInitial: true });

  watcher.on("all", (event, path) => {
    console.log(`[env-loader]: watcher ${event} on ${path}`);
    scheduleReload(() =>
      //@ts-ignore
      loadEnv({ ...config.options, watch: false, _internalReload: true }),
    );
  });
}
