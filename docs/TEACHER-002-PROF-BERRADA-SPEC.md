# Teacher 002 — Prof Berrada

## Status
Draft implementation specification for Growth Partner Teacher 002.

## Teacher positioning
- Public name: **Prof Berrada**
- Subject: **Mathématiques**
- Level: **Collège / الإعدادي**
- Instagram: **@prof.berrada**
- Role in Growth Partner pilot: **Teacher 002**
- Main business objective: turn social attention into qualified student/parent leads, then into active students inside a private digital academy.

> Do not claim specific grades, prices, student results, testimonials, city, phone number, or teaching credentials until Prof Berrada confirms them.

---

# 1. Landing Page

## Primary goal
Convert visitors into one of two actions:
1. Contact / request information.
2. Enter the academy if already enrolled.

## Hero
**Eyebrow:** Mathématiques • Collège

**Headline:**
> الرياضيات كتولي أسهل ملي كتفهم المنهجية

**Supporting copy:**
> فضاء Prof Berrada لتلاميذ الإعدادي: شرح واضح، تمارين متدرجة، حصص مباشرة ومتابعة منظمة باش التلميذ يبني الفهم والثقة خطوة بخطوة.

**Primary CTA:** تواصل للاستفادة من البرنامج

**Secondary CTA:** دخول التلاميذ

**Trust strip:**
- شرح مبسط
- تمارين منظمة
- متابعة التقدم
- Live + Replays

## Problem section
Headline:
> المشكل ماشي دائماً فالمات… مرات المشكل فطريقة الفهم والمراجعة

Points:
- التلميذ كيعرف القاعدة ولكن ما كيعرفش فين يستعملها.
- كيتشتت بين فيديوهات وتمارين ومصادر كثيرة.
- كيعاود نفس الأخطاء بلا متابعة واضحة.
- كيحتاج مسار منظم من الشرح إلى التطبيق.

## Method section
Headline:
> من الفهم إلى التطبيق

Flow:
1. **نفهم الفكرة** — شرح واضح ومركز.
2. **نشوف المثال** — تطبيق مباشر على المفهوم.
3. **نتدرب** — تمارين متدرجة.
4. **نصحح الخطأ** — تصحيح وفهم سبب الخطأ.
5. **نتابع التقدم** — Progress داخل حساب التلميذ.

## Academy benefits
- دروس منظمة داخل حساب واحد.
- فيديوهات وملفات PDF.
- حصص مباشرة.
- Replays للرجوع للحصص السابقة.
- تمارين وQuiz.
- تتبع تقدم التلميذ.
- حساب شخصي لكل تلميذ.

## Levels section
Public positioning remains **Collège**.

Potential academy categories `1AC / 2AC / 3AC` must remain configurable and should only be published after Prof Berrada confirms the exact levels he serves.

## Parent-oriented section
Headline:
> المتابعة ما تبقاش مبنية على التخمين

Copy:
> الهدف هو أن يكون المسار التعليمي منظم وواضح: شنو قرا التلميذ، شنو تدرب عليه، وشنو باقي خاصو يراجع. أي Parent-specific dashboard remains outside the current MVP unless explicitly activated later.

## Final CTA
Headline:
> بغيتي تعرف واش البرنامج مناسب لمستوى التلميذ؟

Primary CTA: تواصل معنا
Secondary CTA: دخول التلاميذ

Contact destinations must come from teacher configuration. Do not hardcode an unconfirmed phone number.

---

# 2. Prof Berrada Academy

## Preserve from PROF HARTI core
- Authentication / sessions.
- STUDENT / TEACHER / ADMIN roles.
- Subscriber entitlement and access checks.
- Student dashboard.
- Courses and lessons.
- Live classes and replays.
- Exercises and quizzes.
- Server-side grading.
- Progress tracking.
- Student management.
- Admin / teacher authorization.
- Mobile responsive experience.
- Arabic / French direction support.

## Replace with teacher-specific data/config
- Teacher name.
- Portrait.
- Instagram.
- Subject.
- Levels.
- Biography.
- Public copy.
- Academic categories.
- Courses and lessons.
- Colors / visual theme.
- Contact channels.
- Domain/subdomain.

## Proposed visual direction
Mathematics should not reuse the Physics/Chemistry laboratory identity.

Draft theme:
- Premium navy base.
- Clear white surfaces.
- Electric/cobalt blue accents.
- Subtle geometric grid, equations and coordinate-system motifs.
- Strong numeric typography.
- No chemistry/lab iconography.

Final identity should be approved after the teacher portrait/logo are available.

---

# 3. Multi-teacher requirement

Teacher 002 must not be implemented as a permanent manual clone.

Target model:

`Stable Core + Teacher Configuration + Teacher Content + Subject Theme`

At minimum teacher-scoped data must resolve through a teacher/tenant identifier. The implementation must prevent Teacher A from accessing Teacher B data on the server side, not only hide it in the UI.

Teacher 002 validation passes only when:
1. No PROF HARTI name, Instagram, Physics/Chemistry copy or portrait leaks into Berrada public/student surfaces.
2. Berrada content is isolated from Harti content.
3. Berrada students cannot access Harti paid content and vice versa.
4. The same core auth/content/live/quiz engine remains intact.
5. Branding/content can be changed without rewriting the protected core.

---

# 4. Domain model

Default Growth Partner model:
- Shared master domain.
- One teacher-specific subdomain per academy.

Example only after the master domain is purchased:
`berrada.<master-domain>`

Premium option:
- Custom domain owned/approved according to the Growth Partner contract.
- Same tenant/academy underneath; only the public domain changes.

---

# 5. Landing funnel

`Instagram / Ads / Content → Landing Page → CTA → Lead → Qualification → Enrollment → Student Account → Academy`

Landing page and academy are connected but have different jobs:
- **Landing:** acquisition and conversion.
- **Academy:** teaching, content access, progress and retention.

---

# 6. Missing teacher inputs before final publication

Required before production:
- Approved portrait photo.
- Exact levels served.
- Confirmed biography.
- Main WhatsApp/contact channel.
- Offer/pricing if it will be public.
- Approved CTA wording.
- Testimonials/results only if verified and authorized.
- Logo if available.

None of these should be invented.

---

# 7. Execution order

1. Extract teacher identity/contact/subject values from hardcoded source into configuration.
2. Add Prof Harti as Teacher 001 configuration without changing his production behavior.
3. Add Prof Berrada as Teacher 002 configuration.
4. Build Berrada landing copy from this spec.
5. Add mathematics theme tokens/assets.
6. Add/configure Berrada academic structure and demo content after levels are confirmed.
7. Add Berrada portrait/contact details.
8. Run typecheck, access tests and production build.
9. Run explicit Tenant A vs Tenant B isolation tests.
10. Deploy preview for review before any production/domain cutover.

## Scope guard
AI Tutor remains a later Premium module. Do not block Teacher 002 validation on AI Tutor.
