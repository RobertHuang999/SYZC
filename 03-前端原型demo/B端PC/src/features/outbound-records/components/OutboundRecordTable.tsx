import type { CSSProperties } from "react"
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
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TableDateTimeCell, TablePersonOrgTimeCell } from "@/shared/components/TableCells"
import {
  TableRowActionPanel,
  TABLE_ROW_ACTION_COL_TOTAL_PX,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
import { DocNoCell } from "@/shared/components/DocNoCell"
import { outboundRecordDetailPath } from "../domain/constants"
import type { OutboundRecord, OutboundRecordRowAction } from "../domain/types"
import { formatGoodsNamesForList, formatOutboundRecordQuantity } from "../lib/list-utils"

/**
 * 列宽按现网实测（1440 视口）：80/180/180/80/180/80/80/150/80/180/220，合计 1410。
 * 容器窄于表格时横向滚动，与现网一致。
 */
const COL = {
  index: "w-[64px] min-w-[64px]",
  orderNo: "w-[150px] min-w-[150px]",
  owner: "w-[210px] min-w-[210px]",
  type: "w-[100px] min-w-[100px]",
  outboundDate: "w-[110px] min-w-[110px]",
  warehouse: "w-[150px] min-w-[150px]",
  related: "w-[130px] min-w-[130px]",
  goods: "w-[180px] min-w-[180px]",
  quantity: "w-[160px] min-w-[160px]",
  creator: "w-[180px] min-w-[180px]",
  actions: "w-[var(--outbound-action-col-w)] min-w-[var(--outbound-action-col-w)] max-w-[var(--outbound-action-col-w)]",
} as const

/** 表头：13px / 700 / #999 / #F2F6FC 底 / 36px 高 */
const headCell =
  "h-9 px-[10px] py-0 text-[13px] font-bold text-[#999999] whitespace-nowrap"
/** 单元格：14px / #606266 / 上下 13px 留白 / 分割线 #EFEFEF */
const cellBase = "px-3.5 py-0 align-middle text-[13px] text-[#4e5969]"

/** 现网：序号列左固定、操作列右固定；底色必须不透明，避免横向滚动文字穿透 */
const stickyLeft =
  "sticky left-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800"
const stickyRight =
  "sticky right-0 z-20 border-l border-border/80 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)]"

interface OutboundRecordTableProps {
  data: OutboundRecord[]
  page: number
  pageSize: number
  onAction: (action: OutboundRecordRowAction, item: OutboundRecord) => void
  onResetFilters?: () => void
}

function getOutboundTypeBadge(type: string) {
  let badgeClass =
    "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"

  if (type.includes("质押")) {
    badgeClass =
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-300"
  } else if (type.includes("抵押")) {
    badgeClass =
      "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-300"
  } else if (type.includes("仓单")) {
    badgeClass =
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/40 dark:bg-purple-950/40 dark:text-purple-300"
  } else if (type.includes("普通")) {
    badgeClass =
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300"
  } else if (type.includes("移库")) {
    badgeClass =
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-300"
  } else if (type.includes("转让")) {
    badgeClass =
      "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900/40 dark:bg-cyan-950/40 dark:text-cyan-300"
  }

  return (
    <Badge
      variant="outline"
      className={cn("whitespace-nowrap text-[11px] px-2 py-0.5 font-normal shrink-0", badgeClass)}
    >
      {type}
    </Badge>
  )
}

function OutboundGoodsCell({ row }: { row: OutboundRecord }) {
  const goodsSummary =
    row.goodsSummary ||
    formatGoodsNamesForList(row.goodsList.map((g) => g.goodsName))

  if (row.goodsList.length === 0) {
    return <span className="text-[#909399]">—</span>
  }

  const triggerClass =
    "line-clamp-1 cursor-help text-left text-[14px] font-normal leading-snug break-words hover:text-primary transition-colors"

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
        {goodsSummary}
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

/** 行操作：一行 3 个、最多两行；超过 6 个才收入「更多」 */
function buildOutboundRowActions(
  row: OutboundRecord,
  onAction: (action: OutboundRecordRowAction, item: OutboundRecord) => void
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
      title: "预览并下载出库凭证",
      onClick: () => onAction("downloadPdf", row),
    },
    {
      key: "excel",
      label: "下载记录",
      title: "查看导出记录并下载出库明细",
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
  onResetFilters,
}: OutboundRecordTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <Table
        className="w-full min-w-[1562px] table-fixed text-sm"
        style={
          {
            "--row-hover": "#F5F7FA",
            "--outbound-action-col-w": `${TABLE_ROW_ACTION_COL_TOTAL_PX}px`,
          } as CSSProperties
        }
      >
        <colgroup>
          <col style={{ width: 64 }} />
          <col style={{ width: 150 }} />
          <col style={{ width: 210 }} />
          <col style={{ width: 100 }} />
          <col style={{ width: 110 }} />
          <col style={{ width: 150 }} />
          <col style={{ width: 130 }} />
          <col style={{ width: 180 }} />
          <col style={{ width: 110 }} />
          <col style={{ width: 180 }} />
          <col style={{ width: TABLE_ROW_ACTION_COL_TOTAL_PX }} />
        </colgroup>
        <TableHeader>
          <TableRow className="bg-[#F2F6FC] hover:bg-[#F2F6FC]">
            <TableHead className={cn(COL.index, headCell, "sticky left-0 z-20 bg-[#F2F6FC] text-center")}>序号</TableHead>
            <TableHead className={cn(COL.orderNo, headCell)}>出库单号</TableHead>
            <TableHead className={cn(COL.owner, headCell)}>货主名称/标识</TableHead>
            <TableHead className={cn(COL.type, headCell)}>出库类型</TableHead>
            <TableHead className={cn(COL.outboundDate, headCell)}>出库日期</TableHead>
            <TableHead className={cn(COL.warehouse, headCell)}>仓库名称</TableHead>
            <TableHead className={cn(COL.related, headCell)}>关联单号</TableHead>
            <TableHead className={cn(COL.goods, headCell)}>货物名称</TableHead>
            <TableHead className={cn(COL.quantity, headCell, "text-right")}>出库数量</TableHead>
            <TableHead className={cn(COL.creator, headCell)}>制单人</TableHead>
            <TableHead className={cn(COL.actions, headCell, "sticky right-0 z-20 bg-[#F2F6FC] shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)]")}>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={11}
                className="h-32 text-center text-[14px] text-[#909399]"
              >
                <div className="flex flex-col items-center gap-2">
                  <span>暂无符合条件的出库记录，可调整筛选条件后重试</span>
                  {onResetFilters ? (
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={onResetFilters}
                    >
                      重置筛选条件
                    </button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={row.id}
                className="group h-[72px] border-b border-[#EFEFEF] transition-colors hover:bg-[#F5F7FA]"
              >
                <TableCell className={cn(cellBase, COL.index, stickyLeft, "text-center")}>
                  {(page - 1) * pageSize + index + 1}
                </TableCell>
                <TableCell className={cn(cellBase, COL.orderNo)}>
                  <DocNoCell
                    docNo={row.orderNo}
                    linkTo={outboundRecordDetailPath(row.id, "goods")}
                    wrap
                  />
                </TableCell>
                <TableCell className={cn(cellBase, COL.owner)}>
                  <div className="flex flex-col gap-0.5 leading-snug">
                    <span className="line-clamp-1" title={row.ownerName}>
                      {row.ownerName}
                    </span>
                    <span
                      className="line-clamp-1 tabular-nums text-[#606266]"
                      title={row.ownerIdentifier}
                    >
                      {row.ownerIdentifier}
                    </span>
                  </div>
                </TableCell>
                <TableCell className={cn(cellBase, COL.type)}>
                  {getOutboundTypeBadge(row.type)}
                </TableCell>
                <TableCell className={cn(cellBase, COL.outboundDate)}>
                  <TableDateTimeCell value={row.outboundTime} stackedPlain />
                </TableCell>
                <TableCell className={cn(cellBase, COL.warehouse)}>
                  <span className="line-clamp-2" title={row.warehouseName}>
                    {row.warehouseName}
                  </span>
                </TableCell>
                <TableCell className={cn(cellBase, COL.related)}>
                  {row.relatedNo && row.relatedNo !== "—" ? (
                    <DocNoCell docNo={row.relatedNo} wrap />
                  ) : (
                    <span className="text-[#909399]">—</span>
                  )}
                </TableCell>
                <TableCell className={cn(cellBase, COL.goods)}>
                  <OutboundGoodsCell row={row} />
                </TableCell>
                <TableCell className={cn(cellBase, COL.quantity, "text-right")}>
                  <span className="tabular-nums font-medium text-foreground" title={formatOutboundRecordQuantity(row)}>
                    {formatOutboundRecordQuantity(row)}
                  </span>
                </TableCell>
                <TableCell className={cn(cellBase, COL.creator)}>
                  <TablePersonOrgTimeCell
                    person={row.createdByName}
                    org={row.createdByOrg}
                    time={row.createTime}
                  />
                </TableCell>
                <TableCell className={cn(cellBase, COL.actions, stickyRight)}>
                  <TableRowActionPanel
                    actions={buildOutboundRowActions(row, onAction)}
                    fixedCols={3}
                    maxInline={6}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
