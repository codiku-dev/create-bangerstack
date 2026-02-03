import { config } from "dotenv";
import { resolve } from "path";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@api/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Load env before creating Prisma (auth.ts runs at import time, before Nest ConfigModule).
// Use process.cwd() so it works from dist/ (nest start) where cwd is apps/api.
const apiRoot = process.cwd();
config({ path: resolve(apiRoot, ".env") });
config({ path: resolve(apiRoot, ".env.local.development") });
config({ path: resolve(apiRoot, ".env.production") });

const connectionString = process.env.DATABASE_URL

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
        debugLogs: true
    }),
    emailAndPassword: {
        enabled: true,

    },
});