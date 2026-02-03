import fs from "fs";
import path from "path";
import { run } from "./run.js";

/**
 * Clones the template repo into cloneTarget, then either copies files into the current directory
 * (if isCurrentDir) or removes .git from the clone (so the new folder is a fresh repo).
 *
 * @param templateRepo - Git URL of the template (e.g. "https://github.com/.../turbo-template.git").
 * @param cloneTarget - Absolute path where "git clone" will create the repo (folder that will contain .git and files).
 * @param isCurrentDir - If true, clone is done into a temp dir, then files (except .git) are copied to process.cwd() and the temp dir is removed. If false, clone is into the final folder and we only remove .git.
 */
export function cloneRepository(
  templateRepo: string,
  cloneTarget: string,
  isCurrentDir: boolean
): void {
  run(`git clone --depth 1 ${templateRepo} "${cloneTarget}"`);

  if (isCurrentDir) {
    const entries = fs.readdirSync(cloneTarget, { withFileTypes: true });
    for (const e of entries) {
      if (e.name === ".git") continue;
      const src = path.join(cloneTarget, e.name);
      const dest = path.join(process.cwd(), e.name);
      if (e.isDirectory()) {
        fs.cpSync(src, dest, { recursive: true });
      } else {
        fs.copyFileSync(src, dest);
      }
    }
    fs.rmSync(cloneTarget, { recursive: true, force: true });
  } else {
    try {
      fs.rmSync(path.join(cloneTarget, ".git"), { recursive: true, force: true });
    } catch (_) {}
  }
}
