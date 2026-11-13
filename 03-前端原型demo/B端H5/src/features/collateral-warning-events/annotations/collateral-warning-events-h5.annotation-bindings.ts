import type { H5PrototypeAnnotationBinding } from "@prototype/shared/annotations/prototype-annotation.shared-types"

/** collateral-warning-events H5：正文取自 shared，这里只写挂载点与端差异 */
export const h5AnnotationBindings: Record<string, H5PrototypeAnnotationBinding> = {
  "collateral-warning-page": {
    targetId: "collateral-warning-page",
    contentSuffix: "【H5 端差异】列表为卡片流，顶部保留统计与筛选胶囊。",
  },
  "collateral-warning-filter": {
    targetId: "collateral-warning-filter",
  },
  "collateral-warning-toolbar": {
    targetId: "collateral-warning-toolbar",
  },
  "collateral-warning-table": {
    targetId: "collateral-warning-table",
  },
  "collateral-warning-row-actions": {
    targetId: "collateral-warning-row-actions",
  },
  "collateral-warning-pagination": {
    targetId: "collateral-warning-table",
  },
  "collateral-warning-detail-header": {
    targetId: "h5-collateral-warning-detail-facts",
    contentSuffix: "【H5 端差异】详情单页滚动，处置按钮固定在底部。",
  },
  "collateral-warning-detail-base": {
    targetId: "h5-collateral-warning-detail-facts",
  },
  "collateral-warning-detail-facts": {
    targetId: "h5-collateral-warning-detail-facts",
  },
  "collateral-warning-detail-penetration": {
    targetId: "h5-collateral-warning-detail-facts",
  },
  "collateral-warning-detail-disposal": {
    targetId: "h5-collateral-warning-detail-facts",
  },
  "collateral-warning-detail-actions": {
    targetId: "h5-collateral-warning-detail-facts",
  },
}
