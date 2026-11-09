import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { PageHeader } from "@/shared/components/PageHeader"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { abnormalRecordDocuments } from "../documents/abnormal-record-documents"
import { abnormalRecordListAnnotations } from "../annotations/abnormal-record-list.annotations"
import { AbnormalRecordFiltersPanel } from "../components/AbnormalRecordFiltersPanel"
import { AbnormalRecordTable } from "../components/AbnormalRecordTable"
import { AbnormalGoodsPickerModal } from "../components/AbnormalGoodsPickerModal"
import { AbnormalExportRecordsDialog } from "../components/AbnormalExportRecordsDialog"
import {
  DEFAULT_ABNORMAL_RECORD_FILTERS,
  ABNORMAL_RECORD_ADD_PATH,
  abnormalRecordDetailPath,
  PAGE_SIZE,
} from "../domain/constants"
import type { AbnormalRecord, AbnormalRecordFilters } from "../domain/types"
import type { InStockItem } from "../domain/form-types"
import { filterAbnormalRecords, paginateAbnormalRecords } from "../lib/list-utils"
import { abnormalRecordsMock } from "../mock/abnormal-records.mock"

export function InventoryAbnormalListPage() {
  const navigate = useNavigate()
  const [rows] = useState<AbnormalRecord[]>(() => [...abnormalRecordsMock])
  const [draftFilters, setDraftFilters] = useState<AbnormalRecordFilters>(
    DEFAULT_ABNORMAL_RECORD_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<AbnormalRecordFilters>(
    DEFAULT_ABNORMAL_RECORD_FILTERS
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)

  // 弹窗状态
  const [pickerOpen, setPickerOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  // 筛选与分页
  const filteredList = useMemo(() => {
    return filterAbnormalRecords(rows, appliedFilters)
  }, [rows, appliedFilters])

  const pagedList = useMemo(() => {
    return paginateAbnormalRecords(filteredList, page, pageSize)
  }, [filteredList, page, pageSize])

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters })
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_ABNORMAL_RECORD_FILTERS)
    setAppliedFilters(DEFAULT_ABNORMAL_RECORD_FILTERS)
    setPage(1)
  }

  const handleSelectStock = (item: InStockItem) => {
    // 携带 stockId 跳转至新增异动申请页
    navigate(`${ABNORMAL_RECORD_ADD_PATH}?stockId=${encodeURIComponent(item.stockId)}`)
  }

  const handleViewDetail = (item: AbnormalRecord) => {
    navigate(abnormalRecordDetailPath(item.id))
  }

  return (
    <PrototypeAnnotationProvider
      title="货物异动记录"
      documents={abnormalRecordDocuments}
      annotations={abnormalRecordListAnnotations}
    >
      <div className="space-y-4 p-6 min-h-[calc(100vh-64px)] font-sans">
        {/* 页面顶栏 */}
        <PrototypeAnnotationTarget annotationIds={["abnormal-record-page"]}>
          <PageHeader
            title="异动记录"
            description="仓储业务差异调整、实物损溢核算与全生命周期审计台账。纳管盘盈、盘亏、损耗调账凭据，实物账目联动核平。"
          />
        </PrototypeAnnotationTarget>

        {/* 筛选区 */}
        <PrototypeAnnotationTarget annotationIds={["abnormal-record-filter"]}>
          <AbnormalRecordFiltersPanel
            filters={draftFilters}
            onChange={setDraftFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            onExport={() => setExportOpen(true)}
            onAdd={() => setPickerOpen(true)}
          />
        </PrototypeAnnotationTarget>

        {/* 列表表格 */}
        <PrototypeAnnotationTarget annotationIds={["abnormal-record-table"]}>
          <div className="space-y-3">
            <AbnormalRecordTable
              records={pagedList}
              onViewDetail={handleViewDetail}
            />

            {/* 分页器 */}
            <div className="sticky bottom-0 z-30 bg-background pt-2">
              <WarningListPagination
                page={page}
                total={filteredList.length}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize)
                  setPage(1)
                }}
              />
            </div>
          </div>
        </PrototypeAnnotationTarget>

        {/* 新增存货选择弹窗 */}
        <AbnormalGoodsPickerModal
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={handleSelectStock}
        />

        {/* 导出弹窗 */}
        <AbnormalExportRecordsDialog
          open={exportOpen}
          onClose={() => setExportOpen(false)}
          totalCount={filteredList.length}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}

