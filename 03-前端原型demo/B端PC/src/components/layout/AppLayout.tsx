import { Header } from "@/components/layout/Header"
import { PageTabs } from "@/components/layout/PageTabs"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { getActiveTopModule } from "@/config/navigation"
import { Outlet, useLocation } from "react-router-dom"

export function AppLayout() {
  const { pathname } = useLocation()
  const activeModule = getActiveTopModule(pathname)

  return (
    <div className="app-shell">
      <Header activeModule={activeModule} />
      <div className="app-body">
        <SidebarNav activeModule={activeModule} />
        <main className="main-area">
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
