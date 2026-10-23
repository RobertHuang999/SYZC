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
      "【H5 端差异】筛选项以 **识别营业执照（OCR）** + 关键词 + 横滑 Pill（主体类型、主体状态、资料完备）+ 筛选抽屉（联系手机核验、联系手机、创建时间；无创建来源筛）；新增走右下角悬浮【+】（无 PC 筛选区右上按钮）。",
  },
  "partner-archive-table": {
    targetId: "partner-archive-table",
    contentSuffix:
      "【H5 端差异】列表为卡片流（非表格）；点名称/【详情】进详情页。",
  },
  "partner-archive-row-actions": {
    targetId: "partner-archive-table",
    contentSuffix:
      "【H5 端差异】方案 A 行操作在卡片 Footer 单行右对齐文字链（对齐入库/出库 H5 卡片，无胶囊栅格）；含未验证时的【验证】；与 PC 操作列位次一致；详情页只读无重复底栏。",
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
      "【H5 端差异】详情只读查阅，不提供冻结/解冻/追加；上述操作仅在列表卡片 Footer（与 PC 列表行操作矩阵一致）。详情 Tab 内可【验证联系手机】的显隐仍同 PA-P02（若页头未做验证入口则走列表卡片【验证】）。",
  },
  "partner-archive-detail-tabs": {
    targetId: "partner-archive-detail-tabs",
  },
  "partner-archive-detail-basic": {
    targetId: "partner-archive-detail-basic",
    contentSuffix:
      "【H5 端差异】基础档案为纵向 DetailRow 卡片（非 PC 三行四列 DetailSection）；证件地址待补全 inline 提示：正常态引导「返回列表卡片【补全资料】」，冻结态「请先解冻后再补全资料」（与 PC 详情 inline 口径一致，入口差异见 8.8.2）。",
  },
  "partner-archive-detail-roles": {
    targetId: "partner-archive-detail-roles",
    contentSuffix: "【H5 端差异】其他合作档案为纵向卡片 +「查看详情」链（非 PC 表格）。",
  },
  "partner-archive-detail-account": {
    targetId: "partner-archive-detail-account",
  },
  "partner-archive-detail-documents": {
    targetId: "partner-archive-detail-documents",
    contentSuffix: "【H5 端差异】6.3 详情无此 Tab；标注仅占位。",
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
      "【H5 端差异】省/市/区/详细地址为四行控件 + 多行详细地址（字段清单 8.8.3）；个人货主改址与 PC 一致，保存前准入、无单独改址 Sheet（PA-R06a）。",
  },
  "partner-archive-form-roles": {
    targetId: "partner-archive-form-roles",
    contentSuffix:
      "【H5 端差异】追加目标为子菜单 Pill 多选（非业务角色枚举）；多选保存走 PA-R03a 底部 Sheet（确认/失败/成功），与 PC 弹窗口径一致。",
  },
  "partner-archive-form-actions": {
    targetId: "partner-archive-form-actions",
    contentSuffix:
      "【H5 端差异】底栏吸底双按钮/单按钮；短信核验用 Sheet（PartnerVerifySheet）。",
  },
}
