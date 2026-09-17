import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { SectionCard } from "@/components/ui/SectionCard"
import { Toast } from "@/components/ui/Toast"
import type { RiskDisclosurePublishForm } from "@/features/risk-disclosure/domain/publish-form"
import { getCollateralWarningById } from "../lib/detail-utils"
import {
  COLLATERAL_WARNING_LIST_PATH,
  getRepublishConfirmPath,
} from "../lib/publish-navigation"
import {
  buildPublishDraftFromWarning,
  isAutoReleaseWarning,
} from "../domain/publish-draft"
import { DisclosureSnapshotMobileSections } from "@/features/risk-disclosure/components/DisclosureSnapshotMobileSections"
import { extractPublishDraftFromForm } from "../lib/disclosure-snapshot-utils"

type OperationEntry = {
  action: string
  operator: string
  operatedAt: string
  remark: string | null
}

type DisclosureMeta = {
  disclosureStatus: "已公示" | "已取消"
  lastDisclosureTime: string
  lastOperator: string
  cancelReason: string | null
  operationHistory: OperationEntry[]
}

type PublishNavigationState = {
  fromPublish?: boolean
  publishForm?: RiskDisclosurePublishForm
}

function buildMetaFromEvent(warnId: string): DisclosureMeta | null {
  const event = getCollateralWarningById(warnId)
  if (!event || event.publicityStatus !== "已公示") {
    return null
  }

  return {
    disclosureStatus: "已公示",
    lastDisclosureTime: event.processedTime ?? event.warningTime,
    lastOperator: event.processedBy ?? "合规专员（森云科技）",
    cancelReason: null,
    operationHistory: [
      {
        action: "首次公示",
        operator: event.processedBy ?? "合规专员（森云科技）",
        operatedAt: event.processedTime ?? event.warningTime,
        remark: null,
      },
    ],
  }
}

export function CollateralWarningDisclosureDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const navigationState = location.state as PublishNavigationState | null
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const event = useMemo(() => getCollateralWarningById(id), [id])
  const snapshot = useMemo(() => {
    if (navigationState?.publishForm) {
      return extractPublishDraftFromForm(navigationState.publishForm)
    }
    return event ? buildPublishDraftFromWarning(event) : null
  }, [event, navigationState?.publishForm])

  const initialMeta = useMemo(() => {
    if (navigationState?.fromPublish && navigationState.publishForm) {
      const publishedAt = new Date().toISOString().slice(0, 19).replace("T", " ")
      return {
        disclosureStatus: "已公示" as const,
        lastDisclosureTime: publishedAt,
        lastOperator: "当前用户（森云科技）",
        cancelReason: null,
        operationHistory: [
          {
            action: "首次公示",
            operator: "当前用户（森云科技）",
            operatedAt: publishedAt,
            remark: "由押品预警公示确认页提交",
          },
        ],
      }
    }
    return id ? buildMetaFromEvent(id) : null
  }, [id, navigationState?.fromPublish, navigationState?.publishForm])

  const [meta, setMeta] = useState(initialMeta)

  useEffect(() => {
    setMeta(initialMeta)
  }, [initialMeta])

  if (!event || !snapshot || !meta) {
    return (
      <MobileShell>
        <NavBar title="公示详情" onBack={() => navigate(COLLATERAL_WARNING_LIST_PATH)} />
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-gray-500">
          未找到对应的公示记录
        </div>
      </MobileShell>
    )
  }

  const showReleaseMethod = isAutoReleaseWarning(event)
  const canCancel = meta.disclosureStatus === "已公示"
  const canRepublish =
    meta.disclosureStatus === "已公示" || meta.disclosureStatus === "已取消"

  return (
    <MobileShell>
      <NavBar title="风险公示详情" onBack={() => navigate(COLLATERAL_WARNING_LIST_PATH)} />

      <div className="flex flex-1 flex-col min-h-0 overflow-hidden bg-[#f4f6f8]">
        <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 pb-28 overscroll-contain">
          <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-2.5 text-xs text-blue-900">
            来源押品预警：{event.eventId} · {event.orderNo}
          </div>

          <SectionCard title="公示状态" indicatorColor="#f97316">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">公示状态</span>
                <span className="font-semibold text-emerald-700">
                  {meta.disclosureStatus}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">公示时间</span>
                <span className="font-mono text-gray-800">
                  {meta.lastDisclosureTime}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">操作人</span>
                <span className="text-gray-800">{meta.lastOperator}</span>
              </div>
              {meta.cancelReason ? (
                <div className="border-t border-gray-100 pt-2">
                  <span className="text-gray-500">取消说明</span>
                  <p className="mt-1 text-gray-800">{meta.cancelReason}</p>
                </div>
              ) : null}
            </div>
          </SectionCard>

          <DisclosureSnapshotMobileSections
            orderNo={event.orderNo}
            snapshot={snapshot}
            showReleaseMethod={showReleaseMethod}
          />

          <SectionCard title="操作记录" indicatorColor="#6366f1">
            <div className="space-y-2 text-xs">
              {meta.operationHistory.map((entry, index) => (
                <div
                  key={`${entry.action}-${index}`}
                  className="rounded-xl border border-gray-100 bg-white p-2.5"
                >
                  <div className="font-semibold text-gray-900">{entry.action}</div>
                  <div className="mt-1 text-gray-600">{entry.operator}</div>
                  <div className="mt-0.5 font-mono text-[11px] text-gray-500">
                    {entry.operatedAt}
                  </div>
                  {entry.remark ? (
                    <div className="mt-1 text-gray-700">{entry.remark}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="border-t border-gray-200/90 bg-white px-4 py-3 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {canRepublish ? (
              <button
                type="button"
                onClick={() =>
                  navigate(getRepublishConfirmPath(event.eventId), {
                    state: { republish: true },
                  })
                }
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white active:bg-blue-700"
              >
                重新公示
              </button>
            ) : null}
            {canCancel ? (
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white active:bg-rose-700"
              >
                取消公示
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {cancelOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-4">
          <div className="w-full rounded-2xl bg-white p-4 shadow-xl">
            <h2 className="text-sm font-bold text-gray-900">取消风险公示</h2>
            <p className="mt-2 text-xs text-gray-600">
              请填写取消说明，确认后将写入操作记录。
            </p>
            <textarea
              className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-xs"
              rows={4}
              maxLength={200}
              value={cancelReason}
              placeholder="请填写取消公示原因"
              onChange={(e) => setCancelReason(e.target.value)}
            />
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
                  setToastMessage(`已取消公示 — ${event.orderNo}`)
                }}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                确认取消
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <Toast message={toastMessage} />
    </MobileShell>
  )
}

