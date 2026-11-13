import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  inboundStagingH5DetailAnnotations as detailShared,
  inboundStagingH5FormAnnotations as formShared,
  inboundStagingH5GoodsAnnotations as goodsShared,
  inboundStagingH5ListAnnotations as listShared,
} from "@prototype/shared/inbound-staging-reg/annotations/inbound-staging-reg.annotations.shared"

/** 入库暂存登记 H5：正文真源在 shared，本文件只转发 */
export const inboundStagingH5ListAnnotations = listShared as PrototypeAnnotation[]

export const inboundStagingH5DetailAnnotations = detailShared as PrototypeAnnotation[]

export const inboundStagingH5FormAnnotations = formShared as PrototypeAnnotation[]

export const inboundStagingH5GoodsAnnotations = goodsShared as PrototypeAnnotation[]
