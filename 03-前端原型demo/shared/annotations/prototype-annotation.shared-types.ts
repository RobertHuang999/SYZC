/** 双端共享标注条目结构（与 PC/H5 PrototypeAnnotationLayer 字段对齐） */

export type SharedAnnotationKind = "页面" | "交互" | "字段" | "规则"

export type SharedPrototypeAnnotation = {
  id: string
  targetId?: string
  number: number
  kind: SharedAnnotationKind
  title: string
  content: string
  documentRefs?: Record<string, unknown>
  details: Array<{
    title: string
    items: Array<{
      label: string
      content: string
    }>
  }>
}

export type H5PrototypeAnnotationBinding = {
  /** H5 页面 DOM 上的 data-prototype-target，与 PC 可不同 */
  targetId?: string
  /** 追加在共享 content 末尾；须以「【H5 端差异】」起句 */
  contentSuffix?: string
}

export function applyH5PrototypeAnnotationBindings(
  annotations: SharedPrototypeAnnotation[],
  bindings: Record<string, H5PrototypeAnnotationBinding>,
): SharedPrototypeAnnotation[] {
  return annotations.map((annotation) => {
    const binding = bindings[annotation.id]
    if (!binding) {
      return annotation
    }
    return {
      ...annotation,
      targetId: binding.targetId ?? annotation.targetId,
      content: binding.contentSuffix
        ? `${annotation.content}${binding.contentSuffix}`
        : annotation.content,
    }
  })
}
