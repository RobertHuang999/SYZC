# 开锁审批 Mock 数据示例（V1.6 · 6.2）

> **文件名保留 V1.3**；文档内容版本 **V1.6**（2026-09-02）。dev Mock 源：`B端PC` / `B端H5` 的 `unlock-applies-seed`，共 **17 条**。

---

## 1. 审批配置（`unlock-approval-configs`）

| 配置编号 | 配置名称 | 适用设备 | 审批方式 | 超时 | 版本 | 状态 |
|:---|:---|:---|:---|:---:|:---:|:---:|
| UNLOCK-CFG-001 | A库指定挂锁审批 | LK-2024-0082 / LK-0085 / FACE-01（3 台） | 任一人通过 | 12h | v2 | 已启用 |
| UNLOCK-CFG-002 | 华东入口人脸审批 | FACE-01（1 台） | 任一人通过 | 24h | v1 | 已启用 |

---

## 2. 凭证状态（5 态 · 统一规则）

| 状态 | 挂锁 | 人脸 |
|:---|:---|:---|
| `NOT_GENERATED` 未生成 | 待审批 / 终态未生成凭证 | 同左 |
| `DELIVERED` 已下发 | 密码服务成功即已下发 | 密码服务成功即已下发 |
| `GEN_FAILED` 生成失败 | 密码服务调用失败 | 同左（**不含**三方下发失败） |
| `EXPIRED` 已过期 | 凭证超过有效期 | 同左 |
| `SUPERSEDED` 已失效（被覆盖） | 设备密码被新凭证覆盖 | 同左 |
| 重新获取密码 | 生成失败时可重试 | 同左 |

> **「下发失败」仅人脸门禁**（三方平台下发失败；凭证仍为已下发）。**智能挂锁无「下发失败」概念**。
>
> **6.2 废止**：`DELIVERY_FAILED`（密码下发失败凭证态）

---

## 3. 场景覆盖矩阵（Mock 索引）

| 场景 | applyNo | 设备 | 申请状态 | 凭证状态 | 验证要点 |
|:---|:---|:---|:---|:---|:---|
| 待审批 | UA20260828001 | 挂锁 | PENDING | NOT_GENERATED | 可撤回 |
| 待审批 | UA20260828002 | 人脸 | PENDING | NOT_GENERATED | 可撤回 |
| 免审直发·已下发 | UA20260828003 | 挂锁 | APPROVED | DELIVERED | needsApproval=false |
| 免审直发·已下发 | UA20260827016 | 人脸 | APPROVED | DELIVERED | needsApproval=false |
| 需审批·已下发 | UA20260827020 | 挂锁 | APPROVED | DELIVERED | 密码+复制 |
| 需审批·已下发 | UA20260827015 | 人脸 | APPROVED | DELIVERED | 密码+复制 |
| **人脸·三方下发失败** | UA20260826010 | 人脸 | APPROVED | **DELIVERED** | remark 说明三方失败；凭证仍为已下发，详情有密码 |
| **挂锁·生成失败** | UA20260826008 | 挂锁 | APPROVED | GEN_FAILED | 失败原因 + 重新获取密码 |
| **人脸·生成失败** | UA20260826011 | 人脸 | APPROVED | GEN_FAILED | 失败原因 + 重新获取密码 |
| **挂锁·凭证过期** | UA20260826012 | 挂锁 | APPROVED | EXPIRED | 失效提示，不展示密码 |
| **人脸·凭证过期** | UA20260827021 | 人脸 | APPROVED | EXPIRED | 失效提示，不展示密码 |
| **挂锁·被覆盖** | UA20260822004 | 挂锁 | APPROVED | SUPERSEDED | 失效提示 |
| **人脸·被覆盖** | UA20260826013 | 人脸 | APPROVED | SUPERSEDED | 失效提示 |
| 已驳回 | UA20260826006 | 挂锁 | REJECTED | NOT_GENERATED | 展示驳回原因 |
| 已撤回 | UA20260826003 | 挂锁 | WITHDRAWN | NOT_GENERATED | — |
| 申请超时失效 | UA20260825012 | 挂锁 | EXPIRED | NOT_GENERATED | 审批超时 |
| 申请作废 | UA20260824007 | 挂锁 | VOIDED | NOT_GENERATED | 设备/位置失效 |

---

## 4. 凭证场景详表

### 4.1 挂锁 · 已通过 · 生成失败（密码服务）

| 字段 | 值 |
|:---|:---|
| applyNo | UA20260826008 |
| credential.status | GEN_FAILED |
| genFailReason | 密码服务调用超时 |
| 说明 | 挂锁仅有生成失败/已下发等 5 态；**无「下发失败」** |

### 4.2 人脸 · 已通过 · 生成失败（密码服务）

| 字段 | 值 |
|:---|:---|
| applyNo | UA20260826011 |
| credential.status | GEN_FAILED |
| genFailReason | 密码服务返回：设备暂不可用 |
| 说明 | **非**三方下发失败；详情展示失败原因 + 重新获取密码 |

### 4.3 人脸 · 已通过 · 已下发（三方下发失败）

| 字段 | 值 |
|:---|:---|
| applyNo | UA20260826010 |
| credential.status | DELIVERED |
| remark | 三方门禁终端下发失败（凭证仍为已下发，详情可查看密码） |
| 说明 | **「下发失败」仅人脸存在**；不改变凭证状态 |

### 4.4 挂锁 · 已通过 · 凭证已过期

| 字段 | 值 |
|:---|:---|
| applyNo | UA20260826012 |
| credential.status | EXPIRED |
| invalidReason | 凭证已过期，无法查看密码 |

### 4.5 人脸 · 已通过 · 凭证已过期

| 字段 | 值 |
|:---|:---|
| applyNo | UA20260827021 |
| credential.status | EXPIRED |
| invalidReason | 凭证已过期，无法查看密码 |

### 4.6 挂锁 · 已通过 · 被覆盖

| 字段 | 值 |
|:---|:---|
| applyNo | UA20260822004 |
| credential.status | SUPERSEDED |
| invalidReason | 设备密码已被更新，原密码已失效 |

### 4.7 人脸 · 已通过 · 被覆盖

| 字段 | 值 |
|:---|:---|
| applyNo | UA20260826013 |
| credential.status | SUPERSEDED |
| invalidReason | 设备密码已被更新，原密码已失效 |

---

## 5. 已废止（6.2）

| 项 | 说明 |
|:---|:---|
| 凭证中间态 | 生成中 / 已生成 / 已使用 / 已撤销 |
| 密码下发失败（凭证态） | `DELIVERY_FAILED`（V2.4 废止） |
| 挂锁「下发失败」样例 | 智能挂锁无此概念，不设 Mock |
| 关联事务 | 详情不展示 |

---

*版本：V1.6 | 更新：2026-09-02 | 森云科技 SYZC 原型数据*
