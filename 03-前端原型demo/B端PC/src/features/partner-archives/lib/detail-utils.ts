import type { PartnerSubject, SubjectStatus } from "../domain/types"

/** 列表/详情展示：138****5678 */
export function maskLoginPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (digits.length < 11) {
    return phone
  }
  return `${digits.slice(0, 3)}****${digits.slice(-4)}`
}
import { partnerArchivesMock } from "../mock/partner-archives.mock"

export function getPartnerArchiveById(id: string | undefined) {
  if (!id) {
    return undefined
  }
  return partnerArchivesMock.find((item) => item.id === id)
}

/** 列表/详情上的冻结、解冻、追加角色写回同一份档案数据 */
export function commitPartnerArchive(next: PartnerSubject) {
  const index = partnerArchivesMock.findIndex((item) => item.id === next.id)
  if (index >= 0) {
    partnerArchivesMock[index] = next
  }
  return next
}

export type PartnerDetailHeaderAction =
  | "back"
  | "edit"
  | "appendRole"
  | "freeze"
  | "unfreeze"

export function getPartnerDetailHeaderActions(
  status: SubjectStatus
): PartnerDetailHeaderAction[] {
  const actions: PartnerDetailHeaderAction[] = ["back", "edit"]
  if (status === "FROZEN") {
    actions.push("unfreeze")
    return actions
  }
  actions.push("appendRole", "freeze")
  return actions
}
