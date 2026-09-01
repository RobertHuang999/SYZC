import { AppLayout } from "@/components/layout/AppLayout"
import { PlaceholderPage } from "@/pages/PlaceholderPage"
import { DeviceWarningEventListPage } from "@/features/device-warning-events/pages/DeviceWarningEventListPage"
import { DeviceWarningEventDetailPage } from "@/features/device-warning-events/pages/DeviceWarningEventDetailPage"
import { DeviceWarningEventReleasePage } from "@/features/device-warning-events/pages/DeviceWarningEventReleasePage"
import { CollateralWarningListPage } from "@/features/collateral-warning-events/pages/CollateralWarningListPage"
import { CollateralWarningDetailPage } from "@/features/collateral-warning-events/pages/CollateralWarningDetailPage"
import { MidLoanRiskListPage } from "@/features/mid-loan-risk-control/pages/MidLoanRiskListPage"
import { MidLoanRiskDetailPage } from "@/features/mid-loan-risk-control/pages/MidLoanRiskDetailPage"
import { RiskDisclosureListPage } from "@/features/risk-disclosure/pages/RiskDisclosureListPage"
import { RiskDisclosureDetailPage } from "@/features/risk-disclosure/pages/RiskDisclosureDetailPage"
import { SeverityLevelListPage } from "@/features/severity-levels/pages/SeverityLevelListPage"
import { SeverityLevelDetailPage } from "@/features/severity-levels/pages/SeverityLevelDetailPage"
import { SeverityLevelFormPage } from "@/features/severity-levels/pages/SeverityLevelFormPage"
import { DeviceWarningConfigListPage } from "@/features/device-warning-configs/pages/DeviceWarningConfigListPage"
import { DeviceWarningConfigDetailPage } from "@/features/device-warning-configs/pages/DeviceWarningConfigDetailPage"
import { DeviceWarningConfigFormPage } from "@/features/device-warning-configs/pages/DeviceWarningConfigFormPage"
import { OrderWarningConfigListPage } from "@/features/order-warning-configs/pages/OrderWarningConfigListPage"
import { OrderWarningConfigDetailPage } from "@/features/order-warning-configs/pages/OrderWarningConfigDetailPage"
import { OrderWarningConfigFormPage } from "@/features/order-warning-configs/pages/OrderWarningConfigFormPage"
import { UnlockApprovalConfigListPage } from "@/features/unlock-approval-configs/pages/UnlockApprovalConfigListPage"
import { UnlockApprovalConfigDetailPage } from "@/features/unlock-approval-configs/pages/UnlockApprovalConfigDetailPage"
import { UnlockApprovalConfigFormPage } from "@/features/unlock-approval-configs/pages/UnlockApprovalConfigFormPage"
import { ApprovalCenterPage } from "@/features/unlock-applies/pages/ApprovalCenterPage"
import { MyApplicationsPage } from "@/features/unlock-applies/pages/MyApplicationsPage"
import { MyUnlockApplyDetailPage } from "@/features/unlock-applies/pages/MyUnlockApplyDetailPage"
import { UnlockApplyListPage } from "@/features/unlock-applies/pages/UnlockApplyListPage"
import { UnlockApplyDetailPage } from "@/features/unlock-applies/pages/UnlockApplyDetailPage"
import { AccessControlDeviceListPage } from "@/features/access-control-devices/pages/AccessControlDeviceListPage"
import { MigrationSchemePage } from "@/features/migration-schemes/pages/MigrationSchemePage"
import { topModules } from "@/config/navigation"
import { Navigate, Route, Routes } from "react-router-dom"

const monitorDeviceRoutes = [
  "详情",
  "详情/:id",
  "新增",
  "编辑",
  "编辑/:id",
] as const

const configMenuPaths = [
  "/物联网IOT管理/监控设备",
  "/物联网IOT管理/物联设备",
  "/物联网IOT管理/GPS设备",
  "/物联网IOT管理/人脸配置",
]

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/预警信息/设备预警信息" replace />} />

        <Route
          path="预警信息/设备预警信息"
          element={<DeviceWarningEventListPage />}
        />
        <Route
          path="预警信息/设备预警信息/详情/:id"
          element={<DeviceWarningEventDetailPage />}
        />
        <Route
          path="预警信息/设备预警信息/解除/:id"
          element={<DeviceWarningEventReleasePage />}
        />

        <Route
          path="预警信息/押品预警信息"
          element={<CollateralWarningListPage />}
        />
        <Route
          path="预警信息/押品预警信息/详情/:id"
          element={<CollateralWarningDetailPage />}
        />

        <Route
          path="预警信息/贷中风控管理"
          element={<MidLoanRiskListPage />}
        />
        <Route
          path="预警信息/贷中风控管理/详情/:id"
          element={<MidLoanRiskDetailPage />}
        />

        <Route path="预警信息/风险公示" element={<RiskDisclosureListPage />} />
        <Route
          path="预警信息/风险公示/详情/:id"
          element={<RiskDisclosureDetailPage />}
        />

        <Route path="预警配置/预警等级" element={<SeverityLevelListPage />} />
        <Route
          path="预警配置/预警等级/新增"
          element={<SeverityLevelFormPage />}
        />
        <Route
          path="预警配置/预警等级/详情/:id"
          element={<SeverityLevelDetailPage />}
        />
        <Route
          path="预警配置/预警等级/编辑/:id"
          element={<SeverityLevelFormPage />}
        />

        <Route
          path="预警配置/设备预警配置"
          element={<DeviceWarningConfigListPage />}
        />
        <Route
          path="预警配置/设备预警配置/新增"
          element={<DeviceWarningConfigFormPage />}
        />
        <Route
          path="预警配置/设备预警配置/详情/:id"
          element={<DeviceWarningConfigDetailPage />}
        />
        <Route
          path="预警配置/设备预警配置/编辑/:id"
          element={<DeviceWarningConfigFormPage />}
        />

        <Route
          path="预警配置/订单预警配置"
          element={<OrderWarningConfigListPage />}
        />
        <Route
          path="预警配置/订单预警配置/新增"
          element={<OrderWarningConfigFormPage />}
        />
        <Route
          path="预警配置/订单预警配置/详情/:id"
          element={<OrderWarningConfigDetailPage />}
        />
        <Route
          path="预警配置/订单预警配置/编辑/:id"
          element={<OrderWarningConfigFormPage />}
        />

        <Route
          path="配置管理/业务流程管理/开锁审批"
          element={<UnlockApprovalConfigListPage />}
        />
        <Route
          path="配置管理/业务流程管理/开锁审批/新增"
          element={<UnlockApprovalConfigFormPage />}
        />
        <Route
          path="配置管理/业务流程管理/开锁审批/详情/:configNo"
          element={<UnlockApprovalConfigDetailPage />}
        />
        <Route
          path="配置管理/业务流程管理/开锁审批/编辑/:configNo"
          element={<UnlockApprovalConfigFormPage />}
        />

        <Route path="工作中心/审批中心" element={<ApprovalCenterPage />} />
        <Route
          path="工作中心/审批中心/我的申请管理"
          element={<MyApplicationsPage />}
        />
        <Route
          path="工作中心/审批中心/我的申请管理/unlock-applies/:applyNo"
          element={<MyUnlockApplyDetailPage />}
        />
        <Route
          path="工作中心/审批中心/其他审批/开锁审核"
          element={<UnlockApplyListPage />}
        />
        <Route
          path="工作中心/审批中心/其他审批/开锁审核/详情/:applyNo"
          element={<UnlockApplyDetailPage />}
        />

        <Route
          path="历史迁移与割接/历史迁移总索引"
          element={<MigrationSchemePage />}
        />
        <Route
          path="历史迁移与割接/三旧模块兼容总说明"
          element={<MigrationSchemePage />}
        />
        <Route
          path="历史迁移与割接/设备侧规则与流水迁移"
          element={<MigrationSchemePage />}
        />
        <Route
          path="历史迁移与割接/订单规则与押品流水迁移"
          element={<MigrationSchemePage />}
        />
        <Route
          path="历史迁移与割接/门禁与设备事务通知兼容映射"
          element={<MigrationSchemePage />}
        />
        <Route
          path="历史迁移与割接/跨域用例数据推演"
          element={<MigrationSchemePage />}
        />
        <Route
          path="历史迁移与割接/:id"
          element={<MigrationSchemePage />}
        />

        <Route
          path="物联网IOT管理/门禁设备"
          element={<AccessControlDeviceListPage />}
        />

        {topModules.map((module) => (
          <Route
            key={module.id}
            path={module.path.replace(/^\//, "")}
            element={<PlaceholderPage />}
          />
        ))}

        {configMenuPaths.map((menuPath) => (
          <Route
            key={menuPath}
            path={menuPath.replace(/^\//, "")}
            element={<PlaceholderPage />}
          />
        ))}

        {monitorDeviceRoutes.map((suffix) => (
          <Route
            key={`monitor-${suffix}`}
            path={`物联网IOT管理/监控设备/${suffix}`}
            element={<PlaceholderPage />}
          />
        ))}

        <Route path="*" element={<PlaceholderPage />} />
      </Route>
    </Routes>
  )
}
