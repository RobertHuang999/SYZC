import type { DeliveryOrderItem } from "../domain/types"
import type { OutboundRecord } from "@/features/outbound-records/domain/types"

export const deliveryOrdersMock: DeliveryOrderItem[] = [
  {
    id: "DO-001",
    orderNo: "TH202607290001",
    outboundOrderNo: "206126414642828001",
    ownerName: "张一",
    ownerIdentity: "133****0001",
    ownerType: "个人",
    goodsSummaryList: [
      {
        id: "G-1",
        categoryName: "冻货",
        subCategoryName: "鸡翅",
        specName: "四川-特级-2025",
        amount: 1,
        unit: "斤",
        warehouseName: "成都市高新智慧冷链一号仓",
        roomName: "冷冻库A-01",
        areaName: "极低温存储区",
        locationName: "A-01-03",
        barcode: "BAR-CD-CW-001",
      },
      {
        id: "G-2",
        categoryName: "冻货",
        subCategoryName: "牛肉",
        specName: "36个月",
        amount: 0.05,
        unit: "公斤",
        warehouseName: "成都市高新智慧冷链一号仓",
        roomName: "冷冻库A-02",
        areaName: "进口精细温控区",
        locationName: "A-02-11",
        barcode: "BAR-CD-BF-002",
      },
    ],
    pickupPersonType: "个人",
    pickupName: "司观着",
    pickupPhone: "187****3888",
    pickupIdCard: "510104198809123888",
    pickupPlate: "川A99881",
    outboundType: "质押出库",
    status: "未提货",
    statusCode: "PENDING",
    operatorName: "lxy",
    operatorOrg: "四川享宇科技有限公司",
    createTime: "2026-07-29 11:44:28",
    pickCodeStatus: "已获取",
    pickCode: "8866",
    codeValidUntil: "2026-08-05 11:44:28",
    isSelfPickup: true,
    outboundPhotos: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
    ],
    logs: [
      {
        id: "L1",
        action: "提货单生成",
        operatorName: "系统底层原子事务",
        time: "2026-07-29 11:44:28",
        detail: "质押出库审批终审通过，系统在同一本地事务中扣减库存并生成提货单，初始为【未提货】",
      },
      {
        id: "L2",
        action: "获取提货码",
        operatorName: "lxy(四川享宇科技有限公司)",
        time: "2026-07-29 11:45:10",
        detail: "监管员首次点击核销提货码，系统通过短信网关向提货人手机号 187****3888 下发 4 位动态码，时效 7 天",
      },
    ],
  },
  {
    id: "DO-002",
    orderNo: "TH202607280002",
    outboundOrderNo: "206126414642828002",
    ownerName: "有钱得不得了公司",
    ownerIdentity: "91110107089649833A",
    ownerType: "企业",
    goodsSummaryList: [
      {
        id: "G-3",
        categoryName: "水果",
        subCategoryName: "西瓜",
        specName: "二级-云南",
        amount: 15,
        unit: "kg",
        warehouseName: "云南玉溪常温生鲜周转库",
        roomName: "果品通风仓B-02",
        areaName: "出库暂存区",
        locationName: "B-02-05",
        barcode: "BAR-YX-SG-003",
      },
      {
        id: "G-4",
        categoryName: "水果",
        subCategoryName: "西瓜",
        specName: "二级-云南",
        amount: 1,
        unit: "kg",
        warehouseName: "云南玉溪常温生鲜周转库",
        roomName: "果品通风仓B-02",
        areaName: "出库暂存区",
        locationName: "B-02-06",
        barcode: "BAR-YX-SG-004",
      },
    ],
    pickupPersonType: "个人",
    pickupName: "分给",
    pickupPhone: "198****3333",
    pickupIdCard: "530402199203114421",
    pickupPlate: "云F88219",
    outboundType: "抵押出库",
    status: "未提货",
    statusCode: "PENDING",
    operatorName: "卡皮巴拉",
    operatorOrg: "四川享宇科技有限公司",
    createTime: "2026-07-28 17:14:59",
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
        operatorName: "系统底层原子事务",
        time: "2026-07-28 17:14:59",
        detail: "抵押出库审批终审通过，自动生成提货单，核销码初始为【未获取】",
      },
    ],
  },
  {
    id: "DO-003",
    orderNo: "TH202607280003",
    outboundOrderNo: "206126414642828003",
    ownerName: "阜阳市大数据资产运营有限责任公司",
    ownerIdentity: "91341202MA2U0JHJ3F",
    ownerType: "企业",
    goodsSummaryList: [
      {
        id: "G-5",
        categoryName: "冻货",
        subCategoryName: "鸡翅",
        specName: "四川-特级-2025",
        amount: 1.9,
        unit: "斤",
        warehouseName: "阜阳经开区数字仓储示范园",
        roomName: "恒温冷藏库C-01",
        areaName: "托盘暂存货位",
        locationName: "C-01-08",
        barcode: "BAR-FY-JC-005",
      },
      {
        id: "G-6",
        categoryName: "冻货",
        subCategoryName: "鸡翅",
        specName: "四川-特级-2025",
        amount: 0.18,
        unit: "斤",
        warehouseName: "阜阳经开区数字仓储示范园",
        roomName: "恒温冷藏库C-01",
        areaName: "托盘暂存货位",
        locationName: "C-01-09",
        barcode: "BAR-FY-JC-006",
      },
    ],
    pickupPersonType: "企业",
    pickupName: "放多个",
    pickupIdentity: "00898199NDJUT2CXJU",
    pickupOperator: "客户纠纷",
    pickupPhone: "199****2233",
    pickupPlate: "皖K55667",
    outboundType: "质押出库",
    status: "未提货",
    statusCode: "PENDING",
    operatorName: "lxy",
    operatorOrg: "四川享宇科技有限公司",
    createTime: "2026-07-28 15:14:15",
    pickCodeStatus: "已获取",
    pickCode: "9911",
    codeValidUntil: "2026-08-04 15:14:15",
    isSelfPickup: true,
    outboundPhotos: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
    ],
    logs: [
      {
        id: "L1",
        action: "提货单生成",
        operatorName: "系统底层原子事务",
        time: "2026-07-28 15:14:15",
        detail: "质押出库审核通过，生成企业提货单，经办人绑定为客户纠纷",
      },
      {
        id: "L2",
        action: "获取提货码",
        operatorName: "lxy(四川享宇科技有限公司)",
        time: "2026-07-28 15:16:00",
        detail: "短信发送 4 位核销码至提货经办人手机 199****2233",
      },
    ],
  },
  {
    id: "DO-004",
    orderNo: "TH202608200004",
    outboundOrderNo: "206126414642828004",
    ownerName: "梨花",
    ownerIdentity: "188****2345",
    ownerType: "个人",
    goodsSummaryList: [
      {
        id: "G-7",
        categoryName: "水果",
        subCategoryName: "香蕉",
        specName: "广西",
        amount: 2,
        unit: "公斤",
        warehouseName: "南宁五象冷链物流中心",
        roomName: "香蕉催熟保鲜库E-03",
        areaName: "精品出货区",
        locationName: "E-03-12",
        barcode: "BAR-NN-XJ-007",
      },
    ],
    pickupPersonType: "个人",
    pickupName: "的观点",
    pickupPhone: "133****6677",
    pickupIdCard: "450103198906241198",
    pickupPlate: "桂A66778",
    outboundType: "抵押出库",
    status: "已提货",
    statusCode: "COMPLETED",
    operatorName: "lxy",
    operatorOrg: "四川享宇科技有限公司",
    createTime: "2026-08-20 18:56:20",
    verifyChannel: "DYNAMIC_CODE",
    pickCodeStatus: "已获取",
    isSelfPickup: true,
    pickupTime: "2026-08-21 09:30:15",
    pickupPhotos: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
    ],
    outboundPhotos: [
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=60",
    ],
    iotCapturePhotos: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
    ],
    notes: "现场核验货物外观无损伤，本人携带身份证及行驶证签收放行。",
    logs: [
      {
        id: "L1",
        action: "提货单生成",
        operatorName: "系统底层原子事务",
        time: "2026-08-20 18:56:20",
        detail: "抵押出库审批终审通过，自动生成提货单",
      },
      {
        id: "L2",
        action: "获取提货码",
        operatorName: "lxy(四川享宇科技有限公司)",
        time: "2026-08-20 19:00:00",
        detail: "向提货人手机号 133****6677 下发 4 位提货核销码短信",
      },
      {
        id: "L3",
        action: "核销提货码",
        operatorName: "张监管(南宁仓储服务部)",
        time: "2026-08-21 09:30:15",
        detail: "现场核验 4 位 PIN 码正确，拍摄实物交接照片完成核销，状态变更为【已提货】并回写出库记录",
      },
    ],
  },
  {
    id: "DO-005",
    orderNo: "TH202601300005",
    outboundOrderNo: "206126414642828005",
    ownerName: "梨花",
    ownerIdentity: "188****2345",
    ownerType: "个人",
    goodsSummaryList: [
      {
        id: "G-8",
        categoryName: "水果",
        subCategoryName: "香蕉",
        specName: "广西",
        amount: 2,
        unit: "公斤",
        warehouseName: "南宁五象冷链物流中心",
        roomName: "香蕉催熟保鲜库E-03",
        areaName: "精品出货区",
        locationName: "E-03-15",
        barcode: "BAR-NN-XJ-008",
      },
    ],
    pickupPersonType: "个人",
    pickupName: "的观点",
    pickupPhone: "133****6677",
    pickupIdCard: "450103198906241198",
    outboundType: "抵押出库",
    status: "已取消",
    statusCode: "CANCELLED",
    operatorName: "超人",
    operatorOrg: "四川享宇科技有限公司",
    createTime: "2026-01-30 14:59:08",
    cancelReason: "提货司机现场验货发现外箱受压变形，客户现场拒提申请退回，已跨模块跳转退货入库流程。",
    outboundPhotos: [
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=60",
    ],
    logs: [
      {
        id: "L1",
        action: "提货单生成",
        operatorName: "系统底层原子事务",
        time: "2026-01-30 14:59:08",
        detail: "抵押出库终审通过生成提货单",
      },
      {
        id: "L2",
        action: "取消提货",
        operatorName: "超人(四川享宇科技有限公司)",
        time: "2026-01-30 16:20:00",
        detail: "说明：外箱受压变形，客户现场拒提申请退回。单据置为【已取消】并联动跳转退货入库",
      },
    ],
  },
  {
    id: "DO-006",
    orderNo: "TH202606030006",
    outboundOrderNo: "206126414642828006",
    ownerName: "四川建龙物资有限公司",
    ownerIdentity: "91510100MA6XXXXXXX",
    ownerType: "企业",
    goodsSummaryList: [
      {
        id: "G-9",
        categoryName: "有色金属",
        subCategoryName: "电解铜",
        specName: "国标 Cu-CATH-1",
        amount: 50.0,
        unit: "吨",
        warehouseName: "成都青白江国际铁路港监管仓",
        roomName: "重型金属库A-1",
        areaName: "电解铜专属堆场",
        locationName: "A1-01-01",
        barcode: "BAR-QBJ-CU-001",
      },
    ],
    pickupPersonType: "个人",
    pickupName: "司观着",
    pickupPhone: "187****3888",
    pickupIdCard: "510104198809123888",
    pickupPlate: "川A99881",
    outboundType: "普通出库",
    status: "已提货",
    statusCode: "COMPLETED",
    operatorName: "李晓雅",
    operatorOrg: "四川享宇科技有限公司",
    createTime: "2026-06-03 10:15:00",
    verifyChannel: "DIRECT_CONFIRM",
    isSelfPickup: true,
    pickupTime: "2026-06-03 14:22:10",
    pickupPhotos: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=60",
    ],
    outboundPhotos: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60",
    ],
    notes: "免码现场直接确认交接，司机出示提货证明原件，行车记录仪比对完成。",
    logs: [
      {
        id: "L1",
        action: "提货单生成",
        operatorName: "系统底层原子事务",
        time: "2026-06-03 10:15:00",
        detail: "普通出库审核通过，生成提货单",
      },
      {
        id: "L2",
        action: "确认提货",
        operatorName: "王监库(青白江监管部)",
        time: "2026-06-03 14:22:10",
        detail: "偏远库区弱网免码确认提货，实物照片核验一致，状态变迁为【已提货】",
      },
    ],
  },
]

/** 获取当前提货单有效数据副本 */
export function getDeliveryOrders(): DeliveryOrderItem[] {
  return [...deliveryOrdersMock]
}

/** 核销 / 免码提货完成 */
export function completeDeliveryOrder(
  id: string,
  data: {
    actionName: "核销提货码" | "免码确认提货"
    isSelfPickup: boolean
    pickupPlate?: string
    notes?: string
    photos: string[]
    operatorName?: string
  }
) {
  const target = deliveryOrdersMock.find((item) => item.id === id || item.orderNo === id)
  if (!target) return null

  const now = new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-")
  target.status = "已提货"
  target.statusCode = "COMPLETED"
  target.pickupTime = now
  target.isSelfPickup = data.isSelfPickup
  target.pickupPhotos = data.photos
  if (data.pickupPlate) target.pickupPlate = data.pickupPlate
  if (data.notes) target.notes = data.notes
  target.verifyChannel = data.actionName === "核销提货码" ? "DYNAMIC_CODE" : "DIRECT_CONFIRM"

  target.logs.unshift({
    id: `L-${Date.now()}`,
    action: data.actionName === "核销提货码" ? "核销提货码" : "确认提货",
    operatorName: data.operatorName || "当前登录监管员(四川享宇科技)",
    time: now,
    detail:
      data.actionName === "核销提货码"
        ? `现场核销 4 位动态验证码成功，上传现场交接照片 ${data.photos.length} 张，单据变更为【已提货】终态`
        : `免码通道现场直接核验出库外观并完成实物移交，上传照片 ${data.photos.length} 张，单据变更为【已提货】终态`,
    notes: data.notes,
  })

  return target
}

/** 取消提货 */
export function cancelDeliveryOrder(id: string, reason: string, operatorName?: string) {
  const target = deliveryOrdersMock.find((item) => item.id === id || item.orderNo === id)
  if (!target) return null

  const now = new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-")
  target.status = "已取消"
  target.statusCode = "CANCELLED"
  target.cancelReason = reason

  target.logs.unshift({
    id: `L-${Date.now()}`,
    action: "取消提货",
    operatorName: operatorName || "当前登录监管员(四川享宇科技)",
    time: now,
    detail: `说明：${reason}。单据置为【已取消】不可逆终态，并已页面直达跳转【退货入库】`,
    notes: reason,
  })

  return target
}

/** 首次发送提货核销码 */
export function fetchPickupCode(id: string, operatorName?: string) {
  const target = deliveryOrdersMock.find((item) => item.id === id || item.orderNo === id)
  if (!target) return null

  const now = new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-")
  target.pickCodeStatus = "已获取"
  target.pickCode = "8866"
  target.logs.unshift({
    id: `L-${Date.now()}`,
    action: "获取提货码",
    operatorName: operatorName || "当前登录监管员(四川享宇科技)",
    time: now,
    detail: `向提货人手机号【${target.pickupPhone}】发送 4 位提货核销码短信，有效时效 7 天`,
  })

  return target
}

/** 重置提货核销码 */
export function resetPickupCode(id: string, operatorName?: string) {
  const target = deliveryOrdersMock.find((item) => item.id === id || item.orderNo === id)
  if (!target) return null

  const now = new Date().toLocaleString("zh-CN", { hour12: false }).replace(/\//g, "-")
  target.pickCodeStatus = "已获取"
  const randomCode = Math.floor(1000 + Math.random() * 9000).toString()
  target.pickCode = randomCode

  target.logs.unshift({
    id: `L-${Date.now()}`,
    action: "重置提货码",
    operatorName: operatorName || "当前登录监管员(四川享宇科技)",
    time: now,
    detail: `重新生成 4 位有效动态码并发送短信至提货人【${target.pickupPhone}】，时效重新倒计时 7 天`,
  })

  return target
}

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
    orderNo: `TH${Date.now().toString().slice(-11)}`,
    outboundOrderNo: record.orderNo,
    ownerName: record.ownerName,
    ownerIdentity: record.ownerIdentifier,
    ownerType: record.ownerType,
    goodsSummaryList: record.goodsList.map((g, idx) => ({
      id: `G-${idx}`,
      categoryName: g.categoryName,
      subCategoryName: g.subCategoryName,
      specName: g.specName,
      amount: g.totalOutboundAmount,
      unit: g.unit,
      extraInfo: g.extraInfo,
      warehouseName: g.locations?.[0]?.warehouseName || "四川省现代智慧物流枢纽仓",
      roomName: g.locations?.[0]?.storeroomName || "1号大宗金属库",
      areaName: g.locations?.[0]?.partitionName || "标准货位A区",
      locationName: g.locations?.[0]?.specificLocation || "A-01-01",
      barcode: g.locations?.[0]?.barcode || `BAR-${idx + 1}`,
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
        operatorName: "系统底层原子事务",
        time: record.createTime,
        detail: `出库单【${record.orderNo}】终审通过，系统在同一事务中原子生成提货单，状态为【未提货】`,
      },
      {
        id: `L-${Date.now()}-2`,
        action: "获取提货码",
        operatorName: "系统短信网关",
        time: record.createTime,
        detail: `已向提货人手机号【${pInfo.phone || "13800000000"}】发送 4 位提货核销码`,
      },
    ],
  }

  deliveryOrdersMock.unshift(newDeliveryOrder)
  return newDeliveryOrder
}
