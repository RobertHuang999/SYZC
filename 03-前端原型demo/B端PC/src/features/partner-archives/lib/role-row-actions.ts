import type { RoleStatus, RoleType } from "../domain/types"

export type PartnerRoleRowAction = "complete" | "freeze" | "unfreeze" | "remove"

export const PARTNER_ROLE_ROW_ACTION_LABELS: Record<PartnerRoleRowAction, string> = {
  complete: "补全资料",
  freeze: "冻结",
  unfreeze: "解冻",
  remove: "移除角色",
}

/** 对齐字段清单 §二「行操作」；主体冻结时仍允许角色级解冻占位。 */
export function getPartnerRoleRowActions(
  roleType: RoleType,
  roleStatus: RoleStatus
): PartnerRoleRowAction[] {
  if (roleStatus === "INVALID") {
    return []
  }

  const actions: PartnerRoleRowAction[] = []

  if (roleStatus === "PENDING_COMPLETION") {
    actions.push("complete")
    if (roleType !== "OWNER") {
      actions.push("remove")
    }
  }

  if (roleStatus === "NORMAL") {
    actions.push("freeze")
    if (roleType !== "OWNER") {
      actions.push("remove")
    }
  }

  if (roleStatus === "FROZEN") {
    actions.push("unfreeze")
  }

  if (roleStatus === "PENDING_EFFECTIVE" && roleType !== "OWNER") {
    actions.push("remove")
  }

  return actions
}
