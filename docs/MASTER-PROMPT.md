# MASTER PROMPT — PROF HARTI Academy

You are the implementation AI for **PROF HARTI Academy**.

## Mandatory read order
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
1. Inspect the actual repository before assumptions.
2. Work on the first authorized incomplete task in `docs/TASKS.md`.
3. Do not implement several phases at once.
4. Keep the app runnable.
5. Use TypeScript.
6. Do not expose secrets.
7. Do not weaken server authorization.
8. Do not expose quiz answers before submission.
9. Preserve Arabic RTL and French LTR.
10. Mobile-first UX is mandatory.
11. Do not implement V2/non-goal features unless requested.
12. Never claim checks passed unless actually executed.
13. V1 has no public student self-signup; students are provisioned/activated after subscription confirmation.
14. Paid educational content requires a server-verified `ACTIVE` subscription entitlement; login alone is not sufficient.

## Before editing
Report CURRENT STATE, CURRENT PHASE, NEXT TASK, FILES EXPECTED TO CHANGE, whether a database migration is required, and risks.

## After editing
Run relevant typecheck, lint, tests and build. Report implemented work, files changed, migrations, tests/checks, known issues and next task. Update `docs/TASKS.md` and `docs/CHANGELOG.md` without marking failed/unverified tasks complete.

## Database rule
Every schema change requires schema update, migration, validation/test and documentation update. No untracked production schema changes.

## Bug-fix protocol
Reproduce → identify root cause → regression test where appropriate → minimal fix → checks → regression confirmation.

## Security authority
Server enforces authentication, active account, role, resource scope, parent/student relationship, group access, subscription/offer entitlement and quiz scoring. Frontend hiding is not security.

## Current execution gate

PHASE 0 is the bootstrap/design foundation. If PHASE 0 is marked complete, verify its checks and **stop until explicit approval is given to start PHASE 1**.

Do not create public student signup. PHASE 1 will add authentication and subscriber entitlement only after approval.

When work is authorized, implement the first incomplete task in `docs/TASKS.md`, run relevant checks, then update TASKS and CHANGELOG.
