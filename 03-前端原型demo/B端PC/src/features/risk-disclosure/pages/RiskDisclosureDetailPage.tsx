import { useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeftIcon, ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import { DISCLOSURE_STATUS_BADGE_CLASS } from "../domain/constants"
import { getRiskDisclosureById } from "../lib/detail-utils"

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { riskDisclosureDetailAnnotations } from "../annotations/risk-disclosure-detail.annotations"
import { riskDisclosureDocuments } from "../documents/risk-disclosure-documents"

const CANCEL_CONFIRM_MESSAGE =
  "您正在操作取消风险公示，确认后风险公示列表将取消显示当前操作的风险内容，点击确认按钮后生效。"

export function RiskDisclosureDetailPage() {
  const { id } = useParams()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const record = useMemo(() => getRiskDisclosureById(id), [id])

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  if (!record) {
    return (
      <div className="space-y-4 p-6">
        <Link to="/物联网IOT与预警/预警信息/风险公示">
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的风险公示记录
        </div>
      </div>
    )
  }

  const canCancel = record.disclosureStatus === "已公示"

  return (
    <PrototypeAnnotationProvider
      title="风险公示详情 · 原型批注"
      annotations={riskDisclosureDetailAnnotations}
      documents={riskDisclosureDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["risk-disclosure-detail-header", "risk-disclosure-detail-cancel-dialog"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {record.disclosureTitle}
              </h1>
              <Badge
                variant="outline"
                className={DISCLOSURE_STATUS_BADGE_CLASS[record.disclosureStatus]}
              >
                {record.disclosureStatus}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/物联网IOT与预警/预警信息/风险公示">
                <Button variant="outline">
                  <ArrowLeftIcon />
                  返回
                </Button>
              </Link>
              {canCancel && (
                <Button variant="destructive" onClick={() => setCancelOpen(true)}>
                  取消公示
                </Button>
              )}
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["risk-disclosure-detail-info"]}>
          <DetailSection title="公示信息">
            <DetailField label="公示标题">{record.disclosureTitle}</DetailField>
            <DetailField label="预警订单">{record.orderNo}</DetailField>
            <DetailField label="货主">{record.ownerName}</DetailField>
            <DetailField label="规则名称">{record.ruleName}</DetailField>
            <DetailField label="公示状态">
              <Badge
                variant="outline"
                className={DISCLOSURE_STATUS_BADGE_CLASS[record.disclosureStatus]}
              >
                {record.disclosureStatus}
              </Badge>
            </DetailField>
            <DetailField label="公示时间">
              {formatEmptyValue(record.lastDisclosureTime)}
            </DetailField>
            <DetailField label="操作人">
              {formatEmptyValue(record.lastOperator)}
            </DetailField>
            <DetailField label="公示内容">
              <p className="whitespace-pre-wrap">{record.disclosureContent}</p>
            </DetailField>
            {record.cancelReason && (
              <DetailField label="取消说明">{record.cancelReason}</DetailField>
            )}
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["risk-disclosure-detail-snapshot"]}>
          <DetailSection title="原预警快照">
            <DetailField label="预警类型">
              {record.originalWarning.warningType}
            </DetailField>
            <DetailField label="预警内容">
              {record.originalWarning.warningContent}
            </DetailField>
            <DetailField label="预警时间">
              {record.originalWarning.warningTime}
            </DetailField>
            <DetailField label="处理时间">
              {record.originalWarning.processedTime}
            </DetailField>
            <DetailField label="处理人">
              {record.originalWarning.processedBy}
            </DetailField>
            <DetailField label="预警抓拍">
              {record.originalWarning.snapshotImageStatus === "available" ? (
                <span className="inline-flex items-center gap-1 text-primary">
                  <ImageIcon className="size-4" />
                  查看原预警抓拍
                </span>
              ) : (
                "—"
              )}
            </DetailField>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["risk-disclosure-detail-history"]}>
          <DetailSection title="操作历史">
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>操作</TableHead>
                    <TableHead>操作人</TableHead>
                    <TableHead>操作时间</TableHead>
                    <TableHead>备注</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {record.operationHistory.map((entry, index) => (
                    <TableRow key={`${entry.action}-${index}`}>
                      <TableCell>{entry.action}</TableCell>
                      <TableCell>{entry.operator}</TableCell>
                      <TableCell>{entry.operatedAt}</TableCell>
                      <TableCell>{formatEmptyValue(entry.remark)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DetailSection>
        </PrototypeAnnotationTarget>

        <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>取消风险公示</DialogTitle>
              <DialogDescription>{CANCEL_CONFIRM_MESSAGE}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="cancel-reason">
                取消公示说明（必填，不超过 200 字）
              </label>
              <Textarea
                id="cancel-reason"
                value={cancelReason}
                maxLength={200}
                rows={4}
                placeholder="请填写取消公示原因"
                onChange={(event) => setCancelReason(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {cancelReason.length}/200
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelOpen(false)}>
                取消
              </Button>
              <Button
                variant="destructive"
                disabled={!cancelReason.trim()}
                onClick={() => {
                  setCancelOpen(false)
                  setCancelReason("")
                  showToast(`已取消公示 — ${record.orderNo}`)
                }}
              >
                确认取消
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
