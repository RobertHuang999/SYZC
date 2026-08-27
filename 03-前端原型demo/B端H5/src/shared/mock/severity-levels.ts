export type SeverityLevel = {
  severityLevelId: string
  sortOrder: number
  severityCode: string
  severityName: string
  severityColor: string
  syncToOrderWarning: boolean
  enabled: boolean
  description: string | null
  updatedBy: string
  updatedAt: string
}

export const SEVERITY_LEVELS: SeverityLevel[] = [
  {
    severityLevelId: "sl-l1",
    sortOrder: 1,
    severityCode: "L1",
    severityName: "常规提示",
    severityColor: "#409EFF",
    syncToOrderWarning: false,
    enabled: true,
    description: null,
    updatedBy: "系统",
    updatedAt: "2026-08-20 10:00:00",
  },
  {
    severityLevelId: "sl-l2",
    sortOrder: 2,
    severityCode: "L2",
    severityName: "事务记录",
    severityColor: "#79BBFF",
    syncToOrderWarning: false,
    enabled: true,
    description: null,
    updatedBy: "系统",
    updatedAt: "2026-08-20 10:00:00",
  },
  {
    severityLevelId: "sl-l3",
    sortOrder: 3,
    severityCode: "L3",
    severityName: "关注",
    severityColor: "#E6A23C",
    syncToOrderWarning: false,
    enabled: true,
    description: null,
    updatedBy: "系统",
    updatedAt: "2026-08-20 10:00:00",
  },
  {
    severityLevelId: "sl-l4",
    sortOrder: 4,
    severityCode: "L4",
    severityName: "严重风险",
    severityColor: "#F56C6C",
    syncToOrderWarning: true,
    enabled: true,
    description: "高风险档",
    updatedBy: "风控管理员",
    updatedAt: "2026-08-19 14:30:00",
  },
  {
    severityLevelId: "sl-l5",
    sortOrder: 5,
    severityCode: "L5",
    severityName: "紧急危险",
    severityColor: "#C03639",
    syncToOrderWarning: true,
    enabled: true,
    description: "紧急级物理破坏、重大商业风险建议绑定此档",
    updatedBy: "风控管理员",
    updatedAt: "2026-08-18 09:15:00",
  },
]

export const ENABLED_SEVERITY_LEVELS = SEVERITY_LEVELS
  .filter((level) => level.enabled)
  .sort((a, b) => a.sortOrder - b.sortOrder)

export function getSeverityLevelByCode(code: string): SeverityLevel | undefined {
  return ENABLED_SEVERITY_LEVELS.find((level) => level.severityCode === code)
}
