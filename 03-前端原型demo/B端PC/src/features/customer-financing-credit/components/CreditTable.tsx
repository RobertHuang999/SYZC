import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TableRowActionPanel,
  type TableRowActionItem,
} from "@/shared/components/TableRowActionPanel"
import { STATUS_META, formatCurrency } from "../domain/constants"
import type { CustomerFinancingCredit } from "../domain/types"
import {
  CopyIcon,
  CheckIcon,
  AlertTriangleIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
  LockIcon,
} from "lucide-react"

interface CreditTableProps {
  data: CustomerFinancingCredit[]
  total: number
  page: number
  pageSize: number
  onViewDetail: (item: CustomerFinancingCredit) => void
  onApproveCredit: (item: CustomerFinancingCredit) => void
  onRejectCredit: (item: CustomerFinancingCredit) => void
  onChangeToFailed: (item: CustomerFinancingCredit) => void
  onChangeToSuccess: (item: CustomerFinancingCredit) => void
  onResetFilters: () => void
}

export function CreditTable({
  data,
  page,
  pageSize,
  onViewDetail,
  onApproveCredit,
  onRejectCredit,
  onChangeToFailed,
  onChangeToSuccess,
  onResetFilters,
}: CreditTableProps) {
  const navigate = useNavigate()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    setTimeout(() => setCopiedId(null), 1800)
  }

  const handleWarehouseReceiptClick = (receiptNo: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/仓储/仓单管理?receiptNo=${encodeURIComponent(receiptNo)}`)
  }

  if (data.length === 0) {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center rounded-lg border border-dashed border-border/80 bg-card p-8 text-center shadow-xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
          <AlertTriangleIcon className="h-6 w-6" />
        </div>
        <h4 className="mt-3 text-base font-medium text-foreground">
          暂无匹配的授信办理记录
        </h4>
        <p className="mt-1 text-xs text-muted-foreground">
          未能匹配到符合当前筛选条件的申请单据，可尝试清空筛选重试。
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="mt-4 gap-1.5 text-xs"
        >
          <RefreshCwIcon className="h-3.5 w-3.5" />
          重置全部筛选条件
        </Button>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden rounded-md border border-border/70 bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-foreground">
          {/* 表头：全部强制 whitespace-nowrap 防折断换行 */}
          <thead className="bg-slate-100 text-xs font-semibold text-muted-foreground dark:bg-slate-800">
            <tr>
              <th className="w-14 px-3 py-3 text-center whitespace-nowrap">序号</th>
              <th className="min-w-[180px] px-3 py-3 whitespace-nowrap">产品名称</th>
              <th className="w-20 px-3 py-3 text-center whitespace-nowrap">需要尽调</th>
              <th className="w-24 px-3 py-3 text-center whitespace-nowrap">申请人类型</th>
              <th className="min-w-[200px] px-3 py-3 whitespace-nowrap">申请人</th>
              <th className="w-24 px-3 py-3 text-center whitespace-nowrap">抵/质押物</th>
              <th className="min-w-[140px] px-3 py-3 text-right whitespace-nowrap">
                意向融资金额（元）
              </th>
              <th className="w-28 px-3 py-3 text-center whitespace-nowrap">意向融资期数</th>
              <th className="min-w-[140px] px-3 py-3 text-right whitespace-nowrap">
                授信金额（元）
              </th>
              <th className="w-24 px-3 py-3 text-center whitespace-nowrap">授信期数</th>
              <th className="w-28 px-3 py-3 text-center whitespace-nowrap">融资状态</th>
              <th className="min-w-[140px] px-3 py-3 whitespace-nowrap">处理人员</th>
              <th className="min-w-[150px] px-3 py-3 whitespace-nowrap">处理时间</th>
              {/* 操作列 Sticky 右固定，防折行 */}
              <th className="sticky right-0 z-20 w-[190px] min-w-[190px] bg-slate-100 px-3 py-3 text-center shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.06)] dark:bg-slate-800 whitespace-nowrap">
                操作
              </th>
            </tr>
          </thead>

          {/* 表体：单行高度统一 72px，关键数据全部 whitespace-nowrap */}
          <tbody className="divide-y divide-border/60">
            {data.map((item, index) => {
              const meta = STATUS_META[item.status]
              const seq = (page - 1) * pageSize + index + 1
              const actions: TableRowActionItem[] = [
                { key: "detail", label: "查看", onClick: () => onViewDetail(item) },
              ]
              if (item.status === "CREDIT_ACCEPTED") {
                actions.push(
                  {
                    key: "approve",
                    label: "标记成功",
                    onClick: () => onApproveCredit(item),
                  },
                  {
                    key: "reject",
                    label: "标记失败",
                    tone: "danger",
                    onClick: () => onRejectCredit(item),
                  },
                )
              } else if (item.status === "APPLY_SUCCESS") {
                actions.push(
                  item.isDownstreamTriggered
                    ? {
                        key: "locked",
                        label: "已锁定",
                        disabled: true,
                        title: "下游已发起线上抵质押确认，改标已永久锁定",
                      }
                    : {
                        key: "toFailed",
                        label: "改标失败",
                        tone: "amber",
                        onClick: () => onChangeToFailed(item),
                      },
                )
              } else if (item.status === "APPLY_FAILED") {
                actions.push(
                  item.isRescheduledInPool
                    ? {
                        key: "rescheduled",
                        label: "已重调度",
                        disabled: true,
                        title: "单据已被被拒池重新调度流转，不可改标",
                      }
                    : {
                        key: "toSuccess",
                        label: "改标成功",
                        onClick: () => onChangeToSuccess(item),
                      },
                )
              }
              return (
                <tr
                  key={item.id}
                  className="group h-[72px] transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-900/60"
                >
                  {/* 1. 序号 */}
                  <td className="px-3 py-2 text-center text-muted-foreground whitespace-nowrap">
                    {seq}
                  </td>

                  {/* 2. 产品名称 */}
                  <td className="px-3 py-2">
                    <div className="flex flex-col max-w-[200px]">
                      <span
                        className="font-medium text-foreground truncate"
                        title={item.productName}
                      >
                        {item.productName}
                      </span>
                      <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
                        <span className="font-normal select-all">{item.id}</span>
                        <button
                          type="button"
                          onClick={(e) => handleCopy(item.id, e)}
                          title="复制授信编号"
                          className="text-muted-foreground hover:text-foreground inline-flex items-center"
                        >
                          {copiedId === item.id ? (
                            <CheckIcon className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <CopyIcon className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* 3. 需要尽调 */}
                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    {item.needDiligence ? (
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-[11px] font-normal text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      >
                        是
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[11px] font-normal text-muted-foreground"
                      >
                        否
                      </Badge>
                    )}
                  </td>

                  {/* 4. 申请人类型 */}
                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    <Badge
                      variant="secondary"
                      className="text-[11px] font-normal"
                    >
                      {item.applicantType}
                    </Badge>
                  </td>

                  {/* 5. 申请人全称与联系方式 */}
                  <td className="px-3 py-2">
                    <div className="flex flex-col max-w-[220px]">
                      <span
                        className="font-medium text-foreground truncate"
                        title={item.applicantName}
                      >
                        {item.applicantName}
                      </span>
                      <span className="mt-0.5 text-[11px] text-muted-foreground whitespace-nowrap">
                        经办: {item.agentName} ({item.agentPhone})
                      </span>
                    </div>
                  </td>

                  {/* 6. 抵/质押物 */}
                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    {item.collateralType === "仓单" &&
                    item.warehouseReceiptDetails ? (
                      <button
                        type="button"
                        onClick={(e) =>
                          handleWarehouseReceiptClick(
                            item.warehouseReceiptDetails!.receiptNo,
                            e
                          )
                        }
                        title={`穿透查看仓单: ${item.warehouseReceiptDetails.receiptNo}`}
                        className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                      >
                        <span>仓单</span>
                        <ExternalLinkIcon className="h-3 w-3" />
                      </button>
                    ) : (
                      <span className="text-foreground">存货</span>
                    )}
                  </td>

                  {/* 7. 意向融资金额 */}
                  <td className="px-3 py-2 text-right font-medium text-foreground whitespace-nowrap">
                    {formatCurrency(item.intendedAmount)}
                  </td>

                  {/* 8. 意向融资期数 */}
                  <td className="px-3 py-2 text-center text-foreground whitespace-nowrap">
                    {item.intendedPeriods}期
                  </td>

                  {/* 9. 授信金额 */}
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    {item.creditAmount !== null ? (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(item.creditAmount)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </td>

                  {/* 10. 授信期数 */}
                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    {item.creditPeriods !== null ? (
                      <span className="font-medium text-foreground">
                        {item.creditPeriods}期
                      </span>
                    ) : (
                      <span className="text-muted-foreground">--</span>
                    )}
                  </td>

                  {/* 11. 融资状态 */}
                  <td className="px-3 py-2 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-medium ${meta.className}`}
                    >
                      {meta.label}
                    </span>
                    {item.isDownstreamTriggered && (
                      <div className="mt-1 flex items-center justify-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        <LockIcon className="h-2.5 w-2.5" />
                        <span>抵质押已锁定</span>
                      </div>
                    )}
                  </td>

                  {/* 12. 处理人员 */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className="text-muted-foreground max-w-[140px] truncate block"
                      title={item.processor || "--"}
                    >
                      {item.processor || "--"}
                    </span>
                  </td>

                  {/* 13. 处理时间 */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="text-muted-foreground">
                      {item.processedAt || "--"}
                    </span>
                  </td>

                  {/* 14. 操作列 Sticky（统一行操作样式，直出不超过 3 个） */}
                  <td className="sticky right-0 z-20 w-[196px] min-w-[196px] whitespace-nowrap border-l border-border/80 bg-white px-2 py-2 text-center shadow-[-8px_0_16px_-4px_rgba(0,0,0,0.08)] group-hover:bg-slate-50 dark:bg-slate-900 dark:group-hover:bg-slate-900">
                    <TableRowActionPanel actions={actions} fixedCols={3} maxInline={3} />
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
