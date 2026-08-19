# PROF HARTI Academy — Implementation Tasks

This file defines implementation order.

Mark tasks:
- `[ ]` not started
- `[-]` in progress
- `[x]` complete

Do not mark `[x]` unless validation actually passed.

---

# PHASE 0 — Bootstrap

- [ ] TASK-001 Initialize repository
- [ ] TASK-002 Configure TypeScript
- [ ] TASK-003 Configure linting/formatting
- [ ] TASK-004 Configure Tailwind/UI foundation
- [ ] TASK-005 Configure environment handling
- [ ] TASK-006 Add PostgreSQL connection placeholder
- [ ] TASK-007 Add migration tooling
- [ ] TASK-008 Create documentation structure
- [ ] TASK-009 Add Arabic/French i18n skeleton
- [ ] TASK-010 Create mobile-first landing page
- [ ] TASK-011 Run typecheck
- [ ] TASK-012 Run lint
- [ ] TASK-013 Run production build

Definition of done:
- app starts
- landing page works
- Arabic/French skeleton exists
- no business features yet
- checks pass

---

# PHASE 1 — Auth & Users

- [ ] TASK-101 Create users schema
- [ ] TASK-102 Add password hashing
- [ ] TASK-103 Add Moroccan phone normalization
- [ ] TASK-104 Add login endpoint
- [ ] TASK-105 Add session handling
- [ ] TASK-106 Add role middleware
- [ ] TASK-107 Build login UI
- [ ] TASK-108 Add logout
- [ ] TASK-109 Seed admin and Prof Harti teacher
- [ ] TASK-110 Add disabled-account handling
- [ ] TASK-111 Add auth tests

Gate:
Do not proceed to educational modules until critical auth tests pass.

---

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

---

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

---

# PHASE 4 — Live & Replays

- [ ] TASK-401 Live schema
- [ ] TASK-402 Admin scheduling UI
- [ ] TASK-403 Student live list
- [ ] TASK-404 Join action
- [ ] TASK-405 Live status handling
- [ ] TASK-406 Attach replay
- [ ] TASK-407 Replay library
- [ ] TASK-408 Group access tests

---

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

---

# PHASE 6 — Parent Dashboard

- [ ] TASK-601 Parent/student linking
- [ ] TASK-602 Parent dashboard
- [ ] TASK-603 Student selector
- [ ] TASK-604 Parent progress view
- [ ] TASK-605 Parent results view
- [ ] TASK-606 Parent authorization tests

---

# PHASE 7 — Notifications

- [ ] TASK-701 Notification model
- [ ] TASK-702 Targeting
- [ ] TASK-703 Student notifications UI
- [ ] TASK-704 Mark read
- [ ] TASK-705 Live reminders
- [ ] TASK-706 Result available notifications

---

# PHASE 8 — Local / Offline

- [ ] TASK-801 IndexedDB repository
- [ ] TASK-802 Cache course metadata
- [ ] TASK-803 Cache lesson metadata/content
- [ ] TASK-804 Pending progress queue
- [ ] TASK-805 Connectivity detection
- [ ] TASK-806 Sync engine
- [ ] TASK-807 Conflict rules
- [ ] TASK-808 Offline tests

---

# PHASE 9 — PWA

- [ ] TASK-901 Web manifest
- [ ] TASK-902 Icons
- [ ] TASK-903 Installability
- [ ] TASK-904 Offline shell
- [ ] TASK-905 Mobile navigation QA

---

# PHASE 10 — Final QA

Student flow:
- [ ] Login
- [ ] Dashboard
- [ ] Course
- [ ] Lesson
- [ ] Progress
- [ ] Live
- [ ] Replay
- [ ] Quiz
- [ ] Result

Admin flow:
- [ ] Login
- [ ] Create student
- [ ] Create group
- [ ] Create course
- [ ] Publish lesson
- [ ] Schedule live
- [ ] Create quiz
- [ ] Inspect result

Parent flow:
- [ ] Login
- [ ] Select linked student
- [ ] Progress
- [ ] Results

Global:
- [ ] Arabic RTL QA
- [ ] French LTR QA
- [ ] Mobile QA
- [ ] Typecheck
- [ ] Lint
- [ ] Tests
- [ ] Production build
- [ ] Security checklist
- [ ] README installation verified
