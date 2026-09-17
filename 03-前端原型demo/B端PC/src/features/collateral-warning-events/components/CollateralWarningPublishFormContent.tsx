import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  DetailField,
  DetailSection,
  formatEmptyValue,
} from "@/shared/components/DetailSection"
import { EditableImageList } from "@/shared/components/EditableImageList"
import type { SnapshotPreviewData } from "@/shared/components/SnapshotImageModal"
import type { CollateralWarningEventDetail } from "../domain/types"
import type {
  PublishDraftErrors,
  RiskDisclosurePublishDraft,
} from "../domain/publish-draft"
import { isAutoReleaseWarning, isIotWarningEvent } from "../domain/publish-draft"

function toDatetimeLocalValue(value: string): string {
  if (!value) return ""
  return value.replace(" ", "T").slice(0, 16)
}

function fromDatetimeLocalValue(value: string): string {
  if (!value) return ""
  const normalized = value.length === 16 ? `${value}:00` : value
  return normalized.replace("T", " ")
}

type CollateralWarningPublishFormContentProps = {
  event: CollateralWarningEventDetail
  draft: RiskDisclosurePublishDraft
  errors: PublishDraftErrors
  onDraftChange: (patch: Partial<RiskDisclosurePublishDraft>) => void
  onPreviewImage?: (data: SnapshotPreviewData) => void
}

export function CollateralWarningPublishFormContent({
  event,
  draft,
  errors,
  onDraftChange,
  onPreviewImage,
}: CollateralWarningPublishFormContentProps) {
  const showReleaseMethod = isAutoReleaseWarning(event)
  const showDeviceName = isIotWarningEvent(event)
  const requireSituationDescription = !showReleaseMethod
  const primaryLocation = draft.location || "仓储监管现场"

  const previewSnapshot = (title: string, name: string, time: string) => {
    onPreviewImage?.({
      title,
      desc: `订单号：${event.orderNo} | 文件：${name}`,
      time,
      location: primaryLocation,
    })
  }

  return (
    <>
      <DetailSection title="公示信息">
        <DetailField label="订单号">
          <span className="font-mono">{event.orderNo}</span>
        </DetailField>

        <DetailField label="预警时间">
          <Input
            type="datetime-local"
            value={toDatetimeLocalValue(draft.warningTime)}
            onChange={(e) =>
              onDraftChange({
                warningTime: fromDatetimeLocalValue(e.target.value),
              })
            }
          />
          {errors.warningTime ? (
            <p className="mt-1 text-xs text-destructive">{errors.warningTime}</p>
          ) : null}
        </DetailField>

        <DetailField label="预警类型">
          <Input
            value={draft.warningType}
            maxLength={20}
            onChange={(e) => onDraftChange({ warningType: e.target.value })}
          />
          {errors.warningType ? (
            <p className="mt-1 text-xs text-destructive">{errors.warningType}</p>
          ) : null}
        </DetailField>

        <DetailField label="位置">
          <Input
            value={draft.location}
            maxLength={50}
            onChange={(e) => onDraftChange({ location: e.target.value })}
          />
          {errors.location ? (
            <p className="mt-1 text-xs text-destructive">{errors.location}</p>
          ) : null}
        </DetailField>

        {showDeviceName ? (
          <DetailField label="设备名称">
            <Input
              value={draft.deviceName}
              maxLength={50}
              onChange={(e) => onDraftChange({ deviceName: e.target.value })}
            />
            {errors.deviceName ? (
              <p className="mt-1 text-xs text-destructive">{errors.deviceName}</p>
            ) : null}
          </DetailField>
        ) : null}

        <div className="col-span-full space-y-1">
          <div className="detail-field-label">
            预警描述 <span className="text-destructive">*</span>
          </div>
          <Textarea
            rows={3}
            maxLength={100}
            value={draft.warningDescription}
            onChange={(e) =>
              onDraftChange({ warningDescription: e.target.value })
            }
          />
          {errors.warningDescription ? (
            <p className="text-xs text-destructive">{errors.warningDescription}</p>
          ) : null}
        </div>

        <div className="col-span-full space-y-1">
          <div className="detail-field-label">预警抓拍图</div>
          <EditableImageList
            images={draft.warningSnapshotImages}
            maxCount={20}
            onChange={(warningSnapshotImages) =>
              onDraftChange({ warningSnapshotImages })
            }
            onPreview={(name) =>
              previewSnapshot("预警抓拍图", name, draft.warningTime)
            }
          />
        </div>
      </DetailSection>

      <DetailSection title="处置信息">
        <DetailField label="处理人">
          <Input
            value={draft.processedBy}
            maxLength={50}
            onChange={(e) => onDraftChange({ processedBy: e.target.value })}
          />
          {errors.processedBy ? (
            <p className="mt-1 text-xs text-destructive">{errors.processedBy}</p>
          ) : null}
        </DetailField>

        {showReleaseMethod ? (
          <DetailField label="解除方式">
            <Input
              value={draft.releaseMethod}
              maxLength={50}
              onChange={(e) => onDraftChange({ releaseMethod: e.target.value })}
            />
            {errors.releaseMethod ? (
              <p className="mt-1 text-xs text-destructive">
                {errors.releaseMethod}
              </p>
            ) : null}
          </DetailField>
        ) : null}

        <DetailField label="解除时间">
          <Input
            type="datetime-local"
            value={toDatetimeLocalValue(draft.releaseTime)}
            onChange={(e) =>
              onDraftChange({
                releaseTime: fromDatetimeLocalValue(e.target.value),
              })
            }
          />
          {errors.releaseTime ? (
            <p className="mt-1 text-xs text-destructive">{errors.releaseTime}</p>
          ) : null}
        </DetailField>

        <div className="col-span-full space-y-1">
          <div className="detail-field-label">
            情况说明
            {requireSituationDescription ? (
              <span className="text-destructive"> *</span>
            ) : null}
          </div>
          <Textarea
            rows={3}
            maxLength={100}
            value={draft.situationDescription}
            onChange={(e) =>
              onDraftChange({ situationDescription: e.target.value })
            }
          />
          {errors.situationDescription ? (
            <p className="text-xs text-destructive">
              {errors.situationDescription}
            </p>
          ) : null}
        </div>

        <div className="col-span-full space-y-1">
          <div className="detail-field-label">现场照片</div>
          {draft.sitePhotos.length > 0 ? (
            <EditableImageList
              images={draft.sitePhotos}
              maxCount={10}
              emptyPlaceholder=""
              onChange={(sitePhotos) => onDraftChange({ sitePhotos })}
              onPreview={(name) =>
                previewSnapshot("现场照片", name, draft.releaseTime)
              }
            />
          ) : (
            <EditableImageList
              images={[]}
              maxCount={10}
              emptyPlaceholder="暂无现场照片，可添加"
              addLabel="添加现场照片"
              onChange={(sitePhotos) => onDraftChange({ sitePhotos })}
              onPreview={(name) =>
                previewSnapshot("现场照片", name, draft.releaseTime)
              }
            />
          )}
        </div>

        <div className="col-span-full space-y-1">
          <div className="detail-field-label">解除预警抓拍图</div>
          <EditableImageList
            images={draft.releaseSnapshotImages}
            maxCount={20}
            onChange={(releaseSnapshotImages) =>
              onDraftChange({ releaseSnapshotImages })
            }
            onPreview={(name) =>
              previewSnapshot("解除预警抓拍图", name, draft.releaseTime)
            }
          />
        </div>

        <DetailField label="来源预警">
          {formatEmptyValue(event.eventId)}
        </DetailField>
      </DetailSection>
    </>
  )
}
