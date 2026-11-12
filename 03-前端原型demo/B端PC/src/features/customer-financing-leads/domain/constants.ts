import type { LeadFilters, LeadStatus } from "./types"

export const PAGE_SIZE = 10

export const LEADS_STORAGE_KEY = "SYZC_CUSTOMER_FINANCING_LEADS_MOCK_V1"

export const DEFAULT_LEAD_FILTERS: LeadFilters = {
  keyword: "",
  requiresSurvey: "ALL",
  status: "ALL",
  collateralType: "ALL",
}

export const LEAD_STATUS_CONFIG: Record<
  LeadStatus,
  {
    label: string
    badgeClass: string
    dotClass: string
    description: string
  }
> = {
  PENDING_ACCEPT: {
    label: "待受理",
    badgeClass:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300",
    dotClass: "bg-amber-500",
    description: "外部申请已成功接入，等待运营初审核验资料并指派派单",
  },
  PROCESSING: {
    label: "处理中",
    badgeClass:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300",
    dotClass: "bg-blue-500",
    description: "已指派尽调专员或资方机构，正在进行线下勘验或信贷授信审查",
  },
  SUCCESS: {
    label: "申请成功",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300",
    dotClass: "bg-emerald-500",
    description: "资方授信审批通过并完成线上抵质押贷款放款",
  },
  APPLY_FAILED: {
    label: "申请失败",
    badgeClass:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300",
    dotClass: "bg-rose-500",
    description: "运营审核不予准入或不合规，已驳回进入被拒退回池",
  },
}

export const SURVEY_OPTIONS = [
  { value: "ALL", label: "全部尽调状态" },
  { value: "YES", label: "需要尽调" },
  { value: "NO", label: "无需尽调" },
]

export const STATUS_OPTIONS = [
  { value: "ALL", label: "全部融资状态" },
  { value: "PENDING_ACCEPT", label: "待受理" },
  { value: "PROCESSING", label: "处理中" },
  { value: "SUCCESS", label: "申请成功" },
  { value: "APPLY_FAILED", label: "申请失败" },
]

export const COLLATERAL_OPTIONS = [
  { value: "ALL", label: "全部抵/质押物" },
  { value: "仓单", label: "仓单" },
  { value: "存货", label: "存货" },
]

export const REJECT_REASONS = [
  "押品估值不足，货主拒绝补保或下调意向金额",
  "申请主体工商经营异常或存在大额被执行记录",
  "质押资产权属证明材料不完整或真实性存疑",
  "货物规格与仓储库区准入名录不符",
  "客户主动申请撤回融资意向",
  "其他风险控制不予准入原因",
]

export const AVAILABLE_SURVEYORS = [
  { id: "S001", name: "李巡检（森云现场勘验部）", phone: "13911002233" },
  { id: "S002", name: "张审核（森云风险部现场组）", phone: "13822114455" },
  { id: "S003", name: "王工（森云大宗质检技术部）", phone: "13766558899" },
]

export const AVAILABLE_FUNDERS = [
  { id: "F001", name: "四川享宇科技金融服务部", code: "XY-FIN-01" },
  { id: "F002", name: "卡皮商业银行成都高新科技支行", code: "KP-BANK-CD" },
  { id: "F003", name: "中国建设银行四川省分行营业部", code: "CCB-SC-01" },
  { id: "F004", name: "浙商银行现代供应链金融事业部", code: "CZB-SCM-02" },
]

export function formatAmountWan(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "—"
  }
  return `${amount.toFixed(4)}万元`
}

export function customerFinancingLeadDetailPath(id: string): string {
  return `/融资/监管/融资管理/客户融资需求线索/详情/${encodeURIComponent(id)}`
}

export const CUSTOMER_FINANCING_LEADS_LIST_PATH = "/融资/监管/融资管理/客户融资需求线索"

