import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

/**
 * Checks whether the Docker daemon is running (e.g. Docker Desktop is started).
 *
 * @returns true if "docker info" succeeds, false otherwise.
 */
export function isDockerRunning(): boolean {
  try {
    execSync("docker info", { stdio: "pipe", shell: true } as unknown as import("child_process").ExecSyncOptions);
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
    try {
      execSync("open -a Docker", { stdio: "pipe", shell: true } as unknown as import("child_process").ExecSyncOptions);
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Polls until "docker info" succeeds or the timeout is reached.
 *
 * @param timeoutMs - Maximum time to wait in milliseconds (default 60000).
 * @param intervalMs - Delay between checks in milliseconds (default 2000).
 * @returns true if Docker became ready within the timeout, false otherwise.
 */
export async function waitForDocker(timeoutMs = 60000, intervalMs = 2000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (isDockerRunning()) return true;
    await sleep(intervalMs);
  }
  return false;
}

/**
 * Full flow: if Docker is not running, starts Docker Desktop and waits until it is ready (with messages).
 * If already running or unsupported platform, only prints a message.
 */
export async function runDockerDesktop(): Promise<void> {
  if (isDockerRunning()) {
    console.log("\n\u001b[2mDocker is already running.\u001b[0m");
    return;
  }
  if (!startDockerDesktop()) {
    console.warn("\n\u001b[33mCould not start Docker Desktop. Start it manually (e.g. from the Start menu).\u001b[0m");
    return;
  }
  console.log("\n\u001b[2mStarting Docker Desktop… Waiting for Docker to be ready (up to 60s).\u001b[0m");
  if (await waitForDocker()) {
    console.log("\n\u001b[32mDocker is ready.\u001b[0m");
  } else {
    console.warn("\n\u001b[33mDocker did not start in time. Start it manually and re-run db:start if needed.\u001b[0m");
  }
}
