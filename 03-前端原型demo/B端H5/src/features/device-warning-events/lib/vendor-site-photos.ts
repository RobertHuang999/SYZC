import type { DeviceWarningEvent, DeviceWarningType } from "../domain/types"

type VendorPhotoSource = Pick<
  DeviceWarningEvent,
  "eventId" | "warningType" | "triggerSummary"
>

/** 告警触发时厂商硬件自动回传的现场照片（与监控主动抓拍、核销上传照片区分） */
export function inferVendorSitePhotos(event: VendorPhotoSource): string[] {
  if (event.warningType === "设备图像识别预警") {
    return [
      `${event.eventId}_vendor_1.jpg`,
      `${event.eventId}_vendor_2.jpg`,
    ]
  }

  if (
    event.warningType === "设备物联预警" &&
    !event.triggerSummary.includes("离线")
  ) {
    const count = event.triggerSummary.includes("二氧化碳") ? 2 : 1
    return Array.from(
      { length: count },
      (_, index) => `${event.eventId}_vendor_${index + 1}.jpg`
    )
  }

  if (event.warningType === "智能挂锁预警") {
    return [`${event.eventId}_vendor_1.jpg`]
  }

  return []
}

export function hasVendorSitePhotos(warningType: DeviceWarningType): boolean {
  return (
    warningType === "设备图像识别预警" ||
    warningType === "设备物联预警" ||
    warningType === "智能挂锁预警"
  )
}
