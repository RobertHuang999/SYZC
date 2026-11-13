import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { processingRecordFormAnnotations as processingRecordFormAnnotationsShared } from "@prototype/shared/processing-records/annotations/processing-record-form.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const processingRecordFormAnnotations = processingRecordFormAnnotationsShared as PrototypeAnnotation[]
