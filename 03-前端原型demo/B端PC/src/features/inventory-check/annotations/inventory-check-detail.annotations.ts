import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { inventoryCheckDetailAnnotations as inventoryCheckDetailAnnotationsShared } from "@prototype/shared/inventory-check/annotations/inventory-check-detail.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const inventoryCheckDetailAnnotations = inventoryCheckDetailAnnotationsShared as PrototypeAnnotation[]
