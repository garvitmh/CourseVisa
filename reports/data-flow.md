# CourseVisa Data Flow Report

## Runtime-Validated Flow Summary
- Backend health: `Welcome to Coursiva API`
- Frontend health: HTTP `200`
- Proxy integration: `http://127.0.0.1:5173/api/v1/courses` returned success/count
- Runtime evidence source: `tmp/runtime-results.json`

## Flow 1: Email/Password Auth (JWT)
1. User submits credentials in `src/components/auth/LoginForm.tsx`
2. `AuthContext.login()` calls `api.auth.login()`
3. `POST /api/v1/auth/login` in `backend/src/controllers/auth.js`
4. JWT returned by `sendTokenResponse()` and stored in `localStorage` (`auth_token`)
5. Protected API calls include `Authorization: Bearer <token>`

## Flow 2: Google OAuth
1. Frontend uses `useGoogleLogin` and sends Google access token to backend
2. `POST /api/v1/auth/google` fetches Google userinfo and maps/creates user
3. Backend returns app JWT for session continuity

## Flow 3: Dashboard Data
- Student: `api.student.getEnrolledCourses()` -> `GET /api/v1/student/courses` -> `Enrollment` + `Course`
- Mentor: `GET /api/v1/courses` + `GET /api/v1/mentor/stats` -> mentor filtered views + stats
- Admin: `GET /api/v1/admin/{users,courses,applications,enrollments}` -> admin tables

## Flow 4: Course Purchase and Enrollment
1. Checkout triggers `api.payment.simulate()`
2. `POST /api/v1/payment/simulate` creates enrollment rows directly
3. Student dashboard re-fetch sees new course in enrolled list

## Flow 5: Password Reset
1. `POST /api/v1/auth/forgot-password` returns reset token (demo behavior)
2. Frontend calls `PUT /api/v1/auth/reset-password/:resettoken`
3. New password accepted and user can log in with new secret

## Flow 6: Mentor Application
1. Frontend submits multipart form including resume
2. Route uses `upload.single('resume')`
3. Controller persists `req.body` only (resume metadata not normalized)

## Data Flow Risks
| Finding | Evidence (file/endpoint/runtime) | Impact | Severity | Fix hint |
|---|---|---|---|---|
| Suspended users still authenticate and call APIs | Runtime: `suspended_user_still_can_login=true`, `suspended_user_still_can_access_student_api=true`; auth logic in `backend/src/controllers/auth.js` + `backend/src/middleware/auth.js` | Admin suspension does not revoke access | Critical | Enforce `status==='active'` in login and `protect` middleware |
| Payment flow is simulation-first for enrollment | `backend/src/controllers/payment.js:95-127`, `src/pages/Checkout.tsx:45,164-173`, runtime `enrollment_created_via_simulate=true` | Demo flow can be mistaken for production payments | Critical | Gate simulation by environment and move to real verified payment state machine |
| Role checks are split between backend and per-page redirects | `src/components/auth/ProtectedRoute.tsx`, dashboard page-level redirects, backend route authorization | Inconsistent UX and potential accidental exposure of privileged UI routes | High | Add centralized role-aware protected route contract |
| Mentor upload pipeline is incomplete | `backend/src/routes/mentor.js:9`, `backend/src/controllers/mentor.js:11`, `backend/src/middleware/upload.js` | Resume upload path can be lost/untracked | Medium | Persist file metadata and return normalized resume URL |
| Password reset token returned in API response | `backend/src/controllers/auth.js:249-252` | Insecure for production use | High | Email-only token delivery in production mode |
