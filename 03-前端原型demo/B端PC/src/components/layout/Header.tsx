import { ChevronDown, KeyRound, Package } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { TopModuleNav } from "@/components/layout/TopModuleNav"
import { IterationRecordButton } from "@/features/permission-reference/components/IterationRecordButton"
import { isSystemReferencePath, PERMISSION_REFERENCE_PATH, type TopModule } from "@/config/navigation"
import { cn } from "@/lib/utils"

export function Header({ activeModule }: { activeModule: TopModule }) {
  const { pathname } = useLocation()
  const onPermissionPage = isSystemReferencePath(pathname)

  return (
    <header className="header-bar">
      <div className="header-left">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <Package size={20} strokeWidth={1.8} />
          </div>
          <div className="brand-copy">
            <div className="brand-title">SYZC</div>
          </div>
        </div>
        <TopModuleNav activeModule={activeModule} />
      </div>

      <div className="header-actions">
        <IterationRecordButton />

        <NavLink
          to={PERMISSION_REFERENCE_PATH}
          className={cn("permission-reference-button", onPermissionPage && "is-active")}
          title="查看全系统功能与数据权限说明"
        >
          <KeyRound size={14} strokeWidth={1.8} />
          <span>功能与数据权限</span>
        </NavLink>

        <button className="profile-button" type="button" aria-label="个人菜单">
          <span className="profile-avatar">管</span>
          <span>管理员</span>
          <ChevronDown size={13} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  )
}
