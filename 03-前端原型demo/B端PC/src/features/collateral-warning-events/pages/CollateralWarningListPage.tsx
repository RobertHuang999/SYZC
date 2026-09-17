import { useEffect, useMemo, useState } from "react"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { Button } from "@/components/ui/button"
import { DEFAULT_FILTERS, PAGE_SIZE } from "../domain/constants"
import type {
  CollateralWarningEvent,
  CollateralWarningFilters,
} from "../domain/types"
import { CollateralWarningFiltersPanel } from "../components/CollateralWarningFilters"
import { CollateralWarningTable } from "../components/CollateralWarningTable"
import { BatchPublishConfirmDialog } from "../components/BatchPublishConfirmDialog"
import {
  filterCollateralWarningEvents,
  paginateEvents,
} from "../lib/event-utils"
import { collateralWarningEventsMock } from "../mock/collateral-warning-events.mock"

import { PrototypeAnnotationProvider, PrototypeAnnotationTarget } from "@/shared/annotations/PrototypeAnnotationLayer"
import { collateralWarningListAnnotations } from "../annotations/collateral-warning-list.annotations"
import { collateralWarningDocuments } from "../documents/collateral-warning-documents"

import { useLocation, useNavigate } from "react-router-dom"
import {
  getBatchPublishConfirmPath,
  resolvePublishNavigation,
} from "../lib/publish-navigation"
import { ReleasePromptDialog } from "../components/ReleasePromptDialog"
import { getCollateralWarningById } from "../lib/detail-utils"
import { canSelectForBatchPublish } from "../domain/actions"

const PC_COLLATERAL_WARNING_FILTER_KEY = "SYZC_PC_COLLATERAL_WARNING_FILTERS"

function loadCachedPcCollateralFilters(): CollateralWarningFilters {
  try {
    const raw = sessionStorage.getItem(PC_COLLATERAL_WARNING_FILTER_KEY)
    if (raw) {
      const cached = JSON.parse(raw) as Partial<CollateralWarningFilters>
      return {
        ...DEFAULT_FILTERS,
        ...cached,
        // 进入列表始终以「待处置 · 有效」为默认（F01），不沿用 session 中的状态筛选
        warningStatus: DEFAULT_FILTERS.warningStatus,
      }
    }
  } catch {}
  return DEFAULT_FILTERS
}

function saveCachedPcCollateralFilters(filters: CollateralWarningFilters) {
  try {
    sessionStorage.setItem(PC_COLLATERAL_WARNING_FILTER_KEY, JSON.stringify(filters))
  } catch {}
}

type BatchPublishReturnState = {
  batchPublishedIds?: string[]
  batchPublishCount?: number
}

export function CollateralWarningListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [draftFilters, setDraftFilters] =
    useState<CollateralWarningFilters>(loadCachedPcCollateralFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<CollateralWarningFilters>(loadCachedPcCollateralFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [releaseTarget, setReleaseTarget] = useState<CollateralWarningEvent | null>(null)
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(
    () => new Set()
  )
  const [batchPublishTargets, setBatchPublishTargets] = useState<
    CollateralWarningEvent[]
  >([])
  const [publishedEventIds, setPublishedEventIds] = useState<Set<string>>(
    () => new Set()
  )
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const filteredEvents = useMemo(() => {
    const eventsWithPublishState = collateralWarningEventsMock.map((event) =>
      publishedEventIds.has(event.eventId)
        ? { ...event, publicityStatus: "已公示" as const }
        : event
    )

    return filterCollateralWarningEvents(eventsWithPublishState, appliedFilters)
  }, [appliedFilters, publishedEventIds])

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageEvents = useMemo(
    () => paginateEvents(filteredEvents, currentPage, pageSize),
    [filteredEvents, currentPage, pageSize]
  )

  const selectedEvents = useMemo(
    () =>
      filteredEvents.filter(
        (event) =>
          selectedEventIds.has(event.eventId) &&
          canSelectForBatchPublish(event)
      ),
    [filteredEvents, selectedEventIds]
  )

  useEffect(() => {
    setSelectedEventIds((current) => {
      const next = new Set(
        [...current].filter((eventId) => {
          const event = filteredEvents.find((item) => item.eventId === eventId)
          return event ? canSelectForBatchPublish(event) : false
        })
      )
      return next.size === current.size ? current : next
    })
  }, [filteredEvents])

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    saveCachedPcCollateralFilters(draftFilters)
    setPage(1)
    setSelectedEventIds(new Set())
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_FILTERS)
    setAppliedFilters(DEFAULT_FILTERS)
    saveCachedPcCollateralFilters(DEFAULT_FILTERS)
    setPage(1)
    setSelectedEventIds(new Set())
  }

  const handlePublish = (event: CollateralWarningEvent) => {
    const target = resolvePublishNavigation(event)
    navigate(target.path)
  }

  const markPublished = (eventIds: string[]) => {
    setPublishedEventIds((current) => {
      const next = new Set(current)
      eventIds.forEach((id) => next.add(id))
      return next
    })
    setSelectedEventIds((current) => {
      const next = new Set(current)
      eventIds.forEach((id) => next.delete(id))
      return next
    })
  }

  const handleBatchPublishConfirm = (events: CollateralWarningEvent[]) => {
    setBatchPublishTargets([])
    navigate(getBatchPublishConfirmPath(), {
      state: { warnIds: events.map((event) => event.eventId) },
    })
  }

  useEffect(() => {
    const returnState = location.state as BatchPublishReturnState | null
    if (!returnState?.batchPublishedIds?.length) {
      return
    }

    markPublished(returnState.batchPublishedIds)
    setToastMessage(
      `成功公示 ${returnState.batchPublishCount ?? returnState.batchPublishedIds.length} 笔，失败 0 笔`
    )
    window.setTimeout(() => setToastMessage(null), 3000)
    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate])

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
            查看订单侧 7 类全新实时预警流水，筛选后处置或跳转详情；支持批量勾选公示
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
                disabled={selectedEvents.length === 0}
                onClick={() => setBatchPublishTargets(selectedEvents)}
              >
                批量公示风险
                {selectedEvents.length > 0
                  ? `（已选 ${selectedEvents.length} 条）`
                  : null}
              </Button>
              {selectedEvents.length > 0 ? (
                <span className="text-xs text-muted-foreground">
                  已选 {selectedEvents.length} 条可公示预警
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  勾选已结案 · 有效且未公示的记录后可用
                </span>
              )}
            </div>
          </PrototypeAnnotationTarget>

          <PrototypeAnnotationTarget annotationIds={["collateral-warning-table", "collateral-warning-row-actions"]}>
            <CollateralWarningTable
              events={pageEvents}
              page={currentPage}
              pageSize={pageSize}
              selectedEventIds={selectedEventIds}
              onSelectedEventIdsChange={setSelectedEventIds}
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
          ltvHitSnapshot={
            releaseTarget
              ? getCollateralWarningById(releaseTarget.eventId)?.ltvHitSnapshot
              : null
          }
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

        <BatchPublishConfirmDialog
          open={batchPublishTargets.length > 0}
          events={batchPublishTargets}
          onOpenChange={(open) => {
            if (!open) {
              setBatchPublishTargets([])
            }
          }}
          onConfirm={handleBatchPublishConfirm}
        />

        {toastMessage ? (
          <div className="fixed right-6 bottom-6 z-50 rounded-lg border bg-background px-4 py-3 text-sm shadow-lg">
            {toastMessage}
          </div>
        ) : null}
      </div>
    </PrototypeAnnotationProvider>
  )
}
