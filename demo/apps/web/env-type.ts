/**
 * Generated from .env. Do not edit manually.
 * Regenerated when .env changes (generate-env-types script).
 */
import { z } from "zod";

export const envSchema = z.object({

  NEXT_PUBLIC_API_BASE_URL: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_DOCUMENTATION_URL: z.string(),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string(),
});

export type Env = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env { }
  }
}

export function parseEnv(): Env {
  return envSchema.parse(process.env);
}
