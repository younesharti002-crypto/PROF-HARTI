# PROF HARTI Academy — Product Specification

## 1. Product Vision

Build a bilingual **subscriber-only** educational platform for **Prof Harti — Ayoub Harti**. It is dedicated to students subscribed to an official Prof Harti offer and gives structured access to Physics and Chemistry lessons, lives, replays, exercises, quizzes, exams, results and progress tracking.

Student journey:

`Subscribe to offer → Admin confirms subscription → Account/access activated → Login → Dashboard → Courses → Lesson → Live → Replay → Exercise/Quiz → Result → Progress`

Admin journey:

`Admin Login → Students → Subscriptions → Groups → Courses → Lessons → Lives → Quizzes → Results`

## 2. Target Audience & Roles

Roles:
- `STUDENT`
- `PARENT`
- `TEACHER`
- `ADMIN`

Primary launch audience: BAC students, starting with BAC 2027 cohorts, whose subscription to a Prof Harti offer has been confirmed.

Authorization must be enforced server-side.

## 3. Authentication

Primary V1 login:
- WhatsApp phone number
- Password

Moroccan phone numbers should be normalized to E.164 where possible, for example `0612345678` → `+212612345678`.

V1 includes login, logout, persistent session, password change, admin password reset, disabled-account handling and role-based redirect.

V1 excludes SMS OTP, WhatsApp OTP, social login and **public student self-signup**.

## 4. Subscription & Access Model

V1 is a **closed subscriber platform**. There is no public student self-registration.

Required onboarding:
1. Student subscribes to a Prof Harti offer.
2. Administration verifies the subscription.
3. Admin creates or links the student account.
4. A subscription record is activated.
5. Student receives credentials and logs in.
6. Subscriber educational content is available only while the matching subscription is `ACTIVE`.

Subscription statuses:
- `PENDING`
- `ACTIVE`
- `EXPIRED`
- `SUSPENDED`

Account status and subscription status are separate. An account can stay active while the subscription is expired, but paid educational content remains locked until renewal.

Initial V1 offer:
- `عرض التفوق BAC 2027 / Offre Excellence BAC 2027`

Architecture must allow multiple offers later.

## 5. Languages

Supported:
- Arabic (`ar`) — RTL
- French (`fr`) — LTR

UI strings must come from translation files.

## 6. Public Website

The public site may include:
- PROF HARTI branding
- Physics & Chemistry positioning
- BAC 2027 offer presentation
- Teacher introduction
- Platform benefits
- Instagram `@prof_harti`
- Contact/offer CTA
- `Espace abonnés / دخول المشتركين` CTA

Public pages may market the offer but must never expose private lesson content. A contact/offer request does not automatically create a platform account.

## 7. Student Area

Base route: `/student`

Subscriber educational pages require an `ACTIVE` subscription matching the relevant offer/access scope.

Planned pages:
- Dashboard
- Courses / lessons
- Lives / replays
- Exercises / quizzes / exams
- Results
- Progress
- Notifications
- Profile

Dashboard should show upcoming live, continue learning, pending work, latest results, recent replays and overall progress.

## 8. Academic Structure

Hierarchy:

`Academic Year → Level → Stream → Subject → Course → Chapter → Lesson`

Initial examples:
- `2026/2027`
- `2BAC`
- `PC`, `SM`
- `Physique`, `Chimie`

Students may also be assigned to a primary group such as `2BAC PC — Groupe A`.

## 9. Lessons & Resources

Lessons may contain title, description, teacher, subject/course/chapter, video, PDF, images, examples, exercises, quiz, homework, correction, order and publication status.

Statuses:
- `DRAFT`
- `PUBLISHED`
- `ARCHIVED`

Students never receive `DRAFT` content.

Large video binaries are not hosted by the application server in V1. Store provider metadata and external URLs. Initial provider: YouTube; live providers may include Google Meet and YouTube Live.

## 10. Lives & Replays

Live sessions include title, subject, target level/group, start/end time, provider, join URL, status and optional replay URL.

Statuses:
- `SCHEDULED`
- `LIVE`
- `FINISHED`
- `CANCELLED`
- `REPLAY_AVAILABLE`

Students see only lives/replays allowed by subscription and academic scope.

## 11. Exercises, Quizzes & Assessments

Exercise difficulty:
- `EASY`
- `MEDIUM`
- `HARD`

Quiz question types:
- `SINGLE_CHOICE`
- `MULTIPLE_CHOICE`
- `TRUE_FALSE`
- `NUMERIC`

Correct answers must not be sent to student clients before submission. Quiz scoring is server-side.

Assessment types may include `QUIZ`, `HOMEWORK`, `TEST`, `EXAM`, `BAC_SIMULATION`.

## 12. Results & Progress

Results store student, assessment, score, maximum, percentage, status and submission date.

Lesson progress tracks started-at, last-opened-at, percentage `0–100` and optional completed-at.

## 13. Parent Area

Base route: `/parent`

Parents may view linked student progress, latest results, upcoming assessments and upcoming lives. They cannot take quizzes, modify results/content or access unrelated students.

## 14. Admin Area

Base route: `/admin`

Admin manages accounts, subscriptions, students, parents, teachers, academic structure, groups, courses, lessons, lives, replays, exercises, quizzes, exams, results, notifications and settings.

Admin can activate, expire, suspend and renew subscriptions, including start/end dates.

## 15. Content Access

Access priority for private educational content:
1. authenticated user
2. active account
3. role
4. active subscription/offer entitlement
5. level/group/content scope

Frontend hiding is not authorization.

## 16. Notifications

Internal V1 notification types may include:
- `GENERAL`
- `NEW_LESSON`
- `LIVE_REMINDER`
- `NEW_REPLAY`
- `NEW_EXAM`
- `RESULT_AVAILABLE`

## 17. PWA / Offline Roadmap

Web local storage: IndexedDB behind an abstraction. Future native adapter: SQLite; a future Realm adapter must be possible without rewriting business logic.

Offline phases may cache metadata/content and queue progress mutations. Live video still requires internet.

## 18. V1 Non-goals

Unless explicitly requested, do not add payment gateway, paid OTP, AI tutor, gamification, rankings, certificates, native iOS/Android, custom video hosting, custom video conferencing, student social network, chat or advanced analytics.

## 19. V1 Definition of Done

V1 is complete when authentication, role authorization, subscription entitlement, academic/content management, lives/replays, quizzes/scoring, results/progress, parent monitoring, Arabic/French, mobile UI, migrations, seed, critical tests and production build all work; no public student self-signup exists and no secrets are committed.
