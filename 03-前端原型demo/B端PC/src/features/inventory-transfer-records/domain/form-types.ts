import type { OwnerType } from "./types"

/** 选货弹窗中的可选库存候选记录 */
export interface TransferStockCandidate {
  id: string
  warehouseId: string
  warehouseName: string
  roomZone: string // 格式：仓库-库房-分区
  specificLocation: string // 具体货位/垛位编号，无值展示“——”
  goodsName: string // 大类-品类-规格
  cateName: string
  typeName: string
  specName: string
  inboundTime: string
  productionDate?: string
  otherInfo?: string // 扩展属性（如“保质期: 8个月”）
  barcode: string
  qrCodeUrl?: string
  status: string // 存货中
  availableAmount: number // 可用数量
  unit: string
}

/** 新增表单中的二级储位明细行 */
export interface TransferFormGoodsItem {
  id: string
  candidateId: string
  warehouseId: string
  warehouseName: string
  roomZone: string
  specificLocation: string
  inboundTime: string
  otherInfo?: string
  barcode: string
  qrCodeUrl?: string
  availableAmount: number
  transferAmount: number // 本次转让数量
  unit: string
}

/** 新增表单中的一级货品分组 */
export interface TransferFormGoodsGroup {
  id: string
  goodsName: string // 大类-品类-规格
  warehouseId: string
  warehouseName: string
  unit: string
  expanded: boolean
  details: TransferFormGoodsItem[]
}

/** 接收方主体信息（受让新货主） */
export interface TargetOwnerFormState {
  ownerType: OwnerType // 接收方类型：企业 / 个人
  ownerName: string // 接收方姓名 / 企业全称
  ownerIdentity: string // 统一社会信用代码 / 手机号
  idCardNo?: string // 接收方身份证号（个人时可编辑）
  isNewOwner?: boolean // 是否为未建档新客户（触发二元核验 R03）
}

/** 新增转让表单完整状态 */
export interface TransferFormState {
  assignTime: string // 转让日期 YYYY-MM-DD HH:mm:ss
  // 转让方（原货主）
  sourceOwnerType: OwnerType
  sourceOwnerName: string
  sourceOwnerId: string
  sourceOwnerIdentity: string
  sourceIdCardNo: string
  // 500 字必填转让原因说明（R04）
  assignReason: string
  // 货品明细树形
  goodsGroups: TransferFormGoodsGroup[]
  // 接收方（受让方）
  targetOwner: TargetOwnerFormState
}
