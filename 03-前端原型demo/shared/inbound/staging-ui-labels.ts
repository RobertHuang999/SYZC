/** 入库暂存登记 · PC / H5 文案真源（对齐三件套字段名称与 O01~O03） */

export const STAGING_P01_BANNER =
  "现场事实备忘 · 不写库存 · 不进审批 · 暂不发短信（P01）"

export const STAGING_P01_FORM_HINT =
  "极速收货通道：不写库存、不进审批、暂不发短信；满足入库日期 + 入库仓库 + 入库类型 + 申报数量大于 0 即可保存（P02）。"

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

/** O03 转正前置四提醒 + 结案说明（字段清单 6.3 · 主 PRD 4.5） */
export const STAGING_O03_REMINDERS = [
  "快照将预填入库类型、关联单号（若已填）、SKU、库位与照片；正式【提交审核】成功后本单回写【已转正式】。",
  "临时待核货主须在正式页重选档案货主；新货主提交时触发 R03 二元短信核验。",
  "未分配库位将在正式页强制展开，须将未堆放数量清零（R13）。",
  "正式提交须至少 1 张现场照片（R16）；手填关联单号须匹配系统有效单据（P06）。",
  "中途关闭正式页不产生废单；仅提交审核成功才结案。",
] as const

export const STAGING_O03_H5_ROUTE_HINT =
  "目标：/m/inbound/initiate?sourceRegId={REG} → 下一步 /m/inbound/initiate/goods（P06 · H5 P10）"

export const STAGING_O03_PC_CD_HINT =
  "仓单入库须在移动端「业务办理 → 入库发起」完成转正；PC 不提供仓单正式制单页，可复制 H5 链接。"
