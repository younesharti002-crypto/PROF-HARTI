# PROF HARTI Academy — Implementation Tasks

Mark tasks: `[ ]` not started · `[-]` in progress · `[x]` complete. Do not mark `[x]` unless validation actually passed.

# PHASE 0 — Bootstrap

- [x] TASK-001 Initialize repository
- [x] TASK-002 Configure TypeScript
- [x] TASK-003 Configure linting/formatting
- [x] TASK-004 Configure Tailwind/UI foundation
- [x] TASK-005 Configure environment handling
- [x] TASK-006 Add PostgreSQL connection placeholder
- [x] TASK-007 Add migration tooling
- [x] TASK-008 Create documentation structure
- [x] TASK-009 Add Arabic/French i18n skeleton
- [x] TASK-010 Create mobile-first landing page
- [x] TASK-011 Run typecheck
- [x] TASK-012 Run lint
- [x] TASK-013 Run production build

PHASE 0 refinement status:
- Real Prof Harti portrait integrated with `next/image`.
- Cairo for Arabic; Poppins for French/Latin.
- Subscriber-only landing-page messaging.
- Public student signup/register CTAs removed.
- Main CTA: `دخول المشتركين / Espace abonnés`.
- Secondary CTA: `اكتشف العرض / Découvrir l’offre`.
- No PHASE 1 backend/authentication implemented during PHASE 0.
- Typecheck, lint and production build passed in GitHub CI.
- Vercel deployment passed after correcting the project Framework Preset to Next.js.

Definition of done: app starts, landing works, AR/FR + RTL/LTR work, no business features, checks pass.

# PHASE 1 — Auth & Users + Subscriber Entitlement

- [x] TASK-101 Create users schema
- [x] TASK-102 Add password hashing
- [x] TASK-103 Add Moroccan phone normalization
- [x] TASK-104 Add login endpoint
- [x] TASK-105 Add session handling
- [x] TASK-106 Add role middleware
- [x] TASK-107 Build login UI
- [x] TASK-108 Add logout
- [ ] TASK-109 Seed admin and Prof Harti teacher
- [ ] TASK-110 Add disabled-account handling
- [ ] TASK-111 Add auth tests
- [ ] TASK-112 Add offers schema/model
- [ ] TASK-113 Add student subscriptions schema/model and statuses
- [ ] TASK-114 Add subscriber entitlement middleware/service
- [ ] TASK-115 Add admin subscription activation/status management
- [ ] TASK-116 Add subscription access tests (ACTIVE vs PENDING/EXPIRED/SUSPENDED)

Gate: no educational modules before critical auth and subscription-entitlement tests pass. No public student self-signup.

# PHASE 2 — Academic Structure

- [ ] TASK-201 AcademicYear model
- [ ] TASK-202 Level model
- [ ] TASK-203 Stream model
- [ ] TASK-204 Group model
- [ ] TASK-205 Subject model
- [ ] TASK-206 Student profile
- [ ] TASK-207 Parent profile
- [ ] TASK-208 Teacher profile
- [ ] TASK-209 Group assignment
- [ ] TASK-210 Admin CRUD UI
- [ ] TASK-211 Seed 2BAC / PC / SM / Physique / Chimie

# PHASE 3 — Courses & Lessons

- [ ] TASK-301 Course model
- [ ] TASK-302 Chapter model
- [ ] TASK-303 Lesson model
- [ ] TASK-304 Lesson resources
- [ ] TASK-305 Admin course CRUD
- [ ] TASK-306 Admin chapter CRUD
- [ ] TASK-307 Lesson editor
- [ ] TASK-308 Draft/publish/archive
- [ ] TASK-309 Student course list
- [ ] TASK-310 Lesson viewer
- [ ] TASK-311 Lesson progress
- [ ] TASK-312 Access control tests

# PHASE 4 — Live & Replays

- [ ] TASK-401 Live schema
- [ ] TASK-402 Admin scheduling UI
- [ ] TASK-403 Student live list
- [ ] TASK-404 Join action
- [ ] TASK-405 Live status handling
- [ ] TASK-406 Attach replay
- [ ] TASK-407 Replay library
- [ ] TASK-408 Group access tests

# PHASE 5 — Exercises & Quizzes

- [ ] TASK-501 Exercise schema
- [ ] TASK-502 Quiz schema
- [ ] TASK-503 Question schema
- [ ] TASK-504 Question options schema
- [ ] TASK-505 Admin quiz builder
- [ ] TASK-506 Student quiz runner
- [ ] TASK-507 Quiz attempts
- [ ] TASK-508 Server-side scoring
- [ ] TASK-509 Results storage
- [ ] TASK-510 Protect correct answers
- [ ] TASK-511 Quiz tests

# PHASE 6 — Parent Dashboard

- [ ] TASK-601 Parent/student linking
- [ ] TASK-602 Parent dashboard
- [ ] TASK-603 Student selector
- [ ] TASK-604 Parent progress view
- [ ] TASK-605 Parent results view
- [ ] TASK-606 Parent authorization tests

# PHASE 7 — Notifications

- [ ] TASK-701 Notification model
- [ ] TASK-702 Targeting
- [ ] TASK-703 Student notifications UI
- [ ] TASK-704 Mark read
- [ ] TASK-705 Live reminders
- [ ] TASK-706 Result available notifications

# PHASE 8 — Local / Offline

- [ ] TASK-801 IndexedDB repository
- [ ] TASK-802 Cache course metadata
- [ ] TASK-803 Cache lesson metadata/content
- [ ] TASK-804 Pending progress queue
- [ ] TASK-805 Connectivity detection
- [ ] TASK-806 Sync engine
- [ ] TASK-807 Conflict rules
- [ ] TASK-808 Offline tests

# PHASE 9 — PWA

- [ ] TASK-901 Web manifest
- [ ] TASK-902 Icons
- [ ] TASK-903 Installability
- [ ] TASK-904 Offline shell
- [ ] TASK-905 Mobile navigation QA

# PHASE 10 — Final QA

Verify ACTIVE vs non-active subscription access; Student Login→Dashboard→Course→Lesson→Live→Replay→Quiz→Result; Admin subscription and content flows; Parent linked-student progress/results; Arabic RTL; French LTR; mobile QA; typecheck; lint; tests; production build; security checklist; README installation.
