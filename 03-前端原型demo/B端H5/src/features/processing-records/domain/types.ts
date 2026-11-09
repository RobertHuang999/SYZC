/**
 * 加工管理 · 移动端领域模型
 * 依据 PC 基准三件套：
 * - 14-加工管理-加工记录/加工管理主PRD.md
 * - 14-加工管理-加工记录/加工管理字段清单.md
 * - 14-加工管理-加工记录/加工管理业务规则规格.md
 */

export type OwnerType = "ENTERPRISE" | "PERSONAL"

export type ProcessingType =
  | "INVENTORY" // 存货加工
  | "PLEDGE" // 质押加工
  | "MORTGAGE" // 抵押加工
  | "REGULATORY_SERVICE" // 监管服务加工

export type ProcessingStatus =
  | "PENDING_COMPLETION" // 未完成
  | "COMPLETED" // 已完成
  | "VOIDED" // 作废

/** 投入货物 · 二级货位明细行 */
export interface ProcessingInputLine {
  id: string
  candidateId?: string
  goodsId?: string
  goodsName: string
  specModel: string
  warehouseId?: string
  warehouseName?: string
  roomZone: string // 仓库-库房-分区
  specificLocation?: string // 具体位置/垛位
  inboundTime: string
  barcode: string
  qrCodeUrl?: string
  otherInfo?: string
  availableAmount?: number // 实时可用量
  planAmount: number // 计划投入数量
  lockedAmount?: number // 锁定数量
  actualAmount?: number // 实际消耗数量（已完成才填）
  releasedAmount?: number // 计划余量自动释放数量
  unit: string
}

/** 投入货物 · 一级货品汇总行 */
export interface ProcessingInputGroup {
  id: string
  goodsId?: string
  goodsName: string // 大类-品类-货品（含规格说明）
  specModel: string
  unit: string
  expanded?: boolean
  lines: ProcessingInputLine[]
}

/** 产出货物明细行 */
export interface ProcessingOutputItem {
  id: string
  goodsId?: string
  goodsName: string
  specModel: string
  unit: string
  expectedQty: number
  actualQty?: number
  price?: number | null // 行业参考单价（元），空表示未定价
  expectedAmount?: number | null
  actualAmount?: number | null
  warehouseLocation: string // 仓库-库房-分区
  specificLocation?: string
  otherInfo?: string
  barcode?: string // 加工入库后生成的新存货条码
  barcodeUrl?: string
  collectAttrs?: Array<{
    key?: string
    label: string
    type?: "text" | "number" | "select" | "date"
    required?: boolean
    options?: string[]
    value?: string
    unit?: string
  }>
}

/** 审批流轨迹节点 */
export interface ProcessingAuditNode {
  id: string
  nodeName: string
  handlerName: string
  handlerOrg?: string
  handleTime: string
  status: "SUBMITTED" | "APPROVED" | "REJECTED" | "PENDING"
  comment?: string
  taskId?: string
}

/** 现场修改 / 作废审计记录 */
export interface ProcessingModifyRecord {
  type: "COMPLETED" | "VOIDED"
  operatorName: string
  operatorOrg?: string
  operateTime: string
  lossRatio?: number
  lossReason?: string
  voidReason?: string
}

/** 现场设备抓拍 */
export interface ProcessingDevicePhoto {
  deviceId: string
  deviceName: string
  url?: string
  status: "SUCCESS" | "FAILED" | "NO_DEVICE"
}

/** 加工记录主台账实体 */
export interface ProcessingRecord {
  id: string // 加工单号
  processingTime: string
  ownerType: OwnerType
  ownerName: string
  ownerIdentity: string
  ownerIdCard?: string
  processingType: ProcessingType
  warehouseId?: string
  warehouseName: string
  associatedOrderId?: string
  status: ProcessingStatus
  remark?: string
  lossRatio?: number
  lossReason?: string
  createByName: string
  createOrgName?: string
  createTime: string
  version?: number
  inputGroups: ProcessingInputGroup[]
  outputItems: ProcessingOutputItem[]
  auditNodes?: ProcessingAuditNode[]
  modifyRecord?: ProcessingModifyRecord
  devicePhotos?: ProcessingDevicePhoto[]
}
