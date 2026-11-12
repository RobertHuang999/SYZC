import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ExternalLinkIcon,
  InboxIcon,
} from "lucide-react"
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

/**
 * 格式化金额为千分位且保留4位小数
 */
function formatAmount4(val: number): string {
  return new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(val)
}

/**
 * 时间拆分为年月日与时分秒两行呈现
 */
function formatDateTimeTwoLines(val: string) {
  if (!val) return { date: "--", time: "" }
  const parts = val.split(" ")
  if (parts.length === 2) {
    return { date: parts[0], time: parts[1] }
  }
  return { date: val, time: "" }
}

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
    <div className="relative overflow-x-auto rounded-lg border border-border/70 bg-card shadow-xs">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <tr>
            <th className="w-14 px-3 py-3 text-center">序号</th>
            <th className="min-w-[170px] px-3 py-3">产品名称</th>
            <th className="min-w-[170px] px-3 py-3">申请人</th>
            <th className="min-w-[140px] px-3 py-3 text-right">
              意向融资金额
            </th>
            <th className="w-24 px-3 py-3 text-center">意向融资期数</th>
            <th className="min-w-[140px] px-3 py-3">货物</th>
            <th className="min-w-[120px] px-3 py-3">申请时间</th>
            <th className="w-24 px-3 py-3 text-center">授信金额</th>
            <th className="w-20 px-3 py-3 text-center">授信期数</th>
            <th className="w-24 px-3 py-3 text-center">贷款金额</th>
            <th className="w-20 px-3 py-3 text-center">贷款期数</th>
            <th className="w-28 px-3 py-3 text-center">状态</th>
            <th className="sticky right-0 z-10 min-w-[210px] bg-slate-100 px-3 py-3 text-center shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] dark:bg-slate-800">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {data.map((item, idx) => {
            const statusConfig = DILIGENCE_STATUS_CONFIG[item.status]
            const appliedTime = formatDateTimeTwoLines(item.appliedAt || item.assignedAt)

            return (
              <tr
                key={item.id}
                className="group h-[72px] transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                {/* 1. 序号 */}
                <td className="px-3 py-2 text-center text-xs text-muted-foreground">
                  {startIndex + idx + 1}
                </td>

                {/* 2. 产品名称 */}
                <td className="px-3 py-2">
                  <div className="line-clamp-2 text-xs font-medium text-foreground">
                    {item.productName}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    单号：{item.id}
                  </div>
                </td>

                {/* 3. 申请人 */}
                <td className="px-3 py-2">
                  <div className="line-clamp-2 text-xs font-medium text-foreground">
                    {item.applicantName}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {item.applicantIdentifier}
                  </div>
                </td>

                {/* 4. 意向融资金额 */}
                <td className="px-3 py-2 text-right">
                  <span className="text-xs font-semibold text-foreground">
                    ¥{formatAmount4(item.intendedAmount)}
                  </span>
                </td>

                {/* 5. 意向融资期数 */}
                <td className="px-3 py-2 text-center text-xs text-foreground">
                  {item.intendedPeriods}期
                </td>

                {/* 6. 货物 */}
                <td className="px-3 py-2">
                  <div className="line-clamp-2 text-xs text-foreground">
                    {item.goodsName || item.inventoryDetails?.[0]?.subcategory || "大宗货物"}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {item.collateralType === "仓单" ? (
                      <span
                        title="点击调阅关联仓单详情"
                        className="inline-flex cursor-pointer items-center gap-0.5 text-blue-600 hover:underline dark:text-blue-400"
                        onClick={() => onViewDetail(item)}
                      >
                        仓单：{item.warehouseReceiptNo || "已冻结"}
                        <ExternalLinkIcon className="h-3 w-3" />
                      </span>
                    ) : (
                      <span>形态：在库现货存货</span>
                    )}
                  </div>
                </td>

                {/* 7. 申请时间 */}
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  <div>{appliedTime.date}</div>
                  <div className="text-[11px] text-slate-500">
                    {appliedTime.time}
                  </div>
                </td>

                {/* 8. 授信金额 (对齐现网，未发生时展示 "--") */}
                <td className="px-3 py-2 text-center text-xs text-muted-foreground">
                  {item.creditAmount ? `¥${formatAmount4(item.creditAmount)}` : "--"}
                </td>

                {/* 9. 授信期数 (对齐现网，未发生时展示 "--") */}
                <td className="px-3 py-2 text-center text-xs text-muted-foreground">
                  {item.creditPeriods ? `${item.creditPeriods}期` : "--"}
                </td>

                {/* 10. 贷款金额 (对齐现网，未发生时展示 "--") */}
                <td className="px-3 py-2 text-center text-xs text-muted-foreground">
                  {item.loanAmount ? `¥${formatAmount4(item.loanAmount)}` : "--"}
                </td>

                {/* 11. 贷款期数 (对齐现网，未发生时展示 "--") */}
                <td className="px-3 py-2 text-center text-xs text-muted-foreground">
                  {item.loanPeriods ? `${item.loanPeriods}期` : "--"}
                </td>

                {/* 12. 状态 */}
                <td className="px-3 py-2 text-center">
                  <Badge
                    variant="outline"
                    className={`gap-1 px-2 py-0.5 text-[11px] font-normal ${statusConfig.badgeClass}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${statusConfig.dotClass}`}
                    />
                    {statusConfig.label}
                  </Badge>
                </td>

                {/* 13. 操作列 (Sticky 不透明实色背景防穿透) */}
                <td className="sticky right-0 z-10 bg-white px-3 py-2 shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] group-hover:bg-slate-50 dark:bg-slate-900 dark:group-hover:bg-slate-800/80">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {/* 查看详情 */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetail(item)}
                      className="h-7 px-2 text-xs text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      查看
                    </Button>

                    {/* 待尽调状态操作 */}
                    {item.status === "PENDING_DILIGENCE" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onTriggerDiligence(item)}
                          className="h-7 px-2 text-xs font-medium text-primary hover:bg-primary/10 hover:text-primary"
                        >
                          发起尽调
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onReassignTask(item)}
                          className="h-7 px-2 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300"
                        >
                          任务转交
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onManualReject(item)}
                          className="h-7 px-2 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400"
                        >
                          手动拒绝
                        </Button>
                      </>
                    )}

                    {/* 受理中状态操作 */}
                    {item.status === "IN_PROCESSING" && (
                      <>
                        {item.riskConclusion === "REVIEW" && onReviewRisk && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onReviewRisk(item)}
                            className="h-7 px-2 text-xs font-medium text-purple-600 hover:bg-purple-50 hover:text-purple-700 dark:text-purple-400"
                          >
                            人工复核
                          </Button>
                        )}
                        <span className="text-[11px] text-muted-foreground">
                          智风控核验中
                        </span>
                      </>
                    )}

                    {/* 受理成功状态操作 */}
                    {item.status === "DILIGENCE_SUCCESS" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAssignFunder(item)}
                          className="h-7 px-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400"
                        >
                          分配给资方
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewReport(item)}
                          className="h-7 px-2 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300"
                        >
                          下载报告
                        </Button>
                      </>
                    )}

                    {/* 受理失败与申请失败操作 */}
                    {(item.status === "DILIGENCE_FAILED" ||
                      item.status === "MANUAL_REJECTED") && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewReport(item)}
                          className="h-7 px-2 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300"
                        >
                          下载报告
                        </Button>
                        <span
                          title="已可靠归档沉淀至被拒退回池等待人工重调度"
                          className="inline-flex items-center text-[11px] text-rose-500"
                        >
                          已入被拒池
                        </span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
