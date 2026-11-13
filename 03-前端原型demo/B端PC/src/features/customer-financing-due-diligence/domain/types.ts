export type DiligenceStatus =
  | "PENDING_DILIGENCE" // 待尽调
  | "IN_PROCESSING" // 受理中
  | "DILIGENCE_SUCCESS" // 受理成功
  | "DILIGENCE_FAILED" // 受理失败
  | "MANUAL_REJECTED" // 申请失败（专员手动拒绝）

export type DiligenceTab = "PENDING" | "COMPLETED"

export type ApplicantType = "企业货主" | "个人货主"

export type CollateralType = "存货" | "仓单"

export type RiskControlConclusion = "PASS" | "REJECT" | "REVIEW"

export interface DiligenceInventoryItem {
  id: string
  category: string // 货物大类，例如 "有色金属"
  subcategory: string // 货物细类，例如 "电解铜"
  specification: string // 规格型号，例如 "Cu-CATH-1"
  quantity: number // 数量
  unit: string // 单位，例如 "吨"
  warehouseLocation: string // 存储库位，例如 "A区-03库位"
  declaredValue: number // 申报货值（元）
}

export interface DiligenceWarehouseReceipt {
  receiptNo: string // 仓单编号，例如 "CR-2026-WX00912"
  warehouseName: string // 开单仓库
  estimatedValue: number // 货值估价（元）
  freezeStatus: "已质押冻结" | "未冻结"
}

export interface DiligenceAttachment {
  id: string
  name: string
  size: string
  type: string
  uploadedAt: string
  url?: string
  isReport?: boolean // 是否为正式盖章版尽调报告
}

export interface DiligenceAuditLog {
  id: string
  action: string
  operator: string
  organization?: string
  time: string
  detail?: string
}

export interface CustomerFinancingDueDiligence {
  id: string // 尽调任务主键，例如 "DIL_202611020001"
  sourceApplyNo: string // 上游申请流水号，例如 "CLUE_202611020001"
  productName: string // 产品名称
  applicantName: string // 申请人名称（企业或个人）
  applicantType: ApplicantType // 申请人类型
  applicantIdentifier: string // 统一社会信用代码 / 身份证号（脱敏）
  applicantLegalPerson?: string // 法人姓名
  applicantLegalPersonIdCard?: string // 法人身份证号（脱敏）
  agentName: string // 经办人姓名
  agentPhone: string // 经办人联系方式（严格掩码脱敏，如 138****8888）
  intendedAmount: number // 意向融资金额（元，>0，保留4位小数，只读透传 R07）
  intendedPeriods: number // 意向融资期数（如 12）
  collateralType: CollateralType // 抵/质押物：存货 / 仓单
  goodsName?: string // 货物名称（例如：阴极铜（电解铜）、热轧卷板）
  appliedAt: string // 申请时间
  creditAmount: number | null // 授信金额（元），初始展示 "--"
  creditPeriods: number | null // 授信期数，初始展示 "--"
  loanAmount: number | null // 贷款金额（元），初始展示 "--"
  loanPeriods: number | null // 贷款期数，初始展示 "--"
  warehouseReceiptNo?: string // 仓单编号（若为仓单）
  warehouseName?: string // 监管仓库名称
  status: DiligenceStatus // 尽调状态
  surveyor: string // 尽调人员（当前负责专员）
  surveyorPhone?: string // 尽调专员电话
  assignedAt: string // 尽调分配时间
  processedAt: string // 处理时间
  riskConclusion?: RiskControlConclusion // 智风控结论：PASS / REJECT / REVIEW
  riskScore?: number // 智风控综合评分（0~100）
  riskDetailSummary?: string // 智风控摘要
  partnerFunderName?: string // 合作资方机构（分配资方后回写）
  rejectCategory?: string // 手动拒绝原因分类
  rejectDetail?: string // 详细拒绝原因描述（<= 300字）
  transferHistory?: {
    fromSurveyor: string
    toSurveyor: string
    reason?: string
    time: string
  }[]
  inventoryDetails?: DiligenceInventoryItem[] // 存货明细表格
  warehouseReceiptDetails?: DiligenceWarehouseReceipt // 仓单明细
  attachments: DiligenceAttachment[] // 现场尽调材料清单（含尽调报告）
  logs: DiligenceAuditLog[] // 全链路审计流转历史
}

export interface DueDiligenceFilters {
  keyword: string // 综合搜索：申请人 / 产品名称
  applicantType: string // "ALL" | "企业" | "个人"
  status: string // "ALL" 或对应标签页下的具体状态
  surveyor?: string // 尽调专员
  assignedFrom?: string // 尽调分配时间起（YYYY-MM-DD）
  assignedTo?: string // 尽调分配时间止（YYYY-MM-DD）
}

export type DiligenceFilters = DueDiligenceFilters
