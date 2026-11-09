/**
 * 货物异动申请表单与存货选择数据结构
 * 依据 P-CKG-013-SELECT 与 P-CKG-013-APPLY 规范
 */
import type { AbnormalTypeLabel } from "./types"

/** 可选存货明细（用于 P-CKG-013-SELECT 弹窗） */
export interface InStockItem {
  stockId: string
  ownerName: string
  ownerIdentity: string
  goodsTitle: string // 如 "水果-荔枝-妃子笑 — 10公斤"
  goodsName: string
  goodsCate: string
  goodsSpec: string
  unit: string
  inboundDate: string // 入库日期 "2026-11-04"
  inboundTime: string // 入库时间 "2026-11-04 11:33:22"
  inboundOrderId: string // 入库单号 "2117622651099742210"
  inboundType: "普通入库"
  creatorName: string // 制单人 "lxy (四川享宇科技有限公司)"
  creatorTime: string // 制单时间 "2026-11-04 11:34:02"
  warehouseName: string // "生鲜仓库"
  storeroomName: string // "水果库房2"
  partitionName: string // "常见水果分区"
  specificLocation: string // "--" 或 "货架A-01"
  otherInfo: string // "送出日期: --; 包装方式: --"
  remark: string // "备注信息"
  initialQty: number // 期初堆放数量 3
  availableQty: number // 当前可用数量 2.99
  frozenQty: number // 冻结数量 0
  barcode: string // 存货条码 "TM202611040001"
  status: "存货中"
  livePhotos: string[] // 原入库现场照片
  supplements?: string[] // 补充资料
  snapshots?: string[] // 设备抓拍图
}

/** 异动申请表单录入状态 */
export interface AbnormalFormState {
  stockId: string
  // 选中的存货基础信息只读快照
  selectedStock: InStockItem | null
  // 异动申请录入表单
  afterQty: string // 异动后可用数量字符串输入
  abnormalType: AbnormalTypeLabel | "" // 异动类型
  reason: string // 异动原因（最多500字）
  photos: string[] // 现场照片附件（最多3张）
}

