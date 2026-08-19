# PROF HARTI Academy — Architecture

## 1. Architectural Goal

Keep V1:
- simple
- low-cost
- maintainable
- AI-friendly
- secure
- mobile-first

Avoid unnecessary distributed services.

## 2. Preferred Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
Prefer the same Next.js codebase for V1 server/API features unless scale or isolation later requires a dedicated backend.

### Database
- PostgreSQL

### ORM
Use a mature TypeScript ORM compatible with PostgreSQL.

### Validation
Use schema-based server validation.

### Local Web Storage
- IndexedDB through repository abstraction

### Future Native
- Expo
- SQLite

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

Client also has:

```text
IndexedDB
  |
  +-- cached content metadata
  +-- lesson cache
  +-- pending progress events
  +-- sync state
```

## 4. Recommended Repository Structure

```text
prof-harti-academy/
├── app/ or src/app/
├── src/
│   ├── components/
│   ├── features/
│   ├── lib/
│   ├── server/
│   ├── repositories/
│   ├── validation/
│   ├── i18n/
│   └── types/
├── public/
├── locales/
│   ├── ar/
│   └── fr/
├── docs/
├── migrations/
├── tests/
├── .env.example
└── README.md
```

A monorepo may be used later if native apps are introduced.

## 5. Feature Boundaries

Recommended feature modules:
- auth
- users
- academics
- courses
- lessons
- live
- replays
- exercises
- quizzes
- assessments
- results
- progress
- parents
- notifications
- admin
- local-sync

Each feature should own:
- validation
- services
- data access
- tests
- UI where appropriate

## 6. Server Authority

Server is authoritative for:
- authentication
- authorization
- account status
- content publication
- quiz scoring
- results
- group access
- parent/student linking

Client is allowed to submit:
- progress events
- quiz answers
- local interaction state

## 7. Local Storage Abstraction

Define a stable interface, e.g.:

```ts
interface LocalRepository {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  listPendingMutations(): Promise<PendingMutation[]>;
}
```

Implement:
- `IndexedDbRepository` for PWA
- future `SQLiteRepository` for native
- optional future `RealmRepository`

Business logic must depend on the interface, not on a concrete engine.

## 8. Sync Model

V1 sync flow:

1. Detect connection.
2. Upload pending progress mutations.
3. Fetch changed server content.
4. Save updated data locally.
5. Mark successful mutations as synced.

Status:
- `SYNCED`
- `PENDING`
- `FAILED`

## 9. Conflict Rules

Server wins for:
- users
- permissions
- lesson publication
- results
- quiz scoring
- live schedule

Client may merge:
- last opened timestamp
- progress events

Never let stale client data overwrite admin/security state.

## 10. Internationalization

All UI text should resolve through translations.

Arabic:
- `dir="rtl"`

French:
- `dir="ltr"`

Avoid layouts that assume one direction.

## 11. Deployment Principle

V1 should be deployable with minimal services:
- App hosting
- PostgreSQL provider
- External video/live links

No custom media server in V1.

## 12. Architecture Change Rule

Any major architectural change must be recorded in:
- this file
- `CHANGELOG.md`

The implementation AI must explain:
- reason
- tradeoff
- migration impact
