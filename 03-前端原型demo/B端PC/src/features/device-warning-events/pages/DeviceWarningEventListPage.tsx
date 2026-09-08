import { useMemo, useState } from "react"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { Button } from "@/components/ui/button"
import { DEFAULT_FILTERS, PAGE_SIZE } from "../domain/constants"
import type { DeviceWarningEvent, DeviceWarningEventFilters } from "../domain/types"
import { DeviceWarningEventFiltersPanel } from "../components/DeviceWarningEventFilters"
import { DeviceWarningEventTable } from "../components/DeviceWarningEventTable"
import { ReleaseConfirmDialog } from "../components/ReleaseConfirmDialog"
import { BatchReleaseConfirmDialog } from "../components/BatchReleaseConfirmDialog"
import { WARNING_STATUS } from "../domain/status"
import { canSelectForBatchRelease } from "../domain/actions"
import {
  filterDeviceWarningEvents,
  paginateEvents,
} from "../lib/event-utils"
import { deviceWarningEventsMock } from "../mock/device-warning-events.mock"
import {
  PrototypeAnnotationProvider,
  PrototypeAnnotationTarget,
} from "@/shared/annotations/PrototypeAnnotationLayer"
import { deviceWarningListAnnotations } from "../annotations/device-warning-list.annotations"
import { deviceWarningDocuments } from "../documents/device-warning-documents"

const PC_DEVICE_WARNING_FILTER_KEY = "SYZC_PC_DEVICE_WARNING_FILTERS"

function loadCachedPcDeviceFilters(): DeviceWarningEventFilters {
  try {
    const raw = sessionStorage.getItem(PC_DEVICE_WARNING_FILTER_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_FILTERS
}

function saveCachedPcDeviceFilters(filters: DeviceWarningEventFilters) {
  try {
    sessionStorage.setItem(PC_DEVICE_WARNING_FILTER_KEY, JSON.stringify(filters))
  } catch {}
}

export function DeviceWarningEventListPage() {
  const [draftFilters, setDraftFilters] =
    useState<DeviceWarningEventFilters>(loadCachedPcDeviceFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<DeviceWarningEventFilters>(loadCachedPcDeviceFilters)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [releaseTarget, setReleaseTarget] = useState<DeviceWarningEvent | null>(
    null
  )
  const [batchReleaseTargets, setBatchReleaseTargets] = useState<
    DeviceWarningEvent[]
  >([])
  const [selectedEventIds, setSelectedEventIds] = useState<Set<string>>(
    () => new Set()
  )
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [releasedEventIds, setReleasedEventIds] = useState<Set<string>>(
    () => new Set()
  )

  const filteredEvents = useMemo(
    () => {
      const eventsWithReleaseState = deviceWarningEventsMock.map((event) =>
        releasedEventIds.has(event.eventId)
          ? {
              ...event,
              processedTime: "2026-08-25 14:00:00",
              processedBy: "当前操作人（演示）",
              warningStatus: WARNING_STATUS.CLOSED_VALID,
              manualReleaseAllowed: false,
            }
          : event
      )

      return filterDeviceWarningEvents(eventsWithReleaseState, appliedFilters)
    },
    [appliedFilters, releasedEventIds]
  )

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
          selectedEventIds.has(event.eventId) && canSelectForBatchRelease(event)
      ),
    [filteredEvents, selectedEventIds]
  )

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    saveCachedPcDeviceFilters(draftFilters)
    setPage(1)
    setSelectedEventIds(new Set())
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_FILTERS)
    setAppliedFilters(DEFAULT_FILTERS)
    saveCachedPcDeviceFilters(DEFAULT_FILTERS)
    setPage(1)
    setSelectedEventIds(new Set())
  }

  const handleReleaseClick = (event: DeviceWarningEvent) => {
    setReleaseTarget(event)
  }

  const markReleased = (eventIds: string[]) => {
    setReleasedEventIds((current) => {
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

  const handleReleaseConfirm = (event: DeviceWarningEvent) => {
    markReleased([event.eventId])
    setReleaseTarget(null)
    setToastMessage(`解除成功 — ${event.ruleName}`)
  }

  const handleBatchReleaseConfirm = (events: DeviceWarningEvent[]) => {
    markReleased(events.map((event) => event.eventId))
    setBatchReleaseTargets([])
    setToastMessage(`批量解除成功 — 共 ${events.length} 条`)
  }

  return (
    <PrototypeAnnotationProvider
      title="设备预警信息列表 · 原型批注"
      annotations={deviceWarningListAnnotations}
      documents={deviceWarningDocuments}
    >
      <div className="space-y-4 p-6">
      <PrototypeAnnotationTarget annotationIds={["device-warning-page"]}>
        <h1 className="text-2xl font-semibold tracking-tight">设备预警信息</h1>
        <p className="text-sm text-muted-foreground">
          查看设备侧预警流水，筛选后进入详情或解除；支持批量勾选解除
        </p>
      </PrototypeAnnotationTarget>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSearch()
        }}
      >
        <PrototypeAnnotationTarget annotationIds={["device-warning-filter"]}>
          <DeviceWarningEventFiltersPanel
            value={draftFilters}
            onChange={setDraftFilters}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </PrototypeAnnotationTarget>
      </form>

      <div className="space-y-4">
        <PrototypeAnnotationTarget annotationIds={["device-warning-batch-release"]}>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={selectedEvents.length === 0}
              onClick={() => setBatchReleaseTargets(selectedEvents)}
            >
              批量解除
            </Button>
            {selectedEvents.length > 0 ? (
              <span className="text-xs text-muted-foreground">
                已选 {selectedEvents.length} 条可解除预警
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                未选中或选中项不可解除时禁用
              </span>
            )}
          </div>
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget
          annotationIds={[
            "device-warning-table",
            "device-warning-row-actions",
          ]}
        >
          <DeviceWarningEventTable
            events={pageEvents}
            page={currentPage}
            pageSize={pageSize}
            selectedEventIds={selectedEventIds}
            onSelectedEventIdsChange={setSelectedEventIds}
            onRelease={handleReleaseClick}
          />
        </PrototypeAnnotationTarget>

        <PrototypeAnnotationTarget annotationIds={["device-warning-pagination"]}>
          <WarningListPagination
            total={filteredEvents.length}
            page={currentPage}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
            totalLabel="条设备预警"
          />
        </PrototypeAnnotationTarget>
      </div>

      <ReleaseConfirmDialog
        open={releaseTarget !== null}
        event={releaseTarget}
        onOpenChange={(open) => {
          if (!open) {
            setReleaseTarget(null)
          }
        }}
        onConfirm={handleReleaseConfirm}
      />

      <BatchReleaseConfirmDialog
        open={batchReleaseTargets.length > 0}
        events={batchReleaseTargets}
        onOpenChange={(open) => {
          if (!open) {
            setBatchReleaseTargets([])
          }
        }}
        onConfirm={handleBatchReleaseConfirm}
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
