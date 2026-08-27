import { getSeverityLevelByCode } from "@/shared/mock/severity-levels"
import type { CollateralWarningEvent } from "../domain/types"

const l3 = getSeverityLevelByCode("L3")!
const l4 = getSeverityLevelByCode("L4")!
const l5 = getSeverityLevelByCode("L5")!

const seedEvents: Omit<CollateralWarningEvent, "eventId">[] = [
  {
    orderNo: "PO202608-01",
    warningType: "抵/质押率异常",
    severityLevelId: l4.severityLevelId,
    severityCode: l4.severityCode,
    severityName: l4.severityName,
    severityColor: l4.severityColor,
    warningSource: "订单配置触发",
    warningContent: "LTV88.5%超平仓线85%，当前货值较授信额度偏差+3.5%",
    snapshotImageStatus: "available",
    warningTime: "2026-08-20 09:15:00",
    processedTime: null,
    publicityStatus: "未公示",
    processedBy: null,
    warningStatus: "OPEN_VALID",
    deviceEventId: null,
  },
  {
    orderNo: "PO202608-01",
    warningType: "物联穿透告警",
    severityLevelId: l5.severityLevelId,
    severityCode: l5.severityCode,
    severityName: l5.severityName,
    severityColor: l5.severityColor,
    warningSource: "物联穿透",
    warningContent: "A库挂锁剪杆破坏，设备：智能挂锁-A01",
    snapshotImageStatus: "available",
    warningTime: "2026-08-20 14:20:00",
    processedTime: null,
    publicityStatus: "未公示",
    processedBy: null,
    warningStatus: "OPEN_VALID",
    deviceEventId: "evt-017",
  },
  {
    orderNo: "PO202608-88",
    warningType: "巡检异常",
    severityLevelId: l3.severityLevelId,
    severityCode: l3.severityCode,
    severityName: l3.severityName,
    severityColor: l3.severityColor,
    warningSource: "订单配置触发",
    warningContent: "刘强未按时巡检，计划时间 08-19 08:00 超时 24h",
    snapshotImageStatus: "none",
    warningTime: "2026-08-19 08:00:00",
    processedTime: null,
    publicityStatus: "未公示",
    processedBy: null,
    warningStatus: "OPEN_VALID",
    deviceEventId: null,
  },
  {
    orderNo: "PO202608-15",
    warningType: "价格下跌",
    severityLevelId: l4.severityLevelId,
    severityCode: l4.severityCode,
    severityName: l4.severityName,
    severityColor: l4.severityColor,
    warningSource: "订单配置触发",
    warningContent: "货值下跌超15%，螺纹钢 HRB400 较入库价 -16.2%",
    snapshotImageStatus: "available",
    warningTime: "2026-08-18 11:00:00",
    processedTime: null,
    publicityStatus: "未公示",
    processedBy: null,
    warningStatus: "OPEN_VALID",
    deviceEventId: null,
  },
  {
    orderNo: "PO202607-12",
    warningType: "价格下跌",
    severityLevelId: l4.severityLevelId,
    severityCode: l4.severityCode,
    severityName: l4.severityName,
    severityColor: l4.severityColor,
    warningSource: "订单配置触发",
    warningContent: "货值下跌超12%，铜精矿较基准价 -12.8%",
    snapshotImageStatus: "available",
    warningTime: "2026-07-29 16:30:00",
    processedTime: "2026-07-30 09:15:00",
    publicityStatus: "未公示",
    processedBy: "王风控（森云科技）",
    warningStatus: "CLOSED_VALID",
    deviceEventId: null,
  },
  {
    orderNo: "PO202606-99",
    warningType: "盘点异常",
    severityLevelId: l3.severityLevelId,
    severityCode: l3.severityCode,
    severityName: l3.severityName,
    severityColor: l3.severityColor,
    warningSource: "订单配置触发",
    warningContent: "盘点差异 2.3%，系统判定为无效预警（已补盘）",
    snapshotImageStatus: "none",
    warningTime: "2026-06-28 10:00:00",
    processedTime: null,
    publicityStatus: "未公示",
    processedBy: null,
    warningStatus: "OPEN_INVALID",
    deviceEventId: null,
  },
]

const extraTypes = [
  "解抵/质押/监管超时",
  "贷中风控预警",
] as const

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
  const levels = [l3, l4, l5]
  const sources = ["订单配置触发", "物联穿透", "历史"] as const
  const statuses = ["OPEN_VALID", "OPEN_VALID", "OPEN_VALID", "CLOSED_VALID"] as const

  for (let index = 0; index < 50; index += 1) {
    const level = levels[index % levels.length]
    const orderNo = extraOrders[index % extraOrders.length]
    const day = String(10 + (index % 11)).padStart(2, "0")
    const hour = String(8 + (index % 10)).padStart(2, "0")
    const status = statuses[index % statuses.length]
    const isClosed = status === "CLOSED_VALID"
    const typeIndex = index % 7

    generated.push({
      eventId: `col-gen-${String(index + 7).padStart(3, "0")}`,
      orderNo,
      warningType:
        typeIndex < 5
          ? (["抵/质押率异常", "价格下跌", "盘点异常", "巡检异常", "物联穿透告警"][
              typeIndex
            ] as CollateralWarningEvent["warningType"])
          : extraTypes[typeIndex - 5],
      severityLevelId: level.severityLevelId,
      severityCode: level.severityCode,
      severityName: level.severityName,
      severityColor: level.severityColor,
      warningSource: sources[index % sources.length],
      warningContent: `模拟预警内容 #${index + 7}，订单 ${orderNo} 触发风控规则`,
      snapshotImageStatus: index % 3 === 0 ? "available" : "none",
      warningTime: `2026-08-${day} ${hour}:30:00`,
      processedTime: isClosed ? `2026-08-${day} ${String(Number(hour) + 2).padStart(2, "0")}:00:00` : null,
      publicityStatus: isClosed && index % 4 === 0 ? "已公示" : "未公示",
      processedBy: isClosed ? "李监管（华东仓储）" : null,
      warningStatus: status,
      deviceEventId:
        typeIndex === 4 ? (index % 2 === 0 ? "evt-017" : "evt-002") : null,
    })
  }

  return generated
}

const seedEventIds = ["cw-001", "cw-002", "cw-005", "cw-006", "cw-003", "cw-004"]

export const collateralWarningEventsMock: CollateralWarningEvent[] = [
  ...seedEvents.map((event, index) => ({
    ...event,
    eventId: seedEventIds[index] ?? `col-seed-${String(index + 1).padStart(3, "0")}`,
  })),
  ...buildGeneratedEvents(),
]
