import type { DeviceWarningConfig } from "../domain/types"

const baseConfigs: DeviceWarningConfig[] = [
  {
    configId: "dwc-001",
    ruleName: "A库人体入侵",
    warningType: "设备图像识别预警",
    severityLevelId: "sl-l5",
    deviceScope: "已选 4 台摄像头",
    triggerCondition: "行人/车辆入侵",
    debounceCondition: "持续>5秒",
    status: "生效中",
    createdBy: "张工",
    createdAt: "08-18 09:20",
    updatedBy: "黄k",
    updatedAt: "2026-08-20 16:45:00",
  },
  {
    configId: "dwc-002",
    ruleName: "库温超标预警",
    warningType: "设备物联预警",
    severityLevelId: "sl-l4",
    deviceScope: "已选 6 台温湿度计",
    triggerCondition: "温度>35℃ 或 <-5℃",
    debounceCondition: "持续>3分",
    status: "生效中",
    createdBy: "张工",
    createdAt: "08-17 11:10",
    updatedBy: "张工",
    updatedAt: "2026-08-19 14:20:00",
  },
  {
    configId: "dwc-003",
    ruleName: "挂锁防拆报警",
    warningType: "智能挂锁预警",
    severityLevelId: "sl-l5",
    deviceScope: "已选 12 把挂锁",
    triggerCondition: "剪杆/拆壳破坏",
    debounceCondition: "立即触发",
    status: "生效中",
    createdBy: "李运维",
    createdAt: "08-16 15:30",
    updatedBy: "李运维",
    updatedAt: "2026-08-16 15:30:00",
  },
  {
    configId: "dwc-004",
    ruleName: "门锁开关记录",
    warningType: "智能挂锁预警",
    severityLevelId: "sl-l2",
    deviceScope: "已选 8 把挂锁",
    triggerCondition: "正常开关锁",
    debounceCondition: "立即触发",
    status: "停用",
    createdBy: "李运维",
    createdAt: "08-10 10:00",
    updatedBy: "黄k",
    updatedAt: "2026-08-15 18:00:00",
  },
  {
    configId: "dwc-005",
    ruleName: "新监控上线通知",
    warningType: "设备图像识别预警",
    severityLevelId: "sl-l1",
    deviceScope: "仅针对新设备（全局监听）",
    triggerCondition: "监控设备上线",
    debounceCondition: "立即触发",
    status: "生效中",
    createdBy: "系统",
    createdAt: "08-01 00:00",
    updatedBy: "系统",
    updatedAt: "2026-08-01 00:00:00",
  },
  {
    configId: "dwc-006",
    ruleName: "传感器离线",
    warningType: "设备物联预警",
    severityLevelId: "sl-l3",
    deviceScope: "已选 3 台传感器",
    triggerCondition: "物联传感器离线",
    debounceCondition: "持续>5分",
    status: "已失效",
    createdBy: "张工",
    createdAt: "07-20 08:30",
    updatedBy: "系统",
    updatedAt: "2026-08-12 09:00:00",
  },
]

const extraRuleNames = [
  "B库夜间入侵",
  "门禁异常刷卡",
  "GPS越界告警",
  "湿度超限预警",
  "挂锁低电量",
  "摄像头遮挡",
  "冷链温度波动",
  "人脸通行异常",
  "设备心跳丢失",
  "GPS静止超时",
  "仓库门未关",
  "烟雾浓度超标",
  "锁具撬开检测",
  "车辆滞留",
  "人员聚集",
  "视频流中断",
  "温湿度计故障",
  "新门禁上线",
  "GPS设备拆卸",
  "人脸识别失败",
  "库内明火识别",
  "挂锁长时间未关",
]

const warningTypeCycle = [
  "设备图像识别预警",
  "设备物联预警",
  "智能挂锁预警",
  "人脸门禁预警",
  "设备GPS预警",
] as const

const severityCycle = ["sl-l1", "sl-l2", "sl-l3", "sl-l4", "sl-l5"] as const
const statusCycle = ["生效中", "生效中", "生效中", "停用", "生效中"] as const

function buildExtraConfigs(): DeviceWarningConfig[] {
  return extraRuleNames.map((ruleName, index) => {
    const day = String(10 + (index % 10)).padStart(2, "0")
    const hour = String(8 + (index % 12)).padStart(2, "0")
    const status = statusCycle[index % statusCycle.length]

    return {
      configId: `dwc-${String(index + 7).padStart(3, "0")}`,
      ruleName,
      warningType: warningTypeCycle[index % warningTypeCycle.length],
      severityLevelId: severityCycle[index % severityCycle.length],
      deviceScope:
        index % 4 === 0
          ? "仅针对新设备（全局监听）"
          : `已选 ${3 + (index % 10)} 台设备`,
      triggerCondition: `${ruleName}触发条件`,
      debounceCondition: index % 2 === 0 ? "立即触发" : "持续>3分",
      status,
      createdBy: index % 2 === 0 ? "张工" : "李运维",
      createdAt: `08-${day} ${hour}:00`,
      updatedBy: index % 3 === 0 ? "黄k" : "张工",
      updatedAt: `2026-08-${day} ${hour}:30:00`,
    }
  })
}

export const deviceWarningConfigsMock: DeviceWarningConfig[] = [
  ...baseConfigs,
  ...buildExtraConfigs(),
]
