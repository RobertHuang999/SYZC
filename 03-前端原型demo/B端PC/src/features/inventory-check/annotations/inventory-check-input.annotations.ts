import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { inventoryCheckInputAnnotations as inventoryCheckInputAnnotationsShared } from "@prototype/shared/inventory-check/annotations/inventory-check-input.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const inventoryCheckInputAnnotations = inventoryCheckInputAnnotationsShared as PrototypeAnnotation[]
