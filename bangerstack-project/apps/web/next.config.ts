// @ts-check
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import createNextIntlPlugin from "next-intl/plugin";

// Next.js only loads standard .env* names; load all .env* so NEXT_PUBLIC_* are available.
const dir = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(dir, ".env") });
loadEnv({ path: path.resolve(dir, ".env.local.development") });
loadEnv({ path: path.resolve(dir, ".env.development") });
loadEnv({ path: path.resolve(dir, ".env.local") });
loadEnv({ path: path.resolve(dir, ".env.production") });

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [process.env.NEXT_PUBLIC_API_URL],
  transpilePackages: ['@repo/ui'],
};

export default withNextIntl(nextConfig);
