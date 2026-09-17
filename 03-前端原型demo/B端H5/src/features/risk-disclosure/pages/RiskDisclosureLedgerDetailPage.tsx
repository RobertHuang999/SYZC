import { useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { MobileShell } from "@/components/layout/MobileShell"
import { NavBar } from "@/components/layout/NavBar"
import { SectionCard } from "@/components/ui/SectionCard"
import { PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import {
  buildPublishDraftFromWarning,
  isAutoReleaseWarning,
} from "@/features/collateral-warning-events/domain/publish-draft"
import { getCollateralWarningById } from "@/features/collateral-warning-events/lib/detail-utils"
import { getReadonlyRiskRecord } from "@/features/readonly-risk-views/mock/readonly-risk.mock"
import { DisclosureSnapshotMobileSections } from "../components/DisclosureSnapshotMobileSections"
import { resolveSourceWarningId } from "../lib/ledger-detail-utils"

const LIST_PATH = "/m/risk/disclosures"

function buildFallbackSnapshot(record: NonNullable<ReturnType<typeof getReadonlyRiskRecord>>) {
  const warningType =
    record.summary.find((item) => item.label === "预警类型")?.value ?? "—"
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

  if (!record || !snapshot) {
    return (
      <MobileShell>
        <NavBar title="风险公示详情" onBack={() => navigate(LIST_PATH)} />
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-gray-500">
          未找到对应的风险公示记录
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
  const statusField = record.summary.find((item) => item.label === "公示状态")
  const disclosureTime =
    record.summary.find((item) => item.label === "最近一次公示时间")?.value ??
    record.summary.find((item) => item.label === "公示时间")?.value ??
    "—"
  const operator =
    record.summary.find((item) => item.label === "最新操作人")?.value ?? "—"

  return (
    <MobileShell>
      <PrototypeAnnotationTarget annotationIds={["h5-risk-disclosure-detail"]}>
        <NavBar title="风险公示详情" onBack={() => navigate(LIST_PATH)} />
      </PrototypeAnnotationTarget>

      <div className="flex flex-1 flex-col min-h-0 overflow-hidden bg-[#f4f6f8]">
        <div className="flex-1 min-h-0 space-y-3 overflow-y-auto px-3.5 py-3 pb-6 overscroll-contain">
          {sourceEvent ? (
            <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-2.5 text-xs text-blue-900">
              来源押品预警：{sourceEvent.eventId} · {sourceEvent.orderNo}
            </div>
          ) : null}

          <SectionCard title="公示状态" indicatorColor="#f97316">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">公示状态</span>
                <span className="font-semibold text-emerald-700">
                  {statusField?.value ?? record.status}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">公示时间</span>
                <span className="font-mono text-gray-800">{disclosureTime}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-gray-500">操作人</span>
                <span className="text-gray-800">{operator}</span>
              </div>
            </div>
          </SectionCard>

          <PrototypeAnnotationTarget annotationIds={["h5-risk-disclosure-detail"]}>
            <DisclosureSnapshotMobileSections
              orderNo={orderNo}
              snapshot={snapshot}
              showReleaseMethod={showReleaseMethod}
            />
          </PrototypeAnnotationTarget>

          <SectionCard title="操作记录" indicatorColor="#6366f1">
            <div className="space-y-2 text-xs">
              {record.sections
                .filter((section) => section.title.includes("操作") || section.title.includes("审计"))
                .flatMap((section) =>
                  section.fields.map((field) => (
                    <div
                      key={`${section.title}-${field.label}`}
                      className="rounded-xl border border-gray-100 bg-white p-2.5"
                    >
                      <div className="font-semibold text-gray-900">{field.label}</div>
                      <div className="mt-1 text-gray-700">{field.value}</div>
                    </div>
                  ))
                )}
            </div>
          </SectionCard>
        </div>
      </div>
    </MobileShell>
  )
}
