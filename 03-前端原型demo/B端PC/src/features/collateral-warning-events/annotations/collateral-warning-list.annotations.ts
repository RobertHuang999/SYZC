import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { collateralWarningListAnnotations as collateralWarningListAnnotationsShared } from "@prototype/shared/collateral-warning-events/annotations/collateral-warning-list.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const collateralWarningListAnnotations = collateralWarningListAnnotationsShared as PrototypeAnnotation[]
