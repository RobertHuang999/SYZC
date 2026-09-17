import { ImageIcon } from "lucide-react"
import {
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import type { RiskDisclosurePublishDraft } from "@/features/collateral-warning-events/domain/publish-draft"

function ReadonlyImageList({
  images,
  emptyPlaceholder,
}: {
  images: string[]
  emptyPlaceholder: string
}) {
  if (images.length === 0) {
    return (
      <span className="text-sm text-muted-foreground">{emptyPlaceholder}</span>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {images.map((name) => (
        <span
          key={name}
          className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-sm"
        >
          <ImageIcon className="size-4 text-primary" />
          {name}
        </span>
      ))}
    </div>
  )
}

type DisclosureSnapshotViewContentProps = {
  orderNo: string
  snapshot: RiskDisclosurePublishDraft
  showReleaseMethod: boolean
}

export function DisclosureSnapshotViewContent({
  orderNo,
  snapshot,
  showReleaseMethod,
}: DisclosureSnapshotViewContentProps) {
  return (
    <>
      <DetailSection title="公示信息">
        <DetailField label="订单号">
          <span className="font-mono">{orderNo}</span>
        </DetailField>
        <DetailField label="预警时间">
          {formatEmptyValue(snapshot.warningTime)}
        </DetailField>
        <DetailField label="预警类型">
          {formatEmptyValue(snapshot.warningType)}
        </DetailField>
        <DetailField label="位置">
          {formatEmptyValue(snapshot.location)}
        </DetailField>
        <DetailField label="设备名称">
          {formatEmptyValue(snapshot.deviceName)}
        </DetailField>
        <div className="col-span-full">
          <div className="detail-field-label mb-1">预警描述</div>
          <div className="rounded-lg border bg-muted/20 p-3 text-sm leading-relaxed">
            {formatEmptyValue(snapshot.warningDescription)}
          </div>
        </div>
        <div className="col-span-full">
          <div className="detail-field-label mb-1">预警抓拍图</div>
          <ReadonlyImageList
            images={snapshot.warningSnapshotImages}
            emptyPlaceholder="抓拍失败/无监控设备"
          />
        </div>
      </DetailSection>

      <DetailSection title="处置信息">
        <DetailField label="处理人">
          {formatEmptyValue(snapshot.processedBy)}
        </DetailField>
        {showReleaseMethod ? (
          <DetailField label="解除方式">
            {formatEmptyValue(snapshot.releaseMethod)}
          </DetailField>
        ) : null}
        <DetailField label="解除时间">
          {formatEmptyValue(snapshot.releaseTime)}
        </DetailField>
        <div className="col-span-full">
          <div className="detail-field-label mb-1">情况说明</div>
          <div className="rounded-lg border bg-muted/20 p-3 text-sm leading-relaxed">
            {formatEmptyValue(snapshot.situationDescription)}
          </div>
        </div>
        {snapshot.sitePhotos.length > 0 ? (
          <div className="col-span-full">
            <div className="detail-field-label mb-1">现场照片</div>
            <ReadonlyImageList
              images={snapshot.sitePhotos}
              emptyPlaceholder=""
            />
          </div>
        ) : null}
        <div className="col-span-full">
          <div className="detail-field-label mb-1">解除预警抓拍图</div>
          <ReadonlyImageList
            images={snapshot.releaseSnapshotImages}
            emptyPlaceholder="抓拍失败/无监控设备"
          />
        </div>
      </DetailSection>
    </>
  )
}
