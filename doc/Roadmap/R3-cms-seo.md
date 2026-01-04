好的！以下是 Milestone 3：CMS 模組（Editor + Content Model + SEO） 的完整整理版。
格式與 Milestone 0、1、2 完全一致，可直接放入你的 PRD／Tech Spec／Roadmap。

⸻

# 🧱 Milestone 3 — CMS 模組（Content Management System）

⸻

## 🎯 Goal（目標）

建立一個輕量但可擴展的 CMS 模組，提供文章、頁面等內容的建立、編輯、發佈與 SEO 設定能力，並能與 Admin + RBAC 模組整合，使不同角色可擁有不同的內容管理權限。

本 Milestone 的最終目標包含：
	•	設計內容資料模型（Post / Page）
	•	整合 Tiptap（或類 Notion editor） 來支援富文本編輯
	•	提供草稿／發佈／版本控制能力（最小可行）
	•	支援 SEO metadata（title / description / og:image）
	•	支援動態 slug 與公開頁面
	•	與 RBAC 整合（誰能撰寫？誰能發佈？）
	•	建立 CMS 專屬 API 與前端 UI

⸻

## ⚠️ Feasibility 補充（範圍、效能、工作流）
	•	Feasibility: 縮小第一版範圍：僅 Post，功能鎖定 draft/publish、基本 metadata、Tiptap 基本工具列；版本控制/標籤/自動儲存可延後
	•	**Platform Assets**: Asset / File 不是 CMS 專屬，而是平台層級 (file_objects)，CMS 只是 Consumer。需定義 `upload -> metadata -> reference` 流程
	•	**Content i18n Hook**: 建立 `Content Locale Model` (posts -> 1:N -> post_contents with `locale`)，CMS v1 支援手動切換語言編輯，不做自動翻譯
	•	**Preview**: 實作 Preview Token 機制，允許未登入者透過時效性 Token 預覽草稿
	•	**Exclusions**: 刻意不做全文搜尋、複雜 Block Schema、Sitemap/CDN 優化 (M4+)
	•	回溯與觀測：編輯/發佈/刪除寫入 audit log；Tiptap JSON 大小需設上限並在 API 層驗證

⸻

## ✅ 驗收方式（Acceptance Criteria）

⸻

### 1. 內容資料模型完成度
	•	建立資料表：
	•	posts
	•	post_content（存 JSON / Tiptap Document）
	•	tags（可選）
	•	tags（可選）
	•	post_tags（可選）
	•	`post_contents` table 需包含 `locale` 欄位 (支援多語系)
	•	內容包含欄位：
	•	title
	•	slug（唯一值）
	•	status（draft / published）
	•	author_id
	•	published_at
	•	seo_title
	•	seo_description
	•	og_image
	•	內容可儲存為草稿
	•	可更新既有內容

⸻

### 2. Tiptap Editor 整合
	•	使用 Svelte（或 Angular）整合 Tiptap Editor
	•	支援基本功能：
	•	bold
	•	italic
	•	heading
	•	paragraph
	•	bullet list
	•	code block
	•	image（可選）
	•	可將 Editor Document 以 JSON 格式儲存至 post_content
	•	支援自動存檔（auto-save）

⸻

### 3. CMS API 完整度
	•	POST /cms/posts（建立草稿）
	•	GET /cms/posts?status=&keyword=（查詢與分頁）
	•	GET /cms/posts/:id（取得編輯資料）
	•	PATCH /cms/posts/:id（更新內容 / metadata）
	•	POST /cms/posts/:id/publish（發佈）
	•	DELETE /cms/posts/:id（刪除或 archive）

要求：
	•	API 已整合 RBAC Guard（例如需 post.create 權限）
	•	錯誤回傳使用 Core Module 格式

⸻

### 4. CMS 前端 UI
	•	Post List（文章列表）
	•	Post Editor Page（整合 Tiptap）
	•	Post Metadata Sidebar（SEO 設定）
	•	Post Preview Mode
	•	草稿與發佈狀態切換
	•	Slug 編輯 UI
	•	自動儲存提示（Auto-save indicator）

⸻

### 5. SEO 與 Site Routing（Public Site）
	•	動態路由：
/blog/[slug]
	•	從資料庫讀取文章並渲染 HTML
	•	正確設定瀏覽器 head（SvelteKit load 端）
	•	title
	•	description
	•	og:image
	•	文章不可見於未發佈狀態（非 admin 無法看到）
	•	可產生 sitemap（可延至 Milestone 4）

⸻

### 6. RBAC 整合驗收
	•	post.read：查看草稿
	•	post.create：建立草稿
	•	post.update：修改內容
	•	post.publish：發佈文章
	•	post.delete：刪除文章

後端 Guard 與前端顯示需同步處理。

⸻

## 🎯 策略與行動（Strategy → Actions）

⸻

### Strategy A：設計內容資料模型（Content Model）

Actions：
	•	設計 posts + post_content table
	•	**i18n**: post_content 增加 `locale` 欄位 (PK: post_id + locale)
	•	post_content 採 JSON / JSONB 格式（儲存 Tiptap Document）
	•	設計 slug 生成器（可根據 title 自動生成）
	•	設計 content versioning（可選先不實作）

⸻

### Strategy B：整合 Tiptap Editor（Svelte / Angular）

Actions：
	•	建立 Editor Component
	•	擴充常用 Node/Mark 套件（Heading、Bold、Image…）
	•	提供 API：

editor.getJSON() // 存入 post_content
editor.commands.setContent(json) // 從 DB 載入


	•	加入 Auto-save（onChange + debounce → PATCH update）
	•	加入 Auto-save（onChange + debounce → PATCH update）
	•	建立 Slash Command 或 Toolbar（未來可擴充）

### Strategy I: Platform Asset System (New)

Actions:
	•	建立 `file_objects` table (id, url, mimetype, size, metadata)
	•	實作 Upload API (Local/S3/GCS agnostic adapter)
	•	CMS 整合：Editor 上傳圖片時，先呼叫 Upload API 取得 ID/URL，再插入 doc
	•	不與 CMS 綁死，供未來 LMS/User 使用

⸻

### Strategy C：建立 CMS API

Actions：
	•	設計 CMS REST endpoints
	•	每個 API 加上 RBAC 保護
	•	在 Core Response 格式之上統一錯誤格式
	•	在 publish 時更新：
	•	slug
	•	published_at
	•	status = ‘published’

⸻

### Strategy D：建置 CMS 管理界面（Admin UI）

Actions：
	•	Post List Page
	•	搜尋、分頁、篩選（草稿/已發佈）
	•	Editor Page
	•	左側 Article Editor
	•	右側 Metadata（SEO、slug、狀態）
	•	Post Preview Page
	•	內容更新後更新 store 或 local state

⸻

### Strategy E：SEO 與公開內容呈現（Public Site）

Actions：
	•	建立 /blog/[slug]/+page.ts
	•	在 SSR 中拉文章內容
	•	支援 Preview Token 驗證：若帶有 valid token，可讀取 Draft 狀態文章
	•	使用 Tiptap Renderer（或自建 renderer）渲染畫面
	•	設定 head metadata（title/desc/OG tags）
	•	Only published post can be viewed (unless preview token provided)

⸻

### Strategy F：權限模型整合（RBAC）

Actions：
	•	新增 CMS 專用 Permission：

export const CMS_PERMISSIONS = {
  post: ['create', 'read', 'update', 'delete', 'publish'],
};

	•	整合到 Admin + RBAC 模組
	•	在 Roles Page 顯示 CMS 權限
	•	Editor UI 根據權限顯示按鈕（例如非 publisher 看不到 Publish 按鈕）

⸻

### Strategy G：文件化與 Developer Experience

Actions：
	•	撰寫 CMS Developer Guide
	•	如何新增內容類型
	•	如何擴充 Editor
	•	如何新增 SEO 欄位
	•	撰寫 Public Site Integration Guide
	•	如何新增新類型頁面
	•	如何渲染 JSON-based Tiptap content
	•	撰寫 Testing Guide
	•	CMS API 測試
	•	Editor 行為測試

⸻

## 📦 Milestone 3 Deliverables（可產出物）
	•	CMS Database Schema（posts, post_content）
	•	CMS API（CRUD + publish）
	•	CMS Editor（Tiptap Integration）
	•	SEO Metadata 功能
	•	Dynamic Public Route /blog/[slug]
	•	RBAC 整合（post.* 權限）
	•	CMS Developer Guide v1

⸻

## 🧭 Milestone 3 在 Roadmap 的位置

| Milestone | 名稱     | 狀態   | 內容摘要                                   |
|-----------|----------|--------|---------------------------------------------|
| **3**     | CMS 模組 | 計畫中 | Tiptap editor、文章管理、SEO、頁面設定       |


⸻

如果你願意，我可以繼續整理：

🔥 Milestone 4：Cross-cutting 能力（排程紀錄、Audit Log、Health Check）

或

🔥 Milestone 5：部署與版本管理（Versioning / Infra / CI/CD）

你想先看哪一個？
