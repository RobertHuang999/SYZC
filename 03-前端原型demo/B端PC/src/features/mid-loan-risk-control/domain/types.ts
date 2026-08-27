export const EXECUTION_STATUSES = [
  "未执行",
  "提交中",
  "提交成功（处理中）",
  "提交失败",
  "触发预警",
  "未触发预警",
] as const

export type ExecutionStatus = (typeof EXECUTION_STATUSES)[number]

export type Executability = "可执行" | "不可执行"

export type OrderType = "抵押" | "质押"

export type MidLoanRiskRecord = {
  recordId: string
  orderNo: string
  ownerName: string
  ownerId: string
  collateralInfo: string
  orderCreatedAt: string
  orderType: OrderType
  riskModel: string
  executability: Executability
  executionCount: number
  warningCount: number
  lastExecutionStatus: ExecutionStatus
  lastExecutionTime: string | null
  lastSubmittedBy: string | null
}

export type ExecutionStatusFilter = "全部" | ExecutionStatus

export type ExecutabilityFilter = "全部" | Executability

export type MidLoanRiskFilters = {
  orderNo: string
  executionStatus: ExecutionStatusFilter
  executability: ExecutabilityFilter
}

export type ExecutionHistoryEntry = {
  executionId: string
  submittedAt: string
  submittedBy: string
  status: ExecutionStatus
  modelScore: number | null
  resultDescription: string | null
  zfkTaskNo: string | null
  needsSupplement: boolean
}

export type MidLoanRiskRecordDetailExtension = {
  ineligibilityReason: string | null
  executionHistory: ExecutionHistoryEntry[]
}

export type MidLoanRiskRecordDetail = MidLoanRiskRecord &
  MidLoanRiskRecordDetailExtension
