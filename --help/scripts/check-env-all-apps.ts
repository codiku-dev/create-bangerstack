/**
 * Validates that required env vars (from env-type.ts) are present and pass
 * envSchema.parse(process.env). Loads .env.local.development | .env.production | .env
 * per app, then runs parseEnv(). Exits with 1 on failure.
 *
 * Run: bun run scripts/check-env-all-apps.ts
 * Watch: bun run scripts/check-env-all-apps.ts -- --watch
 */

import { spawnSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";

const ROOT = process.cwd();
const ENV_CANDIDATES = [".env.local.development", ".env.production", ".env", ".env.local", ".env.test", ".env.test.local", ".env.test.local.development", ".env.test.local.production", "env.staging", "env.preview"] as const;
const SKIP_DIRS = new Set(["node_modules", ".git"]);

function* walkDirs(dir: string): Generator<string> {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (!e.isDirectory() || SKIP_DIRS.has(e.name)) continue;
    yield* walkDirs(path.join(dir, e.name));
  }
  yield dir;
}

function pickEnvFile(dir: string): { file: string; name: string } | null {
  for (const name of ENV_CANDIDATES) {
    const file = path.join(dir, name);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) return { file, name };
  }
  return null;
}

/** Returns false if validation failed, true if passed or skipped. */
function checkSingleApp(dir: string): { passed: boolean; missingVars?: string[]; envFile?: string; appName?: string } {
  const envTypePath = path.join(dir, "env-type.ts");
  if (!fs.existsSync(envTypePath)) return { passed: true };

  const appName = path.relative(ROOT, dir);
  const picked = pickEnvFile(dir);
  if (!picked) {
    console.error(`  ❌ ${appName}: missing .env file (env-type.ts exists but no .env found)`);
    return { passed: false, appName };
  }

  const script = path.join(ROOT, "scripts", "check-env-single-app.ts");
  const r = spawnSync("bun", ["run", script, picked.file, dir], {
    stdio: "pipe",
    env: process.env,
    encoding: "utf-8"
  });

  if (r.status !== 0) {
    const output = r.stderr?.toString() || r.stdout?.toString() || "";
    const missingMatch = output.match(/MISSING_VARS:(.+)/);
    const missingVars = missingMatch ? missingMatch[1].split(",").map((s) => s.trim()).filter(Boolean) : undefined;
    const varsHint = missingVars?.length ? ` — missing/invalid: ${missingVars.join(", ")}` : "";
    console.error(`  ❌ ${appName}: validation failed (${picked.name})${varsHint}`);
    return { passed: false, missingVars, envFile: picked.name, appName };
  }
  console.log(`  ✅ ${appName}: valid (${picked.name})`);
  return { passed: true };
}

function run(): void {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔍 Validating environment variables");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const allMissingVars: Array<{ var: string; app: string; envFile: string }> = [];
  let ok = true;

  for (const dir of walkDirs(ROOT)) {
    const result = checkSingleApp(dir);
    if (!result.passed) {
      ok = false;
      if (result.missingVars && result.envFile && result.appName) {
        result.missingVars.forEach(v => {
          allMissingVars.push({ var: v, app: result.appName!, envFile: result.envFile! });
        });
      }
    }
  }

  console.log("");
  if (!ok) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("❌ Env variables validation failed");
    if (allMissingVars.length > 0) {
      console.log("\nMissing variables:");
      // Group by app and envFile
      const grouped = new Map<string, string[]>();
      allMissingVars.forEach(({ var: v, app, envFile }) => {
        const key = `${app} (${envFile})`;
        if (!grouped.has(key)) {
          grouped.set(key, []);
        }
        grouped.get(key)!.push(v);
      });

      grouped.forEach((vars, key) => {
        const uniqueVars = [...new Set(vars)];
        console.log(`  ${key}:`);
        uniqueVars.forEach(v => console.log(`    • ${v}`));
      });
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    process.exit(1);
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ All environment variables are valid!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

/** Collects absolute paths of .env and env-type.ts files we validate. */
function getWatchedPaths(): string[] {
  const paths: string[] = [];
  for (const dir of walkDirs(ROOT)) {
    const envTypePath = path.join(dir, "env-type.ts");
    if (!fs.existsSync(envTypePath)) continue;
    paths.push(path.resolve(envTypePath));
    const picked = pickEnvFile(dir);
    if (picked) paths.push(path.resolve(picked.file));
  }
  return paths;
}

function watch(): void {
  import("chokidar").then(({ default: chokidar }) => {
    const toWatch = getWatchedPaths();

    // Group watched files by app
    const watchedByApp = new Map<string, string[]>();
    for (const p of toWatch) {
      const relPath = path.relative(ROOT, p);
      const appDir = path.dirname(relPath);
      if (!watchedByApp.has(appDir)) {
        watchedByApp.set(appDir, []);
      }
      watchedByApp.get(appDir)!.push(relPath);
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👀 Watching these files for env variables changes");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    for (const [appDir, files] of watchedByApp.entries()) {
      console.log(`\n📁 ${appDir}:`);
      for (const file of files) {
        console.log(`   • ${file}`);
      }
    }
    console.log("");

    run();

    if (toWatch.length === 0) {
      console.log("⚠️  No env-type.ts + .env found; nothing to watch.");
      return;
    }

    const watcher = chokidar.watch(toWatch, {
      ignoreInitial: true,
      usePolling: true,
      interval: 400,
      awaitWriteFinish: { stabilityThreshold: 150 },
    });

    watcher.on("add", (p) => {
      console.log("\n📝 File added:", path.relative(ROOT, p));
      run();
    });
    watcher.on("change", (p) => {
      console.log("\n📝 File changed:", path.relative(ROOT, p));
      run();
    });
    watcher.on("unlink", (p) => {
      console.log("\n🗑️  File deleted:", path.relative(ROOT, p));
      run();
    });
  });
}

const isWatch = process.argv.includes("--watch");
if (isWatch) watch();
else run();
