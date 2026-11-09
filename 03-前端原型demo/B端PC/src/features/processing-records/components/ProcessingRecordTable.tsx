import { useState } from "react"
import { Copy, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  PROCESSING_STATUS_MAP,
  PROCESSING_TYPE_MAP,
} from "../domain/constants"
import type { ProcessingRecord } from "../domain/types"
import { splitDateTime } from "../lib/list-utils"
import { formatQuantity } from "../lib/processing-calculator"
import { TableRowActionPanel, type TableRowActionItem } from "@/shared/components/TableRowActionPanel"

interface ProcessingRecordTableProps {
  records: ProcessingRecord[]
  page: number
  pageSize: number
  onViewDetail: (record: ProcessingRecord) => void
  onComplete: (record: ProcessingRecord) => void
  onVoid: (record: ProcessingRecord) => void
}

export function ProcessingRecordTable({
  records,
  page,
  pageSize,
  onViewDetail,
  onComplete,
  onVoid,
}: ProcessingRecordTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="relative w-full overflow-x-auto rounded-md border border-border/80">
      <Table className="w-full table-fixed text-xs" style={{ minWidth: 2072 }}>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/80">
          <TableRow className="h-10 hover:bg-transparent">
            <TableHead className="sticky left-0 z-10 w-[64px] bg-slate-50 text-center font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              序号
            </TableHead>
            <TableHead className="w-[150px] font-semibold text-slate-700 dark:text-slate-300">
              加工单号
            </TableHead>
            <TableHead className="w-[200px] font-semibold text-slate-700 dark:text-slate-300">
              货主名称/标识
            </TableHead>
            <TableHead className="w-[110px] font-semibold text-slate-700 dark:text-slate-300">
              加工类型
            </TableHead>
            <TableHead className="w-[130px] font-semibold text-slate-700 dark:text-slate-300">
              加工日期
            </TableHead>
            <TableHead className="w-[150px] font-semibold text-slate-700 dark:text-slate-300">
              仓库名称
            </TableHead>
            <TableHead className="w-[140px] font-semibold text-slate-700 dark:text-slate-300">
              关联单号
            </TableHead>
            <TableHead className="w-[160px] font-semibold text-slate-700 dark:text-slate-300">
              计划投入货物
            </TableHead>
            <TableHead className="w-[160px] font-semibold text-slate-700 dark:text-slate-300">
              实际投入货物
            </TableHead>
            <TableHead className="w-[160px] font-semibold text-slate-700 dark:text-slate-300">
              计划产出货物
            </TableHead>
            <TableHead className="w-[160px] font-semibold text-slate-700 dark:text-slate-300">
              实际产出货物
            </TableHead>
            <TableHead className="w-[100px] text-center font-semibold text-slate-700 dark:text-slate-300">
              状态
            </TableHead>
            <TableHead className="w-[170px] font-semibold text-slate-700 dark:text-slate-300">
              制单人
            </TableHead>
            <TableHead className="sticky right-0 z-20 w-[218px] bg-slate-100 text-center font-semibold text-slate-700 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.06)] dark:bg-slate-800 dark:text-slate-300">
              操作
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={14} className="h-40 text-center text-muted-foreground">
                暂无符合条件的加工记录，可调整筛选条件后重试
              </TableCell>
            </TableRow>
          ) : (
            records.map((record, index) => {
              const statusCfg = PROCESSING_STATUS_MAP[record.status]
              const processingTimeParts = splitDateTime(record.processingTime)
              const createTimeParts = splitDateTime(record.createTime)

              // 计算计划投入汇总文本
              const planInputSummaries = record.inputGoodsGroups.map((group) => {
                const groupQty = group.details.reduce(
                  (sum, d) => sum + (Number(d.planAmount) || 0),
                  0
                )
                return `${group.goodsName}：${formatQuantity(groupQty)}${group.unit}`
              })

              // 计算实际消耗汇总文本
              const actualInputSummaries = record.inputGoodsGroups
                .map((group) => {
                  const actualQty = group.details.reduce(
                    (sum, d) => sum + (Number(d.actualAmount) || 0),
                    0
                  )
                  if (actualQty <= 0) return null
                  return `${group.goodsName}：${formatQuantity(actualQty)}${group.unit}`
                })
                .filter(Boolean)

              // 计算预计产出汇总文本
              const expectedOutputSummaries = record.outputGoodsItems.map(
                (item) =>
                  `${item.goodsName}：${formatQuantity(item.expectedQty)}${item.unit}`
              )

              // 计算实际产出汇总文本
              const actualOutputSummaries = record.outputGoodsItems
                .map((item) => {
                  if (typeof item.actualQty !== "number") return null
                  return `${item.goodsName}：${formatQuantity(item.actualQty)}${item.unit}`
                })
                .filter(Boolean)

              return (
                <TableRow
                  key={record.id}
                  className="group h-[72px] hover:bg-blue-50/40 dark:hover:bg-slate-800/50"
                >
                  {/* 1. 序号 */}
                  <TableCell className="sticky left-0 z-10 bg-white text-center font-normal text-muted-foreground group-hover:bg-[#f7faff] dark:bg-slate-900 dark:group-hover:bg-slate-800">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>

                  {/* 2. 加工单号（可折行，带悬停复制） */}
                  <TableCell className="font-normal">
                    <div className="flex items-center gap-1">
                      <span
                        className="cursor-pointer font-medium text-primary hover:underline whitespace-normal break-all"
                        onClick={() => onViewDetail(record)}
                        title={record.id}
                      >
                        {record.id}
                      </span>
                      <button
                        type="button"
                        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800"
                        onClick={(e) => handleCopy(record.id, e)}
                        title="复制加工单号"
                      >
                        {copiedId === record.id ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </TableCell>

                  {/* 3. 货主名称/标识（双行复合） */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <div
                        className="font-normal text-foreground line-clamp-1"
                        title={record.ownerName}
                      >
                        {record.ownerName}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {record.ownerIdentity}
                      </div>
                    </div>
                  </TableCell>

                  {/* 4. 加工类型 */}
                  <TableCell>
                    <span className="inline-flex items-center rounded-sm bg-slate-100 px-1.5 py-0.5 text-[11px] font-normal text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {PROCESSING_TYPE_MAP[record.processingType]}
                    </span>
                  </TableCell>

                  {/* 5. 加工日期（双行：年月日 / 时分秒） */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="text-foreground">{processingTimeParts.date}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {processingTimeParts.time}
                      </div>
                    </div>
                  </TableCell>

                  {/* 6. 仓库名称 */}
                  <TableCell>
                    <span className="line-clamp-2 text-foreground" title={record.warehouseName}>
                      {record.warehouseName}
                    </span>
                  </TableCell>

                  {/* 7. 关联单号 */}
                  <TableCell>
                    {record.associatedOrderId ? (
                      <span
                        className="inline-flex items-center gap-0.5 cursor-pointer text-primary hover:underline whitespace-normal break-all"
                        onClick={() => onViewDetail(record)}
                        title={`关联在押单据：${record.associatedOrderId}`}
                      >
                        {record.associatedOrderId}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* 8. 计划投入货物 */}
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="cursor-default space-y-0.5">
                            <div className="line-clamp-1 font-normal text-foreground">
                              {planInputSummaries[0] || "—"}
                            </div>
                            {planInputSummaries.length > 1 && (
                              <div className="text-[11px] text-muted-foreground">
                                共 {planInputSummaries.length} 种规格投入...
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs space-y-1 text-xs">
                          {planInputSummaries.map((text, idx) => (
                            <div key={idx}>{text}</div>
                          ))}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                  {/* 9. 实际投入货物（未完成/作废展示 --） */}
                  <TableCell>
                    {record.status === "COMPLETED" && actualInputSummaries.length > 0 ? (
                      <div className="space-y-0.5">
                        <div className="line-clamp-1 text-foreground">
                          {actualInputSummaries[0]}
                        </div>
                        {actualInputSummaries.length > 1 && (
                          <div className="text-[11px] text-muted-foreground">
                            等 {actualInputSummaries.length} 项消耗
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* 10. 计划产出货物 */}
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="cursor-default space-y-0.5">
                            <div className="line-clamp-1 text-foreground">
                              {expectedOutputSummaries[0] || "—"}
                            </div>
                            {expectedOutputSummaries.length > 1 && (
                              <div className="text-[11px] text-muted-foreground">
                                共 {expectedOutputSummaries.length} 种产出品类...
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs space-y-1 text-xs">
                          {expectedOutputSummaries.map((text, idx) => (
                            <div key={idx}>{text}</div>
                          ))}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                  {/* 11. 实际产出货物（未完成/作废展示 --） */}
                  <TableCell>
                    {record.status === "COMPLETED" && actualOutputSummaries.length > 0 ? (
                      <div className="space-y-0.5">
                        <div className="line-clamp-1 text-foreground">
                          {actualOutputSummaries[0]}
                        </div>
                        {actualOutputSummaries.length > 1 && (
                          <div className="text-[11px] text-muted-foreground">
                            等 {actualOutputSummaries.length} 项产出
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* 12. 状态徽标 */}
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusCfg.badgeClass}`}
                    >
                      {statusCfg.label}
                    </span>
                  </TableCell>

                  {/* 13. 制单人（双行：姓名[企业] + 制单时间） */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="text-foreground">
                        {record.createByName}
                        {record.createOrgName && (
                          <span className="text-muted-foreground">
                            ({record.createOrgName})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {createTimeParts.date} {createTimeParts.time}
                      </div>
                    </div>
                  </TableCell>

                  {/* 14. 操作列（固定右侧，防文字穿透） */}
                  <TableCell className="sticky right-0 z-10 bg-white text-center shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.06)] group-hover:bg-[#f7faff] dark:bg-slate-900 dark:group-hover:bg-slate-800">
                    <TableRowActionPanel
                      actions={[
                        {
                          key: "detail",
                          label: "详情",
                          onClick: () => onViewDetail(record),
                        },
                        ...(record.status === "PENDING_COMPLETION"
                          ? ([
                              {
                                key: "complete",
                                label: "完成加工",
                                onClick: () => onComplete(record),
                              },
                              {
                                key: "void",
                                label: "作废",
                                tone: "danger",
                                onClick: () => onVoid(record),
                              },
                            ] as TableRowActionItem[])
                          : []),
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
  )
}
