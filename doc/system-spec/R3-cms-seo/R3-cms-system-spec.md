# R3 System Specification: CMS & Content Platform

## 1. Database Schema

### 1.1 `posts`
*Metadata and lifecycle management.*

| Column | Type | Attributes | Description |
|---|---|---|---|
| `id` | UUID | PK, default: gen | Unique Post ID |
| `slug` | VARCHAR(255) | Unique, Index | URL friendly identifier |
| `status` | ENUM | 'draft', 'published', 'archived' | Workflow status |
| `author_id` | INT | FK(users.id) | Creator/Owner |
| `created_at` | TIMESTAMP | default: now | |
| `updated_at` | TIMESTAMP | default: now | |
| `published_at` | TIMESTAMP | Nullable | When it was published |

### 1.2 `post_contents`
*Multilingual content storage.*

| Column | Type | Attributes | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `post_id` | UUID | FK(posts.id) | Relation to parent post |
| `locale` | VARCHAR(10) | Index | e.g., 'en', 'zh-TW' |
| `title` | TEXT | | Post Title in locale |
| `body` | JSONB | | Tiptap JSON structure |
| `seo_title` | TEXT | Nullable | Override for SEO |
| `seo_desc` | TEXT | Nullable | Override for SEO |

### 1.3 `file_objects` (R3c)
*Unified asset storage references.*

| Column | Type | Attributes | Description |
|---|---|---|---|
| `id` | UUID | PK | |
| `storage_key` | TEXT | Unique | Path in bucket/disk |
| `mime_type` | VARCHAR | | e.g., image/jpeg |
| `size_bytes` | BIGINT | | File size |
| `uploaded_by` | INT | FK | |

---

## 2. API Definition

### 2.1 Admin API (`/v1/cms`)
*Protected by `RBACGuard`.*

#### Posts
- `GET /posts` - List posts (filtering by status, author).
- `POST /posts` - Create empty draft.
- `GET /posts/:id` - Get full post details (with all locales or specific).
- `PATCH /posts/:id` - Update metadata or content.
- `DELETE /posts/:id` - Soft/Hard delete.

#### Publishing
- `POST /posts/:id/publish` - Change status to `published`.
- `POST /posts/:id/unpublish` - Revert to `draft`.

### 2.2 Public API (`/v1/public/cms`)
*Publicly accessible.*

#### Blog / Content
- `GET /posts/slug/:slug`
    - Query: `?locale=zh-TW`
    - Response: HTML ready content or JSON for SSR.
    - Logic: Must be `status=published` unless `preview_token` matches.

---

## 3. Security Model

### 3.1 Permissions
| Permission | Description |
|---|---|
| `cms.post.read` | View post list and details |
| `cms.post.create` | Create new posts |
| `cms.post.update` | Edit post content |
| `cms.post.publish` | Change status to published |
| `cms.post.delete` | Delete posts |
| `assets.upload` | Upload files |

### 3.2 Guards
- **Admin**: `AuthGuard` + `RBACGuard`.
- **Public**: No Guard (Open), but business logic checks `status`.
