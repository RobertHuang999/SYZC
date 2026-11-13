import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { inventoryCheckListAnnotations as inventoryCheckListAnnotationsShared } from "@prototype/shared/inventory-check/annotations/inventory-check-list.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const inventoryCheckListAnnotations = inventoryCheckListAnnotationsShared as PrototypeAnnotation[]
