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
import { inboundRecordDetailPath } from "../domain/constants"
import type { InboundRecord, InboundRecordRowAction } from "../domain/types"
import {
  formatInboundQuantity,
  formatGoodsNamesForList,
  splitDateTime,
  splitOrderNoForDisplay,
} from "../lib/list-utils"

const STICKY_ACTION_CLASS =
  "sticky right-0 z-20 border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)] backdrop-blur-md"

type InboundRecordTableProps = {
  data: InboundRecord[]
  page: number
  pageSize: number
  onAction: (action: InboundRecordRowAction, item: InboundRecord) => void
}

export function InboundRecordTable({
  data,
  page,
  pageSize,
  onAction,
}: InboundRecordTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border bg-card">
      <Table className="min-w-[1240px] table-fixed">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-14 text-center">序号</TableHead>
            <TableHead className="w-[120px]">入库单号</TableHead>
            <TableHead className="w-[130px]">货主名称/标识</TableHead>
            <TableHead className="w-[96px]">入库类型</TableHead>
            <TableHead className="w-[100px]">入库日期</TableHead>
            <TableHead className="w-[100px]">仓库名称</TableHead>
            <TableHead className="w-[110px]">关联单号</TableHead>
            <TableHead className="w-[140px]">货物名称</TableHead>
            <TableHead className="w-[84px] text-right">入库数量</TableHead>
            <TableHead className="w-[140px]">制单人</TableHead>
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
                暂无匹配的入库记录
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const inboundParts = splitDateTime(row.inboundDate)
              const createdParts = splitDateTime(row.createdAt)
              const orderNoParts = splitOrderNoForDisplay(row.orderNo)
              const relatedParts =
                row.relatedOrderNo != null
                  ? splitOrderNoForDisplay(row.relatedOrderNo)
                  : null

              return (
                <TableRow key={row.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="text-center text-muted-foreground">
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>
                    <OrderNoStack head={orderNoParts.head} tail={orderNoParts.tail} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-xs leading-snug">
                      <span className="line-clamp-2 font-medium text-foreground">
                        {row.ownerName}
                      </span>
                      <span className="text-muted-foreground font-mono">
                        {row.ownerIdentifierMasked}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs leading-snug">
                    {row.inboundType}
                  </TableCell>
                  <TableCell>
                    <DateTimeStack date={inboundParts.date} time={inboundParts.time} />
                  </TableCell>
                  <TableCell className="text-xs leading-snug">
                    {row.warehouseName}
                  </TableCell>
                  <TableCell>
                    {relatedParts ? (
                      <OrderNoStack
                        head={relatedParts.head}
                        tail={relatedParts.tail}
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <GoodsNamesCell goodsNames={row.goodsNames} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-xs font-mono font-medium">
                    {formatInboundQuantity(row.inboundQuantity)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-xs leading-snug">
                      <span className="line-clamp-2 text-foreground">{row.creatorDisplay}</span>
                      <DateTimeStack
                        date={createdParts.date}
                        time={createdParts.time}
                        muted
                      />
                    </div>
                  </TableCell>
                  <TableCell
                    className={cn(
                      STICKY_ACTION_CLASS,
                      "bg-slate-50/95 dark:bg-slate-900/95 group-hover:bg-slate-100/95 dark:group-hover:bg-slate-850/95 transition-colors text-center py-2"
                    )}
                  >
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

function OrderNoStack({ head, tail }: { head: string; tail: string }) {
  return (
    <div className="flex flex-col gap-0.5 font-mono text-xs leading-snug tabular-nums">
      <span className="break-all">{head}</span>
      {tail ? (
        <span className="break-all text-muted-foreground">{tail}</span>
      ) : null}
    </div>
  )
}

function DateTimeStack({
  date,
  time,
  muted = false,
}: {
  date: string
  time: string
  muted?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 text-xs leading-snug tabular-nums",
        muted && "text-muted-foreground"
      )}
    >
      <span>{date}</span>
      {time ? <span className={muted ? undefined : "text-muted-foreground"}>{time}</span> : null}
    </div>
  )
}

function GoodsNamesCell({ goodsNames }: { goodsNames: string[] }) {
  if (goodsNames.length === 0) {
    return <span className="text-xs text-muted-foreground">—</span>
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

  if (goodsNames.length === 1) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={<span />}
          className="line-clamp-2 cursor-help text-left text-xs leading-snug break-all"
          aria-label={`货物名称：${joined}`}
        >
          {goodsNames[0]}
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">{goodsNames[0]}</TooltipContent>
      </Tooltip>
    )
  }

  if (goodsNames.length === 2) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={<span />}
          className="block cursor-help text-left"
          aria-label={`货物名称：${joined}`}
        >
          <span className="line-clamp-1 text-xs leading-snug break-all">
            {goodsNames[0]}
          </span>
          <span className="line-clamp-1 text-xs leading-snug break-all text-muted-foreground">
            {goodsNames[1]}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">{tooltipBody}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={<span />}
        className="block cursor-help text-left"
        aria-label={`货物名称：${joined}`}
      >
        <span className="line-clamp-2 text-xs leading-snug break-all">
          {joined}
        </span>
        <span className="mt-0.5 text-[11px] text-muted-foreground">
          共 {goodsNames.length} 种货品
        </span>
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
    <div className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-muted/65 dark:bg-muted/40 p-1 shadow-2xs backdrop-blur-xs whitespace-nowrap">
      <Link to={inboundRecordDetailPath(row.id)}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2.5 text-xs font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 active:bg-primary/25 transition-all shadow-2xs"
        >
          查看详情
        </Button>
      </Link>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 px-2.5 text-xs font-medium rounded-md text-foreground/80 hover:text-foreground bg-background/90 hover:bg-background active:bg-muted/80 transition-all border border-border/50 shadow-2xs"
        onClick={() => onAction("downloadExcel", row)}
      >
        下载记录
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 px-2.5 text-xs font-medium rounded-md text-foreground/80 hover:text-foreground bg-background/90 hover:bg-background active:bg-muted/80 transition-all border border-border/50 shadow-2xs"
        onClick={() => onAction("downloadPdf", row)}
      >
        单据下载
      </Button>
    </div>
  )
}
