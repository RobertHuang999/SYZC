import type { ReactNode } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  TableRowActionPanel,
  TABLE_ROW_ACTION_COL_COMPACT_TOTAL_PX,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
import { cn } from "@/lib/utils"

export type InventorySummaryColumn = {
  key: string
  label: ReactNode
  /** 表头与单元格共用的对齐 / 宽度类名 */
  className?: string
}

export type InventorySummaryRow = {
  id: string
  cells: ReactNode[]
  actions: TableRowActionItem[]
}

type InventorySummaryTableProps = {
  columns: InventorySummaryColumn[]
  rows: InventorySummaryRow[]
  emptyText: string
  page?: number
  pageSize?: number
  minWidthClass?: string
}

const INDEX_COL_CLASS = "w-16 min-w-16"
const STICKY_ACTION_CLASS =
  "sticky right-0 z-10 border-l border-border/60 bg-card px-2 py-2 text-center group-hover:bg-[#f7faff]"

/**
 * 存货管理三视图（仓库 / 货物 / 货主）共用的汇总表。
 * 走全局表格样式（表头 45px、行高 72px、悬停 #f7faff），序号左固定、操作列右固定。
 */
export function InventorySummaryTable({
  columns,
  rows,
  emptyText,
  page = 1,
  pageSize = 10,
  minWidthClass = "min-w-[1500px]",
}: InventorySummaryTableProps) {
  const actionColStyle = {
    width: TABLE_ROW_ACTION_COL_COMPACT_TOTAL_PX,
    minWidth: TABLE_ROW_ACTION_COL_COMPACT_TOTAL_PX,
    maxWidth: TABLE_ROW_ACTION_COL_COMPACT_TOTAL_PX,
  }

  return (
    <Table className={minWidthClass}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead
            className={cn(INDEX_COL_CLASS, "sticky left-0 z-10 bg-[#f7f8fa] text-center")}
          >
            序号
          </TableHead>
          {columns.map((column) => (
            <TableHead key={column.key} className={cn("px-3.5", column.className)}>
              {column.label}
            </TableHead>
          ))}
          <TableHead
            className="sticky right-0 z-10 border-l border-border/60 bg-[#f7f8fa] px-2 text-center"
            style={actionColStyle}
          >
            操作
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={columns.length + 2}
              className="h-32 text-center text-muted-foreground"
            >
              {emptyText}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row, index) => (
            <TableRow key={row.id} className="group h-[72px]">
              <TableCell className="sticky left-0 z-10 bg-card text-center text-muted-foreground group-hover:bg-[#f7faff]">
                {(page - 1) * pageSize + index + 1}
              </TableCell>
              {row.cells.map((cell, cellIndex) => (
                <TableCell
                  key={cellIndex}
                  className={cn("px-3.5 py-2", columns[cellIndex]?.className)}
                >
                  {cell}
                </TableCell>
              ))}
              <TableCell className={STICKY_ACTION_CLASS} style={actionColStyle}>
                <TableRowActionPanel actions={row.actions} fixedCols={2} />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

/** mock 里的 "--" 统一显示为「—」 */
export function displayValue(value: string | null | undefined) {
  if (!value || value === "--" || value.trim() === "") {
    return "—"
  }
  return value
}
