/**
 * 货物异动 - 异动记录数据模型规范
 * 依据三件套：《货物异动_异动记录主PRD.md》、《货物异动_异动记录字段清单.md》、《货物异动_异动记录业务规则规格.md》
 */

export type AbnormalOrderType = "PLEDGE" | "MORTGAGE" | "SUPERVISION" | "IN_STOCK"
export type AbnormalOrderTypeLabel = "质押单" | "抵押单" | "监管业务单" | "存货单"

export type AbnormalType = "PROFIT" | "LOSS" | "DAMAGE" | "OTHER"
export type AbnormalTypeLabel = "盘盈" | "盘亏" | "损耗" | "其他"

export interface AbnormalOwnerInfo {
  ownerName: string
  ownerType: "ENTERPRISE" | "INDIVIDUAL"
  ownerIdentity: string // 企业统一社会信用代码或脱敏个人手机号
}

/** 单据下具体调账货物行（支持一单多物） */
export interface AbnormalGoodsLine {
  id: string
  goodsName: string // 如 "水果-苹果-新疆-特级" 或 "冻货-鸡翅-四川-特级-2025"
  unit: string // 如 "箱"、"公斤"、"斤"、"吨"
  location: string // 如 "海霸王仓库-冻库1审核-分区1冷藏"
  specificLocation?: string // 具体储位/货架
  beforeQty: number // 变动前数量
  afterQty: number // 变动后数量
  diffQty: number // 差额 ΔQ (after - before)
  diffQtyDisplay: string // 带符号差额如 "+49.0007斤"、"-2公斤"
  abnormalType: AbnormalTypeLabel // "盘盈" | "盘亏" | "损耗" | "其他"
  reason?: string // 变动原因
  barcode?: string // 存货条码如 "SN20260512001"
  barcodeCreatedAt?: string // 二维码生成时间如 "2026-09-28 15:37:13"
  photos?: string[] // 现场照片凭证
}

/** 审批时间轴节点 */
export interface AbnormalApprovalNode {
  id: string
  title: string // "申请提交" | "分配" | "任务" | "仅抄送" | "审批通过"
  handlerName: string // "lxy(四川享宇科技有限公司)" | "阿平(数据审核部门)"
  handleTime: string // "2026-09-28 17:08:19"
  roleDesc?: string // 发起人 | 抄送人 | 处理人
  hasTaskDetail?: boolean // 是否有【任务详情 >】
  taskId?: string
  status: "COMPLETED" | "CURRENT" | "WAITING"
}

/** 异动台账主记录 */
export interface AbnormalRecord {
  id: string // 19位异动单号，如 "2115716778078556181"
  relateId: string // 关联单号，如 "2115888413305585665"
  relateOrderType: AbnormalOrderTypeLabel // "质押单" | "抵押单" | "监管业务单" | "存货单"
  owner: AbnormalOwnerInfo
  goodsLines: AbnormalGoodsLine[]
  applicantName: string // "lxy (四川享宇科技有限公司)"
  applyTime: string // "2026-10-23 16:08:03"
  effectiveTime: string // "2026-10-23 16:15:00"
  status: "EFFECTIVE" // 已生效归档
  processTitle: string // 流程名称，如 "仅抄送" 或 "抵质押简单总流程"
  approvalNodes: AbnormalApprovalNode[]
}

/** 列表筛选条件 */
export interface AbnormalRecordFilters {
  abnormalNo: string // 异动单号
  relateNo: string // 关联单据
  orderTypes: AbnormalOrderTypeLabel[] // 单据类型
  ownerKeyword: string // 货主名称/标识
  abnormalTypes: AbnormalTypeLabel[] // 异动类型多选
  warehouseCascade: string[] // 仓库+库房
  goodsKeyword: string // 货物名称
  dateRange: {
    startDate: string
    endDate: string
  }
}

