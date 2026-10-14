import { useState } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
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
import { TableDateTimeCell } from "@/shared/components/TableCells"
import { outboundRecordDetailPath } from "../domain/constants"
import type { OutboundRecord, OutboundRecordRowAction } from "../domain/types"
import {
  formatOutboundQuantity,
  formatGoodsNamesForList,
  splitDateTime,
} from "../lib/list-utils"

const STICKY_ACTION_CLASS =
  "sticky right-0 z-20 border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)]"

/** 与入库记录列表一致：px 列宽 + min-w + 窄屏横滑，避免百分比挤压畸变 */
const COL = {
  index: "w-12 min-w-12",
  orderNo: "w-[148px] min-w-[148px]",
  owner: "w-[136px] min-w-[136px]",
  type: "w-[92px] min-w-[92px]",
  outboundDate: "w-[104px] min-w-[104px]",
  warehouse: "w-[100px] min-w-[100px]",
  related: "hidden xl:table-cell w-[136px] min-w-[136px]",
  goods: "w-[152px] min-w-[152px]",
  quantity: "w-[88px] min-w-[88px]",
  creator: "w-[128px] min-w-[128px]",
  actions: "w-[228px] min-w-[228px]",
} as const

const cellBase = "whitespace-normal align-middle px-2 py-2"
const actionCell = cn(
  COL.actions,
  STICKY_ACTION_CLASS,
  "whitespace-nowrap align-middle px-2 py-2 text-center",
  "bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors"
)

const badgeOutline =
  "text-[11px] px-1.5 py-0 font-normal shrink-0 border outline-none"

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
        <Badge
          variant="outline"
          className={cn(badgeOutline, "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300")}
        >
          质押出库
        </Badge>
      )
    case "抵押出库":
      return (
        <Badge
          variant="outline"
          className={cn(badgeOutline, "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-300")}
        >
          抵押出库
        </Badge>
      )
    case "仓单出库":
      return (
        <Badge
          variant="outline"
          className={cn(badgeOutline, "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/40 dark:text-purple-300")}
        >
          仓单出库
        </Badge>
      )
    case "普通出库":
      return (
        <Badge
          variant="outline"
          className={cn(badgeOutline, "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300")}
        >
          普通出库
        </Badge>
      )
    case "移库出库":
      return (
        <Badge
          variant="outline"
          className={cn(badgeOutline, "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300")}
        >
          移库出库
        </Badge>
      )
    case "转让出库":
      return (
        <Badge
          variant="outline"
          className={cn(badgeOutline, "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/40 dark:bg-cyan-950/40 dark:text-cyan-300")}
        >
          转让出库
        </Badge>
      )
    default:
      return (
        <Badge
          variant="outline"
          className={cn(badgeOutline, "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300")}
        >
          {type}
        </Badge>
      )
  }
}

function OrderNoSingleRow({
  orderNo,
  linkTo,
}: {
  orderNo: string
  linkTo?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    void navigator.clipboard.writeText(orderNo)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const textClass = "line-clamp-2 min-w-0 break-all"

  return (
    <div className="group/item flex items-start gap-1 text-sm leading-snug">
      {linkTo ? (
        <Link
          to={linkTo}
          className={cn(textClass, "text-primary hover:underline")}
          title={orderNo}
        >
          {orderNo}
        </Link>
      ) : (
        <span className={cn(textClass, "text-foreground")} title={orderNo}>
          {orderNo}
        </span>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="opacity-0 group-hover/item:opacity-100 transition-opacity p-0.5 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
        title="复制单号"
      >
        <span className="text-xs leading-none">{copied ? "✓" : "📋"}</span>
      </button>
    </div>
  )
}

function OutboundGoodsCell({ row }: { row: OutboundRecord }) {
  const goodsSummary =
    row.goodsSummary ||
    formatGoodsNamesForList(row.goodsList.map((g) => g.goodsName))

  if (row.goodsList.length === 0) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  const triggerClass =
    "line-clamp-2 cursor-help text-left text-sm font-normal leading-snug break-words text-foreground"

  if (row.goodsList.length === 1) {
    return (
      <Tooltip>
        <TooltipTrigger render={<span />} className={triggerClass}>
          {goodsSummary}
        </TooltipTrigger>
        <TooltipContent className="max-w-sm text-xs">{goodsSummary}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger render={<span />} className={triggerClass}>
        {goodsSummary}（共 {row.goodsList.length} 种）
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-sm text-xs">
        <p className="mb-1 border-b border-border/50 pb-1 font-medium">
          货品清单（共 {row.goodsList.length} 种）：
        </p>
        <ul className="space-y-1">
          {row.goodsList.map((g) => (
            <li key={g.id} className="flex justify-between gap-2">
              <span>{g.goodsName}</span>
              <span>
                {g.totalOutboundAmount} {g.unit}
              </span>
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  )
}

function RowActions({
  row,
  onAction,
}: {
  row: OutboundRecord
  onAction: (action: OutboundRecordRowAction, item: OutboundRecord) => void
}) {
  return (
    <div className="inline-flex max-w-none flex-nowrap items-center justify-center gap-1.5">
      <Link
        to={outboundRecordDetailPath(row.id)}
        className="shrink-0 whitespace-nowrap text-sm text-primary hover:underline"
      >
        查看详情
      </Link>
      <span className="shrink-0 text-muted-foreground/30">|</span>
      <Button
        type="button"
        variant="link"
        size="sm"
        className="h-auto shrink-0 whitespace-nowrap p-0 text-sm font-normal text-primary hover:underline cursor-pointer"
        onClick={() => onAction("downloadPdf", row)}
      >
        单据下载
      </Button>
      <span className="shrink-0 text-muted-foreground/30">|</span>
      <Button
        type="button"
        variant="link"
        size="sm"
        className="h-auto shrink-0 whitespace-nowrap p-0 text-sm font-normal text-primary hover:underline cursor-pointer"
        onClick={() => onAction("downloadExcel", row)}
      >
        下载记录
      </Button>
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
      <Table className="min-w-[1224px] w-full table-fixed text-sm xl:min-w-[1360px]">
        <colgroup>
          <col className="w-12" />
          <col className="w-[148px]" />
          <col className="w-[136px]" />
          <col className="w-[92px]" />
          <col className="w-[104px]" />
          <col className="w-[100px]" />
          <col className="w-[136px]" />
          <col className="w-[152px]" />
          <col className="w-[88px]" />
          <col className="w-[128px]" />
          <col className="w-[228px]" />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead
              className={cn(COL.index, "text-center text-xs font-medium text-muted-foreground")}
            >
              序号
            </TableHead>
            <TableHead className={cn(COL.orderNo, "text-xs font-medium text-muted-foreground")}>
              出库单号
            </TableHead>
            <TableHead className={cn(COL.owner, "text-xs font-medium text-muted-foreground")}>
              货主名称/标识
            </TableHead>
            <TableHead className={cn(COL.type, "text-xs font-medium text-muted-foreground")}>
              出库类型
            </TableHead>
            <TableHead className={cn(COL.outboundDate, "text-xs font-medium text-muted-foreground")}>
              出库日期
            </TableHead>
            <TableHead className={cn(COL.warehouse, "text-xs font-medium text-muted-foreground")}>
              仓库名称
            </TableHead>
            <TableHead className={cn(COL.related, "text-xs font-medium text-muted-foreground")}>
              关联单号
            </TableHead>
            <TableHead className={cn(COL.goods, "text-xs font-medium text-muted-foreground")}>
              货物名称
            </TableHead>
            <TableHead
              className={cn(COL.quantity, "text-right text-xs font-medium text-muted-foreground")}
            >
              出库数量
            </TableHead>
            <TableHead className={cn(COL.creator, "text-xs font-medium text-muted-foreground")}>
              制单人
            </TableHead>
            <TableHead
              className={cn(
                COL.actions,
                "text-center text-xs font-medium text-foreground/80 bg-slate-100 dark:bg-slate-800",
                STICKY_ACTION_CLASS
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
                className="h-32 text-center text-sm text-muted-foreground"
              >
                暂无匹配的出库记录
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const createdParts = splitDateTime(row.createTime)

              return (
                <TableRow key={row.id} className="group align-middle hover:bg-muted/50 transition-colors">
                  <TableCell className={cn(cellBase, "text-center text-xs text-muted-foreground")}>
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className={cellBase}>
                    <OrderNoSingleRow
                      orderNo={row.orderNo}
                      linkTo={outboundRecordDetailPath(row.id)}
                    />
                  </TableCell>
                  <TableCell className={cellBase}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="line-clamp-2 text-sm text-foreground">{row.ownerName}</span>
                      <span className="line-clamp-1 text-xs text-muted-foreground">
                        {row.ownerIdentifier}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={cellBase}>{getTypeBadge(row.type)}</TableCell>
                  <TableCell className={cellBase}>
                    <TableDateTimeCell value={row.outboundTime} stackedPlain />
                  </TableCell>
                  <TableCell className={cellBase}>
                    <span className="line-clamp-2 text-sm leading-snug break-words text-foreground">
                      {row.warehouseName}
                    </span>
                  </TableCell>
                  <TableCell className={cn(COL.related, cellBase)}>
                    {row.relatedNo && row.relatedNo !== "—" ? (
                      <OrderNoSingleRow orderNo={row.relatedNo} />
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className={cellBase}>
                    <OutboundGoodsCell row={row} />
                  </TableCell>
                  <TableCell className={cn(cellBase, "text-right text-sm text-foreground")}>
                    <span className="leading-snug">
                      {formatOutboundQuantity(row.totalAmount, "")}
                      {row.goodsList.length === 1 && (row.amountUnit || row.goodsList[0]?.unit) ? (
                        <span className="ml-0.5 text-xs text-muted-foreground">
                          {row.amountUnit || row.goodsList[0]?.unit}
                        </span>
                      ) : null}
                    </span>
                  </TableCell>
                  <TableCell className={cellBase}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="line-clamp-2 text-sm text-foreground">{row.createdByName}</span>
                      <span className="text-xs text-muted-foreground">{createdParts.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className={actionCell}>
                    <RowActions row={row} onAction={onAction} />
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
