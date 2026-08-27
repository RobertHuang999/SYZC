import { cn } from "@/lib/utils"
import { topModules, type TopModule } from "@/config/navigation"
import { NavLink } from "react-router-dom"

type TopModuleNavProps = {
  activeModule: TopModule
}

export function TopModuleNav({ activeModule }: TopModuleNavProps) {
  return (
    <nav className="top-module-nav" aria-label="业务板块">
      {topModules.map((module) => {
        const targetPath =
          module.id === "device-warning" ? "/预警信息/设备预警信息" : module.path

        return (
          <NavLink
            key={module.id}
            to={targetPath}
            className={({ isActive }) =>
              cn(
                "top-module-link",
                isActive || activeModule.id === module.id
                  ? "is-active"
                  : ""
              )
            }
          >
            {module.label}
          </NavLink>
        )
      })}
    </nav>
  )
}
