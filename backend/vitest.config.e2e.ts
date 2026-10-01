import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// e2e tests run against their own SQLite file (test.db), recreated on every
// run, so they never touch the dev database you seeded.
const TEST_DATABASE_URL = 'file:./test.db';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    env: { DATABASE_URL: TEST_DATABASE_URL },
    globalSetup: ['./test/global-setup.ts'],
    setupFiles: ['dotenv/config'],
    include: ['**/*.e2e-spec.ts'],
    fileParallelism: false,
  },
});
