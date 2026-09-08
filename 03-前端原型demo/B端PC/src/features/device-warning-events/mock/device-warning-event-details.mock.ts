import type {
  DeviceWarningEvent,
  DeviceWarningEventDetailExtension,
  RuleConfigSnapshot,
} from "../domain/types"
import { WARNING_STATUS } from "../domain/status"
import {
  RULE_SCENARIO_BY_EVENT_ID,
  RULE_SCENARIO_BY_ID,
} from "../../shared/mock/device-warning-scenarios"
import {
  formatDispositionSnapshotLabel,
  resolveDispositionEffects,
} from "../../device-warning-configs/domain/disposition"

type DeviceWarningEventDetailOverride = Omit<
  Partial<DeviceWarningEventDetailExtension>,
  "ruleConfigSnapshot"
> & {
  ruleConfigSnapshot?: Partial<RuleConfigSnapshot>
}

const DETAIL_OVERRIDES: Record<string, DeviceWarningEventDetailOverride> =
  {
    "evt-001": {
      eventUuid: "evt-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      warningSubType: "温度异常",
      warehouseDetail: "一号钢材仓 / A库 / 01分区",
      deviceCode: "DEV-IOT-0003",
      debounceTrace: "Pending 2026-08-20 13:00:00 → Firing 2026-08-20 13:03:00（持续 180 秒）",
      ruleConfigSnapshot: {
        monitorThreshold: "温度 > 35.0 ℃ 或 < -5.0 ℃",
        debounceCondition: "持续超过 3 分钟",
        upgradeStrategy: "持续未解除 3 天后 ➔ 王总监(风控部)",
      },
    },
    "evt-002": {
      eventUuid: "evt-b2c3d4e5-f6a7-8901-bcde-f12345678901",
      warningSubType: "行人入侵",
      warehouseDetail: "一号钢材仓 / B库 / 监控区",
      deviceCode: "DEV-CAM-0001",
      debounceTrace: "Pending 2026-08-20 12:40:00 → Firing 2026-08-20 12:45:00（持续 5 秒）",
      ruleConfigSnapshot: {
        monitorThreshold: "行人入侵/车辆入侵",
        debounceCondition: "持续超过 5 秒",
        upgradeStrategy: "持续未解除 2 天后 ➔ 李主管(安保部)",
      },
    },
    "evt-003": {
      warningSubType: "开锁通知",
      ruleConfigSnapshot: {
        monitorThreshold: "开锁通知/关锁通知",
        debounceCondition: "立即触发",
        upgradeStrategy: "—",
      },
    },
    "evt-005": {
      warningSubType: "开锁通知",
      ruleConfigSnapshot: {
        monitorThreshold: "开锁通知/关锁通知",
        debounceCondition: "立即触发",
        upgradeStrategy: "—",
      },
    },
    "evt-007": {
      eventUuid: "evt-c3d4e5f6-a7b8-9012-cdef-123456789012",
      warningSubType: "烟感异常",
      warehouseDetail: "四号化工仓 / D库 / 危化区",
      deviceCode: "DEV-IOT-0103",
      invalidReason: "关联规则已删除",
      ruleConfigSnapshot: {
        monitorThreshold: "烟感异常",
        debounceCondition: "持续超过 3 分钟",
        upgradeStrategy: "—",
      },
    },
    "evt-009": {
      warningSubType: "门未关",
      ruleConfigSnapshot: {
        monitorThreshold: "门未关",
        debounceCondition: "持续超过 1 分钟",
        upgradeStrategy: "持续未解除 3 天后 ➔ 王总监(风控部)",
      },
    },
    "evt-010": {
      warningSubType: "温度异常",
      ruleConfigSnapshot: {
        monitorThreshold: "温度 > 35.0 ℃ 或 < -5.0 ℃",
        debounceCondition: "持续超过 3 分钟",
        upgradeStrategy: "—",
      },
    },
    "evt-014": {
      warningSubType: "进围栏",
      ruleConfigSnapshot: {
        monitorThreshold: "进围栏/出围栏",
        debounceCondition: "持续超过 10 秒",
        upgradeStrategy: "持续未解除 3 天后 ➔ 王总监(风控部)",
      },
    },
    "evt-015": {
      eventUuid: "evt-e5f6a7b8-c9d0-1234-ef01-345678901234",
      warningSubType: "密码错误",
      warehouseDetail: "一号钢材仓 / 主入口 / 门禁区",
      deviceCode: "DEV-FACE-0001",
      debounceTrace: null,
      ruleConfigSnapshot: {
        monitorThreshold: "密码错误",
        debounceCondition: "立即触发",
        upgradeStrategy: "—",
      },
      releaseMaterialSnapshot: {
        situationDescription: "经现场安保核实，系访客误输临时密码，已登记离场",
        sitePhotos: ["现场照片1.jpg"],
        releaseSnapshotImage: "解除联动抓拍.jpg",
      },
    },
    "evt-004": {
      warningSubType: "设备离线",
      ruleConfigSnapshot: {
        monitorThreshold: "设备离线",
        debounceCondition: "持续超过 5 分钟",
        upgradeStrategy: "持续未解除 3 天后 ➔ 王总监(风控部)",
      },
    },
    "evt-006": {
      warningSubType: "湿度异常",
      ruleConfigSnapshot: {
        monitorThreshold: "湿度异常",
        debounceCondition: "持续超过 3 分钟",
        upgradeStrategy: "持续未解除 3 天后 ➔ 王总监(风控部)",
      },
    },
    "evt-008": {
      warningSubType: "设备离线",
      ruleConfigSnapshot: {
        monitorThreshold: "设备离线",
        debounceCondition: "持续超过 5 分钟",
        upgradeStrategy: "—",
      },
    },
    "evt-013": {
      warningSubType: "开锁通知",
      ruleConfigSnapshot: {
        monitorThreshold: "开锁通知",
        debounceCondition: "立即触发",
        upgradeStrategy: "—",
      },
    },
    "evt-018": {
      warningSubType: "关锁通知",
      ruleConfigSnapshot: {
        monitorThreshold: "开锁通知/关锁通知",
        debounceCondition: "立即触发",
        upgradeStrategy: "—",
      },
    },
  }

function inferSubType(event: DeviceWarningEvent): string {
  const linked = RULE_SCENARIO_BY_EVENT_ID[event.eventId]
  if (linked) {
    const matched = linked.warningSubTypes.find((subType) =>
      event.triggerSummary.includes(subType)
    )
    if (matched) return matched
    return linked.warningSubTypes[0] ?? event.triggerSummary
  }

  const summary = event.triggerSummary
  if (summary.includes("库温") || summary.includes("温度") || summary.includes("℃")) {
    return "温度异常"
  }
  if (summary.includes("湿度")) return "湿度异常"
  if (summary.includes("离线")) return "设备离线"
  if (summary.includes("入侵")) return "行人入侵"
  if (summary.includes("围栏")) return summary.includes("出") ? "出围栏" : "进围栏"
  if (summary.includes("门未关")) return "门未关"
  if (summary.includes("烟感")) return "烟感异常"

  return summary.split(" ")[0] ?? summary
}

function buildDefaultDetail(
  event: DeviceWarningEvent
): DeviceWarningEventDetailExtension {
  const linkedRule = RULE_SCENARIO_BY_EVENT_ID[event.eventId]
  const linkedConfig = linkedRule ? RULE_SCENARIO_BY_ID[linkedRule.configId] : undefined
  const warningSubType = inferSubType(event)
  const dispositionMode = event.dispositionMode
  const { hideUpgrade } = resolveDispositionEffects(dispositionMode)

  const hasManualRelease =
    event.processedBy !== null &&
    event.processedBy !== "系统自动处理" &&
    event.warningStatus === WARNING_STATUS.CLOSED_VALID

  return {
    eventUuid: `${event.eventId}-0000-0000-0000-${event.eventId.replace("evt-", "").padStart(12, "0")}`,
    warningSubType,
    warehouseDetail: `${event.warehouseName} / ${event.location.replace("·", " / ")}`,
    deviceCode: `DEV-${event.deviceName.replace(/\s/g, "-")}`,
    invalidReason:
      event.warningStatus === WARNING_STATUS.OPEN_INVALID
        ? "关联规则已删除"
        : null,
    debounceTrace:
      dispositionMode === "RECORD_ONLY"
        ? null
        : event.triggerCount > 1 || event.warningType === "设备物联预警"
          ? `Pending ${event.firstWarningTime} → Firing ${event.firstWarningTime.replace(/:\d{2}$/, ":03")}（持续 180 秒）`
          : null,
    ruleConfigSnapshot: {
      dispositionMode: formatDispositionSnapshotLabel(dispositionMode),
      monitorThreshold:
        linkedConfig?.triggerCondition ?? event.triggerSummary,
      debounceCondition:
        linkedConfig?.debounceCondition === "立即触发"
          ? "立即触发"
          : linkedConfig?.debounceCondition ?? "持续超过 3 分钟",
      upgradeStrategy:
        hideUpgrade
          ? "—"
          : event.warningStatus === WARNING_STATUS.OPEN_VALID
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
