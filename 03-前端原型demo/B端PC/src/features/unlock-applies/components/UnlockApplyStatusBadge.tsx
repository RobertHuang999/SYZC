import { UNLOCK_APPLY_STATUS_LABEL } from "../domain/constants"
import type { UnlockApply } from "../domain/types"

const statusClass: Record<UnlockApply["status"], string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
  WITHDRAWN: "bg-slate-100 text-slate-700",
  EXPIRED: "bg-slate-100 text-slate-700",
}

export function UnlockApplyStatusBadge({ apply }: { apply: UnlockApply }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass[apply.status]}`}
    >
      {UNLOCK_APPLY_STATUS_LABEL[apply.status]}
    </span>
  )
}
