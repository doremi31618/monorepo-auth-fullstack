# Project Documentation Governance

歡迎來到專案文檔中心。本專案採用 **Role-Driven Documentation** 策略，確保每份文件都有明確的負責人與受眾。

## 📂 文件結構與職責分工

我們將文件依照 **Workflow Role** 進行分類：

| Role | 負責產出 (Artifacts) | 對應資料夾 | 說明 |
| :--- | :--- | :--- | :--- |
| **Product Manager** | Roadmap | `roadmap/` | 產品長遠規劃、核心目標 (Goal)、策略 (Strategy)。 |
| **Project Manager** | Requirement Spec, WBS | `project-tasks/` | 專案執行追蹤。包含 **需求規格** 與 **WBS 進度表**。 |
| **UI/UX Designer** | Product Spec, Mockups | `system-spec/` | 收錄 **產品規格 (Functional/Visual)** 與 UI/UX 設計資源連結。 |
| **System Designer** | System Spec, Impl Guide | `system-spec/<feature>/` | 技術架構 (Tech Spec) 與實作指南 (Impl Guide) 統一存放於 Feature 資料夾。 |
| **Developer** | Code | `system-spec/<feature>/` | 參考 Feature 資料夾內的 Guide 進行開發。 |

---

## 📁 資料夾詳細定義

### 1. `roadmap/` (Product Direction)
- **Owner**: Product Manager
- **Content**: Milestone 規劃、商業目標、可行性分析。
- **Format**: `R1-core.md`, `R2-admin-rbac.md`

### 2. `project-tasks/` (Execution Tracking)
- **Owner**: Project Manager
- **Content**: 
    - **Requirement Spec**: 詳細需求條列。
    - **WBS**: 工作分解結構 (Work Breakdown Structure)。
    - **Checklist**: 執行進度與驗收狀況。
- **Format**: `R*-project-task.md`

### 3. `system-spec/` (Blueprints & Manuals)
- **Owner**: UI/UX Designer, System Designer, Developer
- **Structure**: 按 Feature/Milestone 分類，例如 `system-spec/R2-admin-rbac/`。
- **Content**:
    - **Product Spec**: `product-spec.md` (機能與 UI 流程)
    - **Technical Spec**: `technical-spec.md` (Schema API 架構)
    - **Implementation Guide**: `implementation-guide.md` (實作步驟)


### 5. `onboarding/` (Team Setup)
- **Owner**: Tech Lead
- **Content**: 新人入職指南、環境建置、Coding Standards。

### 6. `share-knowledge/` (Knowledge Base)
- **Owner**: All Team Members
- **Content**: 技術分享、踩坑紀錄、讀書會筆記。

---

## 🔄 Workflow 範例
1. **PdM** 在 `roadmap/` 定義 **R2 Admin** 目標。
2. **PjM** 在 `project-tasks/` 建立 WBS 與 Requirement Spec。
3. **UI/UX** 在 `system-spec/` 補充 Product Spec 與 Mockup。
4. **System Designer** 在 `system-spec/` 設計架構，並撰寫 `implementation-guides/`。
5. **Developer** 閱讀 `implementation-guides/` 開始 Coding。
