import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  warehouseManagementDetailShared,
  warehouseManagementListShared,
} from "@prototype/shared/warehouse-management/annotations/warehouse-management.annotations.shared"

/** 业务正文真源在 shared，PC 只做转发 */
export const warehouseListAnnotations =
  warehouseManagementListShared as PrototypeAnnotation[]

export const warehouseDetailAnnotations =
  warehouseManagementDetailShared as PrototypeAnnotation[]
