import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TableDateTimeCell } from "@/shared/components/TableCells"
import {
  TableRowActionPanel,
  TABLE_ROW_ACTION_COL_TOTAL_PX,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
import { InboxIcon, ExternalLinkIcon } from "lucide-react"
import { DILIGENCE_STATUS_CONFIG } from "../domain/constants"
import type { CustomerFinancingDueDiligence } from "../domain/types"

interface DueDiligenceTableProps {
  data: CustomerFinancingDueDiligence[]
  startIndex: number
  onViewDetail: (item: CustomerFinancingDueDiligence) => void
  onTriggerDiligence: (item: CustomerFinancingDueDiligence) => void
  onReassignTask: (item: CustomerFinancingDueDiligence) => void
  onManualReject: (item: CustomerFinancingDueDiligence) => void
  onAssignFunder: (item: CustomerFinancingDueDiligence) => void
  onViewReport: (item: CustomerFinancingDueDiligence) => void
  onReviewRisk?: (item: CustomerFinancingDueDiligence) => void
  onResetFilters: () => void
}

/** 金额按元展示，千分位并保留 4 位小数 */
function formatAmount4(val: number): string {
  return new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(val)
}

const headCell =
  "whitespace-nowrap px-3 py-3 text-center font-semibold text-foreground"

export function DueDiligenceTable({
  data,
  startIndex,
  onViewDetail,
  onTriggerDiligence,
  onReassignTask,
  onManualReject,
  onAssignFunder,
  onViewReport,
  onReviewRisk,
  onResetFilters,
}: DueDiligenceTableProps) {
  if (data.length === 0) {
    return (
      <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-card p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <InboxIcon className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-medium text-foreground">
          暂无匹配的客户融资尽调任务
        </h3>
        <p className="mt-1.5 max-w-sm text-xs text-muted-foreground">
          未检索到符合当前筛选条件的单据，您可以尝试清空关键字或重置筛选选项
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="mt-4 h-8 text-xs"
        >
          重置全部筛选条件
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3 font-sans">
      <div className="relative overflow-x-auto rounded-lg border border-border/70 bg-card shadow-xs">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-slate-100 text-xs font-semibold text-foreground dark:bg-slate-800">
            <tr>
              {/* 1. 序号 */}
              <th className={`${headCell} w-14`}>序号</th>

              {/* 2. 产品名称 */}
              <th className={`${headCell} min-w-[190px] max-w-[230px] text-left`}>
                产品名称
              </th>

              {/* 3. 申请人 */}
              <th className={`${headCell} min-w-[190px] max-w-[230px] text-left`}>
                申请人
              </th>

              {/* 4. 意向融资金额（元） */}
              <th className={`${headCell} min-w-[150px] text-right`}>
                意向融资金额（元）
              </th>

              {/* 5. 意向融资期数 */}
              <th className={`${headCell} w-24`}>意向融资期数</th>

              {/* 6. 抵/质押物 */}
              <th className={`${headCell} min-w-[150px] text-left`}>抵/质押物</th>

              {/* 7. 尽调状态 */}
              <th className={`${headCell} w-28`}>尽调状态</th>

              {/* 8. 尽调人员 */}
              <th className={`${headCell} min-w-[100px]`}>尽调人员</th>

              {/* 9. 尽调分配时间 */}
              <th className={`${headCell} min-w-[130px]`}>尽调分配时间</th>

              {/* 10. 处理时间 */}
              <th className={`${headCell} min-w-[130px]`}>处理时间</th>

              {/* 11. 操作：列宽按 PC 06 三列满宽预留，4 钮走 2×2 两行 */}
              <th
                className="sticky right-0 z-20 border-l border-border/80 bg-slate-100 px-3 py-3 text-center font-semibold text-foreground shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)] dark:bg-slate-800"
                style={{
                  width: TABLE_ROW_ACTION_COL_TOTAL_PX,
                  minWidth: TABLE_ROW_ACTION_COL_TOTAL_PX,
                }}
              >
                操作
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, idx) => {
              const statusConfig = DILIGENCE_STATUS_CONFIG[item.status]
              const receiptNo = item.warehouseReceiptNo
              const actions: TableRowActionItem[] = [
                {
                  key: "detail",
                  label: "查看",
                  onClick: () => onViewDetail(item),
                },
              ]
              if (item.status === "PENDING_DILIGENCE") {
                actions.push(
                  {
                    key: "trigger",
                    label: "发起尽调",
                    onClick: () => onTriggerDiligence(item),
                  },
                  {
                    key: "reassign",
                    label: "任务转交",
                    onClick: () => onReassignTask(item),
                  },
                  {
                    key: "manualReject",
                    label: "手动拒绝",
                    tone: "danger",
                    onClick: () => onManualReject(item),
                  },
                )
              }
              if (
                item.status === "IN_PROCESSING" &&
                item.riskConclusion === "REVIEW" &&
                onReviewRisk
              ) {
                actions.push({
                  key: "review",
                  label: "人工复核",
                  onClick: () => onReviewRisk(item),
                })
              }
              if (item.status === "DILIGENCE_SUCCESS") {
                actions.push(
                  {
                    key: "assignFunder",
                    label: "分配资方",
                    onClick: () => onAssignFunder(item),
                  },
                  {
                    key: "report",
                    label: "下载报告",
                    onClick: () => onViewReport(item),
                  },
                )
              }
              if (
                item.status === "DILIGENCE_FAILED" ||
                item.status === "MANUAL_REJECTED"
              ) {
                actions.push({
                  key: "report",
                  label: "下载报告",
                  onClick: () => onViewReport(item),
                })
              }

              return (
                <tr
                  key={item.id}
                  className="group h-[72px] border-b border-border/60 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40"
                >
                  {/* 1. 序号 */}
                  <td className="px-3 py-2 text-center text-xs text-muted-foreground">
                    {startIndex + idx + 1}
                  </td>

                  {/* 2. 产品名称 */}
                  <td className="px-3 py-2">
                    <div
                      className="max-w-[230px] truncate font-medium text-foreground"
                      title={item.productName}
                    >
                      {item.productName}
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      单号：{item.id}
                    </div>
                  </td>

                  {/* 3. 申请人 */}
                  <td className="px-3 py-2">
                    <div
                      className="max-w-[230px] truncate font-medium text-foreground"
                      title={item.applicantName}
                    >
                      {item.applicantName}
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {item.applicantIdentifier}
                    </div>
                  </td>

                  {/* 4. 意向融资金额（元） */}
                  <td className="whitespace-nowrap px-3 py-2 text-right font-medium text-primary">
                    ¥{formatAmount4(item.intendedAmount)}
                  </td>

                  {/* 5. 意向融资期数 */}
                  <td className="whitespace-nowrap px-3 py-2 text-center text-foreground">
                    {item.intendedPeriods}期
                  </td>

                  {/* 6. 抵/质押物 */}
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={
                          item.collateralType === "仓单"
                            ? "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                            : "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        }
                      >
                        {item.collateralType}
                      </Badge>
                      {item.collateralType === "仓单" ? (
                        <button
                          type="button"
                          title="点击调阅关联仓单详情"
                          className="inline-flex max-w-[110px] items-center gap-0.5 truncate text-[11px] text-primary hover:underline"
                          onClick={() => onViewDetail(item)}
                        >
                          <span className="truncate">{receiptNo || "已冻结"}</span>
                          <ExternalLinkIcon className="h-3 w-3 shrink-0" />
                        </button>
                      ) : (
                        <span
                          className="max-w-[110px] truncate text-[11px] text-foreground"
                          title={item.warehouseName || "在库现货存货"}
                        >
                          {item.warehouseName || "在库现货存货"}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 7. 尽调状态 */}
                  <td className="px-3 py-2 text-center">
                    <Badge
                      variant="outline"
                      className={`inline-flex items-center gap-1 whitespace-nowrap font-medium ${statusConfig.badgeClass}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotClass}`}
                      />
                      {statusConfig.label}
                    </Badge>
                  </td>

                  {/* 8. 尽调人员 */}
                  <td className="whitespace-nowrap px-3 py-2 text-center text-foreground">
                    {item.surveyor || "—"}
                  </td>

                  {/* 9. 尽调分配时间 */}
                  <td className="whitespace-nowrap px-3 py-2 text-center text-muted-foreground">
                    <TableDateTimeCell value={item.assignedAt} stackedPlain />
                  </td>

                  {/* 10. 处理时间 */}
                  <td className="whitespace-nowrap px-3 py-2 text-center text-muted-foreground">
                    <TableDateTimeCell value={item.processedAt} stackedPlain />
                  </td>

                  {/* 11. 操作：≤3 钮单行；4 钮 2×2 两行（PC 06 §5.6） */}
                  <td
                    className="sticky right-0 z-20 border-l border-border/80 bg-white px-2 py-2 text-center shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)] transition-colors group-hover:bg-slate-50 dark:bg-slate-900 dark:group-hover:bg-slate-800"
                    style={{
                      width: TABLE_ROW_ACTION_COL_TOTAL_PX,
                      minWidth: TABLE_ROW_ACTION_COL_TOTAL_PX,
                    }}
                  >
                    <TableRowActionPanel actions={actions} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
