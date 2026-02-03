import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/**
 * Checks whether the Docker daemon is running (e.g. Docker Desktop is started).
 *
 * @returns true if "docker info" succeeds, false otherwise.
 */
const DOCKER_INFO_TIMEOUT_MS = 5000;

export function isDockerRunning(): boolean {
  try {
    execSync("docker info", {
      stdio: "pipe",
      shell: true,
      timeout: DOCKER_INFO_TIMEOUT_MS,
    } as unknown as import("child_process").ExecSyncOptions);
    return true;
  } catch {
    return false;
  }
}

/**
 * Tries to launch Docker Desktop (Windows: start exe, macOS: open -a Docker).
 * Does nothing on Linux.
 *
 * @returns true if the launch command was executed, false if no known path/command.
 */
export function startDockerDesktop(): boolean {
  const plat = process.platform;
  if (plat === "win32") {
    const paths = [
      path.join(process.env.ProgramFiles ?? "C:\\Program Files", "Docker", "Docker", "Docker Desktop.exe"),
      path.join(process.env["ProgramFiles(x86)"] ?? "C:\\Program Files (x86)", "Docker", "Docker", "Docker Desktop.exe"),
    ];
    const exe = paths.find((p) => fs.existsSync(p));
    if (exe) {
      execSync(`start "" "${exe}"`, { stdio: "pipe", shell: true } as unknown as import("child_process").ExecSyncOptions);
      return true;
    }
    return false;
  }
  if (plat === "darwin") {
    const opts = { stdio: "pipe" as const, shell: true };
    const tryOpen = (app: string): boolean => {
      try {
        execSync(`open -a "${app}"`, opts as unknown as import("child_process").ExecSyncOptions);
        return true;
      } catch {
        return false;
      }
    };
    if (tryOpen("Docker")) return true;
    if (tryOpen("Docker Desktop")) return true;
    const dockerApp = "/Applications/Docker.app";
    if (fs.existsSync(dockerApp)) {
      try {
        execSync(`open "${dockerApp}"`, opts as unknown as import("child_process").ExecSyncOptions);
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
  return false;
}

/**
 * Polls until "docker info" succeeds or the timeout is reached.
 * Logs progress every 5s so we can see we're actually waiting.
 *
 * @param timeoutMs - Maximum time to wait in milliseconds (default 60000).
 * @param intervalMs - Delay between checks in milliseconds (default 2000).
 * @returns true if Docker became ready within the timeout, false otherwise.
 */
export async function waitForDocker(timeoutMs = 60000, intervalMs = 2000): Promise<boolean> {
  const start = Date.now();
  let lastLog = 0;
  while (Date.now() - start < timeoutMs) {
    if (isDockerRunning()) {
      console.log("\n\u001b[2m[docker] docker info OK → Docker is ready.\u001b[0m");
      return true;
    }
    const elapsed = Math.round((Date.now() - start) / 1000);
    if (elapsed >= lastLog + 5) {
      console.log("\n\u001b[2m[docker] Still waiting for Docker… " + elapsed + "s elapsed (docker info not ready yet).\u001b[0m");
      lastLog = elapsed;
    }
    await sleep(intervalMs);
  }
  console.log("\n\u001b[2m[docker] Timeout reached, docker info never succeeded.\u001b[0m");
  return false;
}

/**
 * Full flow: if Docker is not running, starts Docker Desktop and waits until it is ready (with messages).
 * Always waits for Docker to be ready (or timeout) before returning, so the CLI does not continue until Docker is up.
 */
export async function runDockerDesktop(): Promise<void> {
  console.log("\n\u001b[2m[docker] runDockerDesktop() entered.\u001b[0m");
  console.log("\n\u001b[2m[docker] Checking if Docker is running (docker info)…\u001b[0m");
  if (isDockerRunning()) {
    console.log("\n\u001b[2m[docker] Docker is already running.\u001b[0m");
    return;
  }
  console.log("\n\u001b[2m[docker] Docker is not running. Launching Docker Desktop…\u001b[0m");
  const launched = startDockerDesktop();
  if (!launched) {
    console.log("\n\u001b[2m[docker] Launch command failed or not found. Waiting for Docker (start it manually, up to 60s)…\u001b[0m");
  } else {
    console.log("\n\u001b[2m[docker] Launch command executed. Waiting for Docker to be ready (up to 60s)…\u001b[0m");
  }
  const ready = await waitForDocker();
  if (ready) {
    console.log("\n\u001b[32mDocker is ready.\u001b[0m");
  } else {
    console.warn("\n\u001b[33mDocker did not become ready in time. Start it manually and re-run db:start if needed.\u001b[0m");
  }
}
