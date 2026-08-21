# PROF HARTI Academy — MVP Release Handoff

Release scope: student + teacher/admin platform core.

## Included in this release

- Bilingual AR/FR public experience
- WhatsApp/password login with server-side sessions
- Student, Teacher and Admin roles
- Academic structure and subscription entitlement checks
- Course / Chapter / Lesson authoring
- Published student course library
- Lesson video/PDF viewer and lesson progress
- Live Classes lifecycle and Replay publishing
- Exercises / Quizzes with server-side grading and attempt history
- Real student progress and assessment score surfaces
- Teacher ownership restrictions
- Access-control regression tests before production builds

## Intentionally deferred

- Parent UI and parent dashboard
- Parent notifications
- Offline/PWA expansion
- Additional notification providers

Parents are part of the final extended version and are not a blocker for this MVP release.

## Production data policy

Production must not contain demo students, demo offers, demo courses, demo lives or demo quizzes.

Do not commit passwords, phone numbers, database credentials, session tokens or provider secrets. Use environment variables only.

## Environment checklist

Required:

- APP_URL
- AUTH_SECRET
- DATABASE_URL

Optional one-time seeding:

- SEED_ADMIN_NAME
- SEED_ADMIN_PHONE
- SEED_ADMIN_PASSWORD
- SEED_ADMIN_LANGUAGE
- SEED_TEACHER_NAME
- SEED_TEACHER_PHONE
- SEED_TEACHER_PASSWORD
- SEED_TEACHER_LANGUAGE

## Release verification

Run:

```bash
npm ci
npm run test:auth
npm run test:subscriptions
npm run test:academic
npm run test:access
npm run typecheck
npm run lint
npm run build
```

Then verify these flows with real release accounts:

1. Student login and subscription gate
2. Course list and protected lesson URL
3. Lesson STARTED / COMPLETED progress
4. Live link visible only while status is LIVE
5. Replay visible after completion
6. Quiz submission, grading and attempt history
7. Teacher course ownership and publishing
8. Admin academic/security pages
9. `/api/health` returns success

## Backup / rollback

Before release cleanup, keep a Neon branch snapshot long enough to cover handoff validation. Do not treat the backup branch as a production runtime database.

## Reuse for another teacher

Keep the core platform unchanged:

- auth/session
- subscriptions/access control
- academic model
- content model
- live/replay engine
- assessment engine
- admin/teacher authorization

Change only the teacher brand, subject setup, public copy/assets and educational content unless a new functional requirement explicitly requires core changes.
