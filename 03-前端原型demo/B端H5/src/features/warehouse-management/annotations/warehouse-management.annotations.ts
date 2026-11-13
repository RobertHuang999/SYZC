import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { applyH5PrototypeAnnotationBindings } from "@prototype/shared/annotations/prototype-annotation.shared-types"
import { warehouseManagementH5Shared } from "@prototype/shared/warehouse-management/annotations/warehouse-management.annotations.shared"
import { warehouseH5SharedBindings } from "./warehouse-management-h5.annotation-bindings"

/** H5 正文真源在 shared，这里只做按页面分组 */
const all = applyH5PrototypeAnnotationBindings(
  warehouseManagementH5Shared,
  warehouseH5SharedBindings,
) as PrototypeAnnotation[]

const pick = (ids: string[]) => all.filter((a) => ids.includes(a.id))

export const warehouseH5ListAnnotations = pick(["wh-h5-list"])

export const warehouseH5FormAnnotations = pick(["wh-h5-form", "wh-h5-form-edit"])

export const warehouseH5DetailAnnotations = pick(["wh-h5-detail-tabs", "wh-h5-63-audit"])
