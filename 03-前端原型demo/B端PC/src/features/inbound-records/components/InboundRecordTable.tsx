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
import { InboundDocNoCell } from "./InboundDocNoCell"
import { inboundRecordDetailPath } from "../domain/constants"
import type { InboundRecord, InboundRecordRowAction } from "../domain/types"
import {
  formatInboundQuantity,
  formatGoodsNamesForList,
  splitDateTime,
} from "../lib/list-utils"

const STICKY_ACTION_CLASS =
  "sticky right-0 z-20 border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)]"

/** 多列表格：列宽用 px 锁定 + min-w 防挤压畸变；视口不足时横向滚动（对齐 PC 表格规范），非百分比压缩 */
const COL = {
  index: "w-12 min-w-12",
  orderNo: "w-[148px] min-w-[148px]",
  owner: "w-[136px] min-w-[136px]",
  type: "w-[92px] min-w-[92px]",
  inboundDate: "w-[104px] min-w-[104px]",
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

type InboundRecordTableProps = {
  data: InboundRecord[]
  page: number
  pageSize: number
  onAction: (action: InboundRecordRowAction, item: InboundRecord) => void
}

function getInboundTypeBadge(type: string) {
  let badgeClass = "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
  
  if (type.includes("质押")) {
    badgeClass = "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300"
  } else if (type.includes("抵押")) {
    badgeClass = "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-300"
  } else if (type.includes("仓单")) {
    badgeClass = "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/40 dark:text-purple-300"
  } else if (type.includes("普通")) {
    badgeClass = "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300"
  } else if (type.includes("移库")) {
    badgeClass = "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300"
  } else if (type.includes("转让") || type.includes("监管服务")) {
    badgeClass = "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/40 dark:bg-cyan-950/40 dark:text-cyan-300"
  }

  return (
    <Badge variant="outline" className={cn("text-[11px] px-1.5 py-0 font-normal shrink-0", badgeClass)}>
      {type}
    </Badge>
  )
}

function GoodsNamesCell({ goodsNames }: { goodsNames: string[] }) {
  if (goodsNames.length === 0) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  const joined = formatGoodsNamesForList(goodsNames)
  const tooltipBody = (
    <ul className="space-y-1 text-xs">
      {goodsNames.map((name) => (
        <li key={name} className="leading-snug">
          {name}
        </li>
      ))}
    </ul>
  )

  const label =
    goodsNames.length > 2 ? `${joined}（共 ${goodsNames.length} 种）` : joined

  return (
    <Tooltip>
      <TooltipTrigger
        render={<span />}
        className="line-clamp-2 cursor-help text-left text-sm font-normal leading-snug break-words text-foreground"
        aria-label={`货物名称：${joined}`}
      >
        {label}
      </TooltipTrigger>
      <TooltipContent className="max-w-sm">{tooltipBody}</TooltipContent>
    </Tooltip>
  )
}

function RowActions({
  row,
  onAction,
}: {
  row: InboundRecord
  onAction: (action: InboundRecordRowAction, item: InboundRecord) => void
}) {
  return (
    <div className="inline-flex max-w-none flex-nowrap items-center justify-center gap-1.5">
      <Link
        to={inboundRecordDetailPath(row.id)}
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

export function InboundRecordTable({
  data,
  page,
  pageSize,
  onAction,
}: InboundRecordTableProps) {
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
              入库单号
            </TableHead>
            <TableHead className={cn(COL.owner, "text-xs font-medium text-muted-foreground")}>
              货主名称/标识
            </TableHead>
            <TableHead className={cn(COL.type, "text-xs font-medium text-muted-foreground")}>
              入库类型
            </TableHead>
            <TableHead className={cn(COL.inboundDate, "text-xs font-medium text-muted-foreground")}>
              入库日期
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
              入库数量
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
                暂无匹配的入库记录
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const createdParts = splitDateTime(row.createdAt)

              return (
                <TableRow key={row.id} className="group align-middle hover:bg-muted/50 transition-colors">
                  <TableCell className={cn(cellBase, "text-center text-xs text-muted-foreground")}>
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell className={cellBase}>
                    <InboundDocNoCell
                      docNo={row.orderNo}
                      linkTo={inboundRecordDetailPath(row.id)}
                    />
                  </TableCell>
                  <TableCell className={cellBase}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="line-clamp-2 text-sm text-foreground">{row.ownerName}</span>
                      <span className="line-clamp-1 text-xs text-muted-foreground">
                        {row.ownerIdentifierMasked}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={cellBase}>{getInboundTypeBadge(row.inboundType)}</TableCell>
                  <TableCell className={cellBase}>
                    <TableDateTimeCell value={row.inboundDate} stackedPlain />
                  </TableCell>
                  <TableCell className={cellBase}>
                    <span className="line-clamp-2 text-sm leading-snug break-words text-foreground">
                      {row.warehouseName}
                    </span>
                  </TableCell>
                  <TableCell className={cn(COL.related, cellBase)}>
                    {row.relatedOrderNo ? (
                      <InboundDocNoCell docNo={row.relatedOrderNo} />
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className={cellBase}>
                    <GoodsNamesCell goodsNames={row.goodsNames} />
                  </TableCell>
                  <TableCell className={cn(cellBase, "text-right text-sm text-foreground")}>
                    <span className="leading-snug">
                      {formatInboundQuantity(row.inboundQuantity)}
                      {row.goodsNames.length === 1 && row.unit ? (
                        <span className="ml-0.5 text-xs text-muted-foreground">{row.unit}</span>
                      ) : null}
                    </span>
                  </TableCell>
                  <TableCell className={cellBase}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="line-clamp-2 text-sm text-foreground">{row.creatorDisplay}</span>
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
