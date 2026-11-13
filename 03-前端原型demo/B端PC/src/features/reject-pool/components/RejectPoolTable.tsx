import type { CSSProperties } from "react"
import { Link } from "react-router-dom"
import { AlertTriangleIcon, ExternalLinkIcon, RotateCcwIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { DocNoCell } from "@/shared/components/DocNoCell"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import {
  TableRowActionPanel,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
import {
  BUSINESS_STATUS_META,
  OVERDUE_HOURS_THRESHOLD,
  TAB_META,
  formatWan,
  isCircuitBroken,
  rejectPoolDetailPath,
  type RejectPoolRecord,
  type RejectPoolTabFilter,
} from "../domain/types"

const STICKY_ACTION_CLASS =
  "sticky right-0 z-20 border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)]"

const ACTION_COL_CLASS = "w-[196px] min-w-[196px] max-w-[196px]"

const headBase =
  "h-11 align-middle px-3 text-xs font-medium text-muted-foreground whitespace-nowrap"
const cellBase = "align-middle px-3 py-2.5 text-[13px]"
const actionCell = cn(
  ACTION_COL_CLASS,
  STICKY_ACTION_CLASS,
  "whitespace-normal align-middle px-2 py-2 text-center",
  "bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors",
)

export type RejectPoolRowActionKind =
  | "revive"
  | "routeAssign"
  | "reinitDiligence"
  | "skipDiligence"
  | "reassignFunder"
  | "unlock"
  | "detail"

type RejectPoolTableProps = {
  activeTab: RejectPoolTabFilter
  data: RejectPoolRecord[]
  page: number
  pageSize: number
  onAction: (action: RejectPoolRowActionKind, item: RejectPoolRecord) => void
  onResetFilters: () => void
}

function buildRowActions(
  item: RejectPoolRecord,
  onAction: (action: RejectPoolRowActionKind, item: RejectPoolRecord) => void,
): TableRowActionItem[] {
  const locked = isCircuitBroken(item)
  const lockTitle = "已触发风控熔断（被拒满 5 次），需线下特批解除"

  const detailAction: TableRowActionItem = {
    key: "detail",
    label: "查看详情",
    onClick: () => onAction("detail", item),
  }

  const unlockAction: TableRowActionItem | null = locked
    ? {
        key: "unlock",
        label: "特批解封",
        tone: "amber",
        title: "模拟线下审批工单解除 5 次熔断限制",
        onClick: () => onAction("unlock", item),
      }
    : null

  if (item.tabKey === "CLUE_REJECTED") {
    const actions: TableRowActionItem[] = [
      {
        key: "revive",
        label: "重新救活",
        disabled: locked,
        title: locked ? lockTitle : "修改/补全资料后恢复为待受理线索",
        onClick: () => onAction("revive", item),
      },
      {
        key: "routeAssign",
        label: "路由指派",
        disabled: locked,
        title: locked ? lockTitle : "按需要尽调快照直接分派尽调或资方",
        onClick: () => onAction("routeAssign", item),
      },
      detailAction,
    ]
    if (unlockAction) actions.push(unlockAction)
    return actions
  }

  if (item.tabKey === "DILIGENCE_FAILED") {
    const actions: TableRowActionItem[] = [
      {
        key: "reinit",
        label: "重新尽调",
        disabled: locked,
        title: locked ? lockTitle : "更换尽调专员重新发起尽调",
        onClick: () => onAction("reinitDiligence", item),
      },
      {
        key: "skipDiligence",
        label: "直分资方",
        tone: "amber",
        disabled: locked,
        title: locked ? lockTitle : "特批变更路由跳过尽调直接分配资方",
        onClick: () => onAction("skipDiligence", item),
      },
      detailAction,
    ]
    if (unlockAction) actions.push(unlockAction)
    return actions
  }

  const creditActions: TableRowActionItem[] = [
    {
      key: "reassignFunder",
      label: "分配资方",
      disabled: locked,
      title: locked ? lockTitle : "复用原尽调结论重新分配合作资方",
      onClick: () => onAction("reassignFunder", item),
    },
    detailAction,
  ]
  if (unlockAction) creditActions.push(unlockAction)
  return creditActions
}

const REJECT_NODE_BADGE: Record<string, string> = {
  需求线索驳回: "border-slate-200 bg-slate-50 text-slate-700",
  尽调风控不通过: "border-amber-200 bg-amber-50 text-amber-700",
  授信资方拒绝: "border-rose-200 bg-rose-50 text-rose-700",
}

export function RejectPoolTable({
  activeTab,
  data,
  onAction,
  onResetFilters,
}: RejectPoolTableProps) {
  const tabLabel = activeTab === "ALL" ? "全部" : TAB_META[activeTab].shortLabel

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border py-14 text-center">
        <AlertTriangleIcon className="mb-2 size-8 text-muted-foreground/60" />
        <p className="text-sm font-medium text-foreground">
          「{tabLabel}」暂无符合条件的被拒退回记录
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          可切换其他分类标签页，或重置筛选条件后重新查询。
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 gap-1.5"
          onClick={onResetFilters}
        >
          <RotateCcwIcon className="size-3.5" />
          重置筛选条件
        </Button>
      </div>
    )
  }

  return (
    <div
      className="relative w-full overflow-x-auto rounded-md border border-border"
      style={{ "--reject-action-col-w": "196px" } as CSSProperties}
    >
      <Table className="w-max min-w-full">
        <TableHeader>
          <TableRow className="bg-slate-100 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800">
            {/* 1. 产品名称 */}
            <TableHead className={cn(headBase, "w-[190px] min-w-[190px] max-w-[230px]")}>
              产品名称
            </TableHead>

            {/* 2. 需要尽调 */}
            <TableHead className={cn(headBase, "w-[88px] min-w-[88px] text-center")}>
              需要尽调
            </TableHead>

            {/* 3. 申请人 */}
            <TableHead className={cn(headBase, "w-[200px] min-w-[200px] max-w-[230px]")}>
              申请人
            </TableHead>

            {/* 4. 抵/质押物类型 */}
            <TableHead className={cn(headBase, "w-[150px] min-w-[150px]")}>
              抵/质押物类型
            </TableHead>

            {/* 5. 意向融资金额（元） */}
            <TableHead className={cn(headBase, "w-[130px] min-w-[130px] text-right")}>
              意向融资金额（元）
            </TableHead>

            {/* 6. 意向融资期数 */}
            <TableHead className={cn(headBase, "w-[96px] min-w-[96px] text-center")}>
              意向融资期数
            </TableHead>

            {/* 7. 退回节点名称 */}
            <TableHead className={cn(headBase, "w-[130px] min-w-[130px] text-center")}>
              退回节点名称
            </TableHead>

            {/* 8. 最后被拒原因 */}
            <TableHead className={cn(headBase, "w-[240px] min-w-[240px] max-w-[280px]")}>
              最后被拒原因
            </TableHead>

            {/* 9. 融资业务状态 */}
            <TableHead className={cn(headBase, "w-[100px] min-w-[100px] text-center")}>
              融资业务状态
            </TableHead>

            {/* 10. 历史被拒次数 */}
            <TableHead className={cn(headBase, "w-[100px] min-w-[100px] text-center")}>
              历史被拒次数
            </TableHead>

            {/* 11. 停滞时长（小时） */}
            <TableHead className={cn(headBase, "w-[120px] min-w-[120px] text-center")}>
              停滞时长（小时）
            </TableHead>

            {/* 12. 申请单号 */}
            <TableHead className={cn(headBase, "w-[175px] min-w-[175px]")}>
              申请单号
            </TableHead>

            {/* 13. 申请时间 */}
            <TableHead className={cn(headBase, "w-[126px] min-w-[126px] text-center")}>
              申请时间
            </TableHead>

            {/* 14. 退回处理人 */}
            <TableHead className={cn(headBase, "w-[180px] min-w-[180px]")}>
              退回处理人
            </TableHead>

            {/* 15. 退回时间 */}
            <TableHead className={cn(headBase, "w-[126px] min-w-[126px] text-center")}>
              退回时间
            </TableHead>

            {/* 16. 操作 */}
            <TableHead
              className={cn(
                headBase,
                ACTION_COL_CLASS,
                STICKY_ACTION_CLASS,
                "bg-slate-100 px-2 text-center dark:bg-slate-800",
              )}
            >
              操作
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => {
            const statusMeta = BUSINESS_STATUS_META[item.businessStatus]
            const overdue = item.stagnationHours > OVERDUE_HOURS_THRESHOLD
            const locked = isCircuitBroken(item)

            return (
              <TableRow
                key={item.id}
                className="group h-[72px] bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                {/* 1. 产品名称 */}
                <TableCell className={cellBase}>
                  <div
                    className="max-w-[220px] truncate font-medium text-foreground"
                    title={item.productName}
                  >
                    {item.productName}
                  </div>
                </TableCell>

                {/* 2. 需要尽调 */}
                <TableCell className={cn(cellBase, "text-center whitespace-nowrap")}>
                  <Badge
                    variant="outline"
                    className={
                      item.needDiligence
                        ? "border-sky-200 bg-sky-50 text-sky-700"
                        : "border-slate-200 bg-slate-100 text-slate-700"
                    }
                  >
                    {item.needDiligence ? "是" : "否"}
                  </Badge>
                </TableCell>

                {/* 3. 申请人 */}
                <TableCell className={cellBase}>
                  <div className="flex min-w-0 flex-col leading-tight">
                    <span
                      className="max-w-[200px] truncate font-medium text-foreground"
                      title={item.applicantName}
                    >
                      {item.applicantName}
                    </span>
                    <span className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {item.applicantIdentifier}
                    </span>
                  </div>
                </TableCell>

                {/* 4. 抵/质押物类型 */}
                <TableCell className={cellBase}>
                  {item.collateralType === "WAREHOUSE_RECEIPT" &&
                  item.warehouseReceiptCodes?.length ? (
                    <div className="flex flex-col gap-0.5">
                      <Badge
                        variant="outline"
                        className="w-fit border-sky-300 bg-sky-50 text-sky-800"
                      >
                        数字仓单
                      </Badge>
                      <Link
                        to={`/仓储/仓单管理/详情/${encodeURIComponent(item.warehouseReceiptCodes[0])}`}
                        className="inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-medium text-primary hover:underline"
                        title="点击跳转仓单详情"
                      >
                        <span>{item.warehouseReceiptCodes[0]}</span>
                        <ExternalLinkIcon className="size-3 shrink-0" />
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      <Badge
                        variant="outline"
                        className="w-fit border-emerald-300 bg-emerald-50 text-emerald-800"
                      >
                        现货存货
                      </Badge>
                      <span
                        className="max-w-[130px] truncate text-[11px] text-muted-foreground"
                        title={item.inventoryItems[0]?.varietyName}
                      >
                        {item.inventoryItems[0]?.varietyName ?? "暂不确定"}
                      </span>
                    </div>
                  )}
                </TableCell>

                {/* 5. 意向融资金额（元） */}
                <TableCell className={cn(cellBase, "text-right font-medium text-foreground whitespace-nowrap")}>
                  {formatWan(item.intendedAmountYuan)}
                </TableCell>

                {/* 6. 意向融资期数 */}
                <TableCell className={cn(cellBase, "text-center whitespace-nowrap")}>
                  {item.intendedPeriods}期
                </TableCell>

                {/* 7. 退回节点名称 */}
                <TableCell className={cn(cellBase, "text-center whitespace-nowrap")}>
                  <Badge
                    variant="outline"
                    className={REJECT_NODE_BADGE[item.rejectNodeName] ?? ""}
                  >
                    {item.rejectNodeName}
                  </Badge>
                </TableCell>

                {/* 8. 最后被拒原因 */}
                <TableCell className={cellBase}>
                  <div
                    className="max-w-[260px] truncate text-foreground"
                    title={item.lastRejectReason}
                  >
                    {item.lastRejectReason}
                  </div>
                </TableCell>

                {/* 9. 融资业务状态 */}
                <TableCell className={cn(cellBase, "text-center whitespace-nowrap")}>
                  <div className="flex flex-col items-center gap-0.5">
                    <Badge variant="outline" className={statusMeta.badgeClass}>
                      {statusMeta.label}
                    </Badge>
                    {locked ? (
                      <span className="text-[10px] font-medium text-rose-700">
                        已熔断({item.rejectCount}次)
                      </span>
                    ) : null}
                  </div>
                </TableCell>

                {/* 10. 历史被拒次数 */}
                <TableCell className={cn(cellBase, "text-center whitespace-nowrap")}>
                  <span
                    className={cn(
                      "font-medium",
                      item.rejectCount >= 3 ? "text-amber-600" : "text-foreground",
                    )}
                    title={item.rejectCount >= 3 ? "累计被拒已达 3 次及以上，请优先调度" : undefined}
                  >
                    {item.rejectCount} 次
                  </span>
                </TableCell>

                {/* 11. 停滞时长（小时） */}
                <TableCell className={cn(cellBase, "text-center whitespace-nowrap")}>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1",
                      overdue ? "font-medium text-rose-600" : "text-foreground",
                    )}
                  >
                    {overdue ? <AlertTriangleIcon className="size-3.5" /> : null}
                    {item.stagnationHours.toFixed(1)} 小时
                  </span>
                  {overdue ? (
                    <div className="mt-0.5 text-[10px] font-medium text-rose-600">
                      已超期
                    </div>
                  ) : null}
                </TableCell>

                {/* 12. 申请单号 */}
                <TableCell className={cn(cellBase, "whitespace-nowrap")}>
                  <DocNoCell
                    docNo={item.applyNo}
                    linkTo={rejectPoolDetailPath(item.id)}
                  />
                </TableCell>

                {/* 13. 申请时间 */}
                <TableCell className={cn(cellBase, "text-center")}>
                  <TableDateTimeCell value={item.appliedAt} stackedPlain />
                </TableCell>

                {/* 14. 退回处理人 */}
                <TableCell className={cellBase}>
                  <div className="flex min-w-0 flex-col leading-tight">
                    <span
                      className="max-w-[170px] truncate font-medium text-foreground"
                      title={`${item.rejectHandler}（${item.rejectHandlerOrg}）`}
                    >
                      {item.rejectHandler}
                    </span>
                    <span className="mt-0.5 max-w-[170px] truncate text-[11px] text-muted-foreground">
                      {item.rejectHandlerOrg}
                    </span>
                  </div>
                </TableCell>

                {/* 15. 退回时间 */}
                <TableCell className={cn(cellBase, "text-center")}>
                  <TableDateTimeCell value={item.rejectedAt} stackedPlain />
                </TableCell>

                {/* 16. 操作 */}
                <TableCell className={actionCell}>
                  <TableRowActionPanel actions={buildRowActions(item, onAction)} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
