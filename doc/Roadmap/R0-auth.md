
⸻

# 🧱 Milestone 0 — Authentication & Identity Foundation（已完成）

本階段為整個系統的身份驗證基礎建設，內容依據 Auth Progress Report：


⸻

## 🎯 Goal（目標）

建立完整且安全的身分認證系統，提供後續 Core、Admin、CMS 模組所需的統一身份識別與存取控制基礎。

本 Milestone 旨在：
•	完成 Email/Password Login
•	完成 Google SSO
•	建立 Session + Refresh Token lifecycle
•	完成 Password Reset 全流程
•	提供可供前端整合的統一 Auth API 與 DTO
•	建立良好的 Session 維運與 Observability

⸻

## ⚠️ Feasibility 補充（必加的安全性與營運要求）
•	新增防暴力破解：login/signup/reset API rate limit（如 5/分鐘/帳號+IP），並記錄異常
•	支援 MFA（TOTP 或 email code）作為可選強化，至少留下介面與 DB 欄位
•	強化 session 安全：綁定 user agent / IP 變更提醒，允許裝置列表管理與強制登出
•	Secrets 與金鑰管理：明確來源（如 SSM/Secret Manager），設定輪替流程；JWT 私鑰不可放 .env
•	傳輸 / 瀏覽器安全：預設 HSTS、SameSite=Lax cookie、CSRF 防護（特別是 refresh endpoint）
•	稽核：登入/登出/重設密碼/SSO 事件寫入 audit log（對應 Milestone 4）

⸻

## ✅ 驗收方式（Acceptance Criteria）

### 1. 帳號系統功能
•	/auth/signup 可正常註冊
•	/auth/login 可正常登入
•	密碼使用 bcrypt 安全散列
•	重複 Email 會被拒絕
•	成功登入會建立 session + refresh token

⸻

### 2. Session / Refresh Token Lifecycle
•	Access Token（JWT）可存取受保護 API
•	Access Token 過期時，前端會自動發送 /auth/refresh
•	Refresh Token 存在 HttpOnly Cookie
•	Refresh 會 rotate 新 token 並失效舊 token
•	Refresh token 過期/撤銷 → Refresh API 返回 401/403
•	Logout 會：
•	清除 refresh cookie
•	revoke session + refresh token

⸻

### 3. Google SSO
•	/auth/google/login 正常導向 Google OAuth
•	callback 交換 code → 取得 Google profile
•	支援自動建立/查詢使用者
•	產生 session + refresh token
•	Redirect 回前端並帶 access token
•	前端可成功登入並寫入 authStore

⸻

### 4. Password Reset（忘記密碼）
•	/auth/reset/request 可觸發 reset email
•	Reset token 正確建立與驗證
•	/auth/reset/confirm 可成功更新密碼
•	密碼更新後會 revoke 所有 session
•	前端忘記密碼 / 重設密碼表單已串接 API

⸻

### 5. 前端 Auth Store
•	authStore 能保存 session token
•	前端重新整理後仍能讀取登入狀態
•	401 → 自動 refresh → 更新 session token
•	登出後清空 store + localStorage
•	SSR 安全性改善（仍可在後續 Milestone 進一步加強）

⸻

### 6. Observability 與維運
•	session cleanup cron job（自動清除過期 session）
•	mail_logs table 記錄所有寄信紀錄
•	API 使用統一 Response 格式
•	Refresh / Login / Reset 行為均可在 log 中追蹤

⸻

## 🎯 策略與行動（Strategy → Actions）

⸻

### Strategy A：建立安全的 Token 架構（Session + Refresh）

Actions：
•	建立 Access Token + Refresh Token 雙 token lifecycle
•	Refresh Token 存放在 HttpOnly Cookie
•	Token rotation（每次 refresh 皆產生新 token）
•	Logout 時 revoke 所有 refresh token
•	統一 Authorization: Bearer <token> 格式
•	在規格文件中完整記錄流程（已完成）

⸻

### Strategy B：完善 Email/Password 登入註冊

Actions：
•	開發 /auth/signup（含 bcrypt hashing）
•	開發 /auth/login（密碼驗證與 session 建立）
•	統一返回 DTO（sessionToken + metadata）
•	前端 UI：登入/註冊表單、驗證提示、loading 狀態

⸻

### Strategy C：安全的 Password Reset Flow

Actions：
•	建立 reset token table（含 attempts、expired_at）
•	/auth/reset/request → 發送 email
•	/auth/reset/confirm → 驗證 token 並更新密碼
•	密碼更新後 revoke 所有 session
•	完成前端忘記密碼 + 重設密碼 UI

⸻

### Strategy D：整合 Google SSO（OIDC）

Actions：
•	/auth/google/login 導向 Google OAuth
•	callback：交換 code → 建立/查詢 user → 建立 session
•	設定 HttpOnly refresh cookie
•	Redirect 帶 token 回前端
•	前端 callback 儲存 token → 完成登入

⸻

### Strategy E：強化前端 Auth 架構

Actions：
•	建立 httpClient wrapper 統一 token 附帶
•	401 → 自動 refresh + retry
•	authStore 儲存並恢復 session token
•	完善 /user/+layout.ts SSR guard（後續 Milestone 會持續改良）

⸻

### Strategy F：Observability / Debugging 能力

Actions：
•	mail_logs table
•	session cleanup cron
•	統一錯誤回傳結構
•	未來後台會新增 Session Inspector（於 Admin Milestone）

