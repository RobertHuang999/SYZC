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

export const H5_ONLINE_PLEDGE_LIST_PATH = "/m/finance/online-pledge"
export const H5_ONLINE_PLEDGE_STORAGE_KEY = "syzc-h5-online-pledge-records-v1"

export function h5OnlinePledgeDetailPath(id: string): string {
  return `${H5_ONLINE_PLEDGE_LIST_PATH}/${encodeURIComponent(id)}`
}

export function h5OnlinePledgeActionPath(
  id: string,
  action?: "initiate" | "audit" | "cancel" | "disburse",
): string {
  const base = `${H5_ONLINE_PLEDGE_LIST_PATH}/${encodeURIComponent(id)}/action`
  return action ? `${base}?action=${action}` : base
}

export const FINANCING_STATUS_META: Record<
  FinancingStatus,
  { label: string; pillClass: string }
> = {
  CREDIT_SUCCESS: {
    label: "申请成功",
    pillClass: "border-sky-200 bg-sky-50 text-sky-700",
  },
  IN_PROCESSING: {
    label: "处理中",
    pillClass: "border-amber-200 bg-amber-50 text-amber-700",
  },
  LOAN_DISBURSED: {
    label: "已放款",
    pillClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  SETTLED: {
    label: "已结清",
    pillClass: "border-slate-200 bg-slate-100 text-slate-600",
  },
}

export const PROCESSING_STAGE_LABEL: Record<ProcessingStage, string> = {
  INFO_REVIEW: "信息确认审核中",
  PROCESS_AUDIT: "抵质押流程审核中",
  ORDER_GENERATED: "订单已生成 · 待录入放款",
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

