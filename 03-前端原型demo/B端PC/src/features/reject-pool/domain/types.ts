export type RejectPoolTabKey = "CLUE_REJECTED" | "DILIGENCE_FAILED" | "CREDIT_FAILED"
export type RejectPoolTabFilter = "ALL" | RejectPoolTabKey

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
  /** 是否属于前序资方内部敏感评语（P02 向新资方推送时自动脱敏） */
  isConfidentialFunderRemark?: boolean
}

export interface RejectPoolRecord {
  id: string
  /** 申请单号：FIN-YYYYMMDD-XXXX */
  applyNo: string
  /** 当前重调度批次号：apply_no-BNN */
  batchNo: string
  /** 归属标签页（严格对应 R01） */
  tabKey: RejectPoolTabKey
  /** 退回节点名称 */
  rejectNodeName: RejectNodeName
  /** 融资业务状态 */
  businessStatus: RejectBusinessStatus
  /** 产品名称 */
  productName: string
  /** 需要尽调快照 */
  needDiligence: boolean
  /** 申请人类型 */
  applicantType: ApplicantType
  /** 申请人名称 */
  applicantName: string
  /** 申请人标识（企业信用代码 / 脱敏手机号） */
  applicantIdentifier: string
  /** 个人货主：申请人电话（脱敏） */
  applicantPhone?: string
  /** 个人货主：申请人身份证号（脱敏） */
  applicantIdCard?: string
  /** 企业货主：营业执照信息 */
  businessLicenseNo?: string
  businessLicenseFileName?: string
  /** 企业货主：经办人名称 */
  agentName?: string
  /** 企业货主：经办人手机号（脱敏） */
  agentPhone?: string
  /** 企业货主：经办人证件号（脱敏） */
  agentIdCard?: string
  /** 抵/质押物类型 */
  collateralType: CollateralType
  /** 仓单编号列表（数字仓单时有值） */
  warehouseReceiptCodes?: string[]
  /** 存货明细（现货存货或仓单关联标的预览） */
  inventoryItems: InventoryItem[]
  /** 意向融资金额（元） */
  intendedAmountYuan: number
  /** 意向融资期数（月/期） */
  intendedPeriods: number
  /** 原核准授信额度（元） */
  approvedCreditAmountYuan?: number
  /** 原核准授信期数 */
  approvedCreditPeriods?: number
  /** 贷款金额（元） */
  loanAmountYuan?: number
  /** 贷款期数 */
  loanPeriods?: number
  /** 最后被拒原因 */
  lastRejectReason: string
  /** 历史被拒次数 */
  rejectCount: number
  /** 停滞时长（小时） */
  stagnationHours: number
  /** 申请时间 */
  appliedAt: string
  /** 退回处理人 */
  rejectHandler: string
  /** 退回处理机构 */
  rejectHandlerOrg: string
  /** 退回时间 */
  rejectedAt: string
  /** 上一轮尽调专员（用于 S03 限制不可指派同一人） */
  lastSurveyorId?: string
  lastSurveyorName?: string
  /** 历史曾经拒绝过的合作资金方名称列表（用于 R03 标红 *历史曾拒） */
  historicalRejectedFunders: string[]
  /** 全量附件资料 */
  attachments: AttachmentItem[]
  /** 多轮重调度与历次被拒履历 */
  batchHistory: RejectBatchHistoryItem[]
  /** 是否已被管理员通过线下特批演示解除熔断（仅原型演示） */
  demoUnlocked?: boolean
}

export interface RescheduledLogItem {
  id: string
  applyNo: string
  batchNo: string
  applicantName: string
  productName: string
  actionName: string
  targetStatusLabel: string
  targetAssignee: string
  operatedAt: string
}

export interface RejectPoolFilters {
  applyNo: string
  keyword: string
  needDiligence: "ALL" | "YES" | "NO"
  stagnationState: "ALL" | "NORMAL" | "OVERDUE"
  rejectNodeName: "ALL" | RejectNodeName
  businessStatus: "ALL" | RejectBusinessStatus
  appliedStart: string
  appliedEnd: string
  rejectedStart: string
  rejectedEnd: string
}

export const DEFAULT_REJECT_POOL_FILTERS: RejectPoolFilters = {
  applyNo: "",
  keyword: "",
  needDiligence: "ALL",
  stagnationState: "ALL",
  rejectNodeName: "ALL",
  businessStatus: "ALL",
  appliedStart: "",
  appliedEnd: "",
  rejectedStart: "",
  rejectedEnd: "",
}

export const REJECT_POOL_LIST_PATH = "/融资/监管/融资管理/被拒退回记录池"
export const REJECT_POOL_ALIAS_PATH = "/融资/监管/融资管理/被拒退回池"
export const REJECT_POOL_STORAGE_KEY = "syzc_reject_pool_records_v1"
export const REJECT_POOL_LOG_STORAGE_KEY = "syzc_reject_pool_rescheduled_logs_v1"
export const OVERDUE_HOURS_THRESHOLD = 72
export const CIRCUIT_BREAKER_LIMIT = 5

export function rejectPoolDetailPath(id: string) {
  return `${REJECT_POOL_LIST_PATH}/详情/${encodeURIComponent(id)}`
}

export function rejectPoolActionPath(id: string, action?: string) {
  const base = `${REJECT_POOL_LIST_PATH}/操作/${encodeURIComponent(id)}`
  return action ? `${base}?action=${encodeURIComponent(action)}` : base
}

export const TAB_META: Record<
  RejectPoolTabKey,
  {
    label: string
    shortLabel: string
    nodeName: RejectNodeName
    description: string
  }
> = {
  CLUE_REJECTED: {
    label: "① 线索被拒",
    shortLabel: "线索被拒",
    nodeName: "需求线索驳回",
    description: "需求线索节点被运营驳回的单据，可修改资料重新救活或按路由重派",
  },
  DILIGENCE_FAILED: {
    label: "② 尽调失败",
    shortLabel: "尽调失败",
    nodeName: "尽调风控不通过",
    description: "智风控不通过或尽调专员拒单，可改派新专员重审或特批直分资方",
  },
  CREDIT_FAILED: {
    label: "③ 授信失败",
    shortLabel: "授信失败",
    nodeName: "授信资方拒绝",
    description: "合作资方拒绝授信申请，原尽调结论继续有效，仅开放重新分配资方",
  },
}

export const BUSINESS_STATUS_META: Record<
  RejectBusinessStatus,
  { label: string; badgeClass: string }
> = {
  APPLY_FAILED: {
    label: "申请失败",
    badgeClass: "border-rose-200 bg-rose-50 text-rose-700",
  },
  ACCEPT_FAILED: {
    label: "受理失败",
    badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
  },
}

export const REJECT_NODE_BADGE_CLASS: Record<RejectNodeName, string> = {
  需求线索驳回: "border-orange-200 bg-orange-50 text-orange-700",
  尽调风控不通过: "border-violet-200 bg-violet-50 text-violet-700",
  授信资方拒绝: "border-rose-200 bg-rose-50 text-rose-700",
}

export const SURVEYOR_OPTIONS = [
  {
    id: "SUR-001",
    name: "陈志强",
    org: "华东仓储监管尽调一组",
    specialty: "有色金属 / 电解铜铝",
    enabled: true,
  },
  {
    id: "SUR-002",
    name: "赵明远",
    org: "华南产业风控尽调组",
    specialty: "钢铁 / 煤炭大宗",
    enabled: true,
  },
  {
    id: "SUR-003",
    name: "林静雯",
    org: "森云总部驻库尽调部",
    specialty: "橡胶 / 化工能源",
    enabled: true,
  },
  {
    id: "SUR-004",
    name: "周建峰",
    org: "长三角数字仓单核查组",
    specialty: "电子仓单 / 交叉审计",
    enabled: true,
  },
] as const

export const FUNDER_OPTIONS = [
  {
    id: "FND-001",
    name: "浦发银行供应链金融部",
    preference: "偏好有色金属、数字仓单质押，年化 4.65%~5.20%",
    enabled: true,
  },
  {
    id: "FND-002",
    name: "浙商银行宁波分行",
    preference: "偏好长三角核心制造与现货动产质押",
    enabled: true,
  },
  {
    id: "FND-003",
    name: "网商银行产业金融部",
    preference: "支持中小微标准件线上极速授信（免线下复核）",
    enabled: true,
  },
  {
    id: "FND-004",
    name: "平安银行大宗商品金融事业部",
    preference: "偏好高流动性铜铝钢材，单笔上限 3,000 万元",
    enabled: true,
  },
  {
    id: "FND-005",
    name: "苏州银行贸易融资中心",
    preference: "偏好江苏、浙江监管库现货质押业务",
    enabled: true,
  },
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

export function formatWan(amountYuan: number | undefined | null): string {
  if (amountYuan === undefined || amountYuan === null || Number.isNaN(amountYuan)) {
    return "--"
  }
  const wan = amountYuan / 10000
  const formatted = Number.isInteger(wan)
    ? String(wan)
    : wan.toFixed(2).replace(/\.?0+$/, "")
  return `${formatted}万元`
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

