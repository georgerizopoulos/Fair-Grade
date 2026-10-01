# Tasks

What each person does, in order. Finish a numbered step, move to the next. If a step says to wait for something, it also says who you're waiting on. Nobody should have to ask "what do I do now."

- `API_SPEC.md` is the source of truth for **what** each endpoint takes and returns (referred to below as #1-#15).
- `DATASET.md` is the source of truth for the demo data.
- This file is the source of truth for **who** does **what**, and in **which order**.

---

## Fixed by the organizers

From the official agenda — these don't move:

| When | What |
|---|---|
| Thu 1 Oct, 10:30 | Bootstrap workshop (the organizers' starter repo and tools are presented) |
| Thu 1 Oct, 11:00 | Hacking starts → Kickoff (section 0) happens right here |
| Thu 1 Oct, 18:30 | Pitch workshop — all four attend |
| **Fri 2 Oct, 13:00** | **End of hacking.** The Final Pass must be finished before this. |
| Fri 2 Oct, 14:00-15:00 | Pitch preparation |
| Fri 2 Oct, 15:00 | Pitching starts |

**No pre-existing code** (FAQ): everything is written from scratch during the event. Planning documents like these four files are fine; code is not.

---

## Before the event

Allowed prep — no code.

**Γιώργος**
1. Send the organizers a message via the Contact form on the site, asking: (a) may we prepare synthetic sample data (text, not code) before the event? (b) what exactly must be submitted at the end — repo link, slides, video — and by when? (c) how long is each pitch? (d) which LLM API/credits will be provided? Share the answers with the team.
2. Create an empty GitHub repo, add the other three as collaborators, and commit only these four `.md` files.

**Everyone**
1. Install: Node.js LTS, git, PostgreSQL (or Docker Desktop to run it), an HTTP client (Postman or the Thunder Client VS Code extension), and your editor with the AI coding assistant you'll use, already logged in.
2. Clone the repo and confirm you have push access: create a branch, push an empty commit (`git commit --allow-empty -m "access test"`), then delete the branch.
3. Read all four documents. Read your own track twice.

---

## Repo structure and ownership

Everyone only edits files in the folders they own. This is what stops four people from overwriting each other.

```
fair-grade/
├── README.md, API_SPEC.md, TASKS.md, DATASET.md    everyone (announce changes out loud)
├── dataset/                                        Σταύρος
│   └── users.json, rubric.json, answers.json, ta-grades.json
├── backend/
│   ├── prisma/schema.prisma                        Γιώργος only
│   ├── scripts/seed.ts                             Γιώργος (wipe + users part), Σταύρος (dataset part)
│   └── src/
│       ├── app.module.ts                           Γιώργος only
│       ├── common/                                 Γιώργος (guards, @Roles, error filter)
│       ├── health/                                 Γιώργος   (#1)
│       ├── auth/                                   Γιώργος   (#2, #3, #4)
│       ├── users/                                  Γιώργος   (#5)
│       ├── rubrics/                                Γιώργος   (#6, #7, #8)
│       ├── answers/                                Σταύρος   (#9, #10)
│       ├── ta-grades/                              Σταύρος   (#11, #12)
│       ├── grading/
│       │   ├── grading.controller.ts               Γιώργος   (#13)
│       │   ├── grading.service.ts                  Κώστας    (runGrading)
│       │   ├── llm.client.ts                       Κώστας
│       │   ├── prompt.ts                           Κώστας
│       │   └── deviation.ts                        Κώστας    (computeDeviation)
│       ├── results/                                Δημήτρης  (#14)
│       └── deviation/                              Δημήτρης  (#15 controller — logic imported from grading/deviation.ts)
└── frontend/
    ├── lib/api.ts, lib/auth.ts                     Γιώργος
    ├── app/layout.tsx, app/page.tsx, app/login/    Γιώργος
    ├── app/upload/                                 Σταύρος
    ├── app/dashboard/  (+ [taId]/)                 Δημήτρης
    ├── app/ta/                                     Δημήτρης
    └── mocks/                                      Δημήτρης and Σταύρος, one file each
```

If you truly need to change a file someone else owns, tell them first and let them make the change.

---

## 0. Kickoff — all four, together

Right after the bootstrap workshop, at 11:00. A conversation, not coding.

1. **Look at what the bootstrap repo gives you** — stack, LLM access, credits. If it includes a working scaffold or an LLM client, build on it: adapt Track 1 step 1 and Track 2 step 1. The API contract and the task split stay the same whatever the framework.
2. **Walk through the Endpoint Index in `API_SPEC.md`** — all 15 endpoints. For each, confirm out loud that everyone agrees on the shape. Any change is made in the file right now.
3. **Confirm the demo accounts** are the ones in `DATASET.md` (`users.json`).
4. **Confirm tracks and folders** (Repo structure above).
5. **Confirm the LLM key**: Κώστας gets it working first (Track 2 step 1) and shares it; everyone puts it in their own `backend/.env`. Nobody commits it.
6. Go to your track.

---

## Track 1 — Γιώργος: foundation, auth, integration

You unblock everyone else, in three checkpoints. Announce each one out loud in the group chat the moment it's pushed.

### Checkpoint A — skeleton

1. Create `backend/` (NestJS, TypeScript) and `frontend/` (Next.js, TypeScript, App Router) in the repo — or adapt the bootstrap repo if it already provides this. In the frontend, install Tailwind CSS and shadcn/ui now, so all three frontend people use the same components.
2. Backend basics: run on port 3001, enable CORS for `http://localhost:3000`, implement `GET /health` (#1).
3. Create `backend/.env.example`:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fairgrade
   JWT_SECRET=change-me
   LLM_API_KEY=
   LLM_MODEL=
   PORT=3001
   CORS_ORIGIN=http://localhost:3000
   ```
   and `frontend/.env.example`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
   Commit both. Add `.env` and `.env.local` to `.gitignore`.
4. Add npm scripts with exactly these names, so the README commands work: backend `start:dev`, `migrate`, `seed`; frontend `dev`.
5. Push. Announce **"Checkpoint A: skeleton is up."** Everyone pulls, runs both apps, and opens `http://localhost:3001/health`. Anyone whose setup fails says so immediately — fix it together before moving on.

### Checkpoint B — database, auth, guards

6. Set up Prisma with PostgreSQL. If Postgres isn't running on everyone's machine within a few minutes, switch to SQLite — don't debate it. Write the full schema from `API_SPEC.md` → Database Schema: every table, column, foreign key, and unique constraint, including `criteria.position`.
7. Run the migration. Open the database directly and confirm the tables are there.
8. Create one NestJS module per folder in the Repo structure (health, auth, users, rubrics, answers, ta-grades, grading, results, deviation), empty but wired into `app.module.ts`. After this, nobody else ever needs to touch `app.module.ts`.
9. Implement auth: #2, #3, #4 — bcrypt for passwords, JWT with payload `{ sub, role, name }`, 24-hour expiry, signed with `JWT_SECRET`. #4 must return 401 if the user in the token no longer exists.
10. Implement, in `common/`:
    - an auth guard that reads `Authorization: Bearer <token>` and returns 401 if missing/invalid;
    - a `@Roles('instructor')` / `@Roles('instructor', 'ta')` decorator that returns 403 for the wrong role;
    - a global exception filter so **every** error from **every** module comes out in the `API_SPEC.md` error shape with the right code;
    - a global validation pipe so invalid bodies automatically return 400 `VALIDATION_ERROR`.
    Write one example endpoint using all of it, so the others can copy the pattern.
11. Push. Announce **"Checkpoint B: database, auth, guards, and module folders are live — start your endpoints."**

### Checkpoint C — login, shared frontend, read endpoints, seed

12. In `frontend/lib/`:
    - `api.ts` — an `apiFetch()` wrapper: prefixes `NEXT_PUBLIC_API_URL`, attaches the token, parses the error shape into a readable message, and on any 401 clears the token and redirects to `/login`;
    - `auth.ts` — `login()`, `logout()`, `getCurrentUser()` (calls #4), and a `useRequireRole(role)` hook that redirects to `/login` if the user isn't logged in or has the wrong role.
13. Pages and layout:
    - `/login` — email + password form calling #3; on success, instructors go to `/upload`, TAs go to `/ta`;
    - `/` — redirects by role (instructor → `/upload`, TA → `/ta`, logged out → `/login`);
    - shared layout with a top bar: instructors see **Upload · Dashboard · Log out**, TAs see **Grade · Log out**, plus the logged-in user's name.
14. Endpoints #5, #6, #7, #8.
15. Create `backend/scripts/seed.ts` (`npm run seed`): wipe every table (child tables first), then create every user from `dataset/users.json` with bcrypt-hashed passwords, writing to the database directly through Prisma — no running server needed. Σταύρος adds the rest of the dataset to this same file (Track 4 step 5); there is only ever one seed script.
16. Push. Announce **"Checkpoint C: login, navigation, rubric/user endpoints, and seed are live — wire your pages to real auth and data."** Post the demo logins.

### Integration

17. When Κώστας announces his grading module is ready (Track 2 step 9), pair with him on #13 in `grading.controller.ts`: load the rubric, its criteria, and its answers; call `runGrading()`; upsert the results into `ai_grades`; return the summary exactly as in `API_SPEC.md`. Add an in-memory lock so a second call for the same rubric while one is running returns 409. `@Roles('instructor')`.
18. Test #13 end-to-end: `npm run seed`, log in as the instructor, run grading, then open `/dashboard` and confirm Δημήτρης's page shows real results.
19. From here you're the floater. Every so often, pull `main` and run the whole flow (seed → log in → run grading → dashboard → drill-down → log in as a TA) to catch integration breaks early. Help whichever track is stuck.
20. Draft the presentation (see Pitch).

**Done when:** all three checkpoints are announced, #13 works end-to-end, and the deck draft exists.

---

## Track 2 — Κώστας: AI grading engine

Start immediately — step 1 doesn't need the repo. Your code ends up in `backend/src/grading/` (see Repo structure).

1. Get LLM access working with whatever the event provides: a 10-line throwaway script that sends one prompt and prints the answer. Do this first — if access is broken, the whole team needs to know now, not in the afternoon. Share the working key/config with the team.
2. After Checkpoint B: write `computeDeviation(rubric, aiGrades, taGrades, taUsers)` in `deviation.ts`, implementing `API_SPEC.md` → Deviation Rules exactly, with `FLAG_RATIO` and `MIN_SAMPLES` as constants at the top. It returns the `taSummaries` array of #15. It's a pure function — no database, no LLM. Unit-test it with hand-made numbers, including:
   - a TA with fewer than 3 answers on a criterion is never flagged, however big the gap;
   - a TA stricter on one criterion and more lenient on another does **not** get `overallDeviation` near 0;
   - a criterion the TA never graded appears with `sampleSize: 0`, `avgDeviation: null`.
   Push it and tell Δημήτρης — he swaps it into #15 (Track 3 step 3).
3. Write `llm.client.ts`: one function, `complete(systemPrompt, userPrompt) → string`, reading `LLM_API_KEY` and `LLM_MODEL` from `.env`. Switching provider later (direct API, AWS Bedrock, whatever is given) must only touch this file.
4. Write the first prompt in `prompt.ts`:
   ```
   You are an exam grader. Grade the student's answer against the rubric.

   Question: {questionText}

   Rubric criteria (JSON):
   [{ "criterionId": "...", "description": "...", "maxPoints": 3 }, ...]

   Student answer:
   {answerText}

   Rules:
   - Grade every criterion independently, from 0 to its maxPoints. Half points are allowed.
   - Judge only what is actually written. Don't give credit for what the student might have meant.
   - For each criterion, give one or two sentences of reasoning that point to what the answer does or doesn't say.
   - Write the reasoning in the same language as the student's answer.

   Return ONLY this JSON, with exactly one entry per criterion:
   { "scores": [ { "criterionId": "...", "points": 0, "reasoning": "..." } ] }
   ```
5. Test it by hand on 3-4 answers: one clearly good, one clearly bad, one half-right. Use `dataset/rubric.json` once Σταύρος pushes it (Track 4 step 1), or the TCP rubric from `DATASET.md` until then.
6. Turn on the provider's JSON / structured-output mode if it has one. Either way, validate every response (Zod is fine): every `criterionId` present exactly once, `0 ≤ points ≤ maxPoints`, `reasoning` not empty. Invalid → retry the same answer, up to 2 more times.
7. Tune until grading is consistent: the same answer should get the same scores across 2-3 runs (use temperature 0 or the lowest the provider allows). Try harder cases — correct but badly explained, right idea in the wrong words, confidently wrong — and adjust the prompt wording, not just the test answers.
   - **If the rubric is math-based:** the AI can get the computation itself wrong, not just the judgment. Test 2-3 answers whose correct result you already know, and confirm the AI's scores match reality. A wrong AI grade shows up as a "biased TA" flag when the AI is the one that's wrong.
8. Write `runGrading(rubric, answers) → { aiGrades, failedAnswers }` in `grading.service.ts`: one LLM call per answer, up to 5 answers in parallel, with the step 6 validation and retries. An answer that still fails goes into `failedAnswers`; the others continue. It never receives TA grades.
9. Push. Announce **"runGrading is ready"** with its signature, and pair with Γιώργος on #13 (Track 1 step 17).
10. After the first real grading run on the full dataset: compare the AI's scores with the intended scores Σταύρος wrote down (`DATASET.md`). If the AI is consistently off on a criterion, fix the prompt — or agree with Σταύρος to reword the criterion — before anything else. Otherwise a fair TA can be flagged because the AI is wrong.
11. Stay close to this code for the rest of the event. If grading fails or scores look odd, you're the one who can diagnose it fastest.

**Done when:** the full dataset grades with no failures, and the flags on the dashboard match the pattern planted in the dataset.

---

## Track 3 — Δημήτρης: dashboard and TA page, full-stack

You own #14 and #15 (backend) and the `/dashboard`, `/dashboard/[taId]`, and `/ta` pages (frontend).

1. **After Checkpoint A — frontend with mock data.** Copy the #15 and #14 example responses from `API_SPEC.md` into `frontend/mocks/dashboard.ts` and build against them. No auth yet.
   - `/dashboard?rubricId=` — one row or card per TA: name, answers graded, overall deviation, and a badge (red **Flagged** / green **OK**). Flagged TAs first. Click → drill-down.
   - `/dashboard/[taId]?rubricId=` — the TA's name and flagged-criteria count; one row per criterion (description, max points, average gap written as text — e.g. "1.42 points stricter than the AI" — sample size, flag); under each flagged criterion, its examples: the answer text, TA points vs AI points, and the AI's reasoning. Below that, a table of every answer this TA graded, AI vs TA per criterion (from #14 with `?taId=`).
   - Empty states: `aiGraded: false` → "AI grading hasn't been run yet" with a link to `/upload`; no TAs → "No TA grades uploaded yet."
2. **After Checkpoint B:** implement #14 in `results/`, including the `?taId=` filter, `@Roles('instructor')`, exactly per `API_SPEC.md`.
3. Implement #15 in `deviation/`: load the rubric, its criteria, `ai_grades`, `ta_grades`, and the TA users, and pass them to Κώστας's `computeDeviation()`. Until he pushes it (Track 2 step 2), use a temporary stub with the **same signature** that returns your mock data — then swapping is a one-line change.
4. Test #14 and #15 by hand against seeded data, both before AI grading (`aiGraded: false` paths) and after.
5. **After Checkpoint C:** protect both dashboard pages with `useRequireRole('instructor')`; replace the mocks with real calls through `apiFetch()`; add the rubric picker from #7 (default: the newest rubric with `aiGraded: true`, else the newest). Keep `rubricId` in the URL so refreshing keeps the same view.
6. Build `/ta` (role `ta`, protected with `useRequireRole('ta')`), using Σταύρος's endpoints — mock them until they're pushed:
   - pick a rubric (#7) → load its criteria (#8), its answers (#10), and the TA's existing grades (#12);
   - show each answer with one number input per criterion (0 to `maxPoints`, steps of 0.5), pre-filled with what the TA already saved;
   - a **Save** button per answer that sends #11 **without** `taId` (the backend uses the token), then shows "Saved";
   - progress at the top: "Graded 4 of 6."
7. After the first real grading run: confirm the TA planted as biased in the dataset is flagged and the others aren't. If not, it's a data or prompt problem, not a UI one — tell Κώστας and Σταύρος.
8. Stay available to pair with anyone stuck on backend or integration.

**Done when:** the dashboard and drill-down show real data for the seeded rubric, and a TA can log in and save grades on `/ta`.

---

## Track 4 — Σταύρος: dataset, upload flow, full-stack

You own the `dataset/` files, #9-#12 (backend), the `/upload` page (frontend), and the dataset part of the seed script.

1. **Right after Kickoff — no code needed:** write the four files in `dataset/` exactly per `DATASET.md`. Push `rubric.json` first (Κώστας needs it for prompt testing), then `users.json`, then `answers.json`, then `ta-grades.json`. Write down, somewhere the team can see, the intended score for every answer per criterion, and which TA has the planted bias on which criterion.
2. **After Checkpoint A — frontend with mock data.** Build `/upload` against mocks in `frontend/mocks/upload.ts`. No auth yet.
   - **Top of page:** the current rubric (picker if more than one), and status: answers uploaded, grades per TA, AI graded yes/no.
   - **Step 1 — Rubric:** course, question, and criteria rows (add/remove, description + max points, running total) → #6.
   - **Step 2 — Answers:** paste CSV (format in `DATASET.md`) or add rows by hand → preview table → #9.
   - **Step 3 — TA grades:** pick the TA (from #5), paste CSV (format in `DATASET.md`) → preview that matches students to answer IDs (#10) and columns to criteria (#8), marking unknown students and out-of-range scores **before** sending → #11 with that `taId`.
   - **Run AI Grading** button → #13 → spinner with "Grading N answers…" → on success show "Graded X of Y" (and any failed answers), then go to `/dashboard?rubricId=...`.
   - Use `papaparse` for the CSV.
3. **After Checkpoint B:** implement #9, #10, #11, #12 in `answers/` and `ta-grades/`, exactly per `API_SPEC.md`: validation, all-or-nothing transactions, upsert for #11, and the different behavior for TA vs instructor in #11 and #12. Use Γιώργος's `@Roles` decorator.
4. Test each endpoint by hand (Postman or Thunder Client) with both an instructor token and a TA token:
   - unknown `rubricId` → 404;
   - the same `studentIdAnon` twice → 409 and nothing saved;
   - a TA sending another TA's `taId` → the grades are saved under the sender's own ID;
   - a TA calling #9 → 403;
   - no token → 401.
5. **After Checkpoint C:** add the dataset part to `backend/scripts/seed.ts`, after Γιώργος's users part: create the rubric (criteria with `position`), the answers, and the TA grades from the `dataset/` files — turning each `taEmail` into a user ID, each `studentIdAnon` into an answer ID, and each `scores[i]` into the criterion at position `i + 1`. Check the files first and print a clear message naming the bad line if anything doesn't match. `npm run seed` must work no matter how many times it's run. Announce when it works.
6. Protect `/upload` with `useRequireRole('instructor')`, replace the mocks with real calls through `apiFetch()`, and show API error messages to the user.
7. Stay available for upload and seed issues, and to pair with anyone stuck.

**Done when:** `npm run seed` loads the full dataset in one command, and `/upload` shows it, accepts new data, and runs grading.

---

## Who waits on whom

| Waiting person | Waits for | Until then |
|---|---|---|
| Δημήτρης, Σταύρος (frontend) | Checkpoint A | Σταύρος writes the dataset; Δημήτρης reads `API_SPEC.md` #14-15 and sketches the pages |
| Δημήτρης, Σταύρος (backend) | Checkpoint B | keep building frontend with mocks |
| Κώστας (`computeDeviation`) | Checkpoint B | LLM access and prompt work (steps 1, 3-4) |
| Δημήτρης (#15 real logic) | Κώστας, Track 2 step 2 | stub with the same signature |
| Δημήτρης, Σταύρος (real auth and data) | Checkpoint C | mocks |
| Δημήτρης (`/ta` real data) | Σταύρος, Track 4 step 3 | mocks |
| Γιώργος (#13) | Κώστας, Track 2 step 9 | floater work |
| Everyone (real dashboard results) | #13 working (Track 1 step 18) | seeded data with `aiGraded: false` |

---

## Priorities — what to cut if time runs short

**Never cut** — this is the demo:
1. `npm run seed` loading the dataset
2. Instructor login
3. `POST /grade/run` (#13) grading the dataset
4. `/dashboard` showing the biased TA flagged
5. `/dashboard/[taId]` showing the flagged examples with the AI's reasoning
6. Checking that the flags are right (Track 2 step 10) and rehearsing

**Cut in this order**, first to last, and only as far as needed:
1. `/ta` page — keep TA login; say in the pitch that TAs can only grade under their own name (the backend enforces it either way).
2. CSV paste and forms on `/upload` — keep `/upload` as a status view with the **Run AI Grading** button; all data comes from the seed.
3. The full answers table at the bottom of the drill-down (#14) — keep the flagged examples from #15.
4. The rubric picker — always use the newest rubric.
5. Visual polish beyond clean and readable.

Whoever notices a track falling behind says so out loud. Cutting is a team decision, made early, not a surprise at 12:30 on Friday.

---

## Final Pass — all four together, finished before Fri 13:00

1. **Fresh setup on the demo laptop:** clone, install, migrate, seed, run — following the README exactly. This proves it runs somewhere other than the developer's own machine.
2. **Full walkthrough on one screen:** log in as the instructor → `/upload` shows the data → Run AI Grading → dashboard → drill-down → log out → log in as a TA → `/ta`.
3. Fix integration bugs on the spot. Don't queue them.
4. **Check the flags:** the planted TA is flagged on the planted criterion; nobody else is. If not, first compare the AI's scores with the intended ones (prompt or criterion wording). Change `FLAG_RATIO` or `MIN_SAMPLES` in `deviation.ts` only as a last resort.
5. Pick the 2-3 examples you'll click on stage and note them down.
6. Visual pass on every page together.
7. **Decide who presents** (one voice) and **who drives the laptop** (one person, the whole time).
8. **Prepare a fallback:** run grading once before pitching so the dashboard already has results, and record a short screen capture of the full flow. If the Wi-Fi or the LLM fails on stage, show the pre-graded dashboard or the recording instead of waiting on a spinner.
9. Rehearse the Demo Script (`README.md`) out loud at least twice, timed.

---

## Pitch

- **All four attend the pitch workshop** on Thu at 18:30 — it will likely say how long the pitch is and what it should contain.
- **Γιώργος owns the deck** (Track 1 step 20); everyone reviews it during pitch preparation on Friday. Past teams each submitted a presentation (see the Past Events page on the hackathon site), so plan to hand one in.
- Suggested slides: the problem → the solution → live demo → how it works (one architecture diagram) → why it matters → the team.

---

## Rules while working

- **`main` always runs.** Pull before you start, commit small, push often. Never force-push.
- **Stay in your own folders** (Repo structure). Need a change in someone else's file? Ask them.
- **`schema.prisma` and `app.module.ts` are Γιώργος's.** Schema change needed → ask him.
- **`API_SPEC.md` is the contract.** If it has to change, edit the file and say it out loud before continuing — the other side's code depends on the old shape.
- **Stuck for more than 15 minutes → say so out loud.** Γιώργος (the floater) or whoever your track names will help.
- **Never commit `.env`, `.env.local`, or any API key.**
