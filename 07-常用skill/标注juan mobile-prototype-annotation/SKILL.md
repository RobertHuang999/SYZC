---
name: mobile-prototype-annotation
description: Build, refine, or validate an interactive mobile or H5 prototype annotation workspace from product requirements, page lists, business rules, API contracts, and reference screenshots. Features left page directory, center phone preview, outer canvas requirement inspector (zero screen obstruction), and right PRD/field/rule drawer with linked highlighting, mock data, responsive phone sizing, and local browser verification.
---

# 📱 Mobile Prototype Annotation & Canvas Inspector (移动端原型打点与画布检查器规范)

为移动端（H5 / 小程序 / App）静态原型提供一套企业级、无侵入式、**屏幕外大画布联动（Canvas Inspector）**的交互打点与四维需求规格看板体系。打通“手机真实操作流 - 原位打点 - 屏幕外大画布需求审查 - 字段清单 - PRD文档 - 业务规则规格”的全链路闭环。

---

## 🏗️ 1. 核心架构与布局体系 (Workbench Architecture)

移动端原型工作台采用 **“左侧页面导航 + 中间真机视口 + 屏幕外大画布检查器 + 右侧四维抽屉”** 架构：

```
WorkbenchLayout (桌面端工作台大画布)
├── Aside Left (左侧页面与业务流导航)
│   ├── 页面快速切换入口
│   └── 当前页面打点/文档数量统计
├── Main Canvas (中间主画布区域)
│   ├── Top Header (机型尺寸 375/390/414px 切换、打点开关 ON/OFF、打开抽屉按钮)
│   ├── Phone Frame (居中真机视口：带状态栏与灵动岛，纯净无遮挡)
│   │   └── PrototypeAnnotationTarget (业务组件原位打点徽标，点击触发外侧画布检查器)
│   └── CanvasAnnotationInspector (⭐ 手机屏幕外侧大画布需求检查器，440~560px 宽屏大字号舒适阅读)
│       ├── 顶部打点标号 (#N) + 标题 + 维度标签 + 绑定靶点 ID
│       ├── 核心事实需求摘要卡片 (蓝色高亮)
│       ├── 业务规格分项细节 (结构化 Group 细则 + Mermaid 流程图直读)
│       └── 底部切换条 (◀ 上一条打点 · 下一条打点 ▶ · 手机靶点聚焦)
└── AnnotationSidebarDrawer (右侧全局全量需求抽屉)
    ├── Tab 1: 需求打点清单 (支持搜索、分类过滤、一键全部折叠/展开)
    ├── Tab 2: 字段清单 (直接渲染真实 Markdown 表格)
    ├── Tab 3: PRD 需求文档 (直读 Markdown)
    └── Tab 4: 业务规则规格 (直读状态机与风控规则)
```

---

## 🎯 2. 交互核心原则：手机零遮挡 + 画布沉浸式阅读

### 2.1 痛点与解决
* **传统问题**：移动端屏幕通常仅 375px~414px 宽，如果在手机屏幕内部弹出 tooltip 或 Modal，会严重遮挡操作流，且字号狭小、排版拥挤无法查阅复杂表格和流程图。
* **现代解法**：
  1. **手机内纯净无遮挡**：手机屏幕内仅渲染精致的红色数字气泡（如 `①`、`②`、`③`），不弹出内部弹窗；
  2. **屏幕外大画布检查器 (Canvas Inspector)**：点击任意打点，立即在**手机屏幕右侧的宽敞画布空间**优雅滑出宽度为 `440px ~ 560px` 的独立检查器面板；
  3. **手机元素联动高亮**：手机内被点击的目标 DOM 节点获得脉冲蓝光（`ring-2 ring-blue-500`），实现“左边看真实操作，右边看详尽规则”；
  4. **连续审查流 (Next / Prev)**：检查器底部提供 `◀ 上一个打点` 和 `下一个打点 ▶`，产品经理与研发无需在手机上反复寻找打点即可像翻书一样连续审查全页规则。

---

## 📋 3. 数据定义与挂载标准

### 3.1 需求打点数据结构 (`*.annotations.ts`)

```ts
export type AnnotationKind = '页面' | '交互' | '字段' | '规则' | '待确认'

export type PrototypeAnnotation = {
  id: string              // 唯一标识 (如: "device-warning-frequency")
  targetId?: string        // 关联的目标组件 ID (如: "device-warning-table")
  number: number          // 页面内唯一且连续的数字编号 (1, 2, 3...)
  kind: AnnotationKind    // 分类维度
  title: string           // 打点标题 (如: "预警触发频次与时间轴")
  content: string         // 核心事实需求摘要
  details: Array<{        // 结构化细则分组
    title: string
    items: Array<{
      label: string
      content: string     // 支持普通文本、表格 Markdown 或 Mermaid 图表代码
    }>
  }>
}
```

### 3.2 文档源文件挂载标准 (`*.documents.ts`)

```ts
import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/02-预警信息/01设备预警信息/设备预警信息主PRD.md?raw"
import fieldsMarkdown from "@docs/02-预警信息/01设备预警信息/设备预警信息字段清单.md?raw"
import rulesMarkdown from "@docs/02-预警信息/01设备预警信息/设备预警信息业务规则规格.md?raw"

export const deviceWarningDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "PRD需求规格",
    content: prdMarkdown,
    category: "PRD需求规格",
  },
  {
    id: "fields",
    title: "字段字典清单",
    content: fieldsMarkdown,
    category: "字段字典清单",
  },
  {
    id: "rules",
    title: "业务规则规格",
    content: rulesMarkdown,
    category: "业务规则规格",
  },
]
```

---

## 🚀 4. 组件接入使用规范

### 4.1 页面根容器包裹 (`PrototypeAnnotationProvider`)

```tsx
import { PrototypeAnnotationProvider } from "@/shared/annotations/PrototypeAnnotationLayer"
import { deviceWarningAnnotations } from "../annotations/device-warning-list.annotations"
import { deviceWarningDocuments } from "../documents/device-warning-documents"

export function DeviceWarningListPage() {
  return (
    <PrototypeAnnotationProvider
      title="设备预警信息 · 移动端原型批注"
      annotations={deviceWarningAnnotations}
      documents={deviceWarningDocuments}
    >
      {/* 移动端页面主体 */}
    </PrototypeAnnotationProvider>
  )
}
```

### 4.2 语义化原位打点靶点包裹 (`PrototypeAnnotationTarget`)

必须将 `annotationIds` 精准包裹在对应的子元素上，**严禁将多个语义不同的打点混合包裹在整个大容器上**：

```tsx
// 1. 列表容器包裹列表打点
<PrototypeAnnotationTarget annotationIds={["device-warning-table"]}>
  <div className="space-y-3">
    {events.map((event) => (
      <DeviceWarningCard key={event.eventId} event={event} />
    ))}
  </div>
</PrototypeAnnotationTarget>

// 2. 卡片内部的频次胶囊单独包裹频次打点
<PrototypeAnnotationTarget annotationIds={["device-warning-frequency"]}>
  <button className="bg-orange-50 text-orange-700">⚡ 3 次</button>
</PrototypeAnnotationTarget>

// 3. 卡片底部的操作按钮组单独包裹行操作打点
<PrototypeAnnotationTarget annotationIds={["device-warning-row-actions"]}>
  <div className="flex justify-end gap-3">
    <button>解除 ▸</button>
    <button>详情 ▸</button>
  </div>
</PrototypeAnnotationTarget>
```

---

## 🔍 5. 质量验收与自检清单

1. ✅ **0 遮挡验证**：点击手机上任何打点，手机屏幕内不出现遮挡弹窗，规则直接在右侧大画布检查器内展示；
2. ✅ **两向高亮联动**：
   * 点击打点数字：手机目标元素高亮蓝光，大画布检查器呼出对应规则；
   * 点击检查器底部的 `[手机聚焦]`：手机视口自动平滑滚动并将靶点居中；
3. ✅ **上一条/下一条切换**：点击 `◀ 上一条` / `下一条 ▶` 可在画布上连续流转切换所有需求点；
4. ✅ **机型尺寸自适应**：切换 375px、390px、414px 时，手机内容与外侧画布检查器保持协调无水平溢出；
5. ✅ **编译与静态检查**：必须通过 `npm run lint` 和 `npm run build`，控制台 0 报错。
