# Core Module Progress Report (Milestone 1)

_Last updated: 2025-12-05_

This document tracks the Core Module refactor (Milestone 1), mirroring the structure of `R0-auth-project-task.md` with capability snapshots, specs, and dependency-ordered WBS.

---

## Product Feature Spec

### Core foundations (NestJS monorepo)

| Feature / capability | Status | Notes |
| --- | --- | --- |
| Core package scaffold (`@app/core`) | ⏳ Planned | Workspace package with its own tsconfig/build, semver versioning, and changelog; consumable by backend/admin/cms without cycles. |
| Config system | ⏳ Planned | Central `ConfigModule` with schema validation (Zod/Joi), environment profiles (dev/stage/prod), and typed getters to replace scattered dotenv usage. |
| Database layer (Drizzle) | ⏳ Planned | `DatabaseModule` wrapping Drizzle connection, migrations runner, transaction helper, and `BaseRepository`/`BaseEntity` for shared CRUD patterns. |
| Logger & error handling | ⏳ Planned | `CoreLogger`, JSON/text output, `LoggingInterceptor`, and `GlobalExceptionFilter` enforcing a unified response envelope. |
| Auth base (non-RBAC) | ⏳ Planned | `AuthBaseModule` with `@CurrentUser()` decorator, `AuthGuardBase`, session context helpers, and Role/Permission extension points compatible with existing auth tokens. |
| Shared utilities | ⏳ Planned | Pagination/date utilities, ID generator (UUID/ULID), response builder helpers, and string utils kept small to avoid toolbox bloat. |
| Documentation & DX | ⏳ Planned | `CORE_GUIDE.md` showing module boundaries, dependency rules, and how to consume/extend core modules across apps. |
| Auth UX polish (login/logout/reset) | ⚠️ Needs Fixes | Improve form flows, SSR guards, refresh cookie handling, and error surfaces so auth from Milestone 0 feels production-ready before Core rollout. |

### Overall status snapshot

- ⏳ **In Progress / Planned:** Core package scaffold, config system, Drizzle layer, logging/error stack, auth base scaffolding, shared utils, developer guide.
- ❌ **Not Started:** Integration into downstream modules (admin/cms) and release of `core` v0.1.0; no PRs opened yet.

---

## Tech Spec — Core Architecture

### Packaging & versioning
- Publishable workspace package `@app/core` with semver; `CHANGELOG.md` maintained alongside package.json.
- Enforce dependency direction: feature modules → core only; lint/dep graph blocks cross-feature imports.
- Provide entrypoints per submodule (`core/config`, `core/db`, `core/logger`, `core/auth-base`, `core/utils`).

### Config system
- Single `ConfigModule` sourcing envs; validation via schema (e.g., `z.object`); supports dev/stage/prod profiles.
- Typed getters: `config.get('database').url`, `config.get('smtp').host`, etc.; removes direct `process.env` access.
- Centralized error messages for missing/invalid envs; safe defaults for local dev.

### Database layer (Drizzle)
- `DatabaseModule` exposes Drizzle client, migration runner, and transaction helper.
- `BaseEntity` fields: `id`, `createdAt`, `updatedAt`; optional soft-delete support.
- `BaseRepository<T>`: `findById`, `findAll`, `create`, `update`, `delete`, plus typed query helpers; composable with feature schemas.
- Schema ownership stays within domains; core only provides tooling and base patterns.

### Logger & error handling
- `CoreLogger` with JSON/text transports; env-driven log level.
- `GlobalExceptionFilter` normalizes responses to `{ statusCode, message, error?, data?, timestamp, path }`.
- `LoggingInterceptor` for request/response metrics; hooks for future audit sinks.

### Auth base (non-RBAC)
- `AuthBaseModule` exports `@CurrentUser()` decorator, `AuthGuardBase`, and `UserIdentity` contract aligned with existing auth tokens.
- Guard accepts pluggable role/permission check to be extended by future RBAC without breaking current auth.
- Session context helpers to extract user/session from request scope and share across modules.
- UX bridge items from Milestone 0: fix SSR-safe guards, refresh-cookie retry, logout robustness, and reset-password form UX so existing auth is stable before Core adoption.

### Shared utilities
- Pagination helper (page/limit/offset + metadata), date/time formatting helpers, ID generator (UUID/ULID), response builder.
- Keep scope lean; expand utilities only when adopted by ≥2 modules to avoid toolbox creep.

### Documentation & DX
- `CORE_GUIDE.md`: how to add submodules, dependency rules, integration samples for backend/admin/cms.
- Recipes for env setup, migration execution, logging config, and auth-guard extension.

---

## TODO (WBS) — ordered by dependency

- [ ] [core] Scaffold `@app/core` workspace package with build/tsconfig, lint/test hooks, semver + `CHANGELOG.md`.
- [ ] [config] Implement `ConfigModule` with schema validation and typed getters; refactor existing env usage to consume it.
- [ ] [db] Add `DatabaseModule` wrapping Drizzle client/migrations, transaction helper, and `BaseRepository/BaseEntity`.
- [ ] [logging] Ship `CoreLogger`, `LoggingInterceptor`, and `GlobalExceptionFilter` that enforce the unified response envelope.
- [ ] [auth-base] Introduce `AuthBaseModule` with `@CurrentUser()` decorator, `AuthGuardBase`, and session context helpers wired to existing auth tokens.
- [ ] [utils] Publish shared utilities (pagination, date/time, ID generator, response builder) behind stable entrypoints.
- [ ] [dx/docs] Write `CORE_GUIDE.md` covering module boundaries, dependency rules, and integration examples; validate by importing core from admin/cms without cycles.
- [ ] [release] Produce `core` v0.1.0 tag/release after smoke-testing downstream consumers (admin, cms, backend) on the new core artifacts.
- [ ] [auth-ux] Polish login/logout/reset flows: SSR-safe guard, refresh retry with HttpOnly cookie, consistent error states, and improved UI feedback; backfill tests to stop regressions when Core lands.

---

## Working Diary

- _No entries yet for Milestone 1; populate as implementation starts._
