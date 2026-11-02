import React, { useState, useMemo } from "react"
import { Download, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  REPO_ROWS_MOCK,
  GOODS_ROWS_MOCK,
  OWNER_ROWS_MOCK,
} from "../mock/inventory-management.mock"
import { DEFAULT_EXPORT_RECORDS } from "../domain/constants"
import type {
  InventoryManagementFilters,
  InventoryViewMode,
  ExportRecordItem,
} from "../domain/types"

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
  const [exportRecords, setExportRecords] = useState<ExportRecordItem[]>(DEFAULT_EXPORT_RECORDS)
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

  // 批量导出
  const handleBatchExport = () => {
    const dimText =
      viewMode === "repo" ? "仓库视图" : viewMode === "goods" ? "货物视图" : "货主视图"
    const now = new Date()
    const timeStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`
    const newRecord: ExportRecordItem = {
      id: `EXP-${timeStr}`,
      fileName: `库存统计-${dimText}-${timeStr}.xlsx`,
      viewDimension: dimText,
      filterSummary: `业务时间: ${appliedFilters.startDate} 至 ${appliedFilters.endDate}`,
      recordCount: currentTotal,
      fileSize: "152.0 KB",
      creator: "李晓云",
      creatorOrg: "四川享宇科技有限公司",
      createTime: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`,
      status: "SUCCESS",
      downloadUrl: "#",
    }

    setExportRecords([newRecord, ...exportRecords])
    showToast(`已提交异步导出任务【${newRecord.fileName}】，请点击“导出记录”查看并下载！`)
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
          <div className="fixed top-16 right-8 z-50 rounded-lg bg-slate-900 text-white px-4 py-2.5 shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 顶部标题与导出按钮栏 */}
        <PrototypeAnnotationTarget annotationIds={["inv-mgmt-page"]}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                存货管理
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                仓储资产实时监控与核算中枢，汇总全平台物理库存、可用数量与冻结资产。
              </p>
            </div>

            <PrototypeAnnotationTarget annotationIds={["inv-mgmt-export"]}>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExportModalOpen(true)}
                  className="h-8 text-xs gap-1.5 border-slate-300"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5 text-slate-600" />
                  导出记录
                </Button>
                <Button
                  size="sm"
                  onClick={handleBatchExport}
                  className="h-8 text-xs gap-1.5 bg-[#e6a23c] hover:bg-[#d48e24] text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                  批量导出
                </Button>
              </div>
            </PrototypeAnnotationTarget>
          </div>
        </PrototypeAnnotationTarget>

        {/* 视图切换 Tabs（100% 对齐系统经典下划线高亮风格） */}
        <PrototypeAnnotationTarget annotationIds={["inv-mgmt-tabs"]}>
          <div className="flex items-center gap-8 border-b border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => handleTabChange("repo")}
              className={`pb-2 font-medium transition-colors cursor-pointer relative ${
                viewMode === "repo"
                  ? "text-[#e6a23c] font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              仓库
              {viewMode === "repo" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e6a23c]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("goods")}
              className={`pb-2 font-medium transition-colors cursor-pointer relative ${
                viewMode === "goods"
                  ? "text-[#e6a23c] font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              货物
              {viewMode === "goods" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e6a23c]" />
              )}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange("owner")}
              className={`pb-2 font-medium transition-colors cursor-pointer relative ${
                viewMode === "owner"
                  ? "text-[#e6a23c] font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              货主
              {viewMode === "owner" && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e6a23c]" />
              )}
            </button>
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
          />
        </PrototypeAnnotationTarget>

        {/* 列表区 Card + Table + Pagination */}
        <PrototypeAnnotationTarget annotationIds={["inv-mgmt-table", "inv-mgmt-ops"]}>
          <Card className="shadow-xs border-border">
            <CardContent className="p-4 space-y-4">
              {viewMode === "repo" && <InventoryRepoTable data={currentRepoSlice} />}
              {viewMode === "goods" && <InventoryGoodsTable data={currentGoodsSlice} />}
              {viewMode === "owner" && <InventoryOwnerTable data={currentOwnerSlice} />}

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
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        {/* 导出记录弹窗 */}
        <ExportRecordsDialog
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          records={exportRecords}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
