import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { relocationRecordDocuments } from "../documents/relocation-record-documents"
import { relocationRecordAnnotations } from "../annotations/relocation-record.annotations"
import { RelocationRecordFiltersPanel } from "../components/RelocationRecordFiltersPanel"
import { RelocationRecordTable } from "../components/RelocationRecordTable"
import {
  DEFAULT_RELOCATION_FILTERS,
  PAGE_SIZE,
  RELOCATION_FORM_PATH,
} from "../domain/constants"
import type { RelocationFilters, RelocationRecord } from "../domain/types"
import { relocationRecordsMock } from "../mock/relocation-records.mock"

function filterRecords(records: RelocationRecord[], filters: RelocationFilters) {
  return records.filter((record) => {
    if (filters.id && !record.id.includes(filters.id.trim())) return false
    if (filters.ownerKeyword) {
      const keyword = filters.ownerKeyword.trim()
      if (
        !record.ownerName.includes(keyword) &&
        !record.ownerIdentifier.includes(keyword)
      ) {
        return false
      }
    }
    if (filters.moveType !== "ALL" && record.moveType !== filters.moveType) return false
    if (filters.warehouseName !== "ALL" && record.warehouseName !== filters.warehouseName) {
      return false
    }
    if (filters.goodsName !== "ALL" && !record.goodsNameSummary.includes(filters.goodsName)) {
      return false
    }
    if (filters.createBy !== "ALL" && record.creatorName !== filters.createBy) return false

    const moveDate = record.moveTime.slice(0, 10)
    if (filters.moveStartDate && moveDate < filters.moveStartDate) return false
    if (filters.moveEndDate && moveDate > filters.moveEndDate) return false

    const createDate = record.createTime.slice(0, 10)
    if (filters.createStartDate && createDate < filters.createStartDate) return false
    if (filters.createEndDate && createDate > filters.createEndDate) return false

    return true
  })
}

export function RelocationRecordListPage() {
  const navigate = useNavigate()
  const [draftFilters, setDraftFilters] = useState<RelocationFilters>(
    DEFAULT_RELOCATION_FILTERS,
  )
  const [appliedFilters, setAppliedFilters] = useState<RelocationFilters>(
    DEFAULT_RELOCATION_FILTERS,
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)

  const filtered = useMemo(
    () =>
      [...filterRecords(relocationRecordsMock, appliedFilters)].sort((a, b) => {
        const timeCompare = b.moveTime.localeCompare(a.moveTime)
        return timeCompare !== 0 ? timeCompare : b.id.localeCompare(a.id)
      }),
    [appliedFilters],
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters })
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters({ ...DEFAULT_RELOCATION_FILTERS })
    setAppliedFilters({ ...DEFAULT_RELOCATION_FILTERS })
    setPage(1)
  }

  return (
    <PrototypeAnnotationProvider
      title="移库记录原型批注"
      documents={relocationRecordDocuments}
      annotations={relocationRecordAnnotations}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["relocation-list-page"]}>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">移库记录</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              同一仓库内的储位调拨台账，记录移出与移入位置、审批流转与现场凭证，账实变动双向对冲
            </p>
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["relocation-list-filter"]}>
          <RelocationRecordFiltersPanel
            value={draftFilters}
            onChange={setDraftFilters}
            onSearch={handleSearch}
            onReset={handleReset}
            onAdd={() => navigate(RELOCATION_FORM_PATH)}
          />
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["relocation-list-table"]}>
          <div className="space-y-3">
            <RelocationRecordTable records={paged} />
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
        </PrototypeAnnotationTarget>
      </div>
    </PrototypeAnnotationProvider>
  )
}
