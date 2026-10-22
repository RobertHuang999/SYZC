import type { PartnerSubject } from "../domain/types"

/** 详情/列表展示：优先角色 freezeReason，否则解析最近一条冻结审计 */
export function resolvePartnerSubjectFreezeReason(
  partner: PartnerSubject,
): string | undefined {
  const fromRole = partner.roles.find((role) => role.freezeReason?.trim())?.freezeReason
  if (fromRole?.trim()) {
    return fromRole.trim()
  }
  const freezeLog = partner.auditLogs.find((log) => log.actionType === "FREEZE")
  if (!freezeLog?.detail) {
    return undefined
  }
  const matched = freezeLog.detail.match(/^冻结主体[：:]\s*(.+)$/)
  return matched?.[1]?.trim() || undefined
}

function formatOpTime(now = new Date()) {
  return now.toISOString().replace("T", " ").substring(0, 19)
}

/** 冻结主体：同步主体状态、有效角色与审计（对齐 Mock 种子 p-12~p-15） */
export function applyPartnerSubjectFreeze(
  partner: PartnerSubject,
  reason: string,
  operator = "当前用户",
): PartnerSubject {
  const trimmed = reason.trim()
  const now = formatOpTime()
  const roles = partner.roles.map((role) => {
    if (role.roleStatus === "INVALID") {
      return role
    }
    return {
      ...role,
      roleStatus: "FROZEN" as const,
      freezeReason: trimmed,
    }
  })

  return {
    ...partner,
    status: "FROZEN",
    updateTime: now,
    roles,
    auditLogs: [
      {
        id: `log-${Date.now()}`,
        opTime: now,
        operator,
        actionType: "FREEZE",
        actionName: "冻结主体",
        detail: `冻结主体：${trimmed}`,
      },
      ...partner.auditLogs,
    ],
  }
}

/** 解冻主体：恢复角色正常态并写审计 */
export function applyPartnerSubjectUnfreeze(
  partner: PartnerSubject,
  note: string,
  operator = "当前用户",
): PartnerSubject {
  const trimmed = note.trim()
  const now = formatOpTime()
  const roles = partner.roles.map((role) => {
    if (role.roleStatus !== "FROZEN") {
      return role
    }
    const { freezeReason: _removed, ...rest } = role
    return {
      ...rest,
      roleStatus: "NORMAL" as const,
    }
  })

  return {
    ...partner,
    status: "NORMAL",
    updateTime: now,
    roles,
    auditLogs: [
      {
        id: `log-${Date.now()}`,
        opTime: now,
        operator,
        actionType: "UNFREEZE",
        actionName: "解冻主体",
        detail: trimmed ? `解冻主体：${trimmed}` : "解冻主体",
      },
      ...partner.auditLogs,
    ],
  }
}
