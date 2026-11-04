import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { transferRecordDocuments } from "../documents/transfer-record-documents"
import { transferRecordListAnnotations } from "../annotations/transfer-record-list.annotations"
import { TransferRecordFiltersPanel } from "../components/TransferRecordFiltersPanel"
import { TransferRecordTable } from "../components/TransferRecordTable"
import { TransferDownloadRecordsDialog } from "../components/TransferDownloadRecordsDialog"
import { TransferPdfDialog } from "../components/TransferPdfDialog"
import {
  DEFAULT_TRANSFER_FILTERS,
  TRANSFER_RECORD_ADD_PATH,
  transferRecordDetailPath,
  PAGE_SIZE,
} from "../domain/constants"
import type { TransferRecord, TransferRecordFilters } from "../domain/types"
import {
  filterTransferRecords,
  paginateTransferRecords,
  sortTransferRecords,
} from "../lib/list-utils"
import { transferRecordsMock } from "../mock/transfer-records.mock"

export function TransferRecordListPage() {
  const navigate = useNavigate()
  const [rows] = useState<TransferRecord[]>(() => [...transferRecordsMock])
  const [draftFilters, setDraftFilters] = useState<TransferRecordFilters>(
    DEFAULT_TRANSFER_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<TransferRecordFilters>(
    DEFAULT_TRANSFER_FILTERS
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)

  // 弹窗状态
  const [downloadLogTarget, setDownloadLogTarget] = useState<TransferRecord | null>(null)
  const [downloadPdfTarget, setDownloadPdfTarget] = useState<TransferRecord | null>(null)

  // 过滤与排序
  const filteredRows = useMemo(() => {
    const list = filterTransferRecords(rows, appliedFilters)
    return sortTransferRecords(list)
  }, [rows, appliedFilters])

  const pagedRows = useMemo(() => {
    return paginateTransferRecords(filteredRows, page, pageSize)
  }, [filteredRows, page, pageSize])

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters })
    setPage(1)
  }

  const handleAdd = () => {
    navigate(TRANSFER_RECORD_ADD_PATH)
  }

  const handleViewDetail = (record: TransferRecord) => {
    navigate(transferRecordDetailPath(record.id))
  }

  return (
    <PrototypeAnnotationProvider
      documents={transferRecordDocuments}
      annotations={transferRecordListAnnotations}
    >
      <div className="space-y-4 p-6 font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        {/* 标题区与页面定位标注 */}
        <PrototypeAnnotationTarget annotationIds={["transfer-record-list-page"]}>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              移库记录
            </h1>
            <p className="text-xs text-muted-foreground">
              规范存货在实体监管仓库内部的储位调拨行为，实现原子对冲（出库流水 + 入库流水）、条码资产同步与双重凭证审计（P-CKG-011）。
            </p>
          </div>
        </PrototypeAnnotationTarget>

        {/* 筛选区 Card */}
        <PrototypeAnnotationTarget annotationIds={["transfer-record-filters"]}>
          <TransferRecordFiltersPanel
            draftFilters={draftFilters}
            onDraftChange={setDraftFilters}
            onSearch={handleSearch}
            onAdd={handleAdd}
          />
        </PrototypeAnnotationTarget>

        {/* 列表区 Card */}
        <div className="space-y-4">
          <PrototypeAnnotationTarget annotationIds={["transfer-record-table-actions"]}>
            <TransferRecordTable
              records={pagedRows}
              page={page}
              pageSize={pageSize}
              onViewDetail={handleViewDetail}
              onDownloadLog={setDownloadLogTarget}
              onDownloadDoc={setDownloadPdfTarget}
            />
          </PrototypeAnnotationTarget>

          {/* 分页组件 */}
          {filteredRows.length > 0 && (
            <WarningListPagination
              totalItems={filteredRows.length}
              currentPage={page}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize)
                setPage(1)
              }}
            />
          )}
        </div>

        {/* 【下载记录】弹窗 */}
        <TransferDownloadRecordsDialog
          open={!!downloadLogTarget}
          record={downloadLogTarget}
          onClose={() => setDownloadLogTarget(null)}
        />

        {/* 【单据下载】PDF凭单弹窗 */}
        <TransferPdfDialog
          open={!!downloadPdfTarget}
          record={downloadPdfTarget}
          onClose={() => setDownloadPdfTarget(null)}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}

