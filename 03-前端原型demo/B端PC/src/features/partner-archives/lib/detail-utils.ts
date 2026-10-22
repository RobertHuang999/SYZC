import type { PartnerSubject } from "../domain/types"

/** 列表/详情展示：138****5678 */
export function maskLoginPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (digits.length < 11) {
    return phone
  }
  return `${digits.slice(0, 3)}****${digits.slice(-4)}`
}
import { withPartnerFreezeDemoData } from "../mock/partner-freeze-demo-rehydrate"
import { partnerArchivesMock } from "../mock/partner-archives.mock"

export function getPartnerArchiveById(id: string | undefined) {
  if (!id) {
    return undefined
  }
  const found = partnerArchivesMock.find((item) => item.id === id)
  if (!found) {
    return undefined
  }
  return withPartnerFreezeDemoData(found)
}

/** 列表/详情上的冻结、解冻、追加角色写回同一份档案数据 */
export function commitPartnerArchive(next: PartnerSubject) {
  const index = partnerArchivesMock.findIndex((item) => item.id === next.id)
  if (index >= 0) {
    partnerArchivesMock[index] = next
  }
  return next
}

