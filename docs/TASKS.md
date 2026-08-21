# PROF HARTI Academy — Implementation Tasks

Mark tasks: `[ ]` not started · `[-]` in progress · `[x]` complete · `[D]` deferred from the current MVP.

# PHASE 0 — Bootstrap

- [x] TASK-001 Initialize repository
- [x] TASK-002 Configure TypeScript
- [x] TASK-003 Configure linting/formatting
- [x] TASK-004 Configure Tailwind/UI foundation
- [x] TASK-005 Configure environment handling
- [x] TASK-006 Configure PostgreSQL connection
- [x] TASK-007 Add migration tooling
- [x] TASK-008 Create documentation structure
- [x] TASK-009 Add Arabic/French i18n
- [x] TASK-010 Create mobile-first landing page
- [x] TASK-011 Run typecheck
- [x] TASK-012 Run lint
- [x] TASK-013 Run production build

# PHASE 1 — Auth & Users + Subscriber Entitlement

- [x] TASK-101 Create users schema
- [x] TASK-102 Add password hashing
- [x] TASK-103 Add Moroccan phone normalization
- [x] TASK-104 Add login endpoint
- [x] TASK-105 Add session handling
- [x] TASK-106 Add role authorization
- [x] TASK-107 Build login UI
- [x] TASK-108 Add logout
- [x] TASK-109 Seed admin and teacher through environment variables
- [x] TASK-110 Add disabled-account handling
- [x] TASK-111 Add auth tests
- [x] TASK-112 Add offers schema/model
- [x] TASK-113 Add student subscriptions and statuses
- [x] TASK-114 Add subscriber entitlement service
- [x] TASK-115 Add admin subscription activation/status management
- [x] TASK-116 Add subscription access tests

# PHASE 2 — Academic Structure

- [x] TASK-201 AcademicYear model
- [x] TASK-202 Level model
- [x] TASK-203 Stream model
- [x] TASK-204 Group model
- [x] TASK-205 Subject model
- [x] TASK-206 Student profile
- [x] TASK-207 Parent profile schema foundation
- [x] TASK-208 Teacher profile
- [x] TASK-209 Group assignment
- [x] TASK-210 Admin CRUD UI
- [x] TASK-211 Seed academic core

# PHASE 3 — Courses & Lessons

- [x] TASK-301 Course model
- [x] TASK-302 Chapter model
- [x] TASK-303 Lesson model
- [x] TASK-304 Lesson resources
- [x] TASK-305 Teacher/Admin course CRUD
- [x] TASK-306 Chapter CRUD
- [x] TASK-307 Lesson editor
- [x] TASK-308 Draft/publish/archive
- [x] TASK-309 Student course list
- [x] TASK-310 Lesson viewer
- [x] TASK-311 Lesson progress
- [x] TASK-312 Access-control QA

# PHASE 4 — Live & Replays

- [x] TASK-401 Live schema
- [x] TASK-402 Teacher/Admin scheduling UI
- [x] TASK-403 Student live list
- [x] TASK-404 Join action
- [x] TASK-405 Live status handling
- [x] TASK-406 Attach replay
- [x] TASK-407 Replay library
- [x] TASK-408 Access-control regression coverage

# PHASE 5 — Exercises & Quizzes

- [x] TASK-501 Exercise/assessment schema
- [x] TASK-502 Quiz schema
- [x] TASK-503 Question schema
- [x] TASK-504 Question options schema
- [x] TASK-505 Teacher/Admin quiz builder
- [x] TASK-506 Student quiz runner
- [x] TASK-507 Quiz attempts
- [x] TASK-508 Server-side scoring
- [x] TASK-509 Results storage
- [x] TASK-510 Protect correct answers before submission
- [x] TASK-511 Quiz publish/access regression tests

# PHASE 6 — Parent Experience

- [D] TASK-601 Parent/student linking experience
- [D] TASK-602 Parent dashboard
- [D] TASK-603 Student selector
- [D] TASK-604 Parent progress view
- [D] TASK-605 Parent results view
- [D] TASK-606 Parent authorization tests

Parent-facing functionality is intentionally deferred to the final extended version and is not a blocker for the current MVP release.

# PHASE 7 — Notifications

- [D] TASK-701 Notification model
- [D] TASK-702 Targeting
- [D] TASK-703 Student notifications UI
- [D] TASK-704 Mark read
- [D] TASK-705 Live reminders
- [D] TASK-706 Result available notifications

# PHASE 8 — Local / Offline

- [D] TASK-801 IndexedDB repository
- [D] TASK-802 Cache course metadata
- [D] TASK-803 Cache lesson metadata/content
- [D] TASK-804 Pending progress queue
- [D] TASK-805 Connectivity detection
- [D] TASK-806 Sync engine
- [D] TASK-807 Conflict rules
- [D] TASK-808 Offline tests

# PHASE 9 — PWA

- [D] TASK-901 Web manifest
- [D] TASK-902 Icons
- [D] TASK-903 Installability
- [D] TASK-904 Offline shell
- [D] TASK-905 PWA-specific mobile QA

# PHASE 10 — MVP Finalization

- [x] Subscription entitlement QA
- [x] Protected lesson access QA
- [x] Lesson progress QA
- [x] Live resource visibility QA
- [x] Replay lifecycle QA
- [x] Quiz grading/storage QA
- [x] Teacher ownership checks
- [x] Access regression tests before builds
- [x] TypeScript production build
- [x] Production database demo/test cleanup
- [x] Production database backup branch before cleanup
- [x] Remove public demo route / unused demo dashboard
- [x] Release README and handoff documentation
- [ ] Final visual/mobile review on target devices
- [ ] Promote validated release branch to `main`
- [ ] Attach final custom domain / production URL if required

Current MVP scope: Student + Teacher/Admin. Parents remain deferred.
