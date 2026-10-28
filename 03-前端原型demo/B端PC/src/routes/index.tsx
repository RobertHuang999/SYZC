import { AppLayout } from "@/components/layout/AppLayout"
import { PrototypeEmptyPage } from "@/pages/PrototypeEmptyPage"
import { DeviceWarningEventListPage } from "@/features/device-warning-events/pages/DeviceWarningEventListPage"
import { DeviceWarningEventDetailPage } from "@/features/device-warning-events/pages/DeviceWarningEventDetailPage"
import { DeviceWarningEventReleasePage } from "@/features/device-warning-events/pages/DeviceWarningEventReleasePage"
import { CollateralWarningListPage } from "@/features/collateral-warning-events/pages/CollateralWarningListPage"
import { CollateralWarningArchivePage } from "@/features/collateral-warning-events/pages/CollateralWarningArchivePage"
import { CollateralWarningDetailPage } from "@/features/collateral-warning-events/pages/CollateralWarningDetailPage"
import { CollateralWarningDisclosureDetailPage } from "@/features/collateral-warning-events/pages/CollateralWarningDisclosureDetailPage"
import { CollateralWarningBatchPublishPage } from "@/features/collateral-warning-events/pages/CollateralWarningBatchPublishPage"
import { RiskDisclosureListPage } from "@/features/risk-disclosure/pages/RiskDisclosureListPage"
import { RiskDisclosureDetailPage } from "@/features/risk-disclosure/pages/RiskDisclosureDetailPage"
import { RiskDisclosurePublishPage } from "@/features/risk-disclosure/pages/RiskDisclosurePublishPage"
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
const MyApplicationsPage = lazy(() =>
  import("@/features/unlock-applies/pages/MyApplicationsPage").then((module) => ({
    default: module.MyApplicationsPage,
  })),
)
const MyUnlockApplyDetailPage = lazy(() =>
  import("@/features/unlock-applies/pages/MyUnlockApplyDetailPage").then((module) => ({
    default: module.MyUnlockApplyDetailPage,
  })),
)
import { UnlockApplyListPage } from "@/features/unlock-applies/pages/UnlockApplyListPage"
import { UnlockApplyDetailPage } from "@/features/unlock-applies/pages/UnlockApplyDetailPage"
import { AccessControlDeviceListPage } from "@/features/access-control-devices/pages/AccessControlDeviceListPage"
import { MigrationSchemePage } from "@/features/migration-schemes/pages/MigrationSchemePage"
import { PermissionReferencePage } from "@/features/permission-reference/pages/PermissionReferencePage"
import { IterationRecordPage } from "@/features/permission-reference/pages/IterationRecordPage"
import { PartnerArchiveListPage } from "@/features/partner-archives/pages/PartnerArchiveListPage"
import { PartnerArchiveDetailPage } from "@/features/partner-archives/pages/PartnerArchiveDetailPage"
import { PartnerArchiveFormPage } from "@/features/partner-archives/pages/PartnerArchiveFormPage"
import { PartnerArchiveLegacyRedirect } from "@/features/partner-archives/components/PartnerArchiveLegacyRedirect"
import { PartnerStockChangeMapPage } from "@/features/partner-synergy/pages/PartnerStockChangeMapPage"
import { PartnerStockSynergySpecPage } from "@/features/partner-synergy/pages/PartnerStockSynergySpecPage"
import { PARTNER_ARCHIVE_MENU_LABELS } from "@prototype/shared/partner-archives/partner-archive-routes"
import { PlatformBasicConfigPage } from "@/features/platform-basic-config/pages/PlatformBasicConfigPage"
import { WarehouseListPage } from "@/features/warehouse-management/pages/WarehouseListPage"
import { WarehouseDetailPage } from "@/features/warehouse-management/pages/WarehouseDetailPage"
import { WarehouseFormPage } from "@/features/warehouse-management/pages/WarehouseFormPage"
import { InboundApplyListPage } from "@/features/inbound-records/pages/InboundApplyListPage"
import { InboundRecordListPage } from "@/features/inbound-records/pages/InboundRecordListPage"
import { InboundRecordFormPage } from "@/features/inbound-records/pages/InboundRecordFormPage"
import { InboundRecordDetailPage } from "@/features/inbound-records/pages/InboundRecordDetailPage"
import { OutboundRecordListPage } from "@/features/outbound-records/pages/OutboundRecordListPage"
import { OutboundRecordFormPage } from "@/features/outbound-records/pages/OutboundRecordFormPage"
import { OutboundRecordDetailPage } from "@/features/outbound-records/pages/OutboundRecordDetailPage"
import { DeliveryOrderListPage } from "@/features/delivery-orders/pages/DeliveryOrderListPage"
import { WarehouseReceiptListPage } from "@/features/warehouse-receipts/pages/WarehouseReceiptListPage"
import { WarehouseReceiptDetailPage } from "@/features/warehouse-receipts/pages/WarehouseReceiptDetailPage"
import { SupervisionHandlingPartnerRefPage } from "@/features/supervision-handling/pages/SupervisionHandlingPartnerRefPage"
import { InboundStagingPrototypeGate } from "@/features/inbound-staging-reg/components/InboundStagingPrototypeGate"
import { InboundStagingListPage } from "@/features/inbound-staging-reg/pages/InboundStagingListPage"
import { InboundStagingFormPage } from "@/features/inbound-staging-reg/pages/InboundStagingFormPage"
import { InboundStagingDetailPage } from "@/features/inbound-staging-reg/pages/InboundStagingDetailPage"
import {
  MajorCategoryListPage,
  SubcategoryListPage,
  GoodsListPage,
  GoodsFormPage,
  GoodsDetailPage,
  InboundCollectListPage,
  InboundCollectDetailPage,
  InboundCollectFormPage,
} from "@/features/goods-specifications/pages"
import { getAllMenuPaths, topModules } from "@/config/navigation"
import { isImplementedRoute } from "@/config/implemented-routes"
import { lazy } from "react"
import { Navigate, Route, Routes } from "react-router-dom"

const monitorDeviceRoutes = [
  "详情",
  "详情/:id",
  "新增",
  "编辑",
  "编辑/:id",
] as const

const placeholderPaths = getAllMenuPaths().filter((menuPath) => !isImplementedRoute(menuPath))

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to={topModules[0].path} replace />} />

        <Route
          path="物联网IOT与预警/预警信息/设备预警信息"
          element={<DeviceWarningEventListPage />}
        />
        <Route
          path="物联网IOT与预警/预警信息/设备预警信息/详情/:id"
          element={<DeviceWarningEventDetailPage />}
        />
        <Route
          path="物联网IOT与预警/预警信息/设备预警信息/解除/:id"
          element={<DeviceWarningEventReleasePage />}
        />

        <Route
          path="物联网IOT与预警/预警信息/押品预警信息"
          element={<CollateralWarningListPage />}
        />
        <Route
          path="物联网IOT与预警/预警信息/历史押品预警"
          element={<CollateralWarningArchivePage />}
        />
        <Route
          path="物联网IOT与预警/预警信息/押品预警信息/详情/:id"
          element={<CollateralWarningDetailPage />}
        />
        <Route
          path="物联网IOT与预警/预警信息/押品预警信息/批量公示确认"
          element={<CollateralWarningBatchPublishPage />}
        />
        <Route
          path="物联网IOT与预警/预警信息/押品预警信息/公示确认/:warnId"
          element={<RiskDisclosurePublishPage />}
        />
        <Route
          path="物联网IOT与预警/预警信息/押品预警信息/公示详情/:warnId"
          element={<CollateralWarningDisclosureDetailPage />}
        />

        <Route path="物联网IOT与预警/预警信息/风险公示" element={<RiskDisclosureListPage />} />
        <Route
          path="物联网IOT与预警/预警信息/风险公示/确认/:warnId"
          element={<RiskDisclosurePublishPage />}
        />
        <Route
          path="物联网IOT与预警/预警信息/风险公示/详情/:id"
          element={<RiskDisclosureDetailPage />}
        />

        <Route path="物联网IOT与预警/预警配置/预警等级" element={<SeverityLevelListPage />} />
        <Route
          path="物联网IOT与预警/预警配置/预警等级/新增"
          element={<SeverityLevelFormPage />}
        />
        <Route
          path="物联网IOT与预警/预警配置/预警等级/详情/:id"
          element={<SeverityLevelDetailPage />}
        />
        <Route
          path="物联网IOT与预警/预警配置/预警等级/编辑/:id"
          element={<SeverityLevelFormPage />}
        />

        <Route
          path="物联网IOT与预警/预警配置/设备预警配置"
          element={<DeviceWarningConfigListPage />}
        />
        <Route
          path="物联网IOT与预警/预警配置/设备预警配置/新增"
          element={<DeviceWarningConfigFormPage />}
        />
        <Route
          path="物联网IOT与预警/预警配置/设备预警配置/详情/:id"
          element={<DeviceWarningConfigDetailPage />}
        />
        <Route
          path="物联网IOT与预警/预警配置/设备预警配置/编辑/:id"
          element={<DeviceWarningConfigFormPage />}
        />

        <Route
          path="物联网IOT与预警/预警配置/订单预警配置"
          element={<OrderWarningConfigListPage />}
        />
        <Route
          path="物联网IOT与预警/预警配置/订单预警配置/新增"
          element={<OrderWarningConfigFormPage />}
        />
        <Route
          path="物联网IOT与预警/预警配置/订单预警配置/详情/:id"
          element={<OrderWarningConfigDetailPage />}
        />
        <Route
          path="物联网IOT与预警/预警配置/订单预警配置/编辑/:id"
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
          path="历史迁移与割接/合作方主数据迁移"
          element={<MigrationSchemePage />}
        />
        <Route
          path="历史迁移与割接/:id"
          element={<MigrationSchemePage />}
        />

        <Route path="系统参考/功能与数据权限" element={<PermissionReferencePage />} />
        <Route
          path="功能与数据权限"
          element={<Navigate to="/系统参考/功能与数据权限" replace />}
        />
        <Route path="系统参考/迭代记录" element={<IterationRecordPage />} />
        <Route
          path="系统参考/菜单迭代记录"
          element={<Navigate to="/系统参考/迭代记录" replace />}
        />

        <Route
          path="物联网IOT与预警/物联网IOT管理/门禁设备"
          element={<AccessControlDeviceListPage />}
        />

        {/* 6.3 方案 B · 用户中心 → 合作方档案 四子菜单（04-1~04-4 共用页面壳） */}
        {PARTNER_ARCHIVE_MENU_LABELS.flatMap((menu) => [
          <Route
            key={`${menu}-list`}
            path={`用户中心/合作方档案/${menu}`}
            element={<PartnerArchiveListPage />}
          />,
          <Route
            key={`${menu}-detail`}
            path={`用户中心/合作方档案/${menu}/详情/:id`}
            element={<PartnerArchiveDetailPage />}
          />,
          <Route
            key={`${menu}-add`}
            path={`用户中心/合作方档案/${menu}/新增`}
            element={<PartnerArchiveFormPage />}
          />,
          <Route
            key={`${menu}-edit`}
            path={`用户中心/合作方档案/${menu}/编辑/:id`}
            element={<PartnerArchiveFormPage />}
          />,
        ])}
        <Route
          path="用户中心/合作方管理/合作方档案/*"
          element={<PartnerArchiveLegacyRedirect />}
        />
        <Route
          path="用户中心/业务协同/合作方档案存量改造地图"
          element={<PartnerStockChangeMapPage />}
        />
        <Route
          path="用户中心/业务协同/存量业务单据协同"
          element={<PartnerStockSynergySpecPage />}
        />

        <Route
          path="配置管理/平台管理/基础配置"
          element={<PlatformBasicConfigPage />}
        />

        {/* 配置管理 - 货品规格管理（大类管理 + 品类管理 + 货品管理） */}
        <Route
          path="配置管理/货品规格管理/大类管理"
          element={<MajorCategoryListPage />}
        />
        <Route
          path="配置管理/货品规格管理/品类管理"
          element={<SubcategoryListPage />}
        />
        <Route
          path="配置管理/货品规格管理/货品管理"
          element={<GoodsListPage />}
        />
        <Route
          path="配置管理/货品规格管理/货品管理/新增"
          element={<GoodsFormPage />}
        />
        <Route
          path="配置管理/货品规格管理/货品管理/编辑/:id"
          element={<GoodsFormPage />}
        />
        <Route
          path="配置管理/货品规格管理/货品管理/详情/:id"
          element={<GoodsDetailPage />}
        />
        <Route
          path="配置管理/货品规格管理/入库收集项配置"
          element={<InboundCollectListPage />}
        />
        <Route
          path="配置管理/货品规格管理/入库收集项配置/新增"
          element={<InboundCollectFormPage />}
        />
        <Route
          path="配置管理/货品规格管理/入库收集项配置/编辑/:id"
          element={<InboundCollectFormPage />}
        />
        <Route
          path="配置管理/货品规格管理/入库收集项配置/详情/:id"
          element={<InboundCollectDetailPage />}
        />


        <Route
          path="配置管理/仓库管理/仓库管理"
          element={<WarehouseListPage />}
        />
        <Route
          path="配置管理/仓库管理/添加仓库"
          element={<WarehouseFormPage />}
        />
        <Route
          path="配置管理/仓库管理/仓库/:id"
          element={<WarehouseFormPage />}
        />
        <Route
          path="配置管理/仓库管理/仓库管理/详情/:id"
          element={<WarehouseDetailPage />}
        />

        {/* 仓储 - 入库管理（入库申请 + 入库记录） */}
        <Route
          path="仓储/入库管理/入库申请"
          element={<InboundApplyListPage />}
        />
        <Route
          path="仓储/入库管理/入库申请/新增"
          element={<InboundRecordFormPage />}
        />
        <Route
          path="仓储/入库管理/入库申请/详情/:id"
          element={<InboundRecordDetailPage />}
        />

        <Route
          path="仓储/入库管理/入库记录"
          element={<InboundRecordListPage />}
        />
        <Route
          path="仓储/入库管理/入库记录/新增"
          element={<InboundRecordFormPage />}
        />
        <Route
          path="仓储/入库管理/入库记录/详情/:id"
          element={<InboundRecordDetailPage />}
        />
        <Route
          path="仓储/入库管理/入库暂存登记"
          element={
            <InboundStagingPrototypeGate>
              <InboundStagingListPage />
            </InboundStagingPrototypeGate>
          }
        />
        <Route
          path="仓储/入库管理/入库暂存登记/新增"
          element={
            <InboundStagingPrototypeGate>
              <InboundStagingFormPage />
            </InboundStagingPrototypeGate>
          }
        />
        <Route
          path="仓储/入库管理/入库暂存登记/编辑/:id"
          element={
            <InboundStagingPrototypeGate>
              <InboundStagingFormPage />
            </InboundStagingPrototypeGate>
          }
        />
        <Route
          path="仓储/入库管理/入库暂存登记/详情/:id"
          element={
            <InboundStagingPrototypeGate>
              <InboundStagingDetailPage />
            </InboundStagingPrototypeGate>
          }
        />

        {/* 仓储 - 出库管理（出库记录） */}
        <Route
          path="仓储/出库管理/出库记录"
          element={<OutboundRecordListPage />}
        />
        <Route
          path="仓储/出库管理/出库记录/新增"
          element={<OutboundRecordFormPage />}
        />
        <Route
          path="仓储/出库管理/出库记录/详情/:id"
          element={<OutboundRecordDetailPage />}
        />

        {/* 仓储 - 仓单管理 */}
        <Route
          path="仓储/仓单管理"
          element={<WarehouseReceiptListPage />}
        />
        <Route
          path="仓储/仓单管理/详情/:id"
          element={<WarehouseReceiptDetailPage />}
        />

        {/* 仓储 - 提货单 */}
        <Route
          path="仓储/提货单"
          element={<DeliveryOrderListPage />}
        />

        {/* 融资监管 · 监管办理（6.3 合作方权人/质权人引用切片） */}
        <Route
          path="融资/监管/监管业务/监管办理"
          element={<SupervisionHandlingPartnerRefPage />}
        />

        {placeholderPaths.map((menuPath) => (
          <Route
            key={menuPath}
            path={menuPath.replace(/^\//, "")}
            element={<PrototypeEmptyPage />}
          />
        ))}

        {monitorDeviceRoutes.map((suffix) => (
          <Route
            key={`monitor-${suffix}`}
            path={`物联网IOT与预警/物联网IOT管理/监控设备/${suffix}`}
            element={<PrototypeEmptyPage />}
          />
        ))}

        <Route path="*" element={<PrototypeEmptyPage />} />
      </Route>
    </Routes>
  )
}
