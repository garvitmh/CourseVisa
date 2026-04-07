# Bug Report (Bug Hunter)

## Runtime Evidence Source
- `C:\Desktop\E-Learning App\tmp\runtime-results.json`

## Critical

### 1) Suspended users can still authenticate and use protected APIs
- Evidence (file/endpoint/runtime):
  - Runtime: `admin_suspend_user_success=true`
  - Runtime: `suspended_user_still_can_login=true`
  - Runtime: `suspended_user_still_can_access_student_api=true`
  - Code: `backend/src/controllers/auth.js` login path has no status gate
  - Code: `backend/src/middleware/auth.js` does not check `req.user.status`
- Impact: admin suspension has no enforcement effect.
- Reproduction hint:
  1. Suspend a user via `PUT /api/v1/admin/users/:id/status`.
  2. Log in as that user.
  3. Call `GET /api/v1/student/courses` with returned JWT.
- Fix hint: enforce `status==='active'` in login and `protect` middleware.

### 2) Payment simulation endpoint directly grants enrollment in primary checkout path
- Evidence (file/endpoint/runtime):
  - Runtime: `payment_simulate_success=true`, `enrollment_created_via_simulate=true`
  - Code: `src/pages/Checkout.tsx:45` calls `api.payment.simulate(...)`
  - Code: `backend/src/controllers/payment.js:98-127` creates enrollment on simulate
- Impact: demo payment logic is part of main checkout path.
- Reproduction hint:
  1. Create/login student account.
  2. Checkout from cart.
  3. Observe enrollment count increase after simulated payment.
- Fix hint: isolate simulation to non-prod mode and enforce real verification flow for production.

## High

### 3) Frontend protected route does not enforce roles
- Evidence:
  - `src/components/auth/ProtectedRoute.tsx:10-20` (auth-only)
  - `src/App.tsx:87-107` admin/mentor/student dashboards all wrapped with same guard
- Impact: UI-level access policy is fragmented; relies on per-page redirects.
- Reproduction hint:
  1. Login as student.
  2. Navigate manually to `/admin` or `/mentor-dashboard`.
  3. Route enters page and then page logic redirects.
- Fix hint: add `allowedRoles` contract in route guard.

### 4) Password reset token leakage in API response
- Evidence:
  - `backend/src/controllers/auth.js:249-252` includes `resetToken` in response payload
  - Runtime: `forgot_password_token_returned=true`
- Impact: token exposure risk if deployed outside demo context.
- Reproduction hint: call `POST /api/v1/auth/forgot-password` for a valid user.
- Fix hint: in production mode, send token via email only and never return token body.

### 5) ID type mismatch between frontend contracts and backend payloads
- Evidence:
  - `src/types/index.ts` defines numeric IDs (`id: number`, `courseId: number`)
  - `src/pages/CourseDetail.tsx` and `src/pages/Books.tsx` use Mongo `_id` strings with cart APIs
  - `src/context/CartContext.tsx` compares `courseId === course.id`
- Impact: brittle behavior masked by `any`, risk of subtle cart/enrollment bugs.
- Reproduction hint: trace cart operations with mixed `_id` (string) and numeric typing.
- Fix hint: normalize all IDs as string in frontend and API contracts.

## Medium

### 6) Mentor resume upload is not persisted as normalized metadata
- Evidence:
  - Route uses upload middleware: `backend/src/routes/mentor.js:9`
  - Controller writes `MentorApplication.create(req.body)` only: `backend/src/controllers/mentor.js:11`
  - Upload paths exist: `backend/src/middleware/upload.js`
- Impact: uploaded file handling is incomplete and inconsistent.
- Reproduction hint: submit mentor application with file, inspect stored document fields.
- Fix hint: persist uploaded file URL/path and return normalized application payload.

### 7) Placeholder/fake dashboard sections in core user portals
- Evidence:
  - Mentor: `src/pages/MentorDashboard.tsx:448-449` (“Analytics Coming Soon”)
  - Student: `src/pages/StudentDashboard.tsx:215` alert-based certificate download
  - Admin: `src/pages/AdminDashboard.tsx:395-401` mock pagination footer
- Impact: demo credibility risk and inconsistent product maturity.
- Reproduction hint: navigate to these sections in each dashboard.
- Fix hint: implement minimal real behavior or mark clearly as beta/deferred.

### 8) Lint gate fails with blocking errors
- Evidence:
  - `tmp/lint-report.txt`: `2 errors, 60 warnings`
  - Errors include `prefer-const` and unused eslint-disable directive
- Impact: CI/code-quality gate instability.
- Reproduction hint: run `npm run lint`.
- Fix hint: resolve errors and add lint gating to PR checks.

### 9) Unused/dead model code
- Evidence:
  - `backend/src/models/Application.js` exists but is not referenced by routes/controllers
- Impact: schema drift and maintenance overhead.
- Reproduction hint: search references for `Application` model usage.
- Fix hint: remove dead model or merge with active `MentorApplication` path.

## Low

### 10) Mock configuration ambiguity and dead static dataset
- Evidence:
  - `src/constants/index.ts:143` sets `useMockData` with forced true expression
  - `src/types/mockData.ts` static dataset module retained
- Impact: developer confusion, accidental mock assumptions.
- Reproduction hint: inspect config and references to mock module.
- Fix hint: remove dead mock paths or hard-gate by explicit environment mode.

## Priority Summary
- Critical: 2
- High: 3
- Medium: 4
- Low: 1
