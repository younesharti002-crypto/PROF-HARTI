# PROF HARTI Academy — SpecKit

This repository is the implementation specification package for **PROF HARTI Academy**.

## Purpose

The goal is to let any implementation AI (Codex, Claude Code, Gemini, Cursor, etc.) continue the project without depending on previous chat history.

## Read order

1. `docs/SPEC.md`
2. `docs/ARCHITECTURE.md`
3. `docs/DATABASE.md`
4. `docs/API.md`
5. `docs/SECURITY.md`
6. `docs/TASKS.md`
7. `docs/CHANGELOG.md`
8. `docs/MASTER-PROMPT.md`

## Product

Educational platform for **Prof Harti / Ayoub Harti** focused on Physics, Chemistry, BAC 2027, lessons, lives, replays, exercises, quizzes, exams, results, student progress, and parent monitoring.

## Users

- STUDENT
- PARENT
- TEACHER
- ADMIN

## Primary login

WhatsApp phone number + password.

## V1 constraints

- Mobile-first
- Arabic + French
- Low-cost / free-first
- PWA first
- PostgreSQL central database
- Local-first persistence using IndexedDB on web
- Local storage abstraction so SQLite/Realm adapters can be added later
- External video/live providers in V1
- No paid OTP requirement in V1

## First implementation command

Read `docs/MASTER-PROMPT.md`, inspect the repository, then implement the first incomplete task from `docs/TASKS.md`.
