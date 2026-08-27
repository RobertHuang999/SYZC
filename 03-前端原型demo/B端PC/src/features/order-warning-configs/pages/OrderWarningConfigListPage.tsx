import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  DEFAULT_ORDER_WARNING_CONFIG_FILTERS,
  ORDER_WARNING_FOOTER_HINT,
  PAGE_SIZE,
} from "../domain/constants"
import type { OrderWarningConfigAction } from "../domain/actions"
import type { OrderWarningConfig, OrderWarningConfigFilters } from "../domain/types"
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog"
import { OrderWarningConfigFiltersPanel } from "../components/OrderWarningConfigFilters"
import { OrderWarningConfigTable } from "../components/OrderWarningConfigTable"
import {
  filterOrderWarningConfigs,
  paginateConfigs,
} from "../lib/list-utils"
import { orderWarningConfigsMock } from "../mock/order-warning-configs.mock"

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { orderWarningConfigListAnnotations } from "../annotations/order-warning-config-list.annotations"
import { orderWarningConfigDocuments } from "../documents/order-warning-config-documents"

export function OrderWarningConfigListPage() {
  const navigate = useNavigate()
  const [draftFilters, setDraftFilters] = useState<OrderWarningConfigFilters>(
    DEFAULT_ORDER_WARNING_CONFIG_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<OrderWarningConfigFilters>(
    DEFAULT_ORDER_WARNING_CONFIG_FILTERS
  )
  const [configs, setConfigs] = useState(orderWarningConfigsMock)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [deleteTarget, setDeleteTarget] = useState<OrderWarningConfig | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const filteredConfigs = useMemo(
    () => filterOrderWarningConfigs(configs, appliedFilters),
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
    setDraftFilters(DEFAULT_ORDER_WARNING_CONFIG_FILTERS)
    setAppliedFilters(DEFAULT_ORDER_WARNING_CONFIG_FILTERS)
    setPage(1)
  }

  const handleAction = (action: OrderWarningConfigAction, config: OrderWarningConfig) => {
    if (action === "edit") {
      navigate(`/预警配置/订单预警配置/编辑/${config.configId}`)
      return
    }
    if (action === "delete") {
      setDeleteTarget(config)
    }
  }

  return (
    <PrototypeAnnotationProvider
      title="订单预警配置列表 · 原型批注"
      annotations={orderWarningConfigListAnnotations}
      documents={orderWarningConfigDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["order-warning-config-page"]}>
          <h1 className="text-2xl font-semibold tracking-tight">订单预警配置</h1>
          <p className="text-sm text-muted-foreground">
            配置订单侧多策略预警规则，汇总已启用预警项与对应等级
          </p>
        </PrototypeAnnotationTarget>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSearch()
          }}
        >
          <PrototypeAnnotationTarget annotationIds={["order-warning-config-filter"]}>
            <OrderWarningConfigFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
              onAdd={() => navigate("/预警配置/订单预警配置/新增")}
            />
          </PrototypeAnnotationTarget>
        </form>

        <div className="space-y-4">
          <PrototypeAnnotationTarget annotationIds={["order-warning-config-table", "order-warning-config-row-actions"]}>
            <OrderWarningConfigTable
              configs={pageConfigs}
              page={currentPage}
              pageSize={pageSize}
              onAction={handleAction}
            />
          </PrototypeAnnotationTarget>

          <div className="text-sm text-muted-foreground">{ORDER_WARNING_FOOTER_HINT}</div>

          <PrototypeAnnotationTarget annotationIds={["order-warning-config-pagination"]}>
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
        </div>

        <DeleteConfirmDialog
          open={deleteTarget !== null}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteTarget(null)
            }
          }}
          onConfirm={() => {
            if (!deleteTarget) {
              return
            }
            setConfigs((current) =>
              current.filter((item) => item.configId !== deleteTarget.configId)
            )
            setDeleteTarget(null)
            showToast("删除成功")
          }}
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
