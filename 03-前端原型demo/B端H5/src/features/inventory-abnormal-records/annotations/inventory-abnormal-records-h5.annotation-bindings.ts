import type { H5PrototypeAnnotationBinding } from "@prototype/shared/annotations/prototype-annotation.shared-types"

/** inventory-abnormal-records H5：正文取自 shared，这里只写挂载点与端差异 */
export const h5AnnotationBindings: Record<string, H5PrototypeAnnotationBinding> = {
  "abnormal-record-page": {
    targetId: "abnormal-h5-list",
    contentSuffix: "【H5 端差异】列表为卡片流，差额用红升绿降徽标展示。",
  },
  "abnormal-record-filter": {
    targetId: "abnormal-h5-list",
  },
  "abnormal-record-table": {
    targetId: "abnormal-h5-list",
  },
  "abnormal-record-table-fields": {
    targetId: "abnormal-h5-list",
  },
  "abnormal-record-ops-actions": {
    targetId: "abnormal-h5-list",
  },
  "abnormal-detail-header": {
    targetId: "abnormal-h5-detail",
  },
  "abnormal-detail-card": {
    targetId: "abnormal-h5-diff-chain",
  },
  "abnormal-detail-timeline": {
    targetId: "abnormal-h5-detail",
  },
  "abnormal-detail-page": {
    targetId: "abnormal-h5-detail",
    contentSuffix: "【H5 端差异】详情按货物逐张卡片纵向展示，差额对比集中在差额链区域。",
  },
  "abnormal-detail-fields": {
    targetId: "abnormal-h5-detail",
  },
  "abnormal-form-picker": {
    targetId: "abnormal-h5-detail",
  },
  "abnormal-form-diff": {
    targetId: "abnormal-h5-diff-chain",
  },
  "abnormal-form-page": {
    targetId: "abnormal-h5-detail",
  },
  "abnormal-form-fields": {
    targetId: "abnormal-h5-detail",
  },
  "abnormal-form-actions": {
    targetId: "abnormal-h5-detail",
  },
}
