# CourseVisa Data Integrity Report

## Real Data Coverage Table
| Surface | Data Source | Status | Evidence |
|---|---|---|---|
| Courses listing/detail | MongoDB via `/api/v1/courses` | Real | `src/pages/Courses.tsx`, `src/pages/CourseDetail.tsx`, runtime `proxy_courses_count=21` |
| Books listing/detail | MongoDB via `/api/v1/books` | Real | `src/pages/Books.tsx`, `src/pages/BookDetail.tsx` |
| Student dashboard enrollments | MongoDB via `/api/v1/student/courses` | Real | `src/pages/StudentDashboard.tsx`, runtime enrollment `0 -> 1` |
| Admin dashboard tables | MongoDB via `/api/v1/admin/*` | Real | `src/pages/AdminDashboard.tsx`, runtime `admin_users_success=true` |
| Mentor stats | MongoDB aggregate style endpoint | Real (core), synthetic rating field | `backend/src/controllers/mentor.js#getMentorStats` |
| Checkout payment completion | Simulated API | Mock/Simulated | `src/pages/Checkout.tsx`, `backend/src/controllers/payment.js#simulatePayment` |
| Forgot password token handling | API returns token in response | Demo behavior | `backend/src/controllers/auth.js:249-252` |
| Mentor analytics tab | Hardcoded placeholder copy | Placeholder | `src/pages/MentorDashboard.tsx:448-449` |
| Student certificates action | Alert-based fake action | Placeholder | `src/pages/StudentDashboard.tsx:215` |
| Admin pagination footer | Mock footer controls | Placeholder | `src/pages/AdminDashboard.tsx:395-401` |

## Hardcoded/Static/Mock Detection
- `src/types/mockData.ts` contains large static datasets (`coursesDB`, `subjectsDB`) that are currently dead/unused in the main runtime path.
- `src/constants/index.ts:143` has `useMockData: ... || true`, which forces true and creates configuration ambiguity.
- Login UI includes static demo credentials block (`src/components/auth/LoginForm.tsx:124-126`).
- Checkout explicitly describes simulated payment and routes through simulation endpoint.

## Dynamic API Verification
- Dev proxy and backend were both live during runtime checks: frontend status `200`, backend status healthy, proxy requests successful.
- Core DB-backed role dashboards and CRUD endpoints returned valid data and state transitions.

## Data Integrity Risks
| Finding | Evidence (file/endpoint/runtime) | Impact | Severity | Fix hint |
|---|---|---|---|---|
| Simulation endpoint grants enrollments directly | `backend/src/controllers/payment.js:95-127`, runtime `enrollment_created_via_simulate=true` | High risk of demo logic leaking into production behavior | Critical | Environment-gate `simulate` and enforce real payment verification path |
| Mock config default is effectively always on | `src/constants/index.ts:143` | Misleading source-of-truth and risk of accidental mock usage | High | Replace with explicit environment mode and fail-safe defaults |
| Placeholder dashboard sections mixed with real data | Mentor analytics, student certificates, admin mock pagination | Product appears partially fake during demos | Medium | Label placeholders or implement minimal backend-backed versions |
| Mentor resume upload path not persisted cleanly | Route uses multer but controller stores `req.body` only | Upload metadata/data loss risk | Medium | Persist file URL/path and normalize response contract |
| Dead static dataset module retained | `src/types/mockData.ts` | Maintenance overhead and confusion | Low | Remove or isolate under test fixture namespace |
