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
import { InboundReceiptPdfDialog } from "../components/InboundReceiptPdfDialog"
import { ExportRecordsDialog } from "@/features/inventory-management/components/ExportRecordsDialog"
import type { ExportRecordItem } from "@/features/inventory-management/domain/types"
import {
  createDocumentExportRecord,
  DEFAULT_INBOUND_EXPORT_RECORDS,
} from "@/features/shared/document-export-records"
import { INVENTORY_CROSS_EXPORT_USER_TOAST } from "@/features/shared/inventory-cross-export/inventory-cross-export-ui-labels"
import {
  DEFAULT_INBOUND_RECORD_FILTERS,
  INBOUND_RECORD_ADD_PATH,
  inboundRecordDetailPath,
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
import { IterationPageTag } from "@/shared/components/IterationHighlight"

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

  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [exportRecords, setExportRecords] = useState<ExportRecordItem[]>(() => [
    ...DEFAULT_INBOUND_EXPORT_RECORDS,
  ])
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
      const task = createDocumentExportRecord({
        kind: "入库堆放明细",
        orderNo: item.orderNo,
        recordCount: item.goodsNames.length || 1,
        creator: item.createByName,
        creatorOrg: item.createOrgName,
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
      navigate(inboundRecordDetailPath(item.id, "documents"))
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
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">入库记录</h1>
            <p className="text-sm text-muted-foreground mt-1">
              查看与追溯存货入库历史流水，支持多规格货品核验、单据打印与记录导出
            </p>
          </div>
        </PrototypeAnnotationTarget>

        <IterationPageTag
          version="6.4"
          changeType="新增"
          title="支持多介质【单据下载】（A4 纵向 / A5 横向 / 针式连续纸二等分 PDF）"
          description="点击行操作【单据下载】呼出多介质打印预览弹窗，按一级货品汇总平铺、货主证号电话明文展示、纯黑实线防针式断针。"
        />

        <IterationPageTag
          version="6.3"
          changeType="优化"
          title="行操作一行最多 3 个、最多两行，并新增【资料管理】"
          description="货主改为合作方档案引用并支持快捷建档；本期不展示入库暂存登记通道。"
        />

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
            annotationIds={[
              "inbound-record-table",
              "inbound-record-row-actions",
              "inbound-record-pdf-export",
            ]}
          >
            <InboundRecordTable
              data={pageData}
              page={currentPage}
              pageSize={pageSize}
              onAction={handleRowAction}
              onResetFilters={handleReset}
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

        <ExportRecordsDialog
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          records={exportRecords}
        />

        {/* 单据 PDF 预览弹窗（6.4 多介质排版） */}
        <InboundReceiptPdfDialog
          open={pdfTarget !== null}
          record={pdfTarget}
          onClose={() => setPdfTarget(null)}
          onSuccess={showToast}
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
