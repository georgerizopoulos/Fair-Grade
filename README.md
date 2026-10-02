# Fair Grade

Consistent, transparent grading across every TA, with an AI second opinion.

Built for the [FuturEd AI Hackathon](https://hackathon.csd.uoc.gr) 2026 by Team Byte Me.

## The Problem

In university courses where several teaching assistants grade the same exam, identical answers can receive different scores depending on who grades them, even when everyone follows the same rubric. Students notice. Students complain. Instructors have no systematic way to catch it before final grades go out.

## The Solution

Fair Grade gives the instructor an independent AI grade for every paper and shows, per TA and per question, where the TAs and the AI disagree.

1. The instructor creates a **course**, adds the **TAs as members**, and sets up each **exam**: the questions, a model answer for each, and rubric points that add up to the question's maximum.
2. A TA adds a **paper**: one student, a scanned PDF. The answers are transcribed; the TA checks the text and grades each question.
3. The TA **submits**. Their points are locked.
4. The **AI grades the same transcribed answers** in the background, against the same model answers and rubric. It never sees the TA's points, the student ID or any name.
5. The TA sees TA vs AI per question. The instructor sees the **report**: a TA is flagged when their average gap on a question is more than 15% of its points over at least 3 papers, e.g. *"Maria gives papers 1.4 points less than the AI on average, almost all of it on Q2."*
6. The instructor opens the papers behind the flag, reads the AI's reasoning, and reopens the ones to regrade before grades are published.

Fair Grade doesn't replace human judgement. It is a quality-control layer that turns a vague suspicion ("something feels off with the grading") into a measurable, actionable report.

## Why This Idea

Most education-AI projects target the student. Fair Grade targets the instructor and course staff, answering the hackathon brief's call for "smarter administrative tools".

- A real, recurring problem in every large course with several TAs
- Measurable output (gap per TA, per question) instead of vague "engagement" claims
- The AI is a second opinion, not the grader: humans stay in charge

## Roles

| Role | Can |
|---|---|
| Instructor | sign up themselves, create courses and exams, manage members and users, see reports and stats (including who passed, exportable as CSV), reopen or publish |
| TA | add and grade papers in the courses they are a member of, see their own papers and stats, ask to reopen a submitted paper. A TA can't sign up: the instructor creates the account |

Course membership is the only thing that gives a TA access to a course. Access is enforced in the backend.

## Pages

| Route | Who | What it shows |
|---|---|---|
| `/login` | everyone | sign in (demo accounts one click away); instructors can create an account |
| `/courses` | everyone | your courses |
| `/courses/[id]` | both | exams with progress, reopen requests (instructor), people |
| `/courses/[id]/stats` | instructor | trend across exams, TA leaderboard, pass/fail at stake, grade distribution, rubrics to tighten, live activity |
| `/courses/[id]/members` | instructor | add or remove TAs |
| `/courses/[id]/exams/[examId]/setup` | instructor | questions, model answers, rubric; open for grading, publish |
| `/courses/[id]/exams/[examId]/report` | instructor | the flag, gap per question per TA, TAs table, who passed (TA vs AI), largest gaps, CSV exports (all grades, passed only) |
| `/courses/[id]/exams/[examId]/report/[taId]` | instructor | one TA against the AI, the papers behind the flag |
| `/courses/[id]/exams/[examId]/papers` (`/new`) | TA | my papers; add a paper |
| `/courses/[id]/exams/[examId]/stats` | TA | my stats: TA vs AI, leaderboard, papers worth a second look |
| `/papers/[id]` (`/grade`) | both | grade a paper; TA vs AI per question with the AI's reasoning |
| `/users` | instructor | everyone who can sign in |

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS 12 (TypeScript, ESM), on port 3001 |
| Frontend | Next.js 16 (App Router), Tailwind 4, light and dark mode, on port 3000 |
| Database | SQLite through Prisma 7 |
| Auth | Email + password, bcryptjs, JWT |
| AI | Amazon Bedrock (Mistral Large), called only from the backend by a background worker |

## Getting Started

You need Node.js 22+ and AWS credentials with access to Bedrock in `us-east-1` (for AI grading; everything else works without them).

Backend (first terminal):

```bash
cd backend
cp .env.example .env     # fill in AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
npm install
npm run migrate          # creates dev.db
npm run seed             # wipes the database and loads the demo story
npm run start:dev        # http://localhost:3001/health
```

Frontend (second terminal):

```bash
cd frontend
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:3001
npm install
npm run dev                  # http://localhost:3000
```

Demo logins (password `demo1234`): `instructor@demo.com`, and the TAs `maria@`, `nikos@`, `giannis@`, `eleni@`, `katerina@demo.com`. After `npm run seed`, sign in again.

Check that the demo data tells the story: `cd backend && npx tsx scripts/check-demo-numbers.ts` must end with **demo numbers hold**.

Changing `.env` needs a backend restart.

## Demo Script

1. State the problem in one sentence: TAs grade the same answers differently.
2. Sign in as the **instructor**. Open HY335 → **Midterm → Setup**: the questions, model answers and rubric everyone grades against.
3. Sign in as **Nikos** (TA). Midterm → My papers → **csd5150** → grade the three questions → **Submit for AI grading**.
4. A few seconds later the paper shows TA vs AI per question, with the AI's reasoning.
5. Back as the instructor: **Midterm → Report**. Maria is flagged on **Q2** (−1.04 against a threshold of 0.45). Open her page and the papers behind the flag.
6. (Optional) **Course stats**: the gap shrinks exam after exam; Katerina leads the leaderboard.
7. Close with why it matters: fairness, transparency, fewer disputes after grades come out.

Before the pitch: `npm run seed` (csd5150 is a draft again), run the demo once, and keep a screen recording in case the network or Bedrock fails on stage.

## Development

```bash
cd backend && npm test && npm run test:e2e && npx tsc --noEmit
cd frontend && npx tsc --noEmit && npx eslint app components lib
```

## Documents

- `CLAUDE.md`: how the code is organised and the rules for changing it.
- `DOCS/API_SPEC.md`: every endpoint, who can call it, what it takes and returns.
- `DOCS/TASKS.md`: what's done, what's left, who owns it.
