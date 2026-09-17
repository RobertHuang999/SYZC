import { SectionCard } from "@/components/ui/SectionCard"
import type { RiskDisclosurePublishDraft } from "@/features/collateral-warning-events/domain/publish-draft"

type DisclosureSnapshotMobileSectionsProps = {
  orderNo: string
  snapshot: RiskDisclosurePublishDraft
  showReleaseMethod: boolean
  allExpanded?: boolean
}

export function DisclosureSnapshotMobileSections({
  orderNo,
  snapshot,
  showReleaseMethod,
  allExpanded = true,
}: DisclosureSnapshotMobileSectionsProps) {
  return (
    <>
      <SectionCard
        title="公示信息"
        indicatorColor="#1875f0"
        collapsed={!allExpanded}
      >
        <div className="space-y-2 text-xs">
          <FieldRow label="订单号" value={orderNo} mono />
          <FieldRow label="预警时间" value={snapshot.warningTime} mono />
          <FieldRow label="预警类型" value={snapshot.warningType} />
          <FieldRow label="位置" value={snapshot.location} />
          <FieldRow label="设备名称" value={snapshot.deviceName} />
          <BlockField label="预警描述" value={snapshot.warningDescription} />
          <BlockField
            label="预警抓拍图"
            value={
              snapshot.warningSnapshotImages.length > 0
                ? snapshot.warningSnapshotImages.join("、")
                : "抓拍失败/无监控设备"
            }
          />
        </div>
      </SectionCard>

      <SectionCard
        title="处置信息"
        indicatorColor="#00a870"
        collapsed={!allExpanded}
      >
        <div className="space-y-2 text-xs">
          <FieldRow label="处理人" value={snapshot.processedBy} />
          {showReleaseMethod ? (
            <FieldRow label="解除方式" value={snapshot.releaseMethod} />
          ) : null}
          <FieldRow label="解除时间" value={snapshot.releaseTime} mono />
          <BlockField label="情况说明" value={snapshot.situationDescription} />
          {snapshot.sitePhotos.length > 0 ? (
            <BlockField
              label="现场照片"
              value={snapshot.sitePhotos.join("、")}
            />
          ) : null}
          <BlockField
            label="解除预警抓拍图"
            value={
              snapshot.releaseSnapshotImages.length > 0
                ? snapshot.releaseSnapshotImages.join("、")
                : "抓拍失败/无监控设备"
            }
          />
        </div>
      </SectionCard>
    </>
  )
}

function FieldRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="w-24 shrink-0 text-gray-500">{label}</span>
      <span
        className={`flex-1 text-right text-gray-800 ${mono ? "font-mono" : "font-medium"}`}
      >
        {value || "—"}
      </span>
    </div>
  )
}

function BlockField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-gray-100 pt-2">
      <span className="text-gray-500">{label}</span>
      <p className="mt-1 whitespace-pre-wrap rounded-xl border bg-slate-50 p-2.5 text-gray-800">
        {value || "—"}
      </p>
    </div>
  )
}
