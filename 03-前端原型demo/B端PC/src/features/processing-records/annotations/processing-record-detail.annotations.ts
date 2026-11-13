import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { processingRecordDetailAnnotations as processingRecordDetailAnnotationsShared } from "@prototype/shared/processing-records/annotations/processing-record-detail.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const processingRecordDetailAnnotations = processingRecordDetailAnnotationsShared as PrototypeAnnotation[]
