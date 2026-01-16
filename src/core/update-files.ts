import fs from "fs";
import path from "path";
import ts from "typescript";

export function updateFiles(declarationFile: string) {
  const cwd = process.cwd();

  // ---- tsconfig.json ----
  let includedInTs = false;

  try {
    const text = fs.readFileSync("tsconfig.json", "utf8");
    const result = ts.parseConfigFileTextToJson("tsconfig.json", text);

    if (result.error) return;

    const tsconfig = result.config;
    const include: string[] = tsconfig.include ?? [];

    const alreadyCovered =
      include.includes(declarationFile) ||
      include.includes("**/*") ||
      include.includes("**/*.ts");

    if (!alreadyCovered) {
      // tsconfig.include = [...include, declarationFile];
      // fs.writeFileSync(tsconfigFile, JSON.stringify(tsconfig, null, 2));
      // console.log(`   Added to tsconfig.json`);
      console.log(
        `   Please add ${declarationFile} to the include array in your tsconfig.json.`
      );
      includedInTs = true;
    } else {
      includedInTs = true;
    }
  } catch (error) {
    // console.log(error);
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
