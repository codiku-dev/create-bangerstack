#!/usr/bin/env node

import fs from "fs";
import path from "path";
import * as prompts from "./prompts.js";
import { checkNodeVersion } from "./nodeVersion.js";
import {
  TEMPLATE_REPO,
  getProjectName,
  ensureTargetDir,
  getPackageManager,
  installDependencies,
  encryptEnv,
  runDockerDesktop,
  startDatabase,
} from "./workflow.js";
import { cloneRepository } from "./repo.js";
import { setupEnvEncryption } from "./envEncryption.js";
import { runDbScripts } from "./database.js";
import {
  applyStackPrune,
  hasAnyAppChoice,
  patchRootPackageAfterPrune,
  promptStackChoices,
} from "./stackPrune.js";
import type { PmConfig } from "./types.js";

const EXAMPLES_DIR = "apps/web/app/examples";
const WEB_PAGE_PATH = "apps/web/app/page.tsx";
const SIMPLE_PAGE_CONTENT = `export default function Home() {
  return "Hello from Bangerstack"
}
`;

async function applyExamplesChoice(workDir: string, includeWeb: boolean): Promise<void> {
  if (!includeWeb) return;
  const includeExamples = await prompts.confirmSelect("Include examples in the project?", true, "Include examples", "No examples");
  if (includeExamples) return;

  const examplesPath = path.join(workDir, EXAMPLES_DIR);
  const pagePath = path.join(workDir, WEB_PAGE_PATH);

  if (fs.existsSync(examplesPath)) {
    fs.rmSync(examplesPath, { recursive: true, force: true });
  }
  if (fs.existsSync(pagePath)) {
    fs.writeFileSync(pagePath, SIMPLE_PAGE_CONTENT.trimEnd() + "\n", "utf-8");
  }
}

function printDoneMessage(
  projectName: string,
  pmConfig: PmConfig,
  isCurrentDir: boolean
): void {
  const devCmd = pmConfig.run("dev").join(" ");
  const cdCmd = isCurrentDir ? null : `cd ${projectName}`;
  const lines = ["\u001b[1m\u001b[32m  All set!\u001b[0m", ""];
  if (cdCmd) lines.push("  \u001b[36m" + cdCmd + "\u001b[0m");
  lines.push("  \u001b[36m" + devCmd + "\u001b[0m");
  const width = Math.max(40, ...lines.map((l) => l.replace(/\u001b\[[0-9;]*m/g, "").length)) + 4;
  const top = "\n\u001b[32m\u256d" + "\u2500".repeat(width - 2) + "\u256e\u001b[0m";
  const bottom = "\u001b[32m\u2570" + "\u2500".repeat(width - 2) + "\u256f\u001b[0m\n";
  const pad = (s: string) => s + " ".repeat(Math.max(0, width - 2 - s.replace(/\u001b\[[0-9;]*m/g, "").length));
  const middle = lines.map((l) => "\u001b[32m\u2502\u001b[0m" + pad(l) + "\u001b[32m\u2502\u001b[0m").join("\n");
  console.log(top + "\n" + middle + "\n" + bottom);
}

async function main(): Promise<void> {
  checkNodeVersion();

  prompts.style("create-bangerstack");

  const projectName = await getProjectName();
  const { targetDir, isCurrentDir } = ensureTargetDir(projectName);
  const cloneTarget = isCurrentDir ? path.join(process.cwd(), ".bangerstack-tmp-clone") : targetDir;

  let copiedTopLevel: string[] = [];
  try {
    const stackChoices = await promptStackChoices();
    if (!hasAnyAppChoice(stackChoices)) {
      if (!isCurrentDir && fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
      }
      console.log(
        "\n\u001b[33mPick at least one of: backend (API) or web (Next.js, PWA).\u001b[0m"
      );
      console.log("\u001b[2mNothing was created. Exiting.\u001b[0m\n");
      process.exit(0);
    }

    copiedTopLevel = cloneRepository(TEMPLATE_REPO, cloneTarget, isCurrentDir);

    const workDir = isCurrentDir ? process.cwd() : targetDir;
    process.chdir(workDir);

    applyStackPrune(workDir, stackChoices);
    patchRootPackageAfterPrune(workDir, stackChoices);

    setupEnvEncryption(workDir);

    const pmConfig = await getPackageManager();

    await installDependencies(workDir, pmConfig);

    await encryptEnv(workDir, pmConfig);

    await runDockerDesktop(stackChoices.includeApi);

    await startDatabase(workDir, stackChoices.includeApi);

    runDbScripts(workDir, pmConfig, stackChoices.includeApi);

    await applyExamplesChoice(workDir, stackChoices.includeWeb);

    printDoneMessage(projectName, pmConfig, isCurrentDir);
  } catch (err) {
    if (!isCurrentDir && fs.existsSync(targetDir)) {
      try {
        fs.rmSync(targetDir, { recursive: true, force: true });
      } catch (_) { }
    } else if (isCurrentDir && copiedTopLevel.length > 0) {
      for (const name of copiedTopLevel) {
        try {
          const p = path.join(process.cwd(), name);
          if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
        } catch (_) { }
      }
    }
    console.error((err as Error)?.message ?? err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error((err as Error)?.message ?? err);
  process.exit(1);
});
