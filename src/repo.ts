import fs from "fs";
import path from "path";
import { run } from "./run.js";

/**
 * Clones the template repo into cloneTarget, then either copies files into the current directory
 * (if isCurrentDir) or removes .git from the clone (so the new folder is a fresh repo).
 *
 * @returns Top-level names copied into the destination when `isCurrentDir` is true (for undo if the user aborts);
 *   empty when cloning into a dedicated folder.
 */
export function cloneRepository(
  templateRepo: string,
  cloneTarget: string,
  isCurrentDir: boolean
): string[] {
  run(`git clone --depth 1 ${templateRepo} "${cloneTarget}"`);

  if (isCurrentDir) {
    const copiedTopLevel: string[] = [];
    const entries = fs.readdirSync(cloneTarget, { withFileTypes: true });
    for (const e of entries) {
      if (e.name === ".git") continue;
      copiedTopLevel.push(e.name);
      const src = path.join(cloneTarget, e.name);
      const dest = path.join(process.cwd(), e.name);
      if (e.isDirectory()) {
        fs.cpSync(src, dest, { recursive: true });
      } else {
        fs.copyFileSync(src, dest);
      }
    }
    fs.rmSync(cloneTarget, { recursive: true, force: true });
    return copiedTopLevel;
  }

  try {
    fs.rmSync(path.join(cloneTarget, ".git"), { recursive: true, force: true });
  } catch (_) {}
  return [];
}
