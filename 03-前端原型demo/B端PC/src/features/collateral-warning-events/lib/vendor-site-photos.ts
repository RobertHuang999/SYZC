import type { CollateralWarningEvent } from "../domain/types"

type VendorPhotoSource = Pick<
  CollateralWarningEvent,
  "eventId" | "warningType" | "warningSource" | "deviceEventId"
>

/** 物联穿透类继承设备厂商回传现场照片；商业类订单预警通常无厂商回传 */
export function inferCollateralVendorSitePhotos(
  event: VendorPhotoSource
): string[] {
  if (event.warningSource === "物联穿透" && event.deviceEventId) {
    return [
      `${event.deviceEventId}_vendor_1.jpg`,
      `${event.deviceEventId}_vendor_2.jpg`,
    ]
  }

  return []
}
