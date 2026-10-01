# Fair Grade

Consistent, transparent grading across every TA — powered by AI.

Built for the [FuturEd AI Hackathon](https://hackathon.csd.uoc.gr) 2026 by Team Byte Me.

## The Problem

In university courses with multiple teaching assistants grading the same exam, identical answers can receive different scores depending on who grades them — even when everyone follows the same rubric. Students notice. Students complain. Instructors have no systematic way to catch it before final grades go out.

## The Solution

Fair Grade gives instructors an independent, AI-powered second opinion on grading consistency.

1. The instructor uploads a rubric and the students' answers
2. TA grades come in — imported by the instructor, or entered by each TA through their own login
3. An LLM grades every answer independently, against the same rubric, without seeing any TA's scores
4. The system compares the AI's scores with each TA's scores, criterion by criterion
5. Systematic gaps are flagged — e.g. "Maria is on average 1.4 points stricter than the AI on *clearly organized*"
6. The instructor fixes inconsistencies before grades are finalized

Fair Grade isn't meant to replace human judgment — it's a quality-control layer that turns a vague suspicion ("something feels off with the grading") into a measurable, actionable report.

## Why This Idea

Most education-AI projects target the student — tutors, gamified learning, study tools, knowledge maps. Fair Grade takes the opposite angle: it targets the instructor and course staff, directly answering the hackathon brief's call for "smarter administrative tools."

- Real, recurring problem in every large course with multiple TAs
- Measurable output (deviation per TA, per criterion) instead of vague "engagement" claims
- Feasible to build end-to-end in a weekend
- Matches the team's existing skill set

## How It Works

```
Instructor uploads        TAs submit grades          AI grades every answer
rubric + answers   --->   (or the instructor   --->  against the same rubric
                           imports them)                      |
                                                              v
                        Dashboard  <---  Gap per TA, per criterion
                   (flagged TAs + examples)
```

- **Independent grading:** the AI never sees a TA's score, so it can't be anchored by it
- **Criterion-level analysis:** gaps are measured per rubric criterion, not just on the total
- **Pattern, not noise:** a single disagreement is normal; a flag needs a consistent gap across at least 3 answers, larger than 15% of that criterion's points
- **Explainable:** every AI score comes with a short reasoning, so the instructor sees *why*, not just a number
- **Role-based access:** instructors and TAs log in separately, and a TA can only ever submit grades under their own name

## Roles

| Role | Can |
|---|---|
| Instructor | create rubrics, upload answers, import TA grades, run AI grading, see the dashboard |
| TA | see rubrics and answers, enter and update their own grades |

## Pages

| Route | Who | What it does |
|---|---|---|
| `/login` | everyone | email + password; instructors go to `/upload`, TAs go to `/ta` |
| `/upload` | instructor | shows what's loaded; add a rubric, answers, and TA grades; **Run AI Grading** |
| `/dashboard?rubricId=` | instructor | every TA for the rubric, with a Flagged / OK badge and their average gap |
| `/dashboard/[taId]?rubricId=` | instructor | one TA: the gap on each criterion, the answers behind each flag with the AI's reasoning, and every answer they graded next to the AI's score |
| `/ta` | TA | pick a rubric, read the answers, enter your own scores per criterion |

Which endpoint each page calls is in the Endpoint Index of `API_SPEC.md`.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS (TypeScript) |
| Frontend | Next.js (TypeScript, App Router), Tailwind CSS, shadcn/ui |
| Database | PostgreSQL via Prisma (SQLite as a fallback) |
| Auth | Email + password, bcrypt, JWT |
| AI | The LLM API provided at the event, called only from the backend |

## Data Model

```
users            id, name, email, password_hash, role (instructor | ta)
courses          id, name
rubrics          id, course_id, question_text
criteria         id, rubric_id, position, description, max_points
student_answers  id, rubric_id, student_id_anon, answer_text
ta_grades        id, answer_id, criterion_id, ta_id -> users, points_given
ai_grades        id, answer_id, criterion_id, points, reasoning
```

The deviation report is not stored — it's computed from `ta_grades` and `ai_grades` each time the dashboard asks for it. The full schema, with every constraint, is in `API_SPEC.md`.

## Getting Started

Backend (first terminal):

```bash
cd backend
npm install
cp .env.example .env     # fill in DATABASE_URL, JWT_SECRET, LLM_API_KEY, LLM_MODEL
npm run migrate
npm run seed             # wipes the database and loads the demo dataset
npm run start:dev        # http://localhost:3001  (check http://localhost:3001/health)
```

Frontend (second terminal):

```bash
cd frontend
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:3001
npm run dev                  # http://localhost:3000
```

Demo logins are the ones in `dataset/users.json`. After re-running the seed, log in again.

## MVP Scope

In scope:

- 1 course, 1 rubric, 15-20 typed answers, 2-3 synthetic TAs
- Email + password login with two roles; demo accounts are seeded, there's no sign-up page
- AI grading, deviation report, dashboard with drill-down, TA grading page
- Typed math answers (limits, integrals, etc.) — see `DATASET.md`

Out of scope for the weekend:

- Answers that are diagrams or photos of handwriting (would need a vision model and file upload)
- Managing many courses and rubrics at once
- Editing or deleting data — reset with `npm run seed` instead
- Export (PDF/CSV), semantic matching of answers, notifications

## Demo Script

1. State the problem in one sentence (grading inconsistency between TAs)
2. Log in as the instructor
3. Show `/upload` with the rubric, answers, and TA grades already loaded — don't type data live
4. Click **Run AI Grading** and let it run
5. Open the dashboard — one TA is flagged
6. Drill down — show an answer, the TA's score, the AI's score, and the AI's reasoning
7. (Optional, 20 seconds) Log in as a TA — show they can only grade under their own name
8. Close with why it matters — fairness, transparency, fewer disputes after grades come out

If the network or the LLM fails on stage, show the dashboard from the grading run done before the pitch, or the screen recording (see `TASKS.md`, Final Pass).

## Documents

- `API_SPEC.md` — every endpoint: who can call it, what it takes, what it returns, and how deviation is calculated. The contract everyone builds against.
- `TASKS.md` — what each person does, in order; who waits on whom; what to cut first if time runs short.
- `DATASET.md` — how the demo logins, rubric, answers, and TA grades are written.
