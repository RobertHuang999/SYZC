import { ChevronRight, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { formatDateTime } from "@/shared/lib/date-utils"
import {
  UNLOCK_APPLY_STATUS_LABEL,
} from "../domain/constants"
import type { UnlockApply } from "../domain/types"

type UnlockApplyCardProps = {
  apply: UnlockApply
}

export function UnlockApplyCard({ apply }: UnlockApplyCardProps) {
  const navigate = useNavigate()
  const statusLabel = UNLOCK_APPLY_STATUS_LABEL[apply.status]
  const isPending = apply.status === "PENDING"

  return (
    <article
      onClick={() => navigate(`/m/approval/unlock-applies/${apply.applyNo}`)}
      className="group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-xs transition-all active:scale-[0.99] cursor-pointer hover:border-orange-200 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2 border-b border-gray-100/80 pb-2.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Lock className="size-3.5 shrink-0 text-orange-600" />
            <h3 className="font-mono text-sm font-bold text-gray-900 truncate">
              {apply.applyNo}
            </h3>
          </div>
          <p className="mt-0.5 text-[11px] text-gray-500 truncate">
            {apply.deviceName}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            isPending
              ? "bg-amber-50 text-amber-700"
              : apply.status === "APPROVED"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="mt-2.5 space-y-1 rounded-xl bg-slate-50/80 p-2.5 text-[11px]">
        <div className="flex gap-2">
          <span className="w-14 shrink-0 text-gray-400">绑定仓库</span>
          <span className="flex-1 text-gray-800 font-medium">{apply.warehouseName}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-14 shrink-0 text-gray-400">申请人</span>
          <span className="flex-1 text-gray-800">
            {apply.applicantName}（{apply.applicantAccount}）
          </span>
        </div>
        <div className="flex gap-2">
          <span className="w-14 shrink-0 text-gray-400">事由</span>
          <span className="flex-1 text-gray-700 line-clamp-2">{apply.reason}</span>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px]">
        <span className="text-gray-400">{formatDateTime(apply.submitTime)}</span>
        <span className="flex items-center gap-0.5 font-semibold text-orange-600">
          {isPending ? "去审批" : "详情"}
          <ChevronRight className="size-3.5" />
        </span>
      </div>
    </article>
  )
}
