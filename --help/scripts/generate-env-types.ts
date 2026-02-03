/**
 * Scans the repo for .env files (.env.local.development, .env.production, .env)
 * and generates env-type.ts with a Zod schema, inferred Env type, and parseEnv()
 * that throws if required vars are missing or invalid.
 *
 * Run: bun run scripts/generate-env-types.ts
 * Watch: bun run scripts/generate-env-types.ts -- --watch
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { parse } from "dotenv";

const ROOT = process.cwd();

const ENV_CANDIDATES = [".env.local.development", ".env.production", ".env"] as const;
const SKIP_DIRS = new Set(["node_modules", ".git"]);

function isIdent(k: string): boolean {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(k);
}

function* walkDirs(dir: string): Generator<string> {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (!e.isDirectory() || SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    yield* walkDirs(full);
  }
  yield dir;
}

function pickEnvFile(dir: string): { file: string; name: string } | null {
  for (const name of ENV_CANDIDATES) {
    const file = path.join(dir, name);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      return { file, name };
    }
  }
  return null;
}

function formatZodEntry(k: string): string {
  const prop = isIdent(k) ? k : `"${k.replace(/"/g, '\\"')}"`;
  return `  ${prop}: z.string(),`;
}

function generateEnvTypeTs(_envPath: string, envName: string, keys: string[]): string {
  const zodEntries = keys.map(formatZodEntry).join("\n");
  const lines: string[] = [
    `/**`,
    ` * Generated from ${envName}. Do not edit manually.`,
    ` * Regenerated when ${envName} changes (generate-env-types script).`,
    ` */`,
    `import { z } from "zod";`,
    ``,
    `export const envSchema = z.object({`,
    zodEntries,
    `});`,
    ``,
    `export type Env = z.infer<typeof envSchema>;`,
    ``,
    `declare global {`,
    `  namespace NodeJS {`,
    `    interface ProcessEnv extends Env {}`,
    `  }`,
    `}`,
    ``,
    `export function parseEnv(): Env {`,
    `  return envSchema.parse(process.env);`,
    `}`,
    ``,
  ];
  return lines.join("\n");
}

function processDir(dir: string): boolean {
  const picked = pickEnvFile(dir);
  if (!picked) return false;
  const raw = fs.readFileSync(picked.file, "utf-8");
  const parsed = parse(raw);
  const keys = Object.keys(parsed).sort();
  const outPath = path.join(dir, "env-type.ts");
  const content = generateEnvTypeTs(picked.file, picked.name, keys);
  fs.writeFileSync(outPath, content, "utf-8");
  console.log(`  ${path.relative(ROOT, outPath)} (from ${picked.name})`);
  return true;
}

function run(): void {
  console.log("generate-env-types: scanning .env* and writing env-type.ts\n");
  let count = 0;
  for (const dir of walkDirs(ROOT)) {
    if (processDir(dir)) count += 1;
  }
  console.log(`\nDone. ${count} env-type.ts generated.`);
}

function watch(): void {
  // chokidar is required for watch; dynamic import to fail clearly if missing
  import("chokidar").then(({ default: chokidar }) => {
    console.log("generate-env-types: watching **/.env*; (re)generating env-type.ts on change.\n");
    run();

    const glob = path.join(ROOT, "**", ".env*");
    chokidar.watch(glob, { ignoreInitial: true }).on("all", () => {
      console.log("\n[change detected]");
      run();
    });
  });
}

const isWatch = process.argv.includes("--watch");
if (isWatch) {
  watch();
} else {
  run();
}
