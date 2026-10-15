import type { InboundStagingReg } from "./inbound-staging.mock"

export type StagingOperationLog = {
  id: string
  time: string
  actor: string
  action: string
  summary?: string
}

const DEFAULT_ACTOR = "张三(理货员)"

export function appendStagingOperationLog(
  reg: InboundStagingReg,
  entry: Omit<StagingOperationLog, "id">,
): void {
  if (!reg.operationLogs) reg.operationLogs = []
  reg.operationLogs.unshift({
    id: `log-${Date.now()}-${reg.operationLogs.length}`,
    ...entry,
  })
}

/** 无持久化流水时，由登记单字段合成最小时间轴（兼容旧 Mock） */
export function resolveStagingOperationLogs(reg: InboundStagingReg): StagingOperationLog[] {
  if (reg.operationLogs?.length) {
    return [...reg.operationLogs].sort((a, b) => a.time.localeCompare(b.time))
  }

  const logs: StagingOperationLog[] = [
    {
      id: `${reg.id}-create`,
      time: reg.registeredAt,
      actor: reg.registrant,
      action: "创建登记单",
      summary: `${reg.regNo} 已保存为【待补全】`,
    },
  ]

  if (reg.status === "已转正式" && reg.relatedFormalNo) {
    logs.push({
      id: `${reg.id}-convert`,
      time: reg.registeredAt,
      actor: reg.registrant,
      action: "转为正式入库",
      summary: `关联正式入库单号 ${reg.relatedFormalNo}`,
    })
  }

  if (reg.status === "已作废") {
    logs.push({
      id: `${reg.id}-void`,
      time: reg.registeredAt,
      actor: reg.registrant,
      action: "作废单据",
      summary: reg.voidReason?.trim() || "已作废",
    })
  }

  return logs.sort((a, b) => a.time.localeCompare(b.time))
}

export function operationLogEntryForSave(isCreate: boolean, actor = DEFAULT_ACTOR): Omit<
  StagingOperationLog,
  "id" | "time"
> & { time?: string } {
  const time = new Date().toISOString().slice(0, 19).replace("T", " ")
  return isCreate
    ? { time, actor, action: "创建登记单", summary: "现场极速保存，状态【待补全】" }
    : { time, actor, action: "补充修改", summary: "协作补录库位/照片/备注并保存" }
}
