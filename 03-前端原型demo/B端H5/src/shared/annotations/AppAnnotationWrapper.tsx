import { useLocation } from "react-router-dom"
import type { ReactNode } from "react"
import { collateralWarningDetailH5Annotations } from "@/features/collateral-warning-events/annotations/collateral-warning-detail.annotations"
import { collateralWarningListAnnotations } from "@/features/collateral-warning-events/annotations/collateral-warning-list.annotations"
import { collateralWarningDocuments } from "@/features/collateral-warning-events/documents/collateral-warning-documents"
import { deviceWarningDetailH5Annotations } from "@/features/device-warning-events/annotations/device-warning-detail.annotations"
import { deviceWarningReleaseH5Annotations } from "@/features/device-warning-events/annotations/device-warning-release.annotations"
import { deviceWarningListAnnotations } from "@/features/device-warning-events/annotations/device-warning-list.annotations"
import { deviceWarningDocuments } from "@/features/device-warning-events/documents/device-warning-documents"
import { accessControlDeviceH5ListAnnotations } from "@/features/access-control-devices/annotations/access-control-device-list.annotations"
import { accessControlDeviceDocuments } from "@/features/access-control-devices/documents/access-control-device-documents"
import {
  myApplyRecordsListAnnotations,
  myUnlockApplyDetailH5Annotations,
} from "@/features/my-applies/annotations/my-apply.annotations"
import { myApplyDocuments } from "@/features/my-applies/documents/my-apply-documents"
import {
  unlockApplyAuditH5DetailAnnotations,
  unlockApplyAuditH5ListAnnotations,
} from "@/features/unlock-applies/annotations/unlock-apply-audit.annotations"
import { unlockApplyAuditH5Documents } from "@/features/unlock-applies/documents/unlock-apply-audit-documents"
import { deviceManagementHubAnnotations } from "@/pages/device-management.annotations"
import { readonlyRiskAnnotations } from "@/features/readonly-risk-views/annotations/readonly-risk-annotations"
import { readonlyRiskDocuments } from "@/features/readonly-risk-views/documents/readonly-risk-documents"
import {
  warehouseH5DetailAnnotations,
  warehouseH5ListAnnotations,
  warehouseH5FormAnnotations,
} from "@/features/warehouse-management/annotations/warehouse-management.annotations"
import { warehouseManagementH5Documents } from "@/features/warehouse-management/documents/warehouse-management-documents"
import {
  inboundH5DetailAnnotations,
  inboundH5InitiateAnnotations,
  inboundH5ListAnnotations,
} from "@/features/inbound-records/annotations/inbound-record.annotations"
import { inboundRecordH5Documents } from "@/features/inbound-records/documents/inbound-record-documents"
import {
  inboundStagingH5DetailAnnotations,
  inboundStagingH5FormAnnotations,
  inboundStagingH5GoodsAnnotations,
  inboundStagingH5ListAnnotations,
} from "@/features/inbound-staging-reg/annotations/inbound-staging-reg.annotations"
import { inboundStagingRegH5Documents } from "@/features/inbound-staging-reg/documents/inbound-staging-reg-documents"
import {
  outboundH5DetailAnnotations,
  outboundH5InitiateAnnotations,
  outboundH5ListAnnotations,
} from "@/features/outbound-records/annotations/outbound-record.annotations"
import { outboundRecordH5Documents } from "@/features/outbound-records/documents/outbound-record-documents"
import {
  warehouseReceiptH5DetailAnnotations,
  warehouseReceiptH5InitiateAnnotations,
  warehouseReceiptH5ListAnnotations,
  warehouseReceiptH5OpsAnnotations,
} from "@/features/warehouse-receipts/annotations/warehouse-receipt-h5.annotations"
import { warehouseReceiptH5Documents } from "@/features/warehouse-receipts/documents/warehouse-receipt-h5-documents"
import {
  partnerArchiveH5DetailAnnotations,
  partnerArchiveH5FormAnnotations,
  partnerArchiveH5ListAnnotations,
} from "@/features/partner-archives/annotations/partner-archive-h5.annotations"
import { getPartnerArchiveDocuments } from "@/features/partner-archives/documents/partner-archive-documents"
import { parsePartnerArchiveMenuFromH5ListPath } from "@prototype/shared/partner-archives/partner-archive-domain"
import type { PartnerArchiveMenuLabel } from "@prototype/shared/partner-archives/partner-archive-routes"
import {
  PrototypeAnnotationProvider,
  type PrototypeAnnotation,
  type PrototypeDocument,
} from "./PrototypeAnnotationLayer"

function resolvePartnerArchiveMenuForH5(
  pathname: string,
  search: string,
): PartnerArchiveMenuLabel {
  const fromPath = parsePartnerArchiveMenuFromH5ListPath(pathname)
  if (fromPath) return fromPath
  const raw = new URLSearchParams(search).get("archiveMenu")
  const map: Record<string, PartnerArchiveMenuLabel> = {
    OWNER: "货主信息",
    PICKUP_PERSON: "提货人信息",
    FUNDER: "资金方信息",
    SERVICE_PROVIDER: "服务方信息",
    货主信息: "货主信息",
    提货人信息: "提货人信息",
    资金方信息: "资金方信息",
    服务方信息: "服务方信息",
  }
  if (raw && map[raw]) return map[raw]
  return "货主信息"
}

export function AppAnnotationWrapper({ children }: { children: ReactNode }) {
  const location = useLocation()
  const partnerArchiveMenu = resolvePartnerArchiveMenuForH5(
    location.pathname,
    location.search,
  )

  let pageTitle = "森云科技 · SYZC 移动端原型"
  let currentAnnotations: PrototypeAnnotation[] = []
  let currentDocuments: PrototypeDocument[] = []

  if (location.pathname.endsWith("/batch-publish")) {
    pageTitle = "押品预警 · 批量公示确认 · 移动端 PRD 标注"
    currentAnnotations = collateralWarningListAnnotations
    currentDocuments = collateralWarningDocuments
  } else if (location.pathname.endsWith("/publish")) {
    pageTitle = "押品预警 · 公示确认 · 移动端 PRD 标注"
    currentAnnotations = collateralWarningDetailH5Annotations
    currentDocuments = collateralWarningDocuments
  } else if (location.pathname.endsWith("/disclosure")) {
    pageTitle = "押品预警 · 公示详情 · 移动端 PRD 标注"
    currentAnnotations = collateralWarningDetailH5Annotations
    currentDocuments = collateralWarningDocuments
  } else if (location.pathname.startsWith("/m/supervision/order-warnings/")) {
    pageTitle = "押品预警详情 · 移动端交互与 PRD 标注"
    currentAnnotations = collateralWarningDetailH5Annotations
    currentDocuments = collateralWarningDocuments
  } else if (location.pathname.startsWith("/m/supervision/order-warnings")) {
    pageTitle = "押品预警信息 · 移动端交互与 PRD 标注"
    currentAnnotations = collateralWarningListAnnotations
    currentDocuments = collateralWarningDocuments
  } else if (location.pathname.endsWith("/release")) {
    pageTitle = "设备预警解除 · 移动端交互与 PRD 标注"
    currentAnnotations = deviceWarningReleaseH5Annotations
    currentDocuments = deviceWarningDocuments
  } else if (location.pathname.startsWith("/m/iot/device-warning-events/")) {
    pageTitle = "IoT 设备预警详情 · 移动端交互与 PRD 标注"
    currentAnnotations = deviceWarningDetailH5Annotations
    currentDocuments = deviceWarningDocuments
  } else if (location.pathname.startsWith("/m/iot/device-warning-events")) {
    pageTitle = "IoT 设备预警事件 · 移动端交互与 PRD 标注"
    currentAnnotations = deviceWarningListAnnotations
    currentDocuments = deviceWarningDocuments
  } else if (location.pathname.startsWith("/m/my-applies/unlock/")) {
    pageTitle = "开锁申请详情 · 移动端交互与 PRD 标注"
    currentAnnotations = myUnlockApplyDetailH5Annotations
    currentDocuments = myApplyDocuments
  } else if (location.pathname.startsWith("/m/my-applies")) {
    pageTitle = "我的申请记录 · 移动端交互与 PRD 标注"
    currentAnnotations = myApplyRecordsListAnnotations
    currentDocuments = myApplyDocuments
  } else if (
    location.pathname.startsWith("/m/access-control-devices") ||
    location.pathname.startsWith("/m/device-management")
  ) {
    pageTitle = "设备管理 · 移动端交互与 PRD 标注"
    currentAnnotations = [
      ...deviceManagementHubAnnotations,
      ...accessControlDeviceH5ListAnnotations,
    ]
    currentDocuments = accessControlDeviceDocuments
  } else if (location.pathname.startsWith("/m/approval/unlock-applies/")) {
    pageTitle = "开锁审批详情 · 移动端交互与 PRD 标注"
    currentAnnotations = unlockApplyAuditH5DetailAnnotations
    currentDocuments = unlockApplyAuditH5Documents
  } else if (location.pathname.startsWith("/m/approval/unlock-applies")) {
    pageTitle = "开锁审批 · 移动端交互与 PRD 标注"
    currentAnnotations = unlockApplyAuditH5ListAnnotations
    currentDocuments = unlockApplyAuditH5Documents
  } else if (
    location.pathname.startsWith("/m/risk/mid-loan") ||
    location.pathname === "/m/module/ws-risk-in-loan"
  ) {
    pageTitle = "贷中风控管理"
    currentAnnotations = []
    currentDocuments = []
  } else if (location.pathname.startsWith("/m/risk/disclosures")) {
    pageTitle = "风险公示 · 移动端交互与 PRD 标注"
    currentAnnotations = readonlyRiskAnnotations["risk-disclosure"]
    currentDocuments = readonlyRiskDocuments["risk-disclosure"]
  } else if (location.pathname.startsWith("/m/inbound/staging/reg/goods")) {
    pageTitle = "入库暂存登记 · H5 货品步 · PRD 标注"
    currentAnnotations = inboundStagingH5GoodsAnnotations
    currentDocuments = inboundStagingRegH5Documents
  } else if (location.pathname.startsWith("/m/inbound/staging/reg")) {
    pageTitle = "入库暂存登记 · H5 新增 · PRD 标注"
    currentAnnotations = inboundStagingH5FormAnnotations
    currentDocuments = inboundStagingRegH5Documents
  } else if (location.pathname.startsWith("/m/workspace/warehouse-receipts/")) {
    pageTitle = "仓单详情 · 移动端交互与 PRD 标注"
    currentAnnotations = warehouseReceiptH5DetailAnnotations
    currentDocuments = warehouseReceiptH5Documents
  } else if (location.pathname === "/m/workspace/warehouse-receipts") {
    pageTitle = "仓单管理 · 移动端交互与 PRD 标注"
    currentAnnotations = warehouseReceiptH5ListAnnotations
    currentDocuments = warehouseReceiptH5Documents
  } else if (location.pathname.startsWith("/m/receipts/initiate")) {
    pageTitle = "仓单开立 · 移动端交互与 PRD 标注"
    currentAnnotations = warehouseReceiptH5InitiateAnnotations
    currentDocuments = warehouseReceiptH5Documents
  } else if (location.pathname.startsWith("/m/receipts/")) {
    pageTitle = "仓单动碰办理 · 移动端交互与 PRD 标注"
    currentAnnotations = warehouseReceiptH5OpsAnnotations
    currentDocuments = warehouseReceiptH5Documents
  } else if (location.pathname.startsWith("/m/workspace/inbound-staging/")) {
    pageTitle = "入库暂存登记 · H5 详情 · PRD 标注"
    currentAnnotations = inboundStagingH5DetailAnnotations
    currentDocuments = inboundStagingRegH5Documents
  } else if (location.pathname.startsWith("/m/workspace/inbound-staging")) {
    pageTitle = "入库暂存登记 · H5 列表 · PRD 标注"
    currentAnnotations = inboundStagingH5ListAnnotations
    currentDocuments = inboundStagingRegH5Documents
  } else if (location.pathname.startsWith("/m/workspace/inbound-records/")) {
    pageTitle = "入库详情 · 移动端交互与 PRD 标注"
    currentAnnotations = inboundH5DetailAnnotations
    currentDocuments = inboundRecordH5Documents
  } else if (location.pathname.startsWith("/m/workspace/inbound-records")) {
    pageTitle = "入库管理 · 移动端交互与 PRD 标注"
    currentAnnotations = inboundH5ListAnnotations
    currentDocuments = inboundRecordH5Documents
  } else if (location.pathname.startsWith("/m/inbound/initiate")) {
    pageTitle = "入库发起 · 移动端交互与 PRD 标注"
    currentAnnotations = inboundH5InitiateAnnotations
    currentDocuments = inboundRecordH5Documents
  } else if (location.pathname.startsWith("/m/workspace/outbound-records/")) {
    pageTitle = "出库单详情 · 移动端交互与 PRD 标注"
    currentAnnotations = outboundH5DetailAnnotations
    currentDocuments = outboundRecordH5Documents
  } else if (location.pathname.startsWith("/m/workspace/outbound-records")) {
    pageTitle = "出库管理 · 移动端交互与 PRD 标注"
    currentAnnotations = outboundH5ListAnnotations
    currentDocuments = outboundRecordH5Documents
  } else if (location.pathname.startsWith("/m/outbound/initiate")) {
    pageTitle = "出库发起 · 移动端交互与 PRD 标注"
    currentAnnotations = outboundH5InitiateAnnotations
    currentDocuments = outboundRecordH5Documents
  } else if (location.pathname.startsWith("/m/partner-archives/form")) {
    pageTitle = "合作方档案 · H5 新增/编辑 · PRD 标注"
    currentAnnotations = partnerArchiveH5FormAnnotations
    currentDocuments = getPartnerArchiveDocuments(partnerArchiveMenu)
  } else if (location.pathname.startsWith("/m/workspace/user-center/partner-archives/")) {
    pageTitle = "合作方档案 · H5 详情 · PRD 标注"
    currentAnnotations = partnerArchiveH5DetailAnnotations
    currentDocuments = getPartnerArchiveDocuments(partnerArchiveMenu)
  } else if (location.pathname.startsWith("/m/workspace/user-center/partner-archives")) {
    pageTitle = "合作方档案 · H5 列表 · PRD 标注"
    currentAnnotations = partnerArchiveH5ListAnnotations
    currentDocuments = getPartnerArchiveDocuments(partnerArchiveMenu)
  } else if (
    location.pathname.startsWith("/m/workspace/config/warehouse-management") ||
    location.pathname.startsWith("/m/workspace/config/new-warehouse") ||
    location.pathname.startsWith("/m/config/warehouses")
  ) {
    const isNewWarehouse =
      location.pathname === "/m/workspace/config/new-warehouse" ||
      location.pathname === "/m/config/warehouses/new"
    const isList =
      location.pathname === "/m/workspace/config/warehouse-management" ||
      location.pathname === "/m/config/warehouses"
    pageTitle = isNewWarehouse
      ? "新增仓库 · 移动端交互与 PRD 标注"
      : "仓库管理 · 移动端交互与 PRD 标注"
    currentAnnotations = isNewWarehouse
      ? warehouseH5FormAnnotations
      : isList
        ? warehouseH5ListAnnotations
        : warehouseH5DetailAnnotations
    currentDocuments = warehouseManagementH5Documents
  } else {
    pageTitle = "森云·可信供应链数字中枢 · 移动端原型"
    currentAnnotations = [
      {
        id: "home-metrics-card",
        targetId: "home-metrics-card",
        number: 1,
        kind: "页面",
        title: "中枢运行指标看板与预警快捷入口",
        content: "展示存货质押总货值、在库监管设备在线率与风控预警数量，支持一键穿透到预警处置中枢。",
        details: [
          {
            title: "业务规则",
            items: [
              { label: "实时数据", content: "每 30 秒轮询一次后端风控指标，并在异常突破警戒线时闪烁提示。" },
            ],
          },
        ],
      },
    ]
    currentDocuments = [
      {
        id: "home-prd",
        title: "森云可信中枢移动端首页 PRD 规格",
        category: "PRD需求规格",
        badge: "v6.2.0",
        content: `### 移动端中枢首页
面向企业风控总监、驻库监管员和银行客户经理，提供实时的**仓储现场视频轮播、指标大盘、风控告警穿透与扫码巡检**入口。`,
      },
    ]
  }

  return (
    <PrototypeAnnotationProvider
      title={pageTitle}
      annotations={currentAnnotations}
      documents={currentDocuments}
    >
      {children}
    </PrototypeAnnotationProvider>
  )
}
