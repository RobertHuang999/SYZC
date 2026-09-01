import type { UnlockApprovalConfig } from "@/features/unlock-approval-configs/domain/types"
import { unlockApprovalConfigsMock } from "@/features/unlock-approval-configs/mock/unlock-approval-configs.mock"
import type { AccessDevice } from "../domain/types"

const SCOPE_PRIORITY = ["指定设备", "分区", "库房", "仓库", "未绑定位置全局"] as const

function configMatchesDevice(config: UnlockApprovalConfig, device: AccessDevice): boolean {
  switch (config.scopeType) {
    case "指定设备":
      return config.deviceCodes.includes(device.deviceCode)
    case "分区":
      return (
        device.warehouseName === config.warehouseName &&
        !!device.storeroomName &&
        config.storeroomNames.includes(device.storeroomName) &&
        !!device.zoneName &&
        config.zoneNames.includes(device.zoneName)
      )
    case "库房":
      return (
        device.warehouseName === config.warehouseName &&
        !!device.storeroomName &&
        config.storeroomNames.includes(device.storeroomName)
      )
    case "仓库":
      return device.warehouseName === config.warehouseName
    case "未绑定位置全局":
      return device.bindStatus === "未绑定" && config.globalSwitch === "开启"
    default:
      return false
  }
}

export type MatchUnlockApprovalResult = {
  needApproval: boolean
  matchedConfig: UnlockApprovalConfig | null
}

export function matchUnlockApprovalConfig(
  device: AccessDevice,
  configs: UnlockApprovalConfig[] = unlockApprovalConfigsMock
): MatchUnlockApprovalResult {
  const enabled = configs.filter((item) => item.status === "已启用")

  for (const scopeType of SCOPE_PRIORITY) {
    const matched = enabled.find(
      (config) => config.scopeType === scopeType && configMatchesDevice(config, device)
    )
    if (matched) {
      return { needApproval: true, matchedConfig: matched }
    }
  }

  return { needApproval: false, matchedConfig: null }
}
