import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { outboundRecordDocuments } from "../documents/outbound-record-documents"
import { outboundRecordListAnnotations } from "../annotations/outbound-record-list.annotations"
import { OutboundRecordFiltersPanel } from "../components/OutboundRecordFiltersPanel"
import { OutboundRecordTable } from "../components/OutboundRecordTable"
import { OutboundExportRecordsDialog } from "../components/OutboundExportRecordsDialog"
import { OutboundPdfDialog } from "../components/OutboundPdfDialog"
import {
  DEFAULT_OUTBOUND_RECORD_FILTERS,
  OUTBOUND_RECORD_ADD_PATH,
  PAGE_SIZE,
} from "../domain/constants"
import type {
  OutboundRecord,
  OutboundRecordFilters,
  OutboundRecordRowAction,
} from "../domain/types"
import {
  filterOutboundRecords,
  paginateOutboundRecords,
  sortOutboundRecords,
} from "../lib/list-utils"
import { outboundRecordsMock } from "../mock/outbound-records.mock"

export function OutboundRecordListPage() {
  const navigate = useNavigate()
  const [rows] = useState<OutboundRecord[]>(() => [...outboundRecordsMock])
  const [draftFilters, setDraftFilters] = useState<OutboundRecordFilters>(
    DEFAULT_OUTBOUND_RECORD_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<OutboundRecordFilters>(
    DEFAULT_OUTBOUND_RECORD_FILTERS
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 导出与单据预览弹窗状态
  const [exportTarget, setExportTarget] = useState<OutboundRecord | null>(null)
  const [pdfTarget, setPdfTarget] = useState<OutboundRecord | null>(null)

  const filtered = useMemo(() => {
    const matched = filterOutboundRecords(rows, appliedFilters)
    return sortOutboundRecords(matched)
  }, [rows, appliedFilters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageData = useMemo(
    () => paginateOutboundRecords(filtered, currentPage, pageSize),
    [filtered, currentPage, pageSize]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2800)
  }

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_OUTBOUND_RECORD_FILTERS)
    setAppliedFilters(DEFAULT_OUTBOUND_RECORD_FILTERS)
    setPage(1)
  }

  const handleRowAction = (action: OutboundRecordRowAction, item: OutboundRecord) => {
    if (action === "downloadExcel") {
      setExportTarget(item)
      return
    }
    if (action === "downloadPdf") {
      setPdfTarget(item)
    }
  }

  return (
    <PrototypeAnnotationProvider
      title="出库记录"
      documents={outboundRecordDocuments}
      annotations={outboundRecordListAnnotations}
    >
      <div className="space-y-4 p-6">
        {/* 页面标题打点 */}
        <PrototypeAnnotationTarget annotationIds={["outbound-record-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">出库记录</h1>
            <p className="text-sm text-muted-foreground mt-1">
              查看与追溯存货出库历史流水，支持货品明细穿透、单据下载与记录导出
            </p>
          </div>
        </PrototypeAnnotationTarget>

        {/* 筛选区打点 */}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSearch()
          }}
        >
          <PrototypeAnnotationTarget annotationIds={["outbound-record-filter"]}>
            <OutboundRecordFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
              onAdd={() => navigate(OUTBOUND_RECORD_ADD_PATH)}
            />
          </PrototypeAnnotationTarget>
        </form>

        {/* 表格与操作打点 */}
        <div className="space-y-4">
          <PrototypeAnnotationTarget
            annotationIds={["outbound-record-table", "outbound-record-row-actions"]}
          >
            <OutboundRecordTable
              data={pageData}
              page={currentPage}
              pageSize={pageSize}
              onAction={handleRowAction}
            />
          </PrototypeAnnotationTarget>

          {/* 分页组件 */}
          <WarningListPagination
            total={filtered.length}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize)
              setPage(1)
            }}
          />
        </div>

        {/* 提示 Toast */}
        {toastMessage && (
          <div className="fixed bottom-16 right-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}

        {/* 下载记录 Excel 弹窗 */}
        <OutboundExportRecordsDialog
          open={!!exportTarget}
          record={exportTarget}
          onClose={() => setExportTarget(null)}
          onSuccess={showToast}
        />

        {/* 单据凭证 PDF 弹窗 */}
        <OutboundPdfDialog
          open={!!pdfTarget}
          record={pdfTarget}
          onClose={() => setPdfTarget(null)}
          onSuccess={showToast}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
