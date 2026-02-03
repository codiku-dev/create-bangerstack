import crypto from "crypto";
import fs from "fs";
import path from "path";

/**
 * Generates a random base64 string (32 bytes) for use as BETTER_AUTH_SECRET.
 */
function generateSecret(): string {
  return crypto.randomBytes(32).toString("base64");
}

/**
 * Writes content to a file; creates parent dirs only if the directory exists (does not create apps/api or apps/web).
 *
 * @param filePath - Absolute path of the file to write.
 * @param content - Full file content (will be trimmed and a newline appended).
 */
function writeEnvFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) return;
  fs.writeFileSync(filePath, content.trimEnd() + "\n", "utf-8");
}

/**
 * Creates .env.local.development and .env.production in apps/api and apps/web with default values.
 * BETTER_AUTH_SECRET is generated once per call and reused in both api env files.
 *
 * @param workDir - Absolute path of the project root (monorepo root containing apps/api and apps/web).
 */
export function setupEnvFiles(workDir: string): void {
  const betterAuthSecret = generateSecret();

  const apiEnvContent = `# API configuration
PORT=3090
# PostgreSQL Docker configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=bangerstack_api_db
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bangerstack_api_db?schema=public

# tRPC configuration
TRPC_URL=http://localhost:3090/trpc

# Better Auth configuration
BETTER_AUTH_SECRET=${betterAuthSecret}
BETTER_AUTH_URL=http://localhost:3000

FRONTEND_URL=http://localhost:3000
`;

  const apiDir = path.join(workDir, "apps", "api");
  writeEnvFile(path.join(apiDir, ".env.local.development"), apiEnvContent);
  writeEnvFile(path.join(apiDir, ".env.production"), apiEnvContent);

  const webEnvContent = `# API configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3090
NEXT_PUBLIC_API_URL=http://localhost:3090/trpc
# Documentation configuration
NEXT_PUBLIC_DOCUMENTATION_URL=http://localhost:3090/docs
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3090/api/auth
`;

  const webDir = path.join(workDir, "apps", "web");
  writeEnvFile(path.join(webDir, ".env.local.development"), webEnvContent);
  writeEnvFile(path.join(webDir, ".env.production"), webEnvContent);
}
