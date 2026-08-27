import { useMemo, useState } from "react"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { DEFAULT_FILTERS, PAGE_SIZE } from "../domain/constants"
import type { RiskDisclosureFilters } from "../domain/types"
import { RiskDisclosureFiltersPanel } from "../components/RiskDisclosureFilters"
import { RiskDisclosureTable } from "../components/RiskDisclosureTable"
import {
  filterRiskDisclosureRecords,
  paginateRecords,
} from "../lib/record-utils"
import { riskDisclosureRecordsMock } from "../mock/risk-disclosure-records.mock"

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { riskDisclosureListAnnotations } from "../annotations/risk-disclosure-list.annotations"
import { riskDisclosureDocuments } from "../documents/risk-disclosure-documents"

export function RiskDisclosureListPage() {
  const [draftFilters, setDraftFilters] =
    useState<RiskDisclosureFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] =
    useState<RiskDisclosureFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)

  const filteredRecords = useMemo(
    () => filterRiskDisclosureRecords(riskDisclosureRecordsMock, appliedFilters),
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

  return (
    <PrototypeAnnotationProvider
      title="风险公示列表 · 原型批注"
      annotations={riskDisclosureListAnnotations}
      documents={riskDisclosureDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["risk-disclosure-page"]}>
          <h1 className="text-2xl font-semibold tracking-tight">风险公示</h1>
          <p className="text-sm text-muted-foreground">
            查看已公示的押品风险信息，支持多维度筛选
          </p>
        </PrototypeAnnotationTarget>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSearch()
          }}
        >
          <PrototypeAnnotationTarget annotationIds={["risk-disclosure-filter"]}>
            <RiskDisclosureFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </PrototypeAnnotationTarget>
        </form>

        <PrototypeAnnotationTarget annotationIds={["risk-disclosure-table"]}>
          <RiskDisclosureTable
            records={pageRecords}
            page={currentPage}
            pageSize={pageSize}
          />
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["risk-disclosure-pagination"]}>
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
      </div>
    </PrototypeAnnotationProvider>
  )
}
