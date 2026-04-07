# CourseVisa Auth and Role Flow Analysis

## JWT Flow Audit
1. Login (`POST /api/v1/auth/login`) validates email/password and issues JWT.
2. Frontend stores token in `localStorage` (`auth_token`) via `AuthContext`.
3. Protected API requests use `Authorization: Bearer <token>`.
4. Middleware `protect` verifies JWT and loads user by ID.
5. Backend `authorize(...roles)` enforces role policy on restricted routes.

Runtime checks confirmed valid token behavior (`auth_me_success=true`) and backend role enforcement on admin endpoint (`student_admin_users_blocked=true`, `403`).

## Google OAuth Audit
- Frontend uses Google access token flow (`useGoogleLogin`) and posts token to backend.
- Backend calls Google userinfo endpoint and creates/finds local user.
- Invalid Google token rejection confirmed at runtime (`401`).
- Full real browser OAuth success path was not executed in this run.

## Role-Based Access Control Audit
- Backend RBAC is present and effective on admin/courses/mentor stats routes.
- Frontend route guard is auth-only and does not accept `allowedRoles`.
- Role redirection logic is duplicated in dashboard pages rather than centralized at route boundary.

## Critical Auth/RBAC Findings
| Finding | Evidence (file/endpoint/runtime) | Impact | Severity | Fix hint |
|---|---|---|---|---|
| Suspended users can still log in | Runtime: `admin_suspend_user_success=true` then `suspended_user_still_can_login=true`; login logic in `backend/src/controllers/auth.js` has no status gate | Admin suspension ineffective | Critical | Block login when `user.status !== 'active'` |
| Suspended users can still call protected APIs | Runtime: `suspended_user_still_can_access_student_api=true`; `backend/src/middleware/auth.js` does not check status | Suspended accounts retain access after token issuance | Critical | Enforce active status in `protect` middleware on every request |
| Frontend protected routes are not role-aware | `src/components/auth/ProtectedRoute.tsx:10-20`, `src/App.tsx:87-107` | Inconsistent role UX and potential accidental privileged page exposure | High | Add role-aware `ProtectedRoute` contract with `allowedRoles` |
| Password reset token is returned directly by API | `backend/src/controllers/auth.js:249-252` | Token exposure risk outside pure demo environments | High | Production mode should send token via email only |
| Google OAuth implementation has noisy logs and unused client instance | `backend/src/controllers/auth.js` (`OAuth2Client` unused) | Operational noise and maintainability issues | Medium | Clean implementation and reduce sensitive/debug logging |

## Concrete Bypass/Logic Flaw Paths
1. **Suspension bypass:** Admin suspends user -> user still logs in with password -> JWT minted -> protected student routes still accessible.
2. **Frontend role routing gap:** Any authenticated user can attempt direct `/admin` or `/mentor-dashboard`; page scripts redirect, but route-level policy is not centralized.

## Recommended Auth Contract (Target)
- Login contract: only `active` users receive tokens.
- Protect contract: reject tokens for non-active users.
- Frontend route contract: `ProtectedRoute({ allowedRoles })` with deny-by-default.
- Reset-password contract: never return raw reset token in production mode.
