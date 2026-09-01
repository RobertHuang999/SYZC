export type AccessDeviceType = "挂锁门禁" | "人脸门禁"

export type AccessDeviceStatus = "在线" | "离线"

export type BindStatus = "已绑定" | "未绑定"

export type AccessDevice = {
  id: string
  originalName: string
  displayName: string
  deviceCode: string
  deviceType: AccessDeviceType
  status: AccessDeviceStatus
  warehouseName: string | null
  storeroomName: string | null
  zoneName: string | null
  locationDetail: string
  bindStatus: BindStatus
  updatedBy: string
  updatedAt: string
}

export type AccessDeviceFilters = {
  displayName: string
  deviceType: "全部" | AccessDeviceType
  status: "全部" | AccessDeviceStatus
  warehouseName: string
  bindStatus: "全部" | BindStatus
  updatedFrom: string
  updatedTo: string
}

export type AccessDevicePasswordContext = {
  deviceName: string
  deviceCode: string
  deviceType: AccessDeviceType
  warehouseName: string
  locationDetail: string
}
