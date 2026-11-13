export type RejectPoolTabKey = "CLUE_REJECTED" | "DILIGENCE_FAILED" | "CREDIT_FAILED"

export type RejectNodeName =
  | "需求线索驳回"
  | "尽调风控不通过"
  | "授信资方拒绝"

export type RejectBusinessStatus = "APPLY_FAILED" | "ACCEPT_FAILED"

export type ApplicantType = "ENTERPRISE" | "INDIVIDUAL"

export type CollateralType = "INVENTORY" | "WAREHOUSE_RECEIPT"

export interface InventoryItem {
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
}

export interface AttachmentItem {
  id: string
  category: "申请资料" | "尽调底稿" | "历史驳回凭证" | "营业执照"
  fileName: string
  fileSize: string
  uploadedBy: string
  uploadedAt: string
  summary: string
}

export interface RejectBatchHistoryItem {
  batchNo: string
  nodeName: string
  actionResult: string
  operatorName: string
  operatorOrg: string
  operatedAt: string
  reasonOrNote: string
  isConfidentialFunderRemark?: boolean
}

export interface RejectPoolRecord {
  id: string
  applyNo: string
  batchNo: string
  tabKey: RejectPoolTabKey
  rejectNodeName: RejectNodeName
  businessStatus: RejectBusinessStatus
  productName: string
  needDiligence: boolean
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
  warehouseReceiptCodes?: string[]
  inventoryItems: InventoryItem[]
  intendedAmountYuan: number
  intendedPeriods: number
  approvedCreditAmountYuan?: number
  approvedCreditPeriods?: number
  lastRejectReason: string
  rejectCount: number
  stagnationHours: number
  appliedAt: string
  rejectHandler: string
  rejectHandlerOrg: string
  rejectedAt: string
  lastSurveyorId?: string
  lastSurveyorName?: string
  historicalRejectedFunders: string[]
  attachments: AttachmentItem[]
  batchHistory: RejectBatchHistoryItem[]
  demoUnlocked?: boolean
}

export interface RejectPoolH5Filters {
  keyword: string
  needDiligence: "ALL" | "YES" | "NO"
  stagnationState: "ALL" | "NORMAL" | "OVERDUE"
  businessStatus: "ALL" | RejectBusinessStatus
  rejectedStart: string
  rejectedEnd: string
}

export const DEFAULT_H5_FILTERS: RejectPoolH5Filters = {
  keyword: "",
  needDiligence: "ALL",
  stagnationState: "ALL",
  businessStatus: "ALL",
  rejectedStart: "",
  rejectedEnd: "",
}

export const H5_REJECT_POOL_LIST_PATH = "/m/finance/reject-pool"
export const H5_REJECT_POOL_STORAGE_KEY = "syzc_h5_reject_pool_records_v1"
export const H5_REJECT_POOL_LOG_STORAGE_KEY = "syzc_h5_reject_pool_logs_v1"
export const OVERDUE_HOURS_THRESHOLD = 72
export const CIRCUIT_BREAKER_LIMIT = 5

export function h5RejectPoolDetailPath(id: string) {
  return `${H5_REJECT_POOL_LIST_PATH}/${encodeURIComponent(id)}`
}

export function h5RejectPoolActionPath(id: string, action?: string) {
  const base = `${H5_REJECT_POOL_LIST_PATH}/${encodeURIComponent(id)}/action`
  return action ? `${base}?action=${encodeURIComponent(action)}` : base
}

export const TAB_META: Record<
  RejectPoolTabKey,
  { label: string; nodeName: RejectNodeName }
> = {
  CLUE_REJECTED: { label: "线索被拒", nodeName: "需求线索驳回" },
  DILIGENCE_FAILED: { label: "尽调失败", nodeName: "尽调风控不通过" },
  CREDIT_FAILED: { label: "授信失败", nodeName: "授信资方拒绝" },
}

export const SURVEYOR_OPTIONS = [
  { id: "SUR-001", name: "陈志强", org: "华东仓储监管尽调一组" },
  { id: "SUR-002", name: "赵明远", org: "华南产业风控尽调组" },
  { id: "SUR-003", name: "林静雯", org: "森云总部驻库尽调部" },
  { id: "SUR-004", name: "周建峰", org: "长三角数字仓单核查组" },
] as const

export const FUNDER_OPTIONS = [
  { id: "FND-001", name: "浦发银行供应链金融部", tag: "有色金属 / 数字仓单" },
  { id: "FND-002", name: "浙商银行宁波分行", tag: "长三角现货质押" },
  { id: "FND-003", name: "网商银行产业金融部", tag: "线上极速授信" },
  { id: "FND-004", name: "平安银行大宗商品金融事业部", tag: "高流动性大宗" },
  { id: "FND-005", name: "苏州银行贸易融资中心", tag: "苏浙监管仓现货" },
] as const

export function formatYuan(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || Number.isNaN(amount)) {
    return "—"
  }
  return amount.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function nextBatchNo(currentBatchNo: string): string {
  const match = currentBatchNo.match(/^(.*)-B(\d+)$/)
  if (!match) {
    return `${currentBatchNo}-B02`
  }
  const nextNum = Number(match[2]) + 1
  return `${match[1]}-B${String(nextNum).padStart(2, "0")}`
}

export function isCircuitBroken(record: RejectPoolRecord): boolean {
  return !record.demoUnlocked && record.rejectCount >= CIRCUIT_BREAKER_LIMIT
}

