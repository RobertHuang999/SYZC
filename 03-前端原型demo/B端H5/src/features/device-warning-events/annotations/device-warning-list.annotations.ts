import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { applyH5PrototypeAnnotationBindings } from "@prototype/shared/annotations/prototype-annotation.shared-types"
import { deviceWarningListAnnotations as shared } from "@prototype/shared/device-warning-events/annotations/device-warning-list.annotations"
import { h5AnnotationBindings } from "./device-warning-events-h5.annotation-bindings"
/** H5 正文真源在 shared，这里只做挂载与端差异 */
export const deviceWarningListAnnotations = applyH5PrototypeAnnotationBindings(
  shared,
  h5AnnotationBindings,
) as PrototypeAnnotation[]

