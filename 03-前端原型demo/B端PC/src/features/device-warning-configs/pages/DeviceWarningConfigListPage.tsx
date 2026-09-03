import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { DEFAULT_DEVICE_WARNING_CONFIG_FILTERS, PAGE_SIZE } from "../domain/constants"
import type { DeviceWarningConfigAction } from "../domain/actions"
import type { DeviceWarningConfig, DeviceWarningConfigFilters } from "../domain/types"
import { ConfigConfirmDialog } from "../components/ConfigConfirmDialog"
import { DeviceWarningConfigFiltersPanel } from "../components/DeviceWarningConfigFilters"
import { DeviceWarningConfigTable } from "../components/DeviceWarningConfigTable"
import {
  filterDeviceWarningConfigs,
  paginateConfigs,
} from "../lib/list-utils"
import { deviceWarningConfigsMock } from "../mock/device-warning-configs.mock"

type PendingAction = {
  action: "disable" | "delete"
  config: DeviceWarningConfig
}

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { deviceWarningConfigListAnnotations } from "../annotations/device-warning-config-list.annotations"
import { deviceWarningConfigDocuments } from "../documents/device-warning-config-documents"

export function DeviceWarningConfigListPage() {
  const navigate = useNavigate()
  const [draftFilters, setDraftFilters] = useState<DeviceWarningConfigFilters>(
    DEFAULT_DEVICE_WARNING_CONFIG_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<DeviceWarningConfigFilters>(
    DEFAULT_DEVICE_WARNING_CONFIG_FILTERS
  )
  const [configs, setConfigs] = useState(deviceWarningConfigsMock)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const filteredConfigs = useMemo(
    () => filterDeviceWarningConfigs(configs, appliedFilters),
    [configs, appliedFilters]
  )

  const totalPages = Math.max(1, Math.ceil(filteredConfigs.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageConfigs = useMemo(
    () => paginateConfigs(filteredConfigs, currentPage, pageSize),
    [filteredConfigs, currentPage, pageSize]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_DEVICE_WARNING_CONFIG_FILTERS)
    setAppliedFilters(DEFAULT_DEVICE_WARNING_CONFIG_FILTERS)
    setPage(1)
  }

  const handleAction = (action: DeviceWarningConfigAction, config: DeviceWarningConfig) => {
    switch (action) {
      case "edit":
        navigate(`/物联网IOT与预警/预警配置/设备预警配置/编辑/${config.configId}`)
        return
      case "disable":
        setPendingAction({ action: "disable", config })
        return
      case "enable":
        setConfigs((current) =>
          current.map((item) =>
            item.configId === config.configId ? { ...item, status: "生效中" } : item
          )
        )
        showToast("启用成功")
        return
      case "delete":
        setPendingAction({ action: "delete", config })
        return
      default:
        return
    }
  }

  const confirmPendingAction = () => {
    if (!pendingAction) {
      return
    }

    if (pendingAction.action === "disable") {
      setConfigs((current) =>
        current.map((item) =>
          item.configId === pendingAction.config.configId
            ? { ...item, status: "停用" }
            : item
        )
      )
      showToast("停用成功")
    }

    if (pendingAction.action === "delete") {
      setConfigs((current) =>
        current.filter((item) => item.configId !== pendingAction.config.configId)
      )
      showToast("删除成功")
    }

    setPendingAction(null)
  }

  return (
    <PrototypeAnnotationProvider
      title="设备预警配置列表 · 原型批注"
      annotations={deviceWarningConfigListAnnotations}
      documents={deviceWarningConfigDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["device-warning-config-page"]}>
          <h1 className="text-2xl font-semibold tracking-tight">设备预警配置</h1>
          <p className="text-sm text-muted-foreground">
            配置设备侧预警规则，管理触发条件、关联设备与启停状态
          </p>
        </PrototypeAnnotationTarget>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSearch()
          }}
        >
          <PrototypeAnnotationTarget annotationIds={["device-warning-config-filter"]}>
            <DeviceWarningConfigFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
              onAdd={() => navigate("/物联网IOT与预警/预警配置/设备预警配置/新增")}
            />
          </PrototypeAnnotationTarget>
        </form>

        <PrototypeAnnotationTarget annotationIds={["device-warning-config-table", "device-warning-config-row-actions"]}>
          <DeviceWarningConfigTable
            configs={pageConfigs}
            page={currentPage}
            pageSize={pageSize}
            onAction={handleAction}
          />
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["device-warning-config-pagination"]}>
          <WarningListPagination
            total={filteredConfigs.length}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        </PrototypeAnnotationTarget>

        <ConfigConfirmDialog
          open={pendingAction !== null}
          title={pendingAction?.action === "disable" ? "确认停用" : "确认删除"}
          description={
            pendingAction?.action === "disable"
              ? "停用后将暂停事件监听，确认停用？"
              : "删除后不可恢复，关联未处理预警将置为无效，确认删除？"
          }
          confirmLabel={pendingAction?.action === "disable" ? "确认停用" : "确认删除"}
          destructive={pendingAction?.action === "delete"}
          onOpenChange={(open) => {
            if (!open) {
              setPendingAction(null)
            }
          }}
          onConfirm={confirmPendingAction}
        />

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
