export type WarehouseStatus = "ENABLED" | "DISABLED"
export type ZhongdengAccess = "YES" | "NO"
export type ManagerType = "ENTERPRISE" | "INDIVIDUAL"
export type OwnershipRelation = "OWNED" | "LEASED" | "OTHER"

export interface PartitionNode {
  id: string
  name: string
  status: WarehouseStatus
  remark: string
  storeroomId: string
  storeroomName: string
}

export interface StoreroomNode {
  id: string
  name: string
  status: WarehouseStatus
  remark: string
  partitions: Omit<PartitionNode, "storeroomId" | "storeroomName">[]
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
  address: string
  area: number
  warehouseTypes: string[]
  managerPhone: string
  managerIdNumber: string
  ownership?: OwnershipRelation
  otherTypeName?: string
  zhongdengId?: string
  supervisorType?: "按人" | "按角色"
  supervisors?: string[]
  regionalManagerType?: "按人" | "按角色"
  regionalManagers?: string[]
  storerooms: StoreroomNode[]
  facilities: FacilityRow[]
  hasInventory: boolean
}
