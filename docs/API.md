# PROF HARTI Academy — API Specification

## 1. Base Namespace

`/api/v1`

All protected routes require authenticated session.

## 2. Response Convention

Success example:

```json
{
  "data": {},
  "meta": {}
}
```

Error example:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input"
  }
}
```

Do not expose stack traces.

## 3. Auth

### POST `/api/v1/auth/login`

Input:
```json
{
  "phone": "0612345678",
  "password": "secret"
}
```

Behavior:
- normalize phone
- validate user
- reject disabled account
- verify password
- establish session
- return safe user profile

### POST `/api/v1/auth/logout`

Invalidates current session.

### GET `/api/v1/auth/me`

Returns current safe user identity.

### POST `/api/v1/auth/change-password`

Requires current password unless admin reset flow.

### POST `/api/v1/admin/users/:id/reset-password`

Admin only.

## 4. Student Dashboard

### GET `/api/v1/student/dashboard`

Returns:
- upcoming live
- continue learning
- pending work
- latest results
- recent replays
- subject progress

## 5. Courses

### GET `/api/v1/courses`

Returns courses authorized for current user.

### GET `/api/v1/courses/:id`

Returns course details if authorized.

Admin:
- POST `/api/v1/admin/courses`
- PATCH `/api/v1/admin/courses/:id`
- POST `/api/v1/admin/courses/:id/archive`

## 6. Chapters

Admin:
- POST `/api/v1/admin/chapters`
- PATCH `/api/v1/admin/chapters/:id`
- POST `/api/v1/admin/chapters/:id/archive`

## 7. Lessons

### GET `/api/v1/lessons/:id`

Must enforce publication and access scope.

### POST `/api/v1/lessons/:id/progress`

Input:
```json
{
  "progressPercentage": 75
}
```

Admin:
- POST `/api/v1/admin/lessons`
- PATCH `/api/v1/admin/lessons/:id`
- POST `/api/v1/admin/lessons/:id/publish`
- POST `/api/v1/admin/lessons/:id/archive`

## 8. Live Sessions

### GET `/api/v1/live`

Returns current user's assigned lives.

### GET `/api/v1/live/:id`

Returns authorized live details.

Admin:
- POST `/api/v1/admin/live`
- PATCH `/api/v1/admin/live/:id`
- POST `/api/v1/admin/live/:id/cancel`
- POST `/api/v1/admin/live/:id/replay`

## 9. Replays

### GET `/api/v1/replays`

Returns authorized replay library.

## 10. Exercises

### GET `/api/v1/exercises`

Supports filters:
- subject
- lesson
- difficulty

Admin:
- POST `/api/v1/admin/exercises`
- PATCH `/api/v1/admin/exercises/:id`

## 11. Quizzes

### GET `/api/v1/quizzes/:id`

Must not expose correct answers before submission.

### POST `/api/v1/quizzes/:id/start`

Creates attempt.

### POST `/api/v1/quizzes/:id/submit`

Input:
- attempt id
- answers

Server:
- validates attempt
- scores
- stores result
- returns safe result/correction according to configuration

Admin:
- POST `/api/v1/admin/quizzes`
- PATCH `/api/v1/admin/quizzes/:id`

## 12. Results

Student:
- GET `/api/v1/results`

Parent:
- GET `/api/v1/parent/students/:id/results`

Admin:
- GET `/api/v1/admin/students/:id/results`

## 13. Progress

Student:
- GET `/api/v1/progress`

Parent:
- GET `/api/v1/parent/students/:id/progress`

Admin:
- GET `/api/v1/admin/students/:id/progress`

## 14. Notifications

### GET `/api/v1/notifications`

### POST `/api/v1/notifications/:id/read`

Admin:
- POST `/api/v1/admin/notifications`

## 15. Admin Users

- GET `/api/v1/admin/students`
- POST `/api/v1/admin/students`
- GET `/api/v1/admin/students/:id`
- PATCH `/api/v1/admin/students/:id`
- POST `/api/v1/admin/students/:id/disable`
- POST `/api/v1/admin/students/:id/activate`

Equivalent management may exist for:
- parents
- teachers

## 16. Authorization Rule

Every API handler must explicitly check:
1. authenticated
2. active account
3. permitted role
4. resource scope

Frontend route guards do not replace backend checks.
