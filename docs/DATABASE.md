# PROF HARTI Academy — Database Specification

## 1. Database

Use PostgreSQL. Prefer UUID primary keys. Add timestamps where appropriate. Never store plaintext passwords or secrets.

## 2. Core Identity & Access Tables

### users
- id UUID PK
- full_name
- phone UNIQUE (normalized)
- password_hash
- role: `STUDENT | PARENT | TEACHER | ADMIN`
- status: `ACTIVE | DISABLED`
- preferred_language
- created_at / updated_at / last_login_at

### student_profiles
- id
- user_id UNIQUE
- level_id
- stream_id
- primary_group_id
- student_code
- created_at / updated_at

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

Unique: `(parent_id, student_id)`.

### offers
Represents a commercial/educational Prof Harti offer.
- id UUID PK
- name
- slug
- description nullable
- academic_year_id nullable
- starts_at / ends_at nullable
- active
- created_at / updated_at

Initial V1 offer: `Offre Excellence BAC 2027 / عرض التفوق BAC 2027`.

### student_subscriptions
Controls subscriber entitlement.
- id UUID PK
- student_id
- offer_id
- status: `PENDING | ACTIVE | EXPIRED | SUSPENDED`
- starts_at / ends_at nullable
- activated_at / suspended_at / expired_at nullable
- created_by_user_id nullable
- notes nullable
- created_at / updated_at

Account status and subscription status remain separate. V1 should prevent conflicting current subscription records for the same student/offer.

## 3. Academic Tables

### academic_years
- id, name, starts_at, ends_at, active

### levels
- id, name

### streams
- id, name, level_id

### groups
- id, name, academic_year_id, level_id, stream_id, active

### subjects
- id, name, slug, active

Initial subjects: Physique, Chimie.

## 4. Content Tables

### courses
- id, title, slug, description
- academic_year_id, level_id, stream_id nullable
- subject_id, teacher_id, status
- created_at / updated_at

### chapters
- id, course_id, title, slug, description, position, status

### lessons
- id, chapter_id, title, slug, description
- body/content reference, position, status, published_at
- created_at / updated_at

Lesson status: `DRAFT | PUBLISHED | ARCHIVED`.

### lesson_resources
- id, lesson_id, type, title, url
- mime_type, size_bytes, duration_seconds nullable
- position, visibility, created_at

Resource type: `VIDEO | PDF | IMAGE | LINK | FILE`.

### live_sessions
- id, title, description, teacher_id, subject_id
- level_id / stream_id / group_id nullable
- start_at, end_at nullable, provider, join_url, status
- replay_url nullable, created_at / updated_at

Status: `SCHEDULED | LIVE | FINISHED | CANCELLED | REPLAY_AVAILABLE`.

### replays
- id, live_session_id, title, video_url, duration_seconds nullable, published_at, created_at

### exercises
- id, title, statement, subject_id
- chapter_id / lesson_id nullable
- difficulty, content, image_url / pdf_url / solution / correction_video_url nullable
- status, created_at

Difficulty: `EASY | MEDIUM | HARD`.

## 5. Quiz / Result / Progress Tables

### quizzes
- id, title, lesson_id nullable, time_limit_minutes nullable
- max_attempts, passing_score, show_correction, status
- created_at / updated_at

### questions
- id, quiz_id, type, question_text, explanation nullable, points, position

Type: `SINGLE_CHOICE | MULTIPLE_CHOICE | TRUE_FALSE | NUMERIC`.

### question_options
- id, question_id, label, is_correct, position

### quiz_attempts
- id, quiz_id, student_id, started_at, submitted_at nullable
- score / max_score / percentage nullable
- status: `IN_PROGRESS | SUBMITTED | EXPIRED`

### quiz_answers
- id, attempt_id, question_id
- selected_option_id / numeric_answer / text_payload / awarded_points nullable

### assessments
- id, type, title, subject_id, group_id nullable
- starts_at / ends_at nullable, max_score, status, created_at

Type: `QUIZ | HOMEWORK | TEST | EXAM | BAC_SIMULATION`.

### assessment_results
- id, assessment_id, student_id, score, max_score, percentage, status, created_at / updated_at

### lesson_progress
- id, student_id, lesson_id, started_at, last_opened_at
- progress_percentage, completed_at nullable, updated_at

Unique `(student_id, lesson_id)`; progress range `0–100`.

## 6. Notifications & Audit

### notifications
- id, title, body, type, target_type, target_id nullable, created_at

### notification_reads
- notification_id, user_id, read_at

Unique `(notification_id, user_id)`.

### audit_logs
- id, actor_user_id, action, entity_type, entity_id, metadata JSONB, created_at

Never store passwords or tokens in audit metadata.

## 7. Indexing

At minimum index users.phone, student_subscriptions student/offer/status, course subject, lesson chapter, live start time, quiz attempt student, lesson progress student, assessment result student and notification created_at.

## 8. Archive Rule

Prefer status/archive changes for educational content with student activity. Avoid deleting quizzes with attempts, lessons with progress or assessments with results.

## 9. Development Seed (future phases)

Plan for one admin, Prof Harti teacher, BAC 2027 offer, test students with ACTIVE and non-active subscriptions, parent, 2026/2027 academic structure, PC/SM, Physique/Chimie, one group, sample lessons/live/quiz. Seed credentials must be development-only.
