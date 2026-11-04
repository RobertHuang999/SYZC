import { useEffect, useRef, useState } from "react"
import { CopyIcon } from "lucide-react"
import { Link } from "react-router-dom"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import type {
  ReceiptRowAction,
  WarehouseReceipt,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import {
  RECEIPT_ACTION_LABEL,
  formatReceiptGoodsLine,
  receiptActionsForStatus,
} from "@prototype/shared/warehouse-receipts/warehouse-receipt-types"
import {
  TableRowActionPanel,
  type TableRowActionItem,
  TABLE_ROW_ACTION_COL_TOTAL_PX,
} from "@/shared/components/TableRowActionPanel"
import { receiptDetailPath } from "../domain/constants"
import { ReceiptStatusBadge } from "./ReceiptStatusBadge"

/** 列宽锁定：总宽度 1886px，对齐 AGENTS.md 规范与标杆页面 */
const WIDTHS = {
  index: 56,
  code: 220,
  owner: 220,
  holder: 220,
  warehouse: 160,
  goods: 240,
  established: 160,
  status: 100,
  thirdParty: 90,
  creator: 200,
  actions: TABLE_ROW_ACTION_COL_TOTAL_PX, // 218px
} as const

const TABLE_MIN_WIDTH =
  WIDTHS.index +
  WIDTHS.code +
  WIDTHS.owner +
  WIDTHS.holder +
  WIDTHS.warehouse +
  WIDTHS.goods +
  WIDTHS.established +
  WIDTHS.status +
  WIDTHS.thirdParty +
  WIDTHS.creator +
  WIDTHS.actions // 1884px

const cellBase = "align-middle px-3.5 py-2.5 text-sm"

const STICKY_ACTION_CLASS =
  "sticky right-0 z-20 border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)]"

const actionCell = cn(
  STICKY_ACTION_CLASS,
  "whitespace-normal align-middle px-2 py-2 text-center",
  "bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors"
)

type Props = {
  data: WarehouseReceipt[]
  page: number
  pageSize: number
  onAction: (action: ReceiptRowAction, item: WarehouseReceipt) => void
  onCopyCode: (code: string) => void
}

function buildReceiptRowActions(
  row: WarehouseReceipt,
  onAction: (action: ReceiptRowAction, item: WarehouseReceipt) => void,
): TableRowActionItem[] {
  const actions = receiptActionsForStatus(row.status)
  const isSameParty =
    row.owner.name === row.holder.name &&
    row.owner.identifier === row.holder.identifier

  return actions.map((action) => {
    if (action === "detail") {
      return {
        key: action,
        label: "详情",
        title: "查看仓单全息档案与明细",
        to: receiptDetailPath(row.id),
      }
    }

    const isRestrictedByHolder =
      !isSameParty && (action === "replenish" || action === "relocate")

    return {
      key: action,
      label: RECEIPT_ACTION_LABEL[action],
      title: isRestrictedByHolder
        ? "持有人非原始存货人，禁止办理补货/移库"
        : undefined,
      disabled: isRestrictedByHolder,
      tone: action === "cancel" ? "danger" : "primary",
      onClick: () => onAction(action, row),
    }
  })
}

export function ReceiptTable({
  data,
  page,
  pageSize,
  onAction,
  onCopyCode,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-md border bg-card">
      <Table
        className="w-full table-fixed text-sm"
        style={{ minWidth: `${TABLE_MIN_WIDTH}px` }}
      >
        <colgroup>
          <col style={{ width: WIDTHS.index }} />
          <col style={{ width: WIDTHS.code }} />
          <col style={{ width: WIDTHS.owner }} />
          <col style={{ width: WIDTHS.holder }} />
          <col style={{ width: WIDTHS.warehouse }} />
          <col style={{ width: WIDTHS.goods }} />
          <col style={{ width: WIDTHS.established }} />
          <col style={{ width: WIDTHS.status }} />
          <col style={{ width: WIDTHS.thirdParty }} />
          <col style={{ width: WIDTHS.creator }} />
          <col style={{ width: WIDTHS.actions }} />
        </colgroup>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-900/50 h-11">
            <TableHead
              style={{ width: WIDTHS.index }}
              className="text-center text-xs font-medium text-muted-foreground px-2"
            >
              序号
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.code }}
              className="text-left text-xs font-medium text-muted-foreground px-3.5"
            >
              仓单编码
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.owner }}
              className="text-left text-xs font-medium text-muted-foreground px-3.5"
            >
              存货人
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.holder }}
              className="text-left text-xs font-medium text-muted-foreground px-3.5"
            >
              持有人
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.warehouse }}
              className="text-left text-xs font-medium text-muted-foreground px-3.5"
            >
              仓库名称
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.goods }}
              className="text-left text-xs font-medium text-muted-foreground px-3.5"
            >
              货物名称
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.established }}
              className="text-left text-xs font-medium text-muted-foreground px-3.5"
            >
              开立时间
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.status }}
              className="text-left text-xs font-medium text-muted-foreground px-3.5"
            >
              仓单状态
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.thirdParty }}
              className="text-left text-xs font-medium text-muted-foreground px-3.5"
            >
              三方登记
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.creator }}
              className="text-left text-xs font-medium text-muted-foreground px-3.5"
            >
              制单人
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.actions }}
              className={cn(
                STICKY_ACTION_CLASS,
                "text-center text-xs font-medium text-foreground/80 bg-slate-100 dark:bg-slate-800 px-2",
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
                未找到符合筛选条件的仓单
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const time = row.createdAt.split(" ")[1] ?? ""

              return (
                <TableRow
                  key={row.id}
                  className="group h-[72px] align-middle transition-colors hover:bg-muted/50"
                >
                  {/* 1. 序号 */}
                  <TableCell
                    style={{ width: WIDTHS.index }}
                    className={cn(
                      cellBase,
                      "text-center text-xs text-muted-foreground px-2",
                    )}
                  >
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>

                  {/* 2. 仓单编码 */}
                  <TableCell style={{ width: WIDTHS.code }} className={cellBase}>
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={receiptDetailPath(row.id)}
                        className="whitespace-nowrap font-medium text-primary hover:underline"
                        title={row.code}
                      >
                        {row.code}
                      </Link>
                      <button
                        type="button"
                        className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                        title="复制仓单编号"
                        onClick={() => onCopyCode(row.code)}
                      >
                        <CopyIcon className="size-3.5" />
                      </button>
                    </div>
                  </TableCell>

                  {/* 3. 存货人 */}
                  <PartyCell
                    width={WIDTHS.owner}
                    name={row.owner.name}
                    identifier={row.owner.identifier}
                  />

                  {/* 4. 持有人 */}
                  <PartyCell
                    width={WIDTHS.holder}
                    name={row.holder.name}
                    identifier={row.holder.identifier}
                  />

                  {/* 5. 仓库名称 */}
                  <TableCell
                    style={{ width: WIDTHS.warehouse }}
                    className={cellBase}
                  >
                    <span
                      className="block truncate text-sm text-foreground"
                      title={row.warehouseName}
                    >
                      {row.warehouseName}
                    </span>
                  </TableCell>

                  {/* 6. 货物名称 */}
                  <GoodsCell width={WIDTHS.goods} receipt={row} />

                  {/* 7. 开立时间（采用单行规范呈现） */}
                  <TableCell
                    style={{ width: WIDTHS.established }}
                    className={cn(cellBase, "whitespace-nowrap")}
                  >
                    <TableDateTimeCell value={row.establishedAt} plain />
                  </TableCell>

                  {/* 8. 仓单状态 */}
                  <TableCell
                    style={{ width: WIDTHS.status }}
                    className={cellBase}
                  >
                    <ReceiptStatusBadge status={row.status} />
                  </TableCell>

                  {/* 9. 三方登记 */}
                  <TableCell
                    style={{ width: WIDTHS.thirdParty }}
                    className={cellBase}
                  >
                    <span className="text-sm text-foreground">
                      {row.thirdPartyRegistered ? "是" : "否"}
                    </span>
                  </TableCell>

                  {/* 10. 制单人 */}
                  <TableCell
                    style={{ width: WIDTHS.creator }}
                    className={cellBase}
                  >
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span
                        className="block truncate text-sm text-foreground"
                        title={row.creatorDisplay}
                      >
                        {row.creatorDisplay}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {time}
                      </span>
                    </div>
                  </TableCell>

                  {/* 11. 操作（实色背景、防穿透悬浮固定列） */}
                  <TableCell
                    style={{ width: WIDTHS.actions }}
                    className={actionCell}
                  >
                    <TableRowActionPanel
                      actions={buildReceiptRowActions(row, onAction)}
                      fixedCols={3}
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

function PartyCell({
  name,
  identifier,
  width,
}: {
  name: string
  identifier: string
  width: number
}) {
  return (
    <TableCell style={{ width }} className={cellBase}>
      <div className="flex flex-col gap-0.5 leading-snug overflow-hidden">
        <span
          className="text-sm font-medium text-foreground line-clamp-2 break-words"
          title={name}
        >
          {name}
        </span>
        <span className="text-xs text-muted-foreground truncate" title={identifier}>
          {identifier}
        </span>
      </div>
    </TableCell>
  )
}

function GoodsCell({
  receipt,
  width,
}: {
  receipt: WarehouseReceipt
  width: number
}) {
  const [open, setOpen] = useState(false)
  const openTimer = useRef<number | null>(null)
  const closeTimer = useRef<number | null>(null)
  const groups = receipt.goodsGroups

  const clearTimers = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current)
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    openTimer.current = null
    closeTimer.current = null
  }

  useEffect(() => {
    return () => {
      if (openTimer.current) window.clearTimeout(openTimer.current)
      if (closeTimer.current) window.clearTimeout(closeTimer.current)
    }
  }, [])

  const openWithDelay = () => {
    clearTimers()
    openTimer.current = window.setTimeout(() => setOpen(true), 300)
  }

  const closeWithDelay = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current)
    openTimer.current = null
    closeTimer.current = window.setTimeout(() => setOpen(false), 180)
  }

  const keepOpen = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = null
  }

  if (groups.length <= 2) {
    return (
      <TableCell style={{ width }} className={cellBase}>
        <div className="space-y-1 overflow-hidden">
          {groups.map((group) => {
            const line = formatReceiptGoodsLine(group)
            return (
              <div
                key={group.id}
                className="text-sm leading-snug text-foreground truncate"
                title={line}
              >
                {line}
              </div>
            )
          })}
        </div>
      </TableCell>
    )
  }

  return (
    <TableCell style={{ width }} className={cellBase}>
      <div className="space-y-1 overflow-hidden">
        {groups.slice(0, 2).map((group) => {
          const line = formatReceiptGoodsLine(group)
          return (
            <div
              key={group.id}
              className="text-sm leading-snug text-foreground truncate"
              title={line}
            >
              {line}
            </div>
          )
        })}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <button
                type="button"
                className="text-xs font-medium text-primary hover:underline"
                onMouseEnter={openWithDelay}
                onMouseLeave={closeWithDelay}
              />
            }
          >
            更多...
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-0"
            align="start"
            side="top"
            onMouseEnter={keepOpen}
            onMouseLeave={closeWithDelay}
          >
            <div className="border-b bg-muted/40 px-3 py-2 text-xs font-medium text-foreground">
              仓单货品清单汇总（{receipt.code}）
            </div>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="w-10 px-3 py-1.5 text-left font-medium">序号</th>
                    <th className="px-3 py-1.5 text-left font-medium">货品规格全称</th>
                    <th className="w-24 px-3 py-1.5 text-right font-medium">开立数量</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group, index) => (
                    <tr key={group.id} className="border-b last:border-0">
                      <td className="px-3 py-1.5 text-muted-foreground">{index + 1}</td>
                      <td className="px-3 py-1.5 text-foreground">{group.name}</td>
                      <td className="px-3 py-1.5 text-right text-foreground">
                        {Number(group.quantity.toFixed(4))} {group.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t px-3 py-1.5 text-xs text-muted-foreground">
              合计品类：{groups.length} 种规格
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TableCell>
  )
}
