import { Clock } from "lucide-react"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import type { CheckHistoryNode } from "../domain/types"

type CheckHistorySheetProps = {
  open: boolean
  goodsName: string
  historyList: CheckHistoryNode[]
  onClose: () => void
}

const STATUS_CLASS: Record<CheckHistoryNode["statusLabel"], string> = {
  异常已处理: "border-emerald-200 bg-emerald-50 text-emerald-700",
  正常: "border-emerald-200 bg-emerald-50 text-emerald-700",
  异常待处理: "border-rose-200 bg-rose-50 text-rose-600",
}

export function CheckHistorySheet({
  open,
  goodsName,
  historyList,
  onClose,
}: CheckHistorySheetProps) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/40">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="关闭盘点历史"
        onClick={onClose}
      />
      <div className="relative max-h-[80%] w-full overflow-y-auto rounded-t-2xl bg-white p-4 pb-8">
        <PrototypeAnnotationTarget annotationIds={["check-h5-history"]}>
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-base font-semibold text-[#232D39]">
            <Clock className="size-4 text-blue-600" />
            盘点历史
          </h3>
          <button type="button" onClick={onClose} className="text-xs text-[#232D39]/50">
            关闭
          </button>
        </div>
        <p className="mt-1 text-xs text-[#232D39]/60">{goodsName}</p>

        {historyList.length === 0 ? (
          <p className="py-10 text-center text-xs text-[#232D39]/40">
            该货品还没有盘点记录
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {historyList.map((node) => (
              <div
                key={node.id}
                className="rounded-xl border border-[#232D39]/10 bg-white p-3 text-xs shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_CLASS[node.statusLabel]}`}
                  >
                    {node.statusLabel}
                  </span>
                  <span className="shrink-0 text-[10px] text-[#232D39]/40">
                    {node.timestamp}
                  </span>
                </div>

                <div className="mt-2 space-y-1 text-[11px] text-[#232D39]/70">
                  <div className="flex justify-between gap-3">
                    <span className="shrink-0 text-[#232D39]/45">盘点人员</span>
                    <span>{node.actualUser || "——"}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="shrink-0 text-[#232D39]/45">账面 / 实盘</span>
                    <span>
                      {node.snapshotQty} {node.unit} /{" "}
                      {node.countedQty === "无需盘点"
                        ? "无需盘点"
                        : `${node.countedQty} ${node.unit}`}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="shrink-0 text-[#232D39]/45">存在 / 完好 / 位置</span>
                    <span>
                      {node.isExist} / {node.isIntact} / {node.isLocationMatch}
                    </span>
                  </div>
                </div>

                {node.remarks && (
                  <p className="mt-2 rounded-lg bg-[#232D39]/[0.03] p-2 text-[11px] leading-relaxed text-[#232D39]/70">
                    {node.remarks}
                  </p>
                )}

                {node.resolveList.length > 0 && (
                  <div className="mt-2 space-y-1.5 border-t border-dashed border-[#232D39]/10 pt-2">
                    <p className="text-[11px] font-medium text-emerald-700">异常解除记录</p>
                    {node.resolveList.map((resolve) => (
                      <div
                        key={resolve.id}
                        className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-2 text-[11px] text-[#232D39]/70"
                      >
                        <p className="leading-relaxed">{resolve.remark}</p>
                        <p className="mt-1 text-[10px] text-[#232D39]/45">
                          {resolve.resolveUser} · {resolve.resolveTime}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </PrototypeAnnotationTarget>
      </div>
    </div>
  )
}
