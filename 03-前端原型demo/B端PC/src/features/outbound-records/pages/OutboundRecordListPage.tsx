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
import { OutboundPdfDialog } from "../components/OutboundPdfDialog"
import { ExportRecordsDialog } from "@/features/inventory-management/components/ExportRecordsDialog"
import type { ExportRecordItem } from "@/features/inventory-management/domain/types"
import {
  createDocumentExportRecord,
  DEFAULT_OUTBOUND_EXPORT_RECORDS,
} from "@/features/shared/document-export-records"
import { INVENTORY_CROSS_EXPORT_USER_TOAST } from "@/features/shared/inventory-cross-export/inventory-cross-export-ui-labels"
import {
  DEFAULT_OUTBOUND_RECORD_FILTERS,
  OUTBOUND_RECORD_ADD_PATH,
  outboundRecordDetailPath,
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
import { IterationPageTag } from "@/shared/components/IterationHighlight"

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

  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [exportRecords, setExportRecords] = useState<ExportRecordItem[]>(() => [
    ...DEFAULT_OUTBOUND_EXPORT_RECORDS,
  ])
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
      const task = createDocumentExportRecord({
        kind: "出库扣减明细",
        orderNo: item.orderNo,
        recordCount: item.goodsList?.length || item.categoryCount || 1,
        creator: item.createdByName,
        creatorOrg: item.createdByOrg,
        status: "GENERATING",
      })
      setExportRecords((current) => [task, ...current])
      setExportModalOpen(true)
      showToast(INVENTORY_CROSS_EXPORT_USER_TOAST)
      window.setTimeout(() => {
        setExportRecords((current) =>
          current.map((row) =>
            row.id === task.id
              ? { ...row, status: "SUCCESS", fileSize: "86.4 KB" }
              : row
          )
        )
      }, 2200)
      return
    }
    if (action === "downloadPdf") {
      setPdfTarget(item)
      return
    }
    if (action === "manageDocs") {
      navigate(outboundRecordDetailPath(item.id, "documents"))
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

        <IterationPageTag
          version="6.4"
          changeType="新增"
          title="支持多介质【单据下载】（A4 纵向 / A5 横向 / 针式连续纸二等分 PDF）与质押单价货值脱敏"
          description="点击行操作【单据下载】呼出多介质打印预览弹窗，提货人明细与货主证号电话明文展示，单价与货物价值保留列头、数值留空脱敏。"
        />

        <IterationPageTag
          version="6.3"
          changeType="优化"
          title="行操作一行最多 3 个、最多两行，并新增【资料管理】"
          description="制单页货主只从「货主信息」档案选择、不提供快捷建档；个人提货人改为引用提货人档案。"
        />

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
            annotationIds={[
              "outbound-record-table",
              "outbound-record-row-actions",
              "outbound-record-pdf-export",
            ]}
          >
            <OutboundRecordTable
              data={pageData}
              page={currentPage}
              pageSize={pageSize}
              onAction={handleRowAction}
              onResetFilters={handleReset}
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
          <div className="fixed right-6 bottom-6 z-50 max-w-sm rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}

        <ExportRecordsDialog
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          records={exportRecords}
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
