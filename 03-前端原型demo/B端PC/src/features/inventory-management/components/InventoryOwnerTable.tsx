import React from "react"
import { useNavigate } from "react-router-dom"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { OwnerRowData } from "../mock/inventory-management.mock"

interface InventoryOwnerTableProps {
  data: OwnerRowData[]
}

export const InventoryOwnerTable: React.FC<InventoryOwnerTableProps> = ({ data }) => {
  const navigate = useNavigate()

  const handleGoDistribution = (row: OwnerRowData) => {
    navigate(
      `/仓储/库存查询/库存明细?owner=${encodeURIComponent(row.ownerName)}`
    )
  }

  const handleGoTransaction = (row: OwnerRowData) => {
    navigate(
      `/仓储/库存查询/库存流水?owner=${encodeURIComponent(row.ownerName)}`
    )
  }

  return (
    <div className="relative overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-[#fcfdfe] text-slate-500 font-normal border-b border-slate-200">
          <tr className="h-10 text-[11px]">
            <th className="px-3 py-2 w-12 text-center font-normal">序号</th>
            <th className="px-4 py-2 min-w-[170px] font-normal">货主</th>
            <th className="px-4 py-2 min-w-[190px] font-normal">货主标识</th>
            <th className="px-4 py-2 min-w-[140px] font-normal">联系方式</th>
            <th className="px-3 py-2 min-w-[110px] text-right font-normal">
              <div className="inline-flex items-center gap-1">
                <span>库存总数</span>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-3 w-3 text-slate-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 text-white text-xs">
                    库存总数 = 可用数量 + 冻结数量
                  </TooltipContent>
                </Tooltip>
              </div>
            </th>
            <th className="px-3 py-2 min-w-[130px] text-right font-normal">总价(万)</th>
            <th className="px-3 py-2 min-w-[110px] text-right font-normal">可用数量</th>
            <th className="px-3 py-2 min-w-[130px] text-right font-normal">总价(万)</th>
            <th className="px-3 py-2 min-w-[90px] text-right font-normal">冻结数量</th>
            <th className="px-3 py-2 min-w-[100px] text-right font-normal">总价(万)</th>
            <th className="px-3 py-2 min-w-[100px] text-right font-normal">本期入库总量</th>
            <th className="px-3 py-2 min-w-[100px] text-right font-normal">本期出库总量</th>
            <th className="px-4 py-2 w-[160px] min-w-[160px] text-center font-normal sticky right-0 bg-[#fcfdfe] shadow-[-4px_0_8px_rgba(0,0,0,0.03)] z-20 whitespace-nowrap">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {data.length === 0 ? (
            <tr>
              <td colSpan={13} className="h-32 text-center text-slate-400">
                暂无匹配货主存货数据
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={row.id}
                className="group h-[72px] hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-3 py-2 text-center text-slate-400">{idx + 1}</td>

                {/* 货主 */}
                <td className="px-4 py-2 text-slate-900">
                  <span className="font-normal">{row.ownerName}</span>
                </td>

                {/* 货主标识 */}
                <td className="px-4 py-2 text-slate-700 font-mono">
                  {row.ownerCode}
                </td>

                {/* 联系方式 */}
                <td className="px-4 py-2 text-slate-700 font-mono">
                  {row.contact}
                </td>

                {/* 库存总数 */}
                <td className="px-3 py-2 text-right font-normal text-slate-800">
                  {row.totalQty}
                </td>

                {/* 总价(万) */}
                <td className="px-3 py-2 text-right text-slate-800">
                  {row.totalVal}
                </td>

                {/* 可用数量 */}
                <td className="px-3 py-2 text-right text-slate-800">
                  {row.availQty}
                </td>

                {/* 总价(万) */}
                <td className="px-3 py-2 text-right text-slate-800">
                  {row.availVal}
                </td>

                {/* 冻结数量 */}
                <td className="px-3 py-2 text-right text-slate-800">
                  {row.frozenQty}
                </td>

                {/* 总价(万) */}
                <td className="px-3 py-2 text-right text-slate-500">
                  {row.frozenVal}
                </td>

                {/* 本期入库总量 */}
                <td className="px-3 py-2 text-right text-slate-600">
                  {row.periodInQty}
                </td>

                {/* 本期出库总量 */}
                <td className="px-3 py-2 text-right text-slate-600">
                  {row.periodOutQty}
                </td>

                {/* 操作列（严格横排，橙色文字链接） */}
                <td className="px-4 py-2 text-center sticky right-0 bg-white group-hover:bg-slate-50 transition-colors shadow-[-4px_0_8px_rgba(0,0,0,0.03)] z-10 w-[160px] min-w-[160px] whitespace-nowrap">
                  <div className="flex items-center justify-center gap-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleGoDistribution(row)}
                      className="text-[#e6a23c] hover:text-[#d48e24] hover:underline font-normal text-xs whitespace-nowrap cursor-pointer transition-colors"
                    >
                      库存分布
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGoTransaction(row)}
                      className="text-[#e6a23c] hover:text-[#d48e24] hover:underline font-normal text-xs whitespace-nowrap cursor-pointer transition-colors"
                    >
                      库存流水
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
