import type { AccessDevice } from "../domain/types"
import {
  unlockApprovalConfigsMock,
  type UnlockApprovalConfig,
} from "../mock/unlock-approval-configs.mock"

export function matchUnlockApprovalConfig(
  device: AccessDevice,
  configs: UnlockApprovalConfig[] = unlockApprovalConfigsMock
): boolean {
  const enabled = configs.filter((item) => item.status === "已启用")
  const matched = enabled.filter((config) =>
    config.deviceCodes.includes(device.deviceCode)
  )
  return matched.length === 1
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
