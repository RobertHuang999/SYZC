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
    invalidReason: "关联订单预警配置已删除，历史记录置为已作废",
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

function getRealTriggerSnapshot(event: CollateralWarningEvent): string | null {
  if (event.warningSource === "物联穿透" || Boolean(event.deviceEventId)) {
    return null
  }
  if (event.warningType === "抵/质押率异常") {
    return "当前抵/质押率: 88.50% | 平仓警戒线: 85.00% | 超出平仓线: +3.50%"
  }
  if (event.warningType === "价格下跌") {
    return "现货结算价跌幅: -12.80% | 预警阈值: -12.00% | 超跌: -0.80%"
  }
  if (event.warningType === "巡检异常") {
    return "现场巡检逾期: 24.0 小时 | 计划时限: 08-19 08:00 | 巡检员未打卡"
  }
  if (event.warningType === "盘点异常") {
    return "账实盘点差异: 2.30% | 允许公差: 2.00% | 盘亏差异: 2.50 吨"
  }
  if (event.warningType === "贷中风控预警") {
    return "智风控综合评分: 38.5 分 (高危) | 准入线: 60.0 分 | 低于准入线 -21.5 分 (借款企业新增诉讼冻结)"
  }
  if (event.warningType === "解抵/质押/监管超时") {
    return "监管业务存续期限: 逾期 15 天 | 约定期限: 2026-06-01 | 监管期满未办理解除或展期"
  }
  return "业务指标超出预设风控阈值，触发规则审计快照"
}

function buildDefaultExtension(
  event: CollateralWarningEvent
): CollateralWarningEventDetailExtension {
  const isIot = event.warningSource === "物联穿透" || Boolean(event.deviceEventId)
  const isClosed = event.warningStatus === "CLOSED_VALID"
  const isInvalid = event.warningStatus === "OPEN_INVALID"

  return {
    orderType: event.orderNo.includes("99") || event.orderNo.includes("55") ? "监管" : "抵/质押",
    ruleName: event.ruleName || (isIot ? "智能挂锁防拆规则" : `${event.warningType}监控规则`),
    triggerSnapshot: getRealTriggerSnapshot(event),
    snapshotImageUrl:
      event.snapshotImageStatus === "available"
        ? `snapshot-${event.eventId}.jpg`
        : null,
    invalidReason: isInvalid ? "关联订单预警配置已注销或删除" : null,
    penetrationInfo:
      isIot && event.deviceEventId
        ? {
            triggerDevice: "智能挂锁-A01 (A库挂锁位)",
            physicalSubType: "剪杆破坏",
            triggerLocation: "一号钢材仓 / A库 / 01分区",
            relatedEventNo: `DEV-${event.eventId}`,
            relatedEventId: event.deviceEventId,
          }
        : null,
    disposalInfo: isClosed
      ? {
          situationDescription: "已联系货主核实处理，完成补保并解除预警。",
          sitePhotos:
            event.snapshotImageStatus === "available"
              ? ["现场核对记录单.jpg", "现场货物实拍.jpg"]
              : [],
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
