import fs from "fs";
import path from "path";
import { choose } from "./prompts.js";

export type PlatformChoice = "web" | "mobile" | "both";

const WEB_APP = path.join("apps", "web");
const MOBILE_APP = path.join("apps", "mobile");

const MOBILE_ONLY_SCRIPT_KEYS = ["dev:mobile", "dev:mobile:android:emulator"] as const;
const WEB_ONLY_SCRIPT_KEYS = ["dev:web", "start:web", "build:web"] as const;

const PLATFORM_CHOICES: { name: string; value: PlatformChoice }[] = [
  { name: "Web only (Next.js)", value: "web" },
  { name: "Mobile only (Capacitor / Next)", value: "mobile" },
  { name: "Web + Mobile", value: "both" },
];

/**
 * Asks whether the project targets web, mobile, or both.
 */
export async function choosePlatform(): Promise<PlatformChoice> {
  const value = await choose(PLATFORM_CHOICES, "Target platforms");
  if (value === "web" || value === "mobile" || value === "both") return value;
  return "both";
}

function rmAppIfExists(workDir: string, relativeAppPath: string): void {
  const full = path.join(workDir, relativeAppPath);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { recursive: true, force: true });
  }
}

/**
 * Removes `apps/mobile` when web-only, `apps/web` when mobile-only; keeps both when "both".
 */
export function applyPlatformFolders(workDir: string, choice: PlatformChoice): void {
  if (choice === "web") rmAppIfExists(workDir, MOBILE_APP);
  else if (choice === "mobile") rmAppIfExists(workDir, WEB_APP);
}

/**
 * Drops root package.json scripts that reference the removed app so `npm run` stays valid.
 */
export function pruneRootPackageJson(workDir: string, choice: PlatformChoice): void {
  const pkgPath = path.join(workDir, "package.json");
  if (!fs.existsSync(pkgPath)) return;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8")) as { scripts?: Record<string, string> };
  if (!pkg.scripts) return;

  const keys =
    choice === "web"
      ? MOBILE_ONLY_SCRIPT_KEYS
      : choice === "mobile"
        ? WEB_ONLY_SCRIPT_KEYS
        : [];

  for (const k of keys) {
    delete pkg.scripts[k];
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
}

/**
 * Runs folder removal and package.json pruning for the chosen platform.
 */
export function applyPlatformChoice(workDir: string, choice: PlatformChoice): void {
  applyPlatformFolders(workDir, choice);
  pruneRootPackageJson(workDir, choice);
}
