import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { collateralWarningDetailAnnotations as collateralWarningDetailAnnotationsShared } from "@prototype/shared/collateral-warning-events/annotations/collateral-warning-detail.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const collateralWarningDetailAnnotations = collateralWarningDetailAnnotationsShared as PrototypeAnnotation[]
