import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { abnormalRecordDetailAnnotations as abnormalRecordDetailAnnotationsShared } from "@prototype/shared/inventory-abnormal-records/annotations/abnormal-record-detail.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const abnormalRecordDetailAnnotations = abnormalRecordDetailAnnotationsShared as PrototypeAnnotation[]
