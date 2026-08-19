# PROF HARTI Academy — Database Specification

## 1. Database

Use PostgreSQL.

Primary keys should preferably use UUIDs.

All tables should include timestamps where appropriate.

## 2. Core Tables

### users

Fields:
- id UUID PK
- full_name
- phone
- password_hash
- role
- status
- preferred_language
- created_at
- updated_at
- last_login_at

Role:
- STUDENT
- PARENT
- TEACHER
- ADMIN

Status:
- ACTIVE
- DISABLED

Constraints:
- normalized `phone` unique
- never store plaintext password

### academic_years

- id
- name
- starts_at
- ends_at
- active

Example:
- `2026/2027`

### levels

- id
- name

Example:
- `2BAC`

### streams

- id
- name
- level_id

Examples:
- PC
- SM

### groups

- id
- name
- academic_year_id
- level_id
- stream_id
- active

### student_profiles

- id
- user_id UNIQUE
- level_id
- stream_id
- primary_group_id
- student_code
- created_at
- updated_at

### parent_profiles

- id
- user_id UNIQUE
- created_at

### teacher_profiles

- id
- user_id UNIQUE
- bio
- created_at

### parent_students

- parent_id
- student_id
- relationship
- created_at

Unique:
- `(parent_id, student_id)`

### subjects

- id
- name
- slug
- active

Initial:
- Physique
- Chimie

### courses

- id
- title
- slug
- description
- academic_year_id
- level_id
- stream_id nullable
- subject_id
- teacher_id
- status
- created_at
- updated_at

### chapters

- id
- course_id
- title
- slug
- description
- position
- status

### lessons

- id
- chapter_id
- title
- slug
- description
- body/content reference
- position
- status
- published_at
- created_at
- updated_at

Status:
- DRAFT
- PUBLISHED
- ARCHIVED

### lesson_resources

- id
- lesson_id
- type
- title
- url
- mime_type
- size_bytes
- duration_seconds nullable
- position
- visibility
- created_at

Type:
- VIDEO
- PDF
- IMAGE
- LINK
- FILE

### live_sessions

- id
- title
- description
- teacher_id
- subject_id
- level_id nullable
- stream_id nullable
- group_id nullable
- start_at
- end_at nullable
- provider
- join_url
- status
- replay_url nullable
- created_at
- updated_at

Status:
- SCHEDULED
- LIVE
- FINISHED
- CANCELLED
- REPLAY_AVAILABLE

### replays

- id
- live_session_id
- title
- video_url
- duration_seconds nullable
- published_at
- created_at

### exercises

- id
- title
- statement
- subject_id
- chapter_id nullable
- lesson_id nullable
- difficulty
- content
- image_url nullable
- pdf_url nullable
- solution nullable
- correction_video_url nullable
- status
- created_at

Difficulty:
- EASY
- MEDIUM
- HARD

### quizzes

- id
- title
- lesson_id nullable
- time_limit_minutes nullable
- max_attempts
- passing_score
- show_correction
- status
- created_at
- updated_at

### questions

- id
- quiz_id
- type
- question_text
- explanation nullable
- points
- position

Type:
- SINGLE_CHOICE
- MULTIPLE_CHOICE
- TRUE_FALSE
- NUMERIC

### question_options

- id
- question_id
- label
- is_correct
- position

### quiz_attempts

- id
- quiz_id
- student_id
- started_at
- submitted_at nullable
- score nullable
- max_score nullable
- percentage nullable
- status

Status:
- IN_PROGRESS
- SUBMITTED
- EXPIRED

### quiz_answers

- id
- attempt_id
- question_id
- selected_option_id nullable
- numeric_answer nullable
- text_payload nullable
- awarded_points nullable

### assessments

- id
- type
- title
- subject_id
- group_id nullable
- starts_at nullable
- ends_at nullable
- max_score
- status
- created_at

Type:
- QUIZ
- HOMEWORK
- TEST
- EXAM
- BAC_SIMULATION

### assessment_results

- id
- assessment_id
- student_id
- score
- max_score
- percentage
- status
- created_at
- updated_at

### lesson_progress

- id
- student_id
- lesson_id
- started_at
- last_opened_at
- progress_percentage
- completed_at nullable
- updated_at

Unique:
- `(student_id, lesson_id)`

Constraint:
- progress 0–100

### notifications

- id
- title
- body
- type
- target_type
- target_id nullable
- created_at

Type:
- GENERAL
- NEW_LESSON
- LIVE_REMINDER
- NEW_REPLAY
- NEW_EXAM
- RESULT_AVAILABLE

### notification_reads

- notification_id
- user_id
- read_at

Unique:
- `(notification_id, user_id)`

### audit_logs

- id
- actor_user_id
- action
- entity_type
- entity_id
- metadata JSONB
- created_at

Never store passwords/tokens.

## 3. Indexing

At minimum index:
- users.phone
- courses.subject_id
- lessons.chapter_id
- live_sessions.start_at
- quiz_attempts.student_id
- lesson_progress.student_id
- assessment_results.student_id
- notifications.created_at

## 4. Soft Delete / Archive

Prefer archive/status changes for educational content that already has student activity.

Avoid deleting:
- quizzes with attempts
- lessons with progress
- assessments with results

## 5. Seed Data

Development seed:
- 1 admin
- 1 teacher: Prof Harti
- 3 students
- 1 parent
- academic year 2026/2027
- level 2BAC
- streams PC and SM
- subjects Physique and Chimie
- group `2BAC PC — Groupe A`
- 2 lessons
- 1 live
- 1 quiz

Seed credentials must be development-only.
