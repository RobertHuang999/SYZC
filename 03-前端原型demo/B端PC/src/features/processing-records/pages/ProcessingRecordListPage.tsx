import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { IterationPageTag } from "@/shared/components/IterationHighlight"
import { PageHeader } from "@/shared/components/PageHeader"
import { processingRecordDocuments } from "../documents/processing-record-documents"
import { processingRecordListAnnotations } from "../annotations/processing-record-list.annotations"
import { ProcessingRecordFiltersPanel } from "../components/ProcessingRecordFiltersPanel"
import { ProcessingRecordTable } from "../components/ProcessingRecordTable"
import { CompleteProcessingDialog } from "../components/CompleteProcessingDialog"
import { ProcessingNullifyDialog } from "../components/ProcessingNullifyDialog"
import { ProcessingExportRecordsDialog } from "../components/ProcessingExportRecordsDialog"
import {
  DEFAULT_PROCESSING_RECORD_FILTERS,
  processingRecordDetailPath,
  PAGE_SIZE,
} from "../domain/constants"
import type { ProcessingRecord, ProcessingRecordFilters } from "../domain/types"
import {
  filterProcessingRecords,
  paginateProcessingRecords,
  sortProcessingRecords,
} from "../lib/list-utils"
import { processingRecordsMock } from "../mock/processing-records.mock"

export function ProcessingRecordListPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<ProcessingRecord[]>(() => [...processingRecordsMock])
  const [draftFilters, setDraftFilters] = useState<ProcessingRecordFilters>(
    DEFAULT_PROCESSING_RECORD_FILTERS
  )
  const [appliedFilters, setAppliedFilters] = useState<ProcessingRecordFilters>(
    DEFAULT_PROCESSING_RECORD_FILTERS
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 弹窗状态
  const [completeTarget, setCompleteTarget] = useState<ProcessingRecord | null>(null)
  const [nullifyTarget, setNullifyTarget] = useState<ProcessingRecord | null>(null)
  const [exportOpen, setExportOpen] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // 筛选与排序
  const filtered = useMemo(() => {
    const matched = filterProcessingRecords(rows, appliedFilters)
    return sortProcessingRecords(matched)
  }, [rows, appliedFilters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageData = useMemo(
    () => paginateProcessingRecords(filtered, currentPage, pageSize),
    [filtered, currentPage, pageSize]
  )

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_PROCESSING_RECORD_FILTERS)
    setAppliedFilters(DEFAULT_PROCESSING_RECORD_FILTERS)
    setPage(1)
  }

  // 完成加工成功回调
  const handleCompleteSuccess = (updated: ProcessingRecord) => {
    setRows((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    showToast(`加工单 ${updated.id} 已成功完成加工并入库，新存货条码已生成！`)
  }

  // 作废成功回调
  const handleNullifySuccess = (updated: ProcessingRecord) => {
    setRows((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))
    showToast(`加工单 ${updated.id} 已执行作废，计划投入锁定库存已全额释放！`)
  }

  return (
    <PrototypeAnnotationProvider
      title="加工记录"
      documents={processingRecordDocuments}
      annotations={processingRecordListAnnotations}
    >
      <div className="space-y-4 p-6">
        {/* 页面标题区打点 */}
        <PrototypeAnnotationTarget annotationIds={["processing-record-page"]}>
          <PageHeader
            title="加工记录"
            description="规范在仓切割、分卷、拆分及熔炼加工流转，实现计划锁库、消耗扣减、余量释放、新条码生成与货权无缝继承。"
            badge={
              <IterationPageTag
                version="6.3"
                changeType="新增"
                title="加工记录（6.3基准版）"
                description="规范在仓切割、分卷、拆分及熔炼加工流转，实现计划锁库、消耗扣减、余量释放、新条码生成与货权无缝继承。"
              />
            }
          />
        </PrototypeAnnotationTarget>

        {/* 顶部 Toast 轻提示 */}
        {toastMessage && (
          <div className="rounded-md bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
            {toastMessage}
          </div>
        )}

        {/* 筛选卡 */}
        <PrototypeAnnotationTarget annotationIds={["processing-filters-panel"]}>
          <ProcessingRecordFiltersPanel
            draftFilters={draftFilters}
            onDraftChange={setDraftFilters}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </PrototypeAnnotationTarget>

        {/* 列表卡 */}
        <PrototypeAnnotationTarget
          annotationIds={[
            "processing-record-table",
            "processing-complete-action",
            "processing-nullify-action",
          ]}
        >
          <Card className="border-border/80 shadow-sm">
            <CardContent className="space-y-3 pt-4">
              {/* 工具条：数量与导出 */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  共检索到 <strong className="text-foreground">{filtered.length}</strong> 条加工记录
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => setExportOpen(true)}
                >
                  <Download className="h-3.5 w-3.5" />
                  导出加工记录
                </Button>
              </div>

              {/* 14 列标准表格 */}
              <ProcessingRecordTable
                records={pageData}
                page={currentPage}
                pageSize={pageSize}
                onViewDetail={(record) => navigate(processingRecordDetailPath(record.id))}
                onComplete={(record) => setCompleteTarget(record)}
                onVoid={(record) => setNullifyTarget(record)}
              />

              {/* 吸底分页 */}
              <div className="sticky bottom-0 z-20 bg-background/95 backdrop-blur-sm pt-2">
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
            </CardContent>
          </Card>
        </PrototypeAnnotationTarget>

        {/* 完成加工弹窗 */}
        <CompleteProcessingDialog
          open={Boolean(completeTarget)}
          onOpenChange={(open) => !open && setCompleteTarget(null)}
          record={completeTarget}
          onSuccess={handleCompleteSuccess}
        />

        {/* 作废确认弹窗 */}
        <ProcessingNullifyDialog
          open={Boolean(nullifyTarget)}
          onOpenChange={(open) => !open && setNullifyTarget(null)}
          record={nullifyTarget}
          onSuccess={handleNullifySuccess}
        />

        {/* 导出弹窗 */}
        <ProcessingExportRecordsDialog
          open={exportOpen}
          onOpenChange={setExportOpen}
          totalCount={filtered.length}
        />
      </div>
    </PrototypeAnnotationProvider>
  )
}
