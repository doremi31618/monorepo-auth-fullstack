# Auth Module Progress Report

_Last updated: 2025-11-08_

This document summarizes the current implementation status of the authentication experience across the **backend (NestJS)** and **frontend (SvelteKit)** projects, and highlights the remaining gaps required to support the planned flows (email/password + Google SSO + password reset).

---

## Backend Status (NestJS)

| Feature / capability | Status | Notes |
| --- | --- | --- |
| Email/password signup (`POST /auth/signup`) | ✅ Implemented | `AuthController.signup` delegates to `AuthService.signup`, which rejects duplicate emails, hashes passwords with bcrypt, and stores users via `UserRepository`. Sessions are created immediately after signup. |
| Email/password login (`POST /auth/login`) | ✅ Implemented (buggy) | `AuthService.login` validates email and password, then issues a session token via `SessionRepository`. The service currently creates the session **before** verifying the password, which leaves orphaned sessions for failed logins. |
| Session persistence | ⚠️ Partial | `SessionRepository` stores `userId`, random token, and expiry in Postgres. There is no endpoint to read/delete sessions, no cookie issuance, and the token is only returned inside the login/signup response body. |
| Session cleanup cron | ⚠️ Not wired | `SessionCleanupService` defines a `@Cron` job, but `ScheduleModule.forRoot()` is never imported, so the cleanup task never runs. |
| Logout / session revocation (`POST /auth/signout`) | ❌ Missing | No controller/service code removes sessions or invalidates tokens. Frontend expects `/auth/signout`. |
| Token refresh (`POST /auth/refresh`) | ❌ Missing | There is no refresh-token concept on the backend, but the frontend store and API wrappers already assume one. |
| Google SSO | ❌ Missing | No OAuth credentials, controllers, or service logic exist for Google sign-in. |
| Password reset / forgot password | ❌ Missing | No endpoints or infrastructure for reset tokens or emails. |
| API base URL alignment | ⚠️ Misconfigured | Backend boots on port `3000` (`src/main.ts`), while the frontend `AppConfig` hardcodes `http://localhost:3333`, so requests currently target the wrong port. |
| SMTP integration testing | ⚠️ Opt-in only | Added `src/mail/jtest.spec.ts`, which sends a real SES email when `RUN_SMTP_TEST=true`. `.env` loading is commented out and credentials are shared with production keys, so the spec is currently disabled by default. |

### Backend follow-up items

1. Add `ScheduleModule.forRoot()` to `AppModule` to enable cron jobs, or remove the unused service.
2. Re-order `AuthService.login` to verify the password before creating a session token.
3. Decide on session/token strategy (JWT vs opaque token) and add logout + refresh endpoints that match the frontend contract.
4. Implement Google OAuth endpoints (e.g., `/auth/google` + callback) and persist federated identities.
5. Add password-reset initiation & confirmation endpoints if that flow is required.

---

## Frontend Status (SvelteKit)

| Feature / capability | Status | Notes |
| --- | --- | --- |
| Navigation layout | ✅ Basic | `src/routes/+page.svelte` renders links for Home/Login/Signup via `AppConfig.route`. |
| Login page UI | ✅ Static | `auth/login/+page.svelte` displays `LoginForm`, but the form only contains uncontrolled inputs and has no submit handler or validation. |
| Signup page UI | ✅ Static | `auth/signup/+page.svelte` renders `SignupForm` with fields but no logic. |
| Auth API client layer | ⚠️ Partial | `lib/api/httpClient.ts` & `lib/api/auth.ts` define helpers, but they hardcode the wrong base URL (`http://localhost:3333/`), always attach `Authorization: Bearer ${token}` (even when null), and expect backend routes `/auth/register`, `/auth/signout`, `/auth/refresh` that do not exist. |
| Auth store (`lib/store/authStore.ts`) | ⚠️ Partial | Store exposes `login/register/logout/refresh`, but it always starts with `null` state (storage hydration commented out) and is never wired to the forms or routes. |
| Google SSO UI | ❌ Missing | The Google button is commented out in both login & signup forms, and there is no handler/OAuth flow. |
| Password reset UI | ❌ Missing | Login form links to `#` for “Forgot your password?”; no page, route, or API exists. |
| Session handling | ❌ Missing | No route guards, no cookie handling, and `httpClient` stores tokens in `localStorage` without SSR guards on read. |

### Frontend follow-up items

1. Connect `LoginForm` and `SignupForm` to the `authStore` (or mutate via `enhance`) so submissions call the backend.
2. Align API paths & payloads with the backend (`/auth/signup` vs `/auth/register`, etc.) or update backend routes accordingly.
3. Implement Google SSO: render the button, initiate OAuth (likely via backend redirect), and handle the callback to store the session.
4. Build password reset pages (request + reset) once backend endpoints exist.
5. Hydrate auth state from storage on load and guard `httpClient` access to `localStorage` behind `browser` checks.

---

## Overall Progress Snapshot

- ✅ **Completed:** Basic email/password signup & login APIs, session persistence layer, static frontend pages/components, initial store/httpClient scaffolding. Added opt-in SMTP Jest spec plus DI-safe controller/service unit tests that now mock repositories/services.
- ⚠️ **In Progress / Needs Fixes:** Session lifecycle (cleanup cron, logout, refresh), API route alignment, auth store wiring, base URL mismatch, reliable environment handling for SMTP tests.
- ❌ **Not Started:** Google SSO (backend & frontend), password reset flow, frontend form submission/validation, user session UX (loading states, error handling).

Addressing the ⚠️ / ❌ items above will bring the implementation in line with the intended UX (email authentication + Google SSO + reset password) and make the front/back contracts consistent.
