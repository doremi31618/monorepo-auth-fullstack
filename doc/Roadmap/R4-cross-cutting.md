好的！以下是 Milestone 4：Cross-cutting 能力（排程紀錄、Audit Log、健康檢查、可觀測性） 的完整整理版。
格式與前面 0、1、2、3 完全一致，可以直接放到你的 PRD / System Design / Roadmap 文檔中。

⸻

# 🧱 Milestone 4 — Cross-cutting 能力（排程紀錄、Audit Log、Health Check、Observability）

⸻

## 🎯 Goal（目標）

在系統進入多模組時期（Auth、Admin、CMS 等）後，必須建立跨模組、跨功能的 系統級能力，確保：
	•	問題可以被追蹤（Audit Log）
	•	排程行為可觀測、可 Debug（Scheduler Log）
	•	系統健康狀態可監控（Health Check & Monitoring）
	•	運行過程有完整紀錄（Core Logging）
	•	未來能整合 APM（如 Datadog、OpenTelemetry）

此 Milestone 的目標是把「產品級系統」需要的維運基礎建設全部打好，讓你的 SaaS 產品能安全地支持客戶、Log 與維運能快速定位問題、未來能支援監控與 SLA 要求。

⸻

## ⚠️ Feasibility 補充（落地方案與資料治理）
	•	先選擇觀測性堆疊：OTel SDK + Collector、Prometheus + Grafana（metrics）、Sentry（error），避免自行實作 log/metrics UI
	•	Log/事件保存政策：定義保留天數、PII/敏感欄位遮罩與刪除策略；Audit/Job log 不應存原始敏感內容
	•	Job 追蹤：優先用既有排程框架的 hook/中介層記錄執行，不重造複雜 UI；重試與告警策略需明確
	•	事件匯流排：v1 可用簡易 EventEmitter，保留接口讓日後可替換成 MQ；避免將商業邏輯綁死在 in-memory bus
	•	健康檢查與告警：/health 需對應監控告警規則；SMTP/S3 這類外部依賴要有 timeout 與降級策略

⸻

## ✅ 驗收方式（Acceptance Criteria）

⸻

### 1. 排程紀錄（Scheduler Log）

（你先前給的欄位需求會納入）
	•	建立 system_schedule_log table
包含：
	•	job_name
	•	start_time
	•	end_time
	•	duration
	•	status（success / failed）
	•	log_level
	•	message / response snippet
	•	created_at
	•	所有排程（使用 Cron / ScheduleModule）會自動紀錄執行紀錄
	•	提供 API / Admin UI 查看排程紀錄
	•	排程失敗會記錄錯誤細節
	•	每天的排程成功/失敗率可在後台查看（可選）

⸻

### 2. Audit Log（操作紀錄）
	•	建立 audit_logs table
包含：
	•	user_id
	•	action（create/update/delete/login/logout…）
	•	resource_type（user/post/role…）
	•	resource_id
	•	changes（JSON）
	•	ip
	•	user_agent
	•	timestamp
	•	Admin 有 UI 可查看最近操作紀錄
	•	RBAC 整合（無權限的 user 不可看）
	•	系統自動記錄以下事件：
	•	user login / logout
	•	cms post create/update/publish
	•	user management（role updated 等）

⸻

### 3. Health Check（健康檢查）
	•	建立 /health endpoint（NestJS Health Module）
	•	Health check 包含：
	•	DB connected
	•	Redis（如有）
	•	Storage（S3 or local）
	•	Mail SMTP service
	•	提供詳細版 health check /health/details
	•	Admin UI 顯示 health check 狀態（可選）

⸻

### 4. Observability（可觀測性：Log / Metrics / Tracing）
	•	Core Logger 支援 JSON 格式，並可輸出到檔案或 STDOUT
	•	所有 API 會自動記錄：
	•	request path
	•	method
	•	status
	•	duration
	•	user id
	•	提供初版 Metrics 端點（可選）：
/metrics（供 Prometheus 或 Grafana 使用）
	•	重要事件（如 publish、role update）自動寫入 Log Stream
	•	提供 Error Stack Log（可整合 Sentry 未來）

⸻

### 5. Error Monitoring（錯誤監控）
	•	建立錯誤捕捉層（Global Exception Filter in Core）
	•	所有錯誤具有唯一追蹤代號（traceId）
	•	API 回傳包含 traceId，方便查 Log
	•	錯誤會紀錄到 error_logs（可選）
	•	可以整合到外部服務（下一版支持 Sentry）

⸻

### 6. 系統事件（System Events）
	•	建立 SystemEventService（統一發送系統事件）
	•	其他模組可發事件：
	•	EVENTS.user.created
	•	EVENTS.post.published
	•	EVENTS.role.updated
	•	可未來整合訊息隊列（RabbitMQ / Kafka）

⸻

## 🎯 策略與行動（Strategy → Actions）

⸻

### Strategy A：排程紀錄機制（Scheduler Logging System）

Actions：
	•	建立排程 wrapper（類 AOP）
JobRunner.run('jobName', () => ...)
	•	每個 Cron Job 改用 JobRunner
	•	自動紀錄：
	•	開始時間
	•	結束時間
	•	耗時
	•	錯誤（如有）
	•	管理員可在後台查看排程紀錄
	•	支援篩選：
	•	job_name
	•	status
	•	date range

⸻

### Strategy B：操作紀錄（Audit Log System）

Actions：
	•	實作 AuditService.log(user, action, resource, changes)
	•	在以下場景中自動寫入 Audit Log：
	•	登入/登出
	•	User CRUD
	•	Role/Permission 修改
	•	CMS Post publish/update
	•	Admin UI 顯示：
	•	user
	•	action
	•	resource
	•	timestamp
	•	ip/user_agent

⸻

### Strategy C：健康檢查（Health Check Infrastructure）

Actions：
	•	導入 @nestjs/terminus
	•	實作：
	•	DBHealthIndicator
	•	MailHealthIndicator
	•	StorageHealthIndicator
	•	建立兩條路由：
	•	/health（簡易）
	•	/health/details（完整）
	•	Admin UI 加上 Health 狀態卡片

⸻

### Strategy D：系統可觀測性（Logging / Metrics / Tracing）

Actions：
	•	Core Logger（Milestone 1）擴充：
	•	JSON Output
	•	Request ID（traceId）
	•	Request Logging Interceptor
	•	Response Time 計算
	•	/metrics 端點（Prometheus 格式）
	•	建置 log 格式：

{
  "time": "...",
  "level": "info",
  "userId": 123,
  "method": "POST",
  "path": "/cms/posts",
  "duration": 32,
  "status": 201
}


⸻

### Strategy E：例外與錯誤監控（Exception Monitoring）

Actions：
	•	GlobalExceptionFilter 加強：
	•	加入 traceId
	•	寫 error log
	•	前端回傳格式統一
	•	可選：
	•	Sentry integration
	•	Slack error alert
	•	ErrorLog table（可選）

⸻

### Strategy F：系統事件中心（Event Bus）

Actions：
	•	建立 EventBus（簡易 Observer pattern）
	•	Moduels 可 dispatch 事件：

this.eventBus.emit('post.published', payload);

	•	其他模組可監聽：

this.eventBus.on('post.published', handler);

	•	未來可改接 RabbitMQ / Kafka

⸻

### Strategy G：文件化與 Developer Experience

Actions：
	•	CROSS_CUTTING_GUIDE.md 文件
	•	如何 log 排程
	•	如何寫 audit log
	•	如何檢查 health
	•	如何讀 traceId
	•	加入 examples
	•	Admin 介面加入維運監控頁面（簡易版）

⸻

## 📦 Milestone 4 Deliverables（可產出物）
	•	Scheduler Log System（資料庫＋後端＋UI）
	•	Audit Log System（資料庫＋後端＋UI）
	•	/health 健康檢查 API
	•	Observability（request log、error log、metrics）
	•	System Events（event bus v1）
	•	Developer Guide《Cross-cutting System Architecture》

⸻

## 🧭 Milestone 4 在 Roadmap 的位置

| Milestone | 名稱                | 狀態   | 內容摘要                               |
|-----------|---------------------|--------|-----------------------------------------|
| **4**     | Cross-cutting 能力  | 計畫中 | 排程紀錄、Audit Log、Health Check、觀測性 |


⸻

如果你願意，我也可以幫你整理：

🔥 Milestone 5：部署 & 版本管理（Versioning / CI-CD / Infrastructure）

或

🗺️ 全 Roadmap 的 Mermaid 圖表（甘特圖 / Architecture Map）

你想要哪一個？
