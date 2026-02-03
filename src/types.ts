/**
 * Supported package manager names (npm, yarn, pnpm, bun).
 */
export type PackageManagerName = "npm" | "yarn" | "pnpm" | "bun";

/**
 * Configuration for a package manager: install command and a function to build run script args.
 */
export type PmConfig = {
  /** Full command to install dependencies (e.g. "bun install", "npm install --legacy-peer-deps"). */
  install: string;
  /** Returns [pm, "run", script] for spawn/exec (e.g. ["bun", "run", "dev"]). */
  run: (script: string) => [string, string, string];
};

import type { ExecSyncOptions } from "child_process";

/**
 * Options for executing a shell command (passed to child_process.execSync).
 */
export type RunOptions = ExecSyncOptions;
