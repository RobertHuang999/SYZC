export type MockDeviceItem = {
  deviceCode: string
  deviceName: string
  warehouseName: string
  deviceType: string
  location: string
  status: "在线" | "离线"
}

export const MOCK_DEVICE_POOL: MockDeviceItem[] = [
  {
    deviceCode: "DEV-CAM-0001",
    deviceName: "CAM1 (东门高清枪机)",
    warehouseName: "一号大宗钢材仓",
    deviceType: "监控设备",
    location: "A库东门",
    status: "在线",
  },
  {
    deviceCode: "DEV-CAM-0002",
    deviceName: "CAM2 (主走廊全景球机)",
    warehouseName: "一号大宗钢材仓",
    deviceType: "监控设备",
    location: "A库主通道",
    status: "在线",
  },
  {
    deviceCode: "DEV-IOT-0001",
    deviceName: "温湿度TH01",
    warehouseName: "一号大宗钢材仓",
    deviceType: "物联设备",
    location: "A库01分区",
    status: "在线",
  },
  {
    deviceCode: "DEV-IOT-0002",
    deviceName: "温湿度TH02",
    warehouseName: "一号大宗钢材仓",
    deviceType: "物联设备",
    location: "A库02分区",
    status: "在线",
  },
  {
    deviceCode: "DEV-IOT-0003",
    deviceName: "感烟探测器YG01",
    warehouseName: "一号大宗钢材仓",
    deviceType: "物联设备",
    location: "A库顶部",
    status: "在线",
  },
  {
    deviceCode: "DEV-LK-0001",
    deviceName: "智能挂锁LK01",
    warehouseName: "一号大宗钢材仓",
    deviceType: "智能挂锁",
    location: "A库主出入口",
    status: "在线",
  },
  {
    deviceCode: "DEV-LK-0002",
    deviceName: "智能挂锁LK02",
    warehouseName: "一号大宗钢材仓",
    deviceType: "智能挂锁",
    location: "B库侧门",
    status: "在线",
  },
  {
    deviceCode: "DEV-FACE-0001",
    deviceName: "人脸门禁FACE01",
    warehouseName: "一号大宗钢材仓",
    deviceType: "人脸门禁",
    location: "主大门闸机",
    status: "在线",
  },
  {
    deviceCode: "DEV-GPS-0001",
    deviceName: "车载GPS-T01",
    warehouseName: "一号大宗钢材仓",
    deviceType: "GPS设备",
    location: "苏A·88321 货车",
    status: "在线",
  },
  {
    deviceCode: "DEV-CAM-0003",
    deviceName: "CAM3 (冷链主库高清枪机)",
    warehouseName: "二号冷链仓",
    deviceType: "监控设备",
    location: "冷库主作业区",
    status: "在线",
  },
  {
    deviceCode: "DEV-IOT-0004",
    deviceName: "冷链温湿度TH03",
    warehouseName: "二号冷链仓",
    deviceType: "物联设备",
    location: "恒温库区",
    status: "在线",
  },
  {
    deviceCode: "DEV-LK-0003",
    deviceName: "智能挂锁LK03",
    warehouseName: "二号冷链仓",
    deviceType: "智能挂锁",
    location: "二号库大门",
    status: "在线",
  },
  {
    deviceCode: "DEV-FACE-0002",
    deviceName: "人脸门禁FACE02",
    warehouseName: "二号冷链仓",
    deviceType: "人脸门禁",
    location: "冷库出入通道",
    status: "在线",
  },
  {
    deviceCode: "DEV-GPS-0002",
    deviceName: "冷藏车GPS-T02",
    warehouseName: "二号冷链仓",
    deviceType: "GPS设备",
    location: "沪B·99182 冷藏车",
    status: "在线",
  },
]
