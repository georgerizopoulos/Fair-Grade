# Tasks

What each person does, in order, for the **course / exam / paper** version of Fair Grade. Finish a numbered step, then move to the next. If a step waits on someone, it says who.

- The change request (flow, rules, API, seed numbers) is referred to as §1–§8. `CHANGES_PLAN.md` (repo root) maps it onto the code.
- `API_SPEC.md` is the contract for **what** each endpoint takes and returns. Whoever builds an endpoint updates its section in the same commit.
- This file is the source of truth for **who** does **what**, and in **which order**.

> **What changed (Thu 1 Oct, afternoon).** The flow moved from "one rubric, a CSV of answers, AI grades a sample" to "courses → exams → questions with model answers → TAs scan papers → TA grades → AI grades the same answers → reports". The new design is in `frontend/app/(design)/` as **static pages**. The old flow still runs under `frontend/app/(legacy)/` and the old endpoints (#6–#15) until the new pages replace them.

---

## Fixed by the organizers

| When | What |
|---|---|
| Thu 1 Oct, 18:30 | Pitch workshop. All four attend. |
| **Fri 2 Oct, 13:00** | **End of hacking.** The Final Pass must be finished before this. |
| Fri 2 Oct, 14:00–15:00 | Pitch preparation |
| Fri 2 Oct, 15:00 | Pitching starts |

---

## Where we are

| Done | Who |
|---|---|
| Skeleton, Prisma + SQLite, auth (JWT, bcrypt), global guard, `@Roles`, error filter, validation pipe | Γιώργος |
| New schema: `Course` (owner, code, semester, leaderboard visibility), `CourseMember`, `Exam`, `Question`, `RubricPoint`, `Paper`, `PaperPage`, `PaperAnswer`, `PaperRevision`, `ActivityLog` | Γιώργος |
| `AccessService` (owner / member → else 403), `GET/POST /courses`, `GET /courses/:id`, `PATCH /courses/:id/settings`, role headers, sign-in tracking | Γιώργος |
| Seed: the §7 users, HY335 / HY360 / HY359, every exam and question (no papers yet) | Γιώργος |
| `llm.client.ts` (Bedrock Converse), `prompt.ts`, `grading.schema.ts`, `runGrading()`, `deviation.ts` (old flow) | Κώστας |
| Answers and TA-grades endpoints, dataset (old flow) | Σταύρος |
| Old dashboard and TA pages (old flow) | Δημήτρης |
| Static design: all 16 pages under `frontend/app/(design)/` | Γιώργος |

---

## The demo we are building

**Never cut.** This is what the jury sees:

1. Log in as the instructor, open **HY335**, then the **Midterm setup**: questions, model answers, rubric points.
2. Log in as **Nikos** (TA), open the Midterm, **add paper** csd5150 (typed answers are fine), grade it, **submit**.
3. The AI grades the same answers in seconds. The **paper result** shows TA vs AI per question with the AI's reasoning.
4. Back as the instructor: the **Midterm report** shows **Maria flagged on Q2 (−1.05)**. Open her page and see the papers behind the flag.

Everything else (handwriting transcription, course stats, leaderboard, search, users admin) is a bonus. See *Priorities* below.

---

## Repo structure and ownership

Only edit files in folders you own. Need a change elsewhere? Ask the owner.

```
backend/
├── prisma/schema.prisma            Γιώργος only (ask him for schema changes)
├── scripts/
│   ├── seed.ts, demo-data.ts       Γιώργος (users, courses, exams, questions)
│   ├── seed-papers.ts              Σταύρος (papers and grades that hit the §7 numbers)
│   └── check-demo-numbers.ts       Σταύρος, using Κώστας's stats module
└── src/
    ├── app.module.ts, common/,     Γιώργος only
    │   access/, auth/, prisma/
    ├── courses/                    Γιώργος   courses, settings, members
    ├── users/                      Γιώργος   GET/POST/PATCH /users
    ├── exams/                      Σταύρος   exams, questions, rubric points
    ├── papers/                     Γιώργος   paper lifecycle (create, PATCH, submit, reopen)
    │   └── upload + pages          Σταύρος   multipart PDF, page files, rescan
    ├── ai/                         Κώστας    llm client, prompts/, transcription, grading, questions import, jobs worker
    ├── stats/                      Κώστας    the one stats module (§3), pure, unit-tested
    ├── reports/                    Δημήτρης  my-stats, exam report, TA report, course stats
    ├── activity/, search/          Δημήτρης
    └── (old) rubrics/ answers/ ta-grades/ grading/ results/ deviation/   frozen; deleted at the end
frontend/
├── app/layout.tsx, lib/, app/(design)/login, app/(design)/layout.tsx   Γιώργος
├── components/shell/               Γιώργος   sidebar, page header, cards, pills, buttons (shared)
├── app/(design)/courses/..., users/                      Δημήτρης  courses, course, members, users, course stats
├── app/(design)/.../exams/[examId]/report/...            Δημήτρης
├── app/(design)/.../exams/[examId]/stats                 Δημήτρης
├── app/(design)/.../exams/[examId]/setup                 Σταύρος
├── app/(design)/.../exams/[examId]/papers/...            Σταύρος
├── app/(design)/papers/...                               Σταύρος
└── app/(legacy)/                   frozen; deleted when the new pages work
```

---

## Track 1 — Γιώργος: foundation, paper lifecycle, integration

1. **Shared UI pieces** (`frontend/components/shell/`). Pull the repeated sidebar, page header, card, pill, button and avatar markup out of the generated `(design)` pages into components that take props: user name, role, current course, nav items, active item. Swap them into every `(design)` page. Make the light/dark choice persist across pages (localStorage). Push and announce. **Everyone else wires pages on top of these.**
2. **Login and session.** Make `(design)/login` sign in for real (`lib/auth.ts`). Redirect: instructor → `/courses`, TA → the stats page of their open exam. The sidebar shows the real name and role. Any page without access shows the "no access" state from `design/states`.
3. **Phase 2 backend:** `POST /users` (temporary password or invite → `INVITED`), `PATCH /users/:id`; `GET/POST/DELETE /courses/:id/members`. Write the `MEMBER_ADDED` / `MEMBER_REMOVED` activity entries. Tests: a TA added to HY360 can open it; after removal, 403 again.
4. **Phase 5 backend, paper lifecycle** in `papers/`:
   - `GET /papers/:id`: AI fields only after submit (TA) or always (instructor).
   - `PATCH /papers/:id`: transcriptions and TA points, `DRAFT` only, owning TA only.
   - `POST /papers/:id/submit`: every question has points, lock, `AI_GRADING`, enqueue the job.
   - `POST /papers/:id/request-reopen` (TA), `POST /papers/:id/reopen` (instructor, writes a `PaperRevision`).
   - `POST /papers/:id/retry-ai`, `GET /exams/:id/my-papers`.
   - Tests for every rule and permission.
5. **Integration.** When Κώστας's jobs worker lands (Track 2 step 4), run the whole demo end to end. Fix integration bugs on the spot.
6. **Floater:** pull `main` every hour and run the demo. Help whoever is stuck.
7. **Deck** (see Pitch).

---

## Track 2 — Κώστας: AI pipeline and stats module

Reuse what you already have: `llm.client.ts`, `grading.schema.ts` and the retry logic in `runGrading()` move into `backend/src/ai/`.

1. **Model.** Ask the organizers for a **vision-capable** Bedrock model. `mistral-large-2402` can't read images. Read the model from `LLM_MODEL`, set temperature 0, and add `LLM_VISION_MODEL` to `.env.example`. Tell the team which models work.
2. **Stats module** in `backend/src/stats/` (§3). Pure functions, no DB:
   - gaps, flags (`n ≥ 3` and `|avg| > 0.15 × max`);
   - TA paper gap, exam average gap, course trend, leaderboard and badges;
   - exact and within-0.5 matches, pass/fail at stake, grade distribution, rubrics to tighten, median time per paper.

   Unit-test each one with hand-made numbers. Push it early: Δημήτρης and Σταύρος both depend on it.
3. **Grading agent** in `ai/grading.ts` (§5). One call per question with the prompt, max points, model answer, rubric points and the transcribed answer, **never** student IDs, names or TA points. Return strict JSON `{questionCode, points, reasoning}`. Clamp to 0…max, round to 0.5, keep at most 2 sentences. Prompts live in `ai/prompts/` with a version.
4. **Jobs worker** in `ai/jobs.ts`. A DB-polled worker inside NestJS picks `AI_GRADING` papers: 3 tries with backoff, then `AI_FAILED`. It writes `AI_GRADED` / `AI_FAILED` activity entries and logs each AI call (model, prompt version, latency, tokens) with no student data. Announce **"AI grading on submit works"** and pair with Γιώργος (Track 1 step 5).
5. **Transcription** in `ai/transcription.ts`, only once a vision model works. Send the PDF pages plus the question list and get back `{answers[], unreadablePages[]}`. Save `PaperAnswer` rows and page statuses as you go.
6. **Questions import** in `ai/questions-import.ts`: a solutions PDF goes in, draft questions come back, nothing is saved.
7. **Tune** the grading prompt on the Midterm questions: the AI's scores for csd5146 should match §7.

---

## Track 3 — Δημήτρης: reports and the instructor pages

1. **Wire the course pages** to the existing endpoints, on top of Γιώργος's shared components (Track 1 step 1):
   - `/courses` → `GET /courses`
   - `/courses/[id]` → `GET /courses/:id`
   - `/courses/[id]/members` → members endpoints (Track 1 step 3)
   - `/users` → `GET /users`

   Mark the current user as "You" in every list of people.
2. **Reports backend** in `reports/`, using Κώστας's stats module (no math of your own):
   - `GET /exams/:id/report` (instructor);
   - `GET /exams/:id/report/tas/:taId` (instructor): papers behind each flag, largest gap first;
   - `GET /exams/:id/my-stats` (TA): respects the leaderboard visibility.

   Until the stats module lands, return the shapes with stub numbers.
3. **Wire the pages** `exams/[examId]/report`, `report/[taId]`, `exams/[examId]/stats`. Keep the empty states: no papers yet, AI still grading.
4. **Course stats:** `GET /courses/:id/stats` and the `/courses/[id]/stats` page (trend, leaderboard, badges, pass/fail at stake, distribution, rubrics to tighten). CSV export only if time allows.
5. `GET /courses/:id/activity` and `GET /search`, plus the ⌘K box. Lowest priority.

---

## Track 4 — Σταύρος: exams, papers and the TA pages

1. **Fix the encoding first.** `answers.module.ts` and `ta-grades.module.ts` are saved as ISO-8859, so lint can't read them. Re-save them as UTF-8.
2. **Phase 3 backend** in `exams/`:
   - `GET/POST /courses/:id/exams`, `GET/PATCH /exams/:id`;
   - `GET /exams/:id/questions`, `PUT /exams/:id/questions` (bulk save; the rubric points must add up to `maxPoints`, and the message names the question);
   - `POST /exams/:id/questions/import`, calling Κώστας's import (Track 2 step 6).

   Instructor and owner only, through `AccessService`.
3. **Wire `exams/[examId]/setup`**: load, edit, add/remove/reorder questions and rubric points, "adds up to" check, save.
4. **Phase 4 backend**, the upload part of `papers/`:
   - `POST /exams/:id/papers`: multipart PDF and `studentId`; files stored in `backend/uploads/`, which is gitignored.
   - Create the `Paper` and its `PaperPage` rows. With no vision model yet, go straight to `DRAFT` with empty answers (typed-answer fallback, §5).
   - `POST /papers/:id/pages/:index/rescan`.
5. **Wire the TA pages**:
   - `papers` (list, filters, search);
   - `papers/new` (upload, page statuses polled every 2–3 s);
   - `papers/[id]/grade` (transcription editable, points 0–max in 0.5 steps, live total, save draft, submit with confirmation);
   - `papers/[id]` (result, poll while `AI_GRADING`, reopen request, retry).
6. **Demo papers** in `scripts/seed-papers.ts`. Add the §7 papers so the numbers hold: Maria −1.05 on Midterm Q2, Nikos's anchor papers csd5121…csd5150 with exact TA/AI points, csd5146 with its transcription and reasoning, the 167 papers course-wide. Write `check-demo-numbers.ts` with the stats module and make it pass. Priority order:
   1. the Midterm (Maria's flag and Nikos's anchors);
   2. then Quiz 1 and Quiz 2;
   3. then the exact course-wide totals.

---

## Who waits on whom

| Waiting | For | Until then |
|---|---|---|
| Everyone (frontend) | Shared components (Track 1 step 1) | backend work |
| Δημήτρης, Σταύρος (real data in pages) | Login wired (Track 1 step 2) | pages with the static content |
| Δημήτρης (reports) | Stats module (Track 2 step 2) | same response shapes, stub numbers |
| Σταύρος (`check-demo-numbers`) | Stats module (Track 2 step 2) | write the seed |
| Γιώργος (submit → AI) | Jobs worker (Track 2 step 4) | submit sets `AI_GRADING` and stops |
| Everyone (handwriting) | Vision model (Track 2 step 1) | typed answers |

---

## Priorities: what to cut if time runs short

**Never cut** (the demo above):
1. login with both roles;
2. Midterm setup page with real questions;
3. add paper (typed), grade, submit;
4. AI grade on submit and the paper result;
5. Midterm report with Maria flagged, plus her page;
6. the seed that produces those numbers.

**Cut in this order**, first to last:
1. ⌘K search and the activity feed: the static page keeps showing them.
2. Handwriting transcription: keep typed answers and say "vision is the next step" on stage.
3. Questions import from a PDF.
4. Course stats wired to data: keep the static page.
5. Users admin and members management: keep the seeded accounts.
6. Exact course-wide numbers: keep only the Midterm exact.
7. Reopen with history.

Cutting is a team decision made out loud and early, not at 12:30 on Friday.

---

## Final Pass: all four, finished before Fri 13:00

1. **Fresh setup on the demo laptop.** Clone, `npm install`, `npm run migrate`, `npm run seed`, run, following the README exactly.
2. **Full walkthrough on one screen.** Run the demo above, twice, timed.
3. **Check the numbers.** `check-demo-numbers` passes. Maria is flagged on Midterm Q2 and nobody else on the Midterm.
4. **Delete the old flow:** `app/(legacy)`, `rubrics/`, `answers/`, `ta-grades/`, `grading/`, `results/`, `deviation/`, old tables. Only once the new pages work.
5. **Update the docs** to match what was built: `API_SPEC.md` and the README.
6. **Fallback.** Grade csd5150 once before pitching and record a screen capture of the full flow. If the network or the LLM fails on stage, show those instead.
7. **Decide** who presents (one voice) and who drives the laptop (one person).

---

## Pitch

- All four attend the pitch workshop on Thu at 18:30.
- **Γιώργος owns the deck.** Everyone reviews it on Friday 14:00–15:00.
- Slides: problem → solution → live demo → how it works (one diagram: scan → TA grade → AI grade → report) → why it matters → team.

---

## Rules while working

- **`main` always runs.** Pull before you start, commit small, push often, never force-push.
- **Stay in your folders.** `schema.prisma`, `app.module.ts`, `common/`, `access/` are Γιώργος's. Ask him for changes.
- **Every course-scoped endpoint goes through `AccessService`.** Never check membership by hand.
- **The AI never receives student IDs, names or TA points.**
- **No demo numbers hardcoded in the UI.** Every number comes from the database.
- **Stuck for more than 15 minutes → say so out loud.**
- **Never commit `.env`, keys or uploaded PDFs.**
