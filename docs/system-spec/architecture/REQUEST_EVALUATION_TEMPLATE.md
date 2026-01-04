# C. REQUEST_EVALUATION_TEMPLATE.md（v0.1）

> 這個模板的真正用途不是「寫需求」，
> 而是幫你判斷：要不要做、現在做、還是永遠不做。
> 不論對人，還是對未來的 AI，都一樣有效。

---

## 0. 使用說明（非常重要，請先讀）

本模板不是需求申請表。

本模板的目的，是判斷一個想法「應該落在哪一層」。

填完後，允許的結論只有三種：

- ✅ Accept（現在做）
- ⏸ Defer（之後再說）
- ❌ Reject（不屬於這個平台）

---

## 1. 基本資訊

- Request Title：
- 提出人（Human / AI / Yourself）：
- 日期：
- 相關 Milestone（M2 / M3 / M4 / M5 / Product）：

---

## 2. 問題陳述（Problem, not Solution）

> 請用一句話描述你想解決的問題。
> ❌ 不要描述你想加什麼功能
> ✅ 只說「現在卡住的是什麼」

Problem statement：

檢查點（必須通過）：

- [ ] 不包含任何技術方案名詞
- [ ] 不包含 UI/UX 描述
- [ ] 不假設一定要放在 platform

---

## 3. Platform Charter 檢查（最重要的一關）

### 3.1 是否屬於「平台一定負責」？

請勾選所有適用項目：

- [ ] Identity & Access
- [ ] Content & Asset Abstraction
- [ ] Event & Behavior Capture
- [ ] Auditability & Traceability
- [ ] Observability & System Health
- [ ] Governance & Evolution

👉 如果全部都沒勾到，直接 Reject（產品層需求）

---

### 3.2 是否踩到「平台永遠不負責」？

只要任一項為「是」，直接 Reject。

- [ ] 是否包含產品業務語意？
- [ ] 是否包含 UI / UX 決策？
- [ ] 是否涉及商業模式或定價？
- [ ] 是否屬於 AI 策略 / 推薦邏輯？
- [ ] 是否試圖評價內容品質或價值？

---

## 4. 跨產品性檢查（Platform vs Feature）

請回答（用一句話即可）：

這個需求至少會被哪兩種產品共用？

- Product A：
- Product B：

👉 如果只能想到一個產品，原則上 Defer 或 Reject

---

## 5. Milestone MVP 衝突檢查（Stop-Loss 關卡）

### 5.1 目前所在 Milestone

- [ ] M2 – Admin + RBAC
- [ ] M3 – CMS + Assets
- [ ] M4 – Behavior Layer
- [ ] M5 – CI/CD & Deploy

### 5.2 是否超出該 Milestone 的 MVP？

- [ ] 會
- [ ] 不會
- [ ] 不確定

👉 若「會」或「不確定」，請回答：

> 如果現在不做，是否會在 6–12 個月內逼迫平台重構？

- [ ] 是 → 可考慮 Accept
- [ ] 否 → 一律 Defer

---

## 6. 不可逆性檢查（Architecture Cost）

請簡短回答：

這個決策是否會限制未來設計空間？
若做錯，回滾成本是否高？

👉 若「高不可逆成本 + 非 MVP」，Reject

---

## 7. 決策結論（只能選一個）

- [ ] ✅ Accept（納入目前 Milestone / Platform）
- [ ] ⏸ Defer（列入 Backlog，標註 revisit 條件）
- [ ] ❌ Reject（明確不屬於平台責任）

決策理由（必填，一段話即可）：

---

## 8. 若 Defer，請定義「重新評估條件」

> 沒有條件的 defer = 永遠拖延

Revisit when：

- [ ] 下一個 Milestone 完成
- [ ] 第一個產品上線
- [ ] 出現第二個需要此能力的產品
- [ ] 其他（請寫）
