import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { transferRecordDocuments } from "../documents/transfer-record-documents"
import { transferRecordListAnnotations } from "../annotations/transfer-record-list.annotations"
import { transferRecordsMock } from "../mock/transfer-records.mock"
import { TransferRecordFiltersPanel } from "../components/TransferRecordFiltersPanel"
import { TransferRecordTable } from "../components/TransferRecordTable"
import {
  DEFAULT_TRANSFER_FILTERS,
  TRANSFER_RECORD_ADD_PATH,
  transferRecordDetailPath,
  PAGE_SIZE,
} from "../domain/constants"
import type {
  TransferRecord,
  TransferRecordFilters,
  TransferRecordRowAction,
} from "../domain/types"
import {
  filterTransferRecords,
  sortTransferRecords,
  paginateTransferRecords,
} from "../lib/list-utils"

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

  // 过滤与排序
  const filtered = useMemo(() => {
    const matched = filterTransferRecords(rows, appliedFilters)
    return sortTransferRecords(matched)
  }, [rows, appliedFilters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedData = useMemo(
    () => paginateTransferRecords(filtered, currentPage, pageSize),
    [filtered, currentPage, pageSize]
  )

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters })
    setPage(1)
  }

  const handleAdd = () => {
    navigate(TRANSFER_RECORD_ADD_PATH)
  }

  const handleRowAction = (action: TransferRecordRowAction, item: TransferRecord) => {
    if (action === "viewDetail") {
      navigate(transferRecordDetailPath(item.id))
    }
  }

  return (
    <PrototypeAnnotationProvider
      title="转让记录原型批注"
      documents={transferRecordDocuments}
      annotations={transferRecordListAnnotations}
    >
      <div className="space-y-4 p-6 font-['PingFang_SC',-apple-system,BlinkMacSystemFont,sans-serif]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">转让记录</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            在仓货权过户与受让人二元核验闭环，支持转让申请、审批流转与跨模块转让入库联动
          </p>
        </div>

        {/* 顶部标题与检索区打点 */}
        <PrototypeAnnotationTarget annotationIds={["transfer-record-list-page"]}>
          <TransferRecordFiltersPanel
            value={draftFilters}
            onChange={setDraftFilters}
            onSearch={handleSearch}
            onAdd={handleAdd}
          />
        </PrototypeAnnotationTarget>

        {/* 10 列标准表格（仅【查看详情】操作列） */}
        <PrototypeAnnotationTarget annotationIds={["transfer-record-table"]}>
          <TransferRecordTable
            data={pagedData}
            page={currentPage}
            pageSize={pageSize}
            onAction={handleRowAction}
          />
        </PrototypeAnnotationTarget>

        {/* 标杆标准分页 */}
        <div className="sticky bottom-0 z-30 bg-background">
          <WarningListPagination
            page={currentPage}
            total={filtered.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize)
              setPage(1)
            }}
          />
        </div>
      </div>
    </PrototypeAnnotationProvider>
  )
}
