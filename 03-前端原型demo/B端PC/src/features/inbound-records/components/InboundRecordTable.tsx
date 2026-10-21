import type { CSSProperties } from "react"
import { Badge } from "@/components/ui/badge"
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
import {
  TableRowActionPanel,
  TABLE_ROW_ACTION_COL_COMPACT_TOTAL_PX,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
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

const ACTION_COL_CLASS =
  "w-[var(--inbound-action-col-w)] min-w-[var(--inbound-action-col-w)] max-w-[var(--inbound-action-col-w)]"

/** 列宽锁定 + 充裕呼吸感（对齐合作方档案列表 2×2 紧凑操作列与 AGENTS.md 规范） */
const COL = {
  index: "w-16 min-w-16",
  orderNo: "w-[200px] min-w-[200px]",
  owner: "w-[210px] min-w-[210px]",
  type: "w-[100px] min-w-[100px]",
  inboundDate: "w-[110px] min-w-[110px]",
  warehouse: "w-[150px] min-w-[150px]",
  related: "hidden xl:table-cell w-[180px] min-w-[180px]",
  goods: "w-[180px] min-w-[180px]",
  quantity: "w-[100px] min-w-[100px]",
  creator: "w-[140px] min-w-[140px]",
  actions: ACTION_COL_CLASS,
} as const

const cellBase = "align-middle px-3.5 py-2.5 text-sm"
const actionCell = cn(
  COL.actions,
  STICKY_ACTION_CLASS,
  "whitespace-normal align-middle px-2 py-2 text-center",
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
    <Badge variant="outline" className={cn("text-[11px] px-2 py-0.5 font-normal shrink-0", badgeClass)}>
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
        className="line-clamp-1 cursor-help text-left text-sm font-normal leading-snug break-words text-foreground hover:text-primary transition-colors"
        aria-label={`货物名称：${joined}`}
      >
        {label}
      </TooltipTrigger>
      <TooltipContent className="max-w-sm">{tooltipBody}</TooltipContent>
    </Tooltip>
  )
}

function buildInboundRowActions(
  row: InboundRecord,
  onAction: (action: InboundRecordRowAction, item: InboundRecord) => void,
): TableRowActionItem[] {
  return [
    {
      key: "detail",
      label: "详情",
      title: "查看入库详情",
      to: inboundRecordDetailPath(row.id),
    },
    {
      key: "pdf",
      label: "单据下载",
      title: "下载标准入库凭证PDF",
      onClick: () => onAction("downloadPdf", row),
    },
    {
      key: "excel",
      label: "下载记录",
      title: "下载货品堆放记录清单Excel",
      onClick: () => onAction("downloadExcel", row),
    },
    {
      key: "docs",
      label: "资料管理",
      title: "查看与补充入库单据资料",
      onClick: () => onAction("manageDocs", row),
    },
  ]
}

export function InboundRecordTable({
  data,
  page,
  pageSize,
  onAction,
}: InboundRecordTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border bg-card">
      <Table
        className="w-full table-fixed text-sm min-w-[1380px] xl:min-w-[1560px]"
        style={
          {
            "--inbound-action-col-w": `${TABLE_ROW_ACTION_COL_COMPACT_TOTAL_PX}px`,
          } as CSSProperties
        }
      >
        <colgroup>
          <col className="w-16" />
          <col className="w-[200px]" />
          <col className="w-[210px]" />
          <col className="w-[100px]" />
          <col className="w-[110px]" />
          <col className="w-[150px]" />
          <col className="w-[180px]" />
          <col className="w-[180px]" />
          <col className="w-[100px]" />
          <col className="w-[140px]" />
          <col style={{ width: TABLE_ROW_ACTION_COL_COMPACT_TOTAL_PX }} />
        </colgroup>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-900/50">
            <TableHead
              className={cn(
                COL.index,
                "sticky left-0 z-10 text-center text-xs font-medium text-muted-foreground bg-slate-100 dark:bg-slate-800"
              )}
            >
              序号
            </TableHead>
            <TableHead className={cn(COL.orderNo, "text-xs font-medium text-muted-foreground px-3.5")}>
              入库单号
            </TableHead>
            <TableHead className={cn(COL.owner, "text-xs font-medium text-muted-foreground px-3.5")}>
              货主名称/标识
            </TableHead>
            <TableHead className={cn(COL.type, "text-xs font-medium text-muted-foreground px-3.5")}>
              入库类型
            </TableHead>
            <TableHead className={cn(COL.inboundDate, "text-xs font-medium text-muted-foreground px-3.5")}>
              入库日期
            </TableHead>
            <TableHead className={cn(COL.warehouse, "text-xs font-medium text-muted-foreground px-3.5")}>
              仓库名称
            </TableHead>
            <TableHead className={cn(COL.related, "text-xs font-medium text-muted-foreground px-3.5")}>
              关联单号
            </TableHead>
            <TableHead className={cn(COL.goods, "text-xs font-medium text-muted-foreground px-3.5")}>
              货物名称
            </TableHead>
            <TableHead
              className={cn(COL.quantity, "text-right text-xs font-medium text-muted-foreground px-3.5")}
            >
              入库数量
            </TableHead>
            <TableHead className={cn(COL.creator, "text-xs font-medium text-muted-foreground px-3.5")}>
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
                <TableRow
                  key={row.id}
                  className="group align-middle hover:bg-muted/50 transition-colors"
                >
                  <TableCell
                    className={cn(
                      cellBase,
                      "sticky left-0 z-10 text-center text-xs text-muted-foreground",
                      "bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors"
                    )}
                  >
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
                      <span className="line-clamp-1 font-medium text-foreground" title={row.ownerName}>
                        {row.ownerName}
                      </span>
                      <span className="line-clamp-1 text-xs text-muted-foreground tabular-nums">
                        {row.ownerIdentifierMasked}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={cellBase}>{getInboundTypeBadge(row.inboundType)}</TableCell>
                  <TableCell className={cellBase}>
                    <TableDateTimeCell value={row.inboundDate} stackedPlain />
                  </TableCell>
                  <TableCell className={cellBase}>
                    <span className="line-clamp-1 text-sm text-foreground" title={row.warehouseName}>
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
                    <span className="leading-snug tabular-nums font-medium">
                      {formatInboundQuantity(row.inboundQuantity)}
                      {row.goodsNames.length === 1 && row.unit ? (
                        <span className="ml-1 text-xs text-muted-foreground font-normal">{row.unit}</span>
                      ) : null}
                    </span>
                  </TableCell>
                  <TableCell className={cellBase}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="line-clamp-1 text-sm text-foreground">{row.creatorDisplay}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{createdParts.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className={actionCell}>
                    <TableRowActionPanel
                      actions={buildInboundRowActions(row, onAction)}
                      fixedCols={2}
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
