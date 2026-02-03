/**
 * Runs env validation for a single app: loads .env and runs parseEnv().
 * Called by check-env-all-apps.ts with: bun run scripts/check-env-single-app.ts <env-path> <app-dir>
 * Exits 1 if parseEnv throws (e.g. required var removed from .env but still in zod).
 */

import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { config } from "dotenv";

const envPath = process.argv[2];
const appDir = process.argv[3];

if (!envPath || !appDir) {
  console.error("❌ [check-env] usage: check-env-single-app.ts <env-path> <app-dir>");
  process.exit(1);
}

config({ path: envPath });

try {
  const mod = await import(pathToFileURL(path.join(appDir, "env-type.ts")).href);
  mod.parseEnv();
} catch (err: unknown) {
  // Extract variable names from ZodError (missing or invalid)
  const issues = (err as { issues?: Array<{ code?: string; path?: (string | number)[] }> })?.issues;
  if (issues && Array.isArray(issues)) {
    const vars = [...new Set(issues.map((issue) => issue.path?.filter(Boolean).join(".")).filter(Boolean))];
    if (vars.length > 0) {
      console.error(`MISSING_VARS:${vars.join(",")}`);
    }
  }
  process.exit(1);
}
