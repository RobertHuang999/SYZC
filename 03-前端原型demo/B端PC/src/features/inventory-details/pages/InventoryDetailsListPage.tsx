import React, { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Download, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inventoryDetailsDocuments } from "../documents/inventory-details-documents"
import { inventoryDetailsListAnnotations } from "../annotations/inventory-details-list.annotations"
import { InventoryDetailFiltersPanel } from "../components/InventoryDetailFiltersPanel"
import { InventoryDetailsTable } from "../components/InventoryDetailsTable"
import { InventoryBarcodeQrDialog } from "../components/InventoryBarcodeQrDialog"
import { ExportRecordsDialog } from "@/features/inventory-management/components/ExportRecordsDialog"
import { InventoryCrossExportDialog } from "@/features/shared/inventory-cross-export/InventoryCrossExportDialog"
import { useInventoryExportRecords } from "@/features/shared/inventory-cross-export/useInventoryExportRecords"
import { INVENTORY_CROSS_EXPORT_USER_TOAST } from "@/features/shared/inventory-cross-export/inventory-cross-export-ui-labels"
import { SHARED_INVENTORY_DETAILS, type InventoryDetailRecord } from "@/features/shared/mock/inventory-shared-seed"
import {
  GOODS_CASCADE_TREE,
  WAREHOUSE_CASCADE_TREE,
  goodsKeyOf,
  leafKeysOf,
  warehouseKeyOf,
} from "@/features/shared/lib/inventory-cascade"
import type { InventoryDetailFilters } from "../domain/types"

const DEFAULT_FILTERS: InventoryDetailFilters = {
  inboundOrderNo: "",
  inboundDateStart: "",
  inboundDateEnd: "",
  ownerKeyword: "",
  inboundType: "",
  warehouseKeys: [],
  goodsKeys: [],
  goodsStatus: "",
  creator: "",
  createTimeStart: "",
  createTimeEnd: "",
  onlyInStock: true,
  lockedField: null,
  lockedValue: null,
}

/** 仓库参数 → 该仓库下全部「库房 · 分区」叶子键 */
function resolveWarehouseKeys(warehouseName: string): string[] {
  const node = WAREHOUSE_CASCADE_TREE.find((item) => item.name === warehouseName)
  return node ? leafKeysOf(node.children) : []
}

/** 货品参数 → 命中的规格叶子键（按大类 / 品类 / 规格逐级模糊匹配） */
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

export const InventoryDetailsListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [draftFilters, setDraftFilters] = useState<InventoryDetailFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<InventoryDetailFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [qrModalItem, setQrModalItem] = useState<InventoryDetailRecord | null>(null)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [crossExportOpen, setCrossExportOpen] = useState(false)
  const { records: exportRecords } = useInventoryExportRecords()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 监听 URL Query 参数穿透与锁定
  useEffect(() => {
    const whParam = searchParams.get("warehouse")
    const goodsParam = searchParams.get("goods")
    const ownerParam = searchParams.get("owner")

    let next: InventoryDetailFilters | null = null
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
    return SHARED_INVENTORY_DETAILS.filter((item) => {
      // 默认只看仍有库存（可用或冻结大于 0）的货位
      if (
        appliedFilters.onlyInStock &&
        item.availableQuantity <= 0 &&
        item.frozenQuantity <= 0
      ) {
        return false
      }
      if (
        appliedFilters.inboundOrderNo &&
        !item.inboundOrderNo.includes(appliedFilters.inboundOrderNo)
      ) {
        return false
      }
      if (!inDateRange(item.inboundDate, appliedFilters.inboundDateStart, appliedFilters.inboundDateEnd)) {
        return false
      }
      if (appliedFilters.ownerKeyword) {
        const keyword = appliedFilters.ownerKeyword.toLowerCase()
        if (
          !item.ownerName.toLowerCase().includes(keyword) &&
          !item.ownerIdentifierMasked.toLowerCase().includes(keyword)
        ) {
          return false
        }
      }
      if (appliedFilters.inboundType && item.inboundType !== appliedFilters.inboundType) {
        return false
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
      if (appliedFilters.goodsStatus && item.goodsStatus !== appliedFilters.goodsStatus) {
        return false
      }
      if (appliedFilters.creator && item.creator !== appliedFilters.creator) {
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
    const resetValues: InventoryDetailFilters = {
      ...DEFAULT_FILTERS,
      lockedField: appliedFilters.lockedField,
      lockedValue: appliedFilters.lockedValue,
    }
    // 穿透锁定条件不随重置解除
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
    setTimeout(() => setToastMessage(null), 4000)
  }

  return (
    <PrototypeAnnotationProvider
      documents={inventoryDetailsDocuments}
      annotations={inventoryDetailsListAnnotations}
    >
      <div className="space-y-4 p-6">
        {/* Toast 提示 */}
        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}

        {/* 顶部标题栏 */}
        <PrototypeAnnotationTarget annotationIds={["inv-details-list-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">库存明细</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              仓储资产最细粒度物理货位查询与批次全生命周期追溯中枢，四级空间拓扑精确定位。
            </p>
          </div>
        </PrototypeAnnotationTarget>

        {/* 筛选区与穿透锁定 */}
        <PrototypeAnnotationTarget annotationIds={["inv-details-penetrate-lock"]}>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleSearch()
            }}
          >
            <InventoryDetailFiltersPanel
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

        {/* 明细表格 */}
        <PrototypeAnnotationTarget annotationIds={["inv-details-table", "inv-details-qr", "inv-details-jump"]}>
          <div className="space-y-3">
            <InventoryDetailsTable
              data={currentSlice}
              page={page}
              pageSize={pageSize}
              onViewQr={(item) => setQrModalItem(item)}
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

        {/* 二维码弹窗 */}
        <InventoryBarcodeQrDialog
          open={!!qrModalItem}
          onOpenChange={(open) => !open && setQrModalItem(null)}
          item={qrModalItem}
        />

        <PrototypeAnnotationTarget annotationIds={["inv-cross-export-dialog"]}>
          <InventoryCrossExportDialog
            open={crossExportOpen}
            onOpenChange={setCrossExportOpen}
            sourceMenu="库存明细"
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
