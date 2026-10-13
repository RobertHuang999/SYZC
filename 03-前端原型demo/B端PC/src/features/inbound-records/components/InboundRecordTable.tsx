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
  "sticky right-0 z-10 border-l border-border/60 bg-muted/35 shadow-[-6px_0_12px_-8px_rgba(0,0,0,0.12)]"

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
      <Table className="min-w-[1040px] table-fixed">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-12">序号</TableHead>
            <TableHead className="w-[108px]">入库单号</TableHead>
            <TableHead className="w-[118px]">货主名称/标识</TableHead>
            <TableHead className="w-[96px]">入库类型</TableHead>
            <TableHead className="w-[88px]">入库日期</TableHead>
            <TableHead className="w-[88px]">仓库名称</TableHead>
            <TableHead className="w-[108px]">关联单号</TableHead>
            <TableHead className="w-[136px]">货物名称</TableHead>
            <TableHead className="w-[72px] text-right">入库数量</TableHead>
            <TableHead className="w-[168px]">制单人</TableHead>
            <TableHead className={cn("w-[108px]", STICKY_ACTION_CLASS, "bg-muted/40")}>
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
                <TableRow key={row.id} className="group align-top">
                  <TableCell className="text-muted-foreground">
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
                      <span className="text-muted-foreground">
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
                  <TableCell className="text-right tabular-nums text-xs">
                    {formatInboundQuantity(row.inboundQuantity)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-xs leading-snug">
                      <span className="line-clamp-2">{row.creatorDisplay}</span>
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
                      "bg-card group-hover:bg-muted/30"
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
  const linkClass =
    "inline-flex text-sm leading-none text-primary hover:underline whitespace-nowrap"

  return (
    <div className="flex max-w-[100px] flex-wrap content-start gap-x-2 gap-y-1.5 py-0.5">
      <Link to={inboundRecordDetailPath(row.id)} className={linkClass}>
        查看详情
      </Link>
      <Button
        type="button"
        variant="link"
        size="sm"
        className="h-auto p-0 text-sm leading-none whitespace-nowrap"
        onClick={() => onAction("downloadExcel", row)}
      >
        下载记录
      </Button>
      <Button
        type="button"
        variant="link"
        size="sm"
        className="h-auto p-0 text-sm leading-none whitespace-nowrap"
        onClick={() => onAction("downloadPdf", row)}
      >
        单据下载
      </Button>
    </div>
  )
}
