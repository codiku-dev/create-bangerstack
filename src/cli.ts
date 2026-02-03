#!/usr/bin/env node

import fs from "fs";
import path from "path";
import * as prompts from "./prompts.js";
import {
  TEMPLATE_REPO,
  getProjectName,
  ensureTargetDir,
  getPackageManager,
  installDependencies,
  runDockerDesktop,
  startDatabase,
  runProject,
} from "./workflow.js";
import { cloneRepository } from "./repo.js";
import { setupEnvFiles } from "./env.js";
import { runDbScripts } from "./database.js";

async function main(): Promise<void> {
  prompts.style("create-bangerstack");

  const projectName = await getProjectName();
  const { targetDir, isCurrentDir } = ensureTargetDir(projectName);
  const cloneTarget = isCurrentDir ? path.join(process.cwd(), ".bangerstack-tmp-clone") : targetDir;

  try {
    cloneRepository(TEMPLATE_REPO, cloneTarget, isCurrentDir);

    const workDir = isCurrentDir ? process.cwd() : targetDir;
    process.chdir(workDir);

    const pmConfig = await getPackageManager();

    await installDependencies(workDir, pmConfig);

    setupEnvFiles(workDir);

    await runDockerDesktop();

    await startDatabase(workDir);

    runDbScripts(workDir, pmConfig);

    const doRun = await prompts.confirm("Run the project now?", true);
    if (doRun) {
      prompts.style("Starting dev server…");
      runProject(workDir, pmConfig);
    } else {
      console.log("\n\u001b[32mDone.\u001b[0m To start later: cd " + workDir + " && " + pmConfig.run("dev").join(" "));
    }
  } catch (err) {
    if (!isCurrentDir && fs.existsSync(targetDir)) {
      try {
        fs.rmSync(targetDir, { recursive: true, force: true });
      } catch (_) { }
    }
    console.error((err as Error)?.message ?? err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error((err as Error)?.message ?? err);
  process.exit(1);
});
