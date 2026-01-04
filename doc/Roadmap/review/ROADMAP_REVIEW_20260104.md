# Roadmap Review: Strategic Realignment (2026-01-04)

> **Review Date**: 2026-01-04
> **Focus**: Roadmap Realignment (Foundation -> Behavior Layer -> Delivery)
> **Status**: ✅ Approved & Updated

## 1. Executive Summary
本次 Review 重新校準了 Milestone 2 到 Milestone 5 的戰略方向，核心目標是確保 **Educational Platform (M4+)** 的需求能被早期 Milestone (M2, M3) 支撐，而無需回頭修改核心 (M1)。

策略轉向：
1.  **M2 (Governance)**: 建立強治理層，讓後續模組（CMS, LMS）能盲目信任權限系統。
2.  **M3 (Asset Layer)**: 將資產管理從 CMS 剝離，建立共用的「平台資產層」。
3.  **M4 (Behavior Layer)**: 從單純的 Infra 升級為 **「行為與事件層」**，作為未來 AI 與推薦系統的數據骨幹。
4.  **M5 (Safe Delivery)**: 引入 Migration Checklist，確保部署安全性。

---

## 2. Key Changes & Decisions

### 🧱 Milestone 2: Admin & RBAC (Governance)
> **Goal**: 建立不可動搖的「治理層」。

*   ✅ **Added: Policy Hook (ABAC)**
    *   在 RBAC 之外預留 `can(user, action, resource)` 介面。
    *   目的：支援未來「資源擁有者 (Owner-based)」檢查，不讓 RBAC 邏輯變得過於複雜。
*   ✅ **Added: Cache Reliability**
    *   定義 Cache 失效策略。
    *   目的：確保權限變更（如撤銷 Admin）即時生效，提升平台信任度。
*   ✅ **Added: Minimal Audit Log**
    *   Admin 的關鍵操作（User/Role CRUD）必須記錄。
    *   目的：不需要等到 M4 才開始追蹤「誰改了權限」。

### 📝 Milestone 3: CMS & Assets (Content Layer)
> **Goal**: 建立內容生產與資產管理能力。

*   ✅ **Strategy I: Platform Asset System**
    *   將檔案上傳/管理從 CMS 獨立出來 (`file_objects`)。
    *   目的：未來的 Course Material、User Avatar 都能共用此系統，CMS 只是 Consumer。
*   ✅ **Added: Preview Token**
    *   允許未登入/無權限者透過時效性 Token 預覽 Draft。
    *   目的：支援「老師預覽」、「分享草稿」場景。
*   🚫 **Exclusions (刻意不做)**
    *   全文搜尋 (Full-text Search)、複雜 Block Schema、CDN 優化。
    *   決策：留待 M4+ 或 M5 之後的效能優化階段。

### 🌐 i18n Strategy (The Missing Link)
> **Goal**: 讓未來的「國際化 / 個人化」需求無需重構核心。

*   ✅ **Decided: No Separate Milestone**
    *   i18n 不因該是獨立 Milestone，而是散落在各層的 Hooks。
*   ✅ **M2 Hook (Governance)**
    *   Permission Schema 增加 `labelKey`。
    *   建立 `system_i18n_keys` table 做死基礎翻譯。
*   ✅ **M3 Hook (Content)**
    *   建立 `Content Locale Model` (posts -> post_contents with locale)。
    *   CMS v1 支援手動切換編輯。
*   ✅ **M4 Hook (Behavior)**
    *   Learning Event 必須包含 `locale` 上下文，供未來 AI 分析學習行為差異。

### 🧠 Milestone 4: Behavior & Events (Behavior Layer)
> **Goal**: 從 "Infra" 轉型為 "System Nervous System" (神經系統)。

*   ✅ **Refined: Domain Event Bus**
    *   明確定義 Event Bus 不只是跑 Async Job，而是為了捕捉 **Domain Events** (e.g., `learning.completed`, `content.published`)。
    *   目的：這些事件是未來 AI Tutor 與學習分析的基礎數據。
*   ✅ **Refined: Queryable Audit**
    *   Audit Log 升級為可查詢系統 (Admin UI + API)，支援 PII Masking。
*   ✅ **Refined: Learning Metrics**
    *   Observability 不只看機器 Health，更要看「業務健康度」（學習進度、卡關率）。

### 🚀 Milestone 5: Deployment (Fearless Delivery)
> **Goal**: 讓 Developer 敢隨時 Deploy。

*   ✅ **Added: Migration Checklist**
    *   強制定義 Migration 的 Timing, Failure Strategy, Data Risk。
    *   目的：防止 Schema Change 造成服務中斷或資料損毀。

---

## 3. Next Steps
Roadmap 校準已完成，目前的架構足以支撐未來擴展。

1.  **Execute M2**: 開始實作 Admin Panel 與 RBAC Foundation。
2.  **Strict Governance**: 嚴格遵守 M2 定義的 Permission Schema pattern。
