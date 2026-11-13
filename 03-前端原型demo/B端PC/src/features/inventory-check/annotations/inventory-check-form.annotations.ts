import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { inventoryCheckFormAnnotations as inventoryCheckFormAnnotationsShared } from "@prototype/shared/inventory-check/annotations/inventory-check-form.annotations"

/** 业务正文真源在 shared，PC 只做转发 */
export const inventoryCheckFormAnnotations = inventoryCheckFormAnnotationsShared as PrototypeAnnotation[]
