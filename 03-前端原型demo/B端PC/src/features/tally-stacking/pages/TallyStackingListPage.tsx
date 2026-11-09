import React, { useState, useMemo } from "react"
import { Download, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { tallyStackingDocuments } from "../documents/tally-stacking-documents"
import { tallyStackingAnnotations } from "../annotations/tally-stacking.annotations"
import { TallyFiltersPanel } from "../components/TallyFiltersPanel"
import { TallyStackingTable } from "../components/TallyStackingTable"
import { TallyQrCodeDialog } from "../components/TallyQrCodeDialog"
import { ExportRecordsDialog } from "@/features/inventory-management/components/ExportRecordsDialog"
import { SHARED_TALLY_STACKING, type TallyStackingMainItem } from "@/features/shared/mock/inventory-shared-seed"
import type { ExportRecordItem } from "@/features/inventory-management/domain/types"
import type { TallyStackingFilters } from "../domain/types"

const DEFAULT_FILTERS: TallyStackingFilters = {
  inboundOrderNo: "",
  warehouseName: "",
  goodsCategory: "",
  goodsSpec: "",
  ownerName: "",
}

function nowStamp() {
  const now = new Date()
  const pad = (value: number) => String(value).padStart(2, "0")
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  return { date, time, compact: `${date.replace(/-/g, "")}${time.replace(/:/g, "")}` }
}

export const TallyStackingListPage: React.FC = () => {
  const [draftFilters, setDraftFilters] = useState<TallyStackingFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState<TallyStackingFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [qrModalItem, setQrModalItem] = useState<TallyStackingMainItem | null>(null)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [exportRecords, setExportRecords] = useState<ExportRecordItem[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const filteredData = useMemo(() => {
    return SHARED_TALLY_STACKING.filter((item) => {
      if (
        appliedFilters.inboundOrderNo &&
        !item.inboundOrderNo.toLowerCase().includes(appliedFilters.inboundOrderNo.toLowerCase())
      ) {
        return false
      }
      if (appliedFilters.warehouseName && item.warehouseName !== appliedFilters.warehouseName) {
        return false
      }
      if (appliedFilters.goodsCategory && item.category !== appliedFilters.goodsCategory) {
        return false
      }
      if (
        appliedFilters.goodsSpec &&
        !item.specification.toLowerCase().includes(appliedFilters.goodsSpec.toLowerCase())
      ) {
        return false
      }
      if (appliedFilters.ownerName && item.ownerName !== appliedFilters.ownerName) {
        return false
      }
      return true
    })
  }, [appliedFilters])

  const currentSlice = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, page, pageSize])

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const handleBatchExport = () => {
    const stamp = nowStamp()
    const record: ExportRecordItem = {
      id: `EXP-${stamp.compact}`,
      fileName: `理货堆放批次-${stamp.compact}.xlsx`,
      viewDimension: "理货堆放",
      filterSummary: `筛选后共 ${filteredData.length} 条批次`,
      recordCount: filteredData.length,
      fileSize: "86.4 KB",
      creator: "李晓云",
      creatorOrg: "四川享宇科技有限公司",
      createTime: `${stamp.date} ${stamp.time}`,
      status: "SUCCESS",
      downloadUrl: "#",
    }
    setExportRecords((current) => [record, ...current])
    showToast(`已提交异步导出任务【${record.fileName}】，请点击「导出记录」查看并下载！`)
  }

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters })
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_FILTERS)
    setAppliedFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  return (
    <PrototypeAnnotationProvider
      documents={tallyStackingDocuments}
      annotations={tallyStackingAnnotations}
    >
      <div className="space-y-4 p-6">
        {/* Toast 提示 */}
        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}

        {/* 顶部标题栏 */}
        <PrototypeAnnotationTarget annotationIds={["tally-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">理货堆放</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              仓储资产物理空间堆放与库位精细化核算中枢，以【入库单 × 货品】主码为汇总，以【库房-分区-垛位】子码为物理承载。
            </p>
          </div>
        </PrototypeAnnotationTarget>

        {/* 筛选区 */}
        <PrototypeAnnotationTarget annotationIds={["tally-filters"]}>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleSearch()
            }}
          >
            <TallyFiltersPanel
              filters={draftFilters}
              onChange={setDraftFilters}
              onReset={handleReset}
              onSearch={handleSearch}
              extraActions={
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExportModalOpen(true)}
                  >
                    <FileSpreadsheet className="size-4" />
                    导出记录
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleBatchExport}>
                    <Download className="size-4" />
                    批量导出
                  </Button>
                </>
              }
            />
          </form>
        </PrototypeAnnotationTarget>

        {/* 主子码展开表格 */}
        <PrototypeAnnotationTarget annotationIds={["tally-virtual", "tally-qr"]}>
          <div className="space-y-3">
            <TallyStackingTable
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

        {/* 二维码防伪弹窗 */}
        <TallyQrCodeDialog
          open={!!qrModalItem}
          onOpenChange={(open) => !open && setQrModalItem(null)}
          item={qrModalItem}
        />

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
