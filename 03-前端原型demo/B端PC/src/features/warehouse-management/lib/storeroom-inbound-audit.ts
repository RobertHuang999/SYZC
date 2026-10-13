import type { WarehouseOpsConfig } from "@/features/platform-basic-config/domain/types"

export type StoreroomInboundAuditLabel = "受控（强制审批）" | "免审"

export type StoreroomInboundAuditYesNo = "是" | "否"

/** 与基础配置 R02、仓库管理 F13 口径一致（内部/入库侧映射仍用受控、免审） */
export function resolveStoreroomInboundAuditLabel(
  storeroomId: string,
  ops: WarehouseOpsConfig
): StoreroomInboundAuditLabel {
  if (ops.inOutRequiresAudit === "否") {
    return "免审"
  }
  if (ops.auditScopeMode === "全部库房") {
    return "受控（强制审批）"
  }
  return ops.auditedRoomIds.includes(storeroomId)
    ? "受控（强制审批）"
    : "免审"
}

/** 库房详情等面向用户的只读展示：是否需要出入库审核 */
export function resolveStoreroomInboundAuditYesNo(
  storeroomId: string,
  ops: WarehouseOpsConfig
): StoreroomInboundAuditYesNo {
  return resolveStoreroomInboundAuditLabel(storeroomId, ops) ===
    "受控（强制审批）"
    ? "是"
    : "否"
}

export function storeroomInboundAuditRequiresApproval(
  storeroomId: string,
  ops: WarehouseOpsConfig
): boolean {
  return resolveStoreroomInboundAuditYesNo(storeroomId, ops) === "是"
}
