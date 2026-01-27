
⸻

# Admin & RBAC Progress Report (Milestone 2)

> **Roadmap**: [R2 - Admin & RBAC](../roadmap/R2-admin-rbac.md)
> **Guides**:
> - [Implementation Guide](../system-spec/R2-admin-rbac/implementation-guide.md) (Pending)

Last updated: 2026-01-26

Review action：依 Roadmap R2 規劃，本階段專注於建立 Admin Panel 基礎建設與 RBAC 權限系統。

⸻

## 🎯 Acceptance Criteria（R2-admin-rbac）

**1. Admin Panel（前端）**
•	可登入後台並看到 Dashboard (Sidebar / Topbar / User Info)。
•	完成 Users Management（使用者列表、編輯、角色分配）。
•	完成 Roles Management（角色列表、權限綁定）。
•	完成 Permissions Management（權限檢視）。

**2. RBAC 資料模型 (Backend)**
•	資料表：`users`, `roles`, `permissions`, `user_roles`, `role_permissions`。
•	支援 User 多角色、Role 多權限。
•	具備標準 Permission Code (module.action) 與 Seed 機制。

**3. RBAC Guard (Backend)**
•	實作 `@Permission('module.action')` decorator。
•	Guard 驗證 User Role -> Permissions，無權限回傳 403。
•	整合 AuthBase，確保所有 Admin API 受保護。

**4. Admin API**
•	User CRUD (List, Create, Edit, Delete, Assign Roles)。
•	Role CRUD (List, Create, Edit, Delete, Assign Permissions)。
•	Permission List API。

**5. Developer Experience**
•	Permission Schema 作為單一真相來源，自動生成 Seed 與 UI 清單。
•	文件說明如何新增模組權限。

⸻

## Product Feature Spec

| Feature / capability | Status | Notes |
| --- | --- | --- |
| **Requirement Definition (PM)** | ✅ Done | Define sitemap, user flows, and detailed permission specs. |
| **UI/UX Design** | ✅ Done | Admin panel mockups, component states, and design system updates. |
| **Admin Panel Foundation** | ✅ Done | Layout (Sidebar/Topbar), Navigation Config, Protected Routes. |
| **RBAC Data Model** | ✅ Done | Entities: Role, Permission, UserRole, RolePermission. |
| **RBAC Core (Guard/Decorator)** | ✅ Done | `@Permission()`, RBAC Guard, Metadata scanner. |
| **Admin API: User Management** | ✅ Done | List (Filter/Sort), Invite/Create, Profile Edit, Status Mgmt, Password Reset. |
| **Admin API: Role & Permission** | ✅ Done | CRUD Roles, Assign Permissions, List Permissions. |
| **Admin UI: User Management** | ✅ Done | Data Table, Edit Drawer, Role Assignment, Atomic Update. |
| **Admin UI: Roles & Permissions** | ✅ Done | Role management, Permission Matrix UI. |
| **Permission Schema Automation** | ⏳ Planned | Single source of truth schema -> DB Seed & Frontend Types. |

⸻

## Overall status snapshot
 • ✅ **Completed**: Admin Panel Setup, RBAC Model, Backend Guards, Admin APIs, Admin UI, Permission Schema, Documentation, Swagger API Docs.
 • ⏸️ Deferred: RBAC Cache Invalidation, Advanced Audit Logs (Future phases).

---

## R2 Milestone Status: ✅ **COMPLETE**

All core acceptance criteria have been met:
- ✅ Admin Panel (Frontend): Dashboard, Users Management, Roles Management, Permissions Management
- ✅ RBAC Data Model (Backend): Tables, Multi-role/Permission support, Seed mechanism
- ✅ RBAC Guard (Backend): `@RequirePermissions` decorator, RBACGuard enforcement
- ✅ Admin API: User CRUD, Role CRUD, Permission List, Role Assignment
- ✅ Developer Experience: `PermissionSchema` single source of truth, RBAC How-To Guide, Swagger API Docs

**Optional/Future**: Cache invalidation strategy, Advanced audit logging.

⸻

## Architecture & governance（R2 alignment）

**1. Permissions Schema Ownership**
 •	定義於 `core/domain/access-control` 或 `modules/admin`。
 •	格式：`module.resource.action` (e.g., `cms.post.publish`).
 •	**Single Source of Truth**: Code (Schema) -> DB (Seed) -> Frontend (UI).

**2. Security & Guard**
 •	Backend Guard 優先檢查：Login (AuthGuard) -> Role/Permission (RBACGuard).
 •	Frontend: Layout 路由保護 + Component 級別權限檢查 (`<Guard permission="cms.post.delete">`).

**3. Module Boundaries**
 •	Admin Module 作為一種 Feature Module，依賴 Domain Core (User, AccessControl).

⸻

## TODO (WBS) — ordered by dependency

**Phase 0: Definition & Design**
 • [x] **PM**: Define admin panel features (Sitemap, User Flows, Permission Specs).
 • [x] **UI/UX Design**: Define frontend interface (Mockups, Design System updates).

**Strategy A: Admin Panel Foundation (Frontend)**
 • [x] Setup `/admin` layout (Sidebar, Topbar).
 • [x] Define Navigation Config (JSON/TS).
 • [x] Implement Protected Route Guard (require Admin role).

**Strategy B: RBAC Data Model (Backend)**
 • [x] Create tables: `roles`, `permissions`, `user_roles`, `role_permissions`.
 • [x] Implement Drizzle entities & relations.
 • [x] Write Seed Script (Superadmin, Default Roles, Schema-based Permissions).
 • [x] Create `system_i18n_keys` table (key, locale, value) for static UI translation.

**Strategy C: RBAC Core Infrastructure (Backend)**
 • [x] Implement `@Permission()` decorator.
 • [x] Implement `RBACGuard` (Check User -> Roles -> Permissions).
 • [ ] Implement `PolicyHook` interface (for future ABAC expansion).
 • [x] Integration test: Guard enforces 403 on unauthorized access.

**Strategy D: User Management API (Admin)**
 • [x] **User List**: Pagination, Search (email/name), Sorting, Filter (role/status).
 • [x] **User Actions**: Create/Invite, Edit Profile, Soft Delete.
 • [x] **Security Actions**: Force Password Reset (via Create), Assign Roles.
 • [ ] **Audit**: Record basic audit log (Who, Action, Target) for all write operations.
 • [x] **Role Assignment**: Assign/Unassign roles to user (Atomic update implemented).

**Strategy E: Role & Permission API**
 • [x] **Roles API**: List, Create, Update, Delete.
 • [x] **Permissions API**: List (grouped by module), Assign permissions to Role.

**Strategy F: Admin UI Implementation (Frontend)**
 • [x] **Users Page**: Data Table (Search/Filter), Create Modal.
 • [x] **User Edit Drawer**: Profile form, Security (Reset Pwd/Status), Role selector.
 • [x] **Roles Page**: List, Create/Edit modal.
 • [x] **Permissions UI**: Multi-select/Tree view for assigning permissions to roles.

**Strategy G: Permission Schema & Automation**
 • [x] Define `PERMISSION_SCHEMA` constant (include `labelKey` for i18n).
 • [x] Auto-generate TypeScript enums/types from schema.
 • [x] Ensure Seed script syncs DB with Schema.

**Strategy H: Documentation & DX**
 • [x] Write RBAC Integration Guide (How to add new permissions).
 • [x] Document Admin API usage.
 • [ ] Implement RBAC Cache Invalidation strategy.

⸻

## Roadmap position
| Milestone | 名稱 | 狀態 | 內容摘要 |
|-----------|------|--------|------------|
| **2** | Admin + RBAC | ✅ 完成 | Admin UI, RBAC Model, Permission Guard, Admin APIs, Schema Automation, Swagger Docs |

⸻

## Working Diary

### 2026-01-26
- **Feature (Frontend)**: Completed Admin Panel Layout with Responsive Sidebar and Theme Toggle (Light/Dark).
- **Feature (Frontend)**: Polished UI with `shadcn-svelte`, implemented Mobile-First Data Tables and Sheets (`p-6` padding).
- **Refactor (UX)**: Replaced native `alert/confirm` with `Sonner` Toasts and `AlertDialog` for better user experience.
- **Refactor (Logic)**: Implemented atomic User Role updates in Backend (`updateUser` accepts `roleId`), removing brittle frontend transactional logic.
- **Access Control**: Verified RBAC end-to-end flow: Permission Matrix -> Role Assignment -> User Guard.
- **Schema Automation**: Created `PermissionSchema` in `@share/contract` as single source of truth for all permission codes.
- **Documentation**: Created comprehensive RBAC How-To Guide (`doc/onboarding/how-to-rbac.md`) covering module creation, seeding, and implementation patterns.
- **API Documentation**: Added Swagger/OpenAPI decorators to all Admin endpoints. Swagger UI accessible at `/openapi`.
- **Multi-Role Support**: Enhanced Backend & Frontend to support assigning multiple roles to users.
- **System Protection**: Implemented guards to prevent modification of Root Admin and System Roles (Dual protection: Backend + Frontend).
- **Bug Fix**: Fixed 500 Error on Admin Route by implementing proper authentication error handling in `+layout.ts`.

### 2026-01-19
- **Review**: Reviewed commit `d652c2` for R2 core implementation.
- **Documentation**: Updated `backend-architect.md` to include AccessControlModule details. Updated task status for completed RBAC features.

### 2026-01-18
- **Feature (Backend)**: Implemented RBAC Core (Module, Service, Controller, Repository).
- **Feature (Backend)**: Added `RBACGuard` and `@RequirePermissions` decorator for secure access control.
- **Feature (Frontend)**: Implemented Admin Panel foundation (Layout, Protected Routes).
- **Feature (Frontend)**: data-driven Role & User management pages (`/admin/roles`, `/admin/users`).
- **Shared**: Updated SDK and Contracts to support Admin APIs.

### 2026-01-02
- **Initialization**: Created R2 project task document based on Roadmap R2.
