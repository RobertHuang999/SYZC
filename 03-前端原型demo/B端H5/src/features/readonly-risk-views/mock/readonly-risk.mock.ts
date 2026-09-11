import type { ReadonlyRiskModule, ReadonlyRiskRecord } from "../types"

const midLoanRecords: ReadonlyRiskRecord[] = [
  {
    id: "mid-001",
    title: "PO202608-100 · 华东钢材贸易",
    subtitle: "抵押 · 钢材-螺纹钢-HRB400-1200吨",
    status: "可执行",
    statusTone: "success",
    summary: [
      { label: "风控模型", value: "智风控-贷中资信模型V3" },
      { label: "最近状态", value: "未执行", tone: "neutral" },
      { label: "执行次数", value: "0 次" },
    ],
    sections: [
      {
        title: "订单与执行资格",
        fields: [
          { label: "订单号", value: "PO202608-100" },
          { label: "货主", value: "华东钢材贸易（91310000MA1FL2XXXX）" },
          { label: "押品", value: "钢材-螺纹钢-HRB400-1200吨" },
          { label: "订单创建时间", value: "2026-07-01 10:00:00" },
          { label: "是否可执行", value: "可执行", tone: "success" },
          { label: "执行资格说明", value: "订单存续、规则启用且暂无执行中的任务" },
        ],
      },
      {
        title: "执行历史",
        fields: [{ label: "历史记录", value: "暂无执行历史" }],
      },
    ],
    searchText: "mid-001 PO202608-100 华东钢材贸易 钢材 螺纹钢 可执行 未执行",
  },
  {
    id: "mid-003",
    title: "PO202608-102 · 北方化工仓储",
    subtitle: "抵押 · 化工-聚乙烯-800吨",
    status: "不可执行",
    statusTone: "warning",
    summary: [
      { label: "风控模型", value: "智风控-供应链风险模型V2" },
      { label: "最近状态", value: "提交成功（处理中）", tone: "info" },
      { label: "执行次数", value: "1 次" },
    ],
    sections: [
      {
        title: "订单与执行资格",
        fields: [
          { label: "订单号", value: "PO202608-102" },
          { label: "货主", value: "北方化工仓储（91330000MA1HK4ZZZZ）" },
          { label: "押品", value: "化工-聚乙烯-800吨" },
          { label: "是否可执行", value: "不可执行", tone: "warning" },
          { label: "不可执行原因", value: "当前已有正在处理中的申请" },
        ],
      },
      {
        title: "执行历史",
        fields: [
          { label: "提交时间", value: "2026-08-15 09:30:00" },
          { label: "提交人", value: "张风控（森云科技）" },
          { label: "状态", value: "提交成功（处理中）", tone: "info" },
          { label: "智风控任务号", value: "ZFK-20260815001" },
          { label: "补充资料", value: "待补充，可联登任务中心", tone: "warning" },
        ],
      },
    ],
    searchText: "mid-003 PO202608-102 北方化工仓储 聚乙烯 不可执行 提交成功 处理中",
  },
  {
    id: "mid-005",
    title: "PO202608-104 · 张明",
    subtitle: "质押 · 仓单 WH202608001",
    status: "触发预警",
    statusTone: "danger",
    summary: [
      { label: "风控模型", value: "智风控-司法舆情模型V1" },
      { label: "最近状态", value: "触发预警", tone: "danger" },
      { label: "预警次数", value: "1 次" },
    ],
    sections: [
      {
        title: "订单与执行资格",
        fields: [
          { label: "订单号", value: "PO202608-104" },
          { label: "货主", value: "张明（310***********1234）" },
          { label: "押品", value: "仓单 WH202608001" },
          { label: "是否可执行", value: "可执行", tone: "success" },
          { label: "执行次数 / 预警次数", value: "1 次 / 1 次" },
        ],
      },
      {
        title: "执行历史",
        fields: [
          { label: "提交时间", value: "2026-08-12 14:00:00" },
          { label: "模型分数", value: "42 分", tone: "danger" },
          { label: "结果", value: "模型评分低于阈值，已联动生成押品预警" },
          { label: "智风控任务号", value: "ZFK-20260812005" },
        ],
      },
    ],
    searchText: "mid-005 PO202608-104 张明 仓单 触发预警 42",
  },
]

const riskDisclosureRecords: ReadonlyRiskRecord[] = [
  {
    id: "pub-seed-001",
    title: "铜精矿货值下跌风险公示",
    subtitle: "PO202607-12 · 华东钢材贸易",
    status: "已公示",
    statusTone: "success",
    summary: [
      { label: "预警类型", value: "价格下跌" },
      { label: "预警时间", value: "2026-07-29 16:30" },
      { label: "处理人", value: "王风控（森云科技）" },
    ],
    sections: [
      {
        title: "公示快照",
        fields: [
          { label: "订单号", value: "PO202607-12" },
          { label: "货主", value: "华东钢材贸易" },
          { label: "风险内容", value: "货值下跌超12%，铜精矿较基准价 -12.8%" },
          { label: "公示状态", value: "已公示", tone: "success" },
          { label: "首次公示时间", value: "2026-07-31 14:20:00" },
        ],
      },
      {
        title: "审计时间轴",
        fields: [
          { label: "首次公示", value: "合规专员（森云科技） · 2026-07-31 14:20:00" },
          { label: "原预警处置", value: "王风控（森云科技） · 2026-07-30 09:15:00" },
          { label: "快照边界", value: "公示副本独立保存，原预警后续变更不回写" },
        ],
      },
    ],
    searchText: "pub-seed-001 铜精矿货值下跌风险公示 PO202607-12 华东钢材贸易 价格下跌 已公示",
  },
  {
    id: "pub-seed-002",
    title: "巡检超时风险公示",
    subtitle: "PO202607-08 · 鑫源粮油集团",
    status: "已公示",
    statusTone: "success",
    summary: [
      { label: "预警类型", value: "巡检异常" },
      { label: "预警时间", value: "2026-07-28 08:00" },
      { label: "处理人", value: "李监管（华东仓储）" },
    ],
    sections: [
      {
        title: "公示快照",
        fields: [
          { label: "订单号", value: "PO202607-08" },
          { label: "货主", value: "鑫源粮油集团" },
          { label: "风险内容", value: "计划巡检超时 48h，责任人未到场" },
          { label: "公示状态", value: "已公示", tone: "success" },
          { label: "首次公示时间", value: "2026-07-30 10:00:00" },
        ],
      },
      {
        title: "审计时间轴",
        fields: [
          { label: "首次公示", value: "合规专员（森云科技） · 2026-07-30 10:00:00" },
          { label: "原预警处置", value: "李监管（华东仓储） · 2026-07-29 11:30:00" },
        ],
      },
    ],
    searchText: "pub-seed-002 巡检超时风险公示 PO202607-08 鑫源粮油集团 巡检异常 已公示",
  },
  {
    id: "pub-seed-004",
    title: "贷中风控拒绝风险公示",
    subtitle: "PO202608-105 · 张明",
    status: "已公示",
    statusTone: "success",
    summary: [
      { label: "预警类型", value: "贷中风控预警" },
      { label: "预警时间", value: "2026-08-12 10:30" },
      { label: "处理人", value: "系统自动处理" },
    ],
    sections: [
      {
        title: "公示快照",
        fields: [
          { label: "订单号", value: "PO202608-105" },
          { label: "货主", value: "张明" },
          { label: "风险内容", value: "智风控模型评分 42，触发贷中拒绝阈值" },
          { label: "公示状态", value: "已公示", tone: "success" },
          { label: "首次公示时间", value: "2026-08-14 09:00:00" },
        ],
      },
      {
        title: "审计时间轴",
        fields: [
          { label: "首次公示", value: "合规专员（森云科技） · 2026-08-14 09:00:00" },
          { label: "原预警处置", value: "系统自动处理 · 2026-08-13 08:20:00" },
        ],
      },
    ],
    searchText: "pub-seed-004 贷中风控拒绝风险公示 PO202608-105 张明 贷中风控预警 已公示",
  },
]

export const READONLY_RISK_RECORDS: Record<ReadonlyRiskModule, ReadonlyRiskRecord[]> = {
  "mid-loan": midLoanRecords,
  "risk-disclosure": riskDisclosureRecords,
}

export function getReadonlyRiskRecord(
  module: ReadonlyRiskModule,
  id?: string
): ReadonlyRiskRecord | undefined {
  return READONLY_RISK_RECORDS[module].find((record) => record.id === id)
}
