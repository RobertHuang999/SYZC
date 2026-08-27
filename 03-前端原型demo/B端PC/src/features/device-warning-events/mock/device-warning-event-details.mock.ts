import type {
  DeviceWarningEvent,
  DeviceWarningEventDetailExtension,
} from "../domain/types"
import { WARNING_STATUS } from "../domain/status"

const DETAIL_OVERRIDES: Record<string, Partial<DeviceWarningEventDetailExtension>> =
  {
    "evt-001": {
      eventUuid: "evt-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      warningSubType: "温度异常",
      warehouseDetail: "一号钢材仓 / A库 / 01分区",
      deviceCode: "DEV-IOT-0003",
      invalidReason: null,
      debounceTrace: "Pending 2026-08-20 13:00:00 → Firing 2026-08-20 13:03:00（持续 180 秒）",
      ruleConfigSnapshot: {
        monitorThreshold: "温度 > 35.0 ℃ 或 < -5.0 ℃",
        debounceCondition: "持续超过 3 分钟",
        upgradeStrategy: "持续未解除 3 天后 ➔ 王总监(风控部)",
      },
      releaseMaterialSnapshot: {
        situationDescription: null,
        sitePhotos: [],
        releaseSnapshotImage: null,
      },
      createdAt: "2026-08-20 13:03:00",
      updatedAt: "2026-08-20 14:20:05",
      dataSource: "iot_event_ledger",
    },
    "evt-002": {
      eventUuid: "evt-b2c3d4e5-f6a7-8901-bcde-f12345678901",
      warningSubType: "行人入侵",
      warehouseDetail: "一号钢材仓 / B库 / 监控区",
      deviceCode: "DEV-CAM-0001",
      invalidReason: null,
      debounceTrace: "Pending 2026-08-20 12:40:00 → Firing 2026-08-20 12:43:00（持续 180 秒）",
      ruleConfigSnapshot: {
        monitorThreshold: "图像识别命中行人入侵",
        debounceCondition: "持续超过 3 分钟",
        upgradeStrategy: "持续未解除 2 天后 ➔ 李主管(安保部)",
      },
      releaseMaterialSnapshot: {
        situationDescription: null,
        sitePhotos: [],
        releaseSnapshotImage: null,
      },
      createdAt: "2026-08-20 12:43:00",
      updatedAt: "2026-08-20 13:05:00",
      dataSource: "iot_event_ledger",
    },
    "evt-007": {
      eventUuid: "evt-c3d4e5f6-a7b8-9012-cdef-123456789012",
      warningSubType: "烟感触发",
      warehouseDetail: "四号化工仓 / D库 / 危化区",
      deviceCode: "DEV-IOT-0103",
      invalidReason: "关联规则已删除",
      debounceTrace: "Pending 2026-08-18 22:07:00 → Firing 2026-08-18 22:10:00（持续 180 秒）",
      ruleConfigSnapshot: {
        monitorThreshold: "烟感浓度 > 阈值",
        debounceCondition: "持续超过 3 分钟",
        upgradeStrategy: "持续未解除 3 天后 ➔ 王总监(风控部)",
      },
      releaseMaterialSnapshot: {
        situationDescription: null,
        sitePhotos: [],
        releaseSnapshotImage: null,
      },
      createdAt: "2026-08-18 22:10:00",
      updatedAt: "2026-08-19 09:00:00",
      dataSource: "iot_event_ledger",
    },
    "evt-010": {
      eventUuid: "evt-d4e5f6a7-b8c9-0123-def0-234567890123",
      warningSubType: "温度异常",
      warehouseDetail: "一号钢材仓 / A库 / 01分区",
      deviceCode: "DEV-IOT-0003",
      invalidReason: null,
      debounceTrace: "Pending 2026-08-19 09:00:00 → Firing 2026-08-19 09:03:00（持续 180 秒）",
      ruleConfigSnapshot: {
        monitorThreshold: "温度 > 35.0 ℃ 或 < -5.0 ℃",
        debounceCondition: "持续超过 3 分钟",
        upgradeStrategy: "持续未解除 3 天后 ➔ 王总监(风控部)",
      },
      releaseMaterialSnapshot: {
        situationDescription: null,
        sitePhotos: [],
        releaseSnapshotImage: null,
      },
      createdAt: "2026-08-19 09:03:00",
      updatedAt: "2026-08-19 11:25:00",
      dataSource: "iot_event_ledger",
    },
    "evt-015": {
      eventUuid: "evt-e5f6a7b8-c9d0-1234-ef01-345678901234",
      warningSubType: "人脸认证失败",
      warehouseDetail: "一号钢材仓 / 主入口 / 门禁区",
      deviceCode: "DEV-FACE-0001",
      invalidReason: null,
      debounceTrace: null,
      ruleConfigSnapshot: {
        monitorThreshold: "人脸认证失败事件",
        debounceCondition: "瞬态事件，无需防抖",
        upgradeStrategy: "—",
      },
      releaseMaterialSnapshot: {
        situationDescription: "经现场安保核实，系例行巡库检修，穿戴合规工装无异常",
        sitePhotos: ["现场照片1.jpg"],
        releaseSnapshotImage: "解除联动抓拍.jpg",
      },
      createdAt: "2026-08-19 18:40:00",
      updatedAt: "2026-08-20 15:30:00",
      dataSource: "iot_event_ledger",
    },
  }

function inferSubType(event: DeviceWarningEvent): string {
  const summary = event.triggerSummary

  if (summary.includes("库温") || summary.includes("温度") || summary.includes("℃")) {
    return "温度异常"
  }
  if (summary.includes("湿度")) {
    return "湿度异常"
  }
  if (summary.includes("离线")) {
    return "设备离线"
  }
  if (summary.includes("入侵")) {
    return "行人入侵"
  }
  if (summary.includes("开锁") || summary.includes("关锁")) {
    return summary
  }
  if (summary.includes("通行") || summary.includes("刷脸")) {
    return summary
  }
  if (summary.includes("围栏")) {
    return "围栏越界"
  }

  return summary.split(" ")[0] ?? summary
}

function buildDefaultDetail(
  event: DeviceWarningEvent
): DeviceWarningEventDetailExtension {
  const hasManualRelease =
    event.processedBy !== null &&
    event.processedBy !== "系统自动处理" &&
    event.warningStatus === WARNING_STATUS.CLOSED_VALID

  return {
    eventUuid: `${event.eventId}-0000-0000-0000-${event.eventId.replace("evt-", "").padStart(12, "0")}`,
    warningSubType: inferSubType(event),
    warehouseDetail: `${event.warehouseName} / ${event.location.replace("·", " / ")}`,
    deviceCode: `DEV-${event.deviceName.replace(/\s/g, "-")}`,
    invalidReason:
      event.warningStatus === WARNING_STATUS.OPEN_INVALID
        ? "关联规则已删除"
        : null,
    debounceTrace:
      event.triggerCount > 1 || event.warningType === "设备物联预警"
        ? `Pending ${event.firstWarningTime} → Firing ${event.firstWarningTime.replace(/:\d{2}$/, ":03")}（持续 180 秒）`
        : null,
    ruleConfigSnapshot: {
      monitorThreshold: event.triggerSummary,
      debounceCondition:
        event.warningType === "常规通行与操作事务"
          ? "瞬态事件，无需防抖"
          : "持续超过 3 分钟",
      upgradeStrategy:
        event.warningStatus === WARNING_STATUS.OPEN_VALID
          ? "持续未解除 3 天后 ➔ 王总监(风控部)"
          : "—",
    },
    releaseMaterialSnapshot: {
      situationDescription: hasManualRelease
        ? "现场已核实并完成处置"
        : null,
      sitePhotos: hasManualRelease ? ["现场照片1.jpg"] : [],
      releaseSnapshotImage: hasManualRelease ? "解除联动抓拍.jpg" : null,
    },
    createdAt: event.firstWarningTime,
    updatedAt: event.latestWarningTime,
    dataSource: "iot_event_ledger",
  }
}

export function getDeviceWarningEventDetailExtension(
  event: DeviceWarningEvent
): DeviceWarningEventDetailExtension {
  const override = DETAIL_OVERRIDES[event.eventId]
  const defaults = buildDefaultDetail(event)

  if (!override) {
    return defaults
  }

  return {
    ...defaults,
    ...override,
    ruleConfigSnapshot: {
      ...defaults.ruleConfigSnapshot,
      ...override.ruleConfigSnapshot,
    },
    releaseMaterialSnapshot: {
      ...defaults.releaseMaterialSnapshot,
      ...override.releaseMaterialSnapshot,
    },
  }
}
