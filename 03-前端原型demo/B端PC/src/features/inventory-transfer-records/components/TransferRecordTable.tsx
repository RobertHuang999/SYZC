import { useState } from "react"
import { Copy, Check } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { TransferRecord, TransferRecordRowAction } from "../domain/types"
import { TableRowActionPanel } from "@/shared/components/TableRowActionPanel"

interface TransferRecordTableProps {
  data: TransferRecord[]
  page: number
  pageSize: number
  onAction: (action: TransferRecordRowAction, item: TransferRecord) => void
}

export function TransferRecordTable({
  data,
  page,
  pageSize,
  onAction,
}: TransferRecordTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    setTimeout(() => setCopiedId(null), 1800)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
      <div className="overflow-x-auto">
        <Table className="w-full min-w-[1380px] table-fixed">
          {/* 10 列严格列宽控制（对齐转让记录线框与出库管理标杆） */}
          <colgroup>
            <col style={{ width: "64px" }} />
            <col style={{ width: "190px" }} />
            <col style={{ width: "210px" }} />
            <col style={{ width: "130px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "200px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "200px" }} />
            <col style={{ width: "190px" }} />
            <col style={{ width: "96px" }} />
          </colgroup>

          <TableHeader>
            <TableRow className="h-11 border-b border-slate-200/80 bg-slate-50/80 text-[13px] font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
              <TableHead className="sticky left-0 z-10 bg-slate-50 text-center">序号</TableHead>
              <TableHead>转让单号</TableHead>
              <TableHead>转让人(货主名称)</TableHead>
              <TableHead>转让时间</TableHead>
              <TableHead className="text-right">转让数量</TableHead>
              <TableHead>接收人</TableHead>
              <TableHead>仓库名称</TableHead>
              <TableHead>货物名称</TableHead>
              <TableHead>制单人</TableHead>
              <TableHead className="sticky right-0 z-20 bg-slate-100 text-center shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.08)] dark:bg-slate-800 font-semibold">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-36 text-center text-sm text-slate-400 dark:text-slate-500"
                >
                  暂无符合条件的转让记录，可调整筛选条件后重试
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const serialNumber = (page - 1) * pageSize + index + 1
                const [assignDate, assignTimePart] = row.assignTime.split(" ")

                return (
                  <TableRow
                    key={row.id}
                    className="group h-[72px] border-b border-slate-100 text-[13px] transition-colors hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/50"
                  >
                    {/* 1. 序号 */}
                    <TableCell className="sticky left-0 z-10 bg-white text-center text-slate-500 font-normal group-hover:bg-slate-50">
                      {serialNumber}
                    </TableCell>

                    {/* 2. 转让单号（支持查看详情与悬停复制） */}
                    <TableCell className="font-normal text-slate-800 dark:text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="cursor-pointer whitespace-normal text-primary hover:underline transition-colors font-medium break-all line-clamp-2"
                          onClick={() => onAction("viewDetail", row)}
                          title="点击查看转让单详情"
                        >
                          {row.id}
                        </span>
                        <Tooltip>
                          <TooltipTrigger
                            onClick={(e) => copyToClipboard(row.id, e)}
                            className="text-slate-400 opacity-60 hover:opacity-100 transition-opacity shrink-0"
                            title="复制转让单号"
                          >
                            {copiedId === row.id ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            {copiedId === row.id ? "已复制单号" : "复制单号"}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>

                    {/* 3. 转让人(货主名称)（双行：名称 + 括号脱敏标识） */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span
                          className="font-medium text-slate-900 dark:text-slate-100 truncate"
                          title={row.sourceOwner.ownerName}
                        >
                          {row.sourceOwner.ownerName}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          ({row.sourceOwner.ownerIdentity})
                        </span>
                      </div>
                    </TableCell>

                    {/* 4. 转让时间（双行，左对齐） */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5 text-slate-600 dark:text-slate-300">
                        <span>{assignDate}</span>
                        <span className="text-[11px] text-slate-400">{assignTimePart}</span>
                      </div>
                    </TableCell>

                    {/* 5. 转让数量（数值 + 单位，右对齐） */}
                    <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100">
                      {row.amount} {row.unit}
                    </TableCell>

                    {/* 6. 接收人（双行：受让新货主名称 + 括号脱敏标识） */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span
                          className="font-medium text-slate-900 dark:text-slate-100 truncate"
                          title={row.targetOwner.ownerName}
                        >
                          {row.targetOwner.ownerName}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          ({row.targetOwner.ownerIdentity})
                        </span>
                      </div>
                    </TableCell>

                    {/* 7. 仓库名称 */}
                    <TableCell className="text-slate-700 dark:text-slate-300">
                      {row.warehouseName}
                    </TableCell>

                    {/* 8. 货物名称（支持超出 2 行更多 Popover 浮层） */}
                    <TableCell>
                      {row.goodsDisplayList && row.goodsDisplayList.length > 2 ? (
                        <div>
                          <div className="space-y-0.5">
                            {row.goodsDisplayList.slice(0, 2).map((g, i) => (
                              <div key={i} className="truncate text-slate-700 dark:text-slate-300">
                                {g.name}-{g.amount}{g.unit}
                              </div>
                            ))}
                          </div>
                          <Popover>
                            <PopoverTrigger className="text-xs text-primary hover:underline mt-0.5 cursor-pointer flex items-center gap-0.5 font-medium">
                              更多...
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-3 text-xs space-y-1.5 shadow-md">
                              <div className="font-semibold text-slate-800 dark:text-slate-100 border-b pb-1">
                                全部货物明细（共 {row.goodsDisplayList.length} 项）
                              </div>
                              <div className="max-h-48 overflow-y-auto space-y-1 pt-1">
                                {row.goodsDisplayList.map((g, i) => (
                                  <div key={i} className="text-slate-600 dark:text-slate-300">
                                    {i + 1}. {g.name} - {g.amount}{g.unit}
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      ) : (
                        <div className="space-y-0.5 text-slate-700 dark:text-slate-300">
                          {row.goodsDisplayList && row.goodsDisplayList.length > 0 ? (
                            row.goodsDisplayList.map((g, i) => (
                              <div key={i} className="truncate">
                                {g.name}-{g.amount}{g.unit}
                              </div>
                            ))
                          ) : (
                            <div className="truncate">{row.goodsSummaryText}</div>
                          )}
                        </div>
                      )}
                    </TableCell>

                    {/* 9. 制单人（双行：账号机构 + 时间） */}
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span
                          className="text-slate-800 dark:text-slate-200 truncate"
                          title={`${row.createByName}(${row.createOrgName})`}
                        >
                          {row.createByName}({row.createOrgName})
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {row.createTime}
                        </span>
                      </div>
                    </TableCell>

                    {/* 10. 操作（固定右侧，仅提供【查看详情】，对齐三件套规范与老系统） */}
                    <TableCell className="sticky right-0 z-20 bg-white group-hover:bg-slate-50 text-center shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.08)] dark:bg-slate-900 dark:group-hover:bg-slate-800 transition-colors">
                      <TableRowActionPanel
                        actions={[
                          {
                            key: "detail",
                            label: "详情",
                            onClick: () => onAction("viewDetail", row),
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
