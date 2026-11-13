import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { applyH5PrototypeAnnotationBindings } from "@prototype/shared/annotations/prototype-annotation.shared-types"
import { inventoryCheckDetailAnnotations as detailShared } from "@prototype/shared/inventory-check/annotations/inventory-check-detail.annotations"
import { inventoryCheckFormAnnotations as formShared } from "@prototype/shared/inventory-check/annotations/inventory-check-form.annotations"
import { inventoryCheckInputAnnotations as inputShared } from "@prototype/shared/inventory-check/annotations/inventory-check-input.annotations"
import { inventoryCheckListAnnotations as listShared } from "@prototype/shared/inventory-check/annotations/inventory-check-list.annotations"
import { h5AnnotationBindings } from "./inventory-check-h5.annotation-bindings"
/** H5 正文真源在 shared，这里只做挂载与端差异 */
const bind = (arr: typeof listShared) =>
  applyH5PrototypeAnnotationBindings(arr, h5AnnotationBindings) as PrototypeAnnotation[]

export const checkH5Annotations = [
  ...bind(listShared),
  ...bind(detailShared),
  ...bind(inputShared),
  ...bind(formShared),
].map((item, index) => ({ ...item, number: index + 1 }))

