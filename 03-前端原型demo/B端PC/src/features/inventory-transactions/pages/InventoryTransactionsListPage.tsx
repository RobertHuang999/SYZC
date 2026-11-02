import React, { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Download, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inventoryTransactionsDocuments } from "../documents/inventory-transactions-documents"
import { inventoryTransactionsAnnotations } from "../annotations/inventory-transactions.annotations"
import { InventoryTransactionStatsBar } from "../components/InventoryTransactionStatsBar"
import { InventoryTransactionFiltersPanel } from "../components/InventoryTransactionFiltersPanel"
import { InventoryTransactionsTable } from "../components/InventoryTransactionsTable"
import { TransactionPdfViewerDialog } from "../components/TransactionPdfViewerDialog"
import {
  SHARED_INVENTORY_TRANSACTIONS,
  type InventoryTransactionRecord,
} from "@/features/shared/mock/inventory-shared-seed"
import type { InventoryTransactionFilters } from "../domain/types"

export const InventoryTransactionsListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [pdfModalRecord, setPdfModalRecord] = useState<InventoryTransactionRecord | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const [filters, setFilters] = useState<InventoryTransactionFilters>({
    startDate: "2026-05-01",
    endDate: "2026-10-31",
    direction: "ALL",
    businessType: "",
    warehouseName: "",
    goodsSpec: "",
    ownerName: "",
    orderNo: "",
    lockedField: null,
    lockedValue: null,
  })

  // 监听 URL Query 参数穿透与锁定
  useEffect(() => {
    const whParam = searchParams.get("warehouse")
    const goodsParam = searchParams.get("goods")
    const ownerParam = searchParams.get("owner")

    if (whParam) {
      setFilters((prev) => ({
        ...prev,
        warehouseName: whParam,
        lockedField: "warehouse",
        lockedValue: whParam,
      }))
    } else if (goodsParam) {
      setFilters((prev) => ({
        ...prev,
        goodsSpec: goodsParam,
        lockedField: "goods",
        lockedValue: goodsParam,
      }))
    } else if (ownerParam) {
      setFilters((prev) => ({
        ...prev,
        ownerName: ownerParam,
        lockedField: "owner",
        lockedValue: ownerParam,
      }))
    }
  }, [searchParams])

  const handleUnlock = () => {
    setSearchParams({})
    setFilters((prev) => ({
      ...prev,
      lockedField: null,
      lockedValue: null,
      warehouseName: "",
      goodsSpec: "",
      ownerName: "",
    }))
  }

  const handleReset = () => {
    setFilters({
      startDate: "2026-05-01",
      endDate: "2026-10-31",
      direction: "ALL",
      businessType: "",
      warehouseName: filters.lockedField === "warehouse" ? filters.lockedValue || "" : "",
      goodsSpec: filters.lockedField === "goods" ? filters.lockedValue || "" : "",
      ownerName: filters.lockedField === "owner" ? filters.lockedValue || "" : "",
      orderNo: "",
      lockedField: filters.lockedField,
      lockedValue: filters.lockedValue,
    })
  }

  // 数据过滤
  const filteredData = useMemo(() => {
    return SHARED_INVENTORY_TRANSACTIONS.filter((item) => {
      if (filters.direction !== "ALL" && item.direction !== filters.direction) {
        return false
      }
      if (filters.businessType && item.businessType !== filters.businessType) {
        return false
      }
      if (filters.warehouseName && item.warehouseName !== filters.warehouseName) {
        return false
      }
      if (
        filters.goodsSpec &&
        !item.specification.toLowerCase().includes(filters.goodsSpec.toLowerCase())
      ) {
        return false
      }
      if (filters.ownerName && item.ownerName !== filters.ownerName) {
        return false
      }
      if (
        filters.orderNo &&
        !item.orderNo.toLowerCase().includes(filters.orderNo.toLowerCase())
      ) {
        return false
      }
      return true
    })
  }, [filters])

  // 看板条指标计算
  const stats = useMemo(() => {
    let inQty = 0
    let inCount = 0
    let outQty = 0
    let outCount = 0

    filteredData.forEach((item) => {
      if (item.direction === "IN") {
        inQty += item.changeQuantity
        inCount += 1
      } else {
        outQty += item.changeQuantity
        outCount += 1
      }
    })

    return {
      inTotalQty: inQty,
      inCount,
      outTotalQty: outQty,
      outCount,
    }
  }, [filteredData])

  const handleExportExcel = () => {
    const msg = `【模拟导出 Excel】正在导出库存流水明细清单（共 ${filteredData.length} 笔流水记录）...`
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  return (
    <PrototypeAnnotationProvider
      documents={inventoryTransactionsDocuments}
      annotations={inventoryTransactionsAnnotations}
    >
      <div className="space-y-4 p-6">
        {/* Toast 提示 */}
        {toastMessage && (
          <div className="fixed top-16 right-8 z-50 rounded-lg bg-slate-900 text-white px-4 py-2.5 shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 顶部标题与导出按钮 */}
        <PrototypeAnnotationTarget annotationIds={["tx-list-page"]}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                库存流水
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                仓储业务统一出入库单据合并台账与进出存全息追溯中枢，19 种业务流向全息归集。
              </p>
            </div>

            <Button
              size="sm"
              onClick={handleExportExcel}
              className="h-8 text-xs gap-1.5 bg-primary text-white"
            >
              <Download className="h-3.5 w-3.5" />
              导出明细 Excel
            </Button>
          </div>
        </PrototypeAnnotationTarget>

        {/* 顶部看板条 */}
        <PrototypeAnnotationTarget annotationIds={["tx-stats-bar"]}>
          <InventoryTransactionStatsBar
            inTotalQty={stats.inTotalQty}
            inCount={stats.inCount}
            outTotalQty={stats.outTotalQty}
            outCount={stats.outCount}
          />
        </PrototypeAnnotationTarget>

        {/* 筛选区与穿透锁定 */}
        <PrototypeAnnotationTarget annotationIds={["tx-penetrate-lock"]}>
          <InventoryTransactionFiltersPanel
            filters={filters}
            onChange={setFilters}
            onReset={handleReset}
            onUnlock={handleUnlock}
            onSearch={() => {}}
          />
        </PrototypeAnnotationTarget>

        {/* 流水表格 */}
        <PrototypeAnnotationTarget annotationIds={["tx-table", "tx-pdf-preview"]}>
          <InventoryTransactionsTable
            data={filteredData}
            onViewPdf={(rec) => setPdfModalRecord(rec)}
          />
        </PrototypeAnnotationTarget>

        {/* 单据 PDF 预览弹窗 */}
        <TransactionPdfViewerDialog
          open={!!pdfModalRecord}
          onOpenChange={(open) => !open && setPdfModalRecord(null)}
          record={pdfModalRecord}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}

