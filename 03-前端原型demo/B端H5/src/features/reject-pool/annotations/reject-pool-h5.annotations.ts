import { applyH5PrototypeAnnotationBindings } from "@prototype/shared/annotations/prototype-annotation.shared-types"
import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { rejectPoolListAnnotationsShared } from "@prototype/shared/reject-pool/annotations/reject-pool-list.annotations.shared"
import { rejectPoolDetailAnnotationsShared } from "@prototype/shared/reject-pool/annotations/reject-pool-detail.annotations.shared"
import {
  rejectPoolH5DetailAnnotationBindings,
  rejectPoolH5ListAnnotationBindings,
} from "./reject-pool-h5.annotation-bindings"

export const rejectPoolH5ListAnnotations = applyH5PrototypeAnnotationBindings(
  rejectPoolListAnnotationsShared,
  rejectPoolH5ListAnnotationBindings,
) as PrototypeAnnotation[]

export const rejectPoolH5DetailAnnotations = applyH5PrototypeAnnotationBindings(
  rejectPoolDetailAnnotationsShared,
  rejectPoolH5DetailAnnotationBindings,
) as PrototypeAnnotation[]

