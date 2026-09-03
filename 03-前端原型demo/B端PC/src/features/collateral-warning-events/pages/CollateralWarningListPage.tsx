import { useMemo, useState } from "react"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { Button } from "@/components/ui/button"
import { DEFAULT_FILTERS, PAGE_SIZE } from "../domain/constants"
import type {
  CollateralWarningEvent,
  CollateralWarningFilters,
} from "../domain/types"
import { CollateralWarningFiltersPanel } from "../components/CollateralWarningFilters"
import { CollateralWarningTable } from "../components/CollateralWarningTable"
import {
  filterCollateralWarningEvents,
  hasBatchPublishCandidates,
  paginateEvents,
} from "../lib/event-utils"
import { collateralWarningEventsMock } from "../mock/collateral-warning-events.mock"

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { collateralWarningListAnnotations } from "../annotations/collateral-warning-list.annotations"
import { collateralWarningDocuments } from "../documents/collateral-warning-documents"

import { useNavigate } from "react-router-dom"
import { ReleasePromptDialog } from "../components/ReleasePromptDialog"

const PC_COLLATERAL_WARNING_FILTER_KEY = "SYZC_PC_COLLATERAL_WARNING_FILTERS"

function loadCachedPcCollateralFilters(): CollateralWarningFilters {
  try {
    const raw = sessionStorage.getItem(PC_COLLATERAL_WARNING_FILTER_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_FILTERS
}

function saveCachedPcCollateralFilters(filters: CollateralWarningFilters) {
  try {
    sessionStorage.setItem(PC_COLLATERAL_WARNING_FILTER_KEY, JSON.stringify(filters))
  } catch {}
}

export function CollateralWarningListPage() {
  const navigate = useNavigate()
  const [draftFilters, setDraftFilters] =
    useState<CollateralWarningFilters>(loadCachedPcCollateralFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<CollateralWarningFilters>(loadCachedPcCollateralFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [releaseTarget, setReleaseTarget] = useState<CollateralWarningEvent | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const filteredEvents = useMemo(
    () => filterCollateralWarningEvents(collateralWarningEventsMock, appliedFilters),
    [appliedFilters]
  )

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageEvents = useMemo(
    () => paginateEvents(filteredEvents, currentPage, pageSize),
    [filteredEvents, currentPage, pageSize]
  )

  const batchPublishEnabled = useMemo(
    () => hasBatchPublishCandidates(filteredEvents),
    [filteredEvents]
  )

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    saveCachedPcCollateralFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_FILTERS)
    setAppliedFilters(DEFAULT_FILTERS)
    saveCachedPcCollateralFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const showToast = (message: string) => {
    setToastMessage(message)
    window.setTimeout(() => setToastMessage(null), 2500)
  }

  const handlePublish = (event: CollateralWarningEvent) => {
    showToast(`公示风险 — ${event.orderNo}`)
  }

  return (
    <PrototypeAnnotationProvider
      title="押品预警列表 · 原型批注"
      annotations={collateralWarningListAnnotations}
      documents={collateralWarningDocuments}
    >
      <div className="space-y-4 p-6">
        <PrototypeAnnotationTarget annotationIds={["collateral-warning-page"]}>
          <h1 className="text-2xl font-semibold tracking-tight">押品预警信息</h1>
          <p className="text-sm text-muted-foreground">
            查看订单侧 7 类预警流水，筛选后处置或跳转详情
          </p>
        </PrototypeAnnotationTarget>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSearch()
          }}
        >
          <PrototypeAnnotationTarget annotationIds={["collateral-warning-filter"]}>
            <CollateralWarningFiltersPanel
              value={draftFilters}
              onChange={setDraftFilters}
              onSearch={handleSearch}
              onReset={handleReset}
            />
          </PrototypeAnnotationTarget>
        </form>

        <div className="space-y-4">
          <PrototypeAnnotationTarget annotationIds={["collateral-warning-toolbar"]}>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!batchPublishEnabled}
                onClick={() => showToast("批量公示风险确认")}
              >
                批量公示风险
              </Button>
              <Button variant="outline" size="sm" onClick={() => showToast("导出")}>
                导出
              </Button>
              {!batchPublishEnabled && (
                <span className="text-xs text-muted-foreground">
                  当前筛选无已处理未公示记录
                </span>
              )}
            </div>
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget annotationIds={["collateral-warning-table", "collateral-warning-row-actions"]}>
            <CollateralWarningTable
              events={pageEvents}
              page={currentPage}
              pageSize={pageSize}
              onPublish={handlePublish}
              onRelease={setReleaseTarget}
            />
          </PrototypeAnnotationTarget>

          <p className="text-xs text-muted-foreground">
            物联穿透类请至设备预警信息核销。
          </p>

          <PrototypeAnnotationTarget annotationIds={["collateral-warning-pagination"]}>
            <WarningListPagination
              total={filteredEvents.length}
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

        <ReleasePromptDialog
          open={releaseTarget !== null}
          orderNo={releaseTarget?.orderNo}
          onOpenChange={(open) => {
            if (!open) setReleaseTarget(null)
          }}
          onConfirm={() => {
            const target = releaseTarget
            setReleaseTarget(null)
            if (target) {
              const returnRoute = `/物联网IOT与预警/预警信息/押品预警信息/详情/${target.eventId}`
              navigate(
                `/融资/监管/抵质押业务/抵质押业务办理?order_id=${encodeURIComponent(target.orderNo)}&warn_id=${encodeURIComponent(target.eventId)}&return_route=${encodeURIComponent(returnRoute)}`
              )
            }
          }}
        />

        {toastMessage && (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        )}
      </div>
    </PrototypeAnnotationProvider>
  )
}
