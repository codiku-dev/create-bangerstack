import { execSync } from "child_process";
import type { RunOptions } from "./types.js";

/**
 * Runs a shell command and streams output to the current process.
 *
 * @param cmd - The full command string to execute (e.g. "bun install", "git clone ...").
 * @param opts - Optional execution options (cwd, stdio, etc.). Merged with defaults: stdio "inherit", shell true.
 */
export function run(cmd: string, opts: RunOptions = {}): void {
  console.log(`\n\u001b[36m>\u001b[0m ${cmd}`);
  execSync(cmd, {
    stdio: "inherit",
    shell: true,
    ...opts,
  } as unknown as RunOptions);
}
