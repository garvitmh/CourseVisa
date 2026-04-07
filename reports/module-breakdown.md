# CourseVisa Module Breakdown Report

## Module Inventory

### Authentication and Session
- Frontend: `src/context/AuthContext.tsx`, `src/components/auth/*`
- Backend: `backend/src/controllers/auth.js`, `backend/src/middleware/auth.js`, `backend/src/routes/auth.js`
- Responsibility: registration/login/JWT/profile/password reset/Google OAuth

### Role and Authorization
- Backend policy: `authorize(...roles)` middleware and protected route groups
- Frontend policy: generic `ProtectedRoute` (auth-only) + page-level role redirects

### Catalog and Learning
- Courses: `backend/src/controllers/courses.js`, `src/pages/Courses.tsx`, `src/pages/CourseDetail.tsx`
- Student progress/enrollment: `backend/src/controllers/student.js`, `backend/src/models/Enrollment.js`
- Quiz: `backend/src/controllers/quiz.js`, `src/pages/QuizView.tsx`

### Dashboard Operations
- Admin: users/courses/applications/enrollments management
- Mentor: own course management + stats + application-related UX
- Student: enrolled courses, progress, certificate UX

### Payments
- Backend: create-order, verify, simulate (`backend/src/controllers/payment.js`)
- Frontend: simulated checkout flow (`src/pages/Checkout.tsx`)

### Data Layer
- Core models: `User`, `Course`, `Book`, `MentorApplication`, `Enrollment`, `Quiz`, `QuizAttempt`
- Seed: deterministic dev data in `backend/seeder.js`

## Integration Quality by Module
| Module | Current State | Notes |
|---|---|---|
| Auth core (JWT) | Functional | Runtime login/me checks pass |
| Google OAuth | Partially functional | Invalid token rejection works; full real OAuth browser flow not fully exercised in this run |
| Backend RBAC | Functional | Admin/mentor route guards enforced server-side |
| Frontend RBAC | Partial | Shared route guard lacks role awareness |
| Dashboard data feeds | Mixed | Core APIs are real; some dashboard panels are placeholders |
| Payment | Demo-centric | Simulated enrollment path active |
| Type consistency | Weak | Numeric cart IDs and Mongo string IDs mixed via `any` |

## Evidence Ledger
| Finding | Evidence (file/endpoint/runtime) | Impact | Severity | Fix hint |
|---|---|---|---|---|
| Frontend route guarding is not moduleized for roles | `src/components/auth/ProtectedRoute.tsx`, `src/App.tsx` | Repeated per-page role logic, brittle UX | High | Implement role-aware route contract |
| Type contract mismatch across modules | `src/types/index.ts` + `src/context/CartContext.tsx` + pages using `_id` | Cart/enrollment integrations rely on weak typing | High | Normalize all entity IDs to string |
| Mock/dead module residue exists | `src/types/mockData.ts`, `src/constants/index.ts:143` | Confusing source of truth and maintenance overhead | Medium | Remove dead mock module or hard-gate behind env mode |
| Duplicate/unused model present | `backend/src/models/Application.js` (unused) | Raises maintenance and schema drift risk | Medium | Delete or merge with `MentorApplication` model |
| Payment module mixes real and mock semantics | `backend/src/controllers/payment.js`, `src/pages/Checkout.tsx` | Production correctness risk | Critical | Separate `simulate` into dev-only module and lock production path |
