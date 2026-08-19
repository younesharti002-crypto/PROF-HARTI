# PROF HARTI Academy — Architecture

## 1. Goal

Keep V1 simple, low-cost, maintainable, secure, mobile-first and AI-friendly. Avoid unnecessary distributed services.

## 2. Preferred Stack

Frontend: Next.js + React + TypeScript + Tailwind CSS.

Backend: prefer the same Next.js codebase for V1 server/API features.

Database: PostgreSQL.

ORM/migrations: TypeScript ORM compatible with PostgreSQL; current PHASE 0 wiring uses Drizzle.

Validation: schema-based server validation.

Local web storage: IndexedDB through a repository abstraction.

Future native: Expo + SQLite.

## 3. High-level Flow

```text
Browser / PWA
   |
   | HTTPS
   v
Next.js App + API
   |
   v
PostgreSQL
```

Client-local storage later contains cached metadata/content, pending progress events and sync state.

## 4. Feature Boundaries

Recommended modules:
- auth
- users
- offers
- subscriptions/access-entitlements
- academics
- courses / lessons
- live / replays
- exercises / quizzes / assessments
- results / progress
- parents
- notifications
- admin
- local-sync

Each feature should own validation, services, data access, tests and relevant UI.

## 5. Server Authority

Server is authoritative for authentication, account status, subscription status/offer entitlement, authorization, publication, quiz scoring, results, group access and parent/student linking.

Client may submit progress events, quiz answers and local interaction state but may never overwrite security or entitlement state.

## 6. Subscriber Access Gate

Authentication and paid-content authorization are separate checks.

For subscriber educational resources, verify in order:
1. authenticated user
2. active user account
3. permitted role
4. matching subscription exists
5. subscription status is `ACTIVE`
6. current date is inside allowed subscription dates when configured
7. level/group/content scope permits access

`PENDING`, `EXPIRED` and `SUSPENDED` subscriptions must not receive paid lessons, lives, replays, quizzes or protected resources.

An expired student may still authenticate to see account/subscription status and renewal guidance.

## 7. Local Storage Abstraction

Business logic must depend on an interface rather than a specific local engine. Implement IndexedDB for PWA; keep future SQLite and optional Realm adapters possible.

## 8. Sync Rules

Server wins for users, permissions, subscriptions, publication, results, scoring and live schedule. Client may merge last-opened timestamps and progress events.

## 9. Internationalization

Arabic uses `dir="rtl"`; French uses `dir="ltr"`. Layouts must use direction-safe/logical properties where practical.

PHASE 0 typography: Cairo for Arabic and Poppins for French/Latin.

## 10. Deployment Principle

V1 should need only app hosting, PostgreSQL and external video/live links. No custom media server.

## 11. Change Rule

Major architecture changes must be documented here and in `CHANGELOG.md` with reason, tradeoff and migration impact.
