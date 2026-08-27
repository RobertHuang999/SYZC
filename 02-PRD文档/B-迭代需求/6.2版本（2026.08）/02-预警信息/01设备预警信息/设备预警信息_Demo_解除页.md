# 设备预警信息_Demo_解除页

> **文档定位**：AI 生成「设备预警信息解除预警」前端原型的输入文档（本模块唯一写操作，替代配置类「新增/编辑页」）。
> **字段定义**：见《[设备预警信息字段清单](./设备预警信息字段清单.md)》第二章。
> **线框参考**：[设备预警信息_ASCII_解除页](./设备预警信息_ASCII_解除页.md)
> **移动端对照**：[设备预警信息_Demo_移动端](./设备预警信息_Demo_移动端.md) §3 解除页
> **基准来源**：`03-前端原型demo/B端PC` ReleaseConfirmDialog + DeviceWarningEventReleasePage + ReleaseMaterialForm
> **版本**：V1.2 | 2026-08-24

> **无新增/编辑页**：流水由引擎自动生成；用户不可手动新增或编辑触发事实。

---

## 1. 页面概述

| 项目 | 内容 |
| :--- | :--- |
| 写操作名称 | 解除预警 |
| 页面目标 | 人工核销未处理有效告警，提交解除材料并归档整轮触发 |
| PC 主流程 | 列表/详情页 `ReleaseConfirmDialog` 弹窗（见 §2） |
| 完整页路径 | `/预警信息/设备预警信息/解除/:id`（备用，见 §3） |
| 移动端路径 | `/m/iot/device-warning-events/{id}/release`（见移动端 Demo） |

---

## 2. DetailSection / ReleaseMaterialForm 布局规范（⚠️ 生成必遵）

与 [详情页 Demo §2](./设备预警信息_Demo_详情页.md#2-detailsection-布局规范生成必遵) 共用 `@/shared/components/DetailSection` + `index.css`。

| 区域 | 组件 | 排版 |
| :--- | :--- | :--- |
| 预警摘要 / 触发事实（只读） | `DetailField` | **上 label 下 value**；4 列 CSS Grid（≤1100px → 3 列） |
| 解除材料（可填） | `ReleaseMaterialForm` | 作为非 `DetailField` 子节点 **`grid-column: 1 / -1` 跨满整行** |
| 弹窗材料步 | `ReleaseMaterialForm` | Dialog 内 `space-y-5` 纵向堆叠 |

### 2.1 ReleaseMaterialForm 单字段结构

```text
* 情况说明                    ← Label 在上（含必填 *）
┌─────────────────────────┐
│ Textarea                │   ← 控件在下
└─────────────────────────┘
最多 200 字，必填    28/200

现场照片                      ← Label 在上
选填，jpg/png/jpeg…           ← 辅助说明
[ 上传照片 ]  photo.jpg x     ← 控件在下
```

**禁止**：`el-form-item` 左 label 右控件、ElDescriptions 横向描述列表。

---

## 3. PC 弹窗解除（主流程 · ReleaseConfirmDialog）

### 3.1 组件结构

两步 Dialog，挂载于列表页/详情页：

| 步骤 | 标题 | 主按钮 |
| :--- | :--- | :--- |
| confirm | 确认解除 | 确认并填写说明 |
| materials | 填写解除说明 | 提交解除 |

### 3.2 第一步 — 确认

| 元素 | 规格 |
| :--- | :--- |
| 文案 | 确认解除该轮次告警？提交后将归档整轮 {N} 次触发。 |
| 取消 | 关闭弹窗，不改变列表/详情状态 |

### 3.3 第二步 — 填写材料

复用 `ReleaseMaterialForm`（见 §2.1 排版）：

| 字段 | 控件类型 | 必填 | 详细规格 |
| :--- | :--- | :---: | :--- |
| 情况说明 | `Label` + `Textarea` | 是 | ≤200 字；placeholder「请填写现场核实情况」；字数计数 |
| 现场照片 | `Label` + 上传 | 否 | jpg/png/jpeg，单张≤5MB，最多 10 张；可移除已选 |
| 解除抓拍 | `Label` + 文案 | 自动 | 「提交时将联动同位置监控即时抓拍，提交后可在详情页查看」 |
| Version | `input hidden` | 是 | R12 乐观锁 |

**辅助提示**（虚线边框区块）：确认解除后将归档整轮 {N} 次触发，状态变为「已处理（有效）」。

**成功**：Toast「解除成功 — {规则名称}」→ 列表移除事件 / 详情返回列表。

---

## 4. PC 完整页解除（备用 · DeviceWarningEventReleasePage）

| 项目 | 内容 |
| :--- | :--- |
| 页面路径 | `/预警信息/设备预警信息/解除/:id` |
| 进入条件 | 导航 state 须含 `{ from: 'list'|'detail', releaseConfirmed: true }`，否则重定向回来源页 |
| 骨架结构 | 页头 Card → 预警摘要 → 触发事实 → 解除材料 |

### 4.1 页头操作栏

Card 容器：左侧 `h1`「解除预警 — {规则名称}」+ `hintText` 副文案；右侧按钮组。

| 按钮 | variant | 行为 |
| :--- | :--- | :--- |
| 返回 | outline + ArrowLeft | 有未保存变更时 confirm 后离开 |
| 取消 | outline | 同返回 |
| 确认解除 | default | 直接校验并提交（无二次 Dialog） |

### 4.2 预警摘要（DetailSection · 只读）

`DetailField` 4 列 grid，字段同详情页：Event ID、规则名称、类型/子类型、等级、状态、预警次数（链至时间轴）、首次/最近时间。

### 4.3 触发事实（DetailSection · 只读）

`DetailField`：所属仓库、关联设备、预警内容（可跨列）、预警抓拍图（可跨列）。

### 4.4 解除材料（DetailSection · 可填）

`<DetailSection title="解除材料"><ReleaseMaterialForm … /></DetailSection>`

Form 跨列占满，排版见 §2.1。

---

## 5. 入口与权限

| 入口 | 来源 |
| :--- | :--- |
| 弹窗解除 | 列表行「解除」；详情页「解除预警」 |
| 完整页解除 | 携带 releaseConfirmed 导航态进入 |

**不可进入条件**（R14）：仅自动恢复类型、已处理、未处理无效 → 不展示入口或路由拦截 + Toast。

---

## 6. 保存校验

| 规则 | 反馈 |
| :--- | :--- |
| R04 情况说明空 | 字段红字「请填写情况说明」 |
| R04 超 200 字 | 「情况说明不可超过 200 字」 |
| R04 照片超限 | alert 文件约束提示 |
| R11 非未处理有效 | Toast「该预警已处理或已失效」 |
| R12 Version 冲突 | Toast「数据已被他人修改，请刷新后重试」 |
| R14 仅自动类型 | 不展示解除入口 |

**成功**：Toast「解除成功」→ 返回详情页或列表页。

---

## 7. Mock 数据

对齐 dev `evt-002`「人体入侵 3 次」：

| 字段 | 取值 |
| :--- | :--- |
| 规则名称 | 人体入侵 |
| 预警类型 | 设备图像识别预警 |
| 预警子类型 | 行人入侵 |
| 预警等级 | L5 紧急危险 |
| 关联设备 | CAM1 (DEV-CAM-0001) |
| 预警次数 | 3 |
| Version | 3 |
| 情况说明示例 | 经现场安保核实，系例行巡库检修，穿戴合规工装无异常 |

---

## 8. 自检清单

1. ✅ 可填字段来自字段清单第二章
2. ✅ PC 主流程为弹窗解除，完整页为备用
3. ✅ 只读区 `DetailField` 上 label 下 value + 4 列 grid
4. ✅ 可填区 `ReleaseMaterialForm` 跨列 + Label 在上
5. ✅ 禁止横向 Descriptions / 表单行布局
6. ✅ 未新增业务规则
