以下是 重新整理後的新版文件，
對齊 R1-core 需求，並加入「開發規範文件」作為必交付項。

你可以直接取代原本的文件。

⸻

Core Module Progress Report (Milestone 1)

Last updated: 2025-12-05

This document tracks the R1-core refactor（Domain Core + Infra Core + Nx），並包含新增的開發規範交付物。

⸻

🎯 Acceptance Criteria（R1-core）

1. Core 結構與邊界：backend/src/core 下完成 core/domain/user（schema/repo/service/IUserService）與 core/infra（config/db/logger/auth-base/utils）；Feature → Domain → Infra；禁止 Feature 直接使用 core/infra/db/schema.ts；Nx graph 無循環依賴。
2. Config system：schema 驗證、typed getter、移除隨處 process.env。
3. Database layer：BaseEntity、BaseRepository、transaction helper；User domain fully on BaseRepository；Schema 按 Domain/Infra/Feature 分層；Drizzle aggregator 只收集 schema。
4. Logger & Error：JSON logger；GlobalExceptionFilter；LoggingInterceptor。
5. Auth Base：IUserService + UserIdentity；AuthGuardBase；@CurrentUser decorator；正確依賴 UserService（Domain Core）。
6. Shared utilities：pagination/date/id 等至少被兩個 module 使用。
7. Nx Workspace：Nx init；backend/frontend apps；tags scope:domain-core / scope:infra-core / scope:feature；Nx graph 驗證依賴方向。
8. CI/CD（Nx runner）：build/test/lint 改用 Nx；啟用 Nx cache；預留 nx affected。
9. 開發規範文件：DEVELOPMENT_GUIDE.md，含 Schema Ownership、Module Boundary、命名/結構、DI 原則、禁止 import aggregator schema、Commit/PR checklist、如何新增 domain/feature module。

⸻

Product Feature Spec

| Feature / capability | Status | Notes |
| --- | --- | --- |
| Core structure (Domain + Infra) | ⏳ Planned | backend/src/core split into core/domain and core/infra with enforced boundaries. |
| Domain Core (User) | ⏳ Planned | User schema/repository/service; implements IUserService for AuthBase and feature modules. |
| Config system | ⏳ Planned | ConfigModule with schema validation, environment profiles, typed getters; no direct process.env. |
| Database layer (Drizzle) | ⏳ Planned | DatabaseModule, Drizzle setup, BaseEntity/BaseRepository, runInTransaction; schema split by layer; aggregator only for DB client/migration. |
| Logger & error handling | ⏳ Planned | JSON logger, LoggingInterceptor, GlobalExceptionFilter with unified envelope. |
| Auth base (non-RBAC) | ⏳ Planned | UserIdentity, IUserService token, AuthGuardBase, @CurrentUser decorator; Domain Core supplies IUserService. |
| Shared utilities | ⏳ Planned | Pagination/date/id utilities reused by ≥2 modules. |
| Nx Workspace (backend + frontend) | ⏳ Planned | Nx init; apps registered; tags scope:infra-core/scope:domain-core/scope:feature; lint boundary rules. |
| CI/CD on Nx | ⏳ Planned | CI pipeline uses nx build/test/lint; Nx cache enabled; nx affected wired for future use. |
| Development guidelines | ⏳ Planned | DEVELOPMENT_GUIDE.md covering schema ownership, module boundaries, DI, naming/structure, PR checklist. |

⸻

Overall status snapshot
 • ⏳ In Progress / Planned: Domain Core（User）、Infra Core（config/db/logger/auth-base/utils）、Nx init + boundary lint、DEVELOPMENT_GUIDE、CI migration to Nx。
 • ❌ Not Started: Core extraction to shared library（future milestone）、downstream integrations、release tagging。

⸻

Architecture & governance（R1-core alignment）

Core layering
 • Feature Modules → Domain Core → Infra Core
 • Domain Core consumes Infra Core；Feature Modules consume Domain Core；no upward dependencies。

Schema ownership
 • Domain schemas：core/domain/...
 • Infra schemas：core/infra/...
 • Feature schemas：modules/<feature>/...
 • Each schema owned by its module；domain schema 不放在 feature；infra schema 僅提供底層支援。

Drizzle schema aggregator
 • core/infra/db/schema.ts 只提供給 Drizzle client/migration。
 • 不 export *；不是 feature 的 entry point；禁止外部依賴 aggregator。

Nx tags & boundary rules
 • core/infra/* → scope:infra-core
 • core/domain/* → scope:domain-core
 • modules/* → scope:feature
 • Rules: feature → domain/infra；domain-core → infra；infra-core → no domain/feature。

Packaging strategy
 • Milestone 1：Core 保留在 backend/src/core。
 • Future milestone：第二個 backend 出現後再抽成共享 library（libs/core 或 @app/core）。

⸻

TODO (WBS) — ordered by dependency

Infra Core foundation
 • [infra/config] ConfigModule with schema validation, typed getters; remove direct env access.
 • [infra/db] Drizzle setup, BaseEntity/BaseRepository, runInTransaction; layered schemas; aggregator limited to DB usage.
 • [infra/logger] JSON CoreLogger, LoggingInterceptor, GlobalExceptionFilter.
 • [infra/auth-base] UserIdentity, IUserService token, AuthGuardBase, @CurrentUser decorator.
 • [infra/utils] Shared utilities (pagination/date/id) reused across modules.

Domain Core (User)
 • [domain/user] UserEntity schema; UserRepository extends BaseRepository; UserService implements IUserService.

Integration: CoreModule
 • Wire Infra Core + Domain Core under CoreModule; replace ad-hoc infra usage in backend modules。

Nx Workspace
 • nx init; register backend/frontend apps.
 • Add tags scope:infra-core / scope:domain-core / scope:feature and lint boundary rules; validate with nx graph.

Documentation & governance
 • Write DEVELOPMENT_GUIDE.md（schema ownership、module boundaries、DI、命名/結構、commit/PR checklist、how to add domain/feature modules）。
 • Add boundary lint checks to CI.

CI/CD migration to Nx
 • Switch CI jobs to nx build/test/lint; enable Nx cache; add nx affected pipeline scaffold.

Release milestone
 • Tag core v0.1.0 after acceptance checks; smoke test core usage in backend modules.

⸻

Deliverables
 • Domain Core + Infra Core structure in backend/src/core.
 • Layered schema governance（domain/infra/feature）+ Drizzle aggregator in core/infra/db/schema.ts.
 • Nx workspace with tags + boundary lint + graph validation.
 • CI/CD using Nx runner + cache; nx affected ready.
 • DEVELOPMENT_GUIDE.md covering project conventions.
 • Core v0.1.0 baseline.

⸻

Roadmap position
| Milestone | 名稱 | 狀態 | 內容摘要 |
|-----------|------|--------|------------|
| **1** | Core（Domain + Infra）建立、Schema 治理、Nx 初始化 | ⏳ 進行中 | Core 架構重整、DB Schema Boundary、Nx、CI/CD、開發規範 |

⸻

Working Diary

No entries yet for Milestone 1; populate as implementation progresses.
