# PROF HARTI Academy — API Specification

## 1. Base Namespace

`/api/v1`

Protected routes require an authenticated session and server-side authorization.

## 2. Response Convention

Success: `{ "data": {}, "meta": {} }`.

Error responses must use safe codes/messages and never expose stack traces.

## 3. Auth (PHASE 1)

### POST `/api/v1/auth/login`
Input: phone + password.

Server normalizes the phone, verifies user/account/password, establishes a session and returns a safe user profile plus safe subscription/access summary for students.

There is **no public student signup endpoint in V1**. Authentication alone does not grant subscriber-content access.

Other planned endpoints:
- POST `/api/v1/auth/logout`
- GET `/api/v1/auth/me`
- POST `/api/v1/auth/change-password`
- POST `/api/v1/admin/users/:id/reset-password`

## 4. Offers & Subscriptions (PHASE 1)

Student:
- GET `/api/v1/student/subscription`

Possible status: `PENDING | ACTIVE | EXPIRED | SUSPENDED`.

Admin offers:
- GET `/api/v1/admin/offers`
- POST `/api/v1/admin/offers`
- PATCH `/api/v1/admin/offers/:id`

Admin subscriptions:
- GET `/api/v1/admin/students/:id/subscriptions`
- POST `/api/v1/admin/students/:id/subscriptions`
- PATCH `/api/v1/admin/subscriptions/:id`

Admin must be able to activate, suspend, expire and renew access.

Subscriber educational endpoints must reject access when the relevant subscription is not `ACTIVE`.

## 5. Educational APIs (later phases)

Planned student endpoints include:
- GET `/api/v1/student/dashboard`
- GET `/api/v1/courses`
- GET `/api/v1/courses/:id`
- GET `/api/v1/lessons/:id`
- POST `/api/v1/lessons/:id/progress`
- GET `/api/v1/live`
- GET `/api/v1/live/:id`
- GET `/api/v1/replays`
- GET `/api/v1/exercises`
- GET `/api/v1/quizzes/:id`
- POST `/api/v1/quizzes/:id/start`
- POST `/api/v1/quizzes/:id/submit`
- GET `/api/v1/results`
- GET `/api/v1/progress`
- GET `/api/v1/notifications`
- POST `/api/v1/notifications/:id/read`

Correct quiz answers must not be exposed before submission; scoring is server-side.

Admin CRUD endpoints will manage courses, chapters, lessons, lives, replays, exercises, quizzes, notifications and users.

Parent endpoints will expose only linked-student results/progress.

## 6. Authorization Rule

Every protected handler must check:
1. authenticated
2. active account
3. permitted role
4. active subscription/offer entitlement for subscriber educational content
5. resource scope (level/group/relationship/publication)

Frontend route guards do not replace backend checks.
