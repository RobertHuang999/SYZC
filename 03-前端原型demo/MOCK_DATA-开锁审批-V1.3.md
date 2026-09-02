# 开锁审批 Mock 数据示例（V1.3 · 6.2）

> 对齐：配置仅「指定设备」、审批「任一人通过」、详情不含关联事务；凭证 **6 态**；挂锁/人脸分轨（V2.2）。

---

## 1. 审批配置（`unlock-approval-configs`）

| 配置编号 | 配置名称 | 适用设备 | 审批方式 | 超时 | 版本 | 状态 |
|:---|:---|:---|:---|:---:|:---:|:---:|
| UNLOCK-CFG-001 | A库指定挂锁审批 | LK-2024-0082 / LK-0085 / FACE-01（3 台） | 任一人通过 | 12h | v2 | 已启用 |
| UNLOCK-CFG-002 | 华东入口人脸审批 | FACE-01（1 台） | 任一人通过 | 24h | v1 | 已启用 |

---

## 2. 凭证状态（6 态 · 分轨）

| 状态 | 挂锁 | 人脸 |
|:---|:---|:---|
| `DELIVERED` 已下发 | 密码服务成功即已下发；**短信失败仍为已下发** | 三方下发成功 |
| `GEN_FAILED` 生成失败 | 密码服务失败 | 同左 |
| `DELIVERY_FAILED` 密码下发失败 | **不使用** | 三方下发失败；详情**不展示密码** |
| 重新获取密码 | 生成失败时可重试 | 生成失败或下发失败时可重试 |

---

## 3. 开锁申请样例（`unlock-applies`）

### 3.1 待审批 · 挂锁

| 字段 | 值 |
|:---|:---|
| applyNo | UA20260828001 |
| deviceType | 挂锁门禁 |
| status | PENDING |
| credential.status | NOT_GENERATED |

### 3.2 挂锁 · 已通过 · 已下发

| 字段 | 值 |
|:---|:---|
| applyNo | UA20260827020 |
| deviceType | 挂锁门禁 |
| status | APPROVED |
| credential.status | DELIVERED |
| 说明 | 详情展示密码；短信成败不进凭证状态 |

### 3.3 人脸 · 已通过 · 已下发

| 字段 | 值 |
|:---|:---|
| applyNo | UA20260827015 |
| deviceType | 人脸门禁 |
| deviceCode | FACE-01 |
| status | APPROVED |
| credential.status | DELIVERED |

### 3.4 人脸 · 三方下发失败

| 字段 | 值 |
|:---|:---|
| applyNo | UA20260827021 |
| deviceType | 人脸门禁 |
| deviceCode | FACE-01 |
| status | APPROVED |
| credential.status | DELIVERY_FAILED |
| deliveryFailReason | 三方门禁平台下发超时，请重新获取 |
| 说明 | 无 password 字段；详情仅失败原因 + 重新获取 |

### 3.5 免审直发

| 字段 | 值 |
|:---|:---|
| applyNo | UA20260828003 |
| needsApproval | false |
| credential.status | DELIVERED |

---

## 4. 已废止（6.2）

| 项 | 说明 |
|:---|:---|
| 凭证中间态 | 生成中 / 已生成 / 已使用 / 已撤销 |
| 短信状态字段 | 本模块不维护；挂锁短信失败不改变凭证状态 |
| 关联事务 | 详情不展示 |

---

*版本：V1.3 | 更新：2026-09-02 | 森云科技 SYZC 原型数据*
