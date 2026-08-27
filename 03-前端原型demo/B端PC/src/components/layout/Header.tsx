import { ChevronDown, Package } from "lucide-react"
import { TopModuleNav } from "@/components/layout/TopModuleNav"
import type { TopModule } from "@/config/navigation"

export function Header({ activeModule }: { activeModule: TopModule }) {
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
        <button className="profile-button" type="button" aria-label="个人菜单">
          <span className="profile-avatar">管</span>
          <span>管理员</span>
          <ChevronDown size={13} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  )
}
