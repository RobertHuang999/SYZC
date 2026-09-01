# 开锁审批 Mock 数据示例（V1.2 · 6.2）

> 对齐 PRD 评审结论：配置范围仅「指定设备」、审批方式固定「任一人通过」、申请详情不展示关联事务。

---

## 1. 审批配置（`unlock-approval-configs`）

| 配置编号 | 配置名称 | 适用设备 | 审批方式 | 超时 | 版本 | 状态 |
|:---|:---|:---|:---|:---:|:---:|:---:|
| UNLOCK-CFG-001 | A库指定挂锁审批 | LK-2024-0082 / LK-0085 / FACE-01（3 台） | 任一人通过 | 12h | v2 | 已启用 |
| UNLOCK-CFG-002 | 华东入口人脸审批 | FACE-01（1 台） | 任一人通过 | 24h | v1 | 已启用 |
| UNLOCK-CFG-003 | 华南监管挂锁审批 | LK-HN-001 / LK-HN-002 / FACE-HN-01 / LK-HB-001 / LK-HB-002（5 台） | 任一人通过 | 48h | v1 | 已停用 |

### 匹配规则（C01–C03）

| 规则 | 条件 | 结果 |
|:---|:---|:---|
| C01 | 设备编码精确命中某条**已启用**配置的 `deviceCodes` | 进入审批 |
| C02 | 未命中任何已启用配置 | 免审直发 |
| C03 | 同一设备同时命中多条已启用配置 | 阻断提交，提示配置冲突 |

> 6.2 前端不展示「按顺序审批」选项；数据模型保留该字段，Mock 中统一为「任一人通过」。

---

## 2. 开锁申请（`unlock-applies`）

### 2.1 需审批 · 待审批

```json
{
  "applyNo": "UA20260828001",
  "deviceCode": "LK-2024-0082",
  "deviceName": "A库挂锁-01",
  "needsApproval": true,
  "status": "PENDING",
  "configSnapshot": {
    "configNo": "UNLOCK-CFG-001",
    "configVersion": 2,
    "approvalMode": "任一人通过",
    "approvalNodes": "节点1-指定人员 [王五（仓储部）]",
    "timeoutHours": 12
  }
}
```

### 2.2 需审批 · 已通过

```json
{
  "applyNo": "UA20260827020",
  "deviceCode": "LK-2024-0082",
  "needsApproval": true,
  "status": "APPROVED",
  "configSnapshot": {
    "configNo": "UNLOCK-CFG-001",
    "configVersion": 2,
    "approvalMode": "任一人通过"
  },
  "approvalRecords": [
    {
      "nodeOrder": 1,
      "handlerName": "李四",
      "handlerAccount": "li4",
      "result": "通过",
      "processedTime": "2026-08-27 10:45:00"
    }
  ]
}
```

### 2.3 免审直发（C02 未命中）

```json
{
  "applyNo": "UA20260828003",
  "deviceCode": "LOCK-HN-002-003",
  "needsApproval": false,
  "status": "APPROVED",
  "configSnapshot": {
    "configNo": "—",
    "configVersion": 0,
    "approvalMode": "任一人通过",
    "approvalNodes": "免审直发"
  },
  "finalConclusion": "免审直发"
}
```

### 2.4 人脸设备命中 UNLOCK-CFG-002

```json
{
  "applyNo": "UA20260828002",
  "deviceCode": "FACE-01",
  "needsApproval": true,
  "status": "PENDING",
  "configSnapshot": {
    "configNo": "UNLOCK-CFG-002",
    "configVersion": 1,
    "approvalMode": "任一人通过",
    "timeoutHours": 24
  }
}
```

---

## 3. 已废止字段（6.2 不再使用）

| 字段/模块 | 说明 |
|:---|:---|
| `scopeType` / 仓库·库房·分区·全局 | 配置范围已收敛为指定设备 |
| `globalSwitch` | 未绑定位置全局审批已移除 |
| `locationMatchNote` | 改为依赖 `configSnapshot.configNo` 表达命中结果 |
| `transaction` / 关联事务 | 申请详情不展示，Mock 不再写入 |

---

*版本：V1.2 | 更新：2026-08 | 森云科技 SYZC 原型数据*
