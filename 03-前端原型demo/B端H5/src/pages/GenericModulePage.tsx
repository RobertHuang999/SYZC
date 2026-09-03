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
    if (menuItem?.customRoute) {
      navigate(menuItem.customRoute, { replace: true })
    }
  }, [menuItem, navigate])

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

  if (menuItem.customRoute) {
    return null
  }

  return (
    <PrototypeEmptyPage
      title={menuItem.name}
      menuItem={menuItem}
      backTo={backToByModule[menuItem.primaryModule] ?? "/m/workspace"}
    />
  )
}
