import type { RiskDisclosureRecord } from "../domain/types"

const seedData: Omit<RiskDisclosureRecord, "recordId">[] = [
  {
    ruleName: "LTV平仓线监控",
    orderNo: "PO202607-12",
    ownerName: "华东钢材贸易",
    warningType: "价格下跌",
    warningContent: "货值下跌超12%，铜精矿较基准价 -12.8%",
    snapshotImageStatus: "available",
    warningTime: "2026-07-29 16:30:00",
    processedTime: "2026-07-30 09:15:00",
    processedBy: "王风控（森云科技）",
    disclosureStatus: "已公示",
    lastDisclosureTime: "2026-07-31 14:20:00",
    lastOperator: "合规专员（森云科技）",
  },
  {
    ruleName: "巡检超时预警",
    orderNo: "PO202607-08",
    ownerName: "鑫源粮油集团",
    warningType: "巡检异常",
    warningContent: "计划巡检超时 48h，责任人未到场",
    snapshotImageStatus: "none",
    warningTime: "2026-07-28 08:00:00",
    processedTime: "2026-07-29 11:30:00",
    processedBy: "李监管（华东仓储）",
    disclosureStatus: "已公示",
    lastDisclosureTime: "2026-07-30 10:00:00",
    lastOperator: "合规专员（森云科技）",
  },
  {
    ruleName: "质押率异常监控",
    orderNo: "PO202606-99",
    ownerName: "北方化工仓储",
    warningType: "抵/质押率异常",
    warningContent: "LTV 91.2% 超警戒线 88%",
    snapshotImageStatus: "available",
    warningTime: "2026-06-25 15:00:00",
    processedTime: "2026-06-26 09:00:00",
    processedBy: "张风控（森云科技）",
    disclosureStatus: "已公示",
    lastDisclosureTime: "2026-06-27 16:45:00",
    lastOperator: "风控总监（森云科技）",
  },
  {
    ruleName: "贷中风控模型",
    orderNo: "PO202608-105",
    ownerName: "张明",
    warningType: "贷中风控预警",
    warningContent: "智风控模型评分 42，触发贷中拒绝阈值",
    snapshotImageStatus: "none",
    warningTime: "2026-08-12 10:30:00",
    processedTime: "2026-08-13 08:20:00",
    processedBy: "系统自动处理",
    disclosureStatus: "已公示",
    lastDisclosureTime: "2026-08-14 09:00:00",
    lastOperator: "合规专员（森云科技）",
  },
  {
    ruleName: "挂锁破坏穿透",
    orderNo: "PO202608-01",
    ownerName: "华东钢材贸易",
    warningType: "物联穿透告警",
    warningContent: "A库挂锁剪杆破坏，设备：智能挂锁-A01",
    snapshotImageStatus: "available",
    warningTime: "2026-08-05 14:20:00",
    processedTime: "2026-08-06 10:00:00",
    processedBy: "设备运维（森云科技）",
    disclosureStatus: "已公示",
    lastDisclosureTime: "2026-08-07 11:30:00",
    lastOperator: "合规专员（森云科技）",
  },
]

const extraRules = [
  "盘点差异监控",
  "解押超时预警",
  "GPS偏离监控",
  "门禁异常预警",
  "图像识别异常",
]

const extraOwners = [
  "李华",
  "南方物流",
  "西部矿业",
  "中储股份",
  "恒信贸易",
]

const extraTypes = [
  "盘点异常",
  "解抵/质押/监管超时",
  "GPS异常",
  "人脸门禁异常",
  "图像识别异常",
  "物联设备",
  "智能挂锁异常",
] as const

export const riskDisclosureRecordsMock: RiskDisclosureRecord[] = [
  ...seedData.map((record, index) => ({
    ...record,
    recordId: `pub-seed-${String(index + 1).padStart(3, "0")}`,
  })),
  ...Array.from({ length: 10 }, (_, index) => {
    const day = String(5 + index).padStart(2, "0")
    return {
      recordId: `pub-gen-${String(index + 6).padStart(3, "0")}`,
      ruleName: extraRules[index % extraRules.length],
      orderNo: `PO202608-${String(200 + index).padStart(3, "0")}`,
      ownerName: extraOwners[index % extraOwners.length],
      warningType: extraTypes[index % extraTypes.length],
      warningContent: `已处理风险公示记录 #${index + 6}，${extraRules[index % extraRules.length]}触发`,
      snapshotImageStatus: index % 2 === 0 ? ("available" as const) : ("none" as const),
      warningTime: `2026-08-${day} 09:00:00`,
      processedTime: `2026-08-${day} 15:30:00`,
      processedBy: "王风控（森云科技）",
      disclosureStatus: "已公示" as const,
      lastDisclosureTime: `2026-08-${String(Number(day) + 1).padStart(2, "0")} 10:00:00`,
      lastOperator: "合规专员（森云科技）",
    }
  }),
]
