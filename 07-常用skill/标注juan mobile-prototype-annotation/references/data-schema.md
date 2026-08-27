# Mobile Prototype Annotation Data Schema & Target Principles

## 1. 语义化 Target ID 原则

Target ID 是手机原型内部组件与外部大画布检查器（Canvas Inspector）及全量抽屉之间的唯一数据契约。

- 统一采用小写 `kebab-case`（如 `device-warning-frequency`、`collateral-warning-row-actions`）。
- **禁止多个不同语义的打点 ID 混合包裹在整个大容器上**。必须将打点颗粒度拆分绑定至具体子模块（如将列表绑定至 table，将频次胶囊绑定至 frequency，将底部按钮绑定至 row-actions）。
- 严禁使用 DOM 数组索引、自动生成的动态哈希作为 Contract。

## 2. 需求打点模型 (PrototypeAnnotation)

```ts
export type AnnotationKind = '页面' | '交互' | '字段' | '规则' | '待确认'

export type PrototypeAnnotation = {
  id: string              // 唯一标识 (如: "device-warning-frequency")
  targetId?: string        // 关联的目标组件 ID
  number: number          // 页面内唯一且连续的数字编号 (1, 2, 3...)
  kind: AnnotationKind    // 分类维度
  title: string           // 打点标题
  content: string         // 核心事实需求摘要 (大画布高亮展示)
  details: Array<{        // 结构化细则分组
    title: string
    items: Array<{
      label: string
      content: string     // 支持文本、Markdown、Mermaid 图表
    }>
  }>
}
```

## 3. 文档挂载模型 (PrototypeDocument)

通过 Vite `?raw` 原生引入业务 Markdown 文档，实现直读与无缝对照：

```ts
export type PrototypeDocument = {
  id: "prd" | "fields" | "rules" | string
  title: string
  content: string         // Markdown 文本
  category: string        // "PRD需求规格" | "字段字典清单" | "业务规则规格"
  badge?: string
}
```
