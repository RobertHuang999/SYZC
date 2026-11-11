import type {
  SupervisionOrderFilters,
  SupervisionOrderItem,
  SupervisionOrderTabKey,
} from "./types"

export const SUPERVISION_MANAGEMENT_PATH = "/融资/监管/监管业务/监管管理"

export const PAGE_SIZE = 10

export interface SupervisionTabConfig {
  key: SupervisionOrderTabKey
  label: string
  orderNoLabel: string
  statusLabel: string
  modeLabel: string
  rateLabel: string
  statusOptions: string[]
  modeOptions: string[]
}

/** 三 Tab 文案口径：主 PRD 6.2 三 Tab + 字段清单动态列头 */
export const SUPERVISION_TABS: SupervisionTabConfig[] = [
  {
    key: "MORTGAGE",
    label: "抵押订单",
    orderNoLabel: "抵押单号",
    statusLabel: "抵押状态",
    modeLabel: "抵押方式",
    rateLabel: "抵押率",
    statusOptions: ["抵押中", "解抵押"],
    modeOptions: ["固定抵押", "浮动抵押"],
  },
  {
    key: "PLEDGE",
    label: "质押订单",
    orderNoLabel: "质押单号",
    statusLabel: "质押状态",
    modeLabel: "质押方式",
    rateLabel: "质押率",
    statusOptions: ["质押中", "解质押"],
    modeOptions: ["静态质押", "流动质押"],
  },
  {
    key: "SERVICE",
    label: "监管服务订单",
    orderNoLabel: "监管单号",
    statusLabel: "监管状态",
    modeLabel: "监管方式",
    rateLabel: "监管业务率",
    statusOptions: ["监管中", "解监管"],
    modeOptions: ["固定服务", "浮动服务"],
  },
]

export function getSupervisionTabConfig(key: SupervisionOrderTabKey): SupervisionTabConfig {
  return SUPERVISION_TABS.find((tab) => tab.key === key) ?? SUPERVISION_TABS[0]
}

export const DEFAULT_SUPERVISION_FILTERS: SupervisionOrderFilters = {
  orderNo: "",
  ownerKeyword: "",
  status: "全部",
  mode: "全部",
  risk: "全部",
  goodsName: "",
  org: "",
  dateStart: "",
  dateEnd: "",
}

/** 金额按万元展示：最多 6 位小数，去掉无意义的尾随 0，千分位分隔 */
export function formatWan(value?: number | null): string | null {
  if (value === undefined || value === null || Number.isNaN(value)) return null
  return value.toLocaleString("zh-CN", { maximumFractionDigits: 6 })
}

/** 抵押率 / 质押率 / 监管业务率：贷款余额 ÷ 货物评估价值 × 100% */
export function calcSupervisionRate(order: SupervisionOrderItem): number | null {
  if (!order.loanBalance || !order.appraisedValue) return null
  return (order.loanBalance / order.appraisedValue) * 100
}

export function formatSupervisionRate(rate: number | null): string | null {
  if (rate === null) return null
  return `${rate.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`
}

export type SupervisionActionKind = "readonly" | "mutate" | "danger"

export interface SupervisionActionDef {
  key: string
  label: string
  kind: SupervisionActionKind
}

/** 行操作常驻 5 项（外露，3 个一行排两行） */
export const SUPERVISION_INLINE_ACTIONS: SupervisionActionDef[] = [
  { key: "detail", label: "查看详情", kind: "readonly" },
  { key: "logs", label: "操作记录", kind: "readonly" },
  { key: "materials", label: "资料管理", kind: "readonly" },
  { key: "settle", label: "部分结清", kind: "mutate" },
  { key: "daily", label: "日常监管", kind: "readonly" },
]

/** 折叠菜单其余 19 项，顺序对齐操作业务全景 01~24 */
export const SUPERVISION_MORE_ACTIONS: SupervisionActionDef[] = [
  { key: "replace", label: "货物置换", kind: "mutate" },
  { key: "replenish", label: "补仓", kind: "mutate" },
  { key: "outbound", label: "货物出库", kind: "mutate" },
  { key: "release", label: "解抵押", kind: "mutate" },
  { key: "valuation", label: "货物估值", kind: "mutate" },
  { key: "check", label: "货物盘点", kind: "readonly" },
  { key: "checkReport", label: "盘点报告", kind: "readonly" },
  { key: "report", label: "监管报告", kind: "readonly" },
  { key: "relocate", label: "移库", kind: "mutate" },
  { key: "inbound", label: "抵押入库", kind: "mutate" },
  { key: "abnormal", label: "货物异动", kind: "readonly" },
  { key: "devices", label: "设备管理", kind: "readonly" },
  { key: "close", label: "平仓", kind: "danger" },
  { key: "risk", label: "查看风险", kind: "readonly" },
  { key: "monitor", label: "查看监控", kind: "readonly" },
  { key: "loanResult", label: "贷款结果录入", kind: "mutate" },
  { key: "disclosure", label: "风险公示", kind: "readonly" },
  { key: "processing", label: "加工管理", kind: "mutate" },
  { key: "safetyLine", label: "安全线管理", kind: "mutate" },
]

/** 随业务类型变化的操作文案（解押、入库） */
export function resolveActionLabel(key: string, label: string, tab: SupervisionOrderTabKey): string {
  if (key === "release") {
    if (tab === "PLEDGE") return "解质押"
    if (tab === "SERVICE") return "解除监管"
    return "解抵押"
  }
  if (key === "inbound") {
    if (tab === "PLEDGE") return "质押入库"
    if (tab === "SERVICE") return "监管入库"
    return "抵押入库"
  }
  return label
}
