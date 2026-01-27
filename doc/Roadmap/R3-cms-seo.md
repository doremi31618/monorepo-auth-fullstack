🧱 Milestone 3 — CMS & Content Platform

(M3a / M3b / M3c)

Positioning
Milestone 3 focuses on building the Content & Semantics Layer on top of the existing Platform Governance (M2).
It is intentionally split into three sub-milestones to ensure high completion quality under limited development time.

⸻

🎯 Overall Goal（M3）

建立一個 可被 RBAC 治理、可多語擴展、可對外發佈 的輕量 CMS 與內容平台，
並為未來的 Dictionary / Asset / Event / SEO 能力提供穩定基礎。

Milestone 3 不追求「功能多」，而是追求：
	•	架構正確
	•	責任邊界清楚
	•	每一階段都可獨立完成與 freeze

⸻

🧩 Milestone Breakdown

Sub-Milestone	名稱	核心定位
M3a	CMS Core (Internal)	內部可用的內容編輯與治理
M3b	Public Publish & SEO	對外可見、可分享的內容發佈
M3c	Platform Assets & Dictionary	跨模組內容資產與術語治理


⸻

🧩 Milestone 3a — CMS Core (Internal Authoring)

🎯 Goal

建立 受 RBAC 管控的內容編輯系統，
讓管理者可在 Admin 後台完成內容的建立、編輯、儲存與狀態管理，
但內容尚未對外公開。

⸻

✅ Scope（In）
	•	內容資料模型（Post / PostContent）
	•	Content Locale Model（per-locale content）
	•	CMS Admin API（CRUD + publish state）
	•	Admin UI：Post List / Editor / Metadata Sidebar
	•	Tiptap Editor（基本工具列）
	•	Auto-save（debounce）
	•	RBAC 整合（cms.post.*）
	•	UI i18n hook（僅 UI 文案，不含 Dictionary DB）

⸻

❌ Out of Scope（Explicitly Excluded）
	•	Public site routing
	•	SEO / OG metadata rendering
	•	Asset / File upload
	•	Preview token
	•	Dictionary 管理介面

⸻

✅ Acceptance Criteria（M3a）

1. Content Model
	•	tables：
	•	posts
	•	post_contents（post_id + locale）
	•	欄位：
	•	title
	•	slug
	•	status（draft / published）
	•	author_id
	•	published_at
	•	seo_title（optional）
	•	seo_description（optional）
	•	內容以 JSON（Tiptap document）儲存
	•	同一 Post 可有多個 locale 版本

⸻

2. CMS Admin API
	•	POST /cms/posts
	•	GET /cms/posts
	•	GET /cms/posts/:id
	•	PATCH /cms/posts/:id
	•	POST /cms/posts/:id/publish
	•	DELETE /cms/posts/:id

要求：
	•	全數受 RBAC Guard 保護
	•	錯誤回傳符合 Core Response 格式
	•	JSON content size 有上限驗證

⸻

3. Admin UI
	•	Post List（草稿 / 已發佈）
	•	Post Editor（Tiptap）
	•	Metadata Sidebar（title / slug / status）
	•	Auto-save 狀態提示
	•	權限不足時隱藏或 disable 操作

⸻

4. RBAC Permissions

cms.post.read
cms.post.create
cms.post.update
cms.post.publish
cms.post.delete


⸻

📦 Deliverables（M3a）
	•	CMS DB Schema v1
	•	CMS Admin API
	•	Admin Editor UI
	•	RBAC integration
	•	CMS Core Developer Notes

⸻

🧩 Milestone 3b — Public Publish & SEO

🎯 Goal

讓 CMS 內容 真正成為產品的一部分：
可被公開存取、可分享、可被搜尋引擎正確解析。

⸻

✅ Scope（In）
	•	Public route：/blog/[slug]
	•	SSR render published content
	•	SEO metadata（title / description / og:image）
	•	Preview Token（未登入可預覽草稿）
	•	Locale fallback（缺語系回預設）

⸻

❌ Out of Scope
	•	Sitemap
	•	CDN / ISR / cache optimization
	•	Full-text search

⸻

✅ Acceptance Criteria（M3b）
	•	Published post 可透過 URL 存取
	•	Draft post 無 token 時不可存取
	•	Preview token 可讀 draft
	•	SEO metadata 正確注入 <head>
	•	Tiptap JSON 正確 render 為 HTML

⸻

📦 Deliverables（M3b）
	•	Public blog route
	•	Preview token mechanism
	•	SEO integration
	•	Public rendering guide

⸻

🧩 Milestone 3c — Platform Assets & Dictionary

🎯 Goal

將「圖片/檔案」與「專有名詞」提升為 平台級資產，
供 CMS 與未來模組（LMS / Profile / Docs）共用。

⸻

✅ Scope（In）

Platform Assets
	•	file_objects table
	•	Upload API（adapter pattern）
	•	Editor image upload integration
	•	RBAC：asset.upload

Dictionary
	•	Dictionary data model（term.*）
	•	Read API（供前端 i18n 使用）
	•	與 Permission Schema labelKey 整合

⸻

❌ Out of Scope
	•	Asset 管理 UI（可選）
	•	Dictionary 進階版本控制
	•	自動翻譯

⸻

📦 Deliverables（M3c）
	•	Asset storage abstraction
	•	Image upload integration
	•	Dictionary read API
	•	Terminology key conventions

⸻

🧭 Roadmap Position

Milestone	名稱	狀態	內容摘要
3a	CMS Core	Planned	Internal authoring, RBAC, editor
3b	Public Publish	Planned	Public site, SEO, preview
3c	Assets & Dictionary	Planned	Shared assets & terminology


⸻

✨ Design Principles（M3）
	•	Governance first：RBAC 與內容生命週期先於功能數量
	•	Separation of concerns：UI i18n / Dictionary / CMS content 嚴格分離
	•	Incremental delivery：每個 sub-milestone 都可 freeze
	•	Future-proof：為 M4 Event / SEO / Search 預留擴展點
