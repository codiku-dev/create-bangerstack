import fs from "fs";
import path from "path";
import * as prompts from "./prompts.js";

export type StackChoices = {
  includeApi: boolean;
  includeWeb: boolean;
};

/** At least one of API or web must stay for the scaffold to make sense. */
export function hasAnyAppChoice(p: StackChoices): boolean {
  return p.includeApi || p.includeWeb;
}

const REL_API = path.join("apps", "api");
const REL_WEB = path.join("apps", "web");
const REL_MOBILE_PWA = path.join("apps", "mobile-pwa");

/** Root `package.json` keys: `dev:mobile-pwa…` → `mobile-pwa:…` */
const MOBILE_PWA_SCRIPT_RENAMES: readonly (readonly [string, string])[] = [
  ["dev:mobile-pwa+api", "mobile-pwa:dev+api"],
  ["dev:mobile-pwa", "mobile-pwa:dev"],
  ["dev:mobile-pwa:android", "mobile-pwa:android"],
  ["dev:mobile-pwa:ios", "mobile-pwa:ios"],
  ["release:mobile-pwa:android", "mobile-pwa:release:android"],
] as const;

/** Asks backend → web (Next.js + `apps/mobile-pwa`). */
export async function promptStackChoices(): Promise<StackChoices> {
  const includeApi = await prompts.confirmSelect(
    "Do you need a backend?",
    true,
    "Yes",
    "No"
  );
  const includeWeb = await prompts.confirmSelect(
    "Do you need a web front-end (Next.js + mobile PWA)?",
    true,
    "Yes",
    "No"
  );
  return { includeApi, includeWeb };
}

function rmTree(root: string, rel: string): void {
  const full = path.join(root, rel);
  if (fs.existsSync(full)) fs.rmSync(full, { recursive: true, force: true });
}

/**
 * Removes opted-out apps; drops `apps/mobile-pwa` when web is removed.
 */
export function applyStackPrune(workDir: string, p: StackChoices): void {
  if (!p.includeApi) rmTree(workDir, REL_API);
  if (!p.includeWeb) rmTree(workDir, REL_WEB);

  if (!p.includeWeb) rmTree(workDir, REL_MOBILE_PWA);

  const appsDir = path.join(workDir, "apps");
  if (fs.existsSync(appsDir) && fs.readdirSync(appsDir).length === 0) {
    fs.rmSync(appsDir, { recursive: true, force: true });
  }
}

const SCRIPT_SECTION_API = "#---------------------------API---------------------------------#";
const SCRIPT_SECTION_WEB = "#---------------------------WEB---------------------------------#";

function renameMobilePwaScriptKeys(scripts: Record<string, string>): void {
  for (const [oldKey, newKey] of MOBILE_PWA_SCRIPT_RENAMES) {
    if (scripts[oldKey] === undefined) continue;
    if (scripts[newKey] === undefined) scripts[newKey] = scripts[oldKey];
    delete scripts[oldKey];
  }
}

function scriptsToRemove(p: StackChoices): Set<string> {
  const drop = new Set<string>();

  if (!p.includeApi || !p.includeWeb) {
    drop.add("dev:web+api");
    drop.add("prod:web+api");
    drop.add("mobile-pwa:dev+api");
  }
  if (!p.includeApi) {
    drop.add("dev:api");
    drop.add("start:api");
    drop.add("build:api");
    drop.add("db:start");
    drop.add("db:update");
    drop.add("db:studio");
    drop.add(SCRIPT_SECTION_API);
  }
  if (!p.includeWeb) {
    drop.add("dev:web");
    drop.add("start:web");
    drop.add("build:web");
    drop.add(SCRIPT_SECTION_WEB);
    drop.add("mobile-pwa:dev");
    drop.add("mobile-pwa:android");
    drop.add("mobile-pwa:ios");
    drop.add("mobile-pwa:release:android");
  }

  return drop;
}

/**
 * Ensures root `dev` works after pruning, migrates `mobile-pwa` script names, strips invalid scripts, fixes workspaces when no apps remain.
 */
export function patchRootPackageAfterPrune(workDir: string, p: StackChoices): void {
  const pkgPath = path.join(workDir, "package.json");
  if (!fs.existsSync(pkgPath)) return;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8")) as {
    scripts?: Record<string, string>;
    workspaces?: string[];
  };

  if (!pkg.scripts) pkg.scripts = {};

  renameMobilePwaScriptKeys(pkg.scripts);

  for (const key of scriptsToRemove(p)) {
    delete pkg.scripts[key];
  }

  const filters: string[] = [];
  if (p.includeApi) filters.push("--filter=api...");
  if (p.includeWeb) filters.push("--filter=web...");
  const mobilePwaDir = path.join(workDir, "apps", "mobile-pwa");
  if (p.includeWeb && fs.existsSync(mobilePwaDir)) {
    filters.push("--filter=mobile-pwa...");
  }

  pkg.scripts["dev"] =
    filters.length === 0 ? "turbo run dev" : `turbo run dev ${filters.join(" ")}`;

  const hasApps = p.includeApi || p.includeWeb;
  if (Array.isArray(pkg.workspaces) && !hasApps) {
    pkg.workspaces = pkg.workspaces.filter((w) => w !== "apps/*" && w !== "apps/**");
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
}
