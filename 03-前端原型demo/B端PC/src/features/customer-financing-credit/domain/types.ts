export type CreditStatus =
  | "CREDIT_ACCEPTED" // 授信已受理
  | "APPLY_SUCCESS" // 申请成功
  | "APPLY_FAILED" // 申请失败

export type ApplicantType = "企业货主" | "个人货主"

export type CollateralType = "存货" | "仓单"

export type RejectCategory =
  | "综合负债率过高"
  | "质押率不达标"
  | "经营风险未通过"
  | "其他原因"

export interface CreditInventoryItem {
  id: string
  category: string // 货物大类，例如 "有色金属"
  subcategory: string // 货物细类，例如 "阴极铜(电解铜)"
  specification: string // 规格型号，例如 "Cu-CATH-1"
  quantity: number // 数量
  unit: string // 单位，例如 "吨"
  warehouseLocation: string // 存储库位，例如 "A区-03库位"
  declaredValue: number // 申报货值（元）
}

export interface CreditWarehouseReceipt {
  receiptNo: string // 仓单编号，例如 "CR-2026-WX00912"
  warehouseName: string // 开单仓库
  estimatedValue: number // 货值估价（元）
  freezeStatus: "已质押冻结" | "未冻结"
}

export interface CreditChangeRecord {
  id: string
  operator: string
  organization: string
  time: string
  fromStatus: CreditStatus
  toStatus: CreditStatus
  reason: string
  creditAmount?: number | null
  creditPeriods?: number | null
}

export interface CreditAuditLog {
  id: string
  action: string
  operator: string
  organization: string
  time: string
  detail?: string
}

export interface CustomerFinancingCredit {
  id: string // 授信任务主键，例如 "CRD_202611030001"
  sourceApplyNo: string // 上游申请流水号，例如 "CLUE_202611020001"
  productName: string // 产品名称
  needDiligence: boolean // 需要尽调：true(是) / false(否)
  applicantType: ApplicantType // 申请人类型：企业货主 / 个人货主
  applicantName: string // 申请人全称（企业或个人）
  applicantIdentifier: string // 统一社会信用代码 / 身份证号（脱敏）
  applicantLegalPerson?: string // 法人代表
  agentName: string // 经办人姓名
  agentPhone: string // 经办人联系方式（严格脱敏）
  collateralType: CollateralType // 抵/质押物：存货 / 仓单
  intendedAmount: number // 意向融资金额（元，保留4位小数）
  intendedPeriods: number // 意向融资期数（期）
  creditAmount: number | null // 授信金额（元，核准额度，未授信展示 null）
  creditPeriods: number | null // 授信期数（期，未授信展示 null）
  creditRemark?: string // 授信审批备注
  status: CreditStatus // 融资状态
  isDownstreamTriggered: boolean // 下游是否已发起线上抵质押（若 true，则改标强制锁定 C01）
  isRescheduledInPool?: boolean // 在被拒池是否已被重新调度（若 true，改标不可用）
  funderOrgName: string // 所属资方机构（全员共享基准）
  appliedAt: string // 申请时间
  processor: string // 处理人员（执行标记或改标的专员姓名）
  processedAt: string // 处理时间
  rejectCategory?: RejectCategory // 拒绝原因分类
  rejectDetail?: string // 详细拒绝说明（<= 300字）
  riskScore?: number // 智风控综合评分
  riskSummary?: string // 智风控摘要或免尽调标签
  inventoryDetails?: CreditInventoryItem[] // 存货明细
  warehouseReceiptDetails?: CreditWarehouseReceipt // 仓单明细
  changeRecords: CreditChangeRecord[] // 改标历史
  logs: CreditAuditLog[] // 审计日志
}

export interface CreditFilters {
  keyword: string // 综合搜索：产品名称 / 申请人
  status: string // "ALL" | CreditStatus
  applicantType: string // "ALL" | ApplicantType
  needDiligence: string // "ALL" | "YES" | "NO"
}

