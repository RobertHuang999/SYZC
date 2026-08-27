import type { DeviceWarningEvent } from "./types"

// 严格对齐《设备预警信息字段清单》解除规则：
// 1. 图像识别、智能挂锁、人脸门禁的非离线行为类预警由具备权限的用户人工解除
// 2. 物联设备离线支持人工解除
// 3. 温度、湿度、烟感、二氧化碳、氧气和全部 GPS 预警自动解除，不展示人工解除表单
export function canManualRelease(event: DeviceWarningEvent): boolean {
  if (event.warningStatus !== "OPEN_VALID") return false
  if (event.warningType === "设备物联预警") {
    return event.warningSubType === "设备离线"
  }
  if (event.warningType === "设备 GPS 预警") return false
  return ["设备图像识别预警", "智能挂锁预警", "人脸门禁预警"].includes(
    event.warningType
  )
}
