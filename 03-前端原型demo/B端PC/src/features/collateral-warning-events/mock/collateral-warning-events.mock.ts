import { getSeverityLevelByCode } from "@/shared/mock/severity-levels"
import type { CollateralWarningEvent } from "../domain/types"

const l2 = getSeverityLevelByCode("L2")!
const l3 = getSeverityLevelByCode("L3")!
const l4 = getSeverityLevelByCode("L4")!
const l5 = getSeverityLevelByCode("L5")!

// 严格对齐 PC 端 7 个预警大类、所有状态、所有来源渠道与抓拍场景
const seedEvents: Omit<CollateralWarningEvent, "eventId">[] = [
  // 1. 抵/质押率异常 (L4 · 订单配置触发 · 未公示 · 有抓拍图)
  {
    orderNo: "PO202608-01",
    warningType: "抵/质押率异常",
    severityLevelId: l4.severityLevelId,
    severityCode: l4.severityCode,
    severityName: l4.severityName,
    severityColor: l4.severityColor,
    warningSource: "订单配置触发",
    warningContent: "订单抵/质押率异常！本次触发平仓线，发生预警时订单抵/质押率为88.5%，贷款余额为4,314,375元，质物价值为4,875,000元（预警阈值85.0%）",
    snapshotImageStatus: "available",
    warningTime: "2026-08-20 09:15:00",
    processedTime: null,
    publicityStatus: "未公示",
    processedBy: null,
    warningStatus: "OPEN_VALID",
    deviceEventId: null,
  },
  // 2. 物联穿透告警 (L5 · 物联穿透 · 关联设备事件 · 有抓拍图)
  {
    orderNo: "PO202608-01",
    warningType: "物联穿透告警",
    severityLevelId: l5.severityLevelId,
    severityCode: l5.severityCode,
    severityName: l5.severityName,
    severityColor: l5.severityColor,
    warningSource: "物联穿透",
    warningContent: "位置：一号钢材仓+A库01分区；设备名称：智能挂锁-A01；触发预警：锁杆被剪。请及时现场核查！",
    snapshotImageStatus: "available",
    warningTime: "2026-08-20 14:20:00",
    processedTime: null,
    publicityStatus: "未公示",
    processedBy: null,
    warningStatus: "OPEN_VALID",
    deviceEventId: "evt-001",
  },
  // 3. 价格下跌 (L4 · 订单配置触发 · 已处理未公示 · 支持批量公示)
  {
    orderNo: "PO202607-12",
    warningType: "价格下跌",
    severityLevelId: l4.severityLevelId,
    severityCode: l4.severityCode,
    severityName: l4.severityName,
    severityColor: l4.severityColor,
    warningSource: "订单配置触发",
    warningContent: "抵/质押物价值下跌！当前订单货物价值已下跌超过12.8%（预警阈值 12.0%）",
    snapshotImageStatus: "available",
    warningTime: "2026-07-29 16:30:00",
    processedTime: "2026-07-30 09:15:00",
    publicityStatus: "未公示",
    processedBy: "王风控（森云科技）",
    warningStatus: "CLOSED_VALID",
    deviceEventId: null,
  },
  // 4. 价格下跌 (L3 · 订单配置触发 · 已公示)
  {
    orderNo: "PO202608-18",
    warningType: "价格下跌",
    severityLevelId: l3.severityLevelId,
    severityCode: l3.severityCode,
    severityName: l3.severityName,
    severityColor: l3.severityColor,
    warningSource: "订单配置触发",
    warningContent: "菜籽油现货价格下调超 6.5%，货值从 8,200,000 元跌至 7,667,000 元",
    snapshotImageStatus: "none",
    warningTime: "2026-08-16 11:20:00",
    processedTime: "2026-08-16 16:40:00",
    publicityStatus: "已公示",
    processedBy: "李风控（风控部）",
    warningStatus: "CLOSED_VALID",
    deviceEventId: null,
  },
  // 5. 巡检异常 (L3 · 订单配置触发 · 抓拍失败 · 未处理有效)
  {
    orderNo: "PO202608-88",
    warningType: "巡检异常",
    severityLevelId: l3.severityLevelId,
    severityCode: l3.severityCode,
    severityName: l3.severityName,
    severityColor: l3.severityColor,
    warningSource: "订单配置触发",
    warningContent: "巡检异常！巡检员刘强未按时巡检盘点，计划时间 08-19 08:00 已超时 24h，请及时核查处理！",
    snapshotImageStatus: "failed",
    warningTime: "2026-08-19 08:00:00",
    processedTime: null,
    publicityStatus: "未公示",
    processedBy: null,
    warningStatus: "OPEN_VALID",
    deviceEventId: null,
  },
  // 6. 盘点异常 (L2 · 订单配置触发 · 未处理无效 · 附带 invalidReason)
  {
    orderNo: "PO202606-99",
    warningType: "盘点异常",
    severityLevelId: l2.severityLevelId,
    severityCode: l2.severityCode,
    severityName: l2.severityName,
    severityColor: l2.severityColor,
    warningSource: "订单配置触发",
    warningContent: "盘点异常！经盘点发现货物差异 2.3%，系统判定关联规则已删除置为无效（已完成复盘）",
    snapshotImageStatus: "none",
    warningTime: "2026-06-28 10:00:00",
    processedTime: null,
    publicityStatus: "未公示",
    processedBy: null,
    warningStatus: "OPEN_INVALID",
    deviceEventId: null,
  },
  // 7. 贷中风控预警 (L4 · 订单配置触发 · 大数据模型)
  {
    orderNo: "PO202608-33",
    warningType: "贷中风控预警",
    severityLevelId: l4.severityLevelId,
    severityCode: l4.severityCode,
    severityName: l4.severityName,
    severityColor: l4.severityColor,
    warningSource: "订单配置触发",
    warningContent: "模型名称：借款人司法诉讼与涉诉高风险模型；模型分数：82.5；预警描述：借款主体新增被执行人记录，涉案标的逾200万元",
    snapshotImageStatus: "none",
    warningTime: "2026-08-22 11:30:00",
    processedTime: null,
    publicityStatus: "未公示",
    processedBy: null,
    warningStatus: "OPEN_VALID",
    deviceEventId: null,
  },
  // 8. 解抵/质押/监管超时 (L3 · 订单配置触发 · 未公示)
  {
    orderNo: "PO202608-55",
    warningType: "解抵/质押/监管超时",
    severityLevelId: l3.severityLevelId,
    severityCode: l3.severityCode,
    severityName: l3.severityName,
    severityColor: l3.severityColor,
    warningSource: "订单配置触发",
    warningContent: "当前监管物 热轧卷板 Q235B（1,250.00吨）未在 2026年08月25日 完成解监管！（预警阈值 3 天）",
    snapshotImageStatus: "none",
    warningTime: "2026-08-25 09:00:00",
    processedTime: null,
    publicityStatus: "未公示",
    processedBy: null,
    warningStatus: "OPEN_VALID",
    deviceEventId: null,
  },
  // 9. 物联穿透告警 (L5 · 物联穿透 · 人体入侵)
  {
    orderNo: "PO202608-66",
    warningType: "物联穿透告警",
    severityLevelId: l5.severityLevelId,
    severityCode: l5.severityCode,
    severityName: l5.severityName,
    severityColor: l5.severityColor,
    warningSource: "物联穿透",
    warningContent: "位置：一号钢材仓+B库；设备名称：AI高清夜视摄像头-CAM1；触发预警：夜间闭库期间检测到人员滞留闯入！",
    snapshotImageStatus: "available",
    warningTime: "2026-08-20 13:05:00",
    processedTime: null,
    publicityStatus: "未公示",
    processedBy: null,
    warningStatus: "OPEN_VALID",
    deviceEventId: "evt-002",
  },
  // 10. 物联穿透告警 (L4 · 物联穿透 · 门禁超时)
  {
    orderNo: "PO202608-77",
    warningType: "物联穿透告警",
    severityLevelId: l4.severityLevelId,
    severityCode: l4.severityCode,
    severityName: l4.severityName,
    severityColor: l4.severityColor,
    warningSource: "物联穿透",
    warningContent: "位置：三号冷链仓+B库主门；设备名称：门禁控制器-B02；触发预警：门禁开启超30分钟未恢复！",
    snapshotImageStatus: "none",
    warningTime: "2026-08-15 09:45:00",
    processedTime: null,
    publicityStatus: "未公示",
    processedBy: null,
    warningStatus: "OPEN_VALID",
    deviceEventId: "evt-005",
  },
  // 11. 物联穿透告警 (L3 · 物联穿透 · 库温超标 · 已处理未公示)
  {
    orderNo: "PO202607-88",
    warningType: "物联穿透告警",
    severityLevelId: l3.severityLevelId,
    severityCode: l3.severityCode,
    severityName: l3.severityName,
    severityColor: l3.severityColor,
    warningSource: "物联穿透",
    warningContent: "位置：三号冷链仓+C库冷藏区；设备名称：温湿度传感器-C11；触发预警：库温达到 8.2℃（阈值 5.0℃）！",
    snapshotImageStatus: "available",
    warningTime: "2026-07-01 18:10:00",
    processedTime: "2026-07-01 19:30:00",
    publicityStatus: "未公示",
    processedBy: "赵运维（冷链保障组）",
    warningStatus: "CLOSED_VALID",
    deviceEventId: "evt-010",
  },
  // 12. 价格下跌 (L4 · 历史 · 货值下跌)
  {
    orderNo: "PO202606-20",
    warningType: "价格下跌",
    severityLevelId: l4.severityLevelId,
    severityCode: l4.severityCode,
    severityName: l4.severityName,
    severityColor: l4.severityColor,
    warningSource: "历史",
    warningContent: "大宗金属现货行情变动，热轧卷板总货值下跌 14.5%（预警阈值 10%）",
    snapshotImageStatus: "none",
    warningTime: "2026-06-15 14:00:00",
    processedTime: "2026-06-15 15:20:00",
    publicityStatus: "已公示",
    processedBy: "物流监管员（外部专员）",
    warningStatus: "CLOSED_VALID",
    deviceEventId: null,
  },
]

const extraOrders = [
  "PO202608-22",
  "PO202608-33",
  "PO202608-44",
  "PO202608-55",
  "PO202608-66",
  "PO202608-77",
  "PO202607-01",
  "PO202607-02",
  "PO202607-03",
  "PO202607-04",
]

function buildGeneratedEvents(): CollateralWarningEvent[] {
  const generated: CollateralWarningEvent[] = []
  const levels = [l2, l3, l4, l5]
  const sources = ["订单配置触发", "物联穿透", "历史"] as const
  const statuses = ["OPEN_VALID", "OPEN_VALID", "OPEN_VALID", "CLOSED_VALID", "OPEN_INVALID"] as const
  const types = [
    "抵/质押率异常",
    "价格下跌",
    "盘点异常",
    "巡检异常",
    "解抵/质押/监管超时",
    "贷中风控预警",
    "物联穿透告警",
  ] as const

  for (let index = 0; index < 60; index += 1) {
    const level = levels[index % levels.length]
    const orderNo = extraOrders[index % extraOrders.length]
    const day = String(10 + (index % 15)).padStart(2, "0")
    const hour = String(8 + (index % 10)).padStart(2, "0")
    const status = statuses[index % statuses.length]
    const isClosed = status === "CLOSED_VALID"
    const type = types[index % types.length]
    const source = type === "物联穿透告警" ? "物联穿透" : sources[index % sources.length]

    generated.push({
      eventId: `col-gen-${String(index + 13).padStart(3, "0")}`,
      orderNo,
      warningType: type,
      severityLevelId: level.severityLevelId,
      severityCode: level.severityCode,
      severityName: level.severityName,
      severityColor: level.severityColor,
      warningSource: source,
      warningContent: `模拟预警内容 #${index + 13}，订单 ${orderNo} 触发规则阈值`,
      snapshotImageStatus: index % 3 === 0 ? "available" : index % 3 === 1 ? "none" : "failed",
      warningTime: `2026-08-${day} ${hour}:30:00`,
      processedTime: isClosed ? `2026-08-${day} ${String(Number(hour) + 2).padStart(2, "0")}:00:00` : null,
      publicityStatus: isClosed ? (index % 2 === 0 ? "已公示" : "未公示") : "未公示",
      processedBy: isClosed ? "李监管（华东仓储）" : null,
      warningStatus: status,
      deviceEventId:
        source === "物联穿透"
          ? index % 2 === 0
            ? "evt-001"
            : "evt-002"
          : null,
    })
  }

  return generated
}

const seedEventIds = [
  "cw-001",
  "cw-002",
  "cw-003",
  "cw-004",
  "cw-005",
  "cw-006",
  "cw-007",
  "cw-008",
  "cw-009",
  "cw-010",
  "cw-011",
  "cw-012",
]

export const collateralWarningEventsMock: CollateralWarningEvent[] = [
  ...seedEvents.map((event, index) => ({
    ...event,
    eventId: seedEventIds[index] ?? `col-seed-${String(index + 1).padStart(3, "0")}`,
  })),
  ...buildGeneratedEvents(),
]
