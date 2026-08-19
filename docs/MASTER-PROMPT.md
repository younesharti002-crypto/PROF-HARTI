# MASTER PROMPT — PROF HARTI Academy

You are the implementation AI for **PROF HARTI Academy**.

## Mandatory read order

Read:

1. `README.md`
2. `docs/SPEC.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DATABASE.md`
5. `docs/API.md`
6. `docs/SECURITY.md`
7. `docs/TASKS.md`
8. `docs/CHANGELOG.md`

Treat `docs/SPEC.md` as the product source of truth.

## Core rules

1. Inspect the actual repository before making assumptions.
2. Work on the first incomplete task in `docs/TASKS.md`.
3. Do not implement several phases at once.
4. Keep the app runnable after each task/milestone.
5. Use TypeScript.
6. Do not expose secrets.
7. Do not weaken backend authorization.
8. Do not expose quiz answers before submission.
9. Preserve Arabic RTL and French LTR.
10. Mobile-first UX is mandatory.
11. Do not implement V2/non-goal features unless explicitly requested.
12. Never claim checks passed unless actually executed.

## Before editing

Report:

```text
CURRENT STATE:
CURRENT PHASE:
NEXT TASK:
FILES EXPECTED TO CHANGE:
DATABASE MIGRATION REQUIRED: YES/NO
RISKS:
```

## After editing

Run available validation:

```text
typecheck
lint
tests
build
```

Then report:

```text
IMPLEMENTED:
FILES CHANGED:
MIGRATIONS:
TESTS RUN:
TYPECHECK:
LINT:
BUILD:
KNOWN ISSUES:
NEXT TASK:
```

Update:
- `docs/TASKS.md`
- `docs/CHANGELOG.md`

Do not mark a task complete if validation failed.

## Database rules

Every schema change requires:
1. schema update
2. migration
3. validation/test
4. documentation update

Do not make untracked manual production schema changes.

## Bug-fix protocol

1. Reproduce
2. Identify root cause
3. Add regression test when appropriate
4. Apply minimal fix
5. Run relevant checks
6. Confirm no regression

Do not rewrite unrelated code.

## Security rules

Server must enforce:
- authentication
- active account
- role
- resource scope
- parent/student relationship
- group access
- quiz scoring

Frontend hiding is not security.

## First command

Implement **PHASE 0 only**.

Initialize the PROF HARTI Academy project according to the specification.

Do not implement authentication or business features yet.

Create:
- Next.js + TypeScript base
- Tailwind/UI foundation
- environment template
- PostgreSQL configuration placeholder
- migration tooling
- docs structure
- Arabic/French internationalization skeleton
- working mobile-first landing page

Run:
- typecheck
- lint
- production build

Update TASKS and CHANGELOG after successful validation.
