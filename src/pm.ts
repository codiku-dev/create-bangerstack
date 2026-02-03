import type { PackageManagerName, PmConfig } from "./types.js";

/** List of supported package manager names (used for prompts and validation). */
export const PM_NAMES: PackageManagerName[] = ["npm", "yarn", "pnpm", "bun"];

/** Fallback when the chosen or detected PM is invalid. */
export const PM_DEFAULT: PackageManagerName = "npm";

/**
 * Returns the install command and a run(script) helper for the given package manager.
 * npm gets --legacy-peer-deps to avoid peer dependency conflicts in the template.
 *
 * @param pmName - One of "npm" | "yarn" | "pnpm" | "bun".
 * @returns Object with install (full command string) and run(script) returning [pm, "run", script].
 */
export function getPackageManagerConfig(pmName: string): PmConfig {
  const pm: PackageManagerName = PM_NAMES.includes(pmName as PackageManagerName) ? (pmName as PackageManagerName) : PM_DEFAULT;
  const installCmd = pm === "npm" ? "npm install --legacy-peer-deps" : `${pm} install`;
  return {
    install: installCmd,
    run: (script: string): [string, string, string] => [pm, "run", script],
  };
}

/**
 * Normalizes the value returned by the package manager prompt (string or index) into a valid PM name.
 *
 * @param pmRaw - Value from enquirer select: either the chosen string (e.g. "bun") or possibly an index (number).
 * @returns A valid PackageManagerName; falls back to PM_DEFAULT if invalid.
 */
export function normalizePmChoice(pmRaw: string | number | undefined): PackageManagerName {
  return PM_NAMES.includes(pmRaw as PackageManagerName)
    ? (pmRaw as PackageManagerName)
    : typeof pmRaw === "number" && pmRaw >= 0 && pmRaw < PM_NAMES.length
      ? PM_NAMES[pmRaw]
      : PM_DEFAULT;
}
