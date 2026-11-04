export type AnnotationKind = "页面" | "交互" | "字段" | "规则" | "待确认"

/** 标注视图三档：只看 6.3 变更 / 全部原型 / 还原线上（与 PC 一致） */
export type IterationViewMode = "focus63" | "all" | "off"

export type DrawerTabKey = "annotations" | "fields" | "prd" | "rules"

export type DocumentTabKey = Exclude<DrawerTabKey, "annotations">

export type DocumentLocator = {
  section?: string
  match?: string
  element?: "heading" | "row" | "text"
}

export type PrototypeAnnotation = {
  id: string
  targetId?: string
  number: number
  kind: AnnotationKind
  title: string
  content: string
  /** 打点归属版本：6.3 为本轮改动，未填视为历史沿用（6.2 及更早） */
  version?: "6.3" | "6.2"
  documentRefs?: Partial<Record<DocumentTabKey, DocumentLocator>>
  details: Array<{
    title: string
    items: Array<{
      label: string
      content: string
    }>
  }>
}

export type PrototypeDocument = {
  id: string
  title: string
  category: "PRD需求规格" | "字段字典清单" | "业务规则规格" | "API接口契约"
  badge?: string
  content: string
}
