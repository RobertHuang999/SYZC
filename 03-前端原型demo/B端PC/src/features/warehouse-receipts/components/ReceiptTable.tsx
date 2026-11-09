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
import { TableDateTimeCell, TablePersonOrgTimeCell } from "@/shared/components/TableCells"
import { DocNoCell } from "@/shared/components/DocNoCell"
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
  index: 64,
  code: 150,
  owner: 210,
  holder: 210,
  warehouse: 160,
  goods: 200,
  established: 160,
  status: 100,
  thirdParty: 90,
  creator: 180,
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

const cellBase = "align-middle px-3.5 py-2.5 text-[13px]"

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
}: Props) {
  return (
    <div className="overflow-x-auto rounded-md border bg-card">
      <Table
        className="w-full table-fixed text-[13px]"
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
              className="sticky left-0 z-10 bg-slate-100 text-center text-[13px] font-semibold text-[#4e5969] px-2 dark:bg-slate-800"
            >
              序号
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.code }}
              className="text-left text-[13px] font-semibold text-[#4e5969] px-3.5"
            >
              仓单编码
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.owner }}
              className="text-left text-[13px] font-semibold text-[#4e5969] px-3.5"
            >
              存货人
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.holder }}
              className="text-left text-[13px] font-semibold text-[#4e5969] px-3.5"
            >
              持有人
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.warehouse }}
              className="text-left text-[13px] font-semibold text-[#4e5969] px-3.5"
            >
              仓库名称
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.goods }}
              className="text-left text-[13px] font-semibold text-[#4e5969] px-3.5"
            >
              货物名称
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.established }}
              className="text-left text-[13px] font-semibold text-[#4e5969] px-3.5"
            >
              开立时间
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.status }}
              className="text-center text-[13px] font-semibold text-[#4e5969] px-3.5"
            >
              仓单状态
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.thirdParty }}
              className="text-left text-[13px] font-semibold text-[#4e5969] px-3.5"
            >
              三方登记
            </TableHead>
            <TableHead
              style={{ width: WIDTHS.creator }}
              className="text-left text-[13px] font-semibold text-[#4e5969] px-3.5"
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
                暂无符合条件的仓单，可调整筛选条件后重试
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
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
                      "sticky left-0 z-10 bg-white text-center text-xs text-muted-foreground px-2 group-hover:bg-slate-50 dark:bg-slate-900 dark:group-hover:bg-slate-800",
                    )}
                  >
                    {(page - 1) * pageSize + index + 1}
                  </TableCell>

                  {/* 2. 仓单编码 */}
                  <TableCell style={{ width: WIDTHS.code }} className={cellBase}>
                    <DocNoCell docNo={row.code} linkTo={receiptDetailPath(row.id)} wrap />
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
                    <TableDateTimeCell value={row.establishedAt} stackedPlain />
                  </TableCell>

                  {/* 8. 仓单状态 */}
                  <TableCell
                    style={{ width: WIDTHS.status }}
                    className={cn(cellBase, "text-center")}
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
                    <TablePersonOrgTimeCell
                      person={row.creatorName}
                      org={row.creatorOrg}
                      time={row.createdAt}
                    />
                  </TableCell>

                  {/* 11. 操作（实色背景、防穿透悬浮固定列） */}
                  <TableCell
                    style={{ width: WIDTHS.actions }}
                    className={actionCell}
                  >
                    <TableRowActionPanel
                      actions={buildReceiptRowActions(row, onAction)}
                      fixedCols={3}
                      maxInline={6}
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
  const groups = receipt.goodsGroups
  if (groups.length === 0) {
    return (
      <TableCell style={{ width }} className={cellBase}>
        <span className="text-sm text-muted-foreground">—</span>
      </TableCell>
    )
  }

  const first = formatReceiptGoodsLine(groups[0])
  return (
    <TableCell style={{ width }} className={cellBase}>
      <Tooltip>
        <TooltipTrigger
          render={<span />}
          className="line-clamp-1 cursor-help text-left text-sm font-normal leading-snug break-words text-foreground transition-colors hover:text-primary"
          aria-label={`仓单货品：${groups.map((group) => formatReceiptGoodsLine(group)).join("、")}`}
        >
          {groups.length > 1 ? `${first} 等 ${groups.length} 种` : first}
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <ul className="space-y-1 text-xs">
            {groups.map((group) => (
              <li key={group.id} className="leading-snug">
                {formatReceiptGoodsLine(group)}
              </li>
            ))}
          </ul>
        </TooltipContent>
      </Tooltip>
    </TableCell>
  )
}
