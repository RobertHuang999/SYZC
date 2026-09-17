import type { CollateralWarningEventDetail } from "./types"

export type RiskDisclosurePublishDraft = {
  warningTime: string
  warningType: string
  location: string
  deviceName: string
  warningDescription: string
  warningSnapshotImages: string[]
  processedBy: string
  releaseMethod: string
  releaseTime: string
  situationDescription: string
  sitePhotos: string[]
  releaseSnapshotImages: string[]
}

export type PublishDraftErrors = Partial<
  Record<
    | "warningTime"
    | "warningType"
    | "location"
    | "deviceName"
    | "warningDescription"
    | "processedBy"
    | "releaseMethod"
    | "releaseTime"
    | "situationDescription",
    string
  >
>

const LIMITS = {
  warningType: 20,
  location: 50,
  deviceName: 50,
  warningDescription: 100,
  processedBy: 50,
  releaseMethod: 50,
  situationDescription: 100,
  warningSnapshotImages: 20,
  sitePhotos: 10,
  releaseSnapshotImages: 20,
} as const

export function isAutoReleaseWarning(event: CollateralWarningEventDetail): boolean {
  return Boolean(event.processedBy?.includes("系统"))
}

function buildWarningSnapshotImages(
  event: CollateralWarningEventDetail
): string[] {
  if (event.snapshotImageStatus === "available") {
    return [`预警抓拍-${event.eventId}.jpg`]
  }
  return []
}

function buildReleaseSnapshotImages(
  event: CollateralWarningEventDetail
): string[] {
  const image = event.disposalInfo?.releaseSnapshotImage
  return image ? [image] : []
}

function resolveLocation(event: CollateralWarningEventDetail): string {
  return (
    event.penetrationInfo?.triggerLocation ??
    event.orderSnapshot.cargoItems[0]?.storageLocation ??
    ""
  )
}

function resolveDeviceName(event: CollateralWarningEventDetail): string {
  return event.penetrationInfo?.triggerDevice ?? "无关联设备"
}

export function buildPublishDraftFromWarning(
  event: CollateralWarningEventDetail
): RiskDisclosurePublishDraft {
  const disposal = event.disposalInfo

  return {
    warningTime: event.warningTime,
    warningType: event.warningType,
    location: resolveLocation(event),
    deviceName: resolveDeviceName(event),
    warningDescription: event.warningContent,
    warningSnapshotImages: buildWarningSnapshotImages(event),
    processedBy: event.processedBy ?? "",
    releaseMethod: isAutoReleaseWarning(event) ? "系统自动结案" : "",
    releaseTime: event.processedTime ?? "",
    situationDescription: disposal?.situationDescription ?? "",
    sitePhotos: [...(disposal?.sitePhotos ?? [])],
    releaseSnapshotImages: buildReleaseSnapshotImages(event),
  }
}

function validateRequiredText(
  value: string,
  label: string,
  maxLength: number
): string | undefined {
  const trimmed = value.trim()
  if (!trimmed) {
    return `请填写${label}`
  }
  if (trimmed.length > maxLength) {
    return `${label}不超过 ${maxLength} 字`
  }
  return undefined
}

export function isIotWarningEvent(event: CollateralWarningEventDetail): boolean {
  return (
    event.warningType === "物联穿透告警" || event.warningSource === "物联穿透"
  )
}

export function validatePublishDraft(
  draft: RiskDisclosurePublishDraft,
  options?: {
    showReleaseMethod?: boolean
    requireDeviceName?: boolean
    requireSituationDescription?: boolean
  }
): PublishDraftErrors {
  const errors: PublishDraftErrors = {}

  if (!draft.warningTime.trim()) {
    errors.warningTime = "请选择预警时间"
  }

  const warningTypeError = validateRequiredText(
    draft.warningType,
    "预警类型",
    LIMITS.warningType
  )
  if (warningTypeError) errors.warningType = warningTypeError

  const locationError = validateRequiredText(
    draft.location,
    "位置",
    LIMITS.location
  )
  if (locationError) errors.location = locationError

  if (options?.requireDeviceName) {
    const deviceNameError = validateRequiredText(
      draft.deviceName,
      "设备名称",
      LIMITS.deviceName
    )
    if (deviceNameError) errors.deviceName = deviceNameError
  }

  const warningDescriptionError = validateRequiredText(
    draft.warningDescription,
    "预警描述",
    LIMITS.warningDescription
  )
  if (warningDescriptionError) {
    errors.warningDescription = warningDescriptionError
  }

  const processedByError = validateRequiredText(
    draft.processedBy,
    "处理人",
    LIMITS.processedBy
  )
  if (processedByError) errors.processedBy = processedByError

  if (options?.showReleaseMethod) {
    const releaseMethodError = validateRequiredText(
      draft.releaseMethod,
      "解除方式",
      LIMITS.releaseMethod
    )
    if (releaseMethodError) errors.releaseMethod = releaseMethodError
  }

  if (!draft.releaseTime.trim()) {
    errors.releaseTime = "请选择解除时间"
  }

  if (options?.requireSituationDescription) {
    const situationError = validateRequiredText(
      draft.situationDescription,
      "情况说明",
      LIMITS.situationDescription
    )
    if (situationError) errors.situationDescription = situationError
  }

  if (draft.warningSnapshotImages.length > LIMITS.warningSnapshotImages) {
    errors.warningDescription = `预警抓拍图最多 ${LIMITS.warningSnapshotImages} 张`
  }

  if (draft.sitePhotos.length > LIMITS.sitePhotos) {
    errors.situationDescription = `现场照片最多 ${LIMITS.sitePhotos} 张`
  }

  if (draft.releaseSnapshotImages.length > LIMITS.releaseSnapshotImages) {
    errors.releaseTime = `解除预警抓拍图最多 ${LIMITS.releaseSnapshotImages} 张`
  }

  return errors
}

export function buildDisclosureTitleFromDraft(
  draft: RiskDisclosurePublishDraft,
  orderNo: string
): string {
  return `${draft.warningType} — ${orderNo}`
}

