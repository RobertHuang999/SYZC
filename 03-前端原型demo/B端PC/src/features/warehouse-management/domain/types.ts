export type WarehouseStatus = "ENABLED" | "DISABLED"

export type ZhongdengAccess = "YES" | "NO"

export type ManagerType = "ENTERPRISE" | "INDIVIDUAL"

export type OwnershipRelation = "OWNED" | "LEASED" | "OTHER"

export interface PartitionNode {
  id: string
  name: string
  status: WarehouseStatus
  remark: string
  hasInventory: boolean
  hasInboundRecords: boolean
}

export interface StoreroomNode {
  id: string
  name: string
  status: WarehouseStatus
  remark: string
  partitions: PartitionNode[]
  hasInventory: boolean
  hasInboundRecords: boolean
}

export interface FacilityRow {
  id: string
  name: string
  quantity: number
  unit: string
  validUntil: string
}

export interface WarehouseRecord {
  id: string
  name: string
  status: WarehouseStatus
  managerName: string
  managerType: ManagerType
  zhongdengAccess: ZhongdengAccess
  createdBy: string
  createdAt: string
  updatedAt: string
  version: number
  address: string
  area: number
  warehouseTypes: string[]
  otherTypeName?: string
  managerPhone: string
  managerIdNumber: string
  ownership: OwnershipRelation
  zhongdengId?: string
  storerooms: StoreroomNode[]
  facilities: FacilityRow[]
  hasInventory: boolean
  supervisorType?: string
  supervisors?: string[]
  regionalManagerType?: string
  regionalManagers?: string[]
  layoutPlanFileName?: string
  regFormFileName?: string
  photoFileNames?: string[]
}

export interface WarehouseFilters {
  nameKeyword: string
  zhongdeng: "全部" | "是" | "否"
}
