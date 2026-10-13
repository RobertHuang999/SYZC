import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { warehouseManagementDocuments } from "../documents/warehouse-management-documents"
import { warehouseListAnnotations } from "../annotations/warehouse-management.annotations"
import {
  DEFAULT_WAREHOUSE_FILTERS,
  PAGE_SIZE,
  WAREHOUSE_ADD_PATH,
  WAREHOUSE_QUOTA,
  warehouseEditPath,
} from "../domain/constants"
import type { WarehouseFilters, WarehouseRecord } from "../domain/types"
import { warehousesMock } from "../mock/warehouses.mock"
import { filterWarehouses, paginateWarehouses } from "../lib/list-utils"
import { WarehouseFiltersPanel } from "../components/WarehouseFiltersPanel"
import { WarehouseTable, type WarehouseRowAction } from "../components/WarehouseTable"
import { ConfirmActionDialog } from "../components/ConfirmActionDialog"
import { VersionChangeProvider } from "../components/VersionChangeHighlight"

export function WarehouseListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [rows, setRows] = useState<WarehouseRecord[]>(() => [...warehousesMock])
  const [draftFilters, setDraftFilters] = useState<WarehouseFilters>(
    DEFAULT_WAREHOUSE_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<WarehouseFilters>(
    DEFAULT_WAREHOUSE_FILTERS
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [confirmStop, setConfirmStop] = useState<WarehouseRecord | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<WarehouseRecord | null>(
    null
  )
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  useEffect(() => {
    setRows([...warehousesMock])
  }, [location.key])

  const filtered = useMemo(
    () => filterWarehouses(rows, appliedFilters),
    [rows, appliedFilters]
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageData = useMemo(
    () => paginateWarehouses(filtered, currentPage, pageSize),
    [filtered, currentPage, pageSize]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2600)
  }

  const handleRowAction = (action: WarehouseRowAction, item: WarehouseRecord) => {
    if (action === "edit") {
      navigate(warehouseEditPath(item.id))
      return
    }
    if (action === "toggleStatus") {
      if (item.status === "ENABLED") {
        setConfirmStop(item)
      } else {
        setRows((prev) =>
          prev.map((row) =>
            row.id === item.id ? { ...row, status: "ENABLED" } : row
          )
        )
        showToast("启用成功")
      }
      return
    }
    if (action === "delete") {
      setConfirmDelete(item)
    }
  }

  const confirmStopWarehouse = () => {
    if (!confirmStop) return
    if (confirmStop.hasInventory || confirmStop.storerooms.some((r) => r.hasInventory)) {
      showToast("该仓库下还有货物存放，请处理后再进行停用操作！")
      return
    }
    setRows((prev) =>
      prev.map((row) =>
        row.id === confirmStop.id ? { ...row, status: "DISABLED" } : row
      )
    )
    showToast("停用成功")
  }

  const confirmDeleteWarehouse = () => {
    if (!confirmDelete) return
    if (confirmDelete.status === "ENABLED") {
      showToast("该仓库处于启用状态，仅停用状态支持删除操作！")
      return
    }
    if (confirmDelete.storerooms.length > 0) {
      showToast("请先删除所有库房再进行仓库删除！")
      return
    }
    setRows((prev) => prev.filter((row) => row.id !== confirmDelete.id))
    showToast("删除成功")
  }

  return (
    <PrototypeAnnotationProvider
      title="仓库管理"
      documents={warehouseManagementDocuments}
      annotations={warehouseListAnnotations}
    >
      <VersionChangeProvider>
        <div className="space-y-4 p-6">
          <PrototypeAnnotationTarget annotationIds={["wh-list-page"]}>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">仓库管理</h1>
              <p className="text-sm text-muted-foreground">
                维护租户内仓库物理主档与空间拓扑；当前可使用仓库数 {WAREHOUSE_QUOTA.used.toLocaleString()} 个 | 最多 {WAREHOUSE_QUOTA.max.toLocaleString()} 个仓库同时使用
              </p>
            </div>
          </PrototypeAnnotationTarget>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              setAppliedFilters(draftFilters)
              setPage(1)
            }}
          >
            <WarehouseFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={() => {
                setAppliedFilters(draftFilters)
                setPage(1)
              }}
              onReset={() => {
                setAppliedFilters(DEFAULT_WAREHOUSE_FILTERS)
                setPage(1)
              }}
              onAdd={() => navigate(WAREHOUSE_ADD_PATH)}
              onDownloadTemplate={() =>
                showToast("已开始下载《仓库信息登记表》空白模版...")
              }
            />
          </form>

          <div className="space-y-4">
            <WarehouseTable
              data={pageData}
              page={currentPage}
              pageSize={pageSize}
              onAction={handleRowAction}
            />

            <WarningListPagination
              total={filtered.length}
              page={currentPage}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
              totalLabel="个仓库"
            />
          </div>
        </div>

        <ConfirmActionDialog
          open={Boolean(confirmStop)}
          title="确认停用"
          description="请确认是否停用该仓库？"
          onOpenChange={(open) => !open && setConfirmStop(null)}
          onConfirm={confirmStopWarehouse}
        />

        <ConfirmActionDialog
          open={Boolean(confirmDelete)}
          title="确认删除"
          description="删除后不可在前台恢复，是否继续？"
          confirmLabel="删除"
          onOpenChange={(open) => !open && setConfirmDelete(null)}
          onConfirm={confirmDeleteWarehouse}
        />

        {toastMessage ? (
          <div className="fixed bottom-6 left-1/2 z-[120] max-w-md -translate-x-1/2 rounded-md bg-foreground px-4 py-2 text-center text-sm text-background shadow-lg">
            {toastMessage}
          </div>
        ) : null}
      </VersionChangeProvider>
    </PrototypeAnnotationProvider>
  )
}
