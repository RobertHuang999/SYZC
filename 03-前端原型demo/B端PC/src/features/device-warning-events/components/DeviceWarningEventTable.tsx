import { useMemo, useState } from "react"
import { ImageIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { HoverOverflowText } from "@/components/business/HoverOverflowText"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SeverityLevelDisplay } from "@/shared/components/SeverityLevelDisplay"
import { TableDateTimeCell, TableProcessedInfoCell } from "@/shared/components/TableCells"
import { SnapshotImageModal, type SnapshotPreviewData } from "@/shared/components/SnapshotImageModal"
import { getRowActions, canSelectForBatchRelease } from "../domain/actions"
import type { DeviceWarningEvent } from "../domain/types"
import { formatWarningContent } from "../lib/event-utils"
import { WarningStatusBadge } from "./WarningStatusBadge"

type DeviceWarningEventTableProps = {
  events: DeviceWarningEvent[]
  page: number
  pageSize: number
  selectedEventIds: Set<string>
  onSelectedEventIdsChange: (ids: Set<string>) => void
  onRelease: (event: DeviceWarningEvent) => void
}

export function DeviceWarningEventTable({
  events,
  page,
  pageSize,
  selectedEventIds,
  onSelectedEventIdsChange,
  onRelease,
}: DeviceWarningEventTableProps) {
  const [previewImage, setPreviewImage] = useState<SnapshotPreviewData | null>(null)

  const selectableOnPage = useMemo(
    () => events.filter(canSelectForBatchRelease),
    [events]
  )
  const allSelectableChecked =
    selectableOnPage.length > 0 &&
    selectableOnPage.every((event) => selectedEventIds.has(event.eventId))

  const toggleAllOnPage = () => {
    const next = new Set(selectedEventIds)
    if (allSelectableChecked) {
      selectableOnPage.forEach((event) => next.delete(event.eventId))
    } else {
      selectableOnPage.forEach((event) => next.add(event.eventId))
    }
    onSelectedEventIdsChange(next)
  }

  const toggleOne = (event: DeviceWarningEvent) => {
    const next = new Set(selectedEventIds)
    if (next.has(event.eventId)) {
      next.delete(event.eventId)
    } else {
      next.add(event.eventId)
    }
    onSelectedEventIdsChange(next)
  }

  return (
    <>
      <div className="overflow-visible rounded-md border bg-card">
        <Table className="min-w-[1180px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  aria-label="全选当前页可解除预警"
                  checked={allSelectableChecked}
                  disabled={selectableOnPage.length === 0}
                  onChange={toggleAllOnPage}
                />
              </TableHead>
              <TableHead className="w-16">序号</TableHead>
              <TableHead className="w-[140px]">规则名称</TableHead>
              <TableHead className="w-[110px]">预警等级</TableHead>
              <TableHead className="w-[120px]">预警类型</TableHead>
              <TableHead className="w-[200px]">预警内容/设备</TableHead>
              <TableHead className="w-16 text-center">抓拍</TableHead>
              <TableHead className="w-[130px]">预警时间</TableHead>
              <TableHead className="w-[140px]">处理信息</TableHead>
              <TableHead className="w-[110px]">状态</TableHead>
              <TableHead className="w-[120px] min-w-[120px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                  暂无数据
                </TableCell>
              </TableRow>
            ) : (
              events.map((event, index) => (
                <DeviceWarningEventRow
                  key={event.eventId}
                  event={event}
                  index={(page - 1) * pageSize + index + 1}
                  checked={selectedEventIds.has(event.eventId)}
                  onToggle={() => toggleOne(event)}
                  onRelease={onRelease}
                  onPreviewImage={setPreviewImage}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SnapshotImageModal
        data={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </>
  )
}

function DeviceWarningEventRow({
  event,
  index,
  checked,
  onToggle,
  onRelease,
  onPreviewImage,
}: {
  event: DeviceWarningEvent
  index: number
  checked: boolean
  onToggle: () => void
  onRelease: (event: DeviceWarningEvent) => void
  onPreviewImage: (data: SnapshotPreviewData) => void
}) {
  const actions = getRowActions(event)
  const content = formatWarningContent(event)
  const selectable = canSelectForBatchRelease(event)

  return (
    <TableRow>
      <TableCell>
        {selectable ? (
          <input
            type="checkbox"
            aria-label={`选择 ${event.ruleName}`}
            checked={checked}
            onChange={onToggle}
          />
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>{index}</TableCell>
      <TableCell>
        <HoverOverflowText
          className="max-w-[140px]"
          content={event.ruleName}
          ariaLabel={`规则名称：${event.ruleName}`}
        >
          <Link
            to={`/物联网IOT与预警/预警信息/设备预警信息/详情/${event.eventId}`}
            className="font-medium text-primary hover:underline"
          >
            {event.ruleName}
          </Link>
        </HoverOverflowText>
      </TableCell>
      <TableCell>
        <SeverityLevelDisplay
          severityCode={event.severityCode}
          severityName={event.severityName}
          severityColor={event.severityColor}
        />
      </TableCell>
      <TableCell>{event.warningType}</TableCell>
      <TableCell>
        <HoverOverflowText
          className="max-w-[200px]"
          ariaLabel={`预警内容/设备：${content}`}
        >
          {content}
        </HoverOverflowText>
      </TableCell>
      <TableCell className="text-center">
        {event.snapshotImageStatus === "available" ? (
          <button
            type="button"
            onClick={() =>
              onPreviewImage({
                title: `现场监控抓拍图 — ${event.ruleName}`,
                desc: `设备：${event.deviceName} | 预警时间：${event.warningTime}`,
                time: event.warningTime,
                location: `${event.warehouseName} / ${event.location}`,
              })
            }
            className="inline-flex items-center justify-center p-1 rounded hover:bg-muted text-primary cursor-pointer transition-colors"
            title="查看抓拍大图"
          >
            <ImageIcon className="size-4" />
          </button>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        <TableDateTimeCell value={event.warningTime} plain />
      </TableCell>
      <TableCell>
        <TableProcessedInfoCell
          processedBy={event.processedBy}
          processedTime={event.processedTime}
        />
      </TableCell>
      <TableCell>
        <WarningStatusBadge event={event} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {actions.includes("release") && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0"
              onClick={() => onRelease(event)}
            >
              解除
            </Button>
          )}
          <Link
            to={`/物联网IOT与预警/预警信息/设备预警信息/详情/${event.eventId}`}
            className="text-sm text-primary hover:underline"
          >
            详情
          </Link>
        </div>
      </TableCell>
    </TableRow>
  )
}
