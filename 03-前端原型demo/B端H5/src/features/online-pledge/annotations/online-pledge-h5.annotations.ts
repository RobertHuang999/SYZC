import { applyH5PrototypeAnnotationBindings } from "@prototype/shared/annotations/prototype-annotation.shared-types"
import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { onlinePledgeListAnnotationsShared } from "@prototype/shared/online-pledge/annotations/online-pledge-list.annotations.shared"
import { onlinePledgeDetailAnnotationsShared } from "@prototype/shared/online-pledge/annotations/online-pledge-detail.annotations.shared"
import {
  onlinePledgeH5DetailAnnotationBindings,
  onlinePledgeH5ListAnnotationBindings,
} from "./online-pledge-h5.annotation-bindings"

export const onlinePledgeH5ListAnnotations = applyH5PrototypeAnnotationBindings(
  onlinePledgeListAnnotationsShared,
  onlinePledgeH5ListAnnotationBindings,
) as PrototypeAnnotation[]

export const onlinePledgeH5DetailAnnotations = applyH5PrototypeAnnotationBindings(
  onlinePledgeDetailAnnotationsShared,
  onlinePledgeH5DetailAnnotationBindings,
) as PrototypeAnnotation[]

