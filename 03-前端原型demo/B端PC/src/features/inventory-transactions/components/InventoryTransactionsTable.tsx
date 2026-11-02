import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowDownLeft, ArrowUpRight, FileText, Copy, Check } from "lucide-react"
import type { InventoryTransactionRecord } from "@/features/shared/mock/inventory-shared-seed"

interface InventoryTransactionsTableProps {
  data: InventoryTransactionRecord[]
  onViewPdf: (record: InventoryTransactionRecord) => void
}

export const InventoryTransactionsTable: React.FC<InventoryTransactionsTableProps> = ({
  data,
  onViewPdf,
}) => {
  const navigate = useNavigate()
  const [copiedNo, setCopiedNo] = useState<string | null>(null)

  const handleCopyNo = (e: React.MouseEvent, no: string) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(no)
    setCopiedNo(no)
    setTimeout(() => setCopiedNo(null), 2000)
  }

  // 单据穿透跳转
  const handleGoOrder = (record: InventoryTransactionRecord) => {
    if (record.direction === "IN") {
      navigate(`/仓储/入库管理/入库记录/详情/${record.orderNo}`)
    } else {
      navigate(`/仓储/出库管理/出库记录/详情/${record.orderNo}`)
    }
  }

  return (
    <div className="relative overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
          <tr className="h-11">
            <th className="px-3 py-2 w-10 text-center">序号</th>
            <th className="px-4 py-2 min-w-[150px]">流水编号</th>
            <th className="px-3 py-2 min-w-[80px] text-center">流向</th>
            <th className="px-3 py-2 min-w-[100px]">细分业务类型</th>
            <th className="px-4 py-2 min-w-[190px]">关联业务单据号</th>
            <th className="px-4 py-2 min-w-[200px]">货品规格名称</th>
            <th className="px-4 py-2 min-w-[110px] text-right">变动数量(吨)</th>
            <th className="px-4 py-2 min-w-[110px] text-right">结存余量(吨)</th>
            <th className="px-4 py-2 min-w-[170px]">实体监管仓</th>
            <th className="px-4 py-2 min-w-[170px]">存货权属货主</th>
            <th className="px-4 py-2 min-w-[110px]">业务日期</th>
            <th className="px-4 py-2 w-[140px] text-center sticky right-0 bg-slate-100 shadow-[-4px_0_8px_rgba(0,0,0,0.05)] z-20">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={12} className="h-32 text-center text-slate-400">
                暂无匹配出入库流水数据
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id}
                className="group h-[72px] hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-3 py-2 text-center text-slate-400">{idx + 1}</td>

                {/* 流水号 */}
                <td className="px-4 py-2 font-mono text-slate-800">
                  {row.transactionNo}
                </td>

                {/* 流向 Tag */}
                <td className="px-3 py-2 text-center">
                  {row.direction === "IN" ? (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ArrowDownLeft className="h-3 w-3" />
                      入库
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      <ArrowUpRight className="h-3 w-3" />
                      出库
                    </span>
                  )}
                </td>

                {/* 细分业务类型 */}
                <td className="px-3 py-2">
                  <span className="inline-block px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700">
                    {row.businessType}
                  </span>
                </td>

                {/* 关联单据号（支持 Deep link 穿透与悬停复制） */}
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleGoOrder(row)}
                      className="font-mono text-primary font-medium hover:underline text-left break-all cursor-pointer"
                      title="点击直接穿透到单据详情"
                    >
                      {row.orderNo}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleCopyNo(e, row.orderNo)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 shrink-0"
                      title="复制单据号"
                    >
                      {copiedNo === row.orderNo ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400">经办：{row.operatorName}</div>
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

                {/* 变动数量 */}
                <td className="px-4 py-2 text-right">
                  <span
                    className={`font-bold ${
                      row.direction === "IN" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {row.direction === "IN"
                      ? `+${row.changeQuantity.toFixed(3)}`
                      : `-${row.changeQuantity.toFixed(3)}`}
                  </span>
                </td>

                {/* 结存数量 */}
                <td className="px-4 py-2 text-right font-medium text-slate-900">
                  {row.balanceQuantity.toFixed(3)}
                </td>

                {/* 仓库 */}
                <td className="px-4 py-2 text-slate-800">
                  {row.warehouseName}
                </td>

                {/* 货主 */}
                <td className="px-4 py-2 text-slate-800">
                  {row.ownerName}
                </td>

                {/* 业务发生日期 */}
                <td className="px-4 py-2 text-slate-600">
                  {row.businessDate}
                </td>

                {/* Sticky 操作列 */}
                <td className="px-4 py-2 text-center sticky right-0 bg-white group-hover:bg-slate-50 transition-colors shadow-[-4px_0_8px_rgba(0,0,0,0.05)] z-10">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleGoOrder(row)}
                      className="text-primary hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>单据详情</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => onViewPdf(row)}
                      className="text-primary hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <FileText className="h-3 w-3" />
                      <span>凭证PDF</span>
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

