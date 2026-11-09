export type OwnerType = "ENTERPRISE" | "PERSONAL"

/* ------------------------------------------------------------------ *
 * 移库记录（来源：PC 11-移库管理-移库记录 三件套）
 * ------------------------------------------------------------------ */

/** 移库发起页使用的流程类型（保留给业务办理·移库发起） */
export type MovingFlowTypeValue = "NORMAL" | "PLEDGE" | "MORTGAGE" | "CD"

/** 移库类型（台账取值，与 PC 字段清单一致） */
export type MovingRecordType = "普通移库" | "质押移库" | "抵押移库" | "仓单移库"

export type MovingOwnerType = "企业" | "个人"

/** 移库货品与储位调拨明细（一条库存位置一行） */
export interface MovingGoodsLine {
  id: string
  goodsName: string
  outLocation: string
  outSpecific: string
  inboundTime: string
  otherInfo?: string
  barcode: string
  quantity: number
  unit: string
  availableQty: number
  inRoomZone: string
  inSpecific: string
}

/** 移库审批节点 */
export interface MovingAuditNode {
  id: string
  title: string
  handlerName: string
  handleTime: string
  result: string
  comment?: string
}

/** 移库台账记录（列表卡片与详情页共用，与 PC RelocationRecord 同构） */
export interface MovingRecordItem {
  id: string
  moveTime: string
  ownerType: MovingOwnerType
  ownerName: string
  ownerIdentifier: string
  moveType: MovingRecordType
  relatedNo?: string
  warehouseName: string
  goodsNameSummary: string
  totalQty: number
  unit: string
  creatorName: string
  creatorOrg: string
  createTime: string
  status: "已通过"
  remark?: string
  goods: MovingGoodsLine[]
  photos: string[]
  auditNodes: MovingAuditNode[]
}

export interface MobileOwnerEntity {
  ownerName: string
  ownerType: OwnerType
  ownerIdentity: string // 企业统一社会信用代码或个人手机号（脱敏）
  idCardNo?: string
}

/** 二级库存储位明细（对齐 PC 转让记录字段清单 2.2） */
export interface MobileTransferLocationDetail {
  id: string
  locationName: string // 仓库-库房-分区
  specificLocation: string // 具体位置/货架/垛位，无值展示“——”
  inboundTime: string
  otherInfo?: string // 原库存扩展属性，无值展示“—”
  barcode: string // 存货条码
  barcodeQrUrl?: string
  status: string // 在库状态，固定“存货中”
  amount: number
  unit: string
}

/** 一级货品主行（对齐 PC 转让记录字段清单 2.1） */
export interface MobileTransferGoodsItem {
  id: string
  goodsName: string // 大类-品类-规格
  cateName?: string
  typeName?: string
  specName?: string
  warehouseName: string
  warehouseId?: string
  amount: number
  unit: string
  locations: MobileTransferLocationDetail[]
}

/** 审批流转节点（对齐 PC TransferAuditLog） */
export interface MobileTransferAuditLog {
  id: string
  flowName?: string
  nodeName: string
  operatorName: string
  operatorOrg: string
  action: "SUBMIT" | "APPROVE" | "REJECT" | "REVOKE"
  actionName: string
  time: string
  comment?: string
}

/** 转让记录主实体（对齐 PC TransferRecord / 三件套字段清单） */
export interface MobileTransferRecord {
  id: string // 19位转让单号
  assignTime: string // 转让时间
  sourceOwner: MobileOwnerEntity // 转让人（出让原货主）
  targetOwner: MobileOwnerEntity // 接收人（受让新货主）
  warehouseName: string
  warehouseId?: string
  amount: number // 转让总数量
  unit: string
  goodsSummaryText: string
  goodsDisplayList: Array<{ name: string; amount: number; unit: string }>
  goodsList: MobileTransferGoodsItem[]
  assignReason: string
  createByName: string
  createOrgName: string
  createTime: string
  status: "APPROVED"
  auditLogs: MobileTransferAuditLog[]
}
