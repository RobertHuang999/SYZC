import { CREDENTIAL_STATUS_LABEL } from "../domain/constants"
import type { CredentialStatus } from "../domain/types"

const statusClass: Record<CredentialStatus, string> = {
  NOT_GENERATED: "bg-slate-100 text-slate-700",
  GENERATING: "bg-blue-100 text-blue-800",
  GENERATED: "bg-sky-100 text-sky-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  GEN_FAILED: "bg-red-100 text-red-800",
  DELIVERY_FAILED: "bg-amber-100 text-amber-800",
  USED: "bg-slate-100 text-slate-700",
  EXPIRED: "bg-slate-100 text-slate-700",
  REVOKED: "bg-slate-100 text-slate-700",
  SUPERSEDED: "bg-slate-100 text-slate-700",
}

export function CredentialStatusBadge({ status }: { status: CredentialStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass[status]}`}
    >
      {CREDENTIAL_STATUS_LABEL[status]}
    </span>
  )
}
