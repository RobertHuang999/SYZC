import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { deviceWarningDetailAnnotations as deviceWarningDetailAnnotationsShared } from "@prototype/shared/device-warning-events/annotations/device-warning-detail.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const deviceWarningDetailAnnotations = deviceWarningDetailAnnotationsShared as PrototypeAnnotation[]
