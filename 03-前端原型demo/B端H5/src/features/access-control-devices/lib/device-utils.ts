import type { AccessDevice } from "../domain/types"
import {
  unlockApprovalConfigsMock,
  type UnlockApprovalConfig,
} from "../mock/unlock-approval-configs.mock"

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

export function matchUnlockApprovalConfig(
  device: AccessDevice,
  configs: UnlockApprovalConfig[] = unlockApprovalConfigsMock
): boolean {
  const enabled = configs.filter((item) => item.status === "已启用")
  for (const scopeType of SCOPE_PRIORITY) {
    const matched = enabled.find(
      (config) => config.scopeType === scopeType && configMatchesDevice(config, device)
    )
    if (matched) return true
  }
  return false
}

export function toPasswordContext(device: AccessDevice) {
  return {
    deviceName: device.displayName,
    deviceCode: device.deviceCode,
    deviceType: device.deviceType,
    warehouseName: device.warehouseName ?? "未绑定",
    locationDetail: device.locationDetail,
  }
}

export function filterAccessDevices(
  devices: AccessDevice[],
  keyword: string,
  deviceType: AccessDevice["deviceType"] | "全部",
  status: AccessDevice["status"] | "全部",
  warehouseName: string,
  bindStatus: AccessDevice["bindStatus"] | "全部"
): AccessDevice[] {
  return devices.filter((device) => {
    const kw = keyword.trim()
    if (
      kw &&
      !device.displayName.includes(kw) &&
      !device.deviceCode.includes(kw)
    ) {
      return false
    }
    if (deviceType !== "全部" && device.deviceType !== deviceType) return false
    if (status !== "全部" && device.status !== status) return false
    if (warehouseName !== "全部" && device.warehouseName !== warehouseName) {
      return false
    }
    if (bindStatus !== "全部" && device.bindStatus !== bindStatus) return false
    return true
  })
}
