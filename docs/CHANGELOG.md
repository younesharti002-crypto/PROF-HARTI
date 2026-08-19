# PROF HARTI Academy — Change Log

## 2026-08-19 — PHASE 1 auth foundation started

Completed and validated:
- TASK-101: PostgreSQL/Drizzle `users` schema with roles, account status, preferred language, unique phone, password hash and timestamps.
- TASK-102: secure password hashing and verification using Node.js `scrypt`, random salt and timing-safe comparison.
- TASK-103: Moroccan phone normalization to E.164 `+212...` format.

Validation on the PHASE 1 branch:
- `npm run typecheck` — PASS
- `npm run lint` — PASS
- `npm run build` — PASS
- Vercel — PASS

No login endpoint, session handling, role middleware or public signup has been added yet.

## 2026-08-19 — PHASE 0 validated

PHASE 0 technical validation is complete on the review branch.

### Passed
- `npm run typecheck` — PASS
- `npm run lint` — PASS
- `npm run build` — PASS
- Vercel deployment — PASS after correcting the Vercel Framework Preset from NestJS to Next.js and removing build/output overrides.

### Product state
- Subscriber-only public messaging is in place.
- Arabic/French and RTL/LTR foundation is in place.
- Real supplied portrait is integrated.
- No PHASE 1 authentication or subscription backend was implemented during PHASE 0.
- Visual direction is currently awaiting Prof Harti stakeholder feedback; minor visual copy/layout refinements may still be applied without reopening the technical bootstrap gate.

## 2026-08-19 — PHASE 0 subscriber-only visual refinement

Scope: PHASE 0 frontend/bootstrap only. No authentication, user-management, subscription backend, course backend, live backend or quiz backend was added.

### Fixed
- Replaced public join/signup language with the subscriber-only product model.
- Main CTA: `دخول المشتركين / Espace abonnés`.
- Secondary CTA: `اكتشف العرض / Découvrir l’offre`.
- Removed previous registration-opening messaging and public `/register` UX.
- Removed percentage-style marketing claims from Hero highlights.
- Integrated the real supplied portrait at `public/images/prof-harti-portrait.jpeg` using `next/image`.
- Cairo remains the Arabic font; Poppins remains the French/Latin font.
- Merged SpecKit v1.1 subscriber-only requirements into README, SPEC, Architecture, Database, API, Security, Tasks and Master Prompt.
- Added `.github/workflows/phase0-ci.yml` to run install, typecheck, lint and production build on the PHASE 0 review branch.

## 2026-08-19 — SpecKit v1.1 — Subscriber-only access model

- Private learning area is only for students subscribed to an official Prof Harti offer.
- No public student self-signup in V1.
- Onboarding: subscription → admin confirmation → account/subscription activation → login.
- Subscription statuses: `PENDING`, `ACTIVE`, `EXPIRED`, `SUSPENDED`.
- Account status and subscription status are separate.
- Login alone does not grant educational-content entitlement.

## 2026-08-19 — PHASE 0 bootstrap implementation

Implemented Next.js/React/TypeScript, Tailwind Lab Chalkboard UI, PostgreSQL/Drizzle placeholders, AR/FR routing with RTL/LTR, Cairo/Poppins, mobile-first landing sections, portrait handling, Instagram-inspired section and lightweight electron-orbit SVG. No PHASE 1 business features were implemented.

## 2026-08-19 — SpecKit v1.0

Initial decisions: web/PWA-first, PostgreSQL, IndexedDB later, WhatsApp phone + password login planned, Arabic/French, external video/live providers and no paid OTP/payment features in V1.
