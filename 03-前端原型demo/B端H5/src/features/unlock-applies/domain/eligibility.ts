import { CURRENT_APPROVER_ACCOUNT } from "./constants"
import type { UnlockApply } from "./types"

export type UnlockApprovalDecision = {
  canProcess: boolean
  isApplicant: boolean
  isAssignedApprover: boolean
  reason: string | null
}

export function getUnlockApprovalDecision(
  apply: UnlockApply,
  currentUserAccount = CURRENT_APPROVER_ACCOUNT
): UnlockApprovalDecision {
  const isApplicant = apply.applicantAccount === currentUserAccount
  const isAssignedApprover = Boolean(
    apply.configSnapshot.approvalNodeAccounts?.includes(currentUserAccount)
  )

  if (apply.status !== "PENDING") {
    return { canProcess: false, isApplicant, isAssignedApprover, reason: "申请已处理" }
  }
  if (!apply.needsApproval) {
    return { canProcess: false, isApplicant, isAssignedApprover, reason: "该申请为免审直发" }
  }
  if (isApplicant) {
    return {
      canProcess: false,
      isApplicant: true,
      isAssignedApprover,
      reason: "申请人本人不得审批自己的开锁申请（P06）",
    }
  }
  if (!isAssignedApprover) {
    return {
      canProcess: false,
      isApplicant: false,
      isAssignedApprover: false,
      reason: "当前用户不是该审批节点处理人",
    }
  }

  return { canProcess: true, isApplicant: false, isAssignedApprover: true, reason: null }
}
