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
  "evt-017": {
    warehouseDetail: "一号钢材仓 / 西门 / 出货区",
    installLocation: "西门挂锁位LK-11",
    deviceName: "LK11",
    deviceCode: "DEV-LOCK-LK11",
    triggerSummary: "锁杆被剪",
    physicalSubType: "锁杆被剪",
    relatedEventNo: "DEV-LOCK-LK11",
  },
  "evt-002": {
    warehouseDetail: "一号钢材仓 / B库 / 监控区",
    installLocation: "B库西侧通道",
    deviceName: "CAM1",
    deviceCode: "DEV-CAM-0001",
    triggerSummary: "行人入侵",
    physicalSubType: "行人入侵",
    relatedEventNo: "DEV-CAM-0001",
  },
  "evt-009": {
    warehouseDetail: "三号冷链仓 / 2号门 / 冷藏区",
    installLocation: "2号门内通道",
    deviceName: "DOOR-A2",
    deviceCode: "DEV-FACE-0002",
    triggerSummary: "门未关 18 分钟",
    physicalSubType: "门未关",
    relatedEventNo: "DEV-FACE-0002",
  },
  "evt-010": {
    warehouseDetail: "一号钢材仓 / A库 / 01分区",
    installLocation: "H01货架东侧",
    deviceName: "温湿度TH01",
    deviceCode: "DEV-IOT-0003",
    triggerSummary: "库温超标 32℃ / 阈值 30℃",
    physicalSubType: "温度异常",
    relatedEventNo: "DEV-IOT-0003",
  },
  "evt-014": {
    warehouseDetail: "五号监管仓 / 运输线 / 围栏外",
    installLocation: "运输线围栏外500m",
    deviceName: "GPS-T002",
    deviceCode: "DEV-GPS-0008",
    triggerSummary: "进围栏 1.2km",
    physicalSubType: "进围栏",
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
    IOT_PENETRATION_DEVICE_SNAPSHOTS["evt-017"]
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
