# Fair Grade backend

NestJS 12 (ESM, TypeScript) API on port 3001, with Prisma 7 on SQLite (libSQL adapter) and JWT authentication. For what the product does, how it works, configuration and deployment, see the [root README](../README.md). The endpoint contract is in [`../DOCS/API_SPEC.md`](../DOCS/API_SPEC.md).

## Run it

```bash
cp .env.example .env     # see the root README for every variable
npm ci
npm run migrate          # creates dev.db and applies the migrations
npm run seed             # demo data (wipes the database first)
npm run start:dev        # http://localhost:3001/health
```

| Script | |
|---|---|
| `npm run start:dev` | API with auto-reload |
| `npm run build`, `npm run start:prod` | compile to `dist/` and run it |
| `npm run migrate`, `npm run migrate:deploy` | `prisma migrate dev` (development), apply committed migrations (servers) |
| `npm run seed` | wipe the database and load the demo data (refuses under `NODE_ENV=production` unless `ALLOW_SEED=1`) |
| `npm test` | unit tests (`*.spec.ts`, pure logic only) |
| `npm run test:e2e` | end-to-end tests on a throwaway `test.db`, recreated on every run |
| `npm run lint`, `npm run format`, `npx tsc --noEmit` | oxlint, prettier, type-check |

## Layout

```
prisma/        schema.prisma and migrations
scripts/       seed, demo data, check-demo-numbers
src/
  access/      AccessService: the only place that decides course access
  auth/ users/ courses/ exams/ papers/ reports/ activity/ health/
  ai/          the AI grading worker and its prompt
  common/      auth guard, error filter, validation pipe, rate limiter, security headers
  prisma/      the one PrismaService
test/          end-to-end tests
```

## Conventions

- Relative imports end in `.js` (ESM): `import { X } from './x.service.js'`.
- Inject `PrismaService`; never create your own `PrismaClient`. The generated client lives in `src/generated/` (gitignored) and is rebuilt by `npm ci` / `npx prisma generate`.
- Every course-scoped service method starts with an `AccessService` check.
- Throw Nest exceptions; the global filter turns them into `{ "error": { "code", "message" } }`. Messages say exactly what is wrong.
- Every `@Body()` and `@Query()` is a class-validator DTO.
- New environment variables go in `.env.example` and the root README.
- Schema changes need a committed migration. Never run `prisma migrate reset` against a database you care about.
