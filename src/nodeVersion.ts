/**
 * Prisma ORM requires Node.js ^20.19.0, ^22.12.0 or ^24.0.0 (semver):
 * - ^20.19.0 → ≥20.19.0 and <21.0.0
 * - ^22.12.0 → ≥22.12.0 and <23.0.0
 * - ^24.0.0  → ≥24.0.0 and <25.0.0
 */
const RECOMMENDED_MAJOR = 22;

function parseNodeVersion(version: string): { major: number; minor: number } | null {
  const match = /^v?(\d+)\.(\d+)/.exec(version);
  if (!match) return null;
  return { major: parseInt(match[1], 10), minor: parseInt(match[2], 10) };
}

export function isNodeVersionSupported(version = process.version): boolean {
  const v = parseNodeVersion(version);
  if (!v) return false;
  if (v.major === 20 && v.minor >= 19) return true;
  if (v.major === 22 && v.minor >= 12) return true;
  if (v.major === 24 && v.minor >= 0) return true;
  return false;
}

/**
 * Checks Node version at startup. If not supported, prints a message with the
 * command to install Node 22 (nvm) and exits. Call at the very beginning of main().
 */
export function checkNodeVersion(): void {
  if (isNodeVersionSupported()) return;

  const current = process.version;
  console.log(
    "\n\u001b[33mNode " + current + " is not supported.\u001b[0m Prisma requires ^20.19, ^22.12, or ^24.0."
  );
  console.log("We recommend Node " + RECOMMENDED_MAJOR + " (LTS).\n");
  console.log("Install the right version, then run this again. For example with nvm:\n");
  console.log("\u001b[1m  nvm install 22 && nvm use 22\u001b[0m\n");
  console.log("(If nvm is not installed: https://github.com/nvm-sh/nvm)\n");
  process.exit(1);
}
