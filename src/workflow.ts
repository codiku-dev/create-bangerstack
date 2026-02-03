import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import * as prompts from "./prompts.js";
import { run } from "./run.js";
import * as docker from "./docker.js";
import { PM_NAMES, getPackageManagerConfig, normalizePmChoice } from "./pm.js";
import { startDatabaseContainers } from "./database.js";
import type { PmConfig } from "./types.js";

/** Git URL of the template repo to clone. */
export const TEMPLATE_REPO = "https://github.com/codiku-dev/turbo-template.git";

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
  const doInstall = await prompts.confirm("Install dependencies?", true);
  if (doInstall) {
    run(pmConfig.install, { cwd: workDir });
  }
}

/**
 * Asks whether to start Docker Desktop; if yes, runs the Docker Desktop start + wait flow.
 */
export async function runDockerDesktop(): Promise<void> {
  const startApp = await prompts.confirm("Start Docker Desktop (application)?", true);
  if (startApp) {
    await docker.runDockerDesktop();
  }
}

/**
 * Asks whether to start database containers; if yes, runs docker compose up -d.
 */
export async function startDatabase(workDir: string): Promise<void> {
  const doDocker = await prompts.confirm("Start database containers (docker compose)?", true);
  if (doDocker) {
    startDatabaseContainers(workDir);
  }
}

/**
 * Spawns the dev server in workDir and forwards stdio; exits the process with the child's exit code.
 */
export function runProject(workDir: string, pmConfig: PmConfig): void {
  const devArgs = pmConfig.run("dev");
  const dev = spawn(devArgs[0], devArgs.slice(1), {
    stdio: "inherit",
    shell: true,
    cwd: workDir,
  });
  dev.on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
  dev.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}
