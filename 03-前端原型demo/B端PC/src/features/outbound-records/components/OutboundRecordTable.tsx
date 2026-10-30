import { useState, type CSSProperties } from "react"
import { Link } from "react-router-dom"
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
import { outboundRecordDetailPath } from "../domain/constants"
import type { OutboundRecord, OutboundRecordRowAction } from "../domain/types"
import {
  formatOutboundQuantity,
  formatGoodsNamesForList,
  splitDateTime,
} from "../lib/list-utils"

const STICKY_ACTION_CLASS =
  "sticky right-0 z-20 border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)]"

const ACTION_COL_CLASS =
  "w-[var(--outbound-action-col-w)] min-w-[var(--outbound-action-col-w)] max-w-[var(--outbound-action-col-w)]"

/** 与入库记录列表及货主档案对齐：px 列宽锁定 + 2×2 紧凑操作列 + 宽裕呼吸感 */
const COL = {
  index: "w-16 min-w-16",
  orderNo: "w-[200px] min-w-[200px]",
  owner: "w-[210px] min-w-[210px]",
  type: "w-[100px] min-w-[100px]",
  outboundDate: "w-[110px] min-w-[110px]",
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

const badgeOutline =
  "text-[11px] px-2 py-0.5 font-normal shrink-0 border outline-none"

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
    case "质押加工出库":
      return (
        <Badge
          variant="outline"
          className={cn(badgeOutline, "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300")}
        >
          质押加工出库
        </Badge>
      )
    case "抵押加工出库":
      return (
        <Badge
          variant="outline"
          className={cn(badgeOutline, "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/40 dark:bg-orange-950/40 dark:text-orange-300")}
        >
          抵押加工出库
        </Badge>
      )
    default:
      return (
        <Badge variant="outline" className={cn(badgeOutline, "border-slate-200 bg-slate-50 text-slate-700")}>
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

  const textClass = "whitespace-nowrap font-medium text-sm leading-normal"

  return (
    <div className="group/item inline-flex items-center gap-1.5 max-w-full">
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
        <span className="text-xs leading-none text-emerald-600 font-bold">{copied ? "✓" : "📋"}</span>
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
    "line-clamp-1 cursor-help text-left text-sm font-normal leading-snug break-words text-foreground hover:text-primary transition-colors"

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

function buildOutboundRowActions(
  row: OutboundRecord,
  onAction: (action: OutboundRecordRowAction, item: OutboundRecord) => void,
): TableRowActionItem[] {
  return [
    {
      key: "detail",
      label: "详情",
      title: "查看出库详情",
      to: outboundRecordDetailPath(row.id, "goods"),
    },
    {
      key: "pdf",
      label: "单据下载",
      title: "下载标准出库凭证PDF",
      onClick: () => onAction("downloadPdf", row),
    },
    {
      key: "excel",
      label: "下载记录",
      title: "下载货品出库记录清单Excel",
      onClick: () => onAction("downloadExcel", row),
    },
    {
      key: "docs",
      label: "资料管理",
      title: "查看与补充出库单据资料",
      onClick: () => onAction("manageDocs", row),
    },
  ]
}

export function OutboundRecordTable({
  data,
  page,
  pageSize,
  onAction,
}: OutboundRecordTableProps) {
  return (
    <div className="overflow-x-auto rounded-md border bg-card">
      <Table
        className="w-full table-fixed text-sm min-w-[1380px] xl:min-w-[1560px]"
        style={
          {
            "--outbound-action-col-w": `${TABLE_ROW_ACTION_COL_COMPACT_TOTAL_PX}px`,
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
              出库单号
            </TableHead>
            <TableHead className={cn(COL.owner, "text-xs font-medium text-muted-foreground px-3.5")}>
              货主名称/标识
            </TableHead>
            <TableHead className={cn(COL.type, "text-xs font-medium text-muted-foreground px-3.5")}>
              出库类型
            </TableHead>
            <TableHead className={cn(COL.outboundDate, "text-xs font-medium text-muted-foreground px-3.5")}>
              出库日期
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
              出库数量
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
                暂无匹配的出库记录
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const createdParts = splitDateTime(row.createTime)

              return (
                <TableRow
                  key={row.id}
                  className="group h-[72px] align-middle hover:bg-muted/50 transition-colors"
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
                    <OrderNoSingleRow
                      orderNo={row.orderNo}
                      linkTo={outboundRecordDetailPath(row.id, "goods")}
                    />
                  </TableCell>
                  <TableCell className={cellBase}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="line-clamp-1 font-medium text-foreground" title={row.ownerName}>
                        {row.ownerName}
                      </span>
                      <span className="line-clamp-1 text-xs text-muted-foreground tabular-nums">
                        {row.ownerIdentifier}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={cellBase}>{getTypeBadge(row.type)}</TableCell>
                  <TableCell className={cellBase}>
                    <TableDateTimeCell value={row.outboundTime} stackedPlain />
                  </TableCell>
                  <TableCell className={cellBase}>
                    <span className="line-clamp-1 text-sm text-foreground" title={row.warehouseName}>
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
                    <span className="leading-snug tabular-nums font-medium">
                      {formatOutboundQuantity(row.totalAmount, "")}
                      {row.goodsList.length === 1 && (row.amountUnit || row.goodsList[0]?.unit) ? (
                        <span className="ml-1 text-xs text-muted-foreground font-normal">
                          {row.amountUnit || row.goodsList[0]?.unit}
                        </span>
                      ) : null}
                    </span>
                  </TableCell>
                  <TableCell className={cellBase}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="line-clamp-1 text-sm text-foreground">{row.createdByName}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{createdParts.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className={actionCell}>
                    <TableRowActionPanel
                      actions={buildOutboundRowActions(row, onAction)}
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
