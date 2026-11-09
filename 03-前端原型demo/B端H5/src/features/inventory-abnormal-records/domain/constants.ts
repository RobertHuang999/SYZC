import type {
  AbnormalOrderTypeLabel,
  AbnormalTypeLabel,
} from "./types"

/** 工作台 · 异动管理（异动记录台账） */
export const H5_ABNORMAL_RECORD_LIST_PATH = "/m/workspace/inventory-abnormal-records"
export const h5AbnormalRecordDetailPath = (id: string) =>
  `${H5_ABNORMAL_RECORD_LIST_PATH}/${encodeURIComponent(id)}`

/** 单据类型：四种货权来源 */
export const ORDER_TYPE_OPTIONS: AbnormalOrderTypeLabel[] = [
  "质押单",
  "抵押单",
  "监管业务单",
  "存货单",
]

/** 异动类型：四项白名单 */
export const ABNORMAL_TYPE_OPTIONS: AbnormalTypeLabel[] = [
  "盘盈",
  "盘亏",
  "损耗",
  "其他",
]

/** 单据类型徽标：质押玫红、抵押琥珀、监管蓝、存货翠绿 */
export const ORDER_TYPE_BADGE_CLASS: Record<AbnormalOrderTypeLabel, string> = {
  质押单: "border-rose-200 bg-rose-50 text-rose-700",
  抵押单: "border-amber-200 bg-amber-50 text-amber-700",
  监管业务单: "border-blue-200 bg-blue-50 text-blue-700",
  存货单: "border-emerald-200 bg-emerald-50 text-emerald-700",
}

/** 异动类型徽标：盘盈红（增量风险）、盘亏/损耗绿（减量）、其他中性 */
export const ABNORMAL_TYPE_BADGE_CLASS: Record<AbnormalTypeLabel, string> = {
  盘盈: "border-rose-200 bg-rose-50 text-rose-700",
  盘亏: "border-emerald-200 bg-emerald-50 text-emerald-700",
  损耗: "border-emerald-200 bg-emerald-50 text-emerald-700",
  其他: "border-slate-200 bg-slate-100 text-slate-600",
}

/** 仓库筛选与库房级联（与 PC 异动记录筛选口径一致） */
export const WAREHOUSE_OPTIONS = [
  {
    value: "海霸王仓库",
    label: "海霸王仓库",
    children: ["冻库1审核", "库房（不审核）"],
  },
  {
    value: "生鲜仓库",
    label: "生鲜仓库",
    children: ["水果库房2", "水果库房不审核"],
  },
] as const
