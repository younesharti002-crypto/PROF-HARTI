# PROF HARTI Academy

**PROF HARTI Academy** is a bilingual, subscriber-only educational platform for Prof Harti, focused on Physics, Chemistry and the BAC 2027 learning journey.

## Product model

The public landing page introduces Prof Harti, the educational offer and social channels. The private learning area is reserved for students whose subscription has been confirmed by the administration.

Student access flow:

`Subscribe to offer → Admin confirmation → Account activation → WhatsApp + password login → Subscriber content`

There is **no public student self-signup in V1**.

## Current implementation

PHASE 0 provides the frontend/bootstrap foundation only:

- Next.js + React + TypeScript
- Tailwind CSS
- PostgreSQL connection placeholder
- Drizzle ORM / migration tooling
- Arabic + French
- RTL / LTR
- Cairo for Arabic
- Poppins for French/Latin
- Mobile-first Lab Chalkboard landing page
- Prof Harti portrait in Hero/About
- Instagram-inspired `@prof_harti` section
- Subscriber-only landing-page messaging

PHASE 0 intentionally does **not** implement authentication, users, subscriptions backend, courses backend, lives backend or quizzes.

## SpecKit read order

1. `docs/SPEC.md`
2. `docs/ARCHITECTURE.md`
3. `docs/DATABASE.md`
4. `docs/API.md`
5. `docs/SECURITY.md`
6. `docs/TASKS.md`
7. `docs/CHANGELOG.md`
8. `docs/MASTER-PROMPT.md`

## Roles planned for V1

- STUDENT
- PARENT
- TEACHER
- ADMIN

## V1 constraints

- Subscriber-only private educational content
- No open student self-signup
- Subscription states: `PENDING / ACTIVE / EXPIRED / SUSPENDED`
- WhatsApp phone number + password login (PHASE 1)
- Mobile-first
- PWA-first roadmap
- PostgreSQL central database
- IndexedDB local persistence planned for later offline phases
- External video/live providers
- No paid OTP requirement in V1

## Development rule

Read the SpecKit before editing. Work phase-by-phase, run real validation, and never claim a task is complete unless the relevant checks actually pass.
