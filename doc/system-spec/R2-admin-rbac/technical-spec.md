# Technical Specification: Admin & RBAC (R2)

> **Owner**: System Designer
> **Feature**: Admin Panel & Role-Based Access Control
> **Implementation Guide**: [implementation-guide.md](./implementation-guide.md)

## 1. Architecture
基於 `Strategy Pattern` 實現的 RBAC 守衛。

### 1.1 Diagram
(Mermaid Diagram link or code)

## 2. Database Schema
> Update `core/domain/access-control/access-control.schema.ts`

- **roles**: `id`, `name`, `code`, `description`
- **permissions**: `id`, `code` (module.action), `description`
- **users_to_roles**: `user_id`, `role_id`
- **roles_to_permissions**: `role_id`, `permission_id`

## 3. API Contract

### Roles
- `GET /admin/roles`
- `POST /admin/roles`
- `PUT /admin/roles/:id`
- `DELETE /admin/roles/:id`

### Permissions
- `GET /admin/permissions` (Grouped by module)

## 4. Security
- **Guard**: `RBACGuard` runs after `AuthGuard`.
- **Decorator**: `@Permissions('user.read')`
- **Frontend**: `<Guard permission="user.read">` component.
