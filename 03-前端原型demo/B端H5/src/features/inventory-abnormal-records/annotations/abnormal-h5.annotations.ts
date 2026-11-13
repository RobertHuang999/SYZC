import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { applyH5PrototypeAnnotationBindings } from "@prototype/shared/annotations/prototype-annotation.shared-types"
import { abnormalRecordListAnnotations as listShared } from "@prototype/shared/inventory-abnormal-records/annotations/abnormal-record-list.annotations"
import { abnormalRecordDetailAnnotations as detailOnly } from "@prototype/shared/inventory-abnormal-records/annotations/abnormal-record-detail.annotations"
import { abnormalRecordFormAnnotations as formOnly } from "@prototype/shared/inventory-abnormal-records/annotations/abnormal-record-form.annotations"
import { h5AnnotationBindings } from "./inventory-abnormal-records-h5.annotation-bindings"
/** H5 正文真源在 shared，这里只做挂载与端差异 */
const bind = (arr: typeof listShared) =>
  applyH5PrototypeAnnotationBindings(arr, h5AnnotationBindings) as PrototypeAnnotation[]

/** 合并多份正文后按页面顺序重排编号 */
const renumber = (list: PrototypeAnnotation[]) =>
  list.map((item, index) => ({ ...item, number: index + 1 }))

export const abnormalH5ListAnnotations = renumber(bind(listShared))

export const abnormalH5DetailAnnotations = renumber([...bind(detailOnly), ...bind(formOnly)])

