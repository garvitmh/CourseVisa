# CourseVisa UX and Flow Consistency Report

## Evaluated Journeys
- Student: Login -> `/dashboard` -> course learning -> checkout -> enrollment
- Mentor: Login -> `/mentor-dashboard` -> create/delete course -> stats tab
- Admin: Login -> `/admin` -> user/app/course/enrollment operations

## Journey Map: Student
- Entry and auth are clear and functional.
- Dashboard fetches real enrolled data and progress.
- Certificate path is placeholder (alert-driven “production app would download PDF”).
- Checkout is explicitly simulation-based; successful for demo but not production-grade trust flow.

## Journey Map: Mentor
- Mentor role can access dashboard and manage own courses.
- Stats endpoint works, but analytics section is marked “Coming Soon”.
- Flow is functional but includes unfinished product surfaces.

## Journey Map: Admin
- Admin can load user/course/application/enrollment tables and apply mutations.
- Flow is operational, but pagination UI is explicitly mock-only.

## UX Consistency Findings
| Finding | Evidence (file/endpoint/runtime) | Impact | Severity | Fix hint |
|---|---|---|---|---|
| Role routing logic is fragmented | Global guard auth-only + page-local role redirects | Inconsistent and harder-to-maintain navigation policy | High | Centralize role-based route guarding |
| Placeholder modules appear in core dashboards | Mentor analytics, student certificate download, admin pagination footer | Demo can feel prototype-like under scrutiny | Medium | Mark clearly as beta or implement minimal backend-backed versions |
| Payment journey uses simulation messaging | `src/pages/Checkout.tsx` explicit simulated gateway copy | May reduce trust in real-product perception | High | Add env-based behavior and production-appropriate payment states |
| Demo credentials shown on login screen | `src/components/auth/LoginForm.tsx:124-126` | Can be useful for demos but weakens production polish/security posture | Low | Gate by environment or hide in production |
| Post-auth destination is generic | Login/signup redirect to `/` by default | Extra clicks to role dashboard | Medium | Route users directly to role-appropriate dashboard after auth |

## Coursera/Udemy-Level Gap Snapshot
- Missing: cohesive role-aware route orchestration, production payment confidence cues, complete analytics/certificate features.
- Present: real data-backed catalog and dashboard cores, role-protected backend APIs, working CRUD paths.

## Practical UX Improvements (Demo-First)
1. Route users after login by role (`admin` -> `/admin`, `mentor` -> `/mentor-dashboard`, `student` -> `/dashboard`).
2. Replace placeholder sections with either minimal functional versions or explicit “Beta” badges.
3. Add consistent error/loading states across dashboards and actions.
4. Move simulation wording behind non-production environment checks.
