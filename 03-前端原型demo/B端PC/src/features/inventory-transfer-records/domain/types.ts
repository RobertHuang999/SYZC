export type TransferType = "NORMAL" | "PLEDGE" | "MORTGAGE" | "RECEIPT"

export type TransferStatus = "APPROVED" | "PENDING" | "REJECTED" | "REVOKED"

export interface TransferGoodsDetail {
  id: string
  goodsName: string // 大类-品类-规格，如 "水果-西瓜-超级-宁夏"
  cateName: string
  typeName: string
  specName: string
  sourceWarehouse: string
  sourceWarehouseId: string
  sourceRoomZone: string // 仓库-库房-分区
  sourceSpecificLocation: string // 具体位置/垛位
  inboundTime: string
  otherInfo?: string
  barcode: string
  qrCodeUrl?: string
  status: string // 存货中
  availableAmount: number
  transferAmount: number
  unit: string
  targetRoomZone: string // 移入库房/分区
  targetSpecificLocation: string // 移入具体位置
}

export interface TransferGoodsGroup {
  id: string
  index: number
  goodsName: string
  cateName: string
  typeName: string
  specName: string
  warehouseName: string
  warehouseId: string
  totalTransferAmount: number
  unit: string
  details: TransferGoodsDetail[]
}

export interface TransferRecord {
  id: string // 19位移库单号
  ownerType: "ENTERPRISE" | "PERSONAL"
  ownerName: string
  ownerIdentity: string // 企业信用代码或脱敏手机号
  idCardNo?: string // 个人身份证号
  transferTime: string // YYYY-MM-DD HH:mm:ss
  transferType: TransferType
  transferTypeName: string
  relatedId?: string // 质押单号/抵押单号/仓单号
  warehouseName: string
  warehouseId: string
  goodsList: {
    goodsName: string
    cateName: string
    typeName: string
    specName: string
    amount: number
    unit: string
  }[]
  totalAmount: number
  unit: string
  createBy: string
  createByName: string
  createOrgName: string
  createTime: string
  remark: string
  status: TransferStatus
  scenePhotos: string[]
  capturePhotos: {
    deviceName: string
    deviceCustomName: string
    zoneName: string
    photoUrl: string
    captureTime: string
  }[]
  groups?: TransferGoodsGroup[]
  flatDetails?: TransferGoodsDetail[]
}

export interface TransferRecordFilters {
  id: string // 移库单号
  transferType: string // 移库类型
  ownerNameOrIdentity: string // 货主名称/标识
  warehouseId: string // 仓库
  goodsName: string // 货品名称
  createBy: string // 制单人
  transferStartDate: string // 移库开始日期
  transferEndDate: string // 移库结束日期
  createStartDate: string // 制单开始日期
  createEndDate: string // 制单结束日期
}

export interface DownloadLogItem {
  id: string
  fileName: string
  operator: string
  createTime: string
  status: "SUCCESS" | "GENERATING" | "FAILED"
  downloadUrl?: string
}

export interface AuditRecordItem {
  id: string
  nodeName: string
  operatorName: string
  operatorRole: string
  action: string
  actionTime: string
  opinion?: string
  status: "APPROVED" | "REJECTED" | "PENDING"
}

