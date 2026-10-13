/**
 * 移动端菜单口径（权限清单）：
 * - 工作台 → 配置管理 → **仓库管理**：列表 / 详情 / 编辑
 * - 工作台 → 配置管理 → **新增仓库**：独立添加入口（不在「仓库管理」路由树下）
 */
/** 工作台首页（配置管理宫格入口） */
export const WORKSPACE_ROUTE = "/m/workspace"

/** 配置管理 → 仓库管理：列表 / 查看详情 / 编辑（权限不含「新增仓库」） */
export const WAREHOUSE_LIST_ROUTE = "/m/workspace/config/warehouse-management"

/** 配置管理 → 新增仓库：独立菜单，与 PC「添加仓库」全页同级 */
export const WAREHOUSE_NEW_ROUTE = "/m/workspace/config/new-warehouse"

/** @deprecated 旧路径，路由层已重定向 */
export const WAREHOUSE_LIST_ROUTE_LEGACY = "/m/config/warehouses"

export const WAREHOUSE_NEW_ROUTE_LEGACY = "/m/config/warehouses/new"

export const WAREHOUSE_QUOTA = {
  used: 99999972,
  max: 99999999,
}

export type WarehouseDetailTab =
  | "basic"
  | "storeroom"
  | "partition"
  | "facility"

export const DETAIL_TABS: { key: WarehouseDetailTab; label: string }[] = [
  { key: "basic", label: "基础信息" },
  { key: "storeroom", label: "库房" },
  { key: "partition", label: "分区" },
  { key: "facility", label: "设备设施" },
]

export function warehouseDetailPath(id: string) {
  return `${WAREHOUSE_LIST_ROUTE}/${id}`
}

export function warehouseEditPath(id: string) {
  return `${WAREHOUSE_LIST_ROUTE}/${id}/edit`
}
