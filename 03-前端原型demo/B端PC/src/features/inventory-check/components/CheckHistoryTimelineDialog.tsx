import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { CheckHistoryNode } from "../domain/types"
import { ChevronDown, ChevronUp, Clock, History, AlertTriangle } from "lucide-react"

interface CheckHistoryTimelineDialogProps {
  open: boolean
  goodsName: string
  historyList: CheckHistoryNode[]
  onOpenChange: (open: boolean) => void
}

export function CheckHistoryTimelineDialog({
  open,
  goodsName,
  historyList,
  onOpenChange,
}: CheckHistoryTimelineDialogProps) {
  // 展开解除流水项的节点 ID 集合
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] max-h-[85vh] overflow-y-auto font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="p-1 rounded bg-blue-50 text-blue-600">
              <History className="h-4 w-4" />
            </span>
            盘点历史记录时间轴
          </DialogTitle>
          <div className="text-xs text-slate-500">
            货品：<span className="font-medium text-slate-800 dark:text-slate-200">{goodsName}</span>
          </div>
        </DialogHeader>

        {historyList.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            暂无历史复盘记录
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 py-3">
            {historyList.map((node) => {
              const isResolveOpen = expandedNodes[node.id] !== false // 默认展开
              const isQtyMismatch =
                node.countedQty !== "无需盘点" && Number(node.countedQty) !== Number(node.snapshotQty)

              return (
                <div key={node.id} className="relative">
                  {/* 时间轴圆点 */}
                  <div className="absolute -left-[27px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-amber-500 shadow-xs dark:border-slate-900" />

                  {/* 节点卡片 */}
                  <div className="rounded-lg border border-slate-200/90 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900/80 space-y-3">
                    {/* 头部时间与徽标 */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                            node.statusLabel === "异常已处理"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : node.statusLabel === "异常待处理"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {node.statusLabel}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {node.timestamp}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        盘点人员: <span className="font-medium text-slate-700 dark:text-slate-300">{node.actualUser}</span>
                      </span>
                    </div>

                    {/* 指标与数量核验详情网格 */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                      <div>
                        <span className="text-slate-400">货物是否存在：</span>
                        <span
                          className={`font-medium ${
                            node.isExist === "否" ? "text-rose-600 font-semibold" : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {node.isExist}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">货物是否完好：</span>
                        <span
                          className={`font-medium ${
                            node.isIntact === "否" ? "text-rose-600 font-semibold" : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {node.isIntact}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">货物位置一致：</span>
                        <span
                          className={`font-medium ${
                            node.isLocationMatch === "否" ? "text-rose-600 font-semibold" : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {node.isLocationMatch}
                        </span>
                      </div>

                      <div className="sm:col-span-2 flex items-center gap-1.5">
                        <span className="text-slate-400">本次盘点数量：</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {node.countedQty} {node.countedQty !== "无需盘点" ? node.unit : ""}
                        </span>
                        {isQtyMismatch && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                            不一致
                          </span>
                        )}
                        <span className="text-slate-400 text-[11px] ml-2">
                          (基准快照: {node.snapshotQty} {node.unit})
                        </span>
                      </div>

                      {node.remarks && (
                        <div className="col-span-full text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2 rounded">
                          <span className="font-medium text-slate-600 dark:text-slate-400">现场备注：</span>
                          {node.remarks}
                        </div>
                      )}
                    </div>

                    {/* 现场附件照片 */}
                    {node.attachments && node.attachments.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-400">现场物证照片:</span>
                        <div className="flex flex-wrap gap-2">
                          {node.attachments.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="盘点照片"
                              className="h-14 w-14 object-cover rounded border border-slate-200 dark:border-slate-800"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 解除异常流水子表 */}
                    {node.resolveList && node.resolveList.length > 0 && (
                      <div className="mt-2 border-t border-slate-100 pt-2 dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs pb-1.5">
                          <span className="font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            解除异常审计记录 ({node.resolveList.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleExpand(node.id)}
                            className="text-slate-400 hover:text-slate-700 flex items-center gap-0.5 text-[11px] cursor-pointer"
                          >
                            {isResolveOpen ? (
                              <>
                                收起 <ChevronUp className="h-3 w-3" />
                              </>
                            ) : (
                              <>
                                展开 <ChevronDown className="h-3 w-3" />
                              </>
                            )}
                          </button>
                        </div>

                        {isResolveOpen && (
                          <div className="rounded border border-slate-200 overflow-hidden dark:border-slate-800">
                            <table className="w-full text-[11px] text-left">
                              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                <tr>
                                  <th className="px-2.5 py-1.5 w-36">解除异常时间</th>
                                  <th className="px-2.5 py-1.5 w-24">责任人员</th>
                                  <th className="px-2.5 py-1.5">处理说明</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {node.resolveList.map((res) => (
                                  <tr key={res.id}>
                                    <td className="px-2.5 py-1.5 text-slate-500">{res.resolveTime}</td>
                                    <td className="px-2.5 py-1.5 font-medium text-slate-700 dark:text-slate-300">
                                      {res.resolveUser}
                                    </td>
                                    <td className="px-2.5 py-1.5 text-slate-600 dark:text-slate-400">
                                      {res.remark}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

