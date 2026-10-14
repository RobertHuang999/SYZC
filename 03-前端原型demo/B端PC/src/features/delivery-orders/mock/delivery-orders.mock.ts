import type { DeliveryOrderItem } from "../domain/types"
import { outboundRecordsMock } from "@/features/outbound-records/mock/outbound-records.mock"
import type { OutboundRecord } from "@/features/outbound-records/domain/types"

export const deliveryOrdersMock: DeliveryOrderItem[] = [
  {
    id: "DO-001",
    orderNo: "DO20260603001",
    outboundOrderNo: "206126414642828001",
    ownerName: "四川建龙物资有限公司",
    ownerIdentity: "91510100MA6XXXXXXX",
    ownerType: "企业",
    goodsSummaryList: [
      {
        categoryName: "有色金属",
        subCategoryName: "电解铜",
        specName: "国标 Cu-CATH-1",
        amount: 50.0,
        unit: "吨",
      },
    ],
    pickupPersonType: "个人",
    pickupName: "司观着",
    pickupPhone: "187****3888",
    pickupIdCard: "510104198809123888",
    pickupPlate: "川A99881",
    outboundType: "普通出库",
    status: "未提货",
    statusCode: "PENDING",
    operatorName: "李晓雅",
    operatorOrg: "四川享宇科技有限公司",
    createTime: "2026-06-03 10:15:00",
    pickCodeStatus: "已获取",
    pickCode: "8866",
    isSelfPickup: true,
    outboundPhotos: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
    ],
    logs: [
      {
        id: "L1",
        action: "提货单生成",
        operatorName: "自动审批引擎",
        time: "2026-06-03 10:15:00",
        detail: "出库审批通过，系统原子扣减库存并生成提货单，初始状态为【未提货】",
      },
      {
        id: "L2",
        action: "获取提货码",
        operatorName: "短信网关服务",
        time: "2026-06-03 10:15:05",
        detail: "已向提货人手机号 187****3888 发送4位提货核销码短信，7天内有效",
      },
    ],
  },
  {
    id: "DO-002",
    orderNo: "DO20260602002",
    outboundOrderNo: "206126414642828002",
    ownerName: "四川华西大宗商品供应链管理有限公司",
    ownerIdentity: "91510100MA6289B51X",
    ownerType: "企业",
    goodsSummaryList: [
      {
        categoryName: "有色金属",
        subCategoryName: "铝锭",
        specName: "A00",
        amount: 100.0,
        unit: "吨",
      },
    ],
    pickupPersonType: "企业",
    pickupName: "四川顺丰速运物流有限公司",
    pickupIdentity: "91510100779865432Y",
    pickupOperator: "赵建华",
    pickupPhone: "138****8999",
    pickupPlate: "川A88888",
    outboundType: "普通出库",
    status: "未提货",
    statusCode: "PENDING",
    operatorName: "李晓雅",
    operatorOrg: "四川享宇科技有限公司",
    createTime: "2026-06-02 16:30:22",
    pickCodeStatus: "未获取",
    pickCode: "6688",
    isSelfPickup: true,
    outboundPhotos: [
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=60",
    ],
    logs: [
      {
        id: "L1",
        action: "提货单生成",
        operatorName: "自动审批引擎",
        time: "2026-06-02 16:30:22",
        detail: "出库审批通过，系统自动生成提货单",
      },
    ],
  },
  {
    id: "DO-003",
    orderNo: "DO20260601003",
    outboundOrderNo: "206126414642828003",
    ownerName: "阜阳大象粮油有限公司",
    ownerIdentity: "91341202MA2U0JHJ3F",
    ownerType: "企业",
    goodsSummaryList: [
      {
        categoryName: "黑色金属",
        subCategoryName: "热轧卷板",
        specName: "Q235B",
        amount: 80.0,
        unit: "吨",
      },
    ],
    pickupPersonType: "个人",
    pickupName: "王铁柱",
    pickupPhone: "139****1234",
    pickupPlate: "皖K77889",
    outboundType: "仓单出库",
    status: "已提货",
    statusCode: "COMPLETED",
    operatorName: "李晓雅",
    operatorOrg: "四川享宇科技有限公司",
    createTime: "2026-06-01 11:20:00",
    pickCodeStatus: "已获取",
    isSelfPickup: true,
    pickupTime: "2026-06-01 15:40:12",
    pickupPhotos: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
    ],
    logs: [
      {
        id: "L1",
        action: "提货单生成",
        operatorName: "仓单解质中心",
        time: "2026-06-01 11:20:00",
        detail: "仓单出库核销，生成提货单",
      },
      {
        id: "L2",
        action: "核销提货码",
        operatorName: "张监管",
        time: "2026-06-01 15:40:12",
        detail: "现场比对照片与提货人一致，核销码验证成功，提货完成出库",
      },
    ],
  },
  {
    id: "DO-004",
    orderNo: "DO20260531004",
    outboundOrderNo: "206126414642828004",
    ownerName: "成都川工重型机械制造有限公司",
    ownerIdentity: "91510100MA6399C88Y",
    ownerType: "企业",
    goodsSummaryList: [
      {
        categoryName: "黑色金属",
        subCategoryName: "螺纹钢",
        specName: "HRB400E",
        amount: 150.0,
        unit: "吨",
      },
    ],
    pickupPersonType: "个人",
    pickupName: "李大力",
    pickupPhone: "136****5566",
    outboundType: "质押出库",
    status: "已取消",
    statusCode: "CANCELLED",
    operatorName: "张明远",
    operatorOrg: "四川建龙物资管理部",
    createTime: "2026-05-31 14:00:10",
    cancelReason: "提货司机车辆严重超载且未通过路政治超审核，货主现场申请取消提货并退货入库",
    logs: [
      {
        id: "L1",
        action: "提货单生成",
        operatorName: "系统自动",
        time: "2026-05-31 14:00:10",
        detail: "质押出库审批通过，生成提货单",
      },
      {
        id: "L2",
        action: "取消提货",
        operatorName: "张监管",
        time: "2026-05-31 16:20:00",
        detail: "提货司机车辆严重超载，货主现场申请取消提货，已联动跳转退货入库流程恢复库存",
      },
    ],
  },
]

/** 从新建出库单中联动自动生成提货单 */
export function addDeliveryOrderFromOutbound(record: OutboundRecord): DeliveryOrderItem {
  const pInfo = record.pickupInfo || {
    personType: "企业" as const,
    name: "提货经办人",
    phone: "13800000000",
    identity: "",
    operatorName: "",
    idCardNo: "",
    plateNo: "",
    sitePhotos: [],
    deviceSnapshots: [],
  }

  const newDeliveryOrder: DeliveryOrderItem = {
    id: `DO-${Date.now()}`,
    orderNo: `DO${Date.now().toString().slice(-11)}`,
    outboundOrderNo: record.orderNo,
    ownerName: record.ownerName,
    ownerIdentity: record.ownerIdentifier,
    ownerType: record.ownerType,
    goodsSummaryList: record.goodsList.map((g) => ({
      categoryName: g.categoryName,
      subCategoryName: g.subCategoryName,
      specName: g.specName,
      amount: g.totalOutboundAmount,
      unit: g.unit,
      extraInfo: g.extraInfo,
    })),
    pickupPersonType: pInfo.personType,
    pickupName: pInfo.name,
    pickupPhone: pInfo.phone || "13800000000",
    pickupIdentity: pInfo.identity,
    pickupOperator: pInfo.operatorName,
    pickupIdCard: pInfo.idCardNo,
    pickupPlate: pInfo.plateNo,
    outboundType: record.type,
    status: "未提货",
    statusCode: "PENDING",
    operatorName: record.createdByName,
    operatorOrg: record.createdByOrg,
    createTime: record.createTime,
    pickCodeStatus: "已获取",
    pickCode: "8866",
    isSelfPickup: true,
    outboundPhotos: pInfo.sitePhotos || [],
    logs: [
      {
        id: `L-${Date.now()}-1`,
        action: "提货单生成",
        operatorName: "自动审批引擎",
        time: record.createTime,
        detail: `出库单【${record.orderNo}】终审通过，系统在同一事务中原子生成提货单，状态为【未提货】`,
      },
      {
        id: `L-${Date.now()}-2`,
        action: "获取提货码",
        operatorName: "短信网关服务",
        time: record.createTime,
        detail: `已向预留手机号 ${pInfo.phone || "13800000000"} 下发动态提货核销码（7日内有效）`,
      },
    ],
  }

  deliveryOrdersMock.unshift(newDeliveryOrder)
  return newDeliveryOrder
}

/** 提货核销（双通道统一闭环）：更新提货单并回写出库单详情 */
export function completeDeliveryOrder(
  deliveryOrderId: string,
  data: {
    isSelfPickup: boolean
    pickupPlate?: string
    notes?: string
    photos: string[]
    actionName: "核销提货码" | "免码确认提货"
  }
): boolean {
  const item = deliveryOrdersMock.find((d) => d.id === deliveryOrderId || d.orderNo === deliveryOrderId || d.outboundOrderNo === deliveryOrderId)
  const now = new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-")

  if (item) {
    item.status = "已提货"
    item.statusCode = "COMPLETED"
    item.isSelfPickup = data.isSelfPickup
    item.pickupTime = now
    if (data.pickupPlate) item.pickupPlate = data.pickupPlate
    item.pickupPhotos = data.photos
    item.notes = data.notes

    item.logs.unshift({
      id: `L-${Date.now()}`,
      action: data.actionName,
      operatorName: "现场监管员",
      time: now,
      detail: `${data.actionName}成功：提货人核验为【${data.isSelfPickup ? "本人提货" : "非本人代领"}】，上传提货凭证照片 ${data.photos.length} 张，单据变迁为【已提货】终态`,
    })
  }

  // 同步回写出库单详情
  const outboundNo = item ? item.outboundOrderNo : deliveryOrderId
  const record = outboundRecordsMock.find((r) => r.orderNo === outboundNo || r.id === outboundNo)
  if (record) {
    record.pickCompleted = true
    if (data.pickupPlate && record.pickupInfo) {
      record.pickupInfo.plateNo = data.pickupPlate
    }
    record.pickupRecord = {
      operatorName: "现场监管员（张明远）",
      pickupTime: now,
      isSelfPickup: data.isSelfPickup,
      notes: data.notes || "现场核验提货人及装车资质无误，实物已安全出库",
      sitePhotos:
        data.photos && data.photos.length > 0
          ? data.photos
          : [
              "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
            ],
      deviceSnapshots: [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
      ],
    }
  }

  return true
}

/** 取消提货 */
export function cancelDeliveryOrder(
  deliveryOrderId: string,
  reason: string
): boolean {
  const item = deliveryOrdersMock.find((d) => d.id === deliveryOrderId || d.orderNo === deliveryOrderId)
  if (!item) return false

  const now = new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-")
  item.status = "已取消"
  item.statusCode = "CANCELLED"
  item.cancelReason = reason

  item.logs.unshift({
    id: `L-${Date.now()}`,
    action: "取消提货",
    operatorName: "现场监管员",
    time: now,
    detail: `取消提货原因：${reason}。单据终态作废，已联动触发退货入库流程`,
  })

  return true
}
