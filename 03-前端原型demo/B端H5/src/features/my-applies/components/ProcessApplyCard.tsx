import { FileText } from "lucide-react"
import { formatDateTime } from "@/shared/lib/date-utils"
import type { ProcessApplyRecord } from "../domain/types"

export function ProcessApplyCard({ record }: { record: ProcessApplyRecord }) {
  const statusClass =
    record.status === "审批中"
      ? "bg-amber-50 text-amber-700"
      : record.status === "已通过"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-red-50 text-red-700"

  return (
    <article className="rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-xs">
      <div className="flex items-center justify-between gap-2 border-b border-gray-100/80 pb-2.5">
        <span className="text-[10px] text-gray-400">{formatDateTime(record.submitTime)}</span>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
          流程申请
        </span>
      </div>

      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <FileText className="size-3.5 shrink-0 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900 truncate">{record.ownerName}</h3>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClass}`}>
          {record.status}
        </span>
      </div>

      <p className="mt-2 text-[11px] text-gray-600">{record.summary}</p>

      <div className="mt-2.5 flex justify-end text-[11px] font-semibold text-gray-400">
        查看详情（线上占位）
      </div>
    </article>
  )
}
