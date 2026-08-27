import { Navigate, Route, Routes } from "react-router-dom"
import { CollateralWarningDetailPage } from "@/features/collateral-warning-events/pages/CollateralWarningDetailPage"
import { CollateralWarningListPage } from "@/features/collateral-warning-events/pages/CollateralWarningListPage"
import { DeviceWarningEventDetailPage } from "@/features/device-warning-events/pages/DeviceWarningEventDetailPage"
import { DeviceWarningEventListPage } from "@/features/device-warning-events/pages/DeviceWarningEventListPage"
import { DeviceWarningEventReleasePage } from "@/features/device-warning-events/pages/DeviceWarningEventReleasePage"
import { GenericModulePage } from "@/pages/GenericModulePage"
import { HomePage } from "@/pages/HomePage"
import { PledgeOrderPlaceholderPage } from "@/pages/PledgeOrderPlaceholderPage"
import { ProfilePage } from "@/pages/ProfilePage"
import { TasksManagementPage } from "@/pages/TasksManagementPage"
import { WorkspacePage } from "@/pages/WorkspacePage"

export function AppRoutes() {
  return (
    <Routes>
      {/* 1. 首页 */}
      <Route path="/" element={<HomePage />} />
      <Route path="/m/home" element={<HomePage />} />

      {/* 2. 工作台 */}
      <Route path="/m/workspace" element={<WorkspacePage />} />

      {/* 3. 业务办理 */}
      <Route path="/m/tasks" element={<TasksManagementPage />} />

      {/* 4. 机构与权限 */}
      <Route path="/m/profile" element={<ProfilePage />} />

      {/* 5. 通用二级模块/Tab 原型落地承接 */}
      <Route path="/m/module/:moduleId" element={<GenericModulePage />} />

      {/* 6. 高保真风控预警专属流转页 */}
      <Route
        path="/m/supervision/order-warnings"
        element={<CollateralWarningListPage />}
      />
      <Route
        path="/m/supervision/order-warnings/:id"
        element={<CollateralWarningDetailPage />}
      />

      <Route
        path="/m/iot/device-warning-events"
        element={<DeviceWarningEventListPage />}
      />
      <Route
        path="/m/iot/device-warning-events/:id"
        element={<DeviceWarningEventDetailPage />}
      />
      <Route
        path="/m/iot/device-warning-events/:id/release"
        element={<DeviceWarningEventReleasePage />}
      />

      <Route
        path="/m/finance/pledge-orders"
        element={<PledgeOrderPlaceholderPage />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
