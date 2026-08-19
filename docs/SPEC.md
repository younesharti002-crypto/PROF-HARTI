# PROF HARTI Academy — Product Specification

## 1. Product Vision

Build a bilingual educational platform for **Prof Harti — Ayoub Harti** that helps Moroccan students study Physics and Chemistry through structured lessons, live sessions, replays, exercises, quizzes, exams, results, and progress tracking.

The main student journey is:

`Login → Dashboard → Courses → Lesson → Live → Replay → Exercise/Quiz → Result → Progress`

The main admin journey is:

`Admin Login → Students → Groups → Courses → Lessons → Lives → Quizzes → Results`

## 2. Target Audience

### Students
Primarily BAC students, starting with BAC 2027 cohorts.

### Parents
Parents or guardians who need visibility into student performance and progress.

### Teachers
Prof Harti and future authorized teachers.

### Admin
Users who manage the platform, accounts, groups, and educational content.

## 3. Roles

- `STUDENT`
- `PARENT`
- `TEACHER`
- `ADMIN`

Authorization must be enforced server-side.

## 4. Authentication

Primary V1 login:

- WhatsApp phone number
- Password

Moroccan phone numbers must be normalized internally to E.164 format where possible.

Examples accepted:
- `0612345678`
- `212612345678`
- `+212612345678`

Canonical form:
- `+212612345678`

V1 includes:
- Login
- Logout
- Persistent session
- Password change
- Admin password reset
- Disabled account handling
- Role-based redirect

V1 excludes:
- SMS OTP
- WhatsApp OTP
- Social login

## 5. Languages

Supported:
- Arabic (`ar`)
- French (`fr`)

Arabic uses RTL.
French uses LTR.

UI strings must come from translation files.

## 6. Public Website

Routes:

- `/`
- `/courses`
- `/live`
- `/about`
- `/contact`
- `/login`

Homepage should include:
- PROF HARTI branding
- Physics & Chemistry
- BAC 2027 offer
- Teacher introduction
- Platform benefits
- Instagram `@prof_harti`
- WhatsApp contact CTA
- Login CTA

## 7. Student Area

Base route:

`/student`

Required pages:
- Dashboard
- Courses
- Course details
- Lesson viewer
- Lives
- Replays
- Exercises
- Quizzes
- Exams
- Results
- Progress
- Notifications
- Profile

### Student dashboard

Must show:
- Upcoming live
- Continue learning
- Pending work
- Latest results
- Recent replays
- Overall progress

## 8. Academic Structure

Hierarchy:

`Academic Year → Level → Stream → Subject → Course → Chapter → Lesson`

Initial examples:
- Academic Year: `2026/2027`
- Level: `2BAC`
- Streams: `PC`, `SM`
- Subjects: `Physique`, `Chimie`

## 9. Lessons

Each lesson may contain:
- Title
- Description
- Teacher
- Subject
- Course
- Chapter
- Video
- PDF
- Educational content
- Images
- Examples
- Exercises
- Quiz
- Homework
- Correction
- Position/order
- Publication status

Statuses:
- `DRAFT`
- `PUBLISHED`
- `ARCHIVED`

Students must never see `DRAFT` content.

## 10. Video

V1 must not host large video binaries on the application server.

Store metadata:
- provider
- external URL
- thumbnail
- duration
- title

Initial provider:
- YouTube (unlisted/private strategy handled externally)

## 11. Live Classes

Each Live Session contains:
- title
- description
- teacher
- subject
- level/group target
- start time
- end time
- provider
- join URL
- status
- replay URL

Statuses:
- `SCHEDULED`
- `LIVE`
- `FINISHED`
- `CANCELLED`
- `REPLAY_AVAILABLE`

Initial providers:
- Google Meet
- YouTube Live

## 12. Replays

After a live ends, authorized teachers/admins can attach a replay.

Students only see replays matching their access scope.

## 13. Exercises

Exercise fields:
- title
- statement
- subject
- chapter
- lesson
- difficulty
- content
- image
- PDF
- solution
- correction video
- publication status

Difficulty:
- `EASY`
- `MEDIUM`
- `HARD`

## 14. Quizzes

Supported V1 question types:
- `SINGLE_CHOICE`
- `MULTIPLE_CHOICE`
- `TRUE_FALSE`
- `NUMERIC`

Quiz configuration:
- title
- lesson
- time limit
- max attempts
- passing score
- correction visibility
- publication state

Correct answers must not be sent to student clients before submission.

Quiz scoring must happen server-side.

## 15. Assessments

Types:
- `QUIZ`
- `HOMEWORK`
- `TEST`
- `EXAM`
- `BAC_SIMULATION`

Results include:
- student
- assessment
- score
- maximum
- percentage
- status
- submission date
- correction visibility

## 16. Progress Tracking

Track at least:
- student
- lesson
- started at
- last opened at
- percentage
- completed at

Percentage range:
- `0–100`

Derived subject/course progress should use simple deterministic rules in V1.

## 17. Parent Area

Base route:
`/parent`

Required pages:
- Dashboard
- Student overview
- Results
- Progress

Parent can:
- View linked student(s)
- View progress
- View latest results
- View upcoming assessments
- View upcoming live sessions

Parent cannot:
- Take quizzes
- Modify results
- Edit content
- Access unrelated students

## 18. Admin Area

Base route:
`/admin`

Required pages:
- Dashboard
- Students
- Parents
- Teachers
- Groups
- Levels
- Streams
- Subjects
- Courses
- Chapters
- Lessons
- Lives
- Replays
- Exercises
- Quizzes
- Exams
- Results
- Notifications
- Settings

## 19. Student Management

Admin can:
- Create student
- Edit student
- Activate/deactivate account
- Assign level/stream/group
- Reset password
- View progress
- View results

## 20. Groups

Examples:
- `2BAC PC — Groupe A`
- `2BAC PC — Groupe B`
- `2BAC SM — Groupe A`

V1 uses one primary group per student.
Architecture may support multiple memberships later.

## 21. Content Access

Content can target:
- Everyone
- Level
- Stream
- Group
- Individual student

V1 priority:
- Level
- Group

## 22. Notifications

Internal notifications required.

Types:
- `GENERAL`
- `NEW_LESSON`
- `LIVE_REMINDER`
- `NEW_REPLAY`
- `NEW_EXAM`
- `RESULT_AVAILABLE`

## 23. PWA / Offline

V1 should support:
- Installable web app where feasible
- Basic offline shell
- Cached previously viewed metadata/content
- Pending progress queue
- Sync when connectivity returns

Video Live requires internet.

## 24. Local-first Storage

Web:
- IndexedDB

Future native app:
- SQLite

Use a storage abstraction interface so that a future Realm adapter can be added without rewriting business logic.

## 25. V1 Non-goals

Do not implement unless explicitly requested:
- WhatsApp OTP
- SMS
- Payment gateway
- Paid subscriptions
- AI tutor
- Gamification
- Rankings
- Certificates
- Native iOS/Android apps
- Custom video hosting
- Custom video conferencing
- Student social network
- Chat system
- Advanced analytics

## 26. V1 Definition of Done

V1 is complete when:
- Authentication works
- Role authorization works
- Admin manages students
- Academic structure works
- Courses/chapters/lessons work
- Videos/PDFs work
- Lives/replays work
- Quizzes work
- Server-side scoring works
- Results work
- Progress works
- Parent dashboard works
- Arabic/French work
- Mobile UI works
- Migrations work
- Seed works
- Critical tests pass
- Production build succeeds
- `.env.example` exists
- No secrets are committed
