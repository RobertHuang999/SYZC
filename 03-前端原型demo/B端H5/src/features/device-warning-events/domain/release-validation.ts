import { canManualRelease } from "./actions"
import type { DeviceWarningEvent } from "./types"

export const MAX_SITUATION_LENGTH = 200
export const MAX_PHOTO_COUNT = 10
export const MAX_PHOTO_SIZE = 5 * 1024 * 1024
const ACCEPTED_EXTENSIONS = ["jpg", "jpeg", "png"]

export function getReleaseError(event: DeviceWarningEvent | null): string | null {
  if (!event) return "未找到对应的设备预警信息"
  if (event.warningStatus !== "OPEN_VALID") return "该预警已处理或已失效"
  if (!canManualRelease(event)) return "该类型预警不支持人工解除，请等待自动恢复"
  return null
}

export function validatePhoto(file: File, currentCount: number): string | null {
  if (currentCount >= MAX_PHOTO_COUNT) return "现场照片最多上传 10 张"
  const extension = file.name.split(".").pop()?.toLowerCase() ?? ""
  if (!ACCEPTED_EXTENSIONS.includes(extension)) return "仅支持 jpg、png、jpeg 格式"
  if (file.size > MAX_PHOTO_SIZE) return "单张照片不可超过 5MB"
  return null
}
