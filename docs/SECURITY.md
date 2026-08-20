# PROF HARTI Academy — Security Requirements

## 1. Core Principle

Never trust the frontend. Sensitive checks happen server-side.

## 2. Passwords & Sessions

Passwords are never plaintext or logged; use strong hashing and safe comparison. Sessions must resist client tampering, expire and be invalidated on logout. Prefer secure cookie/session patterns over browser-readable secrets.

## 3. Authorization

Server must verify role, account status, subscription entitlement, academic/group scope, publication state and parent/student relationship.

Examples:
- Parent cannot read an unrelated student.
- Student cannot call admin endpoints.
- Draft lessons are invisible to students.
- Group-restricted lives are visible only to authorized groups.
- `PENDING`, `EXPIRED` and `SUSPENDED` subscriptions must not receive paid lessons, lives, replays, quizzes or protected resources.
- There is no public student self-signup in V1.

## 4. Subscription Entitlement Security

Never use a frontend-only flag for access. Every protected educational resource must validate an `ACTIVE` subscription for the appropriate offer and valid dates when configured.

A valid login session is not proof of entitlement. Subscription status changes are admin-only and should create an audit log.

## 5. Quiz Security

Correct answers remain server-side until allowed. Do not embed them in the initial student payload. Scoring is server-side.

## 6. Input Validation

Validate phone, password, IDs, URLs, dates, scores, quiz payloads, role/group relationships and content state transitions on the server.

## 7. Privacy & Secrets

Normalize phone numbers for login but do not expose phone lists to unauthorized users.

Never commit database URLs, auth secrets, storage keys or API keys. Keep only safe environment templates in git.

Logs must not contain passwords, session tokens, secret keys or sensitive payloads.

## 8. Audit Log

Track critical admin actions such as student creation/disablement, password reset, role changes, lesson publication, result edits, subscription activation/suspension/expiration/renewal.

## 9. Web Security

Validate external resource URLs. Do not allow dangerous javascript/data URLs for user-managed resources. Use parameterized database access, escaped output, safe CSRF/session patterns and sanitize rich HTML if supported.

Plan rate limiting for login, password reset and quiz submission.

## 10. Production Checklist

Before production: secrets outside git, debug off, HTTPS, secure cookies where applicable, migrations applied, seed/admin credentials changed, authorization tests pass and production build passes.
