import type {
  RiskDisclosureRecord,
  RiskDisclosureRecordDetailExtension,
} from "../domain/types"

const DETAIL_OVERRIDES: Record<
  string,
  Partial<RiskDisclosureRecordDetailExtension>
> = {
  "pub-seed-001": {
    disclosureTitle: "铜精矿货值下跌风险公示",
    disclosureContent:
      "经核实，订单 PO202607-12 项下铜精矿货值较基准价下跌 12.8%，已超出预警阈值。货主已补充保证金并完成处置，现予以公示备案。",
    operationHistory: [
      {
        action: "首次公示",
        operator: "合规专员（森云科技）",
        operatedAt: "2026-07-31 14:20:00",
        remark: null,
      },
    ],
    cancelReason: null,
  },
  "pub-seed-002": {
    disclosureTitle: "巡检超时风险公示",
    disclosureContent:
      "订单 PO202607-08 计划巡检超时 48 小时，责任人未按时到场。经监管方复核后已处置并公示。",
    operationHistory: [
      {
        action: "首次公示",
        operator: "合规专员（森云科技）",
        operatedAt: "2026-07-30 10:00:00",
        remark: null,
      },
    ],
    cancelReason: null,
  },
}

function buildDefaultExtension(
  record: RiskDisclosureRecord
): RiskDisclosureRecordDetailExtension {
  return {
    disclosureTitle: `${record.warningType} — ${record.orderNo}`,
    disclosureContent: `关于订单 ${record.orderNo}（货主：${record.ownerName}）的${record.warningType}风险公示：${record.warningContent}。经核实处置后予以公示。`,
    originalWarning: {
      warningType: record.warningType,
      warningContent: record.warningContent,
      warningTime: record.warningTime,
      processedTime: record.processedTime,
      processedBy: record.processedBy,
      snapshotImageStatus: record.snapshotImageStatus,
    },
    operationHistory: [
      {
        action: "首次公示",
        operator: record.lastOperator,
        operatedAt: record.lastDisclosureTime,
        remark: null,
      },
      ...(record.disclosureStatus === "已取消"
        ? [
            {
              action: "取消公示",
              operator: record.lastOperator,
              operatedAt: record.lastDisclosureTime,
              remark: "公示内容需进一步核实",
            },
          ]
        : []),
    ],
    cancelReason:
      record.disclosureStatus === "已取消" ? "公示内容需进一步核实" : null,
  }
}

export function getRiskDisclosureDetailExtension(
  record: RiskDisclosureRecord
): RiskDisclosureRecordDetailExtension {
  const override = DETAIL_OVERRIDES[record.recordId]
  const defaults = buildDefaultExtension(record)

  if (!override) {
    return defaults
  }

  return {
    ...defaults,
    ...override,
    originalWarning: override.originalWarning ?? defaults.originalWarning,
    operationHistory: override.operationHistory ?? defaults.operationHistory,
  }
}
