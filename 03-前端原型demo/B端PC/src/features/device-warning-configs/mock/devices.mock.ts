export type MockDeviceItem = {
  deviceCode: string
  deviceName: string
  warehouseName: string
  deviceType: string
  location: string
  status: "在线" | "离线"
}

export const MOCK_DEVICE_POOL: MockDeviceItem[] = [
  // 摄像头设备
  {
    deviceCode: "DEV-CAM-0001",
    deviceName: "CAM1 (东门高清枪机)",
    warehouseName: "一号大宗钢材仓",
    deviceType: "监控设备",
    location: "A库东门-入口通道",
    status: "在线",
  },
  {
    deviceCode: "DEV-CAM-0002",
    deviceName: "CAM2 (主走廊全景球机)",
    warehouseName: "一号大宗钢材仓",
    deviceType: "监控设备",
    location: "A库主通道-01区上空",
    status: "在线",
  },
  {
    deviceCode: "DEV-CAM-0003",
    deviceName: "CAM3 (西区全景枪机)",
    warehouseName: "一号大宗钢材仓",
    deviceType: "监控设备",
    location: "B库西侧作业通道",
    status: "在线",
  },
  {
    deviceCode: "DEV-CAM-0004",
    deviceName: "CAM4 (南门闸机枪机)",
    warehouseName: "一号大宗钢材仓",
    deviceType: "监控设备",
    location: "A库南门-出入口",
    status: "在线",
  },
  {
    deviceCode: "DEV-CAM-0005",
    deviceName: "CAM5 (冷链主库高清枪机)",
    warehouseName: "二号冷链仓",
    deviceType: "监控设备",
    location: "冷库主作业区",
    status: "在线",
  },

  // 温湿度及物联传感器
  {
    deviceCode: "DEV-IOT-0001",
    deviceName: "温湿度TH01",
    warehouseName: "一号大宗钢材仓",
    deviceType: "物联设备",
    location: "A库01分区-货架H01",
    status: "在线",
  },
  {
    deviceCode: "DEV-IOT-0002",
    deviceName: "温湿度TH02",
    warehouseName: "一号大宗钢材仓",
    deviceType: "物联设备",
    location: "A库01分区-货架H02",
    status: "在线",
  },
  {
    deviceCode: "DEV-IOT-0003",
    deviceName: "温湿度TH03",
    warehouseName: "一号大宗钢材仓",
    deviceType: "物联设备",
    location: "A库02分区-货架H05",
    status: "在线",
  },
  {
    deviceCode: "DEV-IOT-0004",
    deviceName: "温湿度TH04",
    warehouseName: "一号大宗钢材仓",
    deviceType: "物联设备",
    location: "B库01分区-货架H10",
    status: "在线",
  },
  {
    deviceCode: "DEV-IOT-0005",
    deviceName: "温湿度TH05",
    warehouseName: "一号大宗钢材仓",
    deviceType: "物联设备",
    location: "B库02分区-货架H15",
    status: "在线",
  },
  {
    deviceCode: "DEV-IOT-0006",
    deviceName: "温湿度TH06",
    warehouseName: "一号大宗钢材仓",
    deviceType: "物联设备",
    location: "B库03分区-货架H20",
    status: "离线",
  },
  {
    deviceCode: "DEV-IOT-0007",
    deviceName: "感烟探测器YG01",
    warehouseName: "一号大宗钢材仓",
    deviceType: "物联设备",
    location: "A库顶部-吸顶安装",
    status: "在线",
  },
  {
    deviceCode: "DEV-IOT-0008",
    deviceName: "冷链温湿度TH07",
    warehouseName: "二号冷链仓",
    deviceType: "物联设备",
    location: "恒温库区-01通道",
    status: "在线",
  },

  // 智能挂锁
  {
    deviceCode: "DEV-LK-0001",
    deviceName: "智能挂锁LK01",
    warehouseName: "一号大宗钢材仓",
    deviceType: "智能挂锁",
    location: "A库主出入口大门",
    status: "在线",
  },
  {
    deviceCode: "DEV-LK-0002",
    deviceName: "智能挂锁LK02",
    warehouseName: "一号大宗钢材仓",
    deviceType: "智能挂锁",
    location: "A库东侧应急疏散门",
    status: "在线",
  },
  {
    deviceCode: "DEV-LK-0003",
    deviceName: "智能挂锁LK03",
    warehouseName: "一号大宗钢材仓",
    deviceType: "智能挂锁",
    location: "B库主出入口大门",
    status: "在线",
  },
  {
    deviceCode: "DEV-LK-0004",
    deviceName: "智能挂锁LK04",
    warehouseName: "一号大宗钢材仓",
    deviceType: "智能挂锁",
    location: "B库侧门通道",
    status: "在线",
  },
  {
    deviceCode: "DEV-LK-0005",
    deviceName: "智能挂锁LK05",
    warehouseName: "一号大宗钢材仓",
    deviceType: "智能挂锁",
    location: "监管专区隔离网门-01",
    status: "在线",
  },
  {
    deviceCode: "DEV-LK-0006",
    deviceName: "智能挂锁LK06",
    warehouseName: "一号大宗钢材仓",
    deviceType: "智能挂锁",
    location: "监管专区隔离网门-02",
    status: "在线",
  },
  {
    deviceCode: "DEV-LK-0007",
    deviceName: "智能挂锁LK07",
    warehouseName: "一号大宗钢材仓",
    deviceType: "智能挂锁",
    location: "贵重金属在押库门",
    status: "在线",
  },
  {
    deviceCode: "DEV-LK-0008",
    deviceName: "智能挂锁LK08",
    warehouseName: "一号大宗钢材仓",
    deviceType: "智能挂锁",
    location: "质押货位围栏门-A1",
    status: "在线",
  },
  {
    deviceCode: "DEV-LK-0009",
    deviceName: "智能挂锁LK09",
    warehouseName: "一号大宗钢材仓",
    deviceType: "智能挂锁",
    location: "质押货位围栏门-A2",
    status: "在线",
  },
  {
    deviceCode: "DEV-LK-0010",
    deviceName: "智能挂锁LK10",
    warehouseName: "一号大宗钢材仓",
    deviceType: "智能挂锁",
    location: "质押货位围栏门-B1",
    status: "在线",
  },
  {
    deviceCode: "DEV-LK-0011",
    deviceName: "智能挂锁LK11",
    warehouseName: "一号大宗钢材仓",
    deviceType: "智能挂锁",
    location: "质押货位围栏门-B2",
    status: "在线",
  },
  {
    deviceCode: "DEV-LK-0012",
    deviceName: "智能挂锁LK12",
    warehouseName: "一号大宗钢材仓",
    deviceType: "智能挂锁",
    location: "设备机房安全门",
    status: "离线",
  },

  // 人脸门禁
  {
    deviceCode: "DEV-FACE-0001",
    deviceName: "人脸门禁FACE01",
    warehouseName: "一号大宗钢材仓",
    deviceType: "人脸门禁",
    location: "主大门进门闸机",
    status: "在线",
  },
  {
    deviceCode: "DEV-FACE-0002",
    deviceName: "人脸门禁FACE02",
    warehouseName: "一号大宗钢材仓",
    deviceType: "人脸门禁",
    location: "主大门出门闸机",
    status: "在线",
  },

  // GPS车载设备
  {
    deviceCode: "DEV-GPS-0001",
    deviceName: "车载GPS-T01",
    warehouseName: "一号大宗钢材仓",
    deviceType: "GPS设备",
    location: "苏A·88321 重型半挂牵引车",
    status: "在线",
  },
  {
    deviceCode: "DEV-GPS-0002",
    deviceName: "车载GPS-T02",
    warehouseName: "一号大宗钢材仓",
    deviceType: "GPS设备",
    location: "苏A·92610 重型集装箱半挂车",
    status: "在线",
  },
]

/**
 * 根据预警配置对象解析匹配的已关联设备列表
 */
export function getDevicesForConfig(
  warningType: string,
  deviceScope: string,
  newDeviceOnly: boolean
): MockDeviceItem[] {
  if (newDeviceOnly) {
    return []
  }

  // 1. 如果 deviceScope 里包含明确的 DEV 编号
  const explicitCodes = deviceScope.match(/DEV-[A-Z0-9-]+/g)
  if (explicitCodes && explicitCodes.length > 0) {
    const matched = MOCK_DEVICE_POOL.filter((d) => explicitCodes.includes(d.deviceCode))
    if (matched.length > 0) return matched
  }

  // 2. 根据预警类型分类匹配
  if (warningType.includes("图像") || warningType.includes("摄像头")) {
    const count = extractCount(deviceScope) || 4
    return MOCK_DEVICE_POOL.filter((d) => d.deviceType === "监控设备").slice(0, count)
  }

  if (warningType.includes("物联") || warningType.includes("传感")) {
    const count = extractCount(deviceScope) || 6
    return MOCK_DEVICE_POOL.filter((d) => d.deviceType === "物联设备").slice(0, count)
  }

  if (warningType.includes("挂锁")) {
    const count = extractCount(deviceScope) || 12
    return MOCK_DEVICE_POOL.filter((d) => d.deviceType === "智能挂锁").slice(0, count)
  }

  if (warningType.includes("人脸") || warningType.includes("门禁")) {
    const count = extractCount(deviceScope) || 2
    return MOCK_DEVICE_POOL.filter((d) => d.deviceType === "人脸门禁").slice(0, count)
  }

  if (warningType.includes("GPS") || warningType.includes("车载")) {
    const count = extractCount(deviceScope) || 2
    return MOCK_DEVICE_POOL.filter((d) => d.deviceType === "GPS设备").slice(0, count)
  }

  return MOCK_DEVICE_POOL.slice(0, 5)
}

function extractCount(scope: string): number | null {
  const match = scope.match(/(\d+)\s*台|(\d+)\s*把|(\d+)\s*个/)
  if (match) {
    const num = parseInt(match[1] || match[2] || match[3], 10)
    return isNaN(num) ? null : num
  }
  return null
}
