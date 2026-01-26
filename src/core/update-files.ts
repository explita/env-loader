import { readTsConfig } from "../lib/utils.js";

export function updateFiles(declarationFile: string) {
  try {
    const tsConfig = readTsConfig();

    if (!tsConfig) return;

    const include: string[] = Array.isArray(tsConfig.include)
      ? tsConfig.include
      : [];

    const files: string[] = tsConfig.files ?? [];

    const alreadyCovered =
      include.includes(declarationFile) ||
      include.includes("**/*") ||
      include.includes("**/*.ts") ||
      files.includes(declarationFile);

    if (!alreadyCovered) {
      console.log(
        `[env-loader]: Please add ${declarationFile} to the include array in your tsconfig.json.`,
      );
    }
  } catch (error) {
    // Ignore invalid or unreadable tsconfig.json
  }
}
