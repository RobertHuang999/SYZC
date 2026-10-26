import { Navigate, Route, Routes, useParams } from "react-router-dom"
import { CollateralWarningDetailPage } from "@/features/collateral-warning-events/pages/CollateralWarningDetailPage"
import { CollateralWarningListPage } from "@/features/collateral-warning-events/pages/CollateralWarningListPage"
import { CollateralWarningPublishPage } from "@/features/collateral-warning-events/pages/CollateralWarningPublishPage"
import { CollateralWarningBatchPublishPage } from "@/features/collateral-warning-events/pages/CollateralWarningBatchPublishPage"
import { CollateralWarningDisclosureDetailPage } from "@/features/collateral-warning-events/pages/CollateralWarningDisclosureDetailPage"
import { DeviceWarningEventDetailPage } from "@/features/device-warning-events/pages/DeviceWarningEventDetailPage"
import { DeviceWarningEventListPage } from "@/features/device-warning-events/pages/DeviceWarningEventListPage"
import { DeviceWarningEventReleasePage } from "@/features/device-warning-events/pages/DeviceWarningEventReleasePage"
import { GenericModulePage } from "@/pages/GenericModulePage"
import { MyApplyRecordsPage } from "@/features/my-applies/pages/MyApplyRecordsPage"
import { MyUnlockApplyDetailPage } from "@/features/my-applies/pages/MyUnlockApplyDetailPage"
import { UnlockApplyDetailPage } from "@/features/unlock-applies/pages/UnlockApplyDetailPage"
import { UnlockApplyListPage } from "@/features/unlock-applies/pages/UnlockApplyListPage"
import { AccessControlDeviceListPage } from "@/features/access-control-devices/pages/AccessControlDeviceListPage"
import { DeviceManagementPage } from "@/pages/DeviceManagementPage"
import { HomePage } from "@/pages/HomePage"
import { PledgeOrderPlaceholderPage } from "@/pages/PledgeOrderPlaceholderPage"
import { ProfilePage } from "@/pages/ProfilePage"
import { TasksManagementPage } from "@/pages/TasksManagementPage"
import { WorkspacePage } from "@/pages/WorkspacePage"
import { PrototypeEmptyPage } from "@/pages/PrototypeEmptyPage"
import { MOBILE_MENU_ITEMS } from "@/data/mobileMenuData"
import { RiskDisclosureLedgerDetailPage } from "@/features/risk-disclosure/pages/RiskDisclosureLedgerDetailPage"
import { RiskDisclosureListPage } from "@/features/risk-disclosure/pages/RiskDisclosureListPage"
import { WarehouseListPage } from "@/features/warehouse-management/pages/WarehouseListPage"
import { WarehouseFormPage } from "@/features/warehouse-management/pages/WarehouseFormPage"
import { WarehouseDetailPage } from "@/features/warehouse-management/pages/WarehouseDetailPage"
import { WarehouseEditPage } from "@/features/warehouse-management/pages/WarehouseEditPage"
import { InboundRecordListPage } from "@/features/inbound-records/pages/InboundRecordListPage"
import { WarehouseReceiptListPage } from "@/features/warehouse-receipts/pages/WarehouseReceiptListPage"
import { WarehouseReceiptDetailPage } from "@/features/warehouse-receipts/pages/WarehouseReceiptDetailPage"
import { ReceiptInitiateOwnerPage } from "@/features/warehouse-receipts/pages/initiate/ReceiptInitiateOwnerPage"
import { ReceiptInitiateGoodsPage } from "@/features/warehouse-receipts/pages/initiate/ReceiptInitiateGoodsPage"
import { ReceiptOutboundPage } from "@/features/warehouse-receipts/pages/ops/ReceiptOutboundPage"
import { ReceiptRelocatePage } from "@/features/warehouse-receipts/pages/ops/ReceiptRelocatePage"
import { ReceiptReplenishPage } from "@/features/warehouse-receipts/pages/ops/ReceiptReplenishPage"
import { ReceiptRemovePage } from "@/features/warehouse-receipts/pages/ops/ReceiptRemovePage"
import { ReceiptCancelPage } from "@/features/warehouse-receipts/pages/ops/ReceiptCancelPage"
import { ReceiptInboundPage } from "@/features/warehouse-receipts/pages/ops/ReceiptInboundPage"
import { InboundInitiateGoodsPage } from "@/features/inbound-records/pages/InboundInitiateGoodsPage"
import { InboundInitiatePage } from "@/features/inbound-records/pages/InboundInitiatePage"
import { InboundRecordDetailPage } from "@/features/inbound-records/pages/InboundRecordDetailPage"
import { InboundStagingPrototypeGate } from "@/features/inbound-staging-reg/components/InboundStagingPrototypeGate"
import { InboundStagingListPage } from "@/features/inbound-staging-reg/pages/InboundStagingListPage"
import { InboundStagingDetailPage } from "@/features/inbound-staging-reg/pages/InboundStagingDetailPage"
import { InboundStagingFormPage } from "@/features/inbound-staging-reg/pages/InboundStagingFormPage"
import { InboundStagingGoodsPage } from "@/features/inbound-staging-reg/pages/InboundStagingGoodsPage"
import {
  OutboundRecordListPage,
  OutboundRecordDetailPage,
  OutboundInitiatePage,
  OutboundInitiateGoodsPage,
} from "@/features/outbound-records"
import { PartnerArchiveListPage } from "@/features/partner-archives/pages/PartnerArchiveListPage"
import { PartnerArchiveDetailPage } from "@/features/partner-archives/pages/PartnerArchiveDetailPage"
import { PartnerArchiveFormPage } from "@/features/partner-archives/pages/PartnerArchiveFormPage"
import { PartnerArchiveH5LegacyRedirect } from "@/features/partner-archives/components/PartnerArchiveH5LegacyRedirect"
import { H5_PARTNER_ARCHIVE_LIST_SLUG } from "@prototype/shared/partner-archives/partner-archive-domain"
import {
  PARTNER_ARCHIVE_MENU_LABELS,
  type PartnerArchiveMenuLabel,
} from "@prototype/shared/partner-archives/partner-archive-routes"

const midLoanMenuItem = MOBILE_MENU_ITEMS.find((item) => item.id === "ws-risk-in-loan")

function LegacyWarehouseDetailRedirect() {
  const { id } = useParams()
  return (
    <Navigate
      to={`/m/workspace/config/warehouse-management/${id ?? ""}`}
      replace
    />
  )
}

function LegacyWarehouseEditRedirect() {
  const { id } = useParams()
  return (
    <Navigate
      to={`/m/workspace/config/warehouse-management/${id ?? ""}/edit`}
      replace
    />
  )
}

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
      <Route path="/m/my-applies" element={<MyApplyRecordsPage />} />
      <Route
        path="/m/my-applies/unlock/:applyNo"
        element={<MyUnlockApplyDetailPage />}
      />

      <Route path="/m/approval/unlock-applies" element={<UnlockApplyListPage />} />
      <Route
        path="/m/approval/unlock-applies/:applyNo"
        element={<UnlockApplyDetailPage />}
      />

      <Route path="/m/device-management" element={<DeviceManagementPage />} />
      <Route path="/m/access-control-devices" element={<AccessControlDeviceListPage />} />

      <Route path="/m/workspace/inbound-records" element={<InboundRecordListPage />} />
      <Route
        path="/m/workspace/inbound-records/:id"
        element={<InboundRecordDetailPage />}
      />
      <Route path="/m/inbound/initiate" element={<InboundInitiatePage />} />
      <Route path="/m/inbound/initiate/goods" element={<InboundInitiateGoodsPage />} />

      <Route
        path="/m/workspace/inbound-staging"
        element={
          <InboundStagingPrototypeGate>
            <InboundStagingListPage />
          </InboundStagingPrototypeGate>
        }
      />
      <Route
        path="/m/inbound/staging/reg"
        element={
          <InboundStagingPrototypeGate fallbackTo="/m/inbound/initiate">
            <InboundStagingFormPage />
          </InboundStagingPrototypeGate>
        }
      />
      <Route
        path="/m/inbound/staging/reg/goods"
        element={
          <InboundStagingPrototypeGate fallbackTo="/m/inbound/initiate">
            <InboundStagingGoodsPage />
          </InboundStagingPrototypeGate>
        }
      />
      <Route
        path="/m/workspace/inbound-staging/:id"
        element={
          <InboundStagingPrototypeGate>
            <InboundStagingDetailPage />
          </InboundStagingPrototypeGate>
        }
      />

      <Route path="/m/workspace/warehouse-receipts" element={<WarehouseReceiptListPage />} />
      <Route
        path="/m/workspace/warehouse-receipts/:id"
        element={<WarehouseReceiptDetailPage />}
      />
      <Route path="/m/receipts/initiate" element={<ReceiptInitiateOwnerPage />} />
      <Route
        path="/m/receipts/initiate/goods"
        element={<ReceiptInitiateGoodsPage />}
      />
      <Route
        path="/m/receipts/initiate/confirm"
        element={<Navigate to="/m/receipts/initiate/goods" replace />}
      />
      <Route
        path="/m/receipts/initiate/sign"
        element={<Navigate to="/m/receipts/initiate/goods" replace />}
      />
      <Route path="/m/receipts/:id/outbound" element={<ReceiptOutboundPage />} />
      <Route path="/m/receipts/:id/relocate" element={<ReceiptRelocatePage />} />
      <Route path="/m/receipts/:id/replenish" element={<ReceiptReplenishPage />} />
      <Route path="/m/receipts/:id/remove" element={<ReceiptRemovePage />} />
      <Route path="/m/receipts/:id/cancel" element={<ReceiptCancelPage />} />
      <Route path="/m/receipts/:id/inbound" element={<ReceiptInboundPage />} />

      <Route path="/m/workspace/outbound-records" element={<OutboundRecordListPage />} />
      <Route
        path="/m/workspace/outbound-records/:id"
        element={<OutboundRecordDetailPage />}
      />
      <Route path="/m/outbound/initiate" element={<OutboundInitiatePage />} />
      <Route path="/m/outbound/initiate/goods" element={<OutboundInitiateGoodsPage />} />

      {PARTNER_ARCHIVE_MENU_LABELS.flatMap((menu) => {
        const slug = H5_PARTNER_ARCHIVE_LIST_SLUG[menu as PartnerArchiveMenuLabel]
        return [
          <Route
            key={`${slug}-list`}
            path={`/m/workspace/user-center/partner-archives/${slug}`}
            element={<PartnerArchiveListPage />}
          />,
          <Route
            key={`${slug}-detail`}
            path={`/m/workspace/user-center/partner-archives/${slug}/:id`}
            element={<PartnerArchiveDetailPage />}
          />,
        ]
      })}
      <Route
        path="/m/workspace/user-center/partner-archives/*"
        element={<PartnerArchiveH5LegacyRedirect />}
      />
      <Route path="/m/partner-archives/form" element={<PartnerArchiveFormPage />} />

      <Route path="/m/module/:moduleId" element={<GenericModulePage />} />

      <Route
        path="/m/workspace/config/warehouse-management"
        element={<WarehouseListPage />}
      />
      <Route
        path="/m/workspace/config/new-warehouse"
        element={<WarehouseFormPage />}
      />
      <Route
        path="/m/workspace/config/warehouse-management/:id/edit"
        element={<WarehouseEditPage />}
      />
      <Route
        path="/m/workspace/config/warehouse-management/:id"
        element={<WarehouseDetailPage />}
      />
      <Route
        path="/m/config/warehouses"
        element={<Navigate to="/m/workspace/config/warehouse-management" replace />}
      />
      <Route
        path="/m/config/warehouses/new"
        element={<Navigate to="/m/workspace/config/new-warehouse" replace />}
      />
      <Route
        path="/m/config/warehouses/:id/edit"
        element={<LegacyWarehouseEditRedirect />}
      />
      <Route
        path="/m/config/warehouses/:id"
        element={<LegacyWarehouseDetailRedirect />}
      />

      {/* 6. 高保真风控预警专属流转页 */}
      <Route
        path="/m/supervision/order-warnings"
        element={<CollateralWarningListPage />}
      />
      <Route
        path="/m/supervision/order-warnings/batch-publish"
        element={<CollateralWarningBatchPublishPage />}
      />
      <Route
        path="/m/supervision/order-warnings/:id"
        element={<CollateralWarningDetailPage />}
      />
      <Route
        path="/m/supervision/order-warnings/:id/publish"
        element={<CollateralWarningPublishPage />}
      />
      <Route
        path="/m/supervision/order-warnings/:id/disclosure"
        element={<CollateralWarningDisclosureDetailPage />}
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
        path="/m/risk/mid-loan"
        element={
          <PrototypeEmptyPage
            title="贷中风控管理"
            menuItem={midLoanMenuItem}
            backTo="/m/workspace"
          />
        }
      />
      <Route
        path="/m/risk/mid-loan/:id"
        element={
          <PrototypeEmptyPage
            title="贷中风控管理"
            menuItem={midLoanMenuItem}
            backTo="/m/workspace"
          />
        }
      />
      <Route path="/m/risk/disclosures" element={<RiskDisclosureListPage />} />
      <Route
        path="/m/risk/disclosures/:id"
        element={<RiskDisclosureLedgerDetailPage />}
      />

      <Route
        path="/m/finance/pledge-orders"
        element={<PledgeOrderPlaceholderPage />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
