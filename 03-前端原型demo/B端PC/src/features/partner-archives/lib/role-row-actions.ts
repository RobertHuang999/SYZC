import type { RoleStatus, RoleType } from "../domain/types"

/**
 * @deprecated 6.3 方案 B 已废止单主档挂接多业务角色子表及按角色冻结/移除逻辑；
 * 行操作真源请使用 actions.ts 中的 getPartnerArchiveRowActions。
 */
export type PartnerRoleRowAction = "complete" | "freeze" | "unfreeze" | "remove"

export const PARTNER_ROLE_ROW_ACTION_LABELS: Record<PartnerRoleRowAction, string> = {
  complete: "补全资料",
  freeze: "冻结",
  unfreeze: "解冻",
  remove: "移除角色",
}

/**
 * @deprecated 请使用 actions.ts 中的 getPartnerArchiveRowActions
 */
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
    if (roleType !== "OWNER") {
      actions.push("remove")
    }
  }

  if (roleStatus === "PENDING_EFFECTIVE" && roleType !== "OWNER") {
    actions.push("remove")
  }

  return actions
}
