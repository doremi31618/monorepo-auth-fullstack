以下是 Milestone 2：Admin + RBAC（角色權限系統） 的完整版本，內容與 Milestone 0、1 的格式完全一致（Goal / 驗收方式 / 策略與行動）。

這份內容可以 直接貼進你的專案文件（PRD / Tech Spec / Roadmap）。

⸻

# 🧱 Milestone 2 — Admin Panel + RBAC（Role-Based Access Control）

⸻

## 🎯 Goal（目標）

建立一個完整、可維護、可擴展的管理後台（Admin Panel），並實作可覆蓋整個系統的 角色與權限管理（RBAC）。

此 Milestone 的最終目標：
	•	提供管理者登入後台的能力
	•	能管理使用者、角色、權限
	•	能對各模組（例如 CMS、Workflow、System Settings）進行權限管控
	•	建立未來擴充權限（例如 API Key、Module-level ACL）的基礎架構
	•	提供一致的 RBAC Guard 供所有後端路由使用
	•	建立能自動生成權限 UI 的規格化 Permission Schema

⸻

## ⚠️ Feasibility 補充（範圍、模型、營運）
	•	決定租戶/作用域模型：單租戶 vs 多租戶；必要時加入 org/project scope 與 resource ownership 檢查（ABAC 混搭）
	•	Permission Schema 單一真相來源：由程式碼生成 seed + type 定義 + Admin UI 清單，避免手動漂移
	•	Break-glass 管理：預設 superadmin 帳號需有輪替/封存流程，並要求 MFA；所有 Admin 操作寫入 audit log
	•	審批與安全：新增/修改角色需記錄變更人與原因；刪除/降權應有雙重確認
	•	前後端一致性：前端按鈕/路由權限檢查需與後端 decorator 同源（共用權限 enum）

⸻

## ✅ 驗收方式（Acceptance Criteria）

⸻

### 1. Admin Panel（前端）完成度
	•	可登入後台並看到 Dashboard
	•	Admin 有 sidebar / topbar / user info
	•	有以下管理頁面：
	•	Users Management（使用者）
	•	Roles Management（角色）
	•	Permissions Management（權限清單）
	•	System Settings（可先留空但有架構）

⸻

### 2. RBAC 資料模型完成

資料表需建立：
	•	users
	•	roles
	•	permissions
	•	user_roles
	•	role_permissions

要求：
	•	支援一個 user 多角色
	•	一個角色可綁多個 permissions
	•	可新增自定義模組、動作、權限代號

⸻

### 3. RBAC Guard（後端）可正常運作
	•	後端可使用 @Permission('post.create') 這類 decorator
	•	未授權時，API 回傳 403 + 統一格式
	•	AuthBase（Milestone 1）可與 RBAC 無縫整合
	•	Admin API（user/role 管理）都有權限保護

⸻

### 4. Admin API 完整度

需完成：
	•	GET /admin/users
	•	POST /admin/users
	•	PATCH /admin/users/:id
	•	DELETE /admin/users/:id
	•	GET /admin/roles
	•	POST /admin/roles
	•	PATCH /admin/roles/:id
	•	DELETE /admin/roles/:id
	•	GET /admin/permissions（可自動從 Permission Schema 產生）
	•	POST /admin/roles/:id/permissions（設定角色權限）

⸻

### 5. I18n（可選）

如果你在 Milestone 1 有引入 i18n Module，則：
	•	Admin UI 的 Permission 名稱可自動翻譯（resource/action）

⸻

### 6. Developer Experience 驗收
	•	有文件說明如何新增模組權限
	•	有統一的 Permission Schema 格式，例如：

export const CMS_PERMISSIONS = {
  post: ['create', 'read', 'update', 'delete', 'publish'],
  page: ['create', 'read', 'update', 'delete'],
};

	•	新增模組時可輕鬆掛入 RBAC 系統，不需改核心邏輯

⸻

## 🎯 策略與行動（Strategy → Actions）

⸻

### Strategy A：建立後台（Admin Panel）基礎架構

Actions：
	•	建立 /admin layout（SvelteKit / Angular 任你選）
	•	新增 Sidebar / Topbar / Breadcrumb
	•	設計 Admin Navigation Config（JSON / TS Config）
	•	保護所有 /admin 路由必須登入 & 必須是 Admin Role

// example
{
  label: 'Users',
  icon: 'users',
  path: '/admin/users',
  permission: 'user.read'
}


⸻

### Strategy B：設計 RBAC 資料模型

Actions：
	•	建立 roles / permissions / mapping tables
	•	設計標準 Permission Code 規範：
	•	module.action 形式（例如：cms.post.create）
	•	撰寫 seed script：
	•	預設建立 superadmin
	•	預設建立 admin role
	•	自動匯入 Permission Schema

⸻

### Strategy C：RBAC Guard + Decorator 之後端基礎建設

Actions：
	•	建立 @Permission() decorator：

@Permission('cms.post.update')


	•	建立 Permission Metadata 解析器
	•	建立 RBAC Guard：
	•	檢查使用者角色
	•	讀取該角色的 permissions
	•	match & return 403 if unauthorized
	•	整合 AuthBase（Milestone 1）

⸻

### Strategy D：Admin API（User, Role, Permission）

Actions：
	•	建立以下後端 API：

User API：
	•	List users（支援 search, pagination）
	•	Create user
	•	Edit user profile
	•	Assign roles
	•	Deactivate/Delete user

Role API：
	•	CRUD roles
	•	Assign permissions to roles

Permission API：
	•	從 Permission Schema 自動生成列表
	•	可分群（cms / system / workflow…）

⸻

### Strategy E：Admin UI（Users + Roles + Permissions）

Actions：

Users Page
	•	user list table
	•	edit user drawer
	•	role assignment UI

Roles Page
	•	role list
	•	create/edit role
	•	permission multi-select UI

Permissions Page
	•	permission list（從 schema 自動產生）
	•	可與 role edit UI 連動

⸻

### Strategy F：Permission Schema + 自動化

Actions：
	•	設計可被模組引用的 Permission Schema，例如：

export const PERMISSIONS = {
  admin: {
    user: ['create', 'read', 'update', 'delete'],
    role: ['create', 'read', 'update', 'delete'],
  },
  cms: {
    post: ['create', 'read', 'update', 'delete', 'publish'],
  }
};

	•	自動轉換為：
	•	DB table seed
	•	Admin UI 清單
	•	Type-safe permission enums

⸻

### Strategy G：文件化與 Developer Experience

Actions：
	•	撰寫 RBAC 開發文件
	•	如何新增 module permission
	•	如何在 controller 使用 @Permission
	•	如何擴充新角色與權限
	•	撰寫 Testing Guide
	•	RBAC guard 單元測試
	•	Admin API 測試

⸻

## 📦 Milestone 2 Deliverables（可產出物）
	•	Admin Panel 初版 UI（Users / Roles / Permissions）
	•	RBAC Schema + seed script
	•	RBAC Guard + Permission Decorator
	•	完整的 Admin API（User / Role / Permission CRUD）
	•	全系統可運作的權限模型
	•	Developer Guide《RBAC 整合手冊》
	•	Admin 模組可被後續 CMS / Workflow 模組使用

⸻

## 🧭 Milestone 2 在 Roadmap 的位置

| Milestone | 名稱          | 狀態   | 內容摘要                                   |
|-----------|---------------|--------|---------------------------------------------|
| **2**     | Admin + RBAC  | 排程中 | 使用者管理、角色、權限、Admin UI            |


⸻

如果你願意，我可以繼續：

🔥 Milestone 3：CMS 模組（Editor + Content Model + SEO）

也寫成一樣完整、專業、可直接用於產品文件的格式。

需要我接著整理 Milestone 3 嗎？
