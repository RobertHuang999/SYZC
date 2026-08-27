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
    ruleName: "LTV平仓线监控",
    triggerSnapshot: "LTV 88.5% / 平仓线 85% / 配置版本 v2.3",
    snapshotImageUrl: "snapshot-cw-001.jpg",
    invalidReason: null,
    penetrationInfo: null,
    disposalInfo: null,
  },
  "cw-002": {
    orderType: "抵/质押",
    ruleName: "智能挂锁破坏穿透",
    triggerSnapshot: null,
    snapshotImageUrl: "snapshot-cw-002.jpg",
    invalidReason: null,
    penetrationInfo: {
      triggerDevice: "智能挂锁-LK11（A库挂锁位）",
      physicalSubType: "剪杆破坏",
      triggerLocation: "一号钢材仓 / A库 / 01分区",
      relatedEventNo: "DEV-2026082001",
      relatedEventId: "evt-017",
    },
    disposalInfo: null,
  },
  "cw-003": {
    orderType: "抵/质押",
    ruleName: "货值下跌监控",
    triggerSnapshot: "跌幅 -12.8% / 阈值 -12% / 基准价 68,200 元/吨",
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
    ruleName: "盘点差异监控",
    triggerSnapshot: "盘点差异 2.3% / 阈值 2.0%",
    snapshotImageUrl: null,
    invalidReason: "关联订单预警配置已删除",
    penetrationInfo: null,
    disposalInfo: null,
  },
}

function buildDefaultExtension(
  event: CollateralWarningEvent
): CollateralWarningEventDetailExtension {
  const isIot = event.warningType === "物联穿透告警"
  const isClosed = event.warningStatus === "CLOSED_VALID"
  const isInvalid = event.warningStatus === "OPEN_INVALID"

  return {
    orderType: event.orderNo.includes("99") ? "监管" : "抵/质押",
    ruleName: isIot ? "物联穿透规则" : `${event.warningType}监控`,
    triggerSnapshot: isIot
      ? null
      : `模拟触发快照 — ${event.warningType} / 订单 ${event.orderNo}`,
    snapshotImageUrl:
      event.snapshotImageStatus === "available"
        ? `snapshot-${event.eventId}.jpg`
        : null,
    invalidReason: isInvalid ? "关联订单预警配置已删除" : null,
    penetrationInfo:
      isIot && event.deviceEventId
        ? {
            triggerDevice: "智能挂锁-A01（A库挂锁位）",
            physicalSubType: "剪杆破坏",
            triggerLocation: "一号钢材仓 / A库 / 01分区",
            relatedEventNo: `DEV-${event.eventId}`,
            relatedEventId: event.deviceEventId,
          }
        : null,
    disposalInfo: isClosed
      ? {
          situationDescription: "已完成现场复核并解除预警。",
          sitePhotos: event.snapshotImageStatus === "available" ? ["现场-01.jpg"] : [],
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
