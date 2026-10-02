# Fair Grade: read this before touching the code

Hackathon project (FuturEd AI Hackathon, Team Byte Me). Hacking ends **Fri 2 Oct 2026, 13:00**. Prefer small, working, demoable changes over big ones.

The team writes to each other in Greek. Code, comments, commit messages and docs are in English.

## What the product does

TAs grade handwritten exam papers. The AI grades **the same transcribed answers** against **the same model answers and rubric**. The instructor sees, per TA and per question, where they disagree.

1. The instructor creates a **course**, adds **TAs as members**, creates **exams** and their **questions**. Each question has a model answer and rubric points that add up to its max.
2. A TA adds a **paper**: one student, a scanned PDF. The answers get transcribed, or typed if no vision model is available.
3. The TA grades it, **saves a draft**, then **submits**. Submitting locks the TA's points.
4. The AI grades the paper in the background. The TA then sees TA vs AI per question.
5. Reports, stats and the leaderboard are computed from `AI_GRADED` papers only.

**The demo that must always work:**
- the instructor opens HY335 → Midterm setup;
- Nikos (TA) adds and grades csd5150 and submits it;
- the AI grades it and the paper result shows the gaps;
- the Midterm report shows Maria flagged on Q2 (−1.04).

**Docs:**
- `DOCS/API_SPEC.md`: the API contract. Every endpoint is marked built or planned; update it when you change an endpoint.

## Roles and access (non-negotiable)

- Roles are `instructor` and `ta`. The values are lowercase everywhere: DB, JWT, API and frontend.
- **Course membership is the only thing that gives a TA access** to a course and its exams.
- An instructor sees the courses they own.
- A TA sees **only their own papers**.
- A TA sees the AI's grade of a paper **only after submitting it**.
- Only the course instructor manages members, exams and questions, reopens papers, and sees reports.
- **Enforce access in the backend**, never only in the UI.
- **The AI never receives student IDs, names or TA points.** It only gets the question, max points, model answer, rubric and the transcribed answer.
- **No demo numbers hardcoded in the UI** (except the static `(design)` pages that are not wired yet). Every number comes from the database.

## Repo layout

```
backend/    NestJS 12 (ESM) on :3001, Prisma 7 + SQLite, JWT + bcryptjs, vitest
frontend/   Next.js 16 App Router on :3000, Tailwind 4, shadcn/ui, the Fair Grade design
dataset/    old single-rubric demo data (legacy)
DOCS/       API_SPEC.md
```

**Who owns what.** Stay in your folders; ask before editing someone else's.

| Owner | Files |
|---|---|
| Γιώργος | `prisma/schema.prisma` (only him), `app.module.ts`, `common/`, `access/`, `auth/`, `courses/`, `users/`, `papers/` lifecycle, `components/shell/`, `lib/`, login |
| Κώστας | `ai/`, `grading/`, `stats/` |
| Σταύρος | `exams/`, paper upload and pages, the TA pages, the seed papers |
| Δημήτρης | `reports/`, `activity/` read side, `search/`, the instructor pages |

**Legacy, frozen** (the first version of the app). Don't extend it; it gets deleted at the end:
- backend `rubrics/ answers/ ta-grades/ grading/ results/ deviation/`. **Exception:** the live AI worker imports `grading/llm.client.ts` (the Bedrock client) and `deviation/` imports `grading/deviation.ts`. Move `llm.client.ts` to `ai/` before deleting `grading/`, or production AI grading breaks.
- the old tables (`Rubric`, `Criterion`, `StudentAnswer`, `TaGrade`, `AiGrade`)
- frontend `app/(legacy)/`

## Commands

```bash
# backend (run from backend/)
npm install                 # also runs prisma generate
npm run migrate             # prisma migrate dev + generate
npm run seed                # wipe + load the demo story (scripts/demo-data.ts)
npm run start:dev           # http://localhost:3001/health
npm test                    # unit tests (*.spec.ts)
npm run test:e2e            # e2e tests on a throwaway test.db
npx tsc --noEmit            # type-check
npx prettier --write src test

# frontend (run from frontend/)
npm run dev                 # http://localhost:3000
npx tsc --noEmit && npx eslint app components lib
```

## Backend gotchas

- **ESM.** Relative imports end in `.js`: `import { X } from './x.service.js'`.
- **Prisma 7.**
  - The config is in `backend/prisma.config.ts`.
  - The client is generated into `src/generated/prisma/` (gitignored). Import it with `import { ..., type Role } from '../generated/prisma/client.js'`.
  - Never create your own `PrismaClient`; inject `PrismaService`.
- **SQLite.**
  - Enums are stored as text, so adding an enum value needs no SQL.
  - JSON columns **can't have a `@default`**; set them in code.
  - Points are `Float`, in half steps (0.5).
- **Schema changes** go through Γιώργος. To create a migration without touching anyone's DB:
  `npx prisma migrate diff --from-migrations prisma/migrations --to-schema prisma/schema.prisma --script -o <new_migration_dir>/migration.sql`
- **Never run `prisma migrate reset`** or delete `dev.db` yourself; Prisma blocks AI agents from doing it anyway. Ask the user to run: `cd backend && npx prisma migrate reset --force && npm run seed`.
- **npm skips install scripts** of dependencies (`allow-scripts`). Avoid packages with native builds: use `bcryptjs`, not `bcrypt`, and the `libsql` adapter.
- **Never commit** `.env`, `dev.db`, `test.db`, `uploads/`, or keys. New env vars go in `backend/.env.example`.

## How the backend is wired (use these, don't reinvent them)

- **Global `AuthGuard`** (`common/auth.guard.ts`):
  - every route needs a valid JWT unless it has `@Public()`;
  - it reloads the user on every request, so a deleted or deactivated user gets 401;
  - `@Roles('instructor')` / `@Roles('ta')` returns 403 for the other role;
  - `@CurrentUser() user: AuthUser` gives `{ id, name, email, role }`.
- **`AccessService`** (`access/`, global) is **the only place that decides course access**:
  - `access.course(user, id)` / `access.exam(user, id)` / `access.paper(user, id)`: unknown id → 404, no access → 403;
  - `access.paper` also blocks a TA from someone else's paper;
  - `access.ownedCourse` / `access.ownedExam` are for instructor-only actions;
  - `access.visibleCourseFilter(user)` is a Prisma `where` for lists.
  - **Every course-scoped endpoint calls one of these first.** Never check membership by hand.
- **Errors.** Throw Nest exceptions and the global filter turns them into `{ "error": { "code", "message" } }`:

  | Exception | Status and code |
  |---|---|
  | `BadRequestException` | 400 `VALIDATION_ERROR` |
  | `UnauthorizedException` | 401 |
  | `ForbiddenException` | 403 |
  | `NotFoundException` | 404 |
  | `ConflictException` | 409 (duplicates, wrong state) |
  | `BadGatewayException` | 502 `LLM_FAILURE` |

  The message must say exactly what is wrong: which field, which id, which question code.
- **Validation.** Write a DTO class with `class-validator` decorators for every `@Body()` and `@Query()`.
  - The global pipe rejects bad input with a 400 that names the field, e.g. `criteria[2].maxPoints must be a positive number`, and strips unknown fields.
  - Nested arrays need `@ValidateNested({ each: true })` and `@Type(() => Child)`.
  - Rules that need the DB (e.g. points ≤ the question's max) go in the service.
- **`ActivityService`** (`activity/`, global): `activity.log({ courseId, type, actorId, paperId?, payload })` right after the action succeeds. Types are in the `ActivityType` enum.
- **Responses** are plain objects.
  - Include `viewerRole` on course-level reads.
  - Mark the signed-in user's rows with `isYou: true`.
  - Never return `passwordHash`.
  - Every authenticated response also carries `X-User-Role` / `X-User-Id` headers.
- **Paper lifecycle** (`papers/papers.service.ts`): `TRANSCRIBING → DRAFT → (submit) AI_GRADING → AI_GRADED | AI_FAILED`.
  - Reopen (instructor) goes back to `DRAFT` and writes a `PaperRevision`.
  - Submitting **is** the queue: the AI worker picks papers with `status = AI_GRADING` and `aiNextAttemptAt <= now`, and only writes results while the paper is still `AI_GRADING`.
  - Paper totals come from `papers/paper-totals.ts`. Reports and stats math lives in one stats module. Don't redo the math in endpoints.

## Adding an endpoint

### In an existing module (e.g. a new route in `courses/`)

1. **DTO:** add the class(es) to `<module>.dto.ts`. Trim strings with `@Transform`, and use `@IsIn([...])` for enums.
2. **Service** (`<module>.service.ts`):
   - first line: the `AccessService` check (`access.course/exam/paper/owned…`);
   - then the state checks: 409 for wrong state, 400 for rules that need the DB;
   - then the write, inside `prisma.$transaction` when it touches more than one row;
   - then `activity.log(...)` if it is a user-visible action.
3. **Controller** (`<module>.controller.ts`): a thin method, with `@Roles(...)` when only one role may call it, and `@CurrentUser()` and the DTO. POST actions that aren't creations get `@HttpCode(200)`.
4. **Tests:** add cases to `backend/test/<module>.e2e-spec.ts`. One `it` per rule and per permission: the happy path, 400, 401, 403 (wrong role **and** non-member), 404, and 409 where relevant.
5. **Check:** `npx tsc --noEmit && npm run test:e2e`, then `npx prettier --write src test`.

### In a new folder (new module)

1. `src/<name>/<name>.module.ts`, `<name>.controller.ts`, `<name>.service.ts`, `<name>.dto.ts`. Copy the structure of `courses/` or `papers/`.
2. **Module:** `@Module({ controllers: [...], providers: [...], exports: [Service] })`.
   - `PrismaService`, `AccessService` and `ActivityService` are global: inject them, don't import their modules.
   - Import another feature module only to use its exported service (e.g. `imports: [UsersModule]`).
3. **Register it** in `src/app.module.ts` `imports` (Γιώργος's file: add one line and say so).
4. **Routes:** use `@Controller()` with full paths like `@Get('exams/:id/report')` when the URL nests under another resource. Use `@Controller('things')` for a top-level resource.
5. **Tests:** a new `backend/test/<name>.e2e-spec.ts`. Copy the setup from `test/members.e2e-spec.ts`:
   - `beforeAll` builds the app;
   - calls `wipeDb(prisma)` from `test/helpers.ts`;
   - creates users with `bcrypt.hash('demo1234', 4)`;
   - logs in to get tokens;
   - creates the course, exam and papers directly with Prisma.

   **If you add a table, add it to `wipeDb`, children first.**
6. Same checks as above.

### Pure logic (stats, totals, prompts)

Put it in a plain `.ts` file with no Nest or Prisma imports, and unit-test it in a `*.spec.ts` next to it (`npm test`).

## Frontend

- **Next 16 differs from what you remember.** Read `frontend/node_modules/next/dist/docs/` before using an API you're unsure about.
- **`app/(design)/`:** the new UI. It started as static pages generated from the design mockups. To wire a page:
  1. turn it (or a child component) into a client component;
  2. load data with `apiFetch` from `@/lib/api`;
  3. replace the demo constants and numbers with the data;
  4. on a 403 `ApiError` render `<NoAccess />`.
  - **Never regenerate these pages** from the HTML; edits would be lost.
- **`@/components/shell`:** the design system. Always build UI from it; don't copy styles from scratch.
  - `<AppShell course exam active access="instructor" | "ta">`:
    - loads the signed-in user, or redirects to `/login`;
    - builds the role's sidebar;
    - shows `NoAccess` to the wrong role.
  - Also: `PageHeader` (breadcrumbs and actions), `PageTitle`, `SectionHeader`, `Card`, `Pill` (red = stricter or flagged, blue = AI, green = OK or submitted, amber = in progress, neutral = draft), `Button`, `SecondaryButton`, `IconButton`, `Avatar`, `RoleChip`, `YouTag`, `Kbd`, `Icon`, `NoAccess`.
  - Colours come from the CSS variables in `app/(design)/design.css`, so they work in light and dark. Never hardcode hex colours.
- **Auth** (`@/lib/auth`): `login`, `logout`, `useSession()` (cached signed-in user), `homeFor(user)` (where a role lands), `getCurrentUser`.
  - `apiFetch` adds the token and throws `ApiError(status, code, message)`.
  - On a 401 it clears the token and goes to `/login`.
- **Dark mode** is `<html data-theme="dark">`, saved in localStorage, toggled by `ThemeSwitch`.
- **Routes:**
  - `/login`, `/courses`, `/users`;
  - `/courses/[courseId]`, plus `/stats` and `/members`;
  - `/courses/[courseId]/exams/[examId]/` plus `setup`, `report`, `report/[taId]`, `stats`, `papers`, `papers/new`;
  - `/papers/[paperId]` and `/papers/[paperId]/grade`;
  - `/design` and `/design/states` (design reference).

## Working style with this team

- **Work in small steps** and stop at each commit point with the exact `git add … && git commit -m "…"` commands. **The user makes the commits and pushes themselves.** Don't commit or push unless asked.
- Give shell commands from the repo root, or with `git -C <repo>`. The user's terminal is often inside `backend/`.
- Before finishing:
  - backend: type-check, run the e2e tests and format;
  - frontend: type-check and lint, and check the page in the browser.
  - Report what was verified and what wasn't.
- If a change affects other people's work (API shape, schema, env vars), say so and give a short message the user can post to the team.
