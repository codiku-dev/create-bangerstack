import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Directory where `packages/ui` lives (workspace root). Walks up from this file so
 * `demox/demox/apps/web` still resolves to the outer `…/demox` when it has `packages/ui`.
 */
function findMonorepoRoot(startDir) {
  const candidates = [];
  let dir = path.resolve(startDir);
  for (let i = 0; i < 12; i++) {
    if (fs.existsSync(path.join(dir, "packages", "ui", "package.json"))) {
      candidates.push(dir);
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  if (candidates.length === 0) {
    return path.resolve(startDir, "..", "..");
  }
  return candidates[candidates.length - 1];
}

const webAppDir = path.dirname(fileURLToPath(import.meta.url));
const monorepoRoot = findMonorepoRoot(webAppDir);

const config = {
  plugins: {
    "@tailwindcss/postcss": {
      base: monorepoRoot,
    },
  },
};

export default config;
