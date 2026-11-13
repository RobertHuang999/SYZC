import type { H5PrototypeAnnotationBinding } from "@prototype/shared/annotations/prototype-annotation.shared-types"

/** processing-records H5：正文取自 shared，这里只写挂载点与端差异 */
export const h5AnnotationBindings: Record<string, H5PrototypeAnnotationBinding> = {
  "processing-record-page": {
    targetId: "processing-h5-list",
    contentSuffix: "【H5 端差异】列表为卡片流，检索收进搜索框与筛选抽屉。",
  },
  "processing-filters-panel": {
    targetId: "processing-h5-list",
  },
  "processing-record-table": {
    targetId: "processing-h5-list",
  },
  "processing-complete-action": {
    targetId: "processing-h5-list",
  },
  "processing-nullify-action": {
    targetId: "processing-h5-list",
  },
  "processing-list-fields": {
    targetId: "processing-h5-list",
  },
  "processing-detail-header": {
    targetId: "processing-h5-detail",
    contentSuffix: "【H5 端差异】详情按四段卡片纵向排列，不设 PC 标签页。",
  },
  "processing-detail-basic-section": {
    targetId: "processing-h5-detail",
  },
  "processing-detail-tab-input": {
    targetId: "processing-h5-detail",
  },
  "processing-detail-tab-output": {
    targetId: "processing-h5-detail",
  },
  "processing-detail-tab-audit": {
    targetId: "processing-h5-detail",
  },
  "processing-detail-tab-modify": {
    targetId: "processing-h5-detail",
  },
  "processing-detail-fields": {
    targetId: "processing-h5-detail",
  },
  "processing-form-page": {
    targetId: "processing-h5-detail",
  },
  "processing-form-basic-card": {
    targetId: "processing-h5-detail",
  },
  "processing-form-input-card": {
    targetId: "processing-h5-detail",
  },
  "processing-form-output-card": {
    targetId: "processing-h5-detail",
  },
  "processing-form-fields": {
    targetId: "processing-h5-detail",
  },
}
