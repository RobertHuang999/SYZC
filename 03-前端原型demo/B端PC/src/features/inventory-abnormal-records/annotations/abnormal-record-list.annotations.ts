import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { abnormalRecordListAnnotations as abnormalRecordListAnnotationsShared } from "@prototype/shared/inventory-abnormal-records/annotations/abnormal-record-list.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const abnormalRecordListAnnotations = abnormalRecordListAnnotationsShared as PrototypeAnnotation[]
