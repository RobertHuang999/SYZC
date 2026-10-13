import type { WarehouseOpsConfig } from "@/shared/config/warehouse-ops-snapshot"

export type StoreroomInboundAuditLabel = "受控（强制审批）" | "免审"

export function resolveStoreroomInboundAuditLabel(
  storeroomId: string,
  ops: WarehouseOpsConfig
): StoreroomInboundAuditLabel {
  if (ops.inOutRequiresAudit === "否") return "免审"
  if (ops.auditScopeMode === "全部库房") return "受控（强制审批）"
  return ops.auditedRoomIds.includes(storeroomId)
    ? "受控（强制审批）"
    : "免审"
}

export function resolveStoreroomInboundAuditYesNo(
  storeroomId: string,
  ops: WarehouseOpsConfig
): "是" | "否" {
  return resolveStoreroomInboundAuditLabel(storeroomId, ops) ===
    "受控（强制审批）"
    ? "是"
    : "否"
}
