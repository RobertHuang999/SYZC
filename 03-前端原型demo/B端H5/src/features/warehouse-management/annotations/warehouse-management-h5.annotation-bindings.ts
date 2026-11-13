import type { H5PrototypeAnnotationBinding } from "@prototype/shared/annotations/prototype-annotation.shared-types"

/** 仓库管理 H5：正文取自 shared，这里只写挂载点与端差异 */

export const warehouseH5SharedBindings: Record<string, H5PrototypeAnnotationBinding> = {
  "wh-h5-list": {
    targetId: "wh-h5-list",
    contentSuffix: "【H5 端差异】列表为卡片流；新增仓库不在本列表，走工作台「配置管理 → 新增仓库」。",
  },
  "wh-h5-form": {
    targetId: "wh-h5-form",
    contentSuffix: "【H5 端差异】管理方用底部抽屉选择；中仓登附件为相册上传，不跳页。",
  },
  "wh-h5-form-edit": {
    targetId: "wh-h5-form-edit",
    contentSuffix: "【H5 端差异】编辑页只改主档，库房与设备回详情页维护。",
  },
  "wh-h5-detail-tabs": {
    targetId: "wh-h5-detail-tabs",
    contentSuffix: "【H5 端差异】四个 Tab 平铺在详情页内，不设 PC 式左右双栏。",
  },
  "wh-h5-63-audit": {
    targetId: "wh-h5-63-audit",
    contentSuffix: "【H5 端差异】审核单选在编辑 Sheet 内，保存后与基础配置同步。",
  },
}
