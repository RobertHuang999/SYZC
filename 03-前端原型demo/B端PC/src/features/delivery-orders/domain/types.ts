import type { OutboundTypeName } from "@/features/outbound-records/domain/types"

/** 提货状态：未提货 / 已提货 / 已取消 */
export type DeliveryOrderStatus = "未提货" | "已提货" | "已取消"
export type DeliveryOrderStatusCode = "PENDING" | "COMPLETED" | "CANCELLED"

/** 提货核销通道类型 */
export type DeliveryVerifyChannel = "DYNAMIC_CODE" | "DIRECT_CONFIRM"

/** 货物明细项（含储位分布） */
export interface DeliveryOrderGoodsItem {
  id?: string
  categoryName: string
  subCategoryName: string
  specName: string
  amount: number
  unit: string
  extraInfo?: string
  warehouseName?: string
  roomName?: string
  areaName?: string
  locationName?: string
  barcode?: string
}

/** 操作记录项 */
export interface DeliveryOrderLogItem {
  id: string
  action: string
  operatorName: string
  time: string
  detail: string
  notes?: string
}

/** 提货单实体 */
export interface DeliveryOrderItem {
  id: string
  orderNo: string // 提货单号
  outboundOrderNo: string // 19 位关联出库单号
  ownerName: string
  ownerIdentity: string // 企业信用代码 或 个人脱敏手机号
  ownerType: "企业" | "个人"
  goodsSummaryList: DeliveryOrderGoodsItem[]
  
  // 提货人信息
  pickupPersonType: "个人" | "企业"
  pickupName: string // 个人姓名 或 企业主体全称
  pickupPhone: string // 脱敏手机号 (如 187****3888)
  pickupIdentity?: string // 统一社会信用代码
  pickupOperator?: string // 经办人真实姓名
  pickupIdCard?: string // 身份证号（脱敏）
  pickupPlate?: string // 提货车牌号

  // 出库业务类型
  outboundType: OutboundTypeName
  status: DeliveryOrderStatus
  statusCode: DeliveryOrderStatusCode

  // 出库制单人与时间固化 (R02)
  operatorName: string // 出库申请发起人（制单人），始终固定
  operatorOrg: string // 制单人所属机构全称
  createTime: string // 提货单系统自动生成落库时间 (YYYY-MM-DD HH:mm:ss)

  // 履约凭据（动态核销 / 免码确认）
  pickCodeStatus?: "未获取" | "已获取" | "已过期"
  pickCode?: string // 4位动态核销验证码
  codeValidUntil?: string // 7天有效截止时间
  verifyChannel?: DeliveryVerifyChannel
  isSelfPickup?: boolean // 是否本人提货
  pickupTime?: string // 实际核销提货完成时间
  pickupPhotos?: string[] // 现场提货交接照片
  outboundPhotos?: string[] // 原出库照片 (用于现场比对防调包)
  iotCapturePhotos?: string[] // 物联网摄像头抓拍图
  notes?: string // 现场交接补充说明 (0/50字)
  cancelReason?: string // 取消提货说明 (0/50字)

  // 操作记录时间轴（倒序）
  logs: DeliveryOrderLogItem[]
}

/** 筛选条件 */
export interface DeliveryOrderFilters {
  nameOrIdentity: string
  pickNameOrMobile: string
  status: string
}
