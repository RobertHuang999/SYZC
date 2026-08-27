# 设备预警信息_Demo_详情页

> **文档定位**：AI 生成「设备预警信息详情」前端原型的输入文档。
> **字段定义**：见《[设备预警信息字段清单](./设备预警信息字段清单.md)》。
> **线框参考**：[设备预警信息_ASCII_详情页](./设备预警信息_ASCII_详情页.md)
> **移动端对照**：[设备预警信息_Demo_移动端](./设备预警信息_Demo_移动端.md)
> **基准来源**：`03-前端原型demo/B端PC/src/features/device-warning-events/pages/DeviceWarningEventDetailPage.tsx`
> **版本**：V1.3 | 2026-08-24

---

## 1. 页面概述

| 项目 | 内容 |
| :--- | :--- |
| 页面名称 | 设备预警信息详情 |
| 页面目标 | 只读查看单条预警流水完整事实、频次与处置信息；支持弹窗解除与频次抽屉 |
| 菜单路径 | `预警信息 → 设备预警信息 → 详情` |
| 页面路径 | `/预警信息/设备预警信息/详情/:id` |
| 骨架结构 | 页头识别区（Card）→ 基本信息 → 触发事实与位置 → 频次与时间 → 处置信息 → 规则快照 |

> **6.2 Demo 不展示「系统审计」分区**；Version 仅在解除弹窗提交时隐藏携带。
> **无页头副标题**（与列表页区分）。

---

## 2. DetailSection 布局规范（⚠️ 生成必遵）

与 dev 共用组件 `@/shared/components/DetailSection` + `index.css`：

| 层级 | 实现 |
| :--- | :--- |
| 分区 | `DetailSection`：标题 + 内容区 Card |
| 内容区 | `detail-section-content`：**4 列 CSS Grid**（≤1100px → 3 列），`gap: 22px 28px` |
| 单字段 | `DetailField`：**label 在上、value 在下**（`flex-direction: column; gap: 6px`） |
| label 样式 | 13px、`#86909c`（`detail-field-label`） |
| value 样式 | 14px、`#1d2129`（`detail-field-value`） |

```text
┌─ DetailSection: 基本信息 ─────────────────────────────────────────────┐
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   ← 4列 grid         │
│  │事件 ID   │ │规则名称  │ │预警类型  │ │预警子类型│                       │
│  │evt-…    │ │人体入侵  │ │设备图像…│ │行人入侵  │   ← 上名下达           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘                       │
└────────────────────────────────────────────────────────────────────────┘
```

**禁止**：ElDescriptions 横向「左 label 右 value」、或 `el-form` 一行两列的表单行布局。

---

## 3. 页头识别区

```text
{规则名称}   [ {WarningStatusBadge} ]     [ ← 返回 ]  [ 解除预警* ]  [ 查看频次 {N}次 ]
```

容器：`rounded-xl border bg-card p-4`，`lg:flex-row` 左右布局。

### 2.1 按钮规格

| 按钮 | variant | 图标 | 行为 |
| :--- | :--- | :--- | :--- |
| 返回 | outline | ArrowLeft | Link → `/预警信息/设备预警信息` |
| 解除预警 | default | — | 打开 `ReleaseConfirmDialog` |
| 查看频次 N次 | secondary | — | 打开 `TriggerHistoryDrawer` |

### 2.2 页头动作（按状态 · `getDetailHeaderActions`）

| 状态 + 类型 | 展示的操作 |
| :--- | :--- |
| 未处理（有效）+ 允许人工（R14） | 返回 / 解除预警 / 查看频次 |
| 未处理（有效）+ 仅自动恢复 | 返回 / 查看频次 |
| 未处理（无效） | 返回 / 查看频次 |
| 已处理（有效） | 返回 / 查看频次 |

> 瞬态事务（常规通行与操作事务）已处理态 Badge 简写「已处理」。

---

## 4. 基本信息卡片（DetailSection）

| 字段 | 展示规格 |
| :--- | :--- |
| 事件 ID | UUID 只读（`eventUuid`） |
| 规则名称 | 文本 |
| 预警类型 | 6 大类全称 |
| 预警子类型 | 文本（`warningSubType`，详情扩展字段） |
| 预警等级 | `SeverityLevelDisplay`：色块圆点 + `{severityCode} {severityName}` |
| 预警状态 | `WarningStatusBadge`；无效时下方附 `失效原因：{invalidReason}` |

---

## 5. 触发事实与位置卡片

| 字段 | 展示规格 |
| :--- | :--- |
| 所属仓库 | 仓库/库房/分区（`warehouseDetail`） |
| 关联设备 | `{deviceName} ({deviceCode})` |
| 预警内容 | `formatDetailWarningContent`：位置·设备·触发组合文本 |
| 预警抓拍图 | `available` → link 按钮「查看触发抓拍大图」+ ImageIcon；`failed` → 「抓拍失败」；`none` → 「无抓拍图」 |

---

## 6. 频次与时间卡片

| 字段 | 展示规格 |
| :--- | :--- |
| 预警次数 | 橙色 `font-semibold` 可点击按钮 `{N} 次` |
| 查看触发历史 | 同区 `text-primary` 链接，与次数均打开 `TriggerHistoryDrawer` |
| 首次预警时间 | 完整秒级时间 |
| 最近预警时间 | `formatEmptyValue`，空则 `—` |
| 防抖留痕 | Pending→Firing 留痕；无则 `—` |

---

## 7. 处置信息卡片

展示逻辑（`showReleaseMaterials`）：

```text
isClosed = warningStatus === CLOSED_VALID
showReleaseMaterials = isClosed && (situationDescription || sitePhotos.length || releaseSnapshotImage)
```

| 字段 | 展示规格 |
| :--- | :--- |
| 处理时间 | `formatEmptyValue(processedTime)` |
| 处理人 | `formatEmptyValue(processedBy)` |
| 情况说明 | showReleaseMaterials 时展示，否则 `—` |
| 现场照片 | showReleaseMaterials 且有照片时：ImageIcon + 文件名列表，否则 `—` |
| 解除抓拍 | showReleaseMaterials 且有图时：ImageIcon + 文件名，否则 `—` |

> 瞬态自动结案（开锁记录等）通常无解除材料，处置区各字段均为 `—`。

---

## 8. 规则快照卡片

触发时固化，只读（`ruleConfigSnapshot`）：

| 字段 | 展示规格 |
| :--- | :--- |
| 监控阈值 | 如 `图像识别命中行人入侵` / `温度 > 35.0 ℃ 或 < -5.0 ℃` |
| 防抖条件 | 如 `持续超过 3 分钟` / `瞬态事件，无需防抖` |
| 升级策略 | 如 `持续未解除 2 天后 ➔ 李主管(安保部)` |

---

## 9. 解除弹窗（ReleaseConfirmDialog）

挂载于详情页，与列表页共用组件：

| 步骤 | 标题 | 主按钮 | 成功后 |
| :--- | :--- | :--- | :--- |
| confirm | 确认解除 | 确认并填写说明 | — |
| materials | 填写解除说明 | 提交解除 | Toast + navigate 列表页 |

**Toast 文案**：`解除成功 — {ruleName}`

---

## 10. 频次时间轴抽屉（TriggerHistoryDrawer）

| 项目 | 规格 |
| :--- | :--- |
| 容器 | 右侧全高抽屉（`fixed inset-y-0 right-0`，`max-w-xl`） |
| 标题 | `触发历史时间轴 — {ruleName} (共 {N} 次)` |
| 摘要 | 规则 / 设备 / 状态 Badge |
| 表格列 | #、触发时间、采集值/事实、抓拍（预览 link） |
| 底注 | 频次累加不重复通知；升级以首次预警时间为准 |
| 抓拍预览 | Toast「抓拍预览 — 第 {sequence} 次触发」 |

---

## 11. 404 空态

| 元素 | 规格 |
| :--- | :--- |
| 返回 | outline Button + ArrowLeft → 列表页 |
| 提示 | Card 居中「未找到对应的设备预警信息」 |

---

## 12. 状态差异示例

| eventId | 场景 | 页头动作 | 处置信息 |
| :--- | :--- | :--- | :--- |
| evt-002 | 人体入侵 · 未处理有效 | 返回 / 解除预警 / 查看频次 3次 | 全 `—` |
| evt-001 | 库温告警 · 仅自动 | 返回 / 查看频次 24次 | 全 `—` |
| evt-007 | 规则删除遗留 · 无效 | 返回 / 查看频次 1次 | 失效原因展示 |
| evt-015 | 人脸认证失败 · 已处理 | 返回 / 查看频次 1次 | 材料回显 |
| evt-003 | 开锁记录 · 瞬态已处理 | 返回 / 查看频次 1次 | 全 `—`，Badge「已处理」 |

---

## 13. Mock 数据

### evt-002 人体入侵（推荐 Demo 默认详情）

| 字段 | 取值 |
| :--- | :--- |
| 规则名称 | 人体入侵 |
| 预警类型 | 设备图像识别预警 |
| 预警子类型 | 行人入侵 |
| 预警等级 | L5 紧急危险 |
| 关联设备 | CAM1 (DEV-CAM-0001) |
| 预警次数 | 3 |
| 首次预警时间 | 2026-08-20 12:40:00 |
| 最近预警时间 | 2026-08-20 13:05:00 |
| 防抖留痕 | Pending 2026-08-20 12:40:00 → Firing 2026-08-20 12:43:00（持续 180 秒） |
| 状态 | 未处理（有效） |
| Version | 3 |

### evt-001 库温告警（仅自动恢复对照）

| 字段 | 取值 |
| :--- | :--- |
| 规则名称 | 库温告警 |
| 预警次数 | 24 |
| 状态 | 未处理（有效） |
| 页头 | 无「解除预警」 |

---

## 14. 自检清单

1. ✅ 字段来自字段清单第一章 + 第三章追溯字段
2. ✅ 页头动作来自 `getDetailHeaderActions` / 第五章动作矩阵
3. ✅ **DetailField 上 label 下 value + 4 列 grid**，禁止横向 Descriptions 行
4. ✅ 解除弹窗 + 频次抽屉 + 404 空态对齐 dev 组件
5. ✅ 处置信息展示条件对齐 `showReleaseMaterials` 逻辑
6. ✅ 未新增业务规则
