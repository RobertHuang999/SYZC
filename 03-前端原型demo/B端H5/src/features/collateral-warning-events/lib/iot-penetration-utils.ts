/** 02/01 设备事件穿透至 02/02 押品预警时的空间与事实快照 */
export type IotPenetrationDeviceSnapshot = {
  warehouseDetail: string
  installLocation: string
  deviceName: string
  deviceCode: string
  triggerSummary: string
  physicalSubType: string
  relatedEventNo: string
}

/** 与【设备预警信息】Mock 对齐的穿透源事件快照 */
export const IOT_PENETRATION_DEVICE_SNAPSHOTS: Record<
  string,
  IotPenetrationDeviceSnapshot
> = {
  "dev-evt-2026082001": {
    warehouseDetail: "一号钢材仓 / A库 / 01分区",
    installLocation: "01分区-H01挂锁位",
    deviceName: "智能挂锁-A01",
    deviceCode: "DEV-LOCK-0001",
    triggerSummary: "锁杆被剪",
    physicalSubType: "锁杆被剪",
    relatedEventNo: "DEV-LOCK-0001",
  },
  "evt-002": {
    warehouseDetail: "一号钢材仓 / B库 / 监控区",
    installLocation: "B库西侧通道",
    deviceName: "AI高清夜视摄像头-CAM1",
    deviceCode: "DEV-CAM-0001",
    triggerSummary: "行人入侵",
    physicalSubType: "行人入侵",
    relatedEventNo: "DEV-CAM-0001",
  },
  "dev-evt-2026081502": {
    warehouseDetail: "三号冷链仓 / 2号门 / 冷藏区",
    installLocation: "2号门内通道",
    deviceName: "门禁控制器-B02",
    deviceCode: "DEV-FACE-0002",
    triggerSummary: "门未关 30 分钟",
    physicalSubType: "门未关",
    relatedEventNo: "DEV-FACE-0002",
  },
  "dev-evt-2026070101": {
    warehouseDetail: "三号冷链仓 / C库 / 冷藏区",
    installLocation: "C库冷通道监测点",
    deviceName: "温湿度传感器-C11",
    deviceCode: "DEV-IOT-0011",
    triggerSummary: "库温 8.2℃ / 阈值 5.0℃",
    physicalSubType: "温度异常",
    relatedEventNo: "DEV-IOT-0011",
  },
  "dev-evt-2026081901": {
    warehouseDetail: "五号监管仓 / 运输线 / 围栏外",
    installLocation: "运输线围栏外500m",
    deviceName: "车载GPS终端-G08",
    deviceCode: "DEV-GPS-0008",
    triggerSummary: "进围栏 5.2km",
    physicalSubType: "路线偏离",
    relatedEventNo: "DEV-GPS-0008",
  },
}

export function formatIotPenetrationWarningContent(
  snapshot: IotPenetrationDeviceSnapshot
): string {
  return `仓库：${snapshot.warehouseDetail}；位置：${snapshot.installLocation}；触发内容：${snapshot.triggerSummary}`
}

export function formatIotTriggerDeviceLabel(
  snapshot: IotPenetrationDeviceSnapshot
): string {
  return `${snapshot.deviceName}（${snapshot.installLocation}）`
}

export function buildIotPenetrationInfo(
  deviceEventId: string,
  snapshot: IotPenetrationDeviceSnapshot = IOT_PENETRATION_DEVICE_SNAPSHOTS[deviceEventId] ??
    IOT_PENETRATION_DEVICE_SNAPSHOTS["dev-evt-2026082001"]
) {
  return {
    triggerDevice: formatIotTriggerDeviceLabel(snapshot),
    physicalSubType: snapshot.physicalSubType,
    triggerLocation: snapshot.warehouseDetail,
    installLocation: snapshot.installLocation,
    relatedEventNo: snapshot.relatedEventNo,
    relatedEventId: deviceEventId,
  }
}

export function resolveIotPenetrationSnapshot(
  deviceEventId: string | null | undefined
): IotPenetrationDeviceSnapshot | null {
  if (!deviceEventId) return null
  return IOT_PENETRATION_DEVICE_SNAPSHOTS[deviceEventId] ?? null
}
