### 寫 token table 合併 migration 的步驟指南

1) 準備 enum/type 與新表  
- 在 schema 定義 `tokenType = pgEnum('token_type', [...])`，欄位用 `tokenType('type')`。先跑 `drizzle-kit generate`/`up` 生成 migration 草稿。  
- 新表 `user_tokens` 欄位：`id` (uuid PK 或序號 PK)、`user_id` FK、`token` (unique)、`type` (enum)、`expires_at`、`created_at`、`updated_at`，必要索引：token unique、expires_at、可選 `(user_id, type)` unique。  
- 這階段先建新表，不要動舊表，方便搬移。

2) 寫搬移 SQL（可手工編輯生成的 migration）  
- `INSERT INTO user_tokens (...) SELECT ... FROM user_sessions`，`type` 固定 `'session'`。  
- `INSERT ... FROM user_refresh_tokens`，`type='refresh'`。  
- `id` 若為 auto uuid，就不要手動塞；需保留值才顯式提供。  
- `created_at`、`expires_at` 從舊表帶入；`updated_at` 不存在可用 `NOW()`。

3) 建/調索引與約束  
- 在同一 migration 裡加 `CREATE UNIQUE INDEX` 或 `ALTER TABLE ... ADD CONSTRAINT`；用 Drizzle helper 生成時確認 SQL。  
- 若限制單 user 單 session/refresh，加 `(user_id, type)` unique；否則只保留 `token` unique + `user_id` FK。

4) 清理舊表  
- 搬移完成後在 migration 尾端 `DROP TABLE user_sessions`、`user_refresh_tokens`。  
- 較安全的作法：拆成兩次 migration（先建+搬，驗證後再 drop）。

5) 執行與驗證  
- 本地跑 `drizzle-kit up`/`migrate`，檢查 log 無錯。  
- SQL 驗證：`SELECT type, count(*) FROM user_tokens GROUP BY type;` 確認筆數吻合；抽樣核對 `expires_at`/`created_at`。  
- 索引檢查：`\d user_tokens`（psql）或 `SELECT * FROM pg_indexes WHERE tablename='user_tokens';`。

6) 更新 schema 檔與代碼  
- 移除 `userSessions`、`refreshTokens` 定義，改用 `userTokens`。  
- Repository/Service 全改用新表。  
- 跑 `drizzle-kit generate` 更新 schema snapshot/meta。

7) 風險控管  
- 先做 DB dump；在 staging 先跑一次。  
- 資料量大可分批搬移（`INSERT ... SELECT` 加 where/limit）。

8) 常見錯誤避免  
- enum 先定義再用，不要把 `pgEnum` 直接塞欄位。  
- 複合 PK 用 `primaryKey()` helper，不要在多欄同時 `.primaryKey()`。  
- 新的 unique 約束上線前先評估衝突（如同 user 多筆 refresh token 時 `(user_id, type)` unique 需先決定保留策略）。
