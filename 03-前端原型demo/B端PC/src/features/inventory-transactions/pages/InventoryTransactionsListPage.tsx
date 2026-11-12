import React, { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Download, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inventoryTransactionsDocuments } from "../documents/inventory-transactions-documents"
import { inventoryTransactionsAnnotations } from "../annotations/inventory-transactions.annotations"
import { InventoryTransactionStatsBar } from "../components/InventoryTransactionStatsBar"
import { InventoryTransactionFiltersPanel } from "../components/InventoryTransactionFiltersPanel"
import { InventoryTransactionsTable } from "../components/InventoryTransactionsTable"
import { InboundReceiptPdfDialog } from "@/features/inbound-records/components/InboundReceiptPdfDialog"
import { OutboundPdfDialog } from "@/features/outbound-records/components/OutboundPdfDialog"
import { ExportRecordsDialog } from "@/features/inventory-management/components/ExportRecordsDialog"
import { InventoryCrossExportDialog } from "@/features/shared/inventory-cross-export/InventoryCrossExportDialog"
import { useInventoryExportRecords } from "@/features/shared/inventory-cross-export/useInventoryExportRecords"
import { INVENTORY_CROSS_EXPORT_USER_TOAST } from "@/features/shared/inventory-cross-export/inventory-cross-export-ui-labels"
import type { ExportRecordItem } from "@/features/inventory-management/domain/types"
import {
  createDocumentExportRecord,
  DEFAULT_INBOUND_EXPORT_RECORDS,
  DEFAULT_OUTBOUND_EXPORT_RECORDS,
} from "@/features/shared/document-export-records"
import type { InboundRecord } from "@/features/inbound-records/domain/types"
import type { OutboundRecord } from "@/features/outbound-records/domain/types"
import {
  resolveInboundRecordFromTransaction,
  resolveOutboundRecordFromTransaction,
} from "../lib/resolve-source-record"
import {
  SHARED_INVENTORY_TRANSACTIONS,
  SHARED_OWNERS,
  type InventoryTransactionRecord,
} from "@/features/shared/mock/inventory-shared-seed"
import {
  GOODS_CASCADE_TREE,
  WAREHOUSE_CASCADE_TREE,
  goodsKeyOf,
  leafKeysOf,
  warehouseKeyOf,
} from "@/features/shared/lib/inventory-cascade"
import type { InventoryTransactionFilters } from "../domain/types"

const DEFAULT_FILTERS: InventoryTransactionFilters = {
  orderNo: "",
  startDate: "",
  endDate: "",
  ownerKeyword: "",
  warehouseKeys: [],
  goodsKeys: [],
  businessType: "",
  createTimeStart: "",
  createTimeEnd: "",
  lockedField: null,
  lockedValue: null,
}

/** 仓库参数 → 该仓库下全部「库房 · 分区」叶子键 */
function resolveWarehouseKeys(warehouseName: string): string[] {
  const node = WAREHOUSE_CASCADE_TREE.find((item) => item.name === warehouseName)
  return node ? leafKeysOf(node.children) : []
}

/** 货品参数 → 命中的规格叶子键 */
function resolveGoodsKeys(keyword: string): string[] {
  const keys: string[] = []
  GOODS_CASCADE_TREE.forEach((category) => {
    category.children?.forEach((variety) => {
      variety.children?.forEach((spec) => {
        if (
          spec.name.includes(keyword) ||
          keyword.includes(spec.name) ||
          keyword.includes(variety.name) ||
          variety.name.includes(keyword)
        ) {
          keys.push(spec.id)
        }
      })
    })
  })
  return keys
}

function inDateRange(value: string | undefined, start: string, end: string) {
  if (!value) return true
  const date = value.slice(0, 10)
  if (start && date < start) return false
  if (end && date > end) return false
  return true
}

export const InventoryTransactionsListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [inboundPdfTarget, setInboundPdfTarget] = useState<InboundRecord | null>(null)
  const [outboundPdfTarget, setOutboundPdfTarget] = useState<OutboundRecord | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [documentExportOpen, setDocumentExportOpen] = useState(false)
  const [documentExportRecords, setDocumentExportRecords] = useState<ExportRecordItem[]>(() => [
    ...DEFAULT_INBOUND_EXPORT_RECORDS,
    ...DEFAULT_OUTBOUND_EXPORT_RECORDS,
  ])
  const [crossExportOpen, setCrossExportOpen] = useState(false)
  const { records: exportRecords } = useInventoryExportRecords()

  const [draftFilters, setDraftFilters] = useState<InventoryTransactionFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<InventoryTransactionFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 监听 URL Query 参数穿透与锁定
  useEffect(() => {
    const whParam = searchParams.get("warehouse")
    const goodsParam = searchParams.get("goods")
    const ownerParam = searchParams.get("owner")

    let next: InventoryTransactionFilters | null = null
    if (whParam) {
      next = {
        ...DEFAULT_FILTERS,
        warehouseKeys: resolveWarehouseKeys(whParam),
        lockedField: "warehouse",
        lockedValue: whParam,
      }
    } else if (goodsParam) {
      next = {
        ...DEFAULT_FILTERS,
        goodsKeys: resolveGoodsKeys(goodsParam),
        lockedField: "goods",
        lockedValue: goodsParam,
      }
    } else if (ownerParam) {
      next = {
        ...DEFAULT_FILTERS,
        ownerKeyword: ownerParam,
        lockedField: "owner",
        lockedValue: ownerParam,
      }
    }

    if (next) {
      setDraftFilters(next)
      setAppliedFilters(next)
      setPage(1)
    }
  }, [searchParams])

  const filteredData = useMemo(() => {
    return SHARED_INVENTORY_TRANSACTIONS.filter((item) => {
      if (appliedFilters.orderNo && !item.businessNo.includes(appliedFilters.orderNo)) {
        return false
      }
      if (!inDateRange(item.businessDate, appliedFilters.startDate, appliedFilters.endDate)) {
        return false
      }
      if (appliedFilters.ownerKeyword) {
        const keyword = appliedFilters.ownerKeyword.toLowerCase()
        const owner = SHARED_OWNERS.find((entry) => entry.id === item.ownerId)
        const ownerHit =
          item.ownerName.toLowerCase().includes(keyword) ||
          (owner?.identifier ?? "").toLowerCase().includes(keyword) ||
          (owner?.identifierMasked ?? "").toLowerCase().includes(keyword)
        if (!ownerHit) {
          return false
        }
      }
      if (
        appliedFilters.warehouseKeys.length > 0 &&
        !appliedFilters.warehouseKeys.includes(warehouseKeyOf(item))
      ) {
        return false
      }
      if (
        appliedFilters.goodsKeys.length > 0 &&
        !appliedFilters.goodsKeys.includes(goodsKeyOf(item))
      ) {
        return false
      }
      if (appliedFilters.businessType && item.businessType !== appliedFilters.businessType) {
        return false
      }
      if (!inDateRange(item.createTime, appliedFilters.createTimeStart, appliedFilters.createTimeEnd)) {
        return false
      }
      return true
    })
  }, [appliedFilters])

  const currentSlice = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, page, pageSize])

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

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters })
    setPage(1)
  }

  const handleUnlock = () => {
    setSearchParams({})
    setDraftFilters(DEFAULT_FILTERS)
    setAppliedFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const handleReset = () => {
    const resetValues: InventoryTransactionFilters = {
      ...DEFAULT_FILTERS,
      lockedField: appliedFilters.lockedField,
      lockedValue: appliedFilters.lockedValue,
    }
    if (appliedFilters.lockedField === "warehouse") {
      resetValues.warehouseKeys = resolveWarehouseKeys(appliedFilters.lockedValue || "")
    }
    if (appliedFilters.lockedField === "goods") {
      resetValues.goodsKeys = resolveGoodsKeys(appliedFilters.lockedValue || "")
    }
    if (appliedFilters.lockedField === "owner") {
      resetValues.ownerKeyword = appliedFilters.lockedValue || ""
    }
    setDraftFilters(resetValues)
    setAppliedFilters(resetValues)
    setPage(1)
  }

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2800)
  }

  const handleViewPdf = (record: InventoryTransactionRecord) => {
    if (record.direction === "IN") {
      setOutboundPdfTarget(null)
      setInboundPdfTarget(resolveInboundRecordFromTransaction(record))
      return
    }
    setInboundPdfTarget(null)
    setOutboundPdfTarget(resolveOutboundRecordFromTransaction(record))
  }

  const handleExportRecord = (record: InventoryTransactionRecord) => {
    const inbound = record.direction === "IN"
    const inboundSource = inbound ? resolveInboundRecordFromTransaction(record) : null
    const outboundSource = inbound ? null : resolveOutboundRecordFromTransaction(record)
    const task = createDocumentExportRecord({
      kind: inbound ? "入库堆放明细" : "出库扣减明细",
      orderNo: inboundSource?.orderNo ?? outboundSource?.orderNo ?? record.orderNo,
      recordCount: inboundSource
        ? inboundSource.goodsNames.length || 1
        : outboundSource?.goodsList.length || outboundSource?.categoryCount || 1,
      creator: inboundSource?.createByName ?? outboundSource?.createdByName,
      creatorOrg: inboundSource?.createOrgName ?? outboundSource?.createdByOrg,
      status: "GENERATING",
    })
    setDocumentExportRecords((current) => [task, ...current])
    setDocumentExportOpen(true)
    showToast(INVENTORY_CROSS_EXPORT_USER_TOAST)
    window.setTimeout(() => {
      setDocumentExportRecords((current) =>
        current.map((row) =>
          row.id === task.id ? { ...row, status: "SUCCESS", fileSize: "86.4 KB" } : row
        )
      )
    }, 2200)
  }

  return (
    <PrototypeAnnotationProvider
      documents={inventoryTransactionsDocuments}
      annotations={inventoryTransactionsAnnotations}
    >
      <div className="space-y-4 p-6">
        {/* Toast 提示 */}
        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}

        {/* 顶部标题 */}
        <PrototypeAnnotationTarget annotationIds={["tx-list-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">库存流水</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              仓储业务统一出入库单据合并台账与进出存全息追溯中枢，19 种业务流向全息归集。
            </p>
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
          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleSearch()
            }}
          >
            <InventoryTransactionFiltersPanel
              filters={draftFilters}
              onChange={setDraftFilters}
              onReset={handleReset}
              onUnlock={handleUnlock}
              onSearch={handleSearch}
              extraActions={
                <PrototypeAnnotationTarget annotationIds={["inv-cross-export-actions"]}>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExportModalOpen(true)}
                    >
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
          </form>
        </PrototypeAnnotationTarget>

        {/* 流水表格 */}
        <PrototypeAnnotationTarget annotationIds={["tx-table", "tx-pdf-preview"]}>
          <div className="space-y-3">
            <InventoryTransactionsTable
              data={currentSlice}
              page={page}
              pageSize={pageSize}
              onViewPdf={handleViewPdf}
              onExportRecord={handleExportRecord}
            />

            <WarningListPagination
              total={filteredData.length}
              page={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize)
                setPage(1)
              }}
            />
          </div>
        </PrototypeAnnotationTarget>

        <InboundReceiptPdfDialog
          open={inboundPdfTarget !== null}
          record={inboundPdfTarget}
          onClose={() => setInboundPdfTarget(null)}
          onSuccess={showToast}
        />
        <OutboundPdfDialog
          open={outboundPdfTarget !== null}
          record={outboundPdfTarget}
          onClose={() => setOutboundPdfTarget(null)}
          onSuccess={showToast}
        />
        <ExportRecordsDialog
          open={documentExportOpen}
          onOpenChange={setDocumentExportOpen}
          records={documentExportRecords}
        />

        <PrototypeAnnotationTarget annotationIds={["inv-cross-export-dialog"]}>
          <InventoryCrossExportDialog
            open={crossExportOpen}
            onOpenChange={setCrossExportOpen}
            sourceMenu="库存流水"
            onSubmitted={() => {
              setToastMessage(INVENTORY_CROSS_EXPORT_USER_TOAST)
              setTimeout(() => setToastMessage(null), 4000)
            }}
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
