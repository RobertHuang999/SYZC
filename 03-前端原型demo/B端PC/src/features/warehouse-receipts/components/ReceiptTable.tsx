import { useEffect, useRef, useState } from "react"
import { CopyIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
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
import { receiptDetailPath } from "../domain/constants"
import { ReceiptStatusBadge } from "./ReceiptStatusBadge"

const STICKY_ACTION_CLASS =
  "sticky right-0 z-20 border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)]"

const ACTION_COL_WIDTH = 200

const COL = {
  index: "w-14 min-w-14",
  code: "w-[220px] min-w-[220px]",
  owner: "w-[210px] min-w-[210px]",
  holder: "w-[190px] min-w-[190px]",
  warehouse: "w-[150px] min-w-[150px]",
  goods: "w-[230px] min-w-[230px]",
  established: "w-[150px] min-w-[150px]",
  status: "w-[92px] min-w-[92px]",
  thirdParty: "w-[80px] min-w-[80px]",
  creator: "w-[170px] min-w-[170px]",
} as const

const cellBase = "align-middle px-3.5 py-3 text-sm"

type Props = {
  data: WarehouseReceipt[]
  page: number
  pageSize: number
  onAction: (action: ReceiptRowAction, item: WarehouseReceipt) => void
  onCopyCode: (code: string) => void
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
      <Table className="w-full table-fixed text-sm min-w-[1720px]">
        <colgroup>
          <col className={COL.index} />
          <col className={COL.code} />
          <col className={COL.owner} />
          <col className={COL.holder} />
          <col className={COL.warehouse} />
          <col className={COL.goods} />
          <col className={COL.established} />
          <col className={COL.status} />
          <col className={COL.thirdParty} />
          <col className={COL.creator} />
          <col style={{ width: ACTION_COL_WIDTH }} />
        </colgroup>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-900/50">
            <TableHead className={cn(COL.index, "text-center text-xs text-muted-foreground")}>
              序号
            </TableHead>
            <TableHead className="text-xs text-muted-foreground">仓单编码</TableHead>
            <TableHead className="text-xs text-muted-foreground">存货人</TableHead>
            <TableHead className="text-xs text-muted-foreground">持有人</TableHead>
            <TableHead className="text-xs text-muted-foreground">仓库名称</TableHead>
            <TableHead className="text-xs text-muted-foreground">货物名称</TableHead>
            <TableHead className="text-xs text-muted-foreground">开立时间</TableHead>
            <TableHead className="text-xs text-muted-foreground">仓单状态</TableHead>
            <TableHead className="text-xs text-muted-foreground">三方登记</TableHead>
            <TableHead className="text-xs text-muted-foreground">制单人</TableHead>
            <TableHead
              className={cn(
                "text-center text-xs text-foreground/80 bg-slate-100 dark:bg-slate-800",
                STICKY_ACTION_CLASS,
              )}
              style={{ width: ACTION_COL_WIDTH }}
            >
              操作
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="h-32 text-center text-sm text-muted-foreground">
                未找到符合筛选条件的仓单
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const actions = receiptActionsForStatus(row.status)
              const time = row.createdAt.split(" ")[1] ?? ""

              return (
                <TableRow
                  key={row.id}
                  className="group align-top transition-colors hover:bg-muted/50"
                >
                  <TableCell className={cn(cellBase, "text-center text-xs text-muted-foreground")}>
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>

                  <TableCell className={cellBase}>
                    <div className="flex items-start gap-1.5">
                      <Link
                        to={receiptDetailPath(row.id)}
                        className="whitespace-nowrap font-medium text-primary hover:underline"
                      >
                        {row.code}
                      </Link>
                      <button
                        type="button"
                        className="mt-0.5 shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
                        title="复制仓单编号"
                        onClick={() => onCopyCode(row.code)}
                      >
                        <CopyIcon className="size-3.5" />
                      </button>
                    </div>
                  </TableCell>

                  <PartyCell name={row.owner.name} identifier={row.owner.identifier} />
                  <PartyCell name={row.holder.name} identifier={row.holder.identifier} />

                  <TableCell className={cellBase}>
                    <span className="text-sm text-foreground">{row.warehouseName}</span>
                  </TableCell>

                  <GoodsCell receipt={row} />

                  <TableCell className={cn(cellBase, "whitespace-nowrap")}>
                    <TableDateTimeCell value={row.establishedAt} stackedPlain />
                  </TableCell>

                  <TableCell className={cellBase}>
                    <ReceiptStatusBadge status={row.status} />
                  </TableCell>

                  <TableCell className={cellBase}>
                    <span className="text-sm text-foreground">
                      {row.thirdPartyRegistered ? "是" : "否"}
                    </span>
                  </TableCell>

                  <TableCell className={cellBase}>
                    <div className="flex flex-col gap-0.5 leading-snug">
                      <span className="text-sm text-foreground">{row.creatorDisplay}</span>
                      <span className="text-xs text-muted-foreground">{time}</span>
                    </div>
                  </TableCell>

                  <TableCell
                    className={cn(
                      "sticky right-0 z-10 whitespace-normal px-3 py-2.5 align-middle",
                      "bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors",
                      "border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)]",
                    )}
                    style={{ width: ACTION_COL_WIDTH }}
                  >
                    <div className="grid grid-cols-3 gap-x-1.5 gap-y-1.5">
                      {actions.map((action) =>
                        action === "detail" ? (
                          <Link
                            key={action}
                            to={receiptDetailPath(row.id)}
                            className="whitespace-nowrap text-left text-xs font-medium text-primary hover:underline"
                          >
                            详情
                          </Link>
                        ) : (
                          <Button
                            key={action}
                            variant="link"
                            size="sm"
                            className={cn(
                              "h-auto justify-start whitespace-nowrap p-0 text-xs font-medium",
                              action === "cancel" && "text-rose-600 hover:text-rose-700",
                            )}
                            onClick={() => onAction(action, row)}
                          >
                            {RECEIPT_ACTION_LABEL[action]}
                          </Button>
                        ),
                      )}
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

function PartyCell({ name, identifier }: { name: string; identifier: string }) {
  return (
    <TableCell className={cellBase}>
      <div className="flex flex-col gap-0.5 leading-snug">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">{identifier}</span>
      </div>
    </TableCell>
  )
}

function GoodsCell({ receipt }: { receipt: WarehouseReceipt }) {
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

  /** 悬停 300ms 后打开气泡浮层，移出后留 180ms 缓冲，便于指针移入浮层 */
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
      <TableCell className={cellBase}>
        <div className="space-y-0.5">
          {groups.map((group) => (
            <div key={group.id} className="text-sm leading-snug text-foreground">
              {formatReceiptGoodsLine(group)}
            </div>
          ))}
        </div>
      </TableCell>
    )
  }

  return (
    <TableCell className={cellBase}>
      <div className="space-y-0.5">
        {groups.slice(0, 2).map((group) => (
          <div key={group.id} className="text-sm leading-snug text-foreground">
            {formatReceiptGoodsLine(group)}
          </div>
        ))}
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
