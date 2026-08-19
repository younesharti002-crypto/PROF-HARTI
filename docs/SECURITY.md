# PROF HARTI Academy — Security Requirements

## 1. Core Principle

Never trust the frontend.

All sensitive checks happen server-side.

## 2. Passwords

Requirements:
- never plaintext
- never logged
- strong password hashing
- safe comparison
- admin reset without revealing previous password

## 3. Sessions

Session should:
- be protected from client tampering
- expire
- be invalidated on logout
- avoid storing sensitive data in browser-readable storage when a safer session mechanism is available

## 4. Authorization

Must verify:
- role
- account status
- group membership
- content access
- parent/student relationship

Examples:
- Parent A cannot read Student B unless linked.
- Student cannot access admin endpoints.
- Draft lessons are invisible to students.
- Group-restricted live session only appears to authorized group.

## 5. Quiz Security

Correct answers:
- must remain server-side until allowed
- must not be embedded in initial quiz payload
- scoring must happen server-side

## 6. Input Validation

Server validates:
- phone
- password
- UUIDs
- URLs
- dates
- scores
- question payloads
- group/role relationships
- content state transitions

## 7. Phone Privacy

Normalize phone number for login.

Do not expose phone lists to unauthorized users.

## 8. Secrets

Never commit:
- database URL
- auth secret
- storage keys
- API keys

Use environment variables.

Repository must contain `.env.example` only.

## 9. Logging

Logs may include:
- request id
- user id
- action
- error category

Logs must not include:
- plaintext passwords
- session tokens
- secret keys
- full sensitive payloads

## 10. Audit Log

Track critical admin actions:
- create student
- disable account
- password reset
- lesson publication
- result manual edit
- role changes

## 11. URL Validation

External video/live/resource URLs should be validated.

Do not allow dangerous javascript/data URLs.

## 12. Rate Limiting

At minimum plan protection for:
- login attempts
- password reset
- quiz submission

Implementation may use provider/platform capabilities in V1.

## 13. CSRF / XSS / Injection

Use framework-safe patterns.

Requirements:
- parameterized database access
- escaped output
- avoid rendering unsafe HTML
- sanitize rich content if raw HTML is supported
- use secure CSRF/session patterns appropriate to chosen auth method

## 14. Production Safety Checklist

Before production:
- production secrets configured outside git
- debug mode off
- secure cookies where applicable
- HTTPS
- migrations applied
- admin seed password changed
- no demo credentials public
- authorization tests pass
- build passes
