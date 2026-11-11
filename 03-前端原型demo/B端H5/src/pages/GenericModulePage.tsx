import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { MOBILE_MENU_ITEMS } from "@/data/mobileMenuData"
import { PrototypeEmptyPage } from "@/pages/PrototypeEmptyPage"

const backToByModule: Record<string, string> = {
  首页: "/m/home",
  工作台: "/m/workspace",
  业务办理: "/m/tasks",
}

export function GenericModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const navigate = useNavigate()
  const menuItem = MOBILE_MENU_ITEMS.find((item) => item.id === moduleId)

  useEffect(() => {
    const target = menuItem?.customRoute
    const selfModulePath = moduleId ? `/m/module/${moduleId}` : ""
    if (target && target !== selfModulePath) {
      navigate(target, { replace: true })
    }
  }, [menuItem, moduleId, navigate])

  if (!menuItem) {
    const fallbackTitle = decodeURIComponent(moduleId ?? "未知功能").replace(/-/g, " ")
    return (
      <PrototypeEmptyPage
        title={fallbackTitle}
        backTo="/m/workspace"
        description="该入口已纳入移动端菜单导航，高保真交互页面将在后续版本迭代中补充。"
      />
    )
  }

  const selfModulePath = moduleId ? `/m/module/${moduleId}` : ""
  if (menuItem.customRoute && menuItem.customRoute !== selfModulePath) {
    return null
  }

  if (menuItem.enabled === false) {
    return (
      <PrototypeEmptyPage
        title={menuItem.name}
        menuItem={menuItem}
        backTo={backToByModule[menuItem.primaryModule] ?? "/m/workspace"}
        description="该业务当前已关闭，不提供新建、编辑、解除或其他写操作；历史数据仅允许按权限只读查询、审计和资料查看。"
      />
    )
  }

  return (
    <PrototypeEmptyPage
      title={menuItem.name}
      menuItem={menuItem}
      backTo={backToByModule[menuItem.primaryModule] ?? "/m/workspace"}
    />
  )
}
