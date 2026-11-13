import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { deviceWarningReleaseAnnotations as deviceWarningReleaseAnnotationsShared } from "@prototype/shared/device-warning-events/annotations/device-warning-release.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const deviceWarningReleaseAnnotations = deviceWarningReleaseAnnotationsShared as PrototypeAnnotation[]
