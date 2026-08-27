import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeftIcon, InfoIcon } from "lucide-react"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import { EXECUTION_STATUS_BADGE_CLASS } from "../domain/constants"
import { canExecute } from "../lib/record-utils"
import { getMidLoanRiskById } from "../lib/detail-utils"
import { hasSupplementPending } from "../mock/mid-loan-risk-record-details.mock"

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { midLoanRiskDetailAnnotations } from "../annotations/mid-loan-risk-detail.annotations"
import { midLoanRiskDocuments } from "../documents/mid-loan-risk-documents"

export function MidLoanRiskDetailPage() {
  const { id } = useParams()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const record = useMemo(() => getMidLoanRiskById(id), [id])
  const executable = record ? canExecute(record) : false
  const showTaskCenterLink = record ? hasSupplementPending(record) : false

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  if (!record) {
    return (
      <div className="space-y-4 p-6">
        <Link to="/预警信息/贷中风控管理">
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的贷中风控管理记录
        </div>
      </div>
    )
  }

  return (
    <PrototypeAnnotationProvider
      title="贷中风控详情 · 原型批注"
      annotations={midLoanRiskDetailAnnotations}
      documents={midLoanRiskDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["mid-loan-risk-detail-header", "mid-loan-risk-detail-actions"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                贷中风控 · {record.orderNo}
              </h1>
              <Badge
                variant="outline"
                className={EXECUTION_STATUS_BADGE_CLASS[record.lastExecutionStatus]}
              >
                {record.lastExecutionStatus}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/预警信息/贷中风控管理">
                <Button variant="outline">
                  <ArrowLeftIcon />
                  返回
                </Button>
              </Link>
              <Button
                disabled={!executable}
                onClick={() => showToast(`已提交执行 — ${record.orderNo}`)}
              >
                执行
              </Button>
              {showTaskCenterLink && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    showToast("联登任务中心 — 贷中风控受理")
                  }
                >
                  联登任务中心
                </Button>
              )}
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["mid-loan-risk-detail-order"]}>
          <DetailSection title="订单信息">
            <DetailField label="订单号">{record.orderNo}</DetailField>
            <DetailField label="货主名称">{record.ownerName}</DetailField>
            <DetailField label="货主标识">{record.ownerId}</DetailField>
            <DetailField label="押品信息">{record.collateralInfo}</DetailField>
            <DetailField label="订单类型">{record.orderType}</DetailField>
            <DetailField label="订单创建时间">{record.orderCreatedAt}</DetailField>
            <DetailField label="风控模型">{record.riskModel}</DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["mid-loan-risk-detail-eligibility"]}>
          <DetailSection title="执行资格">
            <DetailField label="是否可执行">
              <div className="flex items-center gap-2">
                <span>{record.executability}</span>
                {record.executability === "不可执行" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="inline-flex">
                        <InfoIcon className="size-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {record.ineligibilityReason ??
                          "订单状态或配置不满足执行条件"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </DetailField>
            <DetailField label="执行次数">{record.executionCount}</DetailField>
            <DetailField label="预警次数">{record.warningCount}</DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["mid-loan-risk-detail-latest"]}>
          <DetailSection title="最近执行状态">
            <DetailField label="执行状态">
              <Badge
                variant="outline"
                className={EXECUTION_STATUS_BADGE_CLASS[record.lastExecutionStatus]}
              >
                {record.lastExecutionStatus}
              </Badge>
            </DetailField>
            <DetailField label="最近执行时间">
              {formatEmptyValue(record.lastExecutionTime)}
            </DetailField>
            <DetailField label="最近提交人">
              {formatEmptyValue(record.lastSubmittedBy)}
            </DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["mid-loan-risk-detail-history"]}>
          <DetailSection title="执行历史">
            {record.executionHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">暂无执行历史</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>提交时间</TableHead>
                      <TableHead>提交人</TableHead>
                      <TableHead>执行状态</TableHead>
                      <TableHead>模型分数</TableHead>
                      <TableHead>结果描述</TableHead>
                      <TableHead>智风控任务号</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {record.executionHistory.map((entry) => (
                      <TableRow key={entry.executionId}>
                        <TableCell>{entry.submittedAt}</TableCell>
                        <TableCell>{entry.submittedBy}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={EXECUTION_STATUS_BADGE_CLASS[entry.status]}
                          >
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {entry.modelScore !== null ? entry.modelScore : "—"}
                        </TableCell>
                        <TableCell>
                          {formatEmptyValue(entry.resultDescription)}
                        </TableCell>
                        <TableCell>{formatEmptyValue(entry.zfkTaskNo)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
