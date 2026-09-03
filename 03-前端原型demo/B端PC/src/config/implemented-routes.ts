const implementedRoutePrefixes = [
  "/物联网IOT与预警/预警信息/",
  "/物联网IOT与预警/预警配置/",
  "/物联网IOT与预警/物联网IOT管理/",
  "/配置管理/业务流程管理/开锁审批",
  "/工作中心/审批中心",
  "/历史迁移与割接/",
  "/系统参考/",
] as const

const implementedExactRoutes = new Set<string>([
  "/物联网IOT与预警/物联网IOT管理/门禁设备",
  "/系统参考/功能与数据权限",
])

export function isImplementedRoute(pathname: string): boolean {
  const currentPath = decodeURIComponent(pathname).replace(/\/$/, "") || "/"

  if (implementedExactRoutes.has(currentPath)) {
    return true
  }

  return implementedRoutePrefixes.some(
    (prefix) => currentPath === prefix.replace(/\/$/, "") || currentPath.startsWith(prefix),
  )
}
