export type LeadStatus =
  | "PENDING_ACCEPT"
  | "PROCESSING"
  | "SUCCESS"
  | "APPLY_FAILED"

export type ApplicantType = "ENTERPRISE" | "INDIVIDUAL"

export type CollateralType = "仓单" | "存货"

export interface InventoryDetailItem {
  id: string
  category: string // 货物大类，例如 "有色金属"
  subcategory: string // 货物细类，例如 "电解铜"
  specification: string // 规格型号，例如 "Cu-CATH-1"
  quantity: number // 数量
  unit: string // 单位，例如 "吨"
  declaredValue: number // 申报货值（元）
}

export interface LeadAttachment {
  id: string
  name: string
  size: string
  type: string
  uploadedAt: string
}

export interface LeadAuditLog {
  id: string
  action: string
  operator: string
  time: string
  detail?: string
}

export interface CustomerFinancingLead {
  id: string // 线索唯一标识，如 "CLUE_202611020001"
  externalApplyNo: string // 外部申请流水号
  productName: string // 融资产品名称
  requiresSurvey: boolean // 需要尽调：true=是，false=否 (永久固化快照)
  applicantType: ApplicantType // 申请人类型
  applicantName: string // 申请人名称
  applicantIdentifier: string // 申请人统一标识（信用代码 / 手机号脱敏）
  applicantPhone: string // 联系手机号
  applicantIdCard?: string // 个人身份证号（脱敏）
  businessLicense?: string // 营业执照凭证文件名
  agentName?: string // 经办人姓名
  agentPhone?: string // 经办人手机号
  agentIdCard?: string // 经办人身份证号
  collateralType: CollateralType // 抵/质押物类型
  warehouseReceiptNo?: string // 仓单编号（若抵质押物为仓单）
  warehouseName?: string // 存放仓库/开单仓库
  intendedAmount: number // 意向融资金额（元，> 0）
  intendedPeriods: number // 意向融资期数（正整数）
  creditAmount: number | null // 授信金额（元），初始为空展示 "--"
  creditPeriods: number | null // 授信期数，初始为空展示 "--"
  loanAmount: number | null // 贷款金额（元），初始为空展示 "--"
  loanPeriods: number | null // 贷款期数，初始为空展示 "--"
  status: LeadStatus // 融资状态
  appliedAt: string // 申请时间
  acceptedBy: string | null // 受理人员
  acceptedAt: string | null // 受理时间
  lastOperator: string // 最新处理人
  lastOperatedAt: string // 最新处理时间
  rejectReasonCategory?: string // 驳回原因分类
  rejectReasonDetail?: string // 驳回详细说明 (<= 200 字)
  assignedTargetType?: "SURVEYOR" | "FUNDER" // 分配目标类型
  assignedTargetName?: string // 分配目标名称（专员或资方机构）
  inventoryDetails?: InventoryDetailItem[] // 存货明细
  attachments?: LeadAttachment[] // 附件资料
  logs: LeadAuditLog[] // 审计流转历史
}

export interface LeadFilters {
  keyword: string // 综合搜索：产品名称 / 申请人名称
  requiresSurvey: string // "ALL" | "YES" | "NO"
  status: string // "ALL" | "PENDING_ACCEPT" | "ACCEPTED" | "APPLY_FAILED"
  collateralType: string // "ALL" | "仓单" | "存货"
}

