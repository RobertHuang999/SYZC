export type FinancingStatus =
  | "CREDIT_SUCCESS"
  | "IN_PROCESSING"
  | "LOAN_DISBURSED"
  | "SETTLED"

export type ProcessingStage =
  | "INFO_REVIEW"
  | "PROCESS_AUDIT"
  | "ORDER_GENERATED"

export type ApplicantType = "ENTERPRISE" | "INDIVIDUAL"

export type CollateralType = "INVENTORY" | "WAREHOUSE_RECEIPT"

export type CollateralAvailability = "AVAILABLE" | "LOCKED" | "OCCUPIED"

export interface PledgeInventoryItem {
  id: string
  categoryName: string
  varietyName: string
  specModel: string
  warehouseName: string
  zoneLocation: string
  pledgeQuantity: number
  unit: string
  unitPriceYuan: number
  assessedValueYuan: number
  availability: CollateralAvailability
}

export interface PledgeReceiptItem {
  id: string
  receiptNo: string
  goodsSummary: string
  warehouseName: string
  quantityText: string
  assessedValueYuan: number
  availability: CollateralAvailability
}

export interface PledgeAttachmentItem {
  id: string
  category: "申请资料" | "尽调报告" | "电子质押协议" | "放款回单"
  fileName: string
  fileSize: string
  uploadedAt: string
}

export interface PledgeTimelineEvent {
  id: string
  time: string
  action: string
  operator: string
  operatorOrg: string
  result: string
  remark?: string
}

export interface OnlinePledgeRecord {
  id: string
  applyNo: string
  productName: string
  needDiligence: boolean
  funderName: string
  applicantType: ApplicantType
  applicantName: string
  applicantIdentifier: string
  applicantPhone?: string
  applicantIdCard?: string
  businessLicenseNo?: string
  businessLicenseFileName?: string
  agentName?: string
  agentPhone?: string
  agentIdCard?: string
  collateralType: CollateralType
  inventoryItems: PledgeInventoryItem[]
  receiptItems: PledgeReceiptItem[]
  assessedValueYuan: number
  intendedAmountYuan: number
  intendedPeriods: number
  creditAmountYuan: number
  creditPeriods: number
  loanAmountYuan?: number
  loanPeriods?: number
  disburseDate?: string
  disburseReceiptFileName?: string
  approvedPledgeRatio?: number
  pledgeOrderNo?: string
  evidenceHash?: string
  financingStatus: FinancingStatus
  processingStage?: ProcessingStage
  appliedAt: string
  handlerName: string
  handledAt: string
  version: number
  lastRollbackReason?: string
  attachments: PledgeAttachmentItem[]
  timeline: PledgeTimelineEvent[]
}

export interface OnlinePledgeFilters {
  applyNo: string
  keyword: string
  financingStatus: "ALL" | FinancingStatus
  needDiligence: "ALL" | "YES" | "NO"
  collateralType: "ALL" | CollateralType
  applicantType: "ALL" | ApplicantType
  appliedStartDate: string
  appliedEndDate: string
}

export const DEFAULT_ONLINE_PLEDGE_FILTERS: OnlinePledgeFilters = {
  applyNo: "",
  keyword: "",
  financingStatus: "ALL",
  needDiligence: "ALL",
  collateralType: "ALL",
  applicantType: "ALL",
  appliedStartDate: "",
  appliedEndDate: "",
}

export const ONLINE_PLEDGE_LIST_PATH = "/融资/监管/融资管理/线上监管业务办理"

export function onlinePledgeDetailPath(id: string): string {
  return `${ONLINE_PLEDGE_LIST_PATH}/详情/${encodeURIComponent(id)}`
}

export function onlinePledgeActionPath(
  id: string,
  action?: "initiate" | "audit" | "cancel" | "disburse",
): string {
  const base = `${ONLINE_PLEDGE_LIST_PATH}/操作/${encodeURIComponent(id)}`
  return action ? `${base}?action=${action}` : base
}

export const ONLINE_PLEDGE_STORAGE_KEY = "syzc-pc-online-pledge-records-v1"

export const FINANCING_STATUS_META: Record<
  FinancingStatus,
  { label: string; badgeClass: string; desc: string }
> = {
  CREDIT_SUCCESS: {
    label: "申请成功",
    badgeClass:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
    desc: "授信已核准通过，待发起抵质押信息确认",
  },
  IN_PROCESSING: {
    label: "处理中",
    badgeClass:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    desc: "已发起确认，正在进行审核、签章或待录入放款结果",
  },
  LOAN_DISBURSED: {
    label: "已放款",
    badgeClass:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    desc: "抵质押订单已开立且贷款结果已录入，存货/仓单强锁定中",
  },
  SETTLED: {
    label: "已结清",
    badgeClass:
      "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    desc: "关联订单已完成解质押结清，单据终态只读归档",
  },
}

export const PROCESSING_STAGE_LABEL: Record<ProcessingStage, string> = {
  INFO_REVIEW: "信息确认审核中",
  PROCESS_AUDIT: "抵质押流程审核中",
  ORDER_GENERATED: "订单已生成 · 待录入放款",
}

export const COLLATERAL_TYPE_META: Record<
  CollateralType,
  { label: string; badgeClass: string }
> = {
  INVENTORY: {
    label: "现货存货",
    badgeClass:
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300",
  },
  WAREHOUSE_RECEIPT: {
    label: "数字仓单",
    badgeClass:
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-300",
  },
}

export function formatYuan(amount?: number): string {
  if (amount === undefined || amount === null || Number.isNaN(amount)) {
    return "--"
  }
  return `¥${amount.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function nowFormatted(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export function todayDateString(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

