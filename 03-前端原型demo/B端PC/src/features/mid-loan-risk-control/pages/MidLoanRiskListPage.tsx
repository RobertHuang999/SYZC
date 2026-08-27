import { useMemo, useState } from "react"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { DEFAULT_FILTERS, PAGE_SIZE } from "../domain/constants"
import type { MidLoanRiskFilters, MidLoanRiskRecord } from "../domain/types"
import { MidLoanRiskFiltersPanel } from "../components/MidLoanRiskFilters"
import { MidLoanRiskTable } from "../components/MidLoanRiskTable"
import {
  filterMidLoanRiskRecords,
  paginateRecords,
} from "../lib/record-utils"
import { midLoanRiskRecordsMock } from "../mock/mid-loan-risk-records.mock"

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { midLoanRiskListAnnotations } from "../annotations/mid-loan-risk-list.annotations"
import { midLoanRiskDocuments } from "../documents/mid-loan-risk-documents"

export function MidLoanRiskListPage() {
  const [draftFilters, setDraftFilters] =
    useState<MidLoanRiskFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] =
    useState<MidLoanRiskFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const filteredRecords = useMemo(
    () => filterMidLoanRiskRecords(midLoanRiskRecordsMock, appliedFilters),
    [appliedFilters]
  )

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRecords = useMemo(
    () => paginateRecords(filteredRecords, currentPage, pageSize),
    [filteredRecords, currentPage, pageSize]
  )

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_FILTERS)
    setAppliedFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const handleExecute = (record: MidLoanRiskRecord) => {
    setToastMessage(`已提交执行 — ${record.orderNo}`)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  return (
    <PrototypeAnnotationProvider
      title="贷中风控列表 · 原型批注"
      annotations={midLoanRiskListAnnotations}
      documents={midLoanRiskDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["mid-loan-risk-page"]}>
          <h1 className="text-2xl font-semibold tracking-tight">贷中风控管理</h1>
          <p className="text-sm text-muted-foreground">
            管理贷中风控模型执行资格与异步计算进度
          </p>
        </PrototypeAnnotationTarget>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSearch()
          }}
        >
          <PrototypeAnnotationTarget annotationIds={["mid-loan-risk-filter"]}>
            <MidLoanRiskFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </PrototypeAnnotationTarget>
        </form>

        <PrototypeAnnotationTarget annotationIds={["mid-loan-risk-table", "mid-loan-risk-row-actions"]}>
          <MidLoanRiskTable
            records={pageRecords}
            page={currentPage}
            pageSize={pageSize}
            onExecute={handleExecute}
          />
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["mid-loan-risk-pagination"]}>
          <WarningListPagination
            total={filteredRecords.length}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        </PrototypeAnnotationTarget>

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
