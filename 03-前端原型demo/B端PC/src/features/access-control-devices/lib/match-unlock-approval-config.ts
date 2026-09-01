import type { UnlockApprovalConfig } from "@/features/unlock-approval-configs/domain/types"
import { unlockApprovalConfigsMock } from "@/features/unlock-approval-configs/mock/unlock-approval-configs.mock"
import type { AccessDevice } from "../domain/types"

export type MatchUnlockApprovalResult = {
  needApproval: boolean
  matchedConfig: UnlockApprovalConfig | null
}

export function matchUnlockApprovalConfig(
  device: AccessDevice,
  configs: UnlockApprovalConfig[] = unlockApprovalConfigsMock
): MatchUnlockApprovalResult {
  const enabled = configs.filter((item) => item.status === "已启用")
  const matched = enabled.filter((config) =>
    config.deviceCodes.includes(device.deviceCode)
  )

  if (matched.length > 1) {
    return { needApproval: false, matchedConfig: null }
  }

  if (matched.length === 1) {
    return { needApproval: true, matchedConfig: matched[0] }
  }

  return { needApproval: false, matchedConfig: null }
}
