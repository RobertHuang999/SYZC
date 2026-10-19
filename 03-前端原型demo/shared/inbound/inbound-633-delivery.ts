/**
 * 6.3.3 原型交付：入库暂存登记整模块本期不放开（菜单 / 路由 / 通道 / 转正 / 深链预填）。
 * 代码与 09 三件套保留；后续启用时将本开关改为 true 即可。
 */
export const INBOUND_STAGING_PROTOTYPE_RELEASED = false

/** @deprecated 使用 INBOUND_STAGING_PROTOTYPE_RELEASED */
export const INBOUND_STAGING_MENU_ENABLED = INBOUND_STAGING_PROTOTYPE_RELEASED

/** @deprecated 使用 INBOUND_STAGING_PROTOTYPE_RELEASED */
export const INBOUND_FORMAL_STAGING_CHANNEL_ENABLED = INBOUND_STAGING_PROTOTYPE_RELEASED

/** @deprecated 使用 INBOUND_STAGING_PROTOTYPE_RELEASED */
export const INBOUND_STAGING_CONVERT_ENABLED = INBOUND_STAGING_PROTOTYPE_RELEASED

/** PC 侧栏菜单路径（入库管理下） */
export const INBOUND_STAGING_PC_MENU_PATH = "/仓储/入库管理/入库暂存登记"

/** H5 `mobileMenuData` 中暂存登记磁贴 id */
export const INBOUND_STAGING_H5_MENU_IDS = [
  "ws-inbound-reg",
  "biz-init-inbound-reg",
] as const

/** PC 暂存路由前缀（用于 implemented-routes 裁切） */
export const INBOUND_STAGING_PC_ROUTE_PREFIX = INBOUND_STAGING_PC_MENU_PATH
