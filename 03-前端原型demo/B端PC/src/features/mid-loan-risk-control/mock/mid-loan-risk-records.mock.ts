import type { MidLoanRiskRecord } from "../domain/types"

const owners = [
  { name: "华东钢材贸易", id: "91310000MA1FL2XXXX" },
  { name: "鑫源粮油集团", id: "91320000MA1GK3YYYY" },
  { name: "北方化工仓储", id: "91330000MA1HK4ZZZZ" },
  { name: "张明", id: "310***********1234" },
  { name: "李华", id: "320***********5678" },
]

const models = [
  "智风控-贷中资信模型V3",
  "智风控-供应链风险模型V2",
  "智风控-司法舆情模型V1",
]

const collaterals = [
  "钢材-螺纹钢-HRB400-1200吨",
  "粮油-大豆-500吨",
  "化工-聚乙烯-800吨",
  "仓单 WH202608001",
  "钢材-热轧卷板-Q235B-600吨",
]

const statuses: MidLoanRiskRecord["lastExecutionStatus"][] = [
  "未执行",
  "提交成功（处理中）",
  "提交失败",
  "触发预警",
  "未触发预警",
  "提交中",
]

export const midLoanRiskRecordsMock: MidLoanRiskRecord[] = Array.from(
  { length: 20 },
  (_, index) => {
    const owner = owners[index % owners.length]
    const status = statuses[index % statuses.length]
    const isExecutable =
      status === "未执行" ||
      status === "提交失败" ||
      status === "触发预警" ||
      status === "未触发预警"
    const hasExecuted = status !== "未执行"
    const day = String(1 + (index % 28)).padStart(2, "0")

    return {
      recordId: `mid-${String(index + 1).padStart(3, "0")}`,
      orderNo: `PO202608-${String(100 + index).padStart(3, "0")}`,
      ownerName: owner.name,
      ownerId: owner.id,
      collateralInfo: collaterals[index % collaterals.length],
      orderCreatedAt: `2026-07-${day} 10:00:00`,
      orderType: index % 2 === 0 ? "抵押" : "质押",
      riskModel: models[index % models.length],
      executability: isExecutable ? "可执行" : "不可执行",
      executionCount: hasExecuted ? 1 + (index % 3) : 0,
      warningCount: status === "触发预警" ? 1 + (index % 2) : 0,
      lastExecutionStatus: status,
      lastExecutionTime: hasExecuted
        ? `2026-08-${String(10 + (index % 10)).padStart(2, "0")} ${String(9 + (index % 8)).padStart(2, "0")}:30:00`
        : null,
      lastSubmittedBy: hasExecuted
        ? `张风控（森云科技）`
        : null,
    }
  }
)
