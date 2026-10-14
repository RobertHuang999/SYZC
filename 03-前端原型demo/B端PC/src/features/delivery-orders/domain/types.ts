import type { OutboundTypeName } from "@/features/outbound-records/domain/types"

/** 提货状态：未提货 (1) / 已提货 (2) / 已取消 (3) */
export type DeliveryOrderStatus = "未提货" | "已提货" | "已取消"
export type DeliveryOrderStatusCode = "PENDING" | "COMPLETED" | "CANCELLED"

/** 提货单条目 */
export interface DeliveryOrderItem {
  id: string
  orderNo: string // 提货单号或出库单号
  outboundOrderNo: string // 关联出库单号
  ownerName: string
  ownerIdentity: string // 企业信用代码 或 个人脱敏手机号
  ownerType: "企业" | "个人"
  goodsSummaryList: {
    categoryName: string
    subCategoryName: string
    specName: string
    amount: number
    unit: string
    extraInfo?: string
  }[]
  pickupPersonType: "个人" | "企业"
  pickupName: string // 个人姓名 或 企业经办人
  pickupPhone: string
  pickupIdentity?: string // 企业信用代码
  pickupOperator?: string // 企业经办人
  pickupIdCard?: string // 身份证号
  pickupPlate?: string // 车牌号
  outboundType: OutboundTypeName
  status: DeliveryOrderStatus
  statusCode: DeliveryOrderStatusCode
  operatorName: string // 出库制单人
  operatorOrg: string
  createTime: string // 生成时间 (YYYY-MM-DD HH:mm:ss)
  
  // 履约凭据
  pickCodeStatus?: "未获取" | "已获取" | "已过期"
  pickCode?: string // 4位验证码，默认例如 "8866"
  isSelfPickup?: boolean // 是否本人提货
  pickupTime?: string // 实际核销提货时间
  pickupPhotos?: string[] // 现场提货照片
  outboundPhotos?: string[] // 原出库照片 (用于比对)
  notes?: string // 说明
  cancelReason?: string // 取消提货说明

  // 操作记录时间轴
  logs: {
    id: string
    action: string
    operatorName: string
    time: string
    detail: string
  }[]
}

export interface DeliveryOrderFilters {
  nameOrIdentity: string
  pickNameOrMobile: string
  status: string
}
