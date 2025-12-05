以下是 最終 Markdown 版本，
已包含你新增的目標：「建立專案開發規範（確保架構規則可持續遵守）」。

你可以 直接複製貼到 GitHub / Notion / Confluence，排版完全正確。

⸻

# 🧱 Milestone 1 — Core 建立（Domain Core + Infra Core）與 Nx Workspace 初始化

Updated: 2025-12-05

⸻

## 🎯 Goal（目標）

建立一套可長期維護與擴展的後端基礎架構，包括：

1. Domain Core（業務核心層）
	•	定義跨模組共享的核心資料模型（User / Tenant / Role / Course / Content）
	•	提供穩定、清楚的 interface 給 Feature modules 使用

2. Infra Core（技術基礎層）
	•	Config、DB、Logger、Auth Base、Utils 等公共技術能力
	•	完整抽象 Drizzle、config、logging、exception、transaction 等底層能力

3. Nx Workspace（1 backend + 1 frontend）
	•	建立 Module Boundary（Feature → Domain → Infra）
	•	提供未來擴展第二後端服務時可抽離 Core 的基礎

4. 建立專案開發規範（New） ⭐

確保本次架構重構後的規則能長期被遵守，包括：
	•	Schema Ownership 規範
	•	Module Dependency Boundary
	•	命名規範
	•	檔案結構標準化
	•	Code Review Checklist
	•	禁止 Feature 直接使用 aggregator schema
	•	Domain 專屬 interface（如 IUserService）治理

目標是：除了寫 code，更要確保 1 年後的團隊仍然能按照同樣的規範維護專案。

⸻

⸻

## ⚠️ Feasibility（核心設計與治理原則）

🔹 Core = Domain Core + Infra Core

Feature Modules  →  Domain Core  →  Infra Core

Domain Core
	•	承載最穩定的業務領域（User / Tenant / Course…）
	•	Feature Modules 不能跨依賴 Domain Modules

Infra Core
	•	Config, DB, Logger, Utils, Auth Base
	•	不可依賴 Domain Core

⸻

🔹 Schema Ownership（資料庫 schema 治理規範）⭐ 重點

| 類型 | 放置位置 | 範例 |
|------|-----------|--------|
| **Domain Schemas** | `core/domain/...` | `users`, `tenants`, `roles`, `courses` |
| **Infra Schemas** | `core/infra/...` | `sessions`, `system_mail`, `job_queue` |
| **Feature Schemas** | `modules/<feature>/...` | `cms_pages`, `learning_progress` |

規範：
•	每張 schema 由對應的 module 擁有
•	Feature modules 不能 import 全部 schema 的 aggregator
•	Domain schema 不能放在 Feature module
•	Infra schema 僅提供底層支援

⸻

🔹 Drizzle Schema Aggregator（內部使用）⭐

core/infra/db/schema.ts

功能：
•	收集所有 schema，給 Drizzle client & migration 用
•	內部工具，不公開給 Feature modules
•	不 export *
•	不允許其他地方依賴聚合 schema 作為 entry point

⸻

⸻

✅ Acceptance Criteria（驗收）

1. Core（Domain + Infra）結構完成

backend/src/core 包含：

Domain Core
•	core/domain/user/user.schema.ts
•	core/domain/user/user.repository.ts
•	core/domain/user/user.service.ts
•	定義 IUserService 給 AuthBase 使用

Infra Core
•	core/infra/config
•	core/infra/db（client + schema aggregator）
•	core/infra/logger
•	core/infra/auth-base
•	core/infra/utils（pagination/date/id）

Boundary 檢查：
•	Feature → Domain → Infra
•	禁止 Feature 直接使用 infra/db/schema.ts
•	Nx graph 驗證無循環依賴

⸻

2. Config System

完成：
•	Schema 驗證（Zod/Joi）
•	Typed getter（config.get()）
•	移除 process.env 隨處取值

⸻

3. Database Layer

完成：
•	BaseEntity / BaseRepository
•	Transaction Helper（runInTransaction）
•	User domain 完全使用 BaseRepository
•	Schema 按層分離（Domain / Infra / Feature）

Schema 驗收細項：
•	Domain schema 放在 domain
•	Infra schema 放在 infra
•	Feature schema 放在 feature module
•	Drizzle aggregator 只收集 schema，不被外部引用

⸻

4. Logger & Error

完成：
•	JSON Logger
•	GlobalExceptionFilter（統一格式）
•	LoggingInterceptor（duration / path）

⸻

5. Auth Base

完成：
•	IUserService（interface）
•	UserIdentity interface
•	AuthGuardBase
•	@CurrentUser decorator
•	AuthGuardBase 正確依賴 UserService（Domain Core）

⸻

6. Shared Utilities

完成並被至少兩個 module 使用。

⸻

7. Nx Workspace

完成：
•	Nx init
•	backend + frontend 註冊
•	core/domain, core/infra, feature modules 加上 Nx tags
```
scope:domain-core
scope:infra-core
scope:feature
```

•	nx graph 驗證依賴方向正確

⸻

8. CI/CD（Nx runner）

完成：
	•	build/test/lint 改用 Nx
	•	啟用 Nx Cache
	•	使用 nx affected（預留未來使用）

⸻

9. 開發規範文件（New）

產出 DEVELOPMENT_GUIDE.md：

內容包含：
	•	Schema Ownership 標準
	•	Module Boundary 規範（Feature → Domain → Infra）
	•	檔案命名與資料夾架構
	•	DI 注入原則（interface-driven）
	•	禁止 import aggregator schema
	•	Commit message / PR review checklist
	•	如何新增一個 domain／feature module


⸻

## 🎯 Strategy → Actions（行動計畫）

Strategy A — Core 分層與架構重建
	•	建立 core/domain & core/infra
	•	各自拆出 schema/repository/service
	•	設定 Nx tags & lint rules 防止錯誤依賴

⸻

Strategy B — Config System
	•	撰寫 config schema
	•	ConfigModule export typed getter

⸻

Strategy C — DB 層抽象化（含 Schema 治理）
	•	BaseRepository / BaseEntity
	•	拆解現有 schema.ts → Domain / Infra / Feature schema
	•	建立 core/infra/db/schema.ts 作為 aggregator（僅 Drizzle 使用）

⸻

Strategy D — Logging / Error
	•	GlobalExceptionFilter
	•	LoggingInterceptor

⸻

Strategy E — Auth Base
	•	IUserService
	•	UserIdentity
	•	AuthGuardBase
	•	@CurrentUser decorator

⸻

Strategy F — Nx Workspace
	•	Nx init
	•	設置 tags + lint rules
	•	nx graph 驗證邊界

⸻

Strategy G — CI/CD
	•	改用 Nx runner（build / test / lint）
	•	啟用 Nx Cache
	•	整合 nx affected

⸻

Strategy H — 專案開發規範（New） ⭐
	•	撰寫 DEVELOPMENT_GUIDE.md
	•	建立專案規範：
	•	schema ownership
	•	模組邊界（module boundaries）
	•	驗證 import hierarchy（Nx lint）
	•	優先使用 interface 注入
	•	目錄結構標準（Domain / Infra / Feature）
	•	PR review checklist
	•	在 CI 機制加入 lint boundary 驗證

⸻

📦 Deliverables（產出物）
	•	Domain Core + Infra Core 架構
	•	Schema 治理（domain / infra / feature）
	•	Drizzle aggregator（core/infra/db/schema.ts）
	•	Nx Workspace + tags + lint rules
	•	CI/CD（Nx runner）
	•	Core v0.1.0 baseline
	•	DEVELOPMENT_GUIDE.md（開發規範文件）

⸻

## 🧭 Roadmap 位置

| Milestone | 名稱 | 狀態 | 內容摘要 |
|-----------|------|--------|------------|
| **1** | Core（Domain + Infra）建立、Schema 治理、Nx 初始化 | ⏳ 進行中 | Core 架構重整、DB Schema Boundary、Nx、CI/CD、開發規範 |# 🧭 Roadmap 位置




⸻

## 📁 建議最終 Schema 資料夾結構
```
backend/src/
  core/
    domain/
      user/
        user.schema.ts
        user.repository.ts
        user.service.ts
    infra/
      auth/
        session.schema.ts
      mail/
        mail.schema.ts
      db/
        client.ts
        schema.ts     ← drizzle aggregator（僅 DB 使用）
      utils/
        pagination.ts
        date.ts
        id.ts
  modules/
    cms/
      cms.schema.ts
      cms.repository.ts
      cms.service.ts
    learning/
      learning.schema.ts

```
⸻