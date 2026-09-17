import type { ReactNode } from "react"
import { SectionCard } from "@/components/ui/SectionCard"
import type { CollateralWarningEventDetail } from "../domain/types"
import type {
  PublishDraftErrors,
  RiskDisclosurePublishDraft,
} from "../domain/publish-draft"
import { isAutoReleaseWarning, isIotWarningEvent } from "../domain/publish-draft"

const inputClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"

function Field({
  label,
  required,
  children,
  error,
}: {
  label: string
  required?: boolean
  children: ReactNode
  error?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-600">
        {label}
        {required ? <span className="text-rose-600"> *</span> : null}
      </label>
      {children}
      {error ? <p className="text-[11px] text-rose-600">{error}</p> : null}
    </div>
  )
}

function toDatetimeLocalValue(value: string): string {
  if (!value) return ""
  return value.replace(" ", "T").slice(0, 16)
}

function fromDatetimeLocalValue(value: string): string {
  if (!value) return ""
  const normalized = value.length === 16 ? `${value}:00` : value
  return normalized.replace("T", " ")
}

function ImageEditor({
  images,
  maxCount,
  emptyPlaceholder,
  onChange,
}: {
  images: string[]
  maxCount: number
  emptyPlaceholder: string
  onChange: (images: string[]) => void
}) {
  const addImage = () => {
    const name = window.prompt("输入图片文件名", `现场照片-${images.length + 1}.jpg`)
    if (!name?.trim()) return
    if (images.length >= maxCount) {
      window.alert(`最多 ${maxCount} 张`)
      return
    }
    onChange([...images, name.trim()])
  }

  if (images.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-[11px] text-gray-500">{emptyPlaceholder}</p>
        <button
          type="button"
          onClick={addImage}
          className="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-[11px] font-semibold text-blue-600"
        >
          添加图片
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {images.map((name) => (
          <span
            key={name}
            className="inline-flex items-center gap-1 rounded-lg border bg-gray-50 px-2 py-1 text-[11px]"
          >
            {name}
            <button
              type="button"
              className="text-gray-400"
              onClick={() => onChange(images.filter((item) => item !== name))}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      {images.length < maxCount ? (
        <button
          type="button"
          onClick={addImage}
          className="rounded-lg border border-dashed border-gray-300 px-3 py-2 text-[11px] font-semibold text-blue-600"
        >
          添加图片
        </button>
      ) : null}
    </div>
  )
}

type CollateralWarningPublishFormContentProps = {
  event: CollateralWarningEventDetail
  draft: RiskDisclosurePublishDraft
  errors: PublishDraftErrors
  onDraftChange: (patch: Partial<RiskDisclosurePublishDraft>) => void
}

export function CollateralWarningPublishFormContent({
  event,
  draft,
  errors,
  onDraftChange,
}: CollateralWarningPublishFormContentProps) {
  const showReleaseMethod = isAutoReleaseWarning(event)
  const showDeviceName = isIotWarningEvent(event)
  const requireSituationDescription = !showReleaseMethod

  return (
    <>
      <SectionCard title="公示信息" indicatorColor="#f97316">
        <div className="space-y-3">
          <Field label="订单号">
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 font-mono text-xs font-semibold text-gray-800">
              {event.orderNo}
            </div>
          </Field>
          <Field label="预警时间" required error={errors.warningTime}>
            <input
              type="datetime-local"
              className={inputClassName}
              value={toDatetimeLocalValue(draft.warningTime)}
              onChange={(e) =>
                onDraftChange({
                  warningTime: fromDatetimeLocalValue(e.target.value),
                })
              }
            />
          </Field>
          <Field label="预警类型" required error={errors.warningType}>
            <input
              className={inputClassName}
              maxLength={20}
              value={draft.warningType}
              onChange={(e) => onDraftChange({ warningType: e.target.value })}
            />
          </Field>
          <Field label="位置" required error={errors.location}>
            <input
              className={inputClassName}
              maxLength={50}
              value={draft.location}
              onChange={(e) => onDraftChange({ location: e.target.value })}
            />
          </Field>
          {showDeviceName ? (
            <Field label="设备名称" required error={errors.deviceName}>
              <input
                className={inputClassName}
                maxLength={50}
                value={draft.deviceName}
                onChange={(e) => onDraftChange({ deviceName: e.target.value })}
              />
            </Field>
          ) : null}
          <Field label="预警描述" required error={errors.warningDescription}>
            <textarea
              className={`${inputClassName} min-h-24 resize-y`}
              maxLength={100}
              value={draft.warningDescription}
              onChange={(e) =>
                onDraftChange({ warningDescription: e.target.value })
              }
            />
          </Field>
          <Field label="预警抓拍图">
            <ImageEditor
              images={draft.warningSnapshotImages}
              maxCount={20}
              emptyPlaceholder="抓拍失败/无监控设备"
              onChange={(warningSnapshotImages) =>
                onDraftChange({ warningSnapshotImages })
              }
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="处置信息" indicatorColor="#1875f0">
        <div className="space-y-3">
          <Field label="处理人" required error={errors.processedBy}>
            <input
              className={inputClassName}
              maxLength={50}
              value={draft.processedBy}
              onChange={(e) => onDraftChange({ processedBy: e.target.value })}
            />
          </Field>
          {showReleaseMethod ? (
            <Field label="解除方式" required error={errors.releaseMethod}>
              <input
                className={inputClassName}
                maxLength={50}
                value={draft.releaseMethod}
                onChange={(e) =>
                  onDraftChange({ releaseMethod: e.target.value })
                }
              />
            </Field>
          ) : null}
          <Field label="解除时间" required error={errors.releaseTime}>
            <input
              type="datetime-local"
              className={inputClassName}
              value={toDatetimeLocalValue(draft.releaseTime)}
              onChange={(e) =>
                onDraftChange({
                  releaseTime: fromDatetimeLocalValue(e.target.value),
                })
              }
            />
          </Field>
          <Field
            label="情况说明"
            required={requireSituationDescription}
            error={errors.situationDescription}
          >
            <textarea
              className={`${inputClassName} min-h-24 resize-y`}
              maxLength={100}
              value={draft.situationDescription}
              onChange={(e) =>
                onDraftChange({ situationDescription: e.target.value })
              }
            />
          </Field>
          <Field label="现场照片">
            <ImageEditor
              images={draft.sitePhotos}
              maxCount={10}
              emptyPlaceholder="暂无现场照片，可添加"
              onChange={(sitePhotos) => onDraftChange({ sitePhotos })}
            />
          </Field>
          <Field label="解除预警抓拍图">
            <ImageEditor
              images={draft.releaseSnapshotImages}
              maxCount={20}
              emptyPlaceholder="抓拍失败/无监控设备"
              onChange={(releaseSnapshotImages) =>
                onDraftChange({ releaseSnapshotImages })
              }
            />
          </Field>
        </div>
      </SectionCard>
    </>
  )
}
