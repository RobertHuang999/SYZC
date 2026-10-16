import type { H5PrototypeAnnotationBinding } from "@prototype/shared/annotations/prototype-annotation.shared-types"

/** 合作方档案 H5：与 PC 同 id / 同 number / 同 details；仅 targetId 与 content 末尾端差异句 */

export const partnerArchiveH5ListAnnotationBindings: Record<
  string,
  H5PrototypeAnnotationBinding
> = {
  "partner-archive-page": {
    targetId: "partner-archive-page",
    contentSuffix:
      "【H5 端差异】菜单入口为工作台 → 用户中心 → 合作方档案（非 PC 合作方管理路径）。",
  },
  "partner-archive-filter": {
    targetId: "partner-archive-filter",
    contentSuffix:
      "【H5 端差异】筛选项以顶栏关键词 + 三枚 Pill + 筛选抽屉呈现；新增走右下角悬浮【+】（无 PC 筛选区右上按钮）。",
  },
  "partner-archive-table": {
    targetId: "partner-archive-table",
    contentSuffix:
      "【H5 端差异】列表为卡片流（非表格）；点击整卡进详情。",
  },
  "partner-archive-row-actions": {
    targetId: "partner-archive-table",
    contentSuffix:
      "【H5 端差异】无表格操作列；冻结/追加/解冻等收口在详情底栏（规则矩阵同 PC）。",
  },
  "partner-archive-pagination": {
    targetId: "partner-archive-pagination",
    contentSuffix:
      "【H5 端差异】原型列表一次渲染当前筛选结果，无 PC 式分页条；排序规则仍同 PC。",
  },
}

export const partnerArchiveH5DetailAnnotationBindings: Record<
  string,
  H5PrototypeAnnotationBinding
> = {
  "partner-archive-detail-header": {
    targetId: "partner-archive-detail-header",
    contentSuffix:
      "【H5 端差异】页头白卡仅名称/状态/身份标识/合作方主体标识；联系手机核验在 Tab「基础档案」。",
  },
  "partner-archive-detail-actions": {
    targetId: "partner-archive-detail-actions",
    contentSuffix:
      "【H5 端差异】操作按钮在底部固定条（非 PC 页头横栏）；按钮集合与显隐矩阵同 PC。",
  },
  "partner-archive-detail-tabs": {
    targetId: "partner-archive-detail-tabs",
  },
  "partner-archive-detail-basic": {
    targetId: "partner-archive-detail-basic",
    contentSuffix:
      "【H5 端差异】基础档案为纵向 DetailRow 卡片（非 PC 三行四列 DetailSection）。",
  },
  "partner-archive-detail-roles": {
    targetId: "partner-archive-detail-roles",
    contentSuffix: "【H5 端差异】角色按卡片逐条展示行内文字链操作（非 PC 子表）。",
  },
  "partner-archive-detail-account": {
    targetId: "partner-archive-detail-account",
  },
  "partner-archive-detail-documents": {
    targetId: "partner-archive-detail-documents",
    contentSuffix: "【H5 端差异】关联单据为卡片列表（非 PC 表格）。",
  },
  "partner-archive-detail-logs": {
    targetId: "partner-archive-detail-logs",
  },
}

export const partnerArchiveH5FormAnnotationBindings: Record<
  string,
  H5PrototypeAnnotationBinding
> = {
  "partner-archive-form-header": {
    targetId: "partner-archive-form-header",
    contentSuffix: "【H5 端差异】顶栏返回 + 标题；无 PC 页内面包屑区。",
  },
  "partner-archive-form-base": {
    targetId: "partner-archive-form-base",
  },
  "partner-archive-form-address": {
    targetId: "partner-archive-form-address",
    contentSuffix:
      "【H5 端差异】省/市/区/详细地址为四行控件 + 多行详细地址（字段清单 8.8.3）。",
  },
  "partner-archive-form-change-address": {
    targetId: "partner-archive-form-change-address",
    contentSuffix:
      "【H5 端差异】改址确认用底部 Sheet（非 PC Dialog）；规则仍【个人货主证件地址变更规则】(PA-R06a)。",
  },
  "partner-archive-form-roles": {
    targetId: "partner-archive-form-roles",
  },
  "partner-archive-form-actions": {
    targetId: "partner-archive-form-actions",
    contentSuffix:
      "【H5 端差异】底栏吸底双按钮/单按钮；短信核验用 Sheet（PartnerVerifySheet）。",
  },
}
