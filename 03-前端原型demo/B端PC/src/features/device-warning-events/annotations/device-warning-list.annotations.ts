import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { deviceWarningListAnnotations as deviceWarningListAnnotationsShared } from "@prototype/shared/device-warning-events/annotations/device-warning-list.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const deviceWarningListAnnotations = deviceWarningListAnnotationsShared as PrototypeAnnotation[]
