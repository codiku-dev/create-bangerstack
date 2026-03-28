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
  const doInstall = await prompts.confirmSelect("Install dependencies?", true, "Yes", "No, skip.");
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
 *
 * @returns Whether the user chose to start Docker Desktop (false if they skipped).
 */
<<<<<<< Updated upstream
export async function runDockerDesktop(): Promise<void> {
  const startApp = await prompts.confirmSelect("Should we start Docker Desktop client?", true, "Yes start Docker Desktop", "Skip");
=======
export async function runDockerDesktop(): Promise<boolean> {
  const startApp = await prompts.confirmSelect("Start Docker Desktop?", true, "Yes", "No, Skip");
>>>>>>> Stashed changes
  if (startApp) {
    console.log("\n\u001b[2m[Docker] Starting Docker Desktop flow…\u001b[0m");
    await docker.runDockerDesktop();
  } else {
    console.log("\n\u001b[2m[Docker] Skipped.\u001b[0m");
  }
  return startApp;
}

/**
 * Asks whether to start database containers; if yes, runs docker compose up -d.
 *
 * If Docker is not running and the user previously chose not to start Docker Desktop, skips this step
 * without prompting — `docker compose` can still launch Docker Desktop on Windows.
 *
 * @param userChoseToStartDockerDesktop - Result from {@link runDockerDesktop} (whether they picked "Start Docker Desktop").
 */
export async function startDatabase(workDir: string, userChoseToStartDockerDesktop: boolean): Promise<void> {
  if (!docker.isDockerRunning() && !userChoseToStartDockerDesktop) {
    console.log(
      "\n\u001b[2m[Docker] Skipping database containers: Docker is not running and you chose not to start Docker Desktop.\u001b[0m"
    );
    console.log("\u001b[2m  (Running compose would often start Docker anyway.) Start Docker later, then run your db scripts.\u001b[0m");
    return;
  }

  const doDocker = await prompts.confirmSelect("Start database containers? (docker compose)", true, "Yes", "No, Skip");
  if (doDocker) {
    startDatabaseContainers(workDir);
  }
}

