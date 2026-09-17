import { useEffect, useMemo, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { ArrowLeftIcon } from "lucide-react"
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
import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import type { RiskDisclosurePublishForm } from "@/features/risk-disclosure/domain/publish-form"
import { DISCLOSURE_STATUS_BADGE_CLASS } from "@/features/risk-disclosure/domain/constants"
import type { RiskDisclosureRecordDetail } from "@/features/risk-disclosure/domain/types"
import { riskDisclosureDetailAnnotations } from "@/features/risk-disclosure/annotations/risk-disclosure-detail.annotations"
import { riskDisclosureDocuments } from "@/features/risk-disclosure/documents/risk-disclosure-documents"
import { DisclosureSnapshotViewContent } from "@/shared/components/DisclosureSnapshotViewContent"
import { isAutoReleaseWarning } from "../domain/publish-draft"
import { getDisclosureDetailByWarningId } from "../lib/disclosure-detail-utils"
import { getPublishedSnapshotByWarningId } from "../lib/disclosure-snapshot-utils"
import {
  COLLATERAL_WARNING_LIST_PATH,
  getCollateralWarningDetailPath,
  getRepublishConfirmPath,
} from "../lib/publish-navigation"
import { getCollateralWarningById } from "../lib/detail-utils"
const CANCEL_CONFIRM_MESSAGE =
  "您正在操作取消风险公示，确认后风险公示列表将取消显示当前操作的风险内容，点击确认按钮后生效。"

type PublishNavigationState = {
  fromPublish?: boolean
  publishForm?: RiskDisclosurePublishForm
}

function buildRecordFromPublishForm(
  warnId: string,
  form: RiskDisclosurePublishForm
): RiskDisclosureRecordDetail {
  const event = getCollateralWarningById(warnId)
  const publishedAt = new Date().toISOString().slice(0, 19).replace("T", " ")

  return {
    recordId: `cw-pub-${warnId}`,
    sourceWarningId: warnId,
    ruleName: event?.ruleName ?? "未命名规则",
    orderNo: form.orderNo,
    ownerName: event?.orderSnapshot.ownerCompany ?? "—",
    warningType: (event?.warningType ??
      "价格下跌") as RiskDisclosureRecordDetail["warningType"],
    warningContent: form.warningDescription,
    snapshotImageStatus:
      form.warningSnapshotImages.length > 0 ? "available" : "none",
    warningTime: form.warningTime,
    processedTime: form.releaseTime,
    processedBy: form.processedBy,
    disclosureStatus: "已公示",
    lastDisclosureTime: publishedAt,
    lastOperator: "当前用户（森云科技）",
    disclosureTitle: `${form.warningType} — ${form.orderNo}`,
    disclosureContent: form.warningDescription,
    originalWarning: {
      warningType: event?.warningType ?? form.warningType,
      warningContent: form.warningDescription,
      warningTime: form.warningTime,
      processedTime: form.releaseTime,
      processedBy: form.processedBy,
      snapshotImageStatus:
        form.warningSnapshotImages.length > 0 ? "available" : "none",
    },
    operationHistory: [
      {
        action: "首次公示",
        operator: "当前用户（森云科技）",
        operatedAt: publishedAt,
        remark: "由押品预警公示确认页提交",
      },
    ],
    cancelReason: null,
  }
}

export function CollateralWarningDisclosureDetailPage() {
  const { warnId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const navigationState = location.state as PublishNavigationState | null
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const initialRecord = useMemo(() => {
    if (navigationState?.fromPublish && navigationState.publishForm && warnId) {
      return buildRecordFromPublishForm(warnId, navigationState.publishForm)
    }
    return getDisclosureDetailByWarningId(warnId)
  }, [navigationState?.fromPublish, navigationState?.publishForm, warnId])

  const [record, setRecord] = useState(initialRecord)

  useEffect(() => {
    setRecord(initialRecord)
  }, [initialRecord])

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const event = useMemo(() => getCollateralWarningById(warnId), [warnId])
  const publishSnapshot = useMemo(
    () =>
      warnId
        ? getPublishedSnapshotByWarningId(
            warnId,
            navigationState?.publishForm
          )
        : null,
    [navigationState?.publishForm, warnId]
  )

  if (!record || !event || !publishSnapshot) {
    return (
      <div className="space-y-4 p-6">
        <Link to={COLLATERAL_WARNING_LIST_PATH}>
          <Button variant="outline">
            <ArrowLeftIcon />
            返回
          </Button>
        </Link>
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          未找到对应的公示记录
        </div>
      </div>
    )
  }

  const canCancel = record.disclosureStatus === "已公示"
  const canRepublish =
    record.disclosureStatus === "已公示" || record.disclosureStatus === "已取消"

  return (
    <PrototypeAnnotationProvider
      title="押品预警 · 公示详情 · 原型批注"
      annotations={riskDisclosureDetailAnnotations}
      documents={riskDisclosureDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["risk-disclosure-detail-header"]}>
          <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                风险公示详情
              </h1>
              <Badge
                variant="outline"
                className={DISCLOSURE_STATUS_BADGE_CLASS[record.disclosureStatus]}
              >
                {record.disclosureStatus}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to={COLLATERAL_WARNING_LIST_PATH}>
                <Button variant="outline">
                  <ArrowLeftIcon />
                  返回列表
                </Button>
              </Link>
              <Link to={getCollateralWarningDetailPath(event.eventId)}>
                <Button variant="outline">预警详情</Button>
              </Link>
              {canRepublish ? (
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate(getRepublishConfirmPath(event.eventId), {
                      state: { republish: true },
                    })
                  }
                >
                  重新公示
                </Button>
              ) : null}
              {canCancel ? (
                <Button variant="destructive" onClick={() => setCancelOpen(true)}>
                  取消公示
                </Button>
              ) : null}
            </div>
          </div>
        </PrototypeAnnotationTarget>

        <div className="rounded-lg border border-blue-200 bg-blue-50/70 px-4 py-3 text-sm text-blue-900">
          来源押品预警：{event.eventId} · {event.orderNo} · 已结案 · 有效
        </div>

        <PrototypeAnnotationTarget annotationIds={["risk-disclosure-detail-info"]}>
        <DetailSection title="公示状态">
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
          {record.cancelReason ? (
            <DetailField label="取消说明">{record.cancelReason}</DetailField>
          ) : null}
        </DetailSection>

        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["risk-disclosure-detail-snapshot"]}>
        <DisclosureSnapshotViewContent
          orderNo={event.orderNo}
          snapshot={publishSnapshot}
          showReleaseMethod={isAutoReleaseWarning(event)}
        />
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["risk-disclosure-detail-history"]}>
        <DetailSection title="操作记录">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>操作类型</TableHead>
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
                关闭
              </Button>
              <Button
                variant="destructive"
                disabled={!cancelReason.trim()}
                onClick={() => {
                  const operatedAt = new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ")
                  const reason = cancelReason.trim()
                  setRecord((current) =>
                    current
                      ? {
                          ...current,
                          disclosureStatus: "已取消",
                          cancelReason: reason,
                          lastOperator: "当前用户（森云科技）",
                          lastDisclosureTime: operatedAt,
                          operationHistory: [
                            {
                              action: "取消公示",
                              operator: "当前用户（森云科技）",
                              operatedAt,
                              remark: reason,
                            },
                            ...current.operationHistory,
                          ],
                        }
                      : current
                  )
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

        {toastMessage ? (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        ) : null}
      </div>
    </PrototypeAnnotationProvider>
  )
}
