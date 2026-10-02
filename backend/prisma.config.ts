import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Falls back to the default so `npm install` (prisma generate) works before .env exists.
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  },
});
