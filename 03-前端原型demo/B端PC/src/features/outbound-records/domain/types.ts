export type OutboundTypeCode =
  | "NORMAL" // 普通出库
  | "RECEIPT" // 仓单出库
  | "CD" // 仓单出库（源码兼容）
  | "PLEDGE" // 质押出库
  | "MORTGAGE" // 抵押出库
  | "TRANSFER" // 移库出库
  | "ASSIGNMENT" // 转让出库
  | "PLEDGE_PROCESSING" // 质押加工出库
  | "MORTGAGE_PROCESSING" // 抵押加工出库

export type OutboundTypeName =
  | "普通出库"
  | "仓单出库"
  | "质押出库"
  | "抵押出库"
  | "移库出库"
  | "转让出库"
  | "质押加工出库"
  | "抵押加工出库"

export type OutboundStatusCode =
  | "PENDING_ASSIGNMENT"
  | "PENDING_PROCESS"
  | "PROCESSING"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN"

export type OutboundStatusName =
  | "待分配"
  | "待处理"
  | "处理中"
  | "已通过"
  | "未通过"
  | "已撤回"

export type OwnerType = "企业" | "个人"
export type PickupPersonType = "个人" | "企业"

/** 二级库存位置明细（普通出库选货与展开） */
export interface OutboundStockLocationItem {
  id: string
  warehouseName: string
  storeroomName: string
  partitionName: string
  locationPath: string // 例如：海霸王仓库-1号库房-A区
  specificLocation?: string // 例如：垛位-01
  inboundTime: string
  extraInfo?: string // 例如：无：--，或 保质期至 2027-05
  barcode: string // 存货条码，例如 SYZC-BC-20260510-001
  status: string // 例如：存货中
  availableAmount: number
  outboundAmount: number
  unit: string
}

/** 一级货品明细（列表与详情） */
export interface OutboundGoodsItem {
  id: string
  categoryName: string // 货品大类
  subCategoryName: string // 货物品类
  specName: string // 货物规格
  goodsName: string // 完整组合名称，例如 有色金属-电解铜-国标
  extraInfo?: string
  totalOutboundAmount: number
  unit: string
  price?: number // 单价值（元）
  selected?: boolean // 关联出库勾选状态
  availableAmount?: number // 关联出库来源可用量
  locationPath?: string // 关联出库位置
  warehouseName?: string
  storeroomName?: string
  partitionName?: string
  beforeAmount?: number // 出库前数量
  afterAmount?: number // 出库后数量
  barcode?: string
  locations?: OutboundStockLocationItem[] // 普通出库多位置展开
}

/** 提货信息 */
export interface OutboundPickupInfo {
  personType: PickupPersonType
  name: string
  idCardNo?: string // 脱敏身份证号
  phone?: string // 脱敏电话
  identity?: string // 统一社会信用代码
  unifiedSocialCreditCode?: string // 统一社会信用代码兼容别名
  operatorName?: string // 经办人姓名
  operatorIdCard?: string // 经办人身份证号
  operatorPhone?: string // 经办人联系电话
  plateNo?: string
  sitePhotos: string[] // 出库现场照片
  deviceSnapshots: string[] // 设备抓拍图
}

/** 提货记录板块（提货完成后回写） */
export interface OutboundPickupRecord {
  operatorName: string
  pickupTime: string
  isSelfPickup: boolean // 是否本人提货
  notes?: string
  sitePhotos: string[]
  deviceSnapshots: string[]
}

/** 审核时间轴节点 */
export interface OutboundAuditRecordNode {
  id: string
  nodeName: string
  handlerName: string
  handlerOrg?: string
  action: "SUBMIT" | "APPROVE" | "REJECT" | "WITHDRAW"
  actionName: string
  actionTime: string
  comment?: string
}

export interface OutboundAuditRecord {
  flowName: string
  nodes: OutboundAuditRecordNode[]
}

/** 出库记录单据主表 */
export interface OutboundRecord {
  id: string // 19位单号
  orderNo: string // 单号别名
  ownerType: OwnerType
  ownerName: string
  ownerIdentifier: string // 脱敏统一社会信用代码或手机号
  ownerPhone?: string
  ownerIdCard?: string
  type: OutboundTypeName
  typeCode: OutboundTypeCode
  outboundTime: string
  warehouseName: string
  relatedNo?: string // 关联单号（仓单号、质押单号、抵押单号、移库单号、转让单号，普通出库为 "—"）
  notes?: string
  status: OutboundStatusName
  statusCode: OutboundStatusCode
  goodsSummary: string
  goodsList: OutboundGoodsItem[]
  totalAmount: number
  amountUnit: string
  categoryCount: number
  totalValueWan?: number // 关联出库预估货物价值（万元）
  createdByName: string
  createdByOrg: string
  createTime: string
  pickupInfo?: OutboundPickupInfo
  pickCompleted: boolean // 是否已完成提货
  pickupRecord?: OutboundPickupRecord
  auditRecord?: OutboundAuditRecord
}

/** 列表筛选条件 */
export interface OutboundRecordFilters {
  orderNo: string
  outboundStartDate: string
  outboundEndDate: string
  ownerKeyword: string // 货主名称/标识
  type: string // "全部" 或 OutboundTypeName
  warehouseName: string // 全部 或 具体仓库
  goodsName: string
  createdBy: string
  createStartDate: string
  createEndDate: string
}

export type OutboundRecordRowAction = "view" | "downloadExcel" | "downloadPdf" | "manageDocs"
