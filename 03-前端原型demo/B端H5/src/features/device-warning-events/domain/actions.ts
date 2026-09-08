import type { DeviceWarningEvent } from "./types"

export function canManualRelease(event: DeviceWarningEvent): boolean {
  if (event.warningStatus !== "OPEN_VALID") return false
  return event.manualReleaseAllowed
}
