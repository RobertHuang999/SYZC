export type AnnotationKind = "页面" | "交互" | "字段" | "规则" | "待确认"

export type DrawerTabKey = "annotations" | "fields" | "prd" | "rules"

export type PrototypeAnnotation = {
  id: string
  targetId?: string
  number: number
  kind: AnnotationKind
  title: string
  content: string
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
