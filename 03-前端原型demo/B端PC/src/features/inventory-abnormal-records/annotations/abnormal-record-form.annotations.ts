import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { abnormalRecordFormAnnotations as abnormalRecordFormAnnotationsShared } from "@prototype/shared/inventory-abnormal-records/annotations/abnormal-record-form.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const abnormalRecordFormAnnotations = abnormalRecordFormAnnotationsShared as PrototypeAnnotation[]
