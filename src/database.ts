import fs from "fs";
import path from "path";
import { run } from "./run.js";
import type { PmConfig } from "./types.js";

const COMPOSE_NAMES = ["docker-compose.yml", "docker-compose.yaml", "compose.yml"];

/**
 * Finds the directory that contains a docker-compose file: either workDir (root) or apps/api.
 *
 * @param workDir - Absolute path of the project root (monorepo root).
 * @returns Absolute path of the directory containing docker-compose, or null if none found.
 */
function findComposeDir(workDir: string): string | null {
  const atRoot = COMPOSE_NAMES.some((f) => fs.existsSync(path.join(workDir, f)));
  if (atRoot) return workDir;
  const apiCompose = path.join(workDir, "apps", "api", "docker-compose.yml");
  if (fs.existsSync(apiCompose)) return path.join(workDir, "apps", "api");
  return null;
}

/**
 * Runs "docker compose up -d" in the project (root or apps/api, whichever has a compose file).
 * Prints a message if no compose file is found.
 *
 * @param workDir - Absolute path of the project root.
 */
export function startDatabaseContainers(workDir: string): void {
  const composeDir = findComposeDir(workDir);
  if (!composeDir) {
    console.log("\n\u001b[2mNo docker-compose file in project. Start Docker manually if needed.\u001b[0m");
    return;
  }
  try {
    run("docker compose up -d", { cwd: composeDir });
  } catch (err) {
    console.warn("\n\u001b[33mDocker failed.\u001b[0m Make sure Docker is running and try later: cd " + composeDir + " && docker compose up -d");
  }
}

/**
 * Runs the template's db:start and db:update scripts (e.g. start DB container, run migrations) from the project root.
 *
 * @param workDir - Absolute path of the project root (where package.json with db:start / db:update lives).
 * @param pmConfig - Package manager config (install + run) so we use the same PM as the user chose.
 */
export function runDbScripts(workDir: string, pmConfig: PmConfig): void {
  run(pmConfig.run("db:start").join(" "), { cwd: workDir });
  run(pmConfig.run("db:update").join(" "), { cwd: workDir });
}
