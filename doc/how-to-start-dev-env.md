# 開發環境啟動指南

## 1. 使用 Docker Compose 一次啟動全部服務

- 先決條件：已安裝 Docker Desktop / Docker Engine（包含 Compose v2）。
- 第一次啟動前，確認 `backend/.env` 已存在；若沒有，可執行 `cp backend/.env.example backend/.env`。
- 在專案根目錄執行：

```bash
docker compose up --build
```

- 服務啟動後：
  - 前端（SvelteKit）會在 `http://localhost:5173`
  - 後端（NestJS）會在 `http://localhost:3333`
  - Postgres 會在 `localhost:5432`

### 常用指令

```bash
# 以背景模式啟動
docker compose up -d

# 只帶起資料庫（本機跑後端時常用）
docker compose up -d db

# 查看特定服務日誌
docker compose logs -f backend

# 停止並清理容器（保留資料卷）
docker compose down
```

如果是第一次啟動，建議在容器跑起來後執行資料庫遷移：

```bash
docker compose exec backend npm run migration:push
```

> 提醒：目前後端僅提供帳號/登入流程的樣板，實際的資料表、服務與控制器邏輯需要自行實作並建立對應的 Drizzle 遷移。

啟動後可在瀏覽器開啟 `http://localhost:3000/api/docs` 查看自動產生的 Swagger API 說明。

## 2. 僅啟動後端（NestJS + Drizzle）

1. 安裝 Node.js 20+ 與 npm。
2. 準備環境變數：`cp backend/.env.example backend/.env`，依需求調整資料庫連線設定。
3. 確保 Postgres 已啟動（可重用上方的 `docker compose up -d db`）。
4. 安裝依賴並啟動：

```bash
cd backend
npm install
npm run start:dev
```

5. 必要時執行資料庫遷移：

   - 另開一個終端視窗，進入 `backend/`
   - 執行：

```bash
npm run migration:push
```

後端服務預設會監聽在 `http://localhost:3333`。

## 3. 僅啟動前端（SvelteKit）

1. 安裝 Node.js 20+ 與 npm。
2. 安裝依賴並啟動開發伺服器：

```bash
cd frontend
npm install
npm run dev
```

3. 前端預設會連線到 `http://localhost:3333`（定義於 `frontend/src/lib/api/httpClient.ts`），若後端埠號不同請記得調整。
4. 開啟瀏覽器至 `http://localhost:5173` 進行開發。

---

開發時建議先確保資料庫 → 後端 → 前端的啟動順序，確保 API 可以正常回應前端請求。
