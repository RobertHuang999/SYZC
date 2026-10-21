/** 双端原型共用 · 与 R03 口径一致（session 快照读写由各自 write/read 负责） */

export type WarehouseOpsConfigLike = {
  inOutRequiresAudit: "是" | "否"
  auditScopeMode: "全部库房" | "指定库房"
  auditedRoomIds: string[]
}

/** 与 platform-basic-config/mock/warehouse-tree.mock 库房 ID 对齐 */
export const ALL_STOREROOM_IDS = [
  "room-sz-1",
  "room-sz-2",
  "room-sz-3",
  "room-sh-a",
  "room-sh-b",
  "room-tj-1",
  "room-tj-2",
  "room-tj-3",
  "room-tj-4",
] as const

export function applyStoreroomInboundAuditToggle<
  T extends WarehouseOpsConfigLike,
>(ops: T, storeroomId: string, enableAudit: boolean): T | null {
  if (ops.inOutRequiresAudit === "否") {
    return null
  }

  const allIds = [...ALL_STOREROOM_IDS]

  if (enableAudit) {
    if (ops.auditScopeMode === "全部库房") {
      return { ...ops, auditedRoomIds: [...ops.auditedRoomIds] }
    }
    if (ops.auditedRoomIds.includes(storeroomId)) {
      return { ...ops, auditedRoomIds: [...ops.auditedRoomIds] }
    }
    return {
      ...ops,
      auditedRoomIds: [...ops.auditedRoomIds, storeroomId],
    }
  }

  if (ops.auditScopeMode === "全部库房") {
    return {
      ...ops,
      auditScopeMode: "指定库房",
      auditedRoomIds: allIds.filter((id) => id !== storeroomId),
    }
  }

  return {
    ...ops,
    auditedRoomIds: ops.auditedRoomIds.filter((id) => id !== storeroomId),
  }
}
