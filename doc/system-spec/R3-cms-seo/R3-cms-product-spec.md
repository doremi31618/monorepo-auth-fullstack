# R3 Product Specification: CMS & Content Platform

## 1. User Stories

### 1.1 As a Content Editor (Internal)
- I want to write articles in a rich text environment (Bold, Italic, Image).
- I want to save drafts automatically so I don't lose work.
- I want to manage SEO titles and descriptions separately from the content.
- I want to publish content only when it is ready.
- I want to upload images directly into the editor.

### 1.2 As a Reader (Public)
- I want to view blog posts at friendly URLs (`/blog/my-post`).
- I want to see content in my preferred language (if available).
- I want the page to load fast and be SEO friendly.

---

## 2. Admin UI Requirements

### 2.1 Editor Layout
*   **Dual-Pane Design**:
    *   **Left (Main)**: Title Input (H1 style), Tiptap Editor Canvas.
    *   **Right (Sidebar)**: Meta controls (Slug, Status, Publish Date, Locale Switcher).

### 2.2 Editor Features (Tiptap)
*   Standard formatting (B, I, U, Strike).
*   Headings (H1, H2, H3).
*   Lists (Bullet, Ordered).
*   Image Block (Upload or select from Asset library - R3c).
*   Code Block (Optional).

---

## 3. Functional Requirements

### 3.1 Content Lifecycle
1.  **Draft**: Default state. Only visible in Admin.
2.  **Published**: Visible in Public API.
3.  **Archived**: Hidden from Public, read-only in Admin (optional).

### 3.2 Multilingual Support
*   Structure allows for N locales per Post.
*   Frontend should allow switching "Editing Locale".
*   If a locale is empty, fallback content (e.g., English) or empty state is shown.

### 3.3 SEO
*   `slug` is global unique identifier.
*   SSR page MUST output `<title>`, `<meta name="description">`, `<meta property="og:image">`.

---

## 4. Acceptance Criteria

- [ ] **Data Integrity**: Post Cannot be published without a validated Slug and Title.
- [ ] **Safety**: Unauthorized users cannot access Admin CMS APIs.
- [ ] **Performance**: Public API response time < 100ms for cached hits (or basic DB fetch).
- [ ] **SEO**: Google Lighthouse SEO score > 90 for blog pages.
