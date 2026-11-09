/** 货物异动 · 移动端领域模型（对齐 PC 基准三件套《货物异动_异动记录字段清单》《…业务规则规格》） */

/** 单据类型：异动货物的货权来源 */
export type AbnormalOrderTypeLabel = "质押单" | "抵押单" | "监管业务单" | "存货单"

/** 异动类型：差异调整属性 */
export type AbnormalTypeLabel = "盘盈" | "盘亏" | "损耗" | "其他"

export interface AbnormalOwnerInfo {
  ownerName: string
  ownerType: "ENTERPRISE" | "INDIVIDUAL"
  /** 企业统一社会信用代码或个人脱敏手机号 */
  ownerIdentity: string
}

/** 单据下具体调账货物行（一单可多物） */
export interface AbnormalGoodsLine {
  id: string
  goodsName: string
  unit: string
  /** 仓库-库房-分区 */
  location: string
  specificLocation?: string
  /** 变动前数量 */
  beforeQty: number
  /** 变动后数量 */
  afterQty: number
  /** 差额 = 变动后 - 变动前 */
  diffQty: number
  /** 带符号差额展示，如 "+49.0007斤"、"-2公斤"（与 PC 一致） */
  diffQtyDisplay?: string
  abnormalType: AbnormalTypeLabel
  reason?: string
  barcode?: string
  /** 二维码生成时间 */
  barcodeCreatedAt?: string
  photos?: string[]
}

export interface AbnormalApprovalNode {
  id: string
  title: string
  handlerName: string
  handleTime: string
  roleDesc?: string
  hasTaskDetail?: boolean
  taskId?: string
  status?: "COMPLETED" | "CURRENT" | "WAITING"
}

/** 异动台账记录（台账只展示已生效归档单据） */
export interface AbnormalRecord {
  id: string
  relateId: string
  relateOrderType: AbnormalOrderTypeLabel
  owner: AbnormalOwnerInfo
  goodsLines: AbnormalGoodsLine[]
  /** 发生异动的实体仓库（用于列表筛选） */
  warehouseName: string
  applicantName: string
  applyTime: string
  effectiveTime: string
  status: "EFFECTIVE"
  processTitle: string
  approvalNodes: AbnormalApprovalNode[]
}
