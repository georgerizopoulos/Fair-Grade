# TA, instructor, AI grader and page review

Reviewed 2 October 2026. This is a code review and automated-test validation; it does not certify every browser interaction or live Bedrock invocation.

## Relationships that are enforced

- A course has one instructor owner (`Course.ownerId`). A TA belongs to courses through `CourseMember`, and can work in multiple instructors' courses. There is no direct TA-to-instructor assignment.
- Each paper belongs to one exam and one TA. `AccessService.paper` requires course access and rejects a TA opening another TA's paper.
- Only the paper's TA can save grades and submit. Submission locks editing until the course instructor reopens it.
- AI grading consumes the exam question, maximum points, model answer, rubric and transcription. The constructed model input excludes student identity and TA points.
- TAs cannot read AI scores before submission, including after an instructor reopens a paper. Reports and comparison statistics use `AI_GRADED` papers.
- Instructor reports use course ownership checks. TA statistics and paper lists filter by the authenticated TA.
- Users API routes require the instructor role. TAs cannot deactivate another user or remove course members. There is no user-account DELETE route. Account status controls have been removed from the Users table; the instructor-only PATCH endpoint remains.
- The live paper pages use database paper IDs and API data. Hardcoded sample links still exist in retained static reference components, which are not rendered by those routes.

## Remaining findings

1. **High: legacy APIs bypass course boundaries.** `src/rubrics`, `src/answers`, `src/ta-grades`, `src/results`, `src/deviation`, and legacy `src/grading` use role checks without the central course-access checks. For example, a signed-in TA can list legacy answers by rubric ID without membership. These modules remain registered in the app. Disable the legacy routes or bring their authorization into line before relying on tenant isolation. Repository instructions freeze these modules, so this review records the issue without extending them.
2. **High: user management is global across TAs.** `UsersService.list` exposes the shared TA pool, including course memberships outside the viewer's courses. `UsersService.update` permits any instructor to edit/deactivate any TA. Removing the UI controls does not remove this API capability. Decide whether shared accounts are intentional or management must be scoped to the instructor's courses.
3. **Medium: ownerless courses bypass instructor ownership.** `AccessService` allows every instructor to access legacy courses with `ownerId: null`. Assign owners and remove the exception if strict ownership is required.
4. **Medium: nested page URLs can show inconsistent course context.** Report, TA-detail, and TA-stat pages fetch by `examId` but build links using `courseId` from the URL without checking that it matches the returned course. Setup also loads course and exam independently. Backend access still applies, but a mismatched URL can produce incorrect breadcrumbs/sidebar links. The live paper-list/upload context loader already checks the relationship.
5. **Medium: worker leasing is not exclusive across worker instances.** The AI worker selects due papers, then leases with a write conditioned only on ID and `AI_GRADING`. Two workers can both lease a paper selected before either write. Use a due-time/lease condition in the atomic write before running multiple worker instances. Existing tests exercise one worker.
6. **Low: TA detail lookup accepts an unrelated TA.** The report checks instructor access to the exam, then looks up any TA account by ID. It can return that TA's name/email and an empty report even without membership or historical papers in this course. Restrict the lookup to membership or historical exam papers.

## Validation

- Backend unit tests: 46 passed.
- Backend end-to-end tests: 102 passed, including role denials, membership, paper ownership, draft AI-score hiding, submission locking and AI input privacy. Tests use a separate `test.db` and a fake AI grader, not Bedrock.
- Backend and frontend TypeScript checks passed.
- Frontend lint across `app`, `components` and `lib` passed.
- Fixed test setup to create the empty SQLite test file before Prisma migration deployment.
- Tablet reflow changes were measured in isolated headless Chrome using public synthetic content with repository CSS at widths 768, 820, 1024, 1180 and 1440, with 200% size, bold and extra spacing enabled. The tested rows had no overlap or document horizontal overflow. Authenticated page browser validation was not performed: automatic approval review rejected credential-based access.

The passing suite validates its existing cases; the findings above are not fully covered by that suite.
