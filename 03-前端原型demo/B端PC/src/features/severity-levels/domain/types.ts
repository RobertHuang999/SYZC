export type EnabledFilter = "全部" | "是" | "否"

export type SeverityLevelRecord = {
  levelId: string
  sortOrder: number
  severityCode: string
  displayName: string
  labelColor: string
  syncToOrderWarning: boolean
  enabled: boolean
  description: string | null
  updatedBy: string
  updatedAt: string
}

export type SeverityLevelFilters = {
  enabled: EnabledFilter
}
