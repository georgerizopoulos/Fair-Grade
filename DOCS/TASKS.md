# Tasks

What is done, what is left, and who owns it. Keep this file short and **true**: when you finish something, move it to *Done* in the same commit.

- **How the code works and the rules:** `CLAUDE.md` (repo root). Read it first, and so does every AI agent.
- **What each endpoint takes and returns:** `DOCS/API_SPEC.md`.

## Deadlines (fixed by the organizers)

| When | What |
|---|---|
| **Fri 2 Oct, 13:00** | **End of hacking.** The Final Pass below is finished before this. |
| Fri 2 Oct, 14:00–15:00 | Pitch preparation |
| Fri 2 Oct, 15:00 | Pitching |

## The demo (never cut)

1. **Instructor:** sign in → **HY335** → **Midterm setup** (questions, model answers, rubric points).
2. **Nikos (TA):** sign in → lands on Midterm **My stats** → **Add paper** csd5150 → grade → **Submit**.
3. **The AI grades it** within seconds. The **paper result** shows TA vs AI per question, with the AI's reasoning.
4. **Instructor:** **Midterm report** → **Maria flagged on Q2 (−1.05)** → her page → the papers behind the flag.

Step 4 works from the seeded papers (`npm run seed`, checked by `scripts/check-demo-numbers.ts`).

---

## Done

| What | Who |
|---|---|
| Skeleton, Prisma + SQLite, auth (JWT, bcrypt), global guard, `@Roles`, error filter, validation pipe | Γιώργος |
| Schema for courses, members, exams, questions, papers, pages, answers, revisions, activity | Γιώργος |
| `AccessService`, courses endpoints, members endpoints, users endpoints (with e2e tests) | Γιώργος |
| Paper lifecycle: get, draft, submit, request-reopen, reopen, retry-ai, my-papers | Γιώργος |
| AI worker: grades submitted papers (Bedrock, retries, AI_FAILED, TA_FLAGGED), with e2e tests | Γιώργος |
| Seed: users, HY335 / HY360 / HY359, every exam and question | Γιώργος |
| Design pages (`frontend/app/(design)`), shared components (`components/shell`), dark mode, real login, role-aware sidebar, "no access" state | Γιώργος |
| Exams and questions endpoints, questions import from PDF | Σταύρος |
| Paper upload (PDF, pages, demo transcription), page rescan | Σταύρος |
| Reports: `my-stats`, exam report, per-TA report | Δημήτρης |
| Pages wired to the API: courses list, course page, exam setup, add paper, grade, paper result | team |
| `llm.client.ts` (Bedrock), prompt and response validation. The old `runGrading()` and `POST /grade/run` were removed; the AI worker is the only grader | Κώστας |
| Seeded HY335 papers for the demo story, `scripts/check-demo-numbers.ts` | Γιώργος |
| Real numbers in `my-stats`, exam report and TA report (`reports/report-math.ts`, unit-tested) | Γιώργος |
| Course stats and activity feed endpoints (`reports/course-stats.ts`), exam status flow (draft → ready → open → published), e2e tests | Γιώργος |
| Pages wired: TA My stats, Report, TA page, Course stats (with live activity and leaderboard visibility), Members, Users, New exam, open/publish an exam | Γιώργος |

## Left, in priority order

| # | What | Who | Notes |
|---|---|---|---|
| 3 | **Tests for papers and reports**: `backend/test/papers.e2e-spec.ts` (every lifecycle rule and permission), reports e2e | Γιώργος, Δημήτρης | Pattern: `test/members.e2e-spec.ts`. |
| 7 | **⌘K search** (`GET /search`) | Δημήτρης | Lowest priority. |
| 8 | **Real handwriting transcription** with a vision model | Κώστας | Only if a vision model is available on Bedrock. The demo fake works without it. |
| 9 | **Deck** | Γιώργος | Problem → solution → live demo → how it works → why it matters → team. |

**If time runs short, cut from the bottom:** 8 → 7. Before the demo run `npm run seed` so test papers don't change the numbers.

---

## Final Pass (all four, before Fri 13:00)

1. **Fresh setup on the demo laptop**, following the README: clone, `npm install` in both apps, `npm run migrate`, `npm run seed`, run.
2. **Run the demo above twice**, timed, on one screen.
3. **Check the numbers:** Maria is flagged on Midterm Q2, and nobody else is flagged on the Midterm.
4. **Delete the old flow** once the new pages work:
   - `frontend/app/(legacy)`;
   - backend `rubrics/ answers/ ta-grades/ grading/ results/ deviation/`;
   - the old tables.
5. **Update `API_SPEC.md` and the README** to match what was built.
6. **Fallback:** grade csd5150 once before pitching and record a screen capture of the full flow, in case the network or the LLM fails on stage.
7. **Decide** who presents (one voice) and who drives the laptop (one person).

## Rules

- `main` always runs. Pull before you start, commit small, push often, never force-push.
- Stay in your folders (see `CLAUDE.md`). `schema.prisma`, `app.module.ts`, `common/` and `access/` are Γιώργος's: ask first.
- Changing an endpoint means updating `API_SPEC.md` in the same commit and telling the team.
- Stuck for more than 15 minutes → say so out loud.
- Never commit `.env`, keys, `dev.db` or uploaded PDFs.
