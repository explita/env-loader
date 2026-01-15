import fs from "fs";
import path from "path";

export function updateFiles(declarationFile: string) {
  const cwd = process.cwd();

  // ---- tsconfig.json ----
  const tsconfigFile = path.join(cwd, "tsconfig.json");
  let includedInTs = false;

  try {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigFile, "utf8"));
    const include = tsconfig.include ?? [];

    const alreadyCovered =
      include.includes(declarationFile) ||
      include.includes("**/*") ||
      include.includes("**/*.ts");

    if (!alreadyCovered) {
      tsconfig.include = [...include, declarationFile];
      fs.writeFileSync(tsconfigFile, JSON.stringify(tsconfig, null, 2));
      console.log(`   Added to tsconfig.json`);
      includedInTs = true;
    } else {
      includedInTs = true;
    }
  } catch {
    // ignore
  }

  // ---- .gitignore ----
  // Only ignore if it's NOT part of TS program
  if (!includedInTs) {
    const gitIgnoreFile = path.join(cwd, ".gitignore");
    let gitIgnoreContent = "";

    try {
      gitIgnoreContent = fs.readFileSync(gitIgnoreFile, "utf8");
    } catch {}

    if (!gitIgnoreContent.includes(declarationFile)) {
      fs.appendFileSync(gitIgnoreFile, `\n${declarationFile}`);
      console.log(`   Added to .gitignore`);
    }
  }
}
