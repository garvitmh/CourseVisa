# CourseVisa Priority Fix Plan

## Objective

Stabilize live demo reliability first, then close high-impact security and data-consistency gaps, while preserving current working flows.

## Fix Now (Critical for Demo and Security)

## 1) Enforce account status in auth/session path

Why:
- Suspension currently has no effect (`suspended_user_still_can_login=true`).

Code-level targets:
- `backend/src/controllers/auth.js` (`exports.login`, `googleLogin`)
- `backend/src/middleware/auth.js` (`protect`)
- `backend/src/models/User.js` (`status` already exists)

Implementation:
1. Block login for non-`active` users.
2. In `protect`, reject requests when loaded user status is not `active`.
3. Return consistent `403` with explicit status reason.

Acceptance:
- Suspended user cannot login.
- Existing token for suspended user cannot access protected routes.

## 2) Add role-aware frontend route contract

Why:
- `ProtectedRoute` only checks auth, causing role-route bounce UX.

Code-level targets:
- `src/components/auth/ProtectedRoute.tsx`
- `src/App.tsx`
- `src/components/shared/Navbar.tsx`

Implementation:
1. Extend guard props to include `allowedRoles?: Array<'admin'|'mentor'|'student'>`.
2. Apply role restrictions directly in route definitions.
3. Keep page-level checks as defensive fallback, then simplify after verification.

Acceptance:
- Wrong-role navigation to `/admin` and `/mentor-dashboard` redirects cleanly without intermediate render.

## 3) Lock password reset token handling

Why:
- Reset token is currently returned in API response.

Code-level targets:
- `backend/src/controllers/auth.js` (`forgotPassword`)

Implementation:
1. Remove `resetToken` from response payload outside explicit dev-only mode.
2. Return generic success message.
3. Add environment-gated fallback for local demo only if needed.

Acceptance:
- API no longer leaks reset token in production-like mode.

## Fix Next (High Product Integrity)

## 4) Normalize ID contracts across frontend/backend

Why:
- Frontend uses `number` IDs, backend uses ObjectId strings.

Code-level targets:
- `src/types/index.ts`
- `src/context/CartContext.tsx`
- `src/pages/CourseDetail.tsx`
- `src/pages/Books.tsx`
- `src/pages/BookDetail.tsx`

Implementation:
1. Convert `Course.id` and `CartItem.courseId` to `string`.
2. Update `isInCart`, add/remove/update comparisons to string IDs.
3. Remove `as any` casts where possible by aligning DTO shapes.

Acceptance:
- Cart, checkout, and enrollment flows work without ID coercion edge cases.

## 5) Split payment mode contract (`simulate` vs real)

Why:
- Demo simulation and real-payment semantics are mixed.

Code-level targets:
- `backend/src/controllers/payment.js`
- `backend/src/routes/payment.js`
- `src/pages/Checkout.tsx`
- `src/services/api.ts`

Implementation:
1. Introduce explicit `PAYMENT_MODE` env contract.
2. In `mock` mode, keep `/simulate` and clear UI labeling.
3. In `razorpay` mode, require `/create-order` + `/verify` path and disable simulate CTA.

Acceptance:
- Payment behavior is deterministic by environment.
- Demo and production behavior are clearly separated.

## 6) Fix mentor application resume persistence

Why:
- Resume upload likely not persisted to model field.

Code-level targets:
- `backend/src/controllers/mentor.js`
- `backend/src/middleware/upload.js`
- `backend/src/models/MentorApplication.js`

Implementation:
1. Map uploaded file metadata to `resumeUrl`.
2. Store and return persisted resume path.
3. Add validation when resume is required.

Acceptance:
- New mentor applications include valid resume URL/path in DB.

## Defer (After Demo Stabilization)

- Replace placeholder mentor analytics with real aggregated metrics.
- Replace certificate alert with real certificate generation/download service.
- Remove dead mock modules and unused model files.
- Reduce lint warnings and tighten TS strictness progressively.
- Add observability and audit logging for admin/auth/payment paths.

## API/Type Contracts to Freeze

1. `ProtectedRoute` contract: `children + allowedRoles`.
2. Frontend entity IDs: string-based ObjectId alignment.
3. Payment contract: explicit environment mode and endpoint behavior.
4. Auth contract: suspended users blocked at login and token-protected routes.

## Suggested Execution Order

1. Auth status enforcement.
2. Role-aware route guard.
3. Password reset token handling.
4. ID normalization.
5. Payment mode split.
6. Mentor resume persistence.
7. Placeholder-to-real dashboard improvements.

## Validation Checklist

- Runtime auth/role checks using seeded users.
- Dashboard access behavior per role from direct URL and navbar path.
- Checkout enrollment behavior in mock mode.
- Lint/type-check pass criteria for changed files.
