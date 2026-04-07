# CourseVisa Architecture Report

## Scope and Baseline
- Repository analyzed: `C:\Desktop\E-Learning App`
- GitHub source confirmed: `garvitmh/CourseVisa`
- Runtime baseline: backend on `5001`, frontend on `5173`, Vite proxy to `/api/v1`

## Tech Stack
- Frontend: React 18, TypeScript, Vite, React Router v6, TailwindCSS v4, DaisyUI, `@react-oauth/google`
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs, google-auth-library, Helmet, CORS, Multer, Razorpay
- Database: MongoDB (Mongoose ODM)
- Build/Test state: `npm run type-check` passes, `npm run lint` fails (`2` errors, `60` warnings)

## Folder Structure (High-Level)
- `src/`: React app (pages, contexts, components, hooks, API client)
- `backend/src/`: Express server (routes, controllers, middleware, models, db config)
- `backend/seeder.js`: deterministic seed data for users/courses/books/mentor apps
- `src/services/api.ts`: frontend API wrapper used by auth, catalog, dashboard, payment, quiz flows
- `src/pages/*Dashboard.tsx`: role dashboards (admin, mentor, student)

## Key Modules
- Auth: `backend/src/controllers/auth.js`, `backend/src/middleware/auth.js`, `src/context/AuthContext.tsx`, `src/components/auth/ProtectedRoute.tsx`
- Dashboards: `src/pages/AdminDashboard.tsx`, `src/pages/MentorDashboard.tsx`, `src/pages/StudentDashboard.tsx`
- Course + enrollment: `backend/src/controllers/courses.js`, `backend/src/controllers/student.js`, `backend/src/models/Enrollment.js`
- Admin operations: `backend/src/routes/admin.js`, `backend/src/controllers/admin.js`
- Payment: `backend/src/controllers/payment.js`, `src/pages/Checkout.tsx`

## Verified Request Lifecycle
`React page/context -> src/services/api.ts -> Express route -> controller -> Mongoose model`

Example mappings:
- Student dashboard: `src/pages/StudentDashboard.tsx` -> `api.student.getEnrolledCourses()` -> `GET /api/v1/student/courses` -> `backend/src/controllers/student.js#getEnrolledCourses` -> `Enrollment` + `Course`
- Admin users table: `src/pages/AdminDashboard.tsx` -> `GET /api/v1/admin/users` -> `backend/src/controllers/admin.js#getUsers` -> `User`
- Mentor course CRUD: `src/pages/MentorDashboard.tsx` -> `POST/DELETE /api/v1/courses` -> `backend/src/controllers/courses.js` -> `Course`

## Evidence Ledger
| Finding | Evidence (file/endpoint/runtime) | Impact | Severity | Fix hint |
|---|---|---|---|---|
| Frontend route guard is auth-only, not role-aware | `src/components/auth/ProtectedRoute.tsx:10-20` | Relies on per-page redirects; inconsistent role enforcement in UI | High | Add role-aware guard contract and route metadata |
| Backend role protection exists on admin/mentor routes | `backend/src/routes/admin.js:19-20`, `backend/src/routes/courses.js:23,28-29` | Server-side authorization is mostly enforced correctly | Medium | Keep backend as source of truth; align frontend UX |
| Frontend-backend integration uses expected proxy | `vite.config.ts:17-19`, runtime `proxy_courses_success=true` | Confirms integration path works in dev | Low | Keep target configurable and validated in startup checks |
| Runtime confirms core API health and role checks | `tmp/runtime-results.json` (`backend_up=true`, `student_admin_users_blocked=true`) | Core platform functionality is operational | Low | Add automated regression tests for this matrix |
