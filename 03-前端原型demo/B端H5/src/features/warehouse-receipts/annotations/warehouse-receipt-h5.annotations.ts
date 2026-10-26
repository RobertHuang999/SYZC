import { applyH5PrototypeAnnotationBindings } from "@prototype/shared/annotations/prototype-annotation.shared-types"
import type { PrototypeAnnotation } from "@/shared/annotations/PrototypeAnnotationLayer"
import { warehouseReceiptListAnnotationsShared } from "@prototype/shared/warehouse-receipts/annotations/warehouse-receipt-list.annotations.shared"
import { warehouseReceiptDetailAnnotationsShared } from "@prototype/shared/warehouse-receipts/annotations/warehouse-receipt-detail.annotations.shared"
import { warehouseReceiptInitiateAnnotationsShared } from "@prototype/shared/warehouse-receipts/annotations/warehouse-receipt-initiate.annotations.shared"
import { warehouseReceiptOpsAnnotationsShared } from "@prototype/shared/warehouse-receipts/annotations/warehouse-receipt-ops.annotations.shared"
import {
  warehouseReceiptH5DetailAnnotationBindings,
  warehouseReceiptH5InitiateAnnotationBindings,
  warehouseReceiptH5ListAnnotationBindings,
  warehouseReceiptH5OpsAnnotationBindings,
} from "./warehouse-receipt-h5.annotation-bindings"

export const warehouseReceiptH5ListAnnotations = applyH5PrototypeAnnotationBindings(
  warehouseReceiptListAnnotationsShared,
  warehouseReceiptH5ListAnnotationBindings,
) as PrototypeAnnotation[]

export const warehouseReceiptH5DetailAnnotations = applyH5PrototypeAnnotationBindings(
  warehouseReceiptDetailAnnotationsShared,
  warehouseReceiptH5DetailAnnotationBindings,
) as PrototypeAnnotation[]

export const warehouseReceiptH5InitiateAnnotations =
  applyH5PrototypeAnnotationBindings(
    warehouseReceiptInitiateAnnotationsShared,
    warehouseReceiptH5InitiateAnnotationBindings,
  ) as PrototypeAnnotation[]

export const warehouseReceiptH5OpsAnnotations = applyH5PrototypeAnnotationBindings(
  warehouseReceiptOpsAnnotationsShared,
  warehouseReceiptH5OpsAnnotationBindings,
) as PrototypeAnnotation[]
