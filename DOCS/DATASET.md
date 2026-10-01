# Dataset Format

How the demo data is written: the logins, the rubric, the student answers, and the TA grades. Σταύρος writes these files (Track 4, step 1) and the seed script loads them. Anyone writing or checking the data should only need this file.

---

## The four files

All in `dataset/` at the repo root:

| File | What it holds |
|---|---|
| `users.json` | the instructor and TA logins |
| `rubric.json` | the question and its criteria |
| `answers.json` | 15-20 student answers |
| `ta-grades.json` | each TA's scores for the answers they graded |

`npm run seed` (in `backend/`) wipes the database and loads all four. It's safe to run as many times as needed.

**Why these files don't contain IDs:** the IDs (UUIDs) are created by the database when the data is inserted, so nobody can know them while writing the files. Instead, files point at each other with things you *can* write by hand: a TA's **email**, a student's **`studentIdAnon`**, and a criterion's **position** (1st, 2nd, 3rd...). The seed script turns those into real IDs.

---

## users.json

Each entry has the same fields as the `POST /auth/register` body (`API_SPEC.md` #2).

```json
{
  "users": [
    { "name": "Instructor Demo", "email": "instructor@demo.com", "password": "demo1234", "role": "instructor" },
    { "name": "Maria Papadaki",  "email": "maria@demo.com",      "password": "demo1234", "role": "ta" },
    { "name": "Nikos Georgiou",  "email": "nikos@demo.com",      "password": "demo1234", "role": "ta" },
    { "name": "Eleni Markou",    "email": "eleni@demo.com",      "password": "demo1234", "role": "ta" }
  ]
}
```

- Exactly one instructor, 2-3 TAs.
- Demo passwords only — never a real password anyone uses elsewhere.
- They're written in plain text here only so the team knows the logins. The seed script hashes each one with bcrypt before saving it; the database never holds a plain-text password.
- TA names are made up and deliberately not team members' names, so nobody on stage gets confused about who "Nikos" is.

## rubric.json

Exactly the `POST /rubrics` body (`API_SPEC.md` #6). The order of `criteria` **is** their position: the first entry is criterion 1, and so on.

```json
{
  "courseName": "HY335 - Computer Networks",
  "questionText": "Explain how the TCP three-way handshake works.",
  "criteria": [
    { "description": "Correctly names all 3 steps in order (SYN, SYN-ACK, ACK)", "maxPoints": 3 },
    { "description": "Explains what sequence numbers are used for in the handshake", "maxPoints": 3 },
    { "description": "States why a handshake is needed before data transfer (reliability/sync)", "maxPoints": 2 },
    { "description": "Answer is clearly organized and easy to follow", "maxPoints": 2 }
  ]
}
```

One rubric only for the MVP.

## answers.json

The `POST /answers/bulk` body without `rubricId` (the seed script adds it).

```json
{
  "answers": [
    {
      "studentIdAnon": "student_001",
      "answerText": "The client sends a SYN with its initial sequence number. The server replies with SYN-ACK, acknowledging the client's number and sending its own. The client sends ACK. Now both sides know each other's starting sequence numbers, so they can detect lost or reordered data, and the connection is established."
    },
    {
      "studentIdAnon": "student_002",
      "answerText": "TCP handshake is when two computers agree to talk. One says hello and the other says hello back and then they send data."
    }
  ]
}
```

- `studentIdAnon`: `student_001`, `student_002`, ... — unique, zero-padded so they sort correctly.
- 15-20 answers in total.

## ta-grades.json

One entry per TA per answer they graded. `scores` lists the points for each criterion **in position order**: first number = criterion 1, second = criterion 2, etc.

```json
{
  "grades": [
    { "taEmail": "maria@demo.com", "studentIdAnon": "student_001", "scores": [3, 3, 2, 1] },
    { "taEmail": "maria@demo.com", "studentIdAnon": "student_004", "scores": [3, 2.5, 2, 0] },
    { "taEmail": "nikos@demo.com", "studentIdAnon": "student_002", "scores": [1, 0, 0.5, 1] }
  ]
}
```

- `taEmail` must match a TA in `users.json`.
- `studentIdAnon` must match an answer in `answers.json`.
- `scores` must have exactly one number per criterion, each between 0 and that criterion's `maxPoints`, half points allowed.
- The seed script checks all of this before inserting anything and prints exactly which line is wrong.

---

## How to write good criteria

The whole demo depends on this, because the AI and the TAs are all graded against the same wording.

1. **3 to 5 criteria.** Fewer makes the report look thin; more is tedious to grade and to show.
2. **Points add up to 10.** Easiest to explain on stage ("off by 2 out of 10").
3. **Each criterion is a specific, checkable claim** — something a grader can point at a sentence and say yes / no / partly.
   - Good: "Correctly names all 3 steps in order (SYN, SYN-ACK, ACK)"
   - Bad: "Understands the TCP handshake" — everyone, including the AI, reads that differently
4. **No overlap.** If two criteria would always be met or missed together, merge them.
5. **At least one interpretive criterion** — e.g. "clearly organized," "explains *why*, not just *what*." Pure fact-recall criteria rarely produce disagreement, and disagreement is what the demo needs to show. The interpretive one is where the planted bias goes (see below).
6. **One language per rubric.** Greek or English, whichever you'll narrate in. The AI handles both.

## How to write the answers

- 15-20 answers covering the full range: a few clearly excellent, a few clearly weak, and **5-6 deliberately half-right or ambiguous** — those produce the interesting cases.
- A few sentences to one paragraph each. Long essays slow down grading and nobody reads them on stage.
- Write them as real students would: some disorganized, some with the right idea in the wrong terms, some confidently wrong.
- Using AI to draft the answers is fine — but whoever writes them decides the **intended score** for each one per criterion and writes that down. Those intended scores are what the fair TAs' grades are based on, and they're how you check the AI later.

## How to write the TA grades (the planted pattern)

This is what makes the dashboard have something to show.

- **Split the answers between the TAs**, as happens in a real course: with 18 answers and 3 TAs, each grades 6. Every TA then has at least 3 answers per criterion, which is the minimum for a flag (`API_SPEC.md`, Deviation Rules).
- **Make exactly one TA systematically biased on one criterion.** For example, Maria is 1-2 points stricter on "Answer is clearly organized" on almost every answer she grades. The gap has to be real and consistent:
  - A flag needs an average gap above **15% of that criterion's `maxPoints`** — above 0.3 on a 2-point criterion, above 0.45 on a 3-point one.
  - Aim well above the line (an average gap of 1-1.5 points on a 2-point criterion) so the flag is obvious and doesn't flicker when the AI's scores shift slightly.
- **The other TAs grade close to the intended scores** — exactly, or off by 0.5 on an occasional answer. Random noise on every answer can accidentally cross the threshold and produce a second, unplanned flag.
- **Remember what the flags actually compare against: the AI's scores, not your intended scores.** If the AI grades a criterion differently than you intended, a fair TA can end up flagged. After the first grading run, compare the AI's scores with your intended ones (Κώστας, Track 2 step 10) and fix the prompt or the criterion wording if they don't match.

---

## CSV format for the upload page

The upload page (`/upload`) also accepts pasted CSV, so data can be added through the UI without the seed script. Two formats:

**Answers** — header row required:

```
studentIdAnon,answerText
student_019,"The client sends SYN, the server replies SYN-ACK, the client sends ACK."
student_020,"It is a way for two hosts to agree on sequence numbers before sending data."
```

Put `answerText` in double quotes whenever it contains a comma or a line break.

**TA grades** — one TA at a time (the TA is picked from a dropdown above the text box). Columns `c1`, `c2`, ... are criteria in position order:

```
studentIdAnon,c1,c2,c3,c4
student_001,3,3,2,1
student_004,3,2.5,2,0
```

The page matches `studentIdAnon` to answer IDs (via `GET /answers`) and columns to criterion IDs (via `GET /rubrics/:id`), and shows any unknown student or out-of-range score **before** sending anything. Parse with the `papaparse` library — don't hand-write a CSV parser.

---

## Alternative rubrics

Use the TCP rubric above unless the team can write more convincing answers for a different topic.

**Databases:**

```json
{
  "courseName": "HY360 - Database Systems",
  "questionText": "Explain what database normalization is and why the third normal form (3NF) matters.",
  "criteria": [
    { "description": "Correctly defines normalization as reducing redundancy and update problems", "maxPoints": 3 },
    { "description": "Correctly states what 3NF requires (no transitive dependencies on the key)", "maxPoints": 3 },
    { "description": "Gives a concrete example table or scenario, not just a definition", "maxPoints": 2 },
    { "description": "Explains a real consequence of not normalizing (e.g. update anomalies)", "maxPoints": 2 }
  ]
}
```

**Math (limits):**

```json
{
  "courseName": "HY215 - Signals and Systems",
  "questionText": "Compute the limit of sin(3x)/x as x approaches 0. Show your work.",
  "criteria": [
    { "description": "Recognizes the standard limit sin(u)/u -> 1 as u -> 0", "maxPoints": 3 },
    { "description": "Rewrites the expression as 3 * sin(3x)/(3x) (or an equivalent correct manipulation)", "maxPoints": 3 },
    { "description": "Arrives at the correct final answer, 3", "maxPoints": 2 },
    { "description": "Shows clear, logically ordered steps rather than jumping to the answer", "maxPoints": 2 }
  ]
}
```

---

## Math answers

Typed math works with no changes to the system — `answerText` is plain text and the AI reads math notation fine.

- **Write math in LaTeX**, e.g. `\lim_{x \to 0} \frac{\sin(3x)}{x} = 3`. It's less ambiguous for the AI than `lim(x->0) sin(3x)/x`.
- **The AI can get the math itself wrong**, not just misjudge the explanation. Κώστας checks the AI against answers with a known correct result before trusting any flags (`TASKS.md`, Track 2 step 7).

## Out of scope

Answers that are **diagrams, drawings, or photos of handwriting** (including handwritten math) are not supported this weekend. They'd need a vision-capable model and file upload. If asked, say it's the natural next step, not something that was missed.

---

## Can this be written before the event?

The FAQ says code must be written during the event — no pre-existing projects. It doesn't say whether sample data counts. Γιώργος asks the organizers before 1 October (see `TASKS.md`, Before the Event). If the answer is unclear, Σταύρος writes the dataset at the start of the event (Track 4, step 1) — with AI help it's well under an hour.
