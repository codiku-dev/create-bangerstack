import fs from "fs";
import path from "path";
import * as prompts from "./prompts.js";
import { run } from "./run.js";
import * as docker from "./docker.js";
import { PM_NAMES, getPackageManagerConfig, normalizePmChoice } from "./pm.js";
import { startDatabaseContainers } from "./database.js";
import type { PmConfig } from "./types.js";

/** Git URL of the template repo to clone. */
export const TEMPLATE_REPO = "https://github.com/codiku-dev/bangerstack.git";

/** Default folder name when the user does not provide a project name. */
export const DEFAULT_PROJECT_NAME = "bangerstack-project";

const PROJECT_NAME_ARG = process.argv[2];

/**
 * Asks for the project name via prompt if not passed as CLI argument; normalizes empty to DEFAULT_PROJECT_NAME.
 */
export async function getProjectName(): Promise<string> {
  let projectName: string | undefined = PROJECT_NAME_ARG;
  if (projectName === undefined) {
    projectName = await prompts.input("Project name (or leave empty for default)", DEFAULT_PROJECT_NAME);
  }
  if (projectName === undefined || projectName === "") projectName = DEFAULT_PROJECT_NAME;
  return projectName;
}

/**
 * Resolves the target directory and ensures it exists (or errors if it already exists and is not current dir).
 */
export function ensureTargetDir(projectName: string): { targetDir: string; isCurrentDir: boolean } {
  const targetDir = path.resolve(process.cwd(), projectName);
  const isCurrentDir = path.relative(process.cwd(), targetDir) === "";

  if (!isCurrentDir) {
    if (fs.existsSync(targetDir)) {
      console.error(`\u001b[31mError:\u001b[0m Directory "${projectName}" already exists.`);
      process.exit(1);
    }
    fs.mkdirSync(targetDir, { recursive: true });
  }

  return { targetDir, isCurrentDir };
}

/**
 * Prompts for package manager (npm, yarn, pnpm, bun) and returns its config.
 */
export async function getPackageManager(): Promise<PmConfig> {
  const pmRaw = await prompts.choose(PM_NAMES, "Package manager");
  const pm = normalizePmChoice(pmRaw);
  return getPackageManagerConfig(pm);
}

/**
 * Asks whether to install dependencies; if yes, runs the install command in workDir.
 */
export async function installDependencies(workDir: string, pmConfig: PmConfig): Promise<void> {
  const doInstall = await prompts.confirmSelect("Install dependencies?", true, "Install dependencies", "Skip");
  if (doInstall) {
    run(pmConfig.install, { cwd: workDir });
  }
}

/**
 * Runs `encrypt-env` script if present in the project.
 * Template expects `npx dotenvx encrypt ...` to re-encrypt .env.production using the private key in apps/api/.env.keys.
 */
export async function encryptEnv(workDir: string, pmConfig: PmConfig): Promise<void> {
  const pkgPath = path.join(workDir, "package.json");
  if (!fs.existsSync(pkgPath)) return;
  run(pmConfig.run("encrypt-env").join(" "), { cwd: workDir });
}

/**
 * Asks whether to start Docker Desktop; if yes, runs the Docker Desktop start + wait flow.
 */
export async function runDockerDesktop(): Promise<void> {
  const startApp = await prompts.confirmSelect("Should we start Docker Desktop client?", true, "Yes start Docker Desktop", "Skip");
  if (startApp) {
    console.log("\n\u001b[2m[Docker] Starting Docker Desktop flow…\u001b[0m");
    await docker.runDockerDesktop();
  } else {
    console.log("\n\u001b[2m[Docker] Skipped.\u001b[0m");
  }
}

/**
 * Asks whether to start database containers; if yes, runs docker compose up -d.
 */
export async function startDatabase(workDir: string): Promise<void> {
  const doDocker = await prompts.confirmSelect("Start database containers?", true, "Start database (docker compose)", "Skip");
  if (doDocker) {
    startDatabaseContainers(workDir);
  }
}

