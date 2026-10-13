import type { WarehouseFilters } from "./types"

export const PAGE_SIZE = 10

/** PC 列表 P-CFG-WH-010 */
export const WAREHOUSE_LIST_PATH = "/配置管理/仓库管理/仓库管理"

/** PC 新增全页（由列表页「添加仓库」按钮触发跳转的独立全页表单，非侧边栏菜单项） */
export const WAREHOUSE_ADD_PATH = "/配置管理/仓库管理/添加仓库"

/** PC 编辑全页 */
export function warehouseEditPath(id: string) {
  return `/配置管理/仓库管理/仓库/${id}`
}

export const WAREHOUSE_QUOTA = {
  used: 99999972,
  max: 99999999,
}

export const DEFAULT_WAREHOUSE_FILTERS: WarehouseFilters = {
  nameKeyword: "",
  zhongdeng: "全部",
}

export const BASIC_CONFIG_PATH = "/配置管理/平台管理/基础配置"
