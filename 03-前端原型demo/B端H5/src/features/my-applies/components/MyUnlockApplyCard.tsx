import { Lock, UserRound } from "lucide-react"
import type { MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
import { formatDateTime } from "@/shared/lib/date-utils"
import {
  CREDENTIAL_STATUS_LABEL,
  UNLOCK_APPLY_STATUS_LABEL,
} from "../domain/constants"
import type { UnlockApply } from "../domain/types"

type MyUnlockApplyCardProps = {
  apply: UnlockApply
}

export function MyUnlockApplyCard({ apply }: MyUnlockApplyCardProps) {
  const navigate = useNavigate()
  const detailPath = `/m/my-applies/unlock/${apply.applyNo}`
  const isFace = apply.deviceType === "人脸门禁"
  const DeviceIcon = isFace ? UserRound : Lock
  const iconColor = isFace ? "text-blue-600" : "text-orange-600"

  const openDetail = (event?: MouseEvent) => {
    event?.stopPropagation()
    navigate(detailPath)
  }

  const isPending = apply.status === "PENDING"

  return (
    <article
      onClick={() => navigate(detailPath)}
      className="group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-xs transition-all active:scale-[0.99] cursor-pointer hover:border-orange-200 hover:shadow-sm"
    >
      <div className="flex items-center justify-between gap-2 border-b border-gray-100/80 pb-2.5">
        <span className="text-[10px] text-gray-400">{formatDateTime(apply.submitTime)}</span>
        <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700">
          开锁·临时授权
        </span>
        {!apply.needsApproval && (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
            无需审核
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <DeviceIcon className={`size-3.5 shrink-0 ${iconColor}`} />
            <h3 className="text-sm font-bold text-gray-900 truncate">{apply.deviceName}</h3>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            isPending
              ? "bg-amber-50 text-amber-700"
              : apply.status === "APPROVED"
              ? "bg-emerald-50 text-emerald-700"
              : apply.status === "REJECTED"
              ? "bg-red-50 text-red-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {UNLOCK_APPLY_STATUS_LABEL[apply.status]}
        </span>
      </div>

      <div className="mt-2.5 space-y-1 rounded-xl bg-slate-50/80 p-2.5 text-[11px]">
        <div className="flex gap-2">
          <span className="w-14 shrink-0 text-gray-400">绑定仓库</span>
          <span className="flex-1 text-gray-800 font-medium">{apply.warehouseName}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-14 shrink-0 text-gray-400">凭证状态</span>
          <span className="flex-1 text-gray-800">
            {CREDENTIAL_STATUS_LABEL[apply.credential.status]}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="w-14 shrink-0 text-gray-400">事由</span>
          <span className="flex-1 text-gray-700">{apply.reason}</span>
        </div>
        <div className="flex gap-2">
          <span className="w-14 shrink-0 text-gray-400">发起人</span>
          <span className="flex-1 text-gray-800">
            {apply.applicantName}（{apply.applicantAccount}）
          </span>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-end text-[11px]">
        <button
          type="button"
          className="font-semibold text-orange-600 hover:underline active:opacity-70"
          onClick={openDetail}
        >
          查看详情
        </button>
      </div>
    </article>
  )
}
