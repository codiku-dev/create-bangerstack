import crypto from "crypto";
import fs from "fs";
import path from "path";

const DOTENV_PRIVATE_KEY_PRODUCTION = "DOTENV_PRIVATE_KEY_PRODUCTION";
const DOTENV_PUBLIC_KEY_PRODUCTION = "DOTENV_PUBLIC_KEY_PRODUCTION";

function generatePrivateKey(): string {
  // 32 bytes -> 64 hex chars (matches the format used in the template's demo .env.keys).
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Sets up dotenvx encryption files for local scaffolding:
 * - wipes values in `apps/api/.env.production` while keeping env var keys
 * - removes `DOTENV_PUBLIC_KEY_PRODUCTION` from `.env.production`
 * - generates `apps/api/.env.keys` with a fresh private key
 */
export function setupEnvEncryption(workDir: string): void {
  const apiDir = path.join(workDir, "apps", "api");
  const envPath = path.join(apiDir, ".env");
  const envProductionPath = path.join(apiDir, ".env.production");
  const envKeysPath = path.join(apiDir, ".env.keys");

  if (!fs.existsSync(envPath)) return;

  // User request:
  // - .env.production is replaced with the exact content of .env
  //   (thus removing the dotenvx public-key header/comments automatically).
  // - remove DOTENV_PUBLIC_KEY_PRODUCTION if it exists for any reason
  // - generate a fresh private key into .env.keys
  const envRaw = fs.readFileSync(envPath, "utf-8");
  const envLines = envRaw.split(/\r?\n/);
  const envFiltered = envLines.filter((line) => !line.startsWith(`${DOTENV_PUBLIC_KEY_PRODUCTION}=`));
  const envContent = envFiltered.join("\n").trimEnd() + "\n";

  const privateKey = generatePrivateKey();
  const envKeysContent =
    `#/------------------!DOTENV_PRIVATE_KEYS!-------------------/\n` +
    `#/ private decryption keys. DO NOT commit to source control /\n` +
    `#/     [how it works](https://dotenvx.com/encryption)       /\n` +
    `#/----------------------------------------------------------/\n` +
    `\n` +
    `# .env.production\n` +
    `${DOTENV_PRIVATE_KEY_PRODUCTION}=\"${privateKey}\"\n`;

  fs.writeFileSync(envProductionPath, envContent, "utf-8");
  fs.writeFileSync(envKeysPath, envKeysContent, "utf-8");
}

