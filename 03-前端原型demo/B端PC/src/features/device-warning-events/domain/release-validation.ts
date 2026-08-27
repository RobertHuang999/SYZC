import { canManualRelease } from "./actions"
import type { DeviceWarningEvent } from "./types"
import { WARNING_STATUS } from "./status"

export const SITUATION_MAX_LENGTH = 200
export const SITE_PHOTO_MAX_COUNT = 10
export const SITE_PHOTO_MAX_SIZE_BYTES = 5 * 1024 * 1024
export const SITE_PHOTO_ACCEPT_EXTENSIONS = [".jpg", ".jpeg", ".png"]

export const RELEASE_VALIDATION_MESSAGES = {
  situationRequired: "请填写情况说明",
  situationTooLong: "情况说明不可超过 200 字",
  sitePhotoTooMany: "现场照片最多上传 10 张",
  sitePhotoInvalidType: "仅支持 jpg、png、jpeg 格式",
  sitePhotoTooLarge: "单张照片不可超过 5MB",
  alreadyProcessed: "该预警已处理或已失效",
  manualReleaseNotAllowed: "该类型预警不支持人工解除，请等待自动恢复",
  versionConflict: "数据已被他人修改，请刷新后重试",
} as const

export type ReleaseFormValues = {
  situationDescription: string
  sitePhotoNames: string[]
  version: number
}

export type ReleaseFormErrors = Partial<
  Record<"situationDescription" | "sitePhotos", string>
>

export type ReleaseAccessResult =
  | { allowed: true }
  | { allowed: false; message: string }

export function getReleaseAccess(
  event: DeviceWarningEvent | null
): ReleaseAccessResult {
  if (!event) {
    return { allowed: false, message: "未找到对应的设备预警信息" }
  }

  if (event.warningStatus !== WARNING_STATUS.OPEN_VALID) {
    return {
      allowed: false,
      message: RELEASE_VALIDATION_MESSAGES.alreadyProcessed,
    }
  }

  if (!canManualRelease(event)) {
    return {
      allowed: false,
      message: RELEASE_VALIDATION_MESSAGES.manualReleaseNotAllowed,
    }
  }

  return { allowed: true }
}

export function validateReleaseForm(
  values: ReleaseFormValues
): ReleaseFormErrors {
  const errors: ReleaseFormErrors = {}
  const trimmed = values.situationDescription.trim()

  if (!trimmed) {
    errors.situationDescription = RELEASE_VALIDATION_MESSAGES.situationRequired
  } else if (trimmed.length > SITUATION_MAX_LENGTH) {
    errors.situationDescription = RELEASE_VALIDATION_MESSAGES.situationTooLong
  }

  if (values.sitePhotoNames.length > SITE_PHOTO_MAX_COUNT) {
    errors.sitePhotos = RELEASE_VALIDATION_MESSAGES.sitePhotoTooMany
  }

  return errors
}

export function validateSitePhotoFile(
  file: File,
  currentCount: number
): string | null {
  if (currentCount >= SITE_PHOTO_MAX_COUNT) {
    return RELEASE_VALIDATION_MESSAGES.sitePhotoTooMany
  }

  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`
  if (!SITE_PHOTO_ACCEPT_EXTENSIONS.includes(extension)) {
    return RELEASE_VALIDATION_MESSAGES.sitePhotoInvalidType
  }

  if (file.size > SITE_PHOTO_MAX_SIZE_BYTES) {
    return RELEASE_VALIDATION_MESSAGES.sitePhotoTooLarge
  }

  return null
}

export function getReleaseHintText(triggerCount: number): string {
  return `确认解除后将归档整轮 ${triggerCount} 次触发，状态变为「已处理（有效）」，并同步取消相关升级任务。`
}

export const RELEASE_DEMO_SITUATION_BY_EVENT: Record<string, string> = {
  "evt-002":
    "经现场安保核实，系例行巡库检修，穿戴合规工装无异常。",
}
