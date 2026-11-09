export type OwnerType = "ENTERPRISE" | "PERSONAL"

/* ------------------------------------------------------------------ *
 * 移库记录（来源：PC 11-移库管理-移库记录 三件套）
 * ------------------------------------------------------------------ */

export type MovingFlowTypeValue = "NORMAL" | "PLEDGE" | "MORTGAGE" | "CD"

/** 移库货物明细行（按货品汇总，一处原货位 ➔ 一处目标货位） */
export interface MovingGoodsDetailVo {
  id: string
  goodsId?: string
  goodsName: string
  cateName: string
  typeName: string
  specification: string
  concatAttrValue: string
  batchNo?: string
  amount: number
  unit: string
  weight?: number
  weightUnit?: string
  sourceRepoId?: string
  sourceRepoName: string
  sourceHouseName: string
  sourceZoneName: string
  targetRepoId?: string
  targetRepoName: string
  targetHouseName: string
  targetZoneName: string
  pledgeStatus?: string
}

/** 设备抓拍图 */
export interface MovingCaptureImage {
  time: string
  cameraName: string
  deviceCode: string
  url: string
}

/** 移库台账记录（列表卡片与详情页共用） */
export interface MovingRecordItem {
  id: string
  /** 1=在押货（质押/抵押/仓单）移库；2=普通存货移库 */
  refType: 1 | 2
  /** 在押货细分：1=质押移库，2=仓单移库 */
  pledgeType?: 1 | 2
  /** 在押货细分：1=抵押移库，2=质押移库 */
  applyType?: 1 | 2
  flowType: MovingFlowTypeValue
  ownerId: string
  ownerName: string
  /** 1=个人，2=企业 */
  ownerType: 1 | 2
  ownerIdentity: string
  goodsInfo: string
  amount: number
  unit: string
  totalWeight: number
  weightUnit: string
  repoNames: string
  createByName: string
  createOrgName: string
  createTime: string
  transferTime?: string
  /** 1=审核中，2=已通过，3=已驳回，4=已撤销 */
  checkStatus?: 1 | 2 | 3 | 4
  applyFlowId?: string
  remark?: string
  pictureScene?: string[]
  pictureCapture?: MovingCaptureImage[]
  respOutStockInfoVoList: MovingGoodsDetailVo[]
}

/** 单据修改记录 */
export interface MovingModifyLog {
  fieldLabel: string
  beforeValue: string
  afterValue: string
  operator: string
  operatedAt: string
}

export interface MobileOwnerEntity {
  ownerName: string
  ownerType: OwnerType
  ownerIdentity: string // 企业统一社会信用代码或个人手机号（脱敏）
  idCardNo?: string
}

export interface MobileTransferLocationDetail {
  id: string
  locationName: string // 仓库-库房-分区
  specificLocation: string // 具体位置/垛位
  inboundTime: string
  barcode: string
  status: string
  amount: number
  unit: string
  otherInfo?: string
}

export interface MobileTransferGoodsItem {
  id: string
  goodsName: string
  cateName: string
  typeName: string
  specName: string
  amount: number
  unit: string
  locations: MobileTransferLocationDetail[]
}

export interface MobileTransferTimelineItem {
  id: string
  nodeName: string
  operator: string
  operatorOrg: string
  action: string
  time: string
  comment?: string
}

export interface MobileTransferRecord {
  id: string // 19位转让单号
  sourceOwner: MobileOwnerEntity
  targetOwner: MobileOwnerEntity
  transferTime: string
  warehouseName: string
  warehouseId: string
  totalAmount: number
  unit: string
  assignReason: string
  createBy: string
  createByName: string
  createOrgName: string
  createTime: string
  status: "APPROVED"
  goodsList: MobileTransferGoodsItem[]
  timeline: MobileTransferTimelineItem[]
}
