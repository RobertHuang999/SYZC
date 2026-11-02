import React, { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inventoryDetailsDocuments } from "../documents/inventory-details-documents"
import { inventoryDetailsListAnnotations } from "../annotations/inventory-details-list.annotations"
import { InventoryDetailFiltersPanel } from "../components/InventoryDetailFiltersPanel"
import { InventoryDetailsTable } from "../components/InventoryDetailsTable"
import { InventoryBarcodeQrDialog } from "../components/InventoryBarcodeQrDialog"
import { SHARED_INVENTORY_DETAILS, type InventoryDetailRecord } from "@/features/shared/mock/inventory-shared-seed"
import type { InventoryDetailFilters } from "../domain/types"

export const InventoryDetailsListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [filters, setFilters] = useState<InventoryDetailFilters>({
    warehouseName: "",
    houseName: "",
    partitionName: "",
    goodsCategory: "",
    goodsSpec: "",
    ownerName: "",
    barcode: "",
    status: "ALL",
    lockedField: null,
    lockedValue: null,
  })

  const [qrModalItem, setQrModalItem] = useState<InventoryDetailRecord | null>(null)

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
      warehouseName: filters.lockedField === "warehouse" ? filters.lockedValue || "" : "",
      houseName: "",
      partitionName: "",
      goodsCategory: "",
      goodsSpec: filters.lockedField === "goods" ? filters.lockedValue || "" : "",
      ownerName: filters.lockedField === "owner" ? filters.lockedValue || "" : "",
      barcode: "",
      status: "ALL",
      lockedField: filters.lockedField,
      lockedValue: filters.lockedValue,
    })
  }

  const filteredData = useMemo(() => {
    return SHARED_INVENTORY_DETAILS.filter((item) => {
      if (filters.warehouseName && item.warehouseName !== filters.warehouseName) {
        return false
      }
      if (filters.goodsCategory && item.category !== filters.goodsCategory) {
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
        filters.barcode &&
        !item.barcode.toLowerCase().includes(filters.barcode.toLowerCase())
      ) {
        return false
      }
      if (filters.status && filters.status !== "ALL" && item.status !== filters.status) {
        return false
      }
      return true
    })
  }, [filters])

  return (
    <PrototypeAnnotationProvider
      documents={inventoryDetailsDocuments}
      annotations={inventoryDetailsListAnnotations}
    >
      <div className="space-y-4 p-6">
        {/* 顶部标题栏 */}
        <PrototypeAnnotationTarget annotationIds={["inv-details-list-page"]}>
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              库存明细
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              仓储资产最细粒度物理货位查询与批次全生命周期追溯中枢，四级空间拓扑精确定位。
            </p>
          </div>
        </PrototypeAnnotationTarget>

        {/* 筛选区与穿透锁定 */}
        <PrototypeAnnotationTarget annotationIds={["inv-details-penetrate-lock"]}>
          <InventoryDetailFiltersPanel
            filters={filters}
            onChange={setFilters}
            onReset={handleReset}
            onUnlock={handleUnlock}
            onSearch={() => {}}
          />
        </PrototypeAnnotationTarget>

        {/* 明细表格 */}
        <PrototypeAnnotationTarget annotationIds={["inv-details-table", "inv-details-qr", "inv-details-jump"]}>
          <InventoryDetailsTable
            data={filteredData}
            onViewQr={(item) => setQrModalItem(item)}
          />
        </PrototypeAnnotationTarget>

        {/* 二维码弹窗 */}
        <InventoryBarcodeQrDialog
          open={!!qrModalItem}
          onOpenChange={(open) => !open && setQrModalItem(null)}
          item={qrModalItem}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}

