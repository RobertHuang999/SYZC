import type {
  CollateralWarningEvent,
  CollateralWarningEventDetailExtension,
  CollateralOrderSnapshot,
  CollateralTriggerSnapshot,
} from "../domain/types"

/**
 * 结构化构建真实的押品订单与仓储位置快照（严格对齐字段清单第四章）
 */
function buildOrderSnapshot(event: CollateralWarningEvent): CollateralOrderSnapshot {
  const isCustody = event.orderNo.includes("99") || event.warningType.includes("监管")
  if (event.warningType === "抵/质押率异常") {
    return {
      orderType: "抵/质押",
      ownerCompany: "浙江物产中大金属集团有限公司",
      cargoName: "热轧卷板 Q235B (批次 202608-A)",
      cargoQuantity: "500.00 吨",
      storageLocation: "一号钢材仓 / A库 / 01分区-H02",
      collateralValue: "¥ 4,875,000.00",
      loanBalance: "¥ 4,314,375.00",
    }
  }
  if (event.warningType === "价格下跌") {
    return {
      orderType: "抵/质押",
      ownerCompany: "江苏国泰大宗供应链有限公司",
      cargoName: "阴极电解铜 A级 (GB/T 467-2010)",
      cargoQuantity: "120.00 吨",
      storageLocation: "有色金属标准仓 / B库 / 03货位",
      collateralValue: "¥ 8,184,000.00",
      loanBalance: "¥ 6,200,000.00",
    }
  }
  if (event.warningType === "物联穿透告警") {
    return {
      orderType: "抵/质押",
      ownerCompany: "无锡中联仓储物流实业有限公司",
      cargoName: "热轧卷板 Q235B (批次 202608-A)",
      cargoQuantity: "350.00 吨",
      storageLocation: "一号钢材仓 / A库 / 01分区",
      collateralValue: "¥ 3,412,500.00",
      loanBalance: "¥ 2,800,000.00",
    }
  }
  if (event.warningType === "巡检异常") {
    return {
      orderType: isCustody ? "监管" : "抵/质押",
      ownerCompany: "上海远大国际贸易实业有限公司",
      cargoName: "铝锭 A00 (GB/T 1196-2017)",
      cargoQuantity: "280.00 吨",
      storageLocation: "二号有色仓 / C库 / 02货区",
      collateralValue: "¥ 5,600,000.00",
      loanBalance: "¥ 4,000,000.00",
    }
  }
  if (event.warningType === "盘点异常") {
    return {
      orderType: "监管",
      ownerCompany: "山东寿光农产品现货物流有限公司",
      cargoName: "菜籽油 一级 (国标GB 1536)",
      cargoQuantity: "400.00 吨",
      storageLocation: "液体储罐仓 / 罐区T-03",
      collateralValue: "¥ 3,800,000.00",
      loanBalance: "¥ 2,600,000.00",
    }
  }
  if (event.warningType === "贷中风控预警") {
    return {
      orderType: "抵/质押",
      ownerCompany: "中融泰和国际大宗贸易有限公司",
      cargoName: "天然橡胶 SCR 5 (国标GB/T 8081)",
      cargoQuantity: "200.00 吨",
      storageLocation: "橡胶恒温仓 / 库房D-01",
      collateralValue: "¥ 3,100,000.00",
      loanBalance: "¥ 2,500,000.00",
    }
  }
  return {
    orderType: isCustody ? "监管" : "抵/质押",
    ownerCompany: "河南中原黄金大宗供应链有限公司",
    cargoName: "工业硅 421# (GB/T 2881)",
    cargoQuantity: "150.00 吨",
    storageLocation: "综合原料仓 / E库 / 01货架",
    collateralValue: "¥ 2,250,000.00",
    loanBalance: "¥ 1,800,000.00",
  }
}

/**
 * 结构化构建触发时刻的真实判定数据依据（严格对齐字段清单第四章：触发数据快照）
 */
function buildTriggerSnapshot(event: CollateralWarningEvent): CollateralTriggerSnapshot | null {
  if (event.warningType === "物联穿透告警") {
    return null
  }
  if (event.warningType === "抵/质押率异常") {
    return {
      metricName: "当前抵/质押率 (LTV)",
      triggerValue: "88.50%",
      thresholdValue: "85.00% (平仓线)",
      deviation: "超出平仓警戒线 +3.50%",
      ruleVersion: "Version 2 (v2.3)",
    }
  }
  if (event.warningType === "价格下跌") {
    return {
      metricName: "现货价格跌幅",
      triggerValue: "-12.80%",
      thresholdValue: "-12.00%",
      deviation: "超跌 -0.80% (现货基准价 ¥68,200/吨)",
      ruleVersion: "Version 1 (v1.0)",
    }
  }
  if (event.warningType === "巡检异常") {
    return {
      metricName: "例行巡检时效",
      triggerValue: "逾期 24.0 小时",
      thresholdValue: "计划时限: 08-19 08:00",
      deviation: "超时未打卡 (责任人: 巡检员刘强)",
      ruleVersion: "Version 1 (v1.2)",
    }
  }
  if (event.warningType === "盘点异常") {
    return {
      metricName: "账实盘点差异率",
      triggerValue: "差异率 2.30%",
      thresholdValue: "允许公差 2.00%",
      deviation: "超差 +0.30% (盘亏 2.50 吨)",
      ruleVersion: "Version 2 (v2.0)",
    }
  }
  if (event.warningType === "贷中风控预警") {
    return {
      metricName: "智风控综合评分",
      triggerValue: "38.5 分 (高危)",
      thresholdValue: "准入线 60.0 分",
      deviation: "低于准入线 -21.5 分 (借款企业新增诉讼冻结)",
      ruleVersion: "Version 3 (v3.1)",
    }
  }
  if (event.warningType === "解抵/质押/监管超时") {
    return {
      metricName: "监管业务存续期限",
      triggerValue: "逾期 15 天",
      thresholdValue: "约定期限: 2026-06-01",
      deviation: "监管期满未办理解除或展期",
      ruleVersion: "Version 1 (v1.0)",
    }
  }
  return {
    metricName: "业务指标偏离",
    triggerValue: "超标异常",
    thresholdValue: "预警警戒线",
    deviation: "触及风控规则预警阈值",
    ruleVersion: "Version 1 (v1.0)",
  }
}

export function getCollateralWarningDetailExtension(
  event: CollateralWarningEvent
): CollateralWarningEventDetailExtension {
  const isIot = event.warningType === "物联穿透告警"
  const isClosed = event.warningStatus === "CLOSED_VALID"
  const isInvalid = event.warningStatus === "OPEN_INVALID"
  const orderSnapshot = buildOrderSnapshot(event)
  const triggerSnapshot = buildTriggerSnapshot(event)

  return {
    orderType: orderSnapshot.orderType,
    ruleName: isIot
      ? "智能挂锁防拆规则 (设备快照)"
      : `${event.warningType}风控规则`,
    version: 1,
    orderSnapshot,
    triggerSnapshot,
    snapshotImageUrl:
      event.snapshotImageStatus === "available"
        ? `snapshot-${event.eventId}.jpg`
        : null,
    invalidReason: isInvalid ? "关联订单预警配置已失效或删除（规则版本注销）" : null,
    penetrationInfo: isIot
      ? {
          triggerDevice: "智能挂锁-A01 (A库挂锁位)",
          physicalSubType: "剪杆破坏",
          triggerLocation: orderSnapshot.storageLocation,
          relatedEventNo: "DEV-2026082001",
          relatedEventId: event.deviceEventId ?? "evt-017",
        }
      : null,
    disposalInfo: isClosed
      ? {
          situationDescription:
            event.warningType === "价格下跌"
              ? "已联系货主补充足额质押保证金人民币 150 万元，抵押率已恢复至安全线以下。"
              : "已进行现场复核，核实货物实际盘存无误，风控专员已确认解除预警。",
          sitePhotos: ["现场复核确认单.jpg", "货位实地核对照片.jpg"],
          releaseSnapshotImage:
            event.snapshotImageStatus === "available"
              ? `release-snapshot-${event.eventId}.jpg`
              : null,
        }
      : null,
  }
}
