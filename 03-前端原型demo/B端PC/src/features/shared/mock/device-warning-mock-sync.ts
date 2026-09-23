import type { DeviceWarningEvent } from "../../device-warning-events/domain/types"
import { WARNING_STATUS } from "../../device-warning-events/domain/status"
import {
  getRecommendedDisposition,
  resolveDispositionEffects,
  type DispositionMode,
} from "../../device-warning-configs/domain/disposition"
import { DEVICE_WARNING_SUB_TYPES } from "../../device-warning-configs/domain/constants"
import { RULE_SCENARIO_BY_EVENT_ID } from "./device-warning-scenarios"

export type RawDeviceWarningEvent = Omit<
  DeviceWarningEvent,
  "dispositionMode" | "manualReleaseAllowed" | "vendorSitePhotos"
>

/** 告警触发时厂商硬件自动回传的现场照片（与监控主动抓拍、核销上传照片区分） */
export function inferVendorSitePhotos(
  event: Pick<RawDeviceWarningEvent, "eventId" | "warningType" | "triggerSummary">
): string[] {
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

function extractSubTypeFromSummary(summary: string): string | undefined {
  const allSubTypes = Object.values(DEVICE_WARNING_SUB_TYPES).flat()
  return allSubTypes.find((subType) => summary.includes(subType))
}

/** 无规则关联时，从触发摘要推断处置策略（扩展列表克隆流水用系统推荐默认） */
export function inferDispositionModeFromEvent(
  event: Pick<RawDeviceWarningEvent, "eventId" | "triggerSummary" | "warningType">
): DispositionMode {
  const linkedRule = RULE_SCENARIO_BY_EVENT_ID[event.eventId]
  if (linkedRule) {
    return linkedRule.dispositionMode
  }

  const subType = extractSubTypeFromSummary(event.triggerSummary)
  if (subType) {
    return getRecommendedDisposition([subType])
  }

  if (
    event.triggerSummary.includes("℃") ||
    event.triggerSummary.includes("湿度") ||
    event.triggerSummary.includes("烟感") ||
    event.triggerSummary.includes("二氧化碳") ||
    event.triggerSummary.includes("氧气")
  ) {
    return "AUTO_RECOVER"
  }

  if (event.warningType === "设备GPS预警") {
    return "ACTION_REQUIRED"
  }

  return "ACTION_REQUIRED"
}

/** 按处置策略校正落账状态，保证 Mock 与配置侧一致 */
export function applyDispositionLedger(
  event: RawDeviceWarningEvent,
  mode: DispositionMode
): DeviceWarningEvent {
  const effects = resolveDispositionEffects(mode)
  let warningStatus = event.warningStatus
  let processedTime = event.processedTime
  let processedBy = event.processedBy

  if (warningStatus !== WARNING_STATUS.OPEN_INVALID) {
    if (effects.initialStatusClosed) {
      warningStatus = WARNING_STATUS.CLOSED_VALID
      processedTime = processedTime ?? event.warningTime
      processedBy = processedBy ?? "系统自动处理"
    } else if (
      effects.manualReleaseAllowed &&
      warningStatus === WARNING_STATUS.CLOSED_VALID &&
      processedBy === "系统自动处理"
    ) {
      warningStatus = WARNING_STATUS.OPEN_VALID
      processedTime = null
      processedBy = null
    }
  }

  const manualReleaseAllowed =
    effects.manualReleaseAllowed && warningStatus === WARNING_STATUS.OPEN_VALID

  const linkedRule = RULE_SCENARIO_BY_EVENT_ID[event.eventId]

  return {
    ...event,
    ruleName: linkedRule?.ruleName ?? event.ruleName,
    vendorSitePhotos: inferVendorSitePhotos(event),
    dispositionMode: mode,
    manualReleaseAllowed,
    warningStatus,
    processedTime,
    processedBy,
  }
}

export function enrichDeviceWarningEvent(
  event: RawDeviceWarningEvent
): DeviceWarningEvent {
  const mode = inferDispositionModeFromEvent(event)
  return applyDispositionLedger(event, mode)
}
