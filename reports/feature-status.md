# CourseVisa Feature Status Report

## Validation Method
- Static validation from frontend/backend source
- Runtime validation against local stack (backend `5001`, frontend `5173`)
- Runtime evidence file: `tmp/runtime-results.json`

## Feature Status Matrix
| Feature | Status | Evidence | Notes |
|---|---|---|---|
| Email/password login | Working | Runtime: `login_admin=true`, `login_mentor=true`, `login_student=true` | JWT issuance and protected endpoint access validated |
| JWT protected routes (backend) | Working | Runtime: `student_admin_users_blocked=true` (`403`), route policy in `backend/src/routes/admin.js` | Server role checks effective |
| `/auth/me` token validation path | Working | Runtime: `auth_me_success=true`, role `student` | Session continuity works |
| Google OAuth backend token validation | Partially working | Runtime: `google_invalid_token_rejected=true` (`401`), logic in `backend/src/controllers/auth.js` | Invalid token rejection confirmed; full browser OAuth happy path not executed in this run |
| Role-based frontend route guarding | Broken/Partial | `src/components/auth/ProtectedRoute.tsx` auth-only; `src/App.tsx` wraps role dashboards with same guard | Relies on per-page redirects instead of route-level role policy |
| Admin dashboard data APIs | Working | `src/pages/AdminDashboard.tsx` calls admin endpoints; runtime admin users call succeeded | Core admin data loads are real DB-backed |
| Mentor dashboard data APIs | Working (core) + UI-only segment | Runtime: `mentor_stats_success=true`; UI “Analytics Coming Soon” in `src/pages/MentorDashboard.tsx:448` | Core data works; analytics section placeholder |
| Student dashboard enrolled courses | Working | Runtime: enrollment count moved `0 -> 1` after checkout simulation | Real enrollment data is shown |
| Course CRUD (mentor/admin auth) | Working | Runtime: `mentor_create_course_success=true`, `mentor_delete_own_course_success=true` | Core CRUD path validated |
| Mentor application submit | Working (with caveat) | Runtime: `mentor_apply_public_success=true`; file handling caveat in controller | Text form path works; upload metadata handling incomplete |
| Password reset flow | Functional but unsafe for production | Runtime: `forgot_password_success=true`, `reset_password_success=true`, token returned | Demo behavior leaks reset token in response |
| Checkout/payment enrollment | Partially working (demo mode) | Runtime: `payment_simulate_success=true`, `enrollment_created_via_simulate=true`; checkout UI labels simulation | Enrollment works via mock/simulated payment, not production-grade payment finalization |
| Suspended-user access control | Broken | Runtime: `admin_suspend_user_success=true` then `suspended_user_still_can_login=true` and API access true | Suspension does not block auth/API use |

## Screen-Level Status
| Screen | Status | Evidence | Risk |
|---|---|---|---|
| Login / Signup | Working | Auth runtime checks + active route wiring | Demo credentials shown can confuse production posture |
| Admin Dashboard | Working (core) + UI-only footer | Data fetches and admin API checks pass; “Pagination Mock Footer” | Medium |
| Mentor Dashboard | Mixed | Stats and CRUD work; analytics tab placeholder | Medium |
| Student Dashboard | Mixed | Enrolled data real; certificates use alert-based placeholder | Medium |
| Checkout | Demo-only payment mode | Explicitly simulated payment gateway copy and simulate endpoint use | High |

## Evidence Ledger
| Finding | Evidence (file/endpoint/runtime) | Impact | Severity | Fix hint |
|---|---|---|---|---|
| Suspended users are not blocked | `tmp/runtime-results.json` + `backend/src/controllers/auth.js` + `backend/src/middleware/auth.js` | Admin suspension ineffective | Critical | Enforce status checks in login + protect middleware |
| Frontend RBAC guard incomplete | `src/components/auth/ProtectedRoute.tsx`, `src/App.tsx` | Role flows can feel inconsistent and are error-prone | High | Add role-aware route metadata + guard |
| Payment flow is simulation-based | `src/pages/Checkout.tsx`, `backend/src/controllers/payment.js` | Demo-safe but not enterprise-safe | Critical | Gate simulation by environment and implement verified payment orchestration |
| Password reset exposes token | `backend/src/controllers/auth.js:249-252` | Security risk in production-like deployments | High | Send token via email channel only in production |
