export type IterationPlatform = "PC" | "移动" | "双端"

export type IterationChangeType = "新增" | "更名" | "迁移" | "取消" | "结构"

export type IterationRecordEntry = {
  id: string
  version: string
  platform: IterationPlatform
  type: IterationChangeType
  date?: string
  title: string
  before?: string
  after?: string
  note?: string
  sourceDoc?: string
}

export type IterationVersionMeta = {
  version: string
  name: string
  summary: string
  docPath?: string
}

export type PermissionRecordStatus = "current" | "planned" | "cancelled" | "target-feature"

export type PermissionRecord = {
  id: string
  platform: "PC" | "移动"
  module: string
  pagePath: string
  pagePathSegments: string[]
  legacyPath?: string
  actionPermissions: string
  dataPermission: string
  createdAt: string
  updatedAt: string
  changeNote: string
  recordStatus?: PermissionRecordStatus
}

export type PrototypeRouteResolver = (params: {
  module: string
  pagePathSegments: string[]
  level1Menu: string
  level2Menu: string
  tab: string
}) => string | null | undefined
