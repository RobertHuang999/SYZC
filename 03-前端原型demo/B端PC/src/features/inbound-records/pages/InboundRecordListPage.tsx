import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { inboundRecordListAnnotations } from "../annotations/inbound-record-list.annotations"
import { InboundRecordFiltersPanel } from "../components/InboundRecordFiltersPanel"
import { InboundRecordTable } from "../components/InboundRecordTable"
import { ExportRecordsDialog } from "../components/ExportRecordsDialog"
import { PdfViewerDialog } from "../components/PdfViewerDialog"
import {
  DEFAULT_INBOUND_RECORD_FILTERS,
  INBOUND_APPLY_LIST_PATH,
  INBOUND_RECORD_ADD_PATH,
  PAGE_SIZE,
} from "../domain/constants"
import type { InboundRecord, InboundRecordFilters, InboundRecordRowAction } from "../domain/types"
import { inboundRecordDocuments } from "../documents/inbound-record-documents"
import {
  filterInboundRecords,
  paginateInboundRecords,
  sortInboundRecords,
} from "../lib/list-utils"
import { inboundRecordsMock } from "../mock/inbound-records.mock"

export function InboundRecordListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [rows, setRows] = useState<InboundRecord[]>(() => [...inboundRecordsMock])
  const [draftFilters, setDraftFilters] = useState<InboundRecordFilters>(
    DEFAULT_INBOUND_RECORD_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<InboundRecordFilters>(
    DEFAULT_INBOUND_RECORD_FILTERS
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 弹窗状态
  const [exportTarget, setExportTarget] = useState<InboundRecord | null>(null)
  const [pdfTarget, setPdfTarget] = useState<InboundRecord | null>(null)

  useEffect(() => {
    setRows([...inboundRecordsMock])
  }, [location.key])

  const filtered = useMemo(() => {
    const matched = filterInboundRecords(rows, appliedFilters)
    return sortInboundRecords(matched)
  }, [rows, appliedFilters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageData = useMemo(
    () => paginateInboundRecords(filtered, currentPage, pageSize),
    [filtered, currentPage, pageSize]
  )

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2600)
  }

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_INBOUND_RECORD_FILTERS)
    setAppliedFilters(DEFAULT_INBOUND_RECORD_FILTERS)
    setPage(1)
  }

  const handleRowAction = (action: InboundRecordRowAction, item: InboundRecord) => {
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
      title="入库记录"
      documents={inboundRecordDocuments}
      annotations={inboundRecordListAnnotations}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["inbound-record-page"]}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold tracking-tight">入库管理</h1>
              <div className="inline-flex rounded-lg border bg-muted/40 p-0.5 text-xs">
                <button
                  type="button"
                  className="rounded-md px-3 py-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => navigate(INBOUND_APPLY_LIST_PATH)}
                >
                  入库申请
                </button>
                <button
                  type="button"
                  className="rounded-md bg-background px-3 py-1 font-medium text-foreground shadow-sm"
                >
                  入库记录
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              注：根据现网规范，侧边栏菜单已隐藏「入库申请」，通过上方分段器可无缝切换
            </p>
          </div>
        </PrototypeAnnotationTarget>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSearch()
          }}
        >
          <PrototypeAnnotationTarget annotationIds={["inbound-record-filter"]}>
            <InboundRecordFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
              onAdd={() => navigate(INBOUND_RECORD_ADD_PATH)}
            />
          </PrototypeAnnotationTarget>
        </form>

        <div className="space-y-4">
          <PrototypeAnnotationTarget
            annotationIds={["inbound-record-table", "inbound-record-row-actions"]}
          >
            <InboundRecordTable
              data={pageData}
              page={currentPage}
              pageSize={pageSize}
              onAction={handleRowAction}
            />
          </PrototypeAnnotationTarget>

          <WarningListPagination
            total={filtered.length}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        </div>

        {/* 下载记录 Excel 弹窗 */}
        <ExportRecordsDialog
          open={exportTarget !== null}
          orderNo={exportTarget?.orderNo}
          onClose={() => setExportTarget(null)}
          onExport={() => {
            showToast(`已生成入库单 ${exportTarget?.orderNo} 堆放明细清单 Excel 并下载`)
          }}
        />

        {/* 单据 PDF 预览弹窗 */}
        <PdfViewerDialog
          open={pdfTarget !== null}
          title="入库凭证单据"
          fileName={`入库单_${pdfTarget?.orderNo}.pdf`}
          onClose={() => setPdfTarget(null)}
        />

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 max-w-sm rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
