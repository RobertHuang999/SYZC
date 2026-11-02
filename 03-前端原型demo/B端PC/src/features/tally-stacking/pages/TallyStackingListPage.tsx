import React, { useState, useMemo } from "react"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { tallyStackingDocuments } from "../documents/tally-stacking-documents"
import { tallyStackingAnnotations } from "../annotations/tally-stacking.annotations"
import { TallyFiltersPanel } from "../components/TallyFiltersPanel"
import { TallyStackingTable } from "../components/TallyStackingTable"
import { TallyQrCodeDialog } from "../components/TallyQrCodeDialog"
import { SHARED_TALLY_STACKING, type TallyStackingMainItem } from "@/features/shared/mock/inventory-shared-seed"
import type { TallyStackingFilters } from "../domain/types"

export const TallyStackingListPage: React.FC = () => {
  const [filters, setFilters] = useState<TallyStackingFilters>({
    inboundOrderNo: "",
    warehouseName: "",
    goodsCategory: "",
    goodsSpec: "",
    ownerName: "",
  })

  const [qrModalItem, setQrModalItem] = useState<TallyStackingMainItem | null>(null)

  const filteredData = useMemo(() => {
    return SHARED_TALLY_STACKING.filter((item) => {
      if (
        filters.inboundOrderNo &&
        !item.inboundOrderNo.toLowerCase().includes(filters.inboundOrderNo.toLowerCase())
      ) {
        return false
      }
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
      return true
    })
  }, [filters])

  const handleReset = () => {
    setFilters({
      inboundOrderNo: "",
      warehouseName: "",
      goodsCategory: "",
      goodsSpec: "",
      ownerName: "",
    })
  }

  return (
    <PrototypeAnnotationProvider
      documents={tallyStackingDocuments}
      annotations={tallyStackingAnnotations}
    >
      <div className="space-y-4 p-6">
        {/* 顶部标题栏 */}
        <PrototypeAnnotationTarget annotationIds={["tally-page"]}>
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              理货堆放
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              仓储资产物理空间堆放与库位精细化核算中枢，以【入库单 × 货品】主码为汇总，以【库房-分区-垛位】子码为物理承载。
            </p>
          </div>
        </PrototypeAnnotationTarget>

        {/* 筛选区 */}
        <PrototypeAnnotationTarget annotationIds={["tally-filters"]}>
          <TallyFiltersPanel
            filters={filters}
            onChange={setFilters}
            onReset={handleReset}
            onSearch={() => {}}
          />
        </PrototypeAnnotationTarget>

        {/* 主子码展开表格 */}
        <PrototypeAnnotationTarget annotationIds={["tally-virtual", "tally-qr"]}>
          <TallyStackingTable
            data={filteredData}
            onViewQr={(item) => setQrModalItem(item)}
          />
        </PrototypeAnnotationTarget>

        {/* 二维码防伪弹窗 */}
        <TallyQrCodeDialog
          open={!!qrModalItem}
          onOpenChange={(open) => !open && setQrModalItem(null)}
          item={qrModalItem}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}

