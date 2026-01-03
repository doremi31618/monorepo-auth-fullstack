# Admin Panel 設計規範 (Design System Specification)

| 屬性 | 內容 |
| :--- | :--- |
| **基礎框架** | shadcn/ui |
| **CSS 框架** | Tailwind CSS |
| **圖標庫** | Lucide React |
| **版本** | v1.0 |
| **適用對象** | Frontend Developers, UI Designers |

## 1. 設計哲學 (Design Philosophy)
本專案採用 `shadcn/ui` 作為設計系統基礎。與傳統組件庫不同，shadcn/ui 不是一個 NPM 依賴包，而是一套可複製、可客製化的 **Headless Component** 集合。

*   **Accessibility (無障礙)**: 所有互動組件皆基於 Radix UI，確保鍵盤導航與螢幕閱讀器支援。
*   **Token-based**: 使用 CSS Variables 定義語意化顏色（Semantic Colors），支援一鍵切換深色模式 (Dark Mode)。
*   **Tailwind Native**: 樣式完全由 Tailwind Utility Classes 控制，易於維護與覆寫。

## 2. 色彩系統 (Color System)
我們使用語意化命名 (Semantic Naming) 來定義顏色，而非直接鎖定色碼。這使得主題切換（Light/Dark）變得容易。

### 2.1 基礎色票 (Base Palette)
本專案的色調配置如下：

| Token | Tailwind Class | Light Mode (Hex) | 用途 |
| :--- | :--- | :--- | :--- |
| **Primary** | `bg-primary` | `#4F46E5` (Indigo-600) | 主要按鈕、選中狀態、強調文字 |
| **Primary Foreground** | `text-primary-foreground` | `#FFFFFF` | Primary 背景上的文字 |
| **Secondary** | `bg-secondary` | `#F1F5F9` (Slate-100) | 次要按鈕、標籤背景 (Badge) |
| **Destructive** | `bg-destructive` | `#EF4444` (Red-500) | 刪除、危險操作、錯誤提示 |
| **Background** | `bg-background` | `#FFFFFF` (White) | 頁面背景、卡片背景 |
| **Muted** | `bg-muted` | `#F8FAFC` (Slate-50) | 頁面底色、禁用狀態 |
| **Border** | `border-border` | `#E2E8F0` (Slate-200) | 邊框、分隔線 |
| **Ring** | `ring-ring` | `#4F46E5` (Indigo-600) | Focus 狀態的光暈 |

### 2.2 狀態色 (Status Colors)
用於 Badge 或 Alert：

*   **Active / Success**: `text-emerald-700` / `bg-emerald-100`
*   **Inactive / Neutral**: `text-slate-700` / `bg-slate-100`
*   **Warning / System**: `text-amber-700` / `bg-amber-100`

## 3. 字型與排版 (Typography)

*   **Font Family**:
    *   英文: `Inter`, `system-ui`, `sans-serif`
    *   中文: `Noto Sans TC`, `Microsoft JhengHei`
*   **Scale**:
    *   **H1** (Page Title): `text-xl font-semibold`
    *   **H2** (Section Title): `text-lg font-bold`
    *   **H3** (Card Title): `text-base font-semibold`
    *   **Body**: `text-sm` (後台系統標準字級)
    *   **Small / Caption**: `text-xs text-muted-foreground`

## 4. 核心組件規範 (Component Specifications)
所有組件應優先使用 `npx shadcn-ui@latest add <component>` 安裝，並根據以下規範進行客製。

### 4.1 按鈕 (Button)
*   **Base Style**: `h-10 px-4 py-2 rounded-md text-sm font-medium transition-colors`
*   **Variants**:
    *   `default`: 用於主要操作（如：新增使用者、儲存）。
    *   `outline`: 用於次要操作（如：取消、匯出、搜尋）。
    *   `ghost`: 用於表格內操作（如：...選單）、導覽列按鈕。
    *   `destructive`: 用於刪除確認。

### 4.2 卡片 (Card)
*   **Style**: `rounded-xl border bg-card text-card-foreground shadow-sm`
*   **Usage**: 用於包覆表格、表單或數據概覽。
*   **Interaction**: 可點擊的卡片（如角色列表）應加上 `hover:border-primary/50` 與 `cursor-pointer`。

### 4.3 表格 (Table)
*   **Layout**:
    *   **Header**: `bg-muted/50 text-muted-foreground font-medium`
    *   **Row**: `hover:bg-muted/50 data-[state=selected]:bg-muted`
*   **Pagination**: 置於表格卡片底部，包含頁碼與上一頁/下一頁按鈕。

### 4.4 彈窗 (Dialog / Modal)
*   **Overlay**: `bg-black/50 backdrop-blur-sm`
*   **Content**: `max-w-md` (預設) 或 `max-w-2xl` (複雜表單)。
*   **Animation**: `animate-in fade-in zoom-in-95`。

### 4.5 輸入框 (Input)
*   **Style**: `h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`

## 5. 圖標系統 (Iconography)
統一使用 `Lucide React`。

*   **Size**:
    *   一般按鈕內: 16px (`size={16}`)
    *   表格操作: 18px (`size={18}`)
    *   大型標題旁: 20px (`size={20}`)
*   **Stroke**: 預設 2px，精細顯示可選用 1.5px。

## 6. 開發流程 (Development Workflow)

1.  **新增組件**:
    ```bash
    npx shadcn-ui@latest add [component-name]
    ```
2.  **樣式覆寫**:
    不要直接修改 `components/ui` 內的原始碼（除非是全域性修改）。應優先透過 `className` prop 傳入 Tailwind classes 進行覆寫，使用 `cn()` utility 來合併 classNames。

    ```tsx
    // 範例：客製化一個紅色的外框按鈕
    <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
      刪除
    </Button>
    ```

3.  **RWD**:
    優先採用 Mobile-First 策略。側邊欄在 `md` (768px) 以下自動隱藏。