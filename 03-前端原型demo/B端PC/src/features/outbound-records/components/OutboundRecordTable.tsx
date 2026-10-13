import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { outboundRecordDetailPath } from "../domain/constants"
import type { OutboundRecord, OutboundRecordRowAction } from "../domain/types"
import {
  formatOutboundQuantity,
  formatGoodsNamesForList,
  splitDateTime,
  splitOrderNoForDisplay,
} from "../lib/list-utils"

const STICKY_ACTION_CLASS =
  "sticky right-0 z-20 border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)] backdrop-blur-md"

interface OutboundRecordTableProps {
  data: OutboundRecord[]
  page: number
  pageSize: number
  onAction: (action: OutboundRecordRowAction, item: OutboundRecord) => void
}

function getTypeBadge(type: OutboundRecord["type"]) {
  switch (type) {
    case "质押出库":
      return (
        <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
          质押出库
        </span>
      )
    case "抵押出库":
      return (
        <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
          抵押出库
        </span>
      )
    case "仓单出库":
      return (
        <span className="inline-flex rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
          仓单出库
        </span>
      )
    case "普通出库":
      return (
        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
          普通出库
        </span>
      )
    case "移库出库":
      return (
        <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
          移库出库
        </span>
      )
    case "转让出库":
      return (
        <span className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-xs font-medium text-cyan-700">
          转让出库
        </span>
      )
    default:
      return (
        <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700">
          {type}
        </span>
      )
  }
}

function OrderNoStack({ head, tail }: { head: string; tail: string }) {
  return (
    <div className="flex flex-col font-mono text-xs leading-tight">
      <span className="font-semibold text-foreground">{head}</span>
      <span className="text-muted-foreground">{tail}</span>
    </div>
  )
}

export function OutboundRecordTable({
  data,
  page,
  pageSize,
  onAction,
}: OutboundRecordTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border bg-card">
      <Table className="min-w-[1240px] table-fixed">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-14 text-center">序号</TableHead>
            <TableHead className="w-[120px]">出库单号</TableHead>
            <TableHead className="w-[140px]">货主名称/标识</TableHead>
            <TableHead className="w-[96px]">出库类型</TableHead>
            <TableHead className="w-[100px]">出库日期</TableHead>
            <TableHead className="w-[100px]">仓库名称</TableHead>
            <TableHead className="w-[110px]">关联单号</TableHead>
            <TableHead className="w-[140px]">货物名称</TableHead>
            <TableHead className="w-[84px] text-right">出库数量</TableHead>
            <TableHead className="w-[130px]">制单人</TableHead>
            <TableHead
              className={cn(
                "w-[236px] text-center",
                STICKY_ACTION_CLASS,
                "bg-slate-100/95 dark:bg-slate-800/95 font-semibold text-foreground/90"
              )}
            >
              操作
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={11}
                className="h-32 text-center text-muted-foreground"
              >
                暂无匹配的出库记录
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const outboundParts = splitDateTime(row.outboundTime)
              const createdParts = splitDateTime(row.createTime)
              const orderNoParts = splitOrderNoForDisplay(row.orderNo)
              const relatedParts =
                row.relatedNo != null && row.relatedNo !== "—"
                  ? splitOrderNoForDisplay(row.relatedNo)
                  : null

              const goodsSummary =
                row.goodsSummary ||
                formatGoodsNamesForList(row.goodsList.map((g) => g.goodsName))

              return (
                <TableRow
                  key={row.id}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="text-center text-muted-foreground">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>
                    <OrderNoStack
                      head={orderNoParts.head}
                      tail={orderNoParts.tail}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-xs leading-snug">
                      <span className="line-clamp-2 font-medium text-foreground">
                        {row.ownerName}
                      </span>
                      <span className="font-mono text-muted-foreground">
                        {row.ownerIdentifier}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(row.type)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs leading-tight">
                      <span className="font-medium text-foreground">
                        {outboundParts.date}
                      </span>
                      <span className="font-mono text-muted-foreground text-[11px]">
                        {outboundParts.time}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="truncate text-xs font-medium text-foreground">
                      {row.warehouseName}
                    </span>
                  </TableCell>
                  <TableCell>
                    {relatedParts ? (
                      <OrderNoStack
                        head={relatedParts.head}
                        tail={relatedParts.tail}
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.goodsList.length > 1 ? (
                      <Tooltip>
                        <TooltipTrigger
                          render={<span />}
                          className="cursor-help line-clamp-2 text-xs font-medium text-foreground underline decoration-dotted underline-offset-2"
                        >
                          {goodsSummary}
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-sm text-xs">
                          <p className="font-semibold pb-1 border-b border-border/50 mb-1">
                            货品清单（共 {row.goodsList.length} 种）：
                          </p>
                          <ul className="space-y-1">
                            {row.goodsList.map((g) => (
                              <li
                                key={g.id}
                                className="flex justify-between gap-2"
                              >
                                <span>{g.goodsName}</span>
                                <span className="font-mono font-semibold">
                                  {g.totalOutboundAmount} {g.unit}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <span className="line-clamp-2 text-xs font-medium text-foreground">
                        {goodsSummary}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold text-foreground">
                    {formatOutboundQuantity(row.totalAmount, row.amountUnit)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-xs leading-tight">
                      <span className="font-medium text-foreground">
                        {row.createdByName}
                      </span>
                      <span className="font-mono text-muted-foreground text-[11px]">
                        {createdParts.date}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-center",
                      STICKY_ACTION_CLASS,
                      "bg-background/95 group-hover:bg-slate-50/95 dark:group-hover:bg-slate-900/95 transition-colors"
                    )}
                  >
                    <div className="flex items-center justify-center gap-1.5 flex-nowrap">
                      <Link
                        to={outboundRecordDetailPath(row.id)}
                        className="text-primary hover:underline font-medium text-xs"
                      >
                        查看详情
                      </Link>
                      <span className="text-border">|</span>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-primary font-medium"
                        onClick={() => onAction("downloadPdf", row)}
                      >
                        单据下载
                      </Button>
                      <span className="text-border">|</span>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-primary font-medium"
                        onClick={() => onAction("downloadExcel", row)}
                      >
                        下载记录
                      </Button>
                    </div>
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
