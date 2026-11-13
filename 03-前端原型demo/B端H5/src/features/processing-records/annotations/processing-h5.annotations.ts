import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { applyH5PrototypeAnnotationBindings } from "@prototype/shared/annotations/prototype-annotation.shared-types"
import { processingRecordDetailAnnotations as detailShared } from "@prototype/shared/processing-records/annotations/processing-record-detail.annotations"
import { processingRecordListAnnotations as listShared } from "@prototype/shared/processing-records/annotations/processing-record-list.annotations"
import { h5AnnotationBindings } from "./processing-records-h5.annotation-bindings"
/** H5 正文真源在 shared，这里只做挂载与端差异 */
const bind = (arr: typeof listShared) =>
  applyH5PrototypeAnnotationBindings(arr, h5AnnotationBindings) as PrototypeAnnotation[]

export const processingH5ListAnnotations = bind(listShared)

export const processingH5DetailAnnotations = bind(detailShared).map((item, index) => ({ ...item, number: index + 1 }))

