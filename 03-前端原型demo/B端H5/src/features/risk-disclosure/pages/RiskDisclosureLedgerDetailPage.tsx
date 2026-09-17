import { useEffect, useMemo, useState } from "react"
import { ShieldAlert } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { Toast } from "@/components/ui/Toast"
import { getRepublishConfirmPath } from "@/features/collateral-warning-events/lib/publish-navigation"
import {
  buildPublishDraftFromWarning,
  isAutoReleaseWarning,
} from "@/features/collateral-warning-events/domain/publish-draft"
import { getCollateralWarningById } from "@/features/collateral-warning-events/lib/detail-utils"
import { getReadonlyRiskRecord } from "@/features/readonly-risk-views/mock/readonly-risk.mock"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { RiskDisclosureDetailContent } from "../components/RiskDisclosureDetailContent"
import {
  buildLedgerDisclosureMeta,
  CANCEL_CONFIRM_MESSAGE,
  resolveSourceWarningId,
  type LedgerDisclosureMeta,
} from "../lib/ledger-detail-utils"

const LIST_PATH = "/m/risk/disclosures"

function buildFallbackSnapshot(record: NonNullable<ReturnType<typeof getReadonlyRiskRecord>>) {
  const warningType =
    record.warningType ??
    record.summary.find((item) => item.label === "预警类型")?.value ??
    "—"
  const warningTime =
    record.summary.find((item) => item.label === "预警时间")?.value ?? "—"
  const processedBy =
    record.summary.find((item) => item.label === "核销处理人")?.value ??
    record.summary.find((item) => item.label === "处理人")?.value ??
    "—"

  return {
    warningTime,
    warningType,
    location: "—",
    deviceName: "无关联设备",
    warningDescription: record.title,
    warningSnapshotImages: [] as string[],
    processedBy,
    releaseMethod: processedBy.includes("系统") ? "系统自动结案" : "人工解除",
    releaseTime: "—",
    situationDescription: "",
    sitePhotos: [] as string[],
    releaseSnapshotImages: [] as string[],
  }
}

export function RiskDisclosureLedgerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const record = useMemo(
    () => (id ? getReadonlyRiskRecord("risk-disclosure", id) : null),
    [id]
  )
  const sourceWarningId = id ? resolveSourceWarningId(id) : null
  const sourceEvent = useMemo(
    () => (sourceWarningId ? getCollateralWarningById(sourceWarningId) : null),
    [sourceWarningId]
  )
  const snapshot = useMemo(() => {
    if (sourceEvent) {
      return buildPublishDraftFromWarning(sourceEvent)
    }
    return record ? buildFallbackSnapshot(record) : null
  }, [record, sourceEvent])

  const initialMeta = useMemo(
    () => (record ? buildLedgerDisclosureMeta(record) : null),
    [record]
  )
  const [meta, setMeta] = useState<LedgerDisclosureMeta | null>(initialMeta)
  const [allExpanded, setAllExpanded] = useState(true)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    setMeta(initialMeta)
  }, [initialMeta])

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  if (!record || !snapshot || !meta) {
    return (
      <MobileShell>
        <NavBar title="风险公示详情" onBack={() => navigate(LIST_PATH)} />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-sm text-gray-500">
          <ShieldAlert className="mb-2 size-12 text-gray-300" />
          <p>未找到对应的风险公示记录</p>
          <button
            type="button"
            onClick={() => navigate(LIST_PATH)}
            className="mt-4 cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
          >
            返回列表
          </button>
        </div>
      </MobileShell>
    )
  }

  const orderNo =
    sourceEvent?.orderNo ??
    record.subtitle.split("·")[0]?.trim() ??
    record.title
  const showReleaseMethod = sourceEvent
    ? isAutoReleaseWarning(sourceEvent)
    : snapshot.processedBy.includes("系统")
  const canCancel = meta.disclosureStatus === "已公示"
  const canRepublish =
    (meta.disclosureStatus === "已公示" || meta.disclosureStatus === "已取消") &&
    Boolean(sourceWarningId)
  const sourceLabel = sourceEvent
    ? `来源押品预警：${sourceEvent.eventId} · ${sourceEvent.orderNo}`
    : null

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["h5-risk-disclosure-detail"]}>
        <NavBar
          title={`${orderNo} 公示详情`}
          onBack={() => navigate(LIST_PATH)}
          right={
            <button
              type="button"
              onClick={() => setAllExpanded((current) => !current)}
              className="cursor-pointer text-xs font-medium text-blue-600 active:opacity-70"
            >
              {allExpanded ? "全部收起" : "全部展开"}
            </button>
          }
        />
      </PrototypeAnnotationTarget>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f4f6f8]">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3.5 py-3 pb-6 overscroll-contain">
          <PrototypeAnnotationTarget annotationIds={["h5-risk-disclosure-detail"]}>
            <RiskDisclosureDetailContent
              orderNo={orderNo}
              sourceLabel={sourceLabel}
              meta={meta}
              snapshot={snapshot}
              showReleaseMethod={showReleaseMethod}
              allExpanded={allExpanded}
              onCopyOrderNo={(value) => {
                navigator.clipboard?.writeText(value)
                showToast(`已复制: ${value}`)
              }}
            />
          </PrototypeAnnotationTarget>
        </div>

        {(canRepublish || canCancel) && (
          <PrototypeAnnotationTarget annotationIds={["h5-risk-disclosure-detail-actions"]}>
            <div className="border-t border-gray-200/90 bg-white px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate(LIST_PATH)}
                  className="cursor-pointer rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-700 active:bg-gray-200"
                >
                  返回列表
                </button>

                {canRepublish && sourceWarningId ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(getRepublishConfirmPath(sourceWarningId), {
                        state: { republish: true },
                      })
                    }
                    className="flex-1 cursor-pointer rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-blue-700"
                  >
                    重新公示 ▸
                  </button>
                ) : null}

                {canCancel ? (
                  <button
                    type="button"
                    onClick={() => setCancelOpen(true)}
                    className="flex-1 cursor-pointer rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white shadow-xs active:bg-orange-700"
                  >
                    取消公示 ▸
                  </button>
                ) : null}
              </div>
            </div>
          </PrototypeAnnotationTarget>
        )}
      </div>

      {cancelOpen ? (
        <PrototypeAnnotationTarget annotationIds={["h5-risk-disclosure-detail-cancel"]}>
          <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-4">
            <div className="w-full rounded-2xl bg-white p-4 shadow-xl">
              <h2 className="text-sm font-bold text-gray-900">取消风险公示</h2>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">
                {CANCEL_CONFIRM_MESSAGE}
              </p>
              <textarea
                className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs"
                rows={4}
                maxLength={200}
                value={cancelReason}
                placeholder="请填写取消公示原因（必填，不超过 200 字）"
                onChange={(event) => setCancelReason(event.target.value)}
              />
              <p className="mt-1 text-right text-[11px] text-gray-400">
                {cancelReason.length}/200
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setCancelOpen(false)}
                  className="flex-1 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700"
                >
                  关闭
                </button>
                <button
                  type="button"
                  disabled={!cancelReason.trim()}
                  onClick={() => {
                    const operatedAt = new Date()
                      .toISOString()
                      .slice(0, 19)
                      .replace("T", " ")
                    const reason = cancelReason.trim()
                    setMeta((current) =>
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
                    showToast(`已取消公示 — ${orderNo}`)
                  }}
                  className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-semibold text-white disabled:opacity-50"
                >
                  确认取消
                </button>
              </div>
            </div>
          </div>
        </PrototypeAnnotationTarget>
      ) : null}

      <Toast message={toastMessage} />
    </MobileShell>
  )
}
