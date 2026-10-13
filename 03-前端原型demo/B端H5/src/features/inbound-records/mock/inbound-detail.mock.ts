export type MobileInboundDetailExtra = {
  iotCaptures: Array<{
    id: string
    deviceName: string
    capturedAt: string
    status: "成功" | "失败"
    label: string
  }>
  modifyLogs: Array<{
    fieldLabel: string
    beforeValue: string
    afterValue: string
    operator: string
    operatedAt: string
  }>
}

const EXTRAS: Record<string, MobileInboundDetailExtra> = {
  "m-inbound-3": {
    iotCaptures: [
      {
        id: "iot-1",
        deviceName: "冻库1-卸货枪机",
        capturedAt: "2026-05-28 15:16:02",
        status: "成功",
        label: "货位全景抓拍",
      },
    ],
    modifyLogs: [],
  },
  "m-inbound-2": {
    iotCaptures: [
      {
        id: "iot-1",
        deviceName: "干粮库-月台球机",
        capturedAt: "2026-06-02 16:25:30",
        status: "失败",
        label: "抓拍失败，稍后补录（R18）",
      },
    ],
    modifyLogs: [],
  },
}

const DEFAULT_EXTRA: MobileInboundDetailExtra = {
  iotCaptures: [
    {
      id: "iot-default",
      deviceName: "海霸王-卸货区-枪机03",
      capturedAt: "2026-06-03 10:12:10",
      status: "成功",
      label: "入库抓拍",
    },
  ],
  modifyLogs: [],
}

export function getMobileInboundDetailExtra(id: string): MobileInboundDetailExtra {
  return EXTRAS[id] ?? DEFAULT_EXTRA
}
