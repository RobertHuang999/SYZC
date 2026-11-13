import type { H5PrototypeAnnotationBinding } from "@prototype/shared/annotations/prototype-annotation.shared-types"

/** device-warning-events H5：正文取自 shared，这里只写挂载点与端差异 */
export const h5AnnotationBindings: Record<string, H5PrototypeAnnotationBinding> = {
  "device-warning-page": {
    targetId: "device-warning-page",
    contentSuffix: "【H5 端差异】列表为卡片流，点卡片进详情；批量解除在卡片多选后从底部操作栏发起。",
  },
  "device-warning-filter": {
    targetId: "device-warning-filter",
  },
  "device-warning-table": {
    targetId: "device-warning-table",
  },
  "device-warning-row-actions": {
    targetId: "device-warning-row-actions",
    contentSuffix: "【H5 端差异】行操作收进底部操作面板，单条解除需上传现场照片。",
  },
  "device-warning-batch-release": {
    targetId: "device-warning-row-actions",
  },
  "device-warning-pagination": {
    targetId: "device-warning-table",
  },
  "device-warning-release-confirm": {
    targetId: "device-warning-row-actions",
  },
  "device-warning-detail-header": {
    targetId: "h5-device-warning-detail-actions",
    contentSuffix: "【H5 端差异】详情为单页滚动，解除入口固定在底部操作栏。",
  },
  "device-warning-detail-base": {
    targetId: "h5-device-warning-detail-facts",
  },
  "device-warning-detail-facts": {
    targetId: "h5-device-warning-detail-facts",
  },
  "device-warning-detail-release-info": {
    targetId: "h5-device-warning-detail-facts",
  },
  "device-warning-detail-rule-snapshot": {
    targetId: "h5-device-warning-detail-facts",
  },
  "device-warning-detail-actions": {
    targetId: "h5-device-warning-detail-actions",
  },
  "device-warning-release-header": {
    targetId: "h5-device-warning-release-header",
    contentSuffix: "【H5 端差异】现场拍照走系统相机，可在解除页直接补拍。",
  },
  "device-warning-release-summary": {
    targetId: "h5-device-warning-release-form",
  },
  "device-warning-release-form": {
    targetId: "h5-device-warning-release-form",
  },
  "device-warning-release-submit": {
    targetId: "h5-device-warning-release-form",
  },
}
