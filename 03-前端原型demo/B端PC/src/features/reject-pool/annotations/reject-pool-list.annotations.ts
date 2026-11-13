import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { rejectPoolListAnnotationsShared } from "@prototype/shared/reject-pool/annotations/reject-pool-list.annotations.shared"

export const rejectPoolListAnnotations: PrototypeAnnotation[] =
  rejectPoolListAnnotationsShared as PrototypeAnnotation[]

