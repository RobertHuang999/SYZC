import type { NavigateFunction } from "react-router-dom"
import { MOBILE_MENU_ITEMS } from "@/data/mobileMenuData"

export function openMenuModule(navigate: NavigateFunction, nameOrId: string) {
  const item = MOBILE_MENU_ITEMS.find(
    (entry) => entry.id === nameOrId || entry.name === nameOrId || entry.subTab === nameOrId,
  )

  if (item?.customRoute) {
    navigate(item.customRoute)
    return
  }

  if (item) {
    navigate(`/m/module/${item.id}`)
    return
  }

  navigate(`/m/module/${nameOrId}`)
}
