import { HistoryIcon } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { ITERATION_RECORD_LABEL, ITERATION_RECORD_PATH } from "@/config/navigation"
import { cn } from "@/lib/utils"

export function IterationRecordButton() {
  const { pathname } = useLocation()
  const active =
    pathname === ITERATION_RECORD_PATH || pathname.startsWith(`${ITERATION_RECORD_PATH}/`)

  return (
    <NavLink
      to={ITERATION_RECORD_PATH}
      className={cn("iteration-changelog-button", active && "is-active")}
      title="查看各版本菜单与导航调整记录"
    >
      <HistoryIcon size={14} strokeWidth={1.8} />
      <span>{ITERATION_RECORD_LABEL}</span>
    </NavLink>
  )
}
