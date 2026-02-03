import { config } from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'prisma/config';

// Load .env file from the api directory
config({ path: resolve(__dirname, '.env') });
config({ path: resolve(__dirname, '.env.local.development') });
config({ path: resolve(__dirname, '.env.production') });

const databaseUrl = process.env.DATABASE_URL;


if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export default defineConfig({
  schema: './src/infrastructure/prisma/schema.prisma',
  migrations: {
    path: './src/infrastructure/prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
