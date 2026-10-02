import { execSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';

// Fresh, fully migrated test.db before the e2e run (see vitest.config.e2e.ts).
export default function setup() {
  rmSync('test.db', { force: true });
  // The SQLite schema engine needs the database file to exist before deploy.
  writeFileSync('test.db', '');
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    stdio: 'ignore',
  });
}
