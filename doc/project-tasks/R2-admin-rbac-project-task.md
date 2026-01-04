
⸻

# Admin & RBAC Progress Report (Milestone 2)

> **Roadmap**: [R2 - Admin & RBAC](../roadmap/R2-admin-rbac.md)
> **Guides**:
> - [Implementation Guide](../system-spec/R2-admin-rbac/implementation-guide.md) (Pending)

Last updated: 2026-01-02

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
| **Requirement Definition (PM)** | ⏳ Planned | Define sitemap, user flows, and detailed permission specs. |
| **UI/UX Design** | ⏳ Planned | Admin panel mockups, component states, and design system updates. |
| **Admin Panel Foundation** | ⏳ Planned | Layout (Sidebar/Topbar), Navigation Config, Protected Routes. |
| **RBAC Data Model** | ⏳ Planned | Entities: Role, Permission, UserRole, RolePermission. |
| **RBAC Core (Guard/Decorator)** | ⏳ Planned | `@Permission()`, RBAC Guard, Metadata scanner. |
| **Admin API: User Management** | ⏳ Planned | List (Filter/Sort), Invite/Create, Profile Edit, Status Mgmt, Password Reset. |
| **Admin API: Role & Permission** | ⏳ Planned | CRUD Roles, Assign Permissions, List Permissions. |
| **Admin UI: User Management** | ⏳ Planned | Data Table, Edit Drawer, Role Assignment, Status Toggle. |
| **Admin UI: Roles & Permissions** | ⏳ Planned | Role management, Release permission assignment UI. |
| **Permission Schema Automation** | ⏳ Planned | Single source of truth schema -> DB Seed & Frontend Types. |

⸻

## Overall status snapshot
 • ⏳ In Progress / Planned: Admin Panel Setup, RBAC Model, Backend Guards, Admin APIs, Admin UI using Schema.
 • ❌ Not Started: Advanced Audit Logs, Activity History (Future phases).

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
 • [ ] **PM**: Define admin panel features (Sitemap, User Flows, Permission Specs).
 • [ ] **UI/UX Design**: Define frontend interface (Mockups, Design System updates).

**Strategy A: Admin Panel Foundation (Frontend)**
 • [ ] Setup `/admin` layout (Sidebar, Topbar).
 • [ ] Define Navigation Config (JSON/TS).
 • [ ] Implement Protected Route Guard (require Admin role).

**Strategy B: RBAC Data Model (Backend)**
 • [ ] Create tables: `roles`, `permissions`, `user_roles`, `role_permissions`.
 • [ ] Implement Drizzle entities & relations.
 • [ ] Write Seed Script (Superadmin, Default Roles, Schema-based Permissions).
 • [ ] Create `system_i18n_keys` table (key, locale, value) for static UI translation.

**Strategy C: RBAC Core Infrastructure (Backend)**
 • [ ] Implement `@Permission()` decorator.
 • [ ] Implement `RBACGuard` (Check User -> Roles -> Permissions).
 • [ ] Implement `PolicyHook` interface (for future ABAC expansion).
 • [ ] Integration test: Guard enforces 403 on unauthorized access.

**Strategy D: User Management API (Admin)**
 • [ ] **User List**: Pagination, Search (email/name), Sorting, Filter (role/status).
 • [ ] **User Actions**: Create/Invite, Edit Profile, Soft Delete.
 • [ ] **Security Actions**: Force Password Reset, Toggle Active/Suspended status.
 • [ ] **Audit**: Record basic audit log (Who, Action, Target) for all write operations.
 • [ ] **Role Assignment**: Assign/Unassign roles to user.

**Strategy E: Role & Permission API**
 • [ ] **Roles API**: List, Create, Update, Delete.
 • [ ] **Permissions API**: List (grouped by module), Assign permissions to Role.

**Strategy F: Admin UI Implementation (Frontend)**
 • [ ] **Users Page**: Data Table (Search/Filter), Create Modal.
 • [ ] **User Edit Drawer**: Profile form, Security (Reset Pwd/Status), Role selector.
 • [ ] **Roles Page**: List, Create/Edit modal.
 • [ ] **Permissions UI**: Multi-select/Tree view for assigning permissions to roles.

**Strategy G: Permission Schema & Automation**
 • [ ] Define `PERMISSION_SCHEMA` constant (include `labelKey` for i18n).
 • [ ] Auto-generate TypeScript enums/types from schema.
 • [ ] Ensure Seed script syncs DB with Schema.

**Strategy H: Documentation & DX**
 • [ ] Write RBAC Integration Guide (How to add new permissions).
 • [ ] Document Admin API usage.
 • [ ] Implement RBAC Cache Invalidation strategy.

⸻

## Roadmap position
| Milestone | 名稱 | 狀態 | 內容摘要 |
|-----------|------|--------|------------|
| **2** | Admin + RBAC | ⏳ 進行中 | Admin UI, RBAC Model, Permission Guard, Admin APIs |

⸻

## Working Diary

### 2026-01-02
- **Initialization**: Created R2 project task document based on Roadmap R2.
