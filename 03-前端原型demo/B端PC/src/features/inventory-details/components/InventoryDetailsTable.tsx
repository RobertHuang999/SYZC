import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { QrCode, ArrowUpRight, Copy, Check, MapPin, Building, Lock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { InventoryDetailRecord } from "@/features/shared/mock/inventory-shared-seed"

interface InventoryDetailsTableProps {
  data: InventoryDetailRecord[]
  onViewQr: (item: InventoryDetailRecord) => void
}

export const InventoryDetailsTable: React.FC<InventoryDetailsTableProps> = ({
  data,
  onViewQr,
}) => {
  const navigate = useNavigate()
  const [copiedBarcode, setCopiedBarcode] = useState<string | null>(null)

  const handleCopyBarcode = (e: React.MouseEvent, barcode: string) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(barcode)
    setCopiedBarcode(barcode)
    setTimeout(() => setCopiedBarcode(null), 2000)
  }

  const handleGoDetail = (id: string) => {
    navigate(`/仓储/库存查询/库存明细/详情/${id}`)
  }

  return (
    <div className="relative overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
          <tr className="h-11">
            <th className="px-3 py-2 w-10 text-center">序号</th>
            <th className="px-4 py-2 min-w-[170px]">存货条码编号</th>
            <th className="px-4 py-2 min-w-[210px]">货品全称与规格</th>
            <th className="px-4 py-2 min-w-[220px]">四级空间物理落位</th>
            <th className="px-4 py-2 min-w-[180px]">存货权属货主</th>
            <th className="px-4 py-2 min-w-[110px] text-right">期初堆放(吨)</th>
            <th className="px-4 py-2 min-w-[110px] text-right font-medium text-emerald-600">
              当前可用(吨)
            </th>
            <th className="px-4 py-2 min-w-[110px] text-right font-medium text-amber-600">
              审批冻结(吨)
            </th>
            <th className="px-4 py-2 min-w-[90px] text-center">状态</th>
            <th className="px-4 py-2 min-w-[130px]">入库时间</th>
            <th className="px-4 py-2 w-[140px] text-center sticky right-0 bg-slate-100 shadow-[-4px_0_8px_rgba(0,0,0,0.05)] z-20">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={11} className="h-32 text-center text-slate-400">
                暂无匹配货位明细数据
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id}
                className="group h-[72px] hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-3 py-2 text-center text-slate-400">{idx + 1}</td>

                {/* 存货条码完整展示 */}
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-medium text-slate-900 break-all">
                      {row.barcode}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleCopyBarcode(e, row.barcode)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                      title="复制存货条码"
                    >
                      {copiedBarcode === row.barcode ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  {row.rfidTag && (
                    <div className="text-[11px] font-mono text-slate-400">
                      RFID: {row.rfidTag}
                    </div>
                  )}
                </td>

                {/* 货品全称 */}
                <td className="px-4 py-2">
                  <div className="font-semibold text-slate-900 leading-snug">
                    {row.specification}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {row.category} / {row.variety}
                  </div>
                </td>

                {/* 四级空间落位 */}
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1 text-slate-900 font-medium">
                    <Building className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{row.warehouseName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-0.5">
                    <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                    {row.isVirtual ? (
                      <span className="text-amber-600 bg-amber-50 px-1 rounded">
                        虚拟未分配垛位 (兜底)
                      </span>
                    ) : (
                      <span>
                        {row.houseName} · {row.partitionName} ·{" "}
                        <strong className="text-slate-900">{row.locationCode}</strong>
                      </span>
                    )}
                  </div>
                </td>

                {/* 权属货主 */}
                <td className="px-4 py-2">
                  <div className="text-slate-800 font-medium">{row.ownerName}</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {row.ownerIdentifierMasked}
                  </div>
                </td>

                {/* 数量 */}
                <td className="px-4 py-2 text-right font-medium text-slate-800">
                  {row.initialQuantity.toFixed(3)}
                </td>

                <td className="px-4 py-2 text-right font-medium text-emerald-600">
                  {row.availableQuantity.toFixed(3)}
                </td>

                <td className="px-4 py-2 text-right font-medium text-amber-600">
                  {row.frozenQuantity > 0 ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="inline-flex items-center gap-1 cursor-help border-b border-dashed border-amber-400">
                          <Lock className="h-3 w-3 text-amber-500" />
                          <span>{row.frozenQuantity.toFixed(3)}</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 text-white text-xs max-w-xs">
                        冻结原因：{row.freezeReason || "单据审批流转占用"}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span>0.000</span>
                  )}
                </td>

                {/* 状态 Badge */}
                <td className="px-4 py-2 text-center">
                  {row.status === "NORMAL" && (
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                      正常在库
                    </span>
                  )}
                  {row.status === "FROZEN" && (
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-amber-50 text-amber-700 font-medium border border-amber-200">
                      审批冻结中
                    </span>
                  )}
                  {row.status === "EMPTY" && (
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-500 font-medium">
                      已出库
                    </span>
                  )}
                </td>

                <td className="px-4 py-2 text-slate-600 text-[11px]">
                  {row.inboundDate}
                </td>

                {/* 操作列 Sticky */}
                <td className="px-4 py-2 text-center sticky right-0 bg-white group-hover:bg-slate-50 transition-colors shadow-[-4px_0_8px_rgba(0,0,0,0.05)] z-10">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewQr(row)}
                      className="text-primary hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <QrCode className="h-3 w-3" />
                      <span>二维码</span>
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => handleGoDetail(row.id)}
                      className="text-primary hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>详情</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

