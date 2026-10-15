import type { StagingOperationLog } from "./staging-operation-logs"

/** 对齐入库记录详情 auditTrail 字段，供 PC/H5 共用渲染 */
export type StagingAuditDisplayStep = {
  id: string
  node: string
  actor: string
  time: string
  action: string
  opinion?: string
}

export function mapStagingLogToAuditStep(log: StagingOperationLog): StagingAuditDisplayStep {
  return {
    id: log.id,
    node: log.action,
    actor: log.actor,
    time: log.time,
    action: "操作留痕",
    opinion: log.summary,
  }
}
