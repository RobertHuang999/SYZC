import type {
  OwnerType,
  ProcessingType,
  InputGoodsGroup,
  OutputGoodsItem,
} from "./types"

/** 新增加工申请表单模型 */
export interface ProcessingFormState {
  processingTime: string // 加工日期（默认当前，精确到秒）
  ownerType: OwnerType // 货主类型
  ownerId: string // 货主ID
  ownerName: string // 货主名称
  ownerIdentity: string // 信用代码或手机号
  ownerIdCard?: string // 身份证号（个人）
  processingType: ProcessingType // 加工类型
  associatedOrderId?: string // 关联在押单号
  remark?: string // 备注（0/140字）
  inputGoodsGroups: InputGoodsGroup[] // 投入货物树形明细
  outputGoodsItems: OutputGoodsItem[] // 预计产出明细
}

/** 完成加工表单中各投入货位的实际消耗 */
export interface CompleteInputItemState {
  detailId: string
  groupId: string
  goodsName: string
  barcode: string
  lockedAmount: number
  actualAmount: number | string
  unit: string
}

/** 完成加工表单中各产出货物的实际入库 */
export interface CompleteOutputItemState {
  itemId: string
  goodsName: string
  specModel: string
  unit: string
  expectedQty: number
  actualQty: number | string
  warehouseLocation: string // 仓库-库房-分区
  specificLocation: string // 具体位置（必填）
  price?: number | null
  otherInfo?: string
  collectAttrs: Array<{
    key: string
    label: string
    type: "text" | "number" | "select" | "date"
    required?: boolean
    options?: string[]
    unit?: string
    value: string
  }>
}

/** 完成加工弹窗表单总状态 */
export interface CompleteProcessingFormState {
  recordId: string
  associatedOrderId?: string
  inputs: CompleteInputItemState[]
  outputs: CompleteOutputItemState[]
  lossRatio: number | string // 损耗比例（%）
  lossReason: string // 损耗说明（0/500字）
}

/** 作废确认表单状态 */
export interface NullifyFormState {
  recordId: string
  voidReason: string // 作废原因（0/500字）
}

