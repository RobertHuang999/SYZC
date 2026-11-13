import { Link } from "react-router-dom"
import { FileSearchIcon, RotateCcwIcon } from "lucide-react"
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
  COLLATERAL_TYPE_META,
  FINANCING_STATUS_META,
  PROCESSING_STAGE_LABEL,
  formatYuan,
  onlinePledgeDetailPath,
  type OnlinePledgeRecord,
} from "../domain/types"

const STICKY_ACTION_CLASS =
  "sticky right-0 z-20 border-l border-border/80 shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)]"

const ACTION_COL_CLASS = "w-[220px] min-w-[220px] max-w-[220px]"

const headBase =
  "h-11 align-middle px-3 text-xs font-medium text-muted-foreground whitespace-nowrap"
const cellBase = "align-middle px-3 py-2 text-[13px]"
const actionCell = cn(
  ACTION_COL_CLASS,
  STICKY_ACTION_CLASS,
  "whitespace-normal align-middle px-2 py-2 text-center",
  "bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors",
)

export type OnlinePledgeRowActionKind =
  | "initiate"
  | "audit"
  | "cancel"
  | "disburse"
  | "detail"

type OnlinePledgeTableProps = {
  data: OnlinePledgeRecord[]
  onAction: (action: OnlinePledgeRowActionKind, item: OnlinePledgeRecord) => void
  onResetFilters: () => void
}

function buildRowActions(
  item: OnlinePledgeRecord,
  onAction: (action: OnlinePledgeRowActionKind, item: OnlinePledgeRecord) => void,
): TableRowActionItem[] {
  const detailAction: TableRowActionItem = {
    key: "detail",
    label: "查看详情",
    onClick: () => onAction("detail", item),
  }

  if (item.financingStatus === "CREDIT_SUCCESS") {
    return [
      {
        key: "initiate",
        label: "发起确认",
        title: "核对质押标的并发起抵质押信息确认",
        onClick: () => onAction("initiate", item),
      },
      detailAction,
    ]
  }

  if (item.financingStatus === "IN_PROCESSING") {
    if (item.processingStage === "ORDER_GENERATED") {
      return [
        {
          key: "disburse",
          label: "录入放款",
          title: "录入实际放款金额、期数与放款回单",
          onClick: () => onAction("disburse", item),
        },
        detailAction,
      ]
    }

    return [
      {
        key: "audit",
        label: "审核",
        title: "核验标的评估价与协议，审核通过或拒绝",
        onClick: () => onAction("audit", item),
      },
      {
        key: "cancel",
        label: "主动撤销",
        tone: "amber",
        title: "撤销当前办理申请并本地回退至申请成功",
        onClick: () => onAction("cancel", item),
      },
      detailAction,
    ]
  }

  return [detailAction]
}

export function OnlinePledgeTable({
  data,
  onAction,
  onResetFilters,
}: OnlinePledgeTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-16 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
          <FileSearchIcon className="size-6" />
        </div>
        <div className="mt-3 text-base font-medium text-foreground">
          暂无匹配的线上监管业务单据
        </div>
        <p className="mt-1 max-w-md text-xs text-muted-foreground">
          当前筛选条件下未检索到授信通过待办理或已流转的线上抵质押记录，请调整筛选条件后重试。
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
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <Table className="min-w-[1780px]">
          <TableHeader>
            <TableRow className="bg-slate-100/90 hover:bg-slate-100/90 dark:bg-slate-800/90">
              <TableHead className={cn(headBase, "w-[205px] min-w-[205px]")}>
                申请单号
              </TableHead>
              <TableHead className={cn(headBase, "w-[210px] min-w-[210px]")}>
                产品名称
              </TableHead>
              <TableHead className={cn(headBase, "w-[96px] text-center")}>
                需要尽调
              </TableHead>
              <TableHead className={cn(headBase, "w-[190px] min-w-[190px]")}>
                申请人
              </TableHead>
              <TableHead className={cn(headBase, "w-[120px] text-center")}>
                抵/质押物类型
              </TableHead>
              <TableHead className={cn(headBase, "w-[145px] text-right")}>
                意向融资金额（元）
              </TableHead>
              <TableHead className={cn(headBase, "w-[145px] text-right")}>
                授信金额（元）
              </TableHead>
              <TableHead className={cn(headBase, "w-[90px] text-center")}>
                授信期数
              </TableHead>
              <TableHead className={cn(headBase, "w-[145px] text-right")}>
                贷款金额（元）
              </TableHead>
              <TableHead className={cn(headBase, "w-[90px] text-center")}>
                贷款期数
              </TableHead>
              <TableHead className={cn(headBase, "w-[125px]")}>
                申请时间
              </TableHead>
              <TableHead className={cn(headBase, "w-[110px]")}>
                处理人
              </TableHead>
              <TableHead className={cn(headBase, "w-[125px]")}>
                处理时间
              </TableHead>
              <TableHead className={cn(headBase, "w-[150px]")}>
                融资状态
              </TableHead>
              <TableHead
                className={cn(
                  headBase,
                  ACTION_COL_CLASS,
                  STICKY_ACTION_CLASS,
                  "bg-slate-100 text-center dark:bg-slate-800",
                )}
              >
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              const statusMeta = FINANCING_STATUS_META[item.financingStatus]
              const collateralMeta = COLLATERAL_TYPE_META[item.collateralType]
              const actions = buildRowActions(item, onAction)

              return (
                <TableRow key={item.id} className="group h-[72px]">
                  <TableCell className={cellBase}>
                    <DocNoCell
                      docNo={item.applyNo}
                      linkTo={onlinePledgeDetailPath(item.id)}
                    />
                  </TableCell>

                  <TableCell className={cellBase}>
                    <div
                      className="max-w-[200px] truncate font-medium text-foreground"
                      title={item.productName}
                    >
                      {item.productName}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground truncate">
                      {item.funderName}
                    </div>
                  </TableCell>

                  <TableCell className={cn(cellBase, "text-center")}>
                    <Badge
                      variant="outline"
                      className={
                        item.needDiligence
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      }
                    >
                      {item.needDiligence ? "是" : "否"}
                    </Badge>
                  </TableCell>

                  <TableCell className={cellBase}>
                    <div
                      className="max-w-[180px] truncate font-medium text-foreground"
                      title={item.applicantName}
                    >
                      {item.applicantName}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {item.applicantType === "ENTERPRISE" ? "企业" : "个人"} ·{" "}
                      {item.applicantIdentifier}
                    </div>
                  </TableCell>

                  <TableCell className={cn(cellBase, "text-center")}>
                    <Badge variant="outline" className={collateralMeta.badgeClass}>
                      {collateralMeta.label}
                    </Badge>
                  </TableCell>

                  <TableCell className={cn(cellBase, "text-right whitespace-nowrap tabular-nums")}>
                    {formatYuan(item.intendedAmountYuan)}
                  </TableCell>

                  <TableCell
                    className={cn(
                      cellBase,
                      "text-right font-semibold text-foreground whitespace-nowrap tabular-nums",
                    )}
                  >
                    {formatYuan(item.creditAmountYuan)}
                  </TableCell>

                  <TableCell className={cn(cellBase, "text-center whitespace-nowrap")}>
                    {item.creditPeriods} 期
                  </TableCell>

                  <TableCell
                    className={cn(
                      cellBase,
                      "text-right whitespace-nowrap tabular-nums",
                      item.loanAmountYuan
                        ? "font-semibold text-emerald-700 dark:text-emerald-400"
                        : "text-muted-foreground",
                    )}
                  >
                    {formatYuan(item.loanAmountYuan)}
                  </TableCell>

                  <TableCell className={cn(cellBase, "text-center whitespace-nowrap")}>
                    {item.loanPeriods ? `${item.loanPeriods} 期` : "--"}
                  </TableCell>

                  <TableCell className={cellBase}>
                    <TableDateTimeCell value={item.appliedAt} stackedPlain />
                  </TableCell>

                  <TableCell className={cellBase}>
                    <span className="text-foreground whitespace-nowrap">
                      {item.handlerName || "--"}
                    </span>
                  </TableCell>

                  <TableCell className={cellBase}>
                    <TableDateTimeCell value={item.handledAt} stackedPlain />
                  </TableCell>

                  <TableCell className={cellBase}>
                    <div className="flex flex-col items-start gap-1">
                      <Badge variant="outline" className={statusMeta.badgeClass}>
                        {statusMeta.label}
                      </Badge>
                      {item.financingStatus === "IN_PROCESSING" &&
                        item.processingStage && (
                          <span className="text-[11px] text-amber-700 dark:text-amber-400 whitespace-nowrap">
                            {PROCESSING_STAGE_LABEL[item.processingStage]}
                          </span>
                        )}
                      {item.financingStatus === "CREDIT_SUCCESS" &&
                        item.lastRollbackReason && (
                          <Link
                            to={onlinePledgeDetailPath(item.id)}
                            className="text-[11px] text-rose-600 hover:underline whitespace-nowrap"
                          >
                            含回退记录 · 待重提
                          </Link>
                        )}
                    </div>
                  </TableCell>

                  <TableCell className={actionCell}>
                    <TableRowActionPanel actions={actions} maxInline={3} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
