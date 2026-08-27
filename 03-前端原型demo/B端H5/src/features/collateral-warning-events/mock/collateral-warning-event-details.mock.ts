import type {
  CollateralWarningEvent,
  CollateralWarningEventDetailExtension,
} from "../domain/types"

const DETAIL_OVERRIDES: Record<
  string,
  Partial<CollateralWarningEventDetailExtension>
> = {
  "cw-001": {
    orderType: "抵/质押",
    ruleName: "订单抵/质押率超平仓线监控",
    triggerSnapshot: "触发线: 平仓线(85.0%)；实际质押率: 88.5%；贷款余额: ¥4,314,375；质物价值: ¥4,875,000",
    snapshotImageUrl: "snapshot-cw-001.jpg",
    invalidReason: null,
    penetrationInfo: null,
    disposalInfo: null,
  },
  "cw-002": {
    orderType: "抵/质押",
    ruleName: "智能挂锁剪杆破坏预警",
    triggerSnapshot: "位置: 一号钢材仓+A库01分区；设备名称: 智能挂锁-A01；触发预警: 锁杆被剪",
    snapshotImageUrl: "snapshot-cw-002.jpg",
    invalidReason: null,
    penetrationInfo: {
      triggerDevice: "智能挂锁-A01（DEV-LOCK-0001）",
      physicalSubType: "锁杆被剪",
      triggerLocation: "一号钢材仓 / A库 / 01分区",
      relatedEventNo: "DEV-2026082001",
      relatedEventId: "dev-evt-2026082001",
    },
    disposalInfo: null,
  },
  "cw-003": {
    orderType: "抵/质押",
    ruleName: "大宗金属质押价格下跌预警",
    triggerSnapshot: "跌幅 -12.8% / 阈值 -12.0% / 基准价 68,200 元/吨",
    snapshotImageUrl: "snapshot-cw-003.jpg",
    invalidReason: null,
    penetrationInfo: null,
    disposalInfo: {
      situationDescription:
        "已联系货主补充保证金，铜精矿货值波动在可控范围内，经复核解除预警。",
      sitePhotos: ["现场复核-01.jpg", "现场复核-02.jpg"],
      releaseSnapshotImage: "release-snapshot-cw-003.jpg",
    },
  },
  "cw-004": {
    orderType: "监管",
    ruleName: "仓库例行盘点账实差异监控",
    triggerSnapshot: "盘点差异 2.3% / 阈值 2.0%",
    snapshotImageUrl: null,
    invalidReason: "关联订单预警配置已删除，历史记录置为未处理（无效）",
    penetrationInfo: null,
    disposalInfo: null,
  },
  "cw-006": {
    orderType: "抵/质押",
    ruleName: "贷中大数据风控决策模型",
    triggerSnapshot: "模型名称: 借款人司法诉讼与涉诉高风险模型；模型分数: 82.5；预警描述: 借款主体新增被执行人记录",
    snapshotImageUrl: null,
    invalidReason: null,
    penetrationInfo: null,
    disposalInfo: null,
  },
  "cw-007": {
    orderType: "监管",
    ruleName: "监管到期未解监管预警",
    triggerSnapshot: "监管到期日: 2026年08月25日；超时天数: 3天",
    snapshotImageUrl: null,
    invalidReason: null,
    penetrationInfo: null,
    disposalInfo: null,
  },
}

function buildDefaultExtension(
  event: CollateralWarningEvent
): CollateralWarningEventDetailExtension {
  const isIot = event.warningSource === "物联穿透" || Boolean(event.deviceEventId)
  const isClosed = event.warningStatus === "CLOSED_VALID"
  const isInvalid = event.warningStatus === "OPEN_INVALID"

  return {
    orderType: event.orderNo.includes("99") || event.orderNo.includes("55") ? "监管" : "抵/质押",
    ruleName: event.ruleName || `${event.warningType}监控`,
    triggerSnapshot: isIot
      ? null
      : `触发数据快照 — ${event.warningType} / 预警订单 ${event.orderNo}`,
    snapshotImageUrl:
      event.snapshotImageStatus === "available"
        ? `snapshot-${event.eventId}.jpg`
        : null,
    invalidReason: isInvalid ? "关联订单预警配置已删除" : null,
    penetrationInfo:
      isIot && event.deviceEventId
        ? {
            triggerDevice: "智能挂锁-A01（DEV-LOCK-0001）",
            physicalSubType: "锁杆被剪",
            triggerLocation: "一号钢材仓 / A库 / 01分区",
            relatedEventNo: `DEV-${event.eventId}`,
            relatedEventId: event.deviceEventId,
          }
        : null,
    disposalInfo: isClosed
      ? {
          situationDescription: "已完成现场核查并解除预警。",
          sitePhotos:
            event.snapshotImageStatus === "available" ? ["现场-01.jpg"] : [],
          releaseSnapshotImage:
            event.snapshotImageStatus === "available"
              ? `release-${event.eventId}.jpg`
              : null,
        }
      : null,
  }
}

export function getCollateralWarningDetailExtension(
  event: CollateralWarningEvent
): CollateralWarningEventDetailExtension {
  const override = DETAIL_OVERRIDES[event.eventId]
  const defaults = buildDefaultExtension(event)

  if (!override) {
    return defaults
  }

  return {
    ...defaults,
    ...override,
    penetrationInfo:
      override.penetrationInfo !== undefined
        ? override.penetrationInfo
        : defaults.penetrationInfo,
    disposalInfo:
      override.disposalInfo !== undefined
        ? override.disposalInfo
        : defaults.disposalInfo,
  }
}
