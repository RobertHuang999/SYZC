import { useNavigate } from "react-router-dom"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import type { ReadonlyRiskRecord } from "@/features/readonly-risk-views/types"
import {
  getPublicityStatusClass,
  parseRiskDisclosureRecordDisplay,
} from "../lib/display-utils"

type RiskDisclosureCardProps = {
  record: ReadonlyRiskRecord
}

export function RiskDisclosureCard({ record }: RiskDisclosureCardProps) {
  const navigate = useNavigate()
  const display = parseRiskDisclosureRecordDisplay(record)

  return (
    <article
      onClick={() => navigate(`/m/risk/disclosures/${record.id}`)}
      className="group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-xs transition-all active:scale-[0.99] cursor-pointer hover:border-blue-200 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2 border-b border-gray-100/80 pb-2.5">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-mono text-sm font-bold leading-snug text-gray-900">
            {display.orderNo}
          </h3>
          <div className="mt-0.5 truncate text-[11px] font-medium text-gray-400">
            风险公示 · {display.warningType}
          </div>
        </div>

        <span
          className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${getPublicityStatusClass(record.status)}`}
        >
          {record.status}
        </span>
      </div>

      <div className="mt-2.5 space-y-1.5 rounded-xl border border-slate-100/90 bg-[#f8fafc] p-2.5 text-xs text-gray-700">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="w-16 shrink-0 text-gray-400">预警类型:</span>
          <span className="flex-1 truncate text-right font-medium text-indigo-700">
            {display.warningType}
          </span>
        </div>

        <div className="flex items-start justify-between gap-2 text-[11px] leading-relaxed">
          <span className="w-16 shrink-0 text-gray-400">公示摘要:</span>
          <span className="line-clamp-2 flex-1 text-left font-medium text-gray-800">
            {display.summary}
          </span>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex min-w-0 items-center gap-1">
          <span>公示时间:</span>
          <span className="truncate font-mono font-medium text-gray-600">
            {display.disclosureTime}
          </span>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-400">
        <div className="flex min-w-0 items-center gap-1 truncate">
          <span>操作人:</span>
          <span className="truncate font-medium text-gray-700">{display.operator}</span>
        </div>
      </div>

      <PrototypeAnnotationTarget annotationIds={["h5-risk-disclosure-list-row"]}>
        <div
          className="mt-2.5 flex items-center justify-end gap-3 border-t border-gray-100 pt-2 text-xs"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => navigate(`/m/risk/disclosures/${record.id}`)}
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-[#f57c00] active:opacity-70 cursor-pointer hover:underline"
          >
            <span>详情 ▸</span>
          </button>
        </div>
      </PrototypeAnnotationTarget>
    </article>
  )
}
