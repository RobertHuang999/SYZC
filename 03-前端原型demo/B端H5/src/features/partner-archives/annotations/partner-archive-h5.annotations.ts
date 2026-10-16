import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { applyH5PrototypeAnnotationBindings } from "@prototype/shared/annotations/prototype-annotation.shared-types"
import { partnerArchiveDetailAnnotationsShared } from "@prototype/shared/partner-archives/annotations/partner-archive-detail.annotations.shared"
import { partnerArchiveFormAnnotationsShared } from "@prototype/shared/partner-archives/annotations/partner-archive-form.annotations.shared"
import { partnerArchiveListAnnotationsShared } from "@prototype/shared/partner-archives/annotations/partner-archive-list.annotations.shared"
import {
  partnerArchiveH5DetailAnnotationBindings,
  partnerArchiveH5FormAnnotationBindings,
  partnerArchiveH5ListAnnotationBindings,
} from "./partner-archive-h5.annotation-bindings"

/** H5 合作方档案标注：与 PC 同 id、序号、title、details；仅 bindings 追加【H5 端差异】与 targetId */

export const partnerArchiveH5ListAnnotations = applyH5PrototypeAnnotationBindings(
  partnerArchiveListAnnotationsShared,
  partnerArchiveH5ListAnnotationBindings,
) as PrototypeAnnotation[]

export const partnerArchiveH5DetailAnnotations = applyH5PrototypeAnnotationBindings(
  partnerArchiveDetailAnnotationsShared,
  partnerArchiveH5DetailAnnotationBindings,
) as PrototypeAnnotation[]

export const partnerArchiveH5FormAnnotations = applyH5PrototypeAnnotationBindings(
  partnerArchiveFormAnnotationsShared,
  partnerArchiveH5FormAnnotationBindings,
) as PrototypeAnnotation[]
