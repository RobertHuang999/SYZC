import { NavLink } from "react-router-dom"
import {
  ITERATION_RECORD_LABEL,
  ITERATION_RECORD_PATH,
  PERMISSION_REFERENCE_PATH,
} from "@/config/navigation"
import { cn } from "@/lib/utils"

type TabId = "permission" | "iteration"

const tabs: { id: TabId; label: string; to: string }[] = [
  { id: "permission", label: "功能与数据权限", to: PERMISSION_REFERENCE_PATH },
  { id: "iteration", label: ITERATION_RECORD_LABEL, to: ITERATION_RECORD_PATH },
]

export function SystemReferenceSubNav({ active }: { active: TabId }) {
  return (
    <div className="inline-flex shrink-0 items-center gap-0.5 rounded-md border bg-muted/20 p-0.5">
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.to}
          className={cn(
            "rounded px-2.5 py-0.5 text-[11px] font-medium transition",
            active === tab.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  )
}
