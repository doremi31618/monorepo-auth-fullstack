TODO：單一 token table（session / refresh / reset_password）

- [x] 資料表設計：建立 user_tokens（id uuid PK、user_id FK、token unique、type enum、expires_at、created_at、updated_at、metadata jsonb）；索引含 token unique、(user_id, type) unique（若需）、expires_at。

- [x] DB migration（Drizzle + SQL）
  - [x] 新增 enum/type，建 user_tokens。
  - [x] 搬移 user_sessions、user_refresh_tokens -> user_tokens（type= session/refresh，保留 expires_at/created_at）。
  - [x] 建/調索引與約束，驗證完整性。
  - [x] 移除舊表，更新 drizzle meta。
- [x] Schema 調整
  - [x] backend/src/db/schema/authModel.ts：定義 userTokens + enum，移除 userSessions/refreshTokens。
  - [x] backend/src/db/schema.ts：輸出新 schema。
  - [x] backend/drizzle/00xx*.sql：新增 migration（建表/搬移/刪舊）。
- [x] Repository 重構（backend/src/auth/repository/session.repository.ts）
  - [x] 新 API：createToken(type, userId, expiresAt, token?)、findValidToken(type, token)、deleteByToken(type, token)、deleteByUserAndType(userId, type)、cleanupExpired(type?)。
  - [x] session/refresh 共用 user_tokens；預留 reset_password 建立/驗證/單次使用。
- [ ] Service 調整
  - [ ] backend/src/auth/auth.service.ts：CreateSession/refresh/signout/inspect 改用新 repository API（若限單 session/refresh，先刪同 type）。
  - [ ] backend/src/auth/session-cleanup.service.ts：改呼叫新的 cleanupExpired（可分 type 或共用）。
- [ ] reset_password 串接
  - [ ] 新增 createResetPasswordToken、consumeResetPasswordToken；郵件流程共用 user_tokens。
  - [ ] 設定 TTL（例 15–30 分鐘）與單次使用（consume 時刪除）。
- [ ] 測試與驗證
  - [ ] 更新/新增單元測試覆蓋 session/login/refresh/signout/cleanup；e2e 如有，調整 token assertions。
  - [ ] 本地 migration 演練：drizzle-kit migrate 後檢查搬移正確、舊表移除。
- [ ] 跨服務檢查
  - [ ] 確認 frontend payload 命名相容；若改動同步型別。
  - [ ] 排程/監控用的表名、log/metric 查詢同步更新。

