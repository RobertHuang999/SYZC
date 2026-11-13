import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { processingRecordListAnnotations as processingRecordListAnnotationsShared } from "@prototype/shared/processing-records/annotations/processing-record-list.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const processingRecordListAnnotations = processingRecordListAnnotationsShared as PrototypeAnnotation[]
