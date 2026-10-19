/** 入库暂存登记 · PC / H5 文案真源（对齐三件套；页面用 *_USER_*，规则编号用 *_SPEC_*） */

export const STAGING_P01_BANNER_USER =
  "现场事实备忘 · 不写库存 · 不进审批 · 暂不发短信"

export const STAGING_P01_BANNER_SPEC =
  "边界见入库暂存登记主规则 (P01)：暂存不写库存、不进审批、不发短信。"

/** @deprecated 使用 STAGING_P01_BANNER_USER + STAGING_P01_BANNER_SPEC */
export const STAGING_P01_BANNER = STAGING_P01_BANNER_USER

export const STAGING_P01_FORM_HINT_USER =
  "极速收货通道：满足入库日期、入库仓库、入库类型与申报数量大于 0 即可保存；不写库存、不进审批、暂不发短信。"

export const STAGING_P01_FORM_HINT_SPEC =
  "弱保存校验 (P02)；主表库房选填、可混选需审核与免审库房，转正提交时再校库房审核范围 (R06)。"

/** @deprecated 使用 STAGING_P01_FORM_HINT_USER + STAGING_P01_FORM_HINT_SPEC */
export const STAGING_P01_FORM_HINT = STAGING_P01_FORM_HINT_USER

export const STAGING_ACTION_LABELS = {
  viewDetail: "查看详情",
  edit: "编辑暂存",
  convert: "转为正式入库",
  void: "作废单据",
  viewFormal: "查看正式入库单",
} as const

export const STAGING_DETAIL_TABS = {
  goods: "货品与堆放明细",
  audit: "操作记录",
} as const

/** O03 转正提醒 · 用户可见 */
export const STAGING_O03_REMINDERS_USER = [
  "快照将预填入库类型、关联单号（若已填）、SKU、库位与照片；正式提交审核成功后本单回写「已转正式」。",
  "临时待核货主须在正式页重选档案货主；新货主提交时须完成手机短信确认。",
  "未分配库位将在正式页强制展开，须将未堆放数量清零。",
  "正式提交须至少 1 张现场照片；手填关联单号须匹配系统有效单据。",
  "中途关闭正式页不产生废单；仅提交审核成功才结案。",
] as const

export const STAGING_O03_REMINDERS_SPEC =
  "规则对照：R03 新货主短信 · R13 未堆放量清零 · R16 现场照片 · P06 关联单号 · O03 转正路由。"

/** @deprecated 使用 STAGING_O03_REMINDERS_USER */
export const STAGING_O03_REMINDERS = STAGING_O03_REMINDERS_USER

export const STAGING_O03_PC_CD_HINT_USER =
  "仓单入库须在移动端「业务办理 → 入库发起」完成转正；PC 不提供仓单正式制单页，可复制 H5 链接。"

export const STAGING_O03_PC_CD_HINT_SPEC = "O03 · 仓单类转正仅 H5。"

/** @deprecated 使用 STAGING_O03_PC_CD_HINT_USER */
export const STAGING_O03_PC_CD_HINT = STAGING_O03_PC_CD_HINT_USER

export const STAGING_O03_H5_ROUTE_HINT_USER =
  "将跳转 H5 入库发起流程完成转正（下一步录入货品）。"

export const STAGING_O03_H5_ROUTE_HINT_SPEC =
  "路由 Mock：/m/inbound/initiate?sourceRegId={REG} → /m/inbound/initiate/goods（P06 · H5 P10）"

export const STAGING_H5_TEMP_OWNER_USER =
  "暂存可手填司机或车牌等现场说明；转为正式入库时须选择档案中的货主。"

export const STAGING_H5_TEMP_OWNER_SPEC = "货主一体化弱校验 (P03 · 临时待核)。"

/** @deprecated 使用 STAGING_O03_H5_ROUTE_HINT_USER；{REG} 替换登记单号 */
export const STAGING_O03_H5_ROUTE_HINT = STAGING_O03_H5_ROUTE_HINT_SPEC
