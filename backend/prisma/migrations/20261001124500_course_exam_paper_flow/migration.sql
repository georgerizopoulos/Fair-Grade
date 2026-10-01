-- CreateTable
CREATE TABLE "course_members" (
    "course_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "added_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("course_id", "user_id"),
    CONSTRAINT "course_members_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "course_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "exams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "course_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "held_at" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "pass_mark" REAL NOT NULL DEFAULT 5,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "exams_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exam_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "max_points" REAL NOT NULL,
    "model_answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "questions_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rubric_points" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "points" REAL NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "rubric_points_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "papers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exam_id" TEXT NOT NULL,
    "ta_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "pdf_path" TEXT,
    "page_count" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'TRANSCRIBING',
    "reopen_requested" BOOLEAN NOT NULL DEFAULT false,
    "ai_attempts" INTEGER NOT NULL DEFAULT 0,
    "ai_next_attempt_at" DATETIME,
    "ai_error" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_at" DATETIME,
    "ai_graded_at" DATETIME,
    CONSTRAINT "papers_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exams" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "papers_ta_id_fkey" FOREIGN KEY ("ta_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "paper_pages" (
    "paper_id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'WAITING',

    PRIMARY KEY ("paper_id", "index"),
    CONSTRAINT "paper_pages_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "papers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "paper_answers" (
    "paper_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "transcription" TEXT NOT NULL DEFAULT '',
    "uncertain_words" JSONB NOT NULL,
    "pages" JSONB NOT NULL,
    "ta_points" REAL,
    "ai_points" REAL,
    "ai_reasoning" TEXT,

    PRIMARY KEY ("paper_id", "question_id"),
    CONSTRAINT "paper_answers_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "papers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "paper_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "paper_revisions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paper_id" TEXT NOT NULL,
    "ta_points_snapshot" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    CONSTRAINT "paper_revisions_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "papers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "paper_revisions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "activity_log" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "course_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "actor_id" TEXT,
    "paper_id" TEXT,
    "payload" JSONB NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activity_log_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "activity_log_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "activity_log_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "papers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_courses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "semester" TEXT,
    "owner_id" TEXT,
    "leaderboard_visibility" TEXT NOT NULL DEFAULT 'ANONYMOUS',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "courses_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_courses" ("created_at", "id", "name") SELECT "created_at", "id", "name" FROM "courses";
DROP TABLE "courses";
ALTER TABLE "new_courses" RENAME TO "courses";
CREATE UNIQUE INDEX "courses_code_key" ON "courses"("code");
CREATE UNIQUE INDEX "courses_name_key" ON "courses"("name");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "last_sign_in_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_users" ("created_at", "email", "id", "name", "password_hash", "role") SELECT "created_at", "email", "id", "name", "password_hash", "role" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "questions_exam_id_code_key" ON "questions"("exam_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "papers_exam_id_student_id_key" ON "papers"("exam_id", "student_id");

-- CreateIndex
CREATE INDEX "activity_log_course_id_created_at_idx" ON "activity_log"("course_id", "created_at");
