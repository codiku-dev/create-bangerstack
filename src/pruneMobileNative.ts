import fs from "fs";
import path from "path";

/**
 * Path to the legacy Capacitor / native mobile app (not the PWA under Next).
 * Bangerstack now keeps only `apps/mobile-pwa`; this folder is removed if still present in the template.
 */
const NATIVE_MOBILE_APP_DIR = path.join("apps", "mobile");

/**
 * Root `package.json` script keys that only target the native Capacitor app (`apps/mobile`).
 * Kept in sync with the template; safe to delete even if a key is already absent.
 */
const NATIVE_MOBILE_SCRIPT_KEYS = [
  "dev:mobile",
  "dev:mobile:android",
  "dev:mobile:android:emulator",
  "dev:mobile:ios",
  "build:mobile",
  "start:mobile",
];

/**
 * Recursively deletes `apps/mobile` (native stack) after clone so only `mobile-pwa` remains for mobile.
 *
 * @param workDir - Monorepo root (contains `apps/`).
 */
export function removeNativeMobileApp(workDir: string): void {
  const full = path.join(workDir, NATIVE_MOBILE_APP_DIR);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true, force: true });
  }
}

/**
 * Removes root scripts that referenced the native `apps/mobile` app so `npm run` / turbo stay valid.
 *
 * @param workDir - Monorepo root (contains `package.json`).
 */
export function pruneNativeMobileRootScripts(workDir: string): void {
  const pkgPath = path.join(workDir, "package.json");
  if (!fs.existsSync(pkgPath)) return;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8")) as {
    scripts?: Record<string, string>;
  };
  if (!pkg.scripts) return;
  let changed = false;
  for (const k of NATIVE_MOBILE_SCRIPT_KEYS) {
    if (k in pkg.scripts) {
      delete pkg.scripts[k];
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  }
}

/**
 * After cloning: drop native `apps/mobile` and clean root scripts.
 *
 * @param workDir - Monorepo root.
 */
export function applyNativeMobilePrune(workDir: string): void {
  removeNativeMobileApp(workDir);
  pruneNativeMobileRootScripts(workDir);
}
