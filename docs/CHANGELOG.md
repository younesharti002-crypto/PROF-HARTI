# PROF HARTI Academy — Change Log

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

### Validation status
TASK-011/012/013 remain in progress until CI passes on this revision. A local syntax-transpile check passed for the TypeScript/TSX sources, but local dependency installation could not complete because the execution environment could not resolve the npm registry.

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
