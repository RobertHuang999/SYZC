import type {
  MidLoanRiskRecord,
  MidLoanRiskRecordDetailExtension,
} from "../domain/types"

const DETAIL_OVERRIDES: Record<
  string,
  Partial<MidLoanRiskRecordDetailExtension>
> = {
  "mid-001": {
    ineligibilityReason: null,
    executionHistory: [],
  },
  "mid-003": {
    ineligibilityReason: "当前已有正在处理中的申请",
    executionHistory: [
      {
        executionId: "exec-mid-003-01",
        submittedAt: "2026-08-15 09:30:00",
        submittedBy: "张风控（森云科技）",
        status: "提交成功（处理中）",
        modelScore: null,
        resultDescription: "智风控平台已受理，等待异步计算结果",
        zfkTaskNo: "ZFK-20260815001",
        needsSupplement: true,
      },
    ],
  },
  "mid-005": {
    ineligibilityReason: null,
    executionHistory: [
      {
        executionId: "exec-mid-005-01",
        submittedAt: "2026-08-12 14:00:00",
        submittedBy: "张风控（森云科技）",
        status: "触发预警",
        modelScore: 42,
        resultDescription: "智风控模型评分 42，触发贷中拒绝阈值",
        zfkTaskNo: "ZFK-20260812005",
        needsSupplement: false,
      },
    ],
  },
  "mid-006": {
    ineligibilityReason: null,
    executionHistory: [
      {
        executionId: "exec-mid-006-01",
        submittedAt: "2026-08-10 11:20:00",
        submittedBy: "李信贷（森云科技）",
        status: "未触发预警",
        modelScore: 78,
        resultDescription: "模型评分通过，未触发贷中预警",
        zfkTaskNo: "ZFK-20260810006",
        needsSupplement: false,
      },
    ],
  },
}

function buildDefaultExtension(
  record: MidLoanRiskRecord
): MidLoanRiskRecordDetailExtension {
  const history =
    record.executionCount > 0 && record.lastExecutionTime
      ? [
          {
            executionId: `exec-${record.recordId}-01`,
            submittedAt: record.lastExecutionTime,
            submittedBy: record.lastSubmittedBy ?? "张风控（森云科技）",
            status: record.lastExecutionStatus,
            modelScore:
              record.lastExecutionStatus === "触发预警"
                ? 40 + (record.executionCount % 10)
                : record.lastExecutionStatus === "未触发预警"
                  ? 70 + (record.executionCount % 15)
                  : null,
            resultDescription:
              record.lastExecutionStatus === "触发预警"
                ? "智风控模型评分低于阈值，已联动生成押品预警"
                : record.lastExecutionStatus === "未触发预警"
                  ? "模型评分通过，未触发贷中预警"
                  : record.lastExecutionStatus === "提交失败"
                    ? "智风控平台接口报错，请稍后重试"
                    : record.lastExecutionStatus === "提交成功（处理中）"
                      ? "智风控平台已受理，等待异步计算结果"
                      : null,
            zfkTaskNo: `ZFK-${record.orderNo.replace("PO", "")}`,
            needsSupplement:
              record.lastExecutionStatus === "提交成功（处理中）" &&
              record.recordId.endsWith("3"),
          },
        ]
      : []

  return {
    ineligibilityReason:
      record.executability === "不可执行"
        ? "订单状态或配置不满足执行条件"
        : null,
    executionHistory: history,
  }
}

export function getMidLoanRiskDetailExtension(
  record: MidLoanRiskRecord
): MidLoanRiskRecordDetailExtension {
  const override = DETAIL_OVERRIDES[record.recordId]
  const defaults = buildDefaultExtension(record)

  if (!override) {
    return defaults
  }

  return {
    ...defaults,
    ...override,
    executionHistory: override.executionHistory ?? defaults.executionHistory,
  }
}

export function hasSupplementPending(
  extension: MidLoanRiskRecordDetailExtension
): boolean {
  return extension.executionHistory.some((entry) => entry.needsSupplement)
}
