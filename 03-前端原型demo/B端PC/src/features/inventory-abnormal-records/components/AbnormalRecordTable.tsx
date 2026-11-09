import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TableRowActionPanel } from "@/shared/components/TableRowActionPanel"
import type { AbnormalRecord, AbnormalOrderTypeLabel, AbnormalGoodsLine } from "../domain/types"

interface AbnormalRecordTableProps {
  records: AbnormalRecord[]
  onViewDetail: (record: AbnormalRecord) => void
}

function OrderTypeBadge({ type }: { type: AbnormalOrderTypeLabel }) {
  switch (type) {
    case "质押单":
      return (
        <Badge
          variant="outline"
          className="border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 font-normal text-xs"
        >
          质押单
        </Badge>
      )
    case "抵押单":
      return (
        <Badge
          variant="outline"
          className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300 font-normal text-xs"
        >
          抵押单
        </Badge>
      )
    case "监管业务单":
      return (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 font-normal text-xs"
        >
          监管业务单
        </Badge>
      )
    case "存货单":
    default:
      return (
        <Badge
          variant="outline"
          className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 font-normal text-xs"
        >
          存货单
        </Badge>
      )
  }
}

function CopyableDocNo({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="group/copy flex items-center gap-1">
      <span className="break-all font-medium text-primary select-all line-clamp-2">
        {value}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="opacity-0 group-hover/copy:opacity-100 transition-opacity p-0.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        title="复制单号"
      >
        {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
      </button>
    </div>
  )
}

function DiffQuantityDisplay({ line }: { line: AbnormalGoodsLine }) {
  const isIncrease = line.diffQty > 0
  const isDecrease = line.diffQty < 0

  return (
    <div className="flex flex-col items-end gap-0.5 text-xs tabular-nums">
      <span className="font-medium text-slate-800 dark:text-slate-200">
        {line.afterQty.toLocaleString("zh-CN", { maximumFractionDigits: 3 })}
        {line.unit}
      </span>
      {isIncrease && (
        <span className="text-rose-600 dark:text-rose-400">
          ↑ +{line.diffQty.toLocaleString("zh-CN", { maximumFractionDigits: 3 })}
          {line.unit}
        </span>
      )}
      {isDecrease && (
        <span className="text-emerald-600 dark:text-emerald-400">
          ↓ {line.diffQty.toLocaleString("zh-CN", { maximumFractionDigits: 3 })}
          {line.unit}
        </span>
      )}
    </div>
  )
}

export function AbnormalRecordTable({ records, onViewDetail }: AbnormalRecordTableProps) {
  return (
    <div className="relative overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-100 text-slate-700 font-medium border-b border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
          <tr>
            <th className="sticky left-0 z-10 w-[64px] min-w-[64px] bg-slate-100 px-3 py-3 text-center">序号</th>
            <th className="px-3 py-3 min-w-[170px]">异动单号</th>
            <th className="px-3 py-3 min-w-[170px]">关联单据</th>
            <th className="px-3 py-3 min-w-[100px]">单据类型</th>
            <th className="px-3 py-3 min-w-[150px]">货主</th>
            <th className="px-3 py-3 min-w-[200px]">货物</th>
            <th className="px-3 py-3 min-w-[220px]">存放位置</th>
            <th className="px-3 py-3 min-w-[90px]">异动类型</th>
            <th className="px-3 py-3 min-w-[170px] text-right">异动后数量</th>
            <th className="px-3 py-3 min-w-[140px]">申请人</th>
            <th className="px-3 py-3 min-w-[140px]">申请时间</th>
            <th className="sticky right-0 z-20 px-3 py-3 min-w-[90px] text-center bg-slate-100 dark:bg-slate-800 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)]">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {records.length === 0 ? (
            <tr>
              <td colSpan={12} className="h-48 text-center text-slate-400 dark:text-slate-500">
                暂无符合条件的异动记录，可调整筛选条件后重试
              </td>
            </tr>
          ) : (
            records.map((item, index) => {
              return (
                <tr
                  key={item.id}
                  className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors h-[72px]"
                >
                  {/* 序号 */}
                  <td className="sticky left-0 z-10 w-[64px] min-w-[64px] bg-white px-3 py-2 text-center text-slate-400 font-normal group-hover:bg-slate-50">
                    {index + 1}
                  </td>

                  {/* 异动单号 */}
                  <td className="px-3 py-2">
                    <CopyableDocNo value={item.id} />
                  </td>

                  {/* 关联单据 */}
                  <td className="px-3 py-2">
                    <CopyableDocNo value={item.relateId} />
                  </td>

                  {/* 单据类型 */}
                  <td className="px-3 py-2">
                    <OrderTypeBadge type={item.relateOrderType} />
                  </td>

                  {/* 货主 */}
                  <td className="px-3 py-2">
                    <div className="font-medium text-slate-800 dark:text-slate-200 leading-tight">
                      {item.owner.ownerName}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {item.owner.ownerIdentity}
                    </div>
                  </td>

                  {/* 货物（支持多货物换行） */}
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-1 max-h-[64px] overflow-y-auto">
                      {item.goodsLines.map((g) => (
                        <div key={g.id} className="text-slate-700 dark:text-slate-300 line-clamp-1" title={g.goodsName}>
                          {g.goodsName}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* 存放位置（支持多货物换行对应） */}
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-1 max-h-[64px] overflow-y-auto">
                      {item.goodsLines.map((g) => (
                        <div key={g.id} className="text-slate-500 dark:text-slate-400 line-clamp-1" title={g.location}>
                          {g.location}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* 异动类型 */}
                  <td className="px-3 py-2">
                    <div className="flex flex-col gap-1">
                      {item.goodsLines.map((g) => (
                        <div key={g.id} className="text-slate-700 dark:text-slate-300 font-medium">
                          {g.abnormalType}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* 异动后数量（红升绿降；一格多货品时格内滚动，行高仍为 72px） */}
                  <td className="h-[72px] px-3 py-1 align-middle text-right">
                    <div className="flex max-h-[56px] flex-col gap-0.5 overflow-y-auto">
                      {item.goodsLines.map((g) => (
                        <DiffQuantityDisplay key={g.id} line={g} />
                      ))}
                    </div>
                  </td>

                  {/* 申请人 */}
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-400">
                    {item.applicantName}
                  </td>

                  {/* 申请时间 */}
                  <td className="px-3 py-2 text-slate-500">
                    <div className="flex flex-col gap-0.5 leading-snug whitespace-nowrap">
                      <span>{item.applyTime.split(" ")[0]}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {item.applyTime.split(" ")[1] ?? ""}
                      </span>
                    </div>
                  </td>

                  {/* 操作列（Sticky 实色投影防穿透） */}
                  <td className="sticky right-0 z-10 px-3 py-2 text-center bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)]">
                    <TableRowActionPanel
                      actions={[
                        {
                          key: "detail",
                          label: "详情",
                          onClick: () => onViewDetail(item),
                        },
                      ]}
                    />
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

