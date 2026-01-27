# R3 - CMS & Content Platform Project Task

> **Status**: 📅 Planning
> **Objective**: Build a content platform governed by RBAC, extensible for multilingual support, and publishable.
> **Based on**: [R3-cms-seo.md](../roadmap/R3-cms-seo.md)

## 📅 Overview

| Sub-Milestone | Name | Scope |
|---|---|---|
| **R3a** | CMS Core (Internal) | Data Model, API, Admin UI, RBAC |
| **R3b** | Public Publish | Public Route, SSR, SEO Metadata |
| **R3c** | Assets & Dict | File Upload, Dictionary Model |

---

## 🏗️ R3a: CMS Core (Internal Authoring)

### 1. Database & Models
- [ ] **Schema Design**: Define `posts` table (metadata).
- [ ] **Schema Design**: Define `post_contents` table (t.json, locale).
- [ ] **Migration**: Create migration file for CMS tables.
- [ ] **Repository**: Implement `CmsRepository` (Drizzle).
- [ ] **Seeding**: Seed initial test data (optional).

### 2. CMS Admin API
- [ ] **Module Setup**: Create `CmsModule` in backend.
- [ ] **Controller**: Implement `CmsController` (`/cms/posts`).
- [ ] **Service**: Implement CRUD logic in `CmsService`.
- [ ] **RBAC**: Define permissions (`cms.post.read`, `create`, `update`, `delete`, `publish`).
- [ ] **Guard**: Apply `RBACGuard` to all CMS endpoints.
- [ ] **Validation**: Add Zod/DTO validation for request bodies.

### 3. Admin UI (Frontend)
- [ ] **Menu**: Add "Content" or "Posts" item to Admin Sidebar.
- [ ] **Post List**: Create `PostListPage` (datatable, status badge, locale).
- [ ] **Post Editor Layout**: Create `PostEditorPage` (main editor + sidebar).
- [ ] **Tiptap Integration**: Integrate Tiptap editor for content area.
- [ ] **Auto-save**: Implement `useAutoSave` hook.
- [ ] **Metadata Sidebar**: Implement title, slug, status, toggle inputs.

### 4. Integration
- [ ] **Content API Client**: Add `cms` methods to `sdk`.
- [ ] **Permission Check**: Hide "Publish" button if no permission.

---

## 🚀 R3b: Public Publish & SEO

### 1. Public API & Routing
- [ ] **Public API**: Implement `GetPostBySlug` (public endpoint).
- [ ] **Preview Mode**: Implement `preview_token` validation.
- [ ] **SSR**: Create `apps/web/app/blog/[slug]/page.tsx` (Next.js).

### 2. Rendering & SEO
- [ ] **Metadata**: Inject `title` and `description` into Next.js Metadata.
- [ ] **Tiptap Renderer**: Implement `TiptapRenderer` component (JSON -> HTML).
- [ ] **Fallback**: Handle 404 for draft/non-existent posts.

---

## 🗄️ R3c: Platform Assets & Dictionary

### 1. Asset Management
- [ ] **Schema**: Define `file_objects` table.
- [ ] **Upload API**: Implement `POST /assets/upload` (Adapter pattern).
- [ ] **Local Adapter**: Implement Local Storage adapter (Disk).
- [ ] **Editor Plugin**: Add Image Upload button to Tiptap toolbar.

### 2. Dictionary (Terms)
- [ ] **Schema**: Define `dictionary_terms` table.
- [ ] **Read API**: Implement `GET /dictionary` (cached).
- [ ] **Frontend Hook**: Create `useDictionary('scope')` hook.

---

## ✅ QA & Verification
- [ ] **Unit Tests**: Test `CmsService` logic.
- [ ] **E2E Tests**: Test Admin CMS flows (Create -> Publish -> View).
- [ ] **Manual QA**: Verify Editor UX and Mobile view.
