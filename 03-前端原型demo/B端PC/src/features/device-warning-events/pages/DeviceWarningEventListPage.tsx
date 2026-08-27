import { useMemo, useState } from "react"
import { WarningListPagination } from "@/components/business/WarningListPrimitives"
import { DEFAULT_FILTERS, PAGE_SIZE } from "../domain/constants"
import type { DeviceWarningEvent, DeviceWarningEventFilters } from "../domain/types"
import { DeviceWarningEventFiltersPanel } from "../components/DeviceWarningEventFilters"
import { DeviceWarningEventTable } from "../components/DeviceWarningEventTable"
import { ReleaseConfirmDialog } from "../components/ReleaseConfirmDialog"
import { TriggerHistoryDrawer } from "../components/TriggerHistoryDrawer"
import { WARNING_STATUS } from "../domain/status"
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

export function DeviceWarningEventListPage() {
  const [draftFilters, setDraftFilters] =
    useState<DeviceWarningEventFilters>(DEFAULT_FILTERS)
  const [appliedFilters, setAppliedFilters] =
    useState<DeviceWarningEventFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [releaseTarget, setReleaseTarget] = useState<DeviceWarningEvent | null>(
    null
  )
  const [timelineTarget, setTimelineTarget] = useState<DeviceWarningEvent | null>(
    null
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

  const handleSearch = () => {
    setAppliedFilters(draftFilters)
    setPage(1)
  }

  const handleReset = () => {
    setDraftFilters(DEFAULT_FILTERS)
    setAppliedFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const handleReleaseClick = (event: DeviceWarningEvent) => {
    setReleaseTarget(event)
  }

  const handleReleaseConfirm = (event: DeviceWarningEvent) => {
    setReleasedEventIds((current) => {
      const next = new Set(current)
      next.add(event.eventId)
      return next
    })
    setReleaseTarget(null)
    setToastMessage(`解除成功 — ${event.ruleName}`)
  }

  const handleFrequencyClick = (event: DeviceWarningEvent) => {
    setTimelineTarget(event)
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
          查看设备侧预警流水，筛选后进入详情/解除/频次时间轴
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
      <PrototypeAnnotationTarget
        annotationIds={[
          "device-warning-table",
          "device-warning-row-actions",
          "device-warning-frequency",
        ]}
        markerPosition="top-left"
      >
        <DeviceWarningEventTable
          events={pageEvents}
          page={currentPage}
          pageSize={pageSize}
          onRelease={handleReleaseClick}
          onFrequencyClick={handleFrequencyClick}
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

      <TriggerHistoryDrawer
        open={timelineTarget !== null}
        event={timelineTarget}
        onOpenChange={(open) => {
          if (!open) {
            setTimelineTarget(null)
          }
        }}
        onSnapshotPreview={(sequence) => {
          setToastMessage(`抓拍预览 — 第 ${sequence} 次触发`)
          window.setTimeout(() => setToastMessage(null), 2500)
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
