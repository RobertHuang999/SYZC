---
name: prototype-annotation
description: Add or improve reusable, interactive annotations and multi-dimensional requirement specification boards (Annotations, Fields, PRD, Business Rules) for desktop prototypes, especially React/TypeScript/Vite ERP and financial risk management systems. Use when annotating prototypes with numbered target badges, draggable in-place tooltip cards, an edge floating dock, or direct in-page PRD/field/rule document viewing.
---

# 🎯 Prototype Annotation & Specification Layer (原型打点与规格看板规范)

为静态原型提供一套企业级、无侵入式的**交互批注与四维需求规格看板体系**，打通“原型交互 - 需求打点 - 字段清单 - PRD文档 - 业务规则规格”的数据闭环。

---

## 🏗️ 1. 核心架构与设计规范

原型交互标注层采用 **分层解耦、页面直读、无缝挂载** 架构，主要由以下 5 个核心部分组成：

```
PrototypeAnnotationProvider (全局状态上下文)
├── RightEdgeFoldTab (常驻右侧悬浮胶囊栏：开关 + 4大入口)
│   ├── [ON / OFF] 打点全局开关
│   ├── [🎯 需求打点] (带打点项数量角标)
│   ├── [📋 字段清单] (直接在页面展开数据模型与字段表)
│   ├── [📄 需求文档] (直接在页面展开完整PRD说明书)
│   └── [📐 规则规格] (直接在页面展开状态机与风控规则)
├── PrototypeAnnotationTarget (业务组件原位打点容器)
│   ├── 页面红色数字徽标 (Badge)
│   └── InPlaceAnnotationCard (就近原位弹出卡片，支持拖拽移动与边缘拉伸)
└── AnnotationSidebarDrawer (右侧多维需求看板抽屉)
    ├── 4 大看板选项卡 (打点 / 字段 / PRD / 规则规格)
    ├── Markdown / GFM 表格 / Mermaid 状态机图表直读
    ├── 宽屏/紧凑自适应切换
    └── 一键复制 Markdown 源码
```

---

## 📋 2. 数据定义与挂载标准

### 2.1 需求打点数据结构 (`*.annotations.ts`)

```ts
export type AnnotationKind = '页面' | '交互' | '字段' | '规则' | '待确认'

export type PrototypeAnnotation = {
  id: string              // 唯一标识 (如: "device-warning-config-form-header")
  targetId?: string        // 关联的目标组件 ID (共享打点容器时使用)
  number: number          // 页面内唯一且连续的数字编号 (1, 2, 3...)
  kind: AnnotationKind    // 分类维度
  title: string           // 标题
  content: string         // 简明摘要
  details: Array<{        // 结构化细则分组
    title: string
    items: Array<{
      label: string
      content: string
    }>
  }>
}
```

### 2.2 原始 PRD / 字段 / 规则源文件挂载标准 (`*.documents.ts`)

页面需通过 Vite 原生 `?raw` 导入实际 Markdown 源文件，构建 3 大基准规格文档：

```ts
import type { PrototypeDocument } from "@/shared/annotations/PrototypeAnnotationLayer"
import prdMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/03-预警配置/02设备预警配置/设备预警配置主PRD.md?raw"
import fieldsMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/03-预警配置/02设备预警配置/设备预警配置字段清单.md?raw"
import rulesMarkdown from "@docs/B-迭代需求/6.2版本（2026.08）/03-预警配置/02设备预警配置/设备预警配置业务规则规格.md?raw"

export const deviceWarningConfigDocuments: PrototypeDocument[] = [
  {
    id: "prd",
    title: "PRD文档",
    content: prdMarkdown,
    category: "产品需求规格",
  },
  {
    id: "fields",
    title: "字段清单",
    content: fieldsMarkdown,
    category: "数据模型与字段",
  },
  {
    id: "rules",
    title: "业务规则规格",
    content: rulesMarkdown,
    category: "状态机与业务规则",
  },
]
```

---

## 🚀 3. 页面接入与使用规范

### 3.1 页面根容器包裹 (`PrototypeAnnotationProvider`)

在页面组件的最外层声明 Provider：

```tsx
import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { deviceWarningConfigFormAnnotations } from "../annotations/device-warning-config-form.annotations"
import { deviceWarningConfigDocuments } from "../documents/device-warning-config-documents"

export function DeviceWarningConfigFormPage() {
  return (
    <PrototypeAnnotationProvider
      title="设备预警配置 · 原型批注"
      annotations={deviceWarningConfigFormAnnotations}
      documents={deviceWarningConfigDocuments}
    >
      <div className="space-y-4 p-6">
        {/* 页面内容 */}
      </div>
    </PrototypeAnnotationProvider>
  )
}
```

### 3.2 语义化目标组件打点绑定 (`PrototypeAnnotationTarget`)

使用稳定且具业务语义的 `annotationIds` 进行绑定，**禁止使用 DOM 顺序、坐标或 `nth-child`**：

```tsx
<PrototypeAnnotationTarget annotationIds={["device-warning-config-form-threshold"]}>
  <Card>
    <CardHeader>
      <CardTitle>监控阈值设置</CardTitle>
    </CardHeader>
    <CardContent>
      {/* 阈值表单内容 */}
    </CardContent>
  </Card>
</PrototypeAnnotationTarget>
```

---

## 🎨 4. 核心交互与视觉标准

### 4.1 右侧常驻悬浮胶囊栏 (`RightEdgeFoldTab`)
* **ON/OFF 极速切换**：点击顶部开关，可在 0ms 内清爽隐藏所有页面红色打点数字，便于截取纯净原型图或做沉浸式业务演示；
* **四维入口并列**：
  * 🎯 **需求打点**：展示打点总数徽标，点击展开需求打点列表；
  * 📋 **字段清单**：绿色主题，点击直接在右侧页面展开《字段清单与数据模型》；
  * 📄 **需求文档**：天蓝主题，点击直接在右侧页面展开完整《PRD产品需求规格说明书》；
  * 📐 **规则规格**：橙色主题，点击直接在右侧页面展开《状态机与业务规则规格》。

### 4.2 就近原位弹出卡片 (`InPlaceAnnotationCard`)
* **自由拖拽移动**：按住卡片头部区域即可在页面任意拖动位置（`PointerEvent` + `setPointerCapture`），绝不遮挡底层关键操作按钮；
* **自由拉伸缩放**：支持右边缘、下边缘及右下角手柄拉伸宽高尺寸；
* **一键重置与快捷直达**：提供重置宽高位置按钮，并在卡片顶部内置 `[查字段]`、`[读PRD]`、`[看规则]` 直达链接。

### 4.3 侧边全功能看板 (`AnnotationSidebarDrawer`)
* **页面内直读**：消除多层 Modal 弹窗跳转阻断，文档与打点全部直接在右侧抽屉内平铺渲染；
* **宽屏/紧凑双模式**：支持一键切换 `46rem` (紧凑) 与 `68rem` (宽屏) 模式，方便查阅复杂宽表格和流程图；
* **一键复制源码**：每篇文档均支持 `[复制 Markdown]`，方便研发和测试拷贝；
* **🎯 页面定位**：点击任意打点项的【页面定位】按钮，页面平滑滚动至对应组件并呼出原位气泡。

---

## 🔍 5. 质量校验与验收标准

在完成打点或功能迭代后，必须执行以下验证流程：

```bash
# 1. 静态检查与 TypeScript 编译验证 (必须 0 错误)
npm run lint && npm run build
```

在浏览器中验证以下 6 个核心交互：
1. **打点开关**：点击右侧胶囊栏 `ON/OFF`，页面红色数字气泡正常显隐；
2. **打点定位**：点击抽屉中某项的 `🎯 页面定位`，页面自动平滑滚动并将卡片就近呼出；
3. **卡片拖拽拉伸**：原位卡片支持拖动位置、右下角拉伸宽高及 `Esc` 退出；
4. **文档直读**：点击【字段清单】、【需求文档】、【业务规则规格】均能直接在抽屉内渲染 Markdown 表格与 Mermaid 图表；
5. **一键复制**：文档右上角的 `[复制 Markdown]` 能正常写入系统剪贴板并提示成功；
6. **无业务破坏**：原型本身的表单输入、下拉选择、按钮点击及模态弹窗完全正常可用。
