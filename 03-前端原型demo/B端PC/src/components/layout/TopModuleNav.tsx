import { cn } from "@/lib/utils"
import { topModules, type TopModule } from "@/config/navigation"
import { NavLink } from "react-router-dom"

type TopModuleNavProps = {
  activeModule: TopModule
}

export function TopModuleNav({ activeModule }: TopModuleNavProps) {
  return (
    <nav className="top-module-nav" aria-label="业务板块">
      {topModules.map((module) => (
        <NavLink
          key={module.id}
          to={module.path}
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
      ))}
    </nav>
  )
}
