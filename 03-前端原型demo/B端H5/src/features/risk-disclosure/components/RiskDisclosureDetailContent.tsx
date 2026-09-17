import { Copy } from "lucide-react"
import { SectionCard } from "@/components/ui/SectionCard"
import type { RiskDisclosurePublishDraft } from "@/features/collateral-warning-events/domain/publish-draft"
import type { LedgerDisclosureMeta } from "../lib/ledger-detail-utils"
import { getPublicityStatusClass } from "../lib/display-utils"
import { DisclosureSnapshotMobileSections } from "./DisclosureSnapshotMobileSections"

type RiskDisclosureDetailContentProps = {
  orderNo: string
  sourceLabel?: string | null
  meta: LedgerDisclosureMeta
  snapshot: RiskDisclosurePublishDraft
  showReleaseMethod: boolean
  allExpanded?: boolean
  onCopyOrderNo?: (orderNo: string) => void
}

export function RiskDisclosureDetailContent({
  orderNo,
  sourceLabel,
  meta,
  snapshot,
  showReleaseMethod,
  allExpanded = true,
  onCopyOrderNo,
}: RiskDisclosureDetailContentProps) {
  return (
    <>
      {sourceLabel ? (
        <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-2.5 text-xs text-blue-900">
          {sourceLabel}
        </div>
      ) : null}

      <SectionCard
        title="公示状态"
        indicatorColor="#f97316"
        collapsed={!allExpanded}
        extra={
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${getPublicityStatusClass(meta.disclosureStatus)}`}
          >
            {meta.disclosureStatus}
          </span>
        }
      >
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between gap-3">
            <span className="w-24 shrink-0 text-gray-500">预警订单:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-gray-900">{orderNo}</span>
              {onCopyOrderNo ? (
                <button
                  type="button"
                  onClick={() => onCopyOrderNo(orderNo)}
                  className="cursor-pointer text-gray-400 hover:text-blue-600"
                  title="复制单号"
                >
                  <Copy className="size-3" />
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="w-24 shrink-0 text-gray-500">公示时间:</span>
            <span className="font-mono text-gray-800">{meta.lastDisclosureTime}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="w-24 shrink-0 text-gray-500">操作人:</span>
            <span className="text-right font-medium text-gray-800">{meta.lastOperator}</span>
          </div>

          {meta.cancelReason ? (
            <div className="border-t border-gray-100 pt-2">
              <span className="text-gray-500">取消说明</span>
              <p className="mt-1 whitespace-pre-wrap rounded-xl border bg-slate-50 p-2.5 text-gray-800">
                {meta.cancelReason}
              </p>
            </div>
          ) : null}
        </div>
      </SectionCard>

      <DisclosureSnapshotMobileSections
        orderNo={orderNo}
        snapshot={snapshot}
        showReleaseMethod={showReleaseMethod}
        allExpanded={allExpanded}
      />

      <SectionCard title="操作记录" indicatorColor="#6366f1" collapsed={!allExpanded}>
        <div className="space-y-2 text-xs">
          {meta.operationHistory.length > 0 ? (
            meta.operationHistory.map((entry, index) => (
              <div
                key={`${entry.action}-${index}`}
                className="rounded-xl border border-gray-100 bg-[#f8fafc] p-2.5"
              >
                <div className="font-semibold text-gray-900">{entry.action}</div>
                <div className="mt-1 text-gray-600">{entry.operator}</div>
                <div className="mt-0.5 font-mono text-[11px] text-gray-500">
                  {entry.operatedAt}
                </div>
                {entry.remark ? (
                  <p className="mt-1 whitespace-pre-wrap text-gray-700">{entry.remark}</p>
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-gray-500">暂无操作记录</div>
          )}
        </div>
      </SectionCard>
    </>
  )
}
