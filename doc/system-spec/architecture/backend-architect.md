# Backend 架構說明

本文件描述 monorepo-auth-fullstack 後端（NestJS）專案的技術棧與分層架構，協助工程師快速理解模組職責與資料流。

---

## 🔗 Related Documents
- **Project Structure**: [Roadmap (R1)](../Roadmap/R1-core.md)
- **Implementation Status**: [Project Task (R1)](../project-tasks/R1-core-project-task.md)

## 技術棧

- **框架**：NestJS 10（Express 平台）。
- **語言**：TypeScript，使用 `ts-node` 於開發環境執行。
- **資料庫**：PostgreSQL，透過 Drizzle ORM 操作。
- **驗證/安全**：`bcrypt` 處理密碼雜湊，`crypto.randomUUID()` 生成 session token。
- **權限控管**：RBAC Level 1 (Flat)，使用 NestJS Guards + Custom Decorators (`@RequirePermissions`)。
- **背景工作**：`@nestjs/schedule` 執行 session 清理 cron。
- **文件**：`@nestjs/swagger` 產生 OpenAPI (`/openapi`)。

---

## 分層與資料流

1. **Controller**（如 `src/auth/auth.controller.ts`）解析 HTTP 請求與回應，僅調用對應 service。
2. **Service**（如 `src/auth/auth.service.ts`）實作商業邏輯：驗證憑證、建立 session、整合 repository。
3. **Repository**（`src/auth/repository/session.repository.ts`, `src/user/user.repository.ts`）負責 Drizzle 查詢與資料存取。
4. **Common/Interceptor**（`src/common/response/response.interceptor.ts`）統一輸出格式 `{ statusCode, message, data, timestamp, path }`。
5. **DB Schema**（`src/db/schema.ts`）定義資料表結構並供 repository 引用。

此分層確保控制器輕量、邏輯集中在 service、資料操作集中在 repository。

---

## 目錄速覽

```
backend/src
├── core/
│   ├── domain/               # 商業邏輯 (Pure Business Logic)
│   │   ├── auth/             # Auth Domain (Service, Repo, Entities)
│   │   ├── user/             # User Domain
│   │   └── domain.module.ts
│   ├── infra/                # 技術實作 (Technical Implementation)
│   │   ├── config/           # Configuration & Validation
│   │   ├── db/               # Database (Drizzle, Schema Aggregator)
│   │   ├── mail/             # Mail Adapters
│   │   └── infra.module.ts
│   └── core.module.ts        # Aggregates Domain & Infra
├── main.ts                   # App Entry Point
└── app.module.ts             # App Root Module
```

---

## 模組重點

- **AuthModule**
  - `AuthController`：暴露 `/auth/signup`, `/auth/login`, `/auth/inspect`, `/auth/signout` 等端點。
  - `AuthService`：驗證使用者、建立/刪除 session、封裝回傳 DTO。
  - `SessionRepository`：以 Drizzle 操作 `userSessions`，提供建立/查詢/刪除與排程清理。
- **UserModule**
  - `UserRepository`：以 email 查詢、建立使用者。
- **CommonModule**
  - `ResponseInterceptor`：在所有 controller 回傳前包裝資料，維持前後端契約一致。
- **MailModule**
  - 範例 SES / Nodemailer 整合與 `RUN_SMTP_TEST` 控制的測試腳本。
- **AccessControlModule (RBAC)**
  - `AccessControlService`：負責 Roles 與 Permissions 的 CRUD 及初始化 Seeding。
  - `RBACGuard`：配合 `@RequirePermissions` Decorator 實作路由權限攔截。
  - `AccessControlRepository`：管理 RBAC 相關資料表 (`roles`, `permissions`, `user_roles`)。

---

## 設計原則

- **單向依賴**：Controller→Service→Repository，不可反向依賴。
- **DTO 驗證**：所有輸入 DTO 使用 `class-validator` Decorator，確保參數安全。
- **統一回應**：全域攔截器確保所有 API 都帶有 `statusCode`、`message`、`data`。
- **錯誤分類**：使用 Nest 內建例外（`BadRequestException`, `UnauthorizedException`, ...）以對應 HTTP 狀態碼。
- **環境管理**：敏感設定來自 `.env`/`ConfigModule`，避免硬編碼。
- **測試優先**：Service/Repository 新增功能時提供 Jest 單元測試；排程與第三方整合以 mock 隔離。

針對新的網域模組，可依上述結構建立 `module + controller + service + dto + repository`，並於 `app.module.ts` 或功能模組中註冊 Provider。

---

## Swagger / OpenAPI 設定

要讓 Swagger UI 顯示 schema 並支援在 UI 內輸入 Authorization header，需同時完成下列調整（專案已設定完成，可作為範例）：

1. **DocumentBuilder 註冊 Bearer Auth**：在 `main.ts` 使用 `.addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')`，Swagger UI 會出現 Authorize 按鈕。
2. **Controller 標注 Swagger Decorator**：於 `AuthController` 加上 `@ApiTags('Auth')`、`@ApiOperation`、`@ApiResponse`，需要 token 的端點加 `@ApiBearerAuth('access-token')`。
3. **DTO 標記欄位**：在 `auth/dto/*.ts` 內為每個欄位加 `@ApiProperty`（含 example），Swagger 才能生成對應 schema。

完成後重新啟動 backend，即可在 `http://localhost:<PORT>/openapi` 看到完整的路由、Schema，以及可輸入 token 的 Authorize modal。

---

## Architecture Decision Records (ADR)

> **決策紀錄 (ADR) - 001: Monorepo Core 架構與邊界治理**
>
> *   **Context:**
>     隨著專案擴展，原始扁平結構 (`src/auth`, `src/user`) 導致依賴混亂。需建立清晰的依賴邊界，並支援前後端共用邏輯。
>
> *   **Decision:**
>     1.  **Core 分層架構**:
>         *   **`core/domain`**: 純淨的商業邏輯與介面 (Service, Repository Interface, Entity)。不依賴 Infra 細節。
>         *   **`core/infra`**: 技術實作細節 (Database, Config, Adapters, Logger)。提供 Domain 所需的實作。
>         *   **`share/lib`**: 前後端共用的邏輯 (Contracts, DTOs, Utils)，位於獨立 package。
>     2.  **依賴方向規範 (Governance)**:
>         *   `Feature / App` → `Domain Core` → `Infra Core`。
>         *   禁止反向依賴 (e.g. Infra 不可 import Domain 業務邏輯，僅透過 Interface 互動)。
>     3.  **Monorepo 工具**:
>         *   引入 **Nx** 進行工作區管理與 Task 執行。
>         *   利用 `nx project` 與 Tags (`scope:domain-core`, `scope:infra-core`) 搭配 ESLint 強制執行架構邊界。
>
> *   **Status:** Accepted

> **決策紀錄 (ADR) - 002: 任務排程機制 (Backend Scheduling scaling)**
>
> *   **Context:**
>     系統需支援水平擴展 (Horizontal Scaling)，避免多實例 (Container Replicas) 同時執行相同 Cron Job 導致重複任務，且需保持架構簡單。
>
> *   **Decision:**
>     1.  **架構模式**: 採用 **Database-backed Queue** 模式，利用現有 PostgreSQL，暫不引入 Redis 以降低維運複雜度。
>     2.  **介面設計**: 實作 `JobSchedulerPort` (Port & Adapter)，將排程邏輯解耦，保留未來遷移至 Redis/BullMQ 的彈性。
>     3.  **生產端 (Producer)**: 利用 `UNIQUE KEY (job_name, scheduled_time)` + `ON CONFLICT DO NOTHING` 確保任務不重複建立 (Idempotency)。
>     4.  **消費端 (Consumer)**: 利用 `SELECT ... FOR UPDATE SKIP LOCKED` 確保任務單一執行 (Mutual Exclusion)。
>
> *   **Status:** Accepted
>
> *   **Alternatives Considered:**
>     *   **Redis / BullMQ**: 標準的分散式隊列方案。
>         *   *Pros*: 高吞吐量、原生 Pub/Sub、豐富的 Job 管理 UI。
>         *   *Cons*: 需維護額外的 Redis 服務，增加基礎設施成本與運維負擔 (Maintenance Overhead)。在此階段被否決。
>
> *   **Consequences:**
>     *   **Positive**: 零新增基礎設施 (Zero new infra dependency)，利用 ACID 特性保證資料一致性。
>     *   **Negative**: 資料庫負載略微增加 (Row locking)。若未來任務量極大 (e.g. >1000 jobs/sec)，可能需遷移至 Redis (已預留 Interface)。
