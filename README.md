# PROF HARTI Academy

**PROF HARTI Academy** is a bilingual (Arabic/French), subscriber-only educational platform for Physics & Chemistry students preparing for the Moroccan BAC.

## MVP status

The core MVP is implemented and release-ready on the `mvp-content-workflow` branch.

Implemented modules:

- Public bilingual landing page (AR/FR, RTL/LTR)
- WhatsApp phone + password authentication
- Roles: STUDENT / TEACHER / ADMIN
- Subscription access states: PENDING / ACTIVE / SUSPENDED / EXPIRED
- Academic structure: year / level / stream / subject / group
- Teacher Content Studio: Course → Chapter → Lesson
- Lesson resources: video + PDF
- Draft / Published / Archived content workflow
- Student course library with entitlement filtering
- Lesson viewer and real lesson progress tracking
- Live Classes scheduling and lifecycle
- Student Live + Replays hub
- Exercises + Quizzes authoring
- Server-side quiz grading, attempts and scores
- Student dashboard with real progress / live / replay / assessment data
- Admin password reset and academic administration
- Access-control regression tests before production builds

## Deferred from this MVP

The Parent experience is intentionally deferred to the final extended version. Parent UI, parent dashboards and parent notifications are not required to ship the current MVP.

Offline/PWA enhancements and additional notification channels are also future extensions.

## Student flow

`Subscription confirmed → Account activated → WhatsApp + password login → Dashboard → Courses / Live / Replays / Exercises → Progress & Scores`

There is **no public student self-signup** in the MVP.

## Teacher flow

`Teacher login → Studio → Create course → Add chapters/lessons → Publish → Schedule Live → Publish Replay → Create Quiz/Exercise`

Teachers can only manage content belonging to their own courses. ADMIN can manage platform-wide academic and security operations.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- PostgreSQL on Neon
- Drizzle ORM
- Vercel deployment
- Node.js 24

## Required environment variables

Use `.env.example` as the source of truth. Never commit real credentials.

Core runtime variables:

- `APP_URL`
- `AUTH_SECRET`
- `DATABASE_URL`

One-time seed variables are available for ADMIN and TEACHER account creation and must only be provided through the deployment environment.

## Quality gates

Before a production build, the project runs access-control regression tests covering:

- Live resource visibility by lifecycle state
- Quiz publish integrity
- PostgreSQL strict SSL connection handling

Recommended release verification:

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

## Main private routes

Student:

- `/{lang}/dashboard`
- `/{lang}/courses`
- `/{lang}/live`
- `/{lang}/assessments`

Teacher:

- `/{lang}/studio`
- `/{lang}/studio/live`
- `/{lang}/studio/assessments`

Admin:

- `/{lang}/admin/academic`
- `/{lang}/admin/security`

## Documentation

Read in this order when extending the platform:

1. `README.md`
2. `docs/RELEASE-MVP.md`
3. `docs/SPEC.md`
4. `docs/ARCHITECTURE.md`
5. `docs/DATABASE.md`
6. `docs/API.md`
7. `docs/SECURITY.md`
8. `docs/TASKS.md`
9. `docs/CHANGELOG.md`
10. `docs/MASTER-PROMPT.md`

## Reusable platform rule

The authentication, academic structure, content workflow, subscription access, live/replay system and assessment engine form the reusable core. For future teachers, keep this core stable and change branding, subject configuration and educational content rather than rebuilding the platform.
