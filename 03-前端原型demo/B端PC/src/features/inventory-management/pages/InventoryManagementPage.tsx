import React, { useState, useMemo } from "react"
import { Download, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inventoryManagementDocuments } from "../documents/inventory-management-documents"
import { inventoryManagementAnnotations } from "../annotations/inventory-management.annotations"
import { InventoryMetricCards } from "../components/InventoryMetricCards"
import { InventoryFiltersPanel } from "../components/InventoryFiltersPanel"
import { InventoryRepoTable } from "../components/InventoryRepoTable"
import { InventoryGoodsTable } from "../components/InventoryGoodsTable"
import { InventoryOwnerTable } from "../components/InventoryOwnerTable"
import { ExportRecordsDialog } from "../components/ExportRecordsDialog"
import { InventoryCrossExportDialog } from "@/features/shared/inventory-cross-export/InventoryCrossExportDialog"
import { useInventoryExportRecords } from "@/features/shared/inventory-cross-export/useInventoryExportRecords"
import { INVENTORY_CROSS_EXPORT_USER_TOAST } from "@/features/shared/inventory-cross-export/inventory-cross-export-ui-labels"
import {
  REPO_ROWS_MOCK,
  GOODS_ROWS_MOCK,
  OWNER_ROWS_MOCK,
} from "../mock/inventory-management.mock"
import type { InventoryManagementFilters, InventoryViewMode } from "../domain/types"

const DEFAULT_FILTERS: InventoryManagementFilters = {
  viewMode: "repo",
  startDate: "2026-11-02",
  endDate: "2026-11-02",
  warehouseName: "",
  goodsCategory: "",
  goodsVariety: "",
  goodsSpec: "",
  ownerName: "",
}

export const InventoryManagementPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<InventoryViewMode>("repo")
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [crossExportOpen, setCrossExportOpen] = useState(false)
  const { records: exportRecords } = useInventoryExportRecords()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 翻页状态
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 草稿态（draft）与生效态（applied）分离规范
  const [draftFilters, setDraftFilters] = useState<InventoryManagementFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<InventoryManagementFilters>(DEFAULT_FILTERS)

  // 过滤后的仓库列表
  const filteredRepoData = useMemo(() => {
    return REPO_ROWS_MOCK.filter((row) => {
      if (appliedFilters.warehouseName && !row.warehouseName.includes(appliedFilters.warehouseName)) {
        return false
      }
      return true
    })
  }, [appliedFilters.warehouseName])

  // 过滤后的货物列表
  const filteredGoodsData = useMemo(() => {
    return GOODS_ROWS_MOCK.filter((row) => {
      if (appliedFilters.goodsSpec && !row.goodsName.includes(appliedFilters.goodsSpec)) {
        return false
      }
      if (appliedFilters.goodsCategory && !row.goodsName.includes(appliedFilters.goodsCategory)) {
        return false
      }
      if (appliedFilters.goodsVariety && !row.goodsName.includes(appliedFilters.goodsVariety)) {
        return false
      }
      return true
    })
  }, [appliedFilters.goodsSpec, appliedFilters.goodsCategory, appliedFilters.goodsVariety])

  // 过滤后的货主列表
  const filteredOwnerData = useMemo(() => {
    return OWNER_ROWS_MOCK.filter((row) => {
      if (
        appliedFilters.ownerName &&
        !row.ownerName.includes(appliedFilters.ownerName) &&
        !row.ownerCode.includes(appliedFilters.ownerName)
      ) {
        return false
      }
      return true
    })
  }, [appliedFilters.ownerName])

  // 分页截取
  const currentRepoSlice = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRepoData.slice(start, start + pageSize)
  }, [filteredRepoData, page, pageSize])

  const currentGoodsSlice = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredGoodsData.slice(start, start + pageSize)
  }, [filteredGoodsData, page, pageSize])

  const currentOwnerSlice = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredOwnerData.slice(start, start + pageSize)
  }, [filteredOwnerData, page, pageSize])

  const currentTotal =
    viewMode === "repo"
      ? filteredRepoData.length
      : viewMode === "goods"
      ? filteredGoodsData.length
      : filteredOwnerData.length

  const handleTabChange = (mode: InventoryViewMode) => {
    setViewMode(mode)
    setDraftFilters((prev) => ({ ...prev, viewMode: mode }))
    setAppliedFilters((prev) => ({ ...prev, viewMode: mode }))
    setPage(1)
  }

  // 点击查询：生效草稿并回到第 1 页
  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters })
    setPage(1)
  }

  // 点击重置：清空草稿与生效态并回到第 1 页
  const handleReset = () => {
    const resetValues: InventoryManagementFilters = {
      ...DEFAULT_FILTERS,
      viewMode,
    }
    setDraftFilters(resetValues)
    setAppliedFilters(resetValues)
    setPage(1)
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  return (
    <PrototypeAnnotationProvider
      documents={inventoryManagementDocuments}
      annotations={inventoryManagementAnnotations}
    >
      <div className="space-y-4 p-6">
        {/* Toast 提示 */}
        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}

        {/* 顶部标题 */}
        <PrototypeAnnotationTarget annotationIds={["inv-mgmt-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              存货管理
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              仓储资产实时监控与核算中枢，汇总全平台物理库存、可用数量与冻结资产。
            </p>
          </div>
        </PrototypeAnnotationTarget>

        {/* 视图切换页签（橙色只用于页签激活，符合色彩规范） */}
        <PrototypeAnnotationTarget annotationIds={["inv-mgmt-tabs"]}>
          <div className="flex items-center gap-8 border-b border-border text-sm">
            {(
              [
                { key: "repo", label: "仓库" },
                { key: "goods", label: "货物" },
                { key: "owner", label: "货主" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`relative cursor-pointer pb-2 transition-colors ${
                  viewMode === tab.key
                    ? "font-semibold text-[#165dff]"
                    : "font-normal text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {viewMode === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#165dff]" />
                )}
              </button>
            ))}
          </div>
        </PrototypeAnnotationTarget>

        {/* 顶部动态指标卡片 */}
        <PrototypeAnnotationTarget annotationIds={["inv-mgmt-metrics"]}>
          <InventoryMetricCards viewMode={viewMode} />
        </PrototypeAnnotationTarget>

        {/* 筛选区（对齐原型规范 Card + WarningFilterHeader + FilterField） */}
        <PrototypeAnnotationTarget annotationIds={["inv-mgmt-filters"]}>
          <InventoryFiltersPanel
            viewMode={viewMode}
            filters={draftFilters}
            onChange={setDraftFilters}
            onReset={handleReset}
            onSearch={handleSearch}
            extraActions={
              <PrototypeAnnotationTarget annotationIds={["inv-cross-export-actions"]}>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setExportModalOpen(true)}>
                    <FileSpreadsheet className="size-4" />
                    导出记录
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCrossExportOpen(true)}>
                    <Download className="size-4" />
                    批量导出
                  </Button>
                </div>
              </PrototypeAnnotationTarget>
            }
          />
        </PrototypeAnnotationTarget>

        {/* 列表区：标准表格 + 吸底分页 */}
        <PrototypeAnnotationTarget annotationIds={["inv-mgmt-table", "inv-mgmt-ops"]}>
          <div className="space-y-3">
            {viewMode === "repo" && (
              <InventoryRepoTable data={currentRepoSlice} page={page} pageSize={pageSize} />
            )}
            {viewMode === "goods" && (
              <InventoryGoodsTable data={currentGoodsSlice} page={page} pageSize={pageSize} />
            )}
            {viewMode === "owner" && (
              <InventoryOwnerTable data={currentOwnerSlice} page={page} pageSize={pageSize} />
            )}

            {/* 标准分页器 */}
            <WarningListPagination
              total={currentTotal}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize)
                setPage(1)
              }}
              pageSizes={[10, 20, 50]}
              totalLabel="条"
            />
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["inv-cross-export-dialog"]}>
          <InventoryCrossExportDialog
            open={crossExportOpen}
            onOpenChange={setCrossExportOpen}
            sourceMenu="存货管理"
            onSubmitted={() => showToast(INVENTORY_CROSS_EXPORT_USER_TOAST)}
          />
        </PrototypeAnnotationTarget>

        <ExportRecordsDialog
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          records={exportRecords}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
