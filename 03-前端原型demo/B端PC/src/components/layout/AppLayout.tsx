import { Header } from "@/components/layout/Header"
import { PageTabs } from "@/components/layout/PageTabs"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { getActiveTopModule, shouldShowSidebar } from "@/config/navigation"
import { cn } from "@/lib/utils"
import { Outlet, useLocation } from "react-router-dom"

export function AppLayout() {
  const { pathname } = useLocation()
  const activeModule = getActiveTopModule(pathname)
  const showSidebar = shouldShowSidebar(pathname)

  return (
    <div className="app-shell">
      <Header activeModule={activeModule} />
      <div className="app-body">
        {showSidebar && <SidebarNav activeModule={activeModule} />}
        <main className={cn("main-area", !showSidebar && "main-area-full")}>
          <div className="content-column">
            <PageTabs />
            <div className="page-surface">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
