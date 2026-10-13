const implementedRoutePrefixes = [
  "/物联网IOT与预警/预警信息/",
  "/物联网IOT与预警/预警配置/",
  "/物联网IOT与预警/物联网IOT管理/",
  "/配置管理/业务流程管理/开锁审批",
  "/用户中心/合作方管理/合作方档案",
  "/配置管理/平台管理/基础配置",
  "/配置管理/仓库管理/仓库管理",
  "/配置管理/仓库管理/添加仓库",
  "/配置管理/仓库管理/仓库",
  "/工作中心/审批中心",
  "/历史迁移与割接/",
  "/系统参考/",
] as const

const implementedExactRoutes = new Set<string>([
  "/物联网IOT与预警/物联网IOT管理/门禁设备",
  "/系统参考/功能与数据权限",
  "/用户中心/合作方管理/合作方档案",
  "/仓储/入库管理/入库申请",
  "/仓储/入库管理/入库申请/新增",
  "/仓储/入库管理/入库记录",
  "/仓储/入库管理/入库记录/新增",
  "/仓储/出库管理/出库记录",
  "/仓储/出库管理/出库记录/新增",
])

const implementedDetailPrefixes = [
  "/仓储/入库管理/入库记录/详情/",
  "/仓储/入库管理/入库申请/详情/",
  "/仓储/出库管理/出库记录/详情/",
]

const unimplementedRoutePrefixes = [
  "/物联网IOT与预警/预警信息/贷中风控管理",
] as const

export function isImplementedRoute(pathname: string): boolean {
  const currentPath = decodeURIComponent(pathname).replace(/\/$/, "") || "/"

  if (
    unimplementedRoutePrefixes.some(
      (prefix) => currentPath === prefix || currentPath.startsWith(`${prefix}/`),
    )
  ) {
    return false
  }

  if (implementedExactRoutes.has(currentPath)) {
    return true
  }

  if (implementedDetailPrefixes.some((prefix) => currentPath.startsWith(prefix))) {
    return true
  }

  return implementedRoutePrefixes.some(
    (prefix) => currentPath === prefix.replace(/\/$/, "") || currentPath.startsWith(prefix),
  )
}
