import type { AccessDevice, AccessDeviceFilters } from "../domain/types"

export function filterAccessDevices(
  devices: AccessDevice[],
  filters: AccessDeviceFilters
): AccessDevice[] {
  return devices.filter((device) => {
    if (
      filters.displayName.trim() &&
      !device.displayName.toLowerCase().includes(filters.displayName.trim().toLowerCase())
    ) {
      return false
    }
    if (filters.deviceType !== "全部" && device.deviceType !== filters.deviceType) {
      return false
    }
    if (filters.status !== "全部" && device.status !== filters.status) {
      return false
    }
    if (
      filters.warehouseName !== "全部" &&
      device.warehouseName !== filters.warehouseName
    ) {
      return false
    }
    if (filters.bindStatus !== "全部" && device.bindStatus !== filters.bindStatus) {
      return false
    }
    if (filters.updatedFrom && device.updatedAt < `${filters.updatedFrom} 00:00:00`) {
      return false
    }
    if (filters.updatedTo && device.updatedAt > `${filters.updatedTo} 23:59:59`) {
      return false
    }
    return true
  })
}

export function paginateAccessDevices<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
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
