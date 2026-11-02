import React, { useState } from "react"
import { ChevronRight, ChevronDown, QrCode, Building, Layers, MapPin, Copy, Check } from "lucide-react"
import type { TallyStackingMainItem } from "@/features/shared/mock/inventory-shared-seed"

interface TallyStackingTableProps {
  data: TallyStackingMainItem[]
  onViewQr: (item: TallyStackingMainItem) => void
}

export const TallyStackingTable: React.FC<TallyStackingTableProps> = ({
  data,
  onViewQr,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(data.map((d) => d.id)) // 默认全展开方便查阅
  )
  const [copiedNo, setCopiedNo] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    const next = new Set(expandedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setExpandedIds(next)
  }

  const handleCopyNo = (e: React.MouseEvent, no: string) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(no)
    setCopiedNo(no)
    setTimeout(() => setCopiedNo(null), 2000)
  }

  return (
    <div className="relative overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
          <tr className="h-11">
            <th className="px-3 py-2 w-10 text-center">展开</th>
            <th className="px-4 py-2 min-w-[190px]">源头入库单号</th>
            <th className="px-4 py-2 min-w-[210px]">货品全称与规格</th>
            <th className="px-4 py-2 min-w-[180px]">实体监管仓库</th>
            <th className="px-4 py-2 min-w-[180px]">存货权属货主</th>
            <th className="px-4 py-2 min-w-[120px] text-right">批次入库(吨)</th>
            <th className="px-4 py-2 min-w-[120px] text-right font-medium text-emerald-600">
              当前可用(吨)
            </th>
            <th className="px-4 py-2 min-w-[120px] text-right font-medium text-amber-600">
              流转冻结(吨)
            </th>
            <th className="px-4 py-2 min-w-[140px]">入库时间</th>
            <th className="px-4 py-2 w-[130px] text-center sticky right-0 bg-slate-100 shadow-[-4px_0_8px_rgba(0,0,0,0.05)] z-20">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={10} className="h-32 text-center text-slate-400">
                暂无匹配理货堆放数据
              </td>
            </tr>
          ) : (
            data.map((mainItem) => {
              const isExpanded = expandedIds.has(mainItem.id)

              return (
                <React.Fragment key={mainItem.id}>
                  {/* 主码行 */}
                  <tr className="group h-[72px] hover:bg-slate-50/80 transition-colors bg-white font-medium">
                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => toggleExpand(mainItem.id)}
                        className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                        title={isExpanded ? "收起明细货位" : "展开明细货位"}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    {/* 入库单号完整展示 */}
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-900 break-all">
                          {mainItem.inboundOrderNo}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyNo(e, mainItem.inboundOrderNo)}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                          title="复制单号"
                        >
                          {copiedNo === mainItem.inboundOrderNo ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        主码：{mainItem.mainCode}
                      </div>
                    </td>

                    {/* 货品规格 */}
                    <td className="px-4 py-2">
                      <div className="text-slate-900 font-semibold leading-snug">
                        {mainItem.specification}
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        {mainItem.category} / {mainItem.variety}
                      </div>
                    </td>

                    {/* 仓库 */}
                    <td className="px-4 py-2 text-slate-800">
                      <div className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{mainItem.warehouseName}</span>
                      </div>
                    </td>

                    {/* 货主 */}
                    <td className="px-4 py-2 text-slate-800">
                      <div>{mainItem.ownerName}</div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {mainItem.ownerIdentifierMasked}
                      </div>
                    </td>

                    {/* 数量指标 */}
                    <td className="px-4 py-2 text-right font-medium text-slate-800">
                      {mainItem.initialQuantity.toFixed(3)}
                    </td>

                    <td className="px-4 py-2 text-right font-medium text-emerald-600">
                      {mainItem.availableQuantity.toFixed(3)}
                    </td>

                    <td className="px-4 py-2 text-right font-medium text-amber-600">
                      {mainItem.frozenQuantity.toFixed(3)}
                    </td>

                    <td className="px-4 py-2 text-slate-600 text-[11px]">
                      {mainItem.inboundDate}
                    </td>

                    {/* Sticky 操作列（无去盘点、无详情页） */}
                    <td className="px-4 py-2 text-center sticky right-0 bg-white group-hover:bg-slate-50 transition-colors shadow-[-4px_0_8px_rgba(0,0,0,0.05)] z-10">
                      <button
                        type="button"
                        onClick={() => onViewQr(mainItem)}
                        className="text-primary hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        <span>查看二维码</span>
                      </button>
                    </td>
                  </tr>

                  {/* 展开的子码货位明细 */}
                  {isExpanded && (
                    <tr className="bg-slate-50/60 border-t border-b border-slate-200">
                      <td colSpan={10} className="p-3 pl-12 pr-6">
                        <div className="rounded-md border border-slate-200 bg-white shadow-xs overflow-hidden">
                          <div className="bg-slate-100/70 px-3 py-1.5 text-xs font-semibold text-slate-600 flex items-center gap-1.5 border-b border-slate-200">
                            <Layers className="h-3.5 w-3.5 text-slate-500" />
                            <span>物理货位堆放子码明细（共 {mainItem.subItems.length} 个垛位）</span>
                          </div>

                          <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-slate-50 text-slate-500 text-[11px] border-b border-slate-100">
                              <tr className="h-8">
                                <th className="px-3 py-1 min-w-[150px]">货位存货条码 (子码)</th>
                                <th className="px-3 py-1 min-w-[220px]">物理空间落位 (库房/分区/垛位)</th>
                                <th className="px-3 py-1 min-w-[100px] text-right">期初堆放(吨)</th>
                                <th className="px-3 py-1 min-w-[100px] text-right font-medium text-emerald-600">当前可用(吨)</th>
                                <th className="px-3 py-1 min-w-[100px] text-right font-medium text-amber-600">审批冻结(吨)</th>
                                <th className="px-3 py-1 min-w-[140px]">状态说明</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {mainItem.subItems.map((sub) => (
                                <tr key={sub.subId} className="h-9 hover:bg-slate-50/80">
                                  <td className="px-3 py-1 font-mono text-slate-700">
                                    {sub.subCode}
                                  </td>

                                  <td className="px-3 py-1">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                      {sub.isVirtual ? (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] bg-amber-50 text-amber-700 font-medium">
                                          未指定库房/虚拟未分配垛位 (兜底)
                                        </span>
                                      ) : (
                                        <span className="text-slate-800">
                                          {sub.houseName} · {sub.partitionName} · <strong className="text-slate-900">{sub.locationCode}</strong>
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  <td className="px-3 py-1 text-right text-slate-700">
                                    {sub.initialQuantity.toFixed(3)}
                                  </td>

                                  <td className="px-3 py-1 text-right text-emerald-600 font-medium">
                                    {sub.availableQuantity.toFixed(3)}
                                  </td>

                                  <td className="px-3 py-1 text-right text-amber-600 font-medium">
                                    {sub.frozenQuantity.toFixed(3)}
                                  </td>

                                  <td className="px-3 py-1 text-slate-500 text-[11px]">
                                    {sub.statusText}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

