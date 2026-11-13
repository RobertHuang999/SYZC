import type { H5PrototypeAnnotationBinding } from "@prototype/shared/annotations/prototype-annotation.shared-types"

/** inventory-check H5：正文取自 shared，这里只写挂载点与端差异 */
export const h5AnnotationBindings: Record<string, H5PrototypeAnnotationBinding> = {
  "inventory-check-page": {
    targetId: "check-h5-list",
    contentSuffix: "【H5 端差异】列表为卡片流，盘点与撤销从卡片操作进入。",
  },
  "check-filters-panel": {
    targetId: "check-h5-list",
  },
  "check-table-main": {
    targetId: "check-h5-list",
  },
  "check-list-fields": {
    targetId: "check-h5-list",
  },
  "check-detail-overview": {
    targetId: "check-h5-detail",
    contentSuffix: "【H5 端差异】详情以进度看板 + 明细列表组织，处理入口在底部。",
  },
  "check-detail-stats-card": {
    targetId: "check-h5-progress",
  },
  "check-detail-actions": {
    targetId: "check-h5-resolve",
  },
  "check-detail-fields": {
    targetId: "check-h5-detail-items",
  },
  "check-input-header": {
    targetId: "check-h5-detail",
  },
  "check-input-table": {
    targetId: "check-h5-summary-table",
  },
  "check-input-fields": {
    targetId: "check-h5-summary-table",
  },
  "check-input-actions": {
    targetId: "check-h5-resolve",
  },
  "check-form-base-card": {
    targetId: "check-h5-detail",
  },
  "check-form-warehouse-card": {
    targetId: "check-h5-detail",
  },
  "check-form-goods-card": {
    targetId: "check-h5-detail",
  },
  "check-form-page": {
    targetId: "check-h5-detail",
  },
  "check-form-fields": {
    targetId: "check-h5-detail",
  },
}
