以下是 Milestone 1：Core Module 重構 的完整內容（含 Goal、驗收方式、策略與行動），格式與 Milestone 0 完全一致，可直接放入你的官方文件或 PRD。

⸻

# 🧱 Milestone 1 — Core Module 重構（Core Refactoring & Shared Foundation）

⸻

## 🎯 Goal（目標）

建立 核心基礎模組（Core Module），將專案中所有可重用的功能抽象化、標準化、模組化，使後續的 Admin、CMS、Workflow 等模組能站在穩固的技術基礎上開發。

最終目標包含：
	•	將常用功能統一封裝進 @app/core
	•	模組之間有明確界線與依賴關係（降低耦合）
	•	提供版本化能力（可隨著系統成長平滑升級）
	•	建立統一的工程標準（config、logger、error handler、db layer）
	•	讓後續所有模組（Admin / CMS / SSO / Workflow）都能共用相同核心基礎

⸻

## ⚠️ Feasibility 補充（範圍與治理）
•	Core 版本化前先凍結模組邊界：決定哪些放 core、哪些留在各 domain，避免過度抽象
•	依賴治理：建立 lint/dep graph 規則（例如禁止 feature→feature 交叉依賴，僅可依賴 core）
•	Schema 與 migration 所有權：各 domain 負責自己的 schema/migration，Core 只提供 Drizzle tooling 與規範
•	Release 政策：Core MAJOR/MINOR/PATCH 的對應檢查流程（破壞性變更需 checklist 與對下游的 smoke test）
•	避免「工具箱膨脹」：先完成 config/logger/error/auth-base，utilities（pagination/id 等）分階段引入

⸻

## ✅ 驗收方式（Acceptance Criteria）

### 1. Core Module 基礎建置
•	建立 core 資料夾 / 套件
•	Core 模組可單獨 import、可版本化
•	各功能以獨立子模組形式提供（config、db、logger、auth-base 等）

⸻

### 2. Config System（統一環境設定）
•	所有環境變數皆統一透過 Core Config 取得
•	支援 schema validation（例如 Zod / Joi）
•	可支援不同環境（dev / staging / prod）

⸻

### 3. Database Layer（Drizzle ORM 封裝）
•	封裝 Drizzle 連線
•	定義 BaseRepository / BaseEntity（createdAt、updatedAt）
•	建立一致的 Transaction Helper
•	migrations 可由 Core 統一維護

⸻

### 4. Logger & Error Handling
•	全域 Logger（可輸出 JSON 格式）
•	Global Exception Filter（統一 API 回傳格式）
•	Request Logging Interceptor
•	在 Admin 之後可以查看 Error / Request Log

⸻

### 5. Auth Base（非 RBAC，RBAC 會在 Milestone 2）
•	@CurrentUser() Decorator
•	AuthGuardBase（用於保護任何模組）
•	提供 Role/Permission 可掛接的 scaffold（但不實作 RBAC）

⸻

### 6. Shared Utilities
•	Pagination Utility
•	Date Utility
•	ID Generator（例如 ULID）
•	Response Builder（統一 response spec）

⸻

### 7. 文件與可用性
•	Core 模組文件（如何新增模組、如何引用）
•	在 Admin 與 CMS 中能成功引用 Core，且無循環依賴
•	Core 發布第一版（如 v0.1.0）

⸻

## 🎯 策略與行動（Strategy → Actions）

⸻

### Strategy A：模組化與版本化（Modularization & Versioning）

Actions：
•	規劃 @app/core package 結構
•	拆分子模組（config、db、logger、auth-base、utils）
•	加入簡單版本號管理（semver）
•	建立 CHANGELOG.md
•	在 monorepo 中讓 core 可被 backend / admin / cms 引用

⸻

### Strategy B：統一環境變數管理（Config System）

Actions：
	•	撰寫 ConfigModule（例如 core/config）
	•	將所有 dotenv 引用移到 Core 中
	•	定義 config schema（例如 z.object({...})）
	•	提供方便的 API，例如：

const dbConfig = coreConfig.get('database');


⸻

### Strategy C：資料庫層抽象化（Database Layer Abstraction）

Actions：
	•	建立 DatabaseModule
	•	封裝 Drizzle ORM：
	•	connection
	•	migrations
	•	transaction helper
	•	建立 BaseRepository：
	•	findById
	•	findAll
	•	create
	•	update
	•	提供所有模組可復用的 schema 型別

⸻

### Strategy D：統一 Logging 與 Error Handling

Actions：
	•	設計統一的 Response 格式，例如：
```

{
  "statusCode": 200,
  "message": "Success",
  "data": {...},
  "timestamp": "...",
  "path": "/api/users"
}
```

•	建立：
•	GlobalExceptionFilter
•	LoggingInterceptor
•	CoreLogger（可支援 JSON or text）
•	在所有模組啟動前先載入 core logging

⸻

### Strategy E：提供 Authentication 基礎能力（非 RBAC）

Actions：
	•	建立 AuthBaseModule
	•	提供：
	•	@CurrentUser() decorator
	•	UserIdentity interface
	•	Session context（從 req 中讀 session）
	•	AuthGuardBase（後續 RBAC guard 會 extend）
	•	確保與 Auth（Milestone 0）功能完全相容

⸻

### Strategy F：建立共享工具程式庫（Utility Library）

Actions：
	•	建立 utils 子模組
	•	提供：
	•	字串工具
	•	日期格式化
	•	pagination
	•	id utilities（UUID / ULID）
	•	提高全系統一致性與可維護性

⸻

### Strategy G：文件化（Documentation & Developer Experience）

Actions：
	•	建立 CORE_GUIDE.md
	•	說明：
	•	如何新增一個 core 子模組
	•	如何在其他模組引用
	•	依賴關係規則
	•	設計模組界線，避免循環依賴

⸻

## 📦 Milestone 1 Deliverables（可產出物）
•	@app/core package
•	ConfigModule
•	DatabaseModule
•	LoggerModule
•	AuthBaseModule
•	Utils Library
•	Developer Guide
•	Core v0.1.0

⸻

## 🧭 Milestone 1 在 Roadmap 的位置

| Milestone | 名稱                 | 狀態        | 內容摘要                                            |
|-----------|----------------------|-------------|-----------------------------------------------------|
| **1**     | Core Module 重構     | ⏳ 下一階段 | config、db、logger、decorator、auth base、模組化架構 |


