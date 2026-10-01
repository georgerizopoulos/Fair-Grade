-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "rubrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "course_id" TEXT NOT NULL,
    "question_text" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rubrics_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "criteria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rubric_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "max_points" REAL NOT NULL,
    CONSTRAINT "criteria_rubric_id_fkey" FOREIGN KEY ("rubric_id") REFERENCES "rubrics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "student_answers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rubric_id" TEXT NOT NULL,
    "student_id_anon" TEXT NOT NULL,
    "answer_text" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "student_answers_rubric_id_fkey" FOREIGN KEY ("rubric_id") REFERENCES "rubrics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ta_grades" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "answer_id" TEXT NOT NULL,
    "criterion_id" TEXT NOT NULL,
    "ta_id" TEXT NOT NULL,
    "points_given" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ta_grades_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "student_answers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ta_grades_criterion_id_fkey" FOREIGN KEY ("criterion_id") REFERENCES "criteria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ta_grades_ta_id_fkey" FOREIGN KEY ("ta_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_grades" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "answer_id" TEXT NOT NULL,
    "criterion_id" TEXT NOT NULL,
    "points" REAL NOT NULL,
    "reasoning" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ai_grades_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "student_answers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ai_grades_criterion_id_fkey" FOREIGN KEY ("criterion_id") REFERENCES "criteria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "courses_name_key" ON "courses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "criteria_rubric_id_position_key" ON "criteria"("rubric_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "student_answers_rubric_id_student_id_anon_key" ON "student_answers"("rubric_id", "student_id_anon");

-- CreateIndex
CREATE UNIQUE INDEX "ta_grades_answer_id_criterion_id_ta_id_key" ON "ta_grades"("answer_id", "criterion_id", "ta_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_grades_answer_id_criterion_id_key" ON "ai_grades"("answer_id", "criterion_id");
