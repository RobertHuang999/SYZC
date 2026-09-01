import { findUnlockApply } from "./unlock-applies-store"
import type { UnlockApply } from "../domain/types"

export function getUnlockApplyByNo(applyNo?: string): UnlockApply | undefined {
  return findUnlockApply(applyNo)
}

export function maskPhone(phone: string): string {
  if (phone.length < 7) return phone
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`
}

export function formatApplicant(item: UnlockApply): string {
  return `${item.applicantName}（${item.applicantAccount}）`
}
